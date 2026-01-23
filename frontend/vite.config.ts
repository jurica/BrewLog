import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { router } from "sv-router/vite-plugin";
import { wuchale } from "@wuchale/vite-plugin";
import path from "path";
import fs from "fs";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  let appVersion: string;
  if (isDev) {
    appVersion = "dev";
  } else {
    appVersion = "v" + process.env.npm_package_version;
    fs.writeFileSync("../backend/VERSION", process.env.npm_package_version);
  }
  appVersion = JSON.stringify(appVersion);

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
      __APP_VERSION__: appVersion
    }
  };
});
