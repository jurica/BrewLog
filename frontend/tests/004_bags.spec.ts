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
    await page.locator('[data-test-id="btn-Roast Date"]').click();
    await page.getByLabel('Select a year').selectOption('2025');
    await page.getByLabel('Select a month').selectOption('12');
    await page.getByRole('button', { name: 'Monday, December 15,' }).click();
    await expect(page.getByRole('application', { name: 'Event Dec' })).not.toBeVisible();
    await expect(page.locator('[data-test-id="btn-Roast Date"]')).toContainText('12/15/2025');
    await page.locator('[data-test-id="btn-Purchase Date"]').click();
    await page.getByLabel('Select a year').selectOption('2025');
    await page.getByLabel('Select a month').selectOption('12');
    await page.getByRole('button', { name: 'Tuesday, December 16,' }).click();
    await expect(page.getByRole('application', { name: 'Event Dec' })).not.toBeVisible();
    await expect(page.locator('[data-test-id="btn-Purchase Date"]')).toContainText('12/16/2025');
    await page.getByRole('spinbutton', { name: 'Price' }).fill('8.90');
    await page.getByRole('button', { name: 'Create Bag' }).click();
    await expect(page).not.toHaveURL(/new/);
    await expect(page.getByText('Bean 1')).toBeVisible();
    await expect(page.getByText('Roaster 1')).toBeVisible();
    await expect(page.getByText('Bag Details')).toBeVisible();
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('[data-test-id="btn-Roast Date"]')).toContainText('12/15/2025');
    await expect(page.locator('[data-test-id="btn-Purchase Date"]')).toContainText('12/16/2025');
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
    await page.locator('[data-test-id="btn-Roast Date"]').click();
    await page.getByLabel('Select a year').selectOption('2025');
    await page.getByLabel('Select a month').selectOption('12');
    await page.getByRole('button', { name: 'Monday, December 15,' }).click();
    await expect(page.getByRole('application', { name: 'Event Dec' })).not.toBeVisible();
    await expect(page.locator('[data-test-id="btn-Roast Date"]')).toContainText('12/15/2025');
    await page.locator('[data-test-id="btn-Purchase Date"]').click();
    await page.getByLabel('Select a year').selectOption('2025');
    await page.getByLabel('Select a month').selectOption('12');
    await page.getByRole('button', { name: 'Tuesday, December 16,' }).click();
    await expect(page.getByRole('application', { name: 'Event Dec' })).not.toBeVisible();
    await expect(page.locator('[data-test-id="btn-Purchase Date"]')).toContainText('12/16/2025');
    await page.locator('[data-test-id="btn-Opened Date"]').click();
    await page.getByLabel('Select a year').selectOption('2025');
    await page.getByLabel('Select a month').selectOption('12');
    await page.getByRole('button', { name: 'Wednesday, December 17,' }).click();
    await expect(page.getByRole('application', { name: 'Event Dec' })).not.toBeVisible();
    await expect(page.locator('[data-test-id="btn-Opened Date"]')).toContainText('12/17/2025');
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
    await page.locator('[data-test-id="btn-Roast Date"]').click();
    await page.getByLabel('Select a year').selectOption('2025');
    await page.getByLabel('Select a month').selectOption('12');
    await page.getByRole('button', { name: 'Monday, December 15,' }).click();
    await expect(page.getByRole('application', { name: 'Event Dec' })).not.toBeVisible();
    await expect(page.locator('[data-test-id="btn-Roast Date"]')).toContainText('12/15/2025');
    await page.locator('[data-test-id="btn-Opened Date"]').click();
    await page.getByLabel('Select a year').selectOption('2025');
    await page.getByLabel('Select a month').selectOption('12');
    await page.getByRole('button', { name: 'Wednesday, December 17,' }).click();
    await expect(page.getByRole('application', { name: 'Event Dec' })).not.toBeVisible();
    await expect(page.locator('[data-test-id="btn-Opened Date"]')).toContainText('12/17/2025');
    await page.locator('[data-test-id="btn-Purchase Date"]').click();
    await page.getByLabel('Select a year').selectOption('2025');
    await page.getByLabel('Select a month').selectOption('12');
    await page.getByRole('button', { name: 'Tuesday, December 16,' }).click();
    await expect(page.getByRole('application', { name: 'Event Dec' })).not.toBeVisible();
    await expect(page.locator('[data-test-id="btn-Purchase Date"]')).toContainText('12/16/2025');
    await page.locator('[data-test-id="btn-Finished Date"]').click();
    await page.getByLabel('Select a year').selectOption('2025');
    await page.getByLabel('Select a month').selectOption('12');
    await page.getByRole('button', { name: 'Monday, December 29,' }).click();
    await expect(page.getByRole('application', { name: 'Event Dec' })).not.toBeVisible();
    await expect(page.locator('[data-test-id="btn-Finished Date"]')).toContainText('12/29/2025');
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
