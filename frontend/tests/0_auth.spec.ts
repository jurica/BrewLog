import { test } from "@playwright/test";
import { logout } from './fixtures';

test('logout workflow should work', async ({ page }) => {
    await page.goto('./');
    await logout(page);
});

// TODO
// - signup (required for CI)
// - failure test case(s)
// - login form should submit on enter
