import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "fs";

const chromiumPath = existsSync("/usr/bin/chromium")
  ? "/usr/bin/chromium"
  : undefined;

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:8090",
    trace: "on-first-retry"
  },

  projects: [
    {
      name: "setup",
      testMatch: /000_fixtures\.ts/,

      use: {
        ...devices["Desktop Chrome"],
        launchOptions: chromiumPath
          ? { executablePath: "/usr/bin/chromium" }
          : {}
      }
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "test-results/auth.json",
        launchOptions: chromiumPath
          ? { executablePath: "/usr/bin/chromium" }
          : {}
      }
    }
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  webServer: {
    command: "../backend/startForTests.sh",
    url: "http://localhost:8090",
    reuseExistingServer: !process.env.CI
  }
});
