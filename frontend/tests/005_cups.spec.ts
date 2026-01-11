import { test, expect } from "@playwright/test";

test('1. navigate to cups', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Cups' }).click();
    await expect(page.getByRole('heading', { name: 'Cups' })).toBeVisible();
    await expect(page.getByText('No cups yet')).toBeVisible();
});

test('2. add cup and edit', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Cups' }).click();
    await page.getByRole('button', { name: 'New Cup' }).click();
    await page.getByText('Select a bag...').click();
    await page.getByRole('option', { name: 'Bean 1 Roaster' }).click();
    await page.getByRole('spinbutton', { name: 'Coffee (g)' }).fill('7');
    await page.locator('#yield_ml').fill('25');
    await page.getByRole('spinbutton', { name: 'Water Temp (°C)' }).fill('90');
    await page.getByRole('spinbutton', { name: 'Brew Time (s)' }).fill('30');
    await page.getByRole('button', { name: 'Create Cup' }).click();
    await expect(page).not.toHaveURL(/new/);
    await expect(page.getByText('Bean 1')).toBeVisible();
    await expect(page.getByText('Roaster 1')).toBeVisible();
    await expect(page.getByText('No notes recorded')).toBeVisible();
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('spinbutton', { name: 'Rating (1-5)' }).fill('4.5');
    await page.getByRole('button', { name: 'Update Cup' }).click();
    await expect(page).not.toHaveURL(/edit/);
    await expect(page.getByText('Bean 1')).toBeVisible();
    await expect(page.getByText('Roaster 1')).toBeVisible();
    await expect(page.getByText('Brew Details')).toBeVisible();
    await expect(page.getByText('4.5/5')).toBeVisible();
});

test('3. add cup 2', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Cups' }).click();
    await page.getByRole('button', { name: 'New Cup' }).click();
    await page.getByText('Select a bag...').click();
    await page.getByRole('option', { name: 'Bean 2 Roaster' }).click();
    await page.getByRole('spinbutton', { name: 'Coffee (g)' }).fill('7');
    await page.locator('#yield_ml').fill('25');
    await page.getByRole('spinbutton', { name: 'Water Temp (°C)' }).fill('90');
    await page.getByRole('spinbutton', { name: 'Brew Time (s)' }).fill('30');
    await page.getByRole('button', { name: 'Create Cup' }).click();
    await expect(page).not.toHaveURL(/new/);
    await expect(page.getByText('Bean 2')).toBeVisible();
    await expect(page.getByText('Roaster 2')).toBeVisible();
});

test('4. add cup 3', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Cups' }).click();
    await page.getByRole('button', { name: 'New Cup' }).click();
    await page.getByText('Select a bag...').click();
    await page.getByRole('option', { name: 'Bean 3 Roaster' }).click();
    await page.getByRole('spinbutton', { name: 'Coffee (g)' }).fill('7');
    await page.locator('#yield_ml').fill('25');
    await page.getByRole('spinbutton', { name: 'Water Temp (°C)' }).fill('90');
    await page.getByRole('spinbutton', { name: 'Brew Time (s)' }).fill('30');
    await page.getByRole('button', { name: 'Create Cup' }).click();
    await expect(page).not.toHaveURL(/new/);
    await expect(page.getByText('Bean 3')).toBeVisible();
    await expect(page.getByText('Roaster 3')).toBeVisible();
});

test('5. list view', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Cups' }).click();
    await expect(page.locator('[data-test-id="card-Bean 1"]')).toBeVisible();
    await expect(page.locator('[data-test-id="card-Bean 2"]')).toBeVisible();
    await expect(page.locator('[data-test-id="card-Bean 3"]')).toBeVisible();
});
