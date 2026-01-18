import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { router } from "sv-router/vite-plugin";
import { wuchale } from "@wuchale/vite-plugin";
import path from "path";
import fs from "fs";

const version = fs
  .readFileSync(path.resolve(__dirname, "VERSION"), "utf-8")
  .trim();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    wuchale(),
    tailwindcss(),
    svelte(),
    router({
      allLazy: true
    })
  ],
  build: {
    outDir: "../backend/dist"
  },
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib")
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(version)
  }
});
