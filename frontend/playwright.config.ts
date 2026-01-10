import { defineConfig, devices } from '@playwright/test';
import { existsSync } from "fs";

const chromiumPath = existsSync("/usr/bin/chromium")
  ? "/usr/bin/chromium"
  : undefined;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8090',
    trace: 'on-first-retry',
  },

  projects: [
    {name: 'setup', testMatch: /fixtures\.ts/,

      use: {
        ...devices['Desktop Chrome'],
        launchOptions: chromiumPath ? { executablePath: "/usr/bin/chromium" } : {},
      },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'test-results/auth.json',
        launchOptions: chromiumPath ? { executablePath: "/usr/bin/chromium" } : {},
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  // },
});
