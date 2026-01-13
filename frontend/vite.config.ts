import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { router } from "sv-router/vite-plugin";
import { wuchale } from "@wuchale/vite-plugin";
import path from "path";
import fs from "fs";
import lingo from "vite-plugin-lingo";

const version = fs.readFileSync(path.resolve(__dirname, "VERSION"), "utf-8").trim();

// https://vite.dev/config/
export default defineConfig({
  plugins: [wuchale(), tailwindcss(), svelte(), router(), lingo({
    route: "/_translations",
    localesDir: "./src/locales",
  })],
  build: {
    outDir: "../backend/dist",
  },
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
      $src: path.resolve("./src"),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
});
