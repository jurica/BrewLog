package main

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/spf13/cobra"
)

func (app *application) registerCustomCommands() {
	app.pb.RootCmd.AddCommand(&cobra.Command{
		Use: "createTestUsers",
		Run: func(cmd *cobra.Command, args []string) {
			superusers, err := app.pb.FindCollectionByNameOrId(core.CollectionNameSuperusers)
			if err != nil {
				return
			}
			superuser := core.NewRecord(superusers)
			superuser.Set("email", "superuser@brewlog.local")
			superuser.Set("password", "superuser")
			app.pb.Save(superuser)

			users, err := app.pb.FindCollectionByNameOrId("users")
			if err != nil {
				return
			}
			user := core.NewRecord(users)
			user.Set("email", "user@brewlog.local")
			user.Set("password", "useruser")
			user.Set("firstname", "Firstname")
			user.Set("lastname", "Lastname")
			app.pb.Save(user)
		},
	})
}
