// Package services holds the Go services bound to the frontend via Wails.
package services

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/shellhub-io/connect/internal/proxy"
)

// InstanceService is bound to the frontend. It validates ShellHub instances and
// controls which instance the reverse proxy serves into the iframe.
type InstanceService struct {
	proxy *proxy.Proxy
}

// NewInstanceService wires the service to the running reverse proxy.
func NewInstanceService(p *proxy.Proxy) *InstanceService {
	return &InstanceService{proxy: p}
}

// Endpoints mirrors the ShellHub /info "endpoints" object.
type Endpoints struct {
	API string `json:"api"`
	SSH string `json:"ssh"`
}

// Info is the shape returned by a ShellHub instance's /info endpoint.
type Info struct {
	Version   string    `json:"version"`
	Endpoints Endpoints `json:"endpoints"`
}

// Validate fetches {baseURL}/info server-side (no CORS, unlike the old renderer
// fetch) and verifies the response matches the ShellHub schema. Replaces the
// fetch('/info') calls in Login.vue / NewInstanceDialog.vue.
func (s *InstanceService) Validate(baseURL string) (Info, error) {
	var info Info

	base := strings.TrimRight(baseURL, "/")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, base+"/info", nil)
	if err != nil {
		return info, err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return info, fmt.Errorf("instance unreachable: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return info, fmt.Errorf("unexpected status %d from /info", resp.StatusCode)
	}

	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return info, fmt.Errorf("response is not valid ShellHub /info JSON: %w", err)
	}

	if info.Version == "" || info.Endpoints.API == "" || info.Endpoints.SSH == "" {
		return info, fmt.Errorf("response does not match the expected ShellHub /info schema")
	}

	return info, nil
}

// SetActiveInstance points the reverse proxy at the given instance so the iframe
// loads it. Returns the loopback URL the iframe should use.
func (s *InstanceService) SetActiveInstance(baseURL string) (string, error) {
	if err := s.proxy.SetTarget(baseURL); err != nil {
		return "", err
	}
	return s.proxy.URL(), nil
}

// ProxyURL returns the loopback URL the iframe should load for the active instance.
func (s *InstanceService) ProxyURL() string {
	return s.proxy.URL()
}
