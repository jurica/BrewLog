import { test, expect } from "@playwright/test";

test("1. add more bags and cups for pagination", async ({ page }) => {
  // We need at least 10 cups for pagination (9 per page = 2 pages)
  // Currently have 3 cups from 005_cups.spec.ts
  // Add 7 more bags and cups

  await page.goto("./");

  // Add 7 cups
  for (let i = 0; i < 7; i++) {
    await page.getByRole("button", { name: "Cups", exact: true }).click();
    await page.getByRole("button", { name: "New Cup" }).click();
    await page.getByText("Select a bag...").click();
    await page.getByRole("option").first().click();

    await page.getByRole("spinbutton", { name: "Coffee (g)" }).fill("7");
    await page.locator("#yield_ml").fill("25");
    await page.getByRole("spinbutton", { name: "Water Temp (°C)" }).fill("90");
    await page.getByRole("spinbutton", { name: "Brew Time (s)" }).fill("30");
    await page.getByRole("button", { name: "Create Cup" }).click();
    await expect(page).not.toHaveURL(/new/);
  }
});

test("2. locale persistence", async ({ page }) => {
  await page.goto("./");

  // Navigate to account page
  await page
    .getByRole("button", { name: "FL Firstname Lastname user@" })
    .click();
  await page.getByRole("menuitem", { name: "Account" }).click();

  // Wait for page to load
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();

  // Find the locale selector trigger by aria-label
  const localeSelector = page.getByRole("button", { name: "Select a value" });
  await expect(localeSelector).toBeVisible();

  // Get current locale
  const currentLocale = await localeSelector.textContent();
  const targetLocale = currentLocale?.includes("English")
    ? "German"
    : "English";

  // Change locale
  await localeSelector.click();
  await page.getByRole("option", { name: targetLocale }).click();

  // Verify the change
  await expect(localeSelector).toHaveText(targetLocale);

  // Wait for persistence (debounced at 1000ms)
  await page.waitForTimeout(1500);

  // Reload the page
  await page.reload();

  // Navigate back to account page
  await page
    .getByRole("button", { name: "FL Firstname Lastname user@" })
    .click();
  await page.getByRole("menuitem", { name: "Account" }).click();

  // Verify locale persisted
  await expect(localeSelector).toHaveText(targetLocale);

  // Change back to original locale for consistency
  await localeSelector.click();
  await page
    .getByRole("option", {
      name: currentLocale?.includes("English") ? "English" : "German"
    })
    .click();
  await page.waitForTimeout(1500);
});

test("3. bags filter persistence", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Bags" }).click();

  // Get the current filter state
  const filterGroup = page.locator('[data-test-id="tg_bagfilter"]');

  // Change to a different filter (use "Unopened")
  await page.getByRole("radio", { name: "Unopened", exact: true }).click();
  await expect(filterGroup).toMatchAriaSnapshot(`
    - group:
      - radio "Unopened" [checked] [disabled]
      - radio "Opened"
      - radio "Finished"
      - radio "All"
    `);

  // Wait for persistence
  await page.waitForTimeout(1500);

  // Reload the page
  await page.reload();

  // Verify filter is still "Unopened"
  await expect(filterGroup).toMatchAriaSnapshot(`
    - group:
      - radio "Unopened" [checked] [disabled]
      - radio "Opened"
      - radio "Finished"
      - radio "All"
    `);

  // Change back to "Opened" for other tests
  await page.getByRole("radio", { name: "Opened", exact: true }).click();
  await page.waitForTimeout(1500);
});

test("4. bags view persistence", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Bags" }).click();

  // Initially check if we're in grid or table view and switch to the opposite
  const tableElement = page.getByRole("table");
  const isTableView = await tableElement.isVisible().catch(() => false);

  if (isTableView) {
    // Currently in table view, switch to grid
    await page.getByRole("button", { name: "More Options" }).click();
    await page.getByRole("menuitem", { name: "Grid" }).click();

    // Verify grid view is shown (wait for cards to appear)
    await expect(page.locator('[data-test-id^="card-"]').first()).toBeVisible();

    // Wait for persistence
    await page.waitForTimeout(1500);

    // Reload the page
    await page.reload();

    // Verify view is still grid
    await expect(page.locator('[data-test-id^="card-"]').first()).toBeVisible();

    // Switch back to table view for consistency
    await page.getByRole("button", { name: "More Options" }).click();
    await page.getByRole("menuitem", { name: "Table" }).click();
    await page.waitForTimeout(1500);
  } else {
    // Currently in grid view, switch to table
    await page.getByRole("button", { name: "More Options" }).click();
    await page.getByRole("menuitem", { name: "Table" }).click();

    // Verify table view is shown
    await expect(tableElement).toBeVisible();

    // Wait for persistence
    await page.waitForTimeout(1500);

    // Reload the page
    await page.reload();

    // Verify view is still table
    await expect(tableElement).toBeVisible();

    // Switch back to grid view for consistency
    await page.getByRole("button", { name: "More Options" }).click();
    await page.getByRole("menuitem", { name: "Grid" }).click();
    await page.waitForTimeout(1500);
  }
});

test("5. cups page persistence", async ({ page }) => {
  // Now we have 10 cups total (3 from 005_cups + 7 from test 1)
  // This creates 2 pages (9 per page)

  await page.goto("./");
  await page.getByRole("button", { name: "Cups" }).click();

  // Wait for cups to load
  await expect(page.locator('[data-test-id^="card-"]').first()).toBeVisible();

  // Verify we're on page 1 initially
  const page1Link = page.getByRole("button", { name: "Page 1" });
  await expect(page1Link).toHaveAttribute("data-active", "true");

  // Navigate to page 2
  const nextButton = page.getByRole("button", { name: "Next" });
  await nextButton.click();

  // Verify we're on page 2
  const page2Link = page.getByRole("button", { name: "Page 2" });
  await expect(page2Link).toHaveAttribute("data-active", "true");

  // Wait for persistence (debounced at 1000ms)
  await page.waitForTimeout(1500);

  // Reload the page
  await page.reload();

  // Verify we're still on page 2 after reload
  await expect(page2Link).toHaveAttribute("data-active", "true");

  // Navigate back to page 1 for consistency
  const page1LinkAfterReload = page.getByRole("button", { name: "Page 1" });
  await page1LinkAfterReload.click();
  await page.waitForTimeout(1500);
});
