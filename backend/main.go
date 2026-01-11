package main

import (
	_ "embed"
	"log"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "BrewLog/migrations"
)

//go:embed VERSION
var version string

type application struct {
    pb  *pocketbase.PocketBase
}

func newApplication() *application {
    return &application {
        pb: pocketbase.New(),
    }
}

func main() {
    app := newApplication()
	app.pb.RootCmd.Version = strings.TrimSpace(version)

    // loosely check if it was executed using "go run"
    isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())
	// isGoRun = true

    migratecmd.MustRegister(app.pb, app.pb.RootCmd, migratecmd.Config{
        // enable auto creation of migration files when making collection changes in the Dashboard
        // (the isGoRun check is to enable it only during development)
        Automigrate: isGoRun,
    })

    app.mountFs()
	app.registerCustomCommands()

    log.Fatal(app.pb.Start())
}
