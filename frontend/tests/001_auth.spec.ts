import { test, expect } from "@playwright/test";

test('logout workflow should work', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'FL Firstname Lastname user@' }).click();
    await page.getByRole('menuitem', { name: 'Log out' }).click();
    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await page.goto('./');
    await expect(page).toHaveURL(/login/);
});

// TODO
// - signup (required for CI)
// - failure test case(s)
// - login form should submit on enter
