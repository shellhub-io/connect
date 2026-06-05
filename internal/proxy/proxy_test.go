package proxy

import (
	"bytes"
	"compress/gzip"
	"io"
	"net/http"
	"strings"
	"testing"
)

func htmlResponse(body string, gzipped bool) *http.Response {
	h := http.Header{}
	h.Set("Content-Type", "text/html; charset=utf-8")
	var r io.Reader
	if gzipped {
		var buf bytes.Buffer
		gw := gzip.NewWriter(&buf)
		gw.Write([]byte(body)) //nolint:errcheck
		gw.Close()
		h.Set("Content-Encoding", "gzip")
		r = &buf
	} else {
		r = strings.NewReader(body)
	}
	return &http.Response{Header: h, Body: io.NopCloser(r)}
}

func readBody(t *testing.T, resp *http.Response) string {
	t.Helper()
	b, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("read body: %v", err)
	}
	return string(b)
}

func TestInjectHTML(t *testing.T) {
	// before </head>
	resp := htmlResponse("<html><head><title>x</title></head><body>hi</body></html>", false)
	if err := injectHTML(resp, "<script>X</script>"); err != nil {
		t.Fatalf("injectHTML: %v", err)
	}
	out := readBody(t, resp)
	if !strings.Contains(out, "<script>X</script></head>") {
		t.Errorf("snippet not injected before </head>: %q", out)
	}

	// gzipped html is decoded, injected, and Content-Encoding dropped
	resp = htmlResponse("<head></head>", true)
	if err := injectHTML(resp, "<script>X</script>"); err != nil {
		t.Fatalf("injectHTML gzip: %v", err)
	}
	if resp.Header.Get("Content-Encoding") != "" {
		t.Errorf("Content-Encoding should be dropped, got %q", resp.Header.Get("Content-Encoding"))
	}
	if out := readBody(t, resp); !strings.Contains(out, "<script>X</script>") {
		t.Errorf("snippet not injected into gzipped html: %q", out)
	}

	// non-HTML is left untouched
	h := http.Header{}
	h.Set("Content-Type", "application/json")
	resp = &http.Response{Header: h, Body: io.NopCloser(strings.NewReader(`{"a":1}`))}
	if err := injectHTML(resp, "<script>X</script>"); err != nil {
		t.Fatalf("injectHTML json: %v", err)
	}
	if out := readBody(t, resp); out != `{"a":1}` {
		t.Errorf("non-HTML body was modified: %q", out)
	}
}

func TestEnsureRejectsInvalidURLs(t *testing.T) {
	m := NewManager()
	for _, raw := range []string{"", "cloud.shellhub.io", "ftp://x", "http://"} {
		if _, err := m.Ensure(raw); err == nil {
			t.Errorf("Ensure(%q) = nil error, want error", raw)
		}
	}
}

func TestEnsureReusesProxyPerHost(t *testing.T) {
	m := NewManager()
	a, err := m.Ensure("https://cloud.shellhub.io")
	if err != nil {
		t.Fatalf("Ensure: %v", err)
	}
	// Same host (path differs) must reuse the same loopback origin.
	a2, err := m.Ensure("https://cloud.shellhub.io/foo")
	if err != nil {
		t.Fatalf("Ensure: %v", err)
	}
	if a != a2 {
		t.Errorf("same host got different proxies: %q vs %q", a, a2)
	}
	// A different host must get a distinct origin (per-instance isolation).
	b, err := m.Ensure("https://demo.shellhub.io")
	if err != nil {
		t.Fatalf("Ensure: %v", err)
	}
	if a == b {
		t.Errorf("different hosts share a proxy origin: %q", a)
	}
}

func TestStripCookieDomain(t *testing.T) {
	cases := map[string]string{
		"sid=abc; Domain=cloud.shellhub.io; Path=/; Secure": "sid=abc; Path=/; Secure",
		"sid=abc; Path=/":                                    "sid=abc; Path=/",
		"sid=abc; domain=.shellhub.io; HttpOnly":             "sid=abc; HttpOnly",
	}
	for in, want := range cases {
		if got := stripCookieDomain(in); got != want {
			t.Errorf("stripCookieDomain(%q) = %q, want %q", in, got, want)
		}
	}
}
