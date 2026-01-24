import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { router } from "sv-router/vite-plugin";
import { wuchale } from "@wuchale/vite-plugin";
import path from "path";

export default defineConfig(({ command }) => {
  if (command === "build" && process.env.npm_package_version === undefined) {
    console.log("ERROR: __APP_VERSION__ is undefined, cancel build");
    process.exit(1);
  }

  return {
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
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  };
});
