import { adapter as svelte } from "@wuchale/svelte";
import { defineConfig } from "wuchale";
import { locales } from "./src/lib/locales.ts";

export default defineConfig({
  locales: locales,
  adapters: {
    main: svelte({ loader: "svelte" })
  }
});
