import { test, expect } from "@playwright/test";

test('1. navigate to roasters', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Roasters' }).click();
    await expect(page.getByRole('heading', { name: 'Roasters' })).toBeVisible();
    await expect(page.getByText('No roasters yet')).toBeVisible();
});

test('2. add roaster and edit', async ({ page }) => {
    await page.goto('./roasters');
    await expect(page.getByRole('heading', { name: 'Roasters' })).toBeVisible();
    await page.getByRole('button', { name: 'New Roaster' }).click();
    await expect(page.getByText('Create New Roaster')).toBeVisible();
    await page.getByRole('textbox', { name: 'Roaster Name *' }).fill('Roaster');
    await page.getByRole('textbox', { name: 'Website URL (Optional)' }).fill('https://www.roaster.com');
    // await page.getByRole('button', { name: 'Roaster Image (Optional)' }).setInputFiles('logo.svg');
    await page.getByRole('button', { name: 'Create Roaster' }).click();
    await expect(page.getByText('Roaster', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'https://www.roaster.com' })).toBeVisible();
    await expect(page.getByText('Roaster Details')).toBeVisible();

    await page.goto('./roasters');
    await expect(page.locator('[data-test-id="card-Roaster"]')).toBeVisible();
    await page.locator('[data-test-id="card-Roaster"]').click();
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('textbox', { name: 'Roaster Name *' }).fill('Roaster 1');
    await page.getByRole('textbox', { name: 'Website URL (Optional)' }).fill('https://www.roaster1.com');
    await page.getByRole('button', { name: 'Update Roaster' }).click();
    await expect(page.getByText('Roaster 1', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'https://www.roaster1.com' })).toBeVisible();
    await expect(page.getByText('Roaster Details')).toBeVisible();
});

test('3. add roaster 2', async ({ page }) => {
    await page.goto('./roasters');
    await expect(page.getByRole('heading', { name: 'Roasters' })).toBeVisible();
    await page.getByRole('button', { name: 'New Roaster' }).click();
    await expect(page.getByText('Create New Roaster')).toBeVisible();
    await page.getByRole('textbox', { name: 'Roaster Name *' }).fill('Roaster 2');
    await page.getByRole('textbox', { name: 'Website URL (Optional)' }).fill('https://www.roaster2.com');
    // await page.getByRole('button', { name: 'Roaster Image (Optional)' }).setInputFiles('logo.svg');
    await page.getByRole('button', { name: 'Create Roaster' }).click();
    await expect(page.getByText('Roaster 2')).toBeVisible();
    await expect(page.getByRole('link', { name: 'https://www.roaster2.com' })).toBeVisible();
    await expect(page.getByText('Roaster Details')).toBeVisible();
});

test('4. add roaster 3', async ({ page }) => {
    await page.goto('./roasters');
    await expect(page.getByRole('heading', { name: 'Roasters' })).toBeVisible();
    await page.getByRole('button', { name: 'New Roaster' }).click();
    await expect(page.getByText('Create New Roaster')).toBeVisible();
    await page.getByRole('textbox', { name: 'Roaster Name *' }).fill('Roaster 3');
    await page.getByRole('textbox', { name: 'Website URL (Optional)' }).fill('https://www.roaster3.com');
    // await page.getByRole('button', { name: 'Roaster Image (Optional)' }).setInputFiles('logo.svg');
    await page.getByRole('button', { name: 'Create Roaster' }).click();
    await expect(page.getByText('Roaster 3')).toBeVisible();
    await expect(page.getByRole('link', { name: 'https://www.roaster3.com' })).toBeVisible();
    await expect(page.getByText('Roaster Details')).toBeVisible();
});

test('5. list view', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Roasters' }).click();
    await expect(page.locator('[data-test-id="card-Roaster 1"]')).toBeVisible();
    await expect(page.locator('[data-test-id="card-Roaster 1"]').getByRole('link', { name: 'https://www.roaster1.com' })).toBeVisible();
    await expect(page.locator('[data-test-id="card-Roaster 2"]')).toBeVisible();
    await expect(page.locator('[data-test-id="card-Roaster 2"]').getByRole('link', { name: 'https://www.roaster2.com' })).toBeVisible();
    await expect(page.locator('[data-test-id="card-Roaster 3"]')).toBeVisible();
    await expect(page.locator('[data-test-id="card-Roaster 3"]').getByRole('link', { name: 'https://www.roaster3.com' })).toBeVisible();
});
