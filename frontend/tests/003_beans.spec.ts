import { test, expect } from "@playwright/test";

test('1. navigate to beans', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Beans' }).click();
    await expect(page.getByRole('heading', { name: 'Beans' })).toBeVisible();
    await expect(page.getByText('No beans yet')).toBeVisible();
});

test('2. add bean and edit', async ({ page }) => {
    await page.goto('./beans');
    await page.getByRole('button', { name: 'Beans' }).click();
    await page.getByRole('button', { name: 'New Bean' }).click();
    await page.getByRole('textbox', { name: 'Bean Name *' }).fill('Bean');
    await page.getByText('Select a roaster...').click();
    await page.getByRole('option', { name: 'Roaster 1' }).click();
    // await page.getByRole('button', { name: 'Roaster Image (Optional)' }).setInputFiles('logo.svg');
    await page.getByRole('button', { name: 'Create Bean' }).click();
    await expect(page.getByText('Bean', { exact: true })).toBeVisible();
    await expect(page.getByText('Roaster 1')).toBeVisible();
    await expect(page.getByText('Bean Details')).toBeVisible();

    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('textbox', { name: 'Bean Name *' }).click();
    await page.getByRole('textbox', { name: 'Bean Name *' }).fill('Bean 1');
    await page.getByRole('button', { name: 'Update Bean' }).click();
    await expect(page.getByText('Bean 1')).toBeVisible();
    await expect(page.getByText('Roaster 1')).toBeVisible();
    await expect(page.getByText('Bean Details')).toBeVisible();
});

test('3. add bean 2', async ({ page }) => {
    await page.goto('./beans');
    await page.getByRole('button', { name: 'Beans' }).click();
    await page.getByRole('button', { name: 'New Bean' }).click();
    await page.getByRole('textbox', { name: 'Bean Name *' }).fill('Bean 2');
    await page.getByText('Select a roaster...').click();
    await page.getByRole('option', { name: 'Roaster 2' }).click();
    // await page.getByRole('button', { name: 'Roaster Image (Optional)' }).setInputFiles('logo.svg');
    await page.getByRole('button', { name: 'Create Bean' }).click();
    await expect(page.getByText('Bean 2', { exact: true })).toBeVisible();
    await expect(page.getByText('Roaster 2')).toBeVisible();
    await expect(page.getByText('Bean Details')).toBeVisible();
});

test('4. add bean 3', async ({ page }) => {
    await page.goto('./beans');
    await page.getByRole('button', { name: 'Beans' }).click();
    await page.getByRole('button', { name: 'New Bean' }).click();
    await page.getByRole('textbox', { name: 'Bean Name *' }).fill('Bean 3');
    await page.getByText('Select a roaster...').click();
    await page.getByRole('option', { name: 'Roaster 3' }).click();
    // await page.getByRole('button', { name: 'Roaster Image (Optional)' }).setInputFiles('logo.svg');
    await page.getByRole('button', { name: 'Create Bean' }).click();
    await expect(page.getByText('Bean 3', { exact: true })).toBeVisible();
    await expect(page.getByText('Roaster 3')).toBeVisible();
    await expect(page.getByText('Bean Details')).toBeVisible();
});

test('5. list view', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Beans' }).click();
    await expect(page.locator('[data-test-id="card-Bean 1"]')).toBeVisible();
    await expect(page.locator('[data-test-id="card-Bean 2"]')).toBeVisible();
    await expect(page.locator('[data-test-id="card-Bean 3"]')).toBeVisible();
});
