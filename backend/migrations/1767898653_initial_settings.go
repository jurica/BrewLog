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

		return nil
	}, func(app core.App) error {
		return nil
	})
}
