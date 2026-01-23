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
				app.pb.Logger().Error("failed to find collection '_superusers'")
				return
			}
			superuser := core.NewRecord(superusers)
			superuser.Set("email", "superuser@brewlog.local")
			superuser.Set("password", "superuser")
			err = app.pb.Save(superuser)
			if err != nil {
				app.pb.Logger().Error("failed to create superuser")
				return
			}

			users, err := app.pb.FindCollectionByNameOrId("users")
			if err != nil {
				app.pb.Logger().Error("failed to find collection 'users'")
				return
			}
			user := core.NewRecord(users)
			user.Set("email", "user@brewlog.local")
			user.Set("password", "useruser")
			user.Set("firstname", "Firstname")
			user.Set("lastname", "Lastname")
			err = app.pb.Save(user)
			if err != nil {
				app.pb.Logger().Error("failed to create user")
				return
			}

			app.pb.Logger().Info("created test users")
		},
	})
}
