import { test, expect } from "@playwright/test";

test('1. navigate to bags', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Bags' }).click();
    await expect(page.getByRole('heading', { name: 'Bags' })).toBeVisible();
    await expect(page.getByText('No bags yet')).toBeVisible();
});

test('2. add bag and edit', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Bags' }).click();
    await page.getByRole('button', { name: 'New Bag' }).click();
    await page.getByText('Select a bean...').click();
    await page.getByRole('option', { name: 'Bean 1 (Roaster 1)' }).click();
    await page.getByRole('textbox', { name: 'Roast Date' }).fill('2026-01-01');
    await page.getByRole('spinbutton', { name: 'Price' }).fill('8.90');
    await page.getByRole('button', { name: 'Create Bag' }).click();
    await expect(page).not.toHaveURL(/new/);
    await expect(page.getByText('Bean 1')).toBeVisible();
    await expect(page.getByText('Roaster 1')).toBeVisible();
    await expect(page.getByText('Bag Details')).toBeVisible();
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('spinbutton', { name: 'Initial Weight (g) *' }).click();
    await page.getByRole('spinbutton', { name: 'Initial Weight (g) *' }).fill('500');
    await page.getByRole('button', { name: 'Update Bag' }).click();
    await expect(page).not.toHaveURL(/edit/);
    await expect(page.getByText('500g')).toBeVisible();
});

test('3. add bag 2', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Bags' }).click();
    await page.getByRole('button', { name: 'New Bag' }).click();
    await page.getByText('Select a bean...').click();
    await page.getByRole('option', { name: 'Bean 2 (Roaster 2)' }).click();
    await page.getByRole('textbox', { name: 'Roast Date' }).fill('2026-01-01');
    await page.getByRole('textbox', { name: 'Opened Date' }).fill('2026-01-02');
    await page.getByRole('spinbutton', { name: 'Price' }).fill('10.95');
    await page.getByRole('button', { name: 'Create Bag' }).click();
    await expect(page).not.toHaveURL(/new/);
    await expect(page.getByText('Bean 2')).toBeVisible();
    await expect(page.getByText('Roaster 2')).toBeVisible();
    await expect(page.getByText('Bag Details')).toBeVisible();
});

test('4. add bean 3', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Bags' }).click();
    await page.getByRole('button', { name: 'New Bag' }).click();
    await page.getByText('Select a bean...').click();
    await page.getByRole('option', { name: 'Bean 3 (Roaster 3)' }).click();
    await page.getByRole('textbox', { name: 'Roast Date' }).fill('2026-01-01');
    await page.getByRole('textbox', { name: 'Opened Date' }).fill('2026-01-02');
    await page.getByRole('textbox', { name: 'Finished Date' }).fill('2026-01-04');
    await page.getByRole('spinbutton', { name: 'Price' }).fill('7.89');
    await page.getByRole('button', { name: 'Create Bag' }).click();
    await expect(page).not.toHaveURL(/new/);
    await expect(page.getByText('Bean 3')).toBeVisible();
    await expect(page.getByText('Roaster 3')).toBeVisible();
    await expect(page.getByText('Bag Details')).toBeVisible();
});

test('5. list view', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Bags' }).click();
    await expect(page.locator('[data-test-id="tg_bagfilter"]')).toMatchAriaSnapshot(`
    - group:
      - radio "Unopened"
      - radio "Opened" [checked] [disabled]
      - radio "Finished"
      - radio "All"
    `);
    await expect(page.locator('[data-test-id="card-Bean 2"]')).toBeVisible();
    await page.getByRole('radio', { name: 'Unopened' }).click();
    await expect(page.locator('[data-test-id="tg_bagfilter"]')).toMatchAriaSnapshot(`
    - group:
      - radio "Unopened" [checked] [disabled]
      - radio "Opened"
      - radio "Finished"
      - radio "All"
    `);
    await expect(page.locator('[data-test-id="card-Bean 1"]')).toBeVisible();
    await page.getByRole('radio', { name: 'Finished' }).click();
    await expect(page.locator('[data-test-id="tg_bagfilter"]')).toMatchAriaSnapshot(`
    - group:
      - radio "Unopened"
      - radio "Opened"
      - radio "Finished" [checked] [disabled]
      - radio "All"
    `);
    await expect(page.locator('[data-test-id="card-Bean 3"]')).toBeVisible();
    await page.getByRole('radio', { name: 'All' }).click();
    await expect(page.locator('[data-test-id="tg_bagfilter"]')).toMatchAriaSnapshot(`
    - group:
      - radio "Unopened"
      - radio "Opened"
      - radio "Finished"
      - radio "All" [checked] [disabled]
    `);
    await expect(page.locator('[data-test-id="card-Bean 1"]')).toBeVisible();
    await expect(page.locator('[data-test-id="card-Bean 2"]')).toBeVisible();
    await expect(page.locator('[data-test-id="card-Bean 3"]')).toBeVisible();
});
