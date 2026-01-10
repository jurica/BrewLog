package main

import (
	_ "embed"
	"log"
	"os"
	"strings"
	"encoding/json"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/spf13/cobra"

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

    app.pb.RootCmd.AddCommand(&cobra.Command{
        Use: "foo",
        Run: func(cmd *cobra.Command, args []string) {
            collection, err := app.pb.FindCollectionByNameOrId("_pb_users_auth_")
            if err != nil {
                // return err
            }

            // update collection data
            if err := json.Unmarshal([]byte(`{
                "createRule": null
            }`), &collection); err != nil {
                // return err
            }

            app.pb.Save(collection)
        },
    })

    app.mountFs()

    log.Fatal(app.pb.Start())
}
