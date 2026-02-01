import { test as setup, expect } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await login(page);
  await page.context().storageState({ path: "test-results/auth.json" });
});

async function login(page) {
  await page.goto("./logout");
  await expect(page).toHaveURL(/login/);
  await expect(page).toHaveTitle(/BrewLog|Login/i);
  await expect(page.locator("body")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
  await page.getByRole("textbox", { name: "Email" }).fill("user@brewlog.local");
  await page.getByRole("textbox", { name: "Password" }).fill("useruser");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByRole("button", { name: "FL Firstname Lastname user@" })
  ).toBeVisible();
}
