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
	// Start the reverse proxy that serves the active ShellHub instance into the
	// iframe (strips frame-blocking headers, carries the terminal websocket).
	px, err := proxy.New()
	if err != nil {
		log.Fatalf("failed to start reverse proxy: %v", err)
	}

	app := application.New(application.Options{
		Name:        "ShellHub",
		Description: "ShellHub Desktop",
		Services: []application.Service{
			application.NewService(services.NewInstanceService(px)),
			application.NewService(&services.SSHService{}),
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
