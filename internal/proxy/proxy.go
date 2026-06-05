// Package proxy implements a dynamic-target reverse proxy that runs on a local
// loopback port. The desktop frontend embeds the active ShellHub instance in an
// <iframe> pointing at this proxy instead of loading the remote instance
// directly. This replaces two things Electron used to provide:
//
//   - Header rewriting (Electron's session.webRequest.onHeadersReceived): the
//     proxy strips X-Frame-Options / Content-Security-Policy so the remote UI can
//     be embedded in an iframe, which the Wails asset server can't do.
//   - WebSocket transport for the SSH terminal: httputil.ReverseProxy forwards
//     the Upgrade handshake transparently, which the Wails asset server (a WebKit
//     custom-scheme handler on Linux) cannot.
package proxy

import (
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"sync/atomic"
)

// Proxy is a reverse proxy whose upstream target can be swapped at runtime when
// the user selects a different ShellHub instance.
type Proxy struct {
	target atomic.Pointer[url.URL]
	addr   string
}

// New starts the reverse proxy on an ephemeral loopback port and returns it. The
// proxy has no target until SetTarget is called; requests before that get 503.
func New() (*Proxy, error) {
	p := &Proxy{}

	rp := &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			t := p.target.Load()
			if t == nil {
				return
			}
			r.SetURL(t)
			// Present the upstream's own Host so virtual-hosted instances and
			// TLS SNI resolve correctly.
			r.Out.Host = t.Host
			r.SetXForwarded()
		},
		ModifyResponse: func(resp *http.Response) error {
			// Strip headers that would block embedding the instance in an iframe.
			resp.Header.Del("X-Frame-Options")
			resp.Header.Del("Content-Security-Policy")
			resp.Header.Del("Content-Security-Policy-Report-Only")
			return nil
		},
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if p.target.Load() == nil {
			http.Error(w, "no active instance", http.StatusServiceUnavailable)
			return
		}
		rp.ServeHTTP(w, r)
	})

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return nil, err
	}
	p.addr = ln.Addr().String()

	server := &http.Server{Handler: handler}
	go server.Serve(ln) //nolint:errcheck // serves until process exit

	return p, nil
}

// SetTarget points the proxy at a new upstream instance (e.g. https://cloud.shellhub.io).
func (p *Proxy) SetTarget(raw string) error {
	u, err := url.Parse(raw)
	if err != nil {
		return err
	}
	p.target.Store(u)
	return nil
}

// URL is the loopback address the frontend iframe should load.
func (p *Proxy) URL() string {
	return "http://" + p.addr + "/"
}
