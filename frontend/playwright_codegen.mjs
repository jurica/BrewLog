// from: https://github.com/microsoft/playwright/issues/20378
//
import { chromium } from '@playwright/test';

(async () => {
    const browser = await chromium.launch({ headless: false, executablePath: "/usr/bin/chromium" });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.pause();
})();
