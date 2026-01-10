package migrations

import (
	_ "embed"
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

//go:embed 1767453249_schema.json
var schemaJSON []byte

func init() {
	m.Register(func(app core.App) error {
		collections := []*core.Collection{}
		if err := json.Unmarshal(schemaJSON, &collections); err != nil {
			return err
		}

		for _, collection := range collections {
			if err := app.Save(collection); err != nil {
				return err
			}
		}

		return nil
	}, func(app core.App) error {
		for _, id := range []string{"brew_methods", "recipes", "beans", "bags", "cups"} {
			collection, err := app.FindCollectionByNameOrId(id)
			if err != nil {
				return err
			}
			if err := app.Delete(collection); err != nil {
				return err
			}
		}
		return nil
	})
}
