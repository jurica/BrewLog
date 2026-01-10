//go:build !production

package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		settings := app.Settings()
		settings.Meta.AppName = "BrewLog"
		app.Save(settings)

		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}
		superuser := core.NewRecord(superusers)
		superuser.Set("email", "superuser@brewlog.local")
		superuser.Set("password", "superuser")
		app.Save(superuser)

		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}
		user := core.NewRecord(users)
		user.Set("email", "user@brewlog.local")
		user.Set("password", "useruser")
		user.Set("firstname", "Firstname");
		user.Set("lastname", "Lastname");
		app.Save(user)

		return nil
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
