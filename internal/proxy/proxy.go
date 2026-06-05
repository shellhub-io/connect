// Package proxy implements per-instance reverse proxies that run on local
// loopback ports. The desktop frontend embeds the active ShellHub instance in an
// <iframe> pointing at one of these proxies instead of loading the remote
// instance directly. This replaces two things Electron used to provide:
//
//   - Header rewriting (Electron's session.webRequest.onHeadersReceived): each
//     proxy strips X-Frame-Options / Content-Security-Policy so the remote UI can
//     be embedded in an iframe, which the Wails asset server can't do, and drops
//     the Set-Cookie Domain attribute so cookies bind to the loopback origin.
//   - WebSocket transport for the SSH terminal: httputil.ReverseProxy forwards
//     the Upgrade handshake transparently, which the Wails asset server (a WebKit
//     custom-scheme handler on Linux) cannot.
//
// Each instance gets its OWN proxy on its OWN loopback port, i.e. its own browser
// origin. This isolates cookies/storage per instance (like Electron's per-service
// session partitions) and means a proxy's upstream target never changes, so a
// request already in flight can never be routed to a different instance.
package proxy

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strconv"
	"strings"
	"sync"
)

// externalLinkScript is injected into proxied HTML. The embedded UI runs in a
// cross-origin iframe and Wails offers no new-window hook, so target=_blank /
// window.open to a DIFFERENT origin would either silently fail or navigate the
// iframe away from the instance. This funnels those to the chrome via postMessage,
// which opens them in the system browser (see AppLayout). Same-origin links are
// left untouched.
const externalLinkScript = `<script>(function(){
function ext(u){try{var x=new URL(u,location.href);if((x.protocol==='http:'||x.protocol==='https:')&&x.origin!==location.origin){parent.postMessage({__shellhubOpenExternal:x.href},'*');return true}}catch(e){}return false}
var open=window.open;window.open=function(u){if(u&&ext(u))return null;return open.apply(this,arguments)};
document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[target="_blank"]');if(a&&a.href&&ext(a.href)){e.preventDefault();e.stopPropagation()}},true);
})();</script>`

// Manager owns one reverse proxy per ShellHub instance, keyed by scheme+host so
// reselecting the same instance reuses its port (and thus its session).
type Manager struct {
	mu      sync.Mutex
	proxies map[string]string // key (scheme://host) -> loopback URL
}

// NewManager creates an empty manager. Proxies are started lazily on first use.
func NewManager() *Manager {
	return &Manager{proxies: make(map[string]string)}
}

// Ensure returns the loopback URL that serves the given instance, starting a
// dedicated reverse proxy for it on first use. The returned URL is stable for the
// lifetime of the process, so the iframe keeps the same origin across reselects.
func (m *Manager) Ensure(raw string) (string, error) {
	target, err := url.Parse(raw)
	if err != nil {
		return "", err
	}
	// url.Parse is lax: a schemeless value like "cloud.shellhub.io" parses with an
	// empty Scheme/Host and would make every proxied request fail with an opaque
	// 502. Reject anything that isn't a usable http(s) URL up front.
	if target.Scheme != "http" && target.Scheme != "https" {
		return "", fmt.Errorf("instance URL must use http or https: %q", raw)
	}
	if target.Host == "" {
		return "", fmt.Errorf("instance URL has no host: %q", raw)
	}

	key := target.Scheme + "://" + target.Host

	m.mu.Lock()
	defer m.mu.Unlock()

	if loopback, ok := m.proxies[key]; ok {
		return loopback, nil
	}

	loopback, err := startInstanceProxy(target)
	if err != nil {
		return "", err
	}
	m.proxies[key] = loopback
	return loopback, nil
}

// startInstanceProxy starts a reverse proxy with a FIXED upstream target on an
// ephemeral loopback port and returns its base URL.
func startInstanceProxy(target *url.URL) (string, error) {
	rp := &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			r.SetURL(target)
			// Present the upstream's own Host so virtual-hosted instances and
			// TLS SNI resolve correctly.
			r.Out.Host = target.Host
			r.SetXForwarded()
		},
		ModifyResponse: func(resp *http.Response) error {
			// Strip headers that would block embedding the instance in an iframe.
			resp.Header.Del("X-Frame-Options")
			resp.Header.Del("Content-Security-Policy")
			resp.Header.Del("Content-Security-Policy-Report-Only")
			// The iframe's document origin is the loopback proxy, not the instance
			// host, so a cookie carrying an explicit Domain=<instance-host> would be
			// rejected by the browser (domain mismatch) and the session wouldn't
			// persist. Drop the Domain attribute to make such cookies host-only.
			if cookies := resp.Header["Set-Cookie"]; len(cookies) > 0 {
				for i, c := range cookies {
					cookies[i] = stripCookieDomain(c)
				}
			}
			// Inject the external-link handler into HTML documents.
			return injectHTML(resp, externalLinkScript)
		},
	}

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return "", err
	}

	server := &http.Server{Handler: rp}
	go server.Serve(ln) //nolint:errcheck // serves until process exit

	return "http://" + ln.Addr().String() + "/", nil
}

// injectHTML inserts snippet into an HTML response body (before </head>, else
// after <body>, else prepended). It transparently handles gzip; other encodings
// (br/zstd) and non-HTML responses are left untouched.
func injectHTML(resp *http.Response, snippet string) error {
	if !strings.Contains(strings.ToLower(resp.Header.Get("Content-Type")), "text/html") {
		return nil
	}

	var reader io.Reader = resp.Body
	switch strings.ToLower(resp.Header.Get("Content-Encoding")) {
	case "", "identity":
	case "gzip":
		gr, err := gzip.NewReader(resp.Body)
		if err != nil {
			return nil // not actually gzip / unreadable — skip injection
		}
		reader = gr
	default:
		return nil // can't decode (e.g. br, zstd) — skip injection
	}

	body, err := io.ReadAll(reader)
	if err != nil {
		return err
	}
	resp.Body.Close()

	body = insertSnippet(body, snippet)
	resp.Body = io.NopCloser(bytes.NewReader(body))
	resp.Header.Del("Content-Encoding")
	resp.Header.Set("Content-Length", strconv.Itoa(len(body)))
	resp.ContentLength = int64(len(body))
	return nil
}

func insertSnippet(body []byte, snippet string) []byte {
	lower := bytes.ToLower(body)
	insertAt := -1
	if i := bytes.Index(lower, []byte("</head>")); i >= 0 {
		insertAt = i
	} else if i := bytes.Index(lower, []byte("<body")); i >= 0 {
		if j := bytes.IndexByte(lower[i:], '>'); j >= 0 {
			insertAt = i + j + 1
		}
	}
	if insertAt < 0 {
		return append([]byte(snippet), body...)
	}
	out := make([]byte, 0, len(body)+len(snippet))
	out = append(out, body[:insertAt]...)
	out = append(out, snippet...)
	out = append(out, body[insertAt:]...)
	return out
}

// stripCookieDomain removes the Domain attribute from a Set-Cookie value so the
// cookie becomes host-only for the loopback proxy origin.
func stripCookieDomain(cookie string) string {
	parts := strings.Split(cookie, ";")
	kept := make([]string, 0, len(parts))
	for _, p := range parts {
		if strings.HasPrefix(strings.ToLower(strings.TrimSpace(p)), "domain=") {
			continue
		}
		kept = append(kept, p)
	}
	return strings.Join(kept, ";")
}
