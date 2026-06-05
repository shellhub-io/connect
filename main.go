package main

import (
	"embed"
	"log"

	"github.com/shellhub-io/connect/internal/proxy"
	"github.com/shellhub-io/connect/internal/services"
	"github.com/wailsapp/wails/v3/pkg/application"
)

// frontend/dist holds the built Vue app, embedded into the binary.
//
//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Manages per-instance reverse proxies that serve each ShellHub instance into
	// the iframe (own loopback origin each; strips frame-blocking headers, carries
	// the terminal websocket).
	px := proxy.NewManager()

	app := application.New(application.Options{
		Name:        "ShellHub",
		Description: "ShellHub Desktop",
		Services: []application.Service{
			application.NewService(services.NewInstanceService(px)),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:            "ShellHub",
		Width:            900,
		Height:           670,
		MinWidth:         600,
		MinHeight:        400,
		Frameless:        true,
		URL:              "/",
		BackgroundColour: application.NewRGB(0x1E, 0x21, 0x27),
	})

	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
