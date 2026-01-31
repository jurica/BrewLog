// @ts-check
import { adapter as svelte } from "@wuchale/svelte";
import { defineConfig } from "wuchale";
import { locales } from "./src/lib/api/collections/users";

export default defineConfig({
  locales: locales,
  adapters: {
    main: svelte({ loader: "svelte" })
  }
});
