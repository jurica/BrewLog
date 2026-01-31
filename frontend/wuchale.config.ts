// @ts-check
import { adapter as svelte } from "@wuchale/svelte";
import { defineConfig } from "wuchale";

export const locales = ["en", "de"] as const;

export default defineConfig({
  locales: locales,
  adapters: {
    main: svelte({ loader: "svelte" })
  }
});
