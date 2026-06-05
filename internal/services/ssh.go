package services

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v3/pkg/application"
	"golang.org/x/crypto/ssh"
)

// SSHService is a minimal, ssh-agent-style bridge between the embedded ShellHub
// web UI and the user's local SSH keys.
//
// SECURITY: the private key material never crosses into the webview. The web UI
// can list public keys freely, but any operation that uses a private key (Sign)
// is gated behind a native consent dialog. This mirrors how ssh-agent / 1Password
// expose keys: callers get signatures, never the key itself.
type SSHService struct{}

// PublicKey describes a key found in ~/.ssh, safe to expose to the frontend.
type PublicKey struct {
	// Name is the key file name without the .pub suffix (e.g. "id_ed25519").
	Name string `json:"name"`
	// Type is the key algorithm (e.g. "ssh-ed25519").
	Type string `json:"type"`
	// Fingerprint is the SHA256 fingerprint.
	Fingerprint string `json:"fingerprint"`
	// Comment is the trailing comment in the .pub file (often user@host).
	Comment string `json:"comment"`
	// AuthorizedKey is the full public key in authorized_keys format.
	AuthorizedKey string `json:"authorizedKey"`
}

func sshDir() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, ".ssh"), nil
}

// ListPublicKeys reads ~/.ssh and returns metadata for every *.pub key. Only
// public material is exposed.
func (s *SSHService) ListPublicKeys() ([]PublicKey, error) {
	dir, err := sshDir()
	if err != nil {
		return nil, err
	}

	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return []PublicKey{}, nil
		}
		return nil, err
	}

	keys := make([]PublicKey, 0, len(entries))
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".pub") {
			continue
		}

		data, err := os.ReadFile(filepath.Join(dir, e.Name()))
		if err != nil {
			continue
		}

		pub, comment, _, _, err := ssh.ParseAuthorizedKey(data)
		if err != nil {
			continue
		}

		keys = append(keys, PublicKey{
			Name:          strings.TrimSuffix(e.Name(), ".pub"),
			Type:          pub.Type(),
			Fingerprint:   ssh.FingerprintSHA256(pub),
			Comment:       comment,
			AuthorizedKey: strings.TrimSpace(string(ssh.MarshalAuthorizedKey(pub))),
		})
	}

	return keys, nil
}

// Sign signs base64-encoded data with the private key named keyName (e.g.
// "id_ed25519"), after the user approves a native consent dialog. The signature
// is returned base64-encoded; the private key never leaves the Go process.
func (s *SSHService) Sign(keyName, dataB64 string) (string, error) {
	if !confirmConsent(keyName) {
		return "", fmt.Errorf("signing request denied by user")
	}

	data, err := base64.StdEncoding.DecodeString(dataB64)
	if err != nil {
		return "", fmt.Errorf("invalid base64 payload: %w", err)
	}

	dir, err := sshDir()
	if err != nil {
		return "", err
	}

	keyBytes, err := os.ReadFile(filepath.Join(dir, filepath.Base(keyName)))
	if err != nil {
		return "", fmt.Errorf("cannot read private key %q: %w", keyName, err)
	}

	signer, err := ssh.ParsePrivateKey(keyBytes)
	if err != nil {
		// Encrypted keys would need a passphrase prompt; out of scope for now.
		return "", fmt.Errorf("cannot parse private key (encrypted keys not yet supported): %w", err)
	}

	sig, err := signer.Sign(rand.Reader, data)
	if err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(sig.Blob), nil
}

// confirmConsent shows a blocking native dialog asking the user to authorise use
// of a private key. Returns true only if the user explicitly approves.
func confirmConsent(keyName string) bool {
	approved := false

	dialog := application.Get().Dialog.Question()
	dialog.SetTitle("Authorise SSH key use")
	dialog.SetMessage(fmt.Sprintf(
		"The ShellHub web interface is requesting to sign data with your private key %q.\n\nAllow this?",
		keyName,
	))

	allow := dialog.AddButton("Allow")
	allow.OnClick(func() { approved = true })

	deny := dialog.AddButton("Deny")
	deny.SetAsCancel()
	deny.OnClick(func() { approved = false })

	dialog.SetDefaultButton(deny)
	dialog.Show()

	return approved
}
