import { test, expect } from '@playwright/test';

test('home visual baseline and basic health', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('body')).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, 'horizontal overflow detected').toBeFalsy();

  await expect(page).toHaveScreenshot('home.webp', { fullPage: true });
  expect(errors, `console/page errors: ${errors.join('\n')}`).toEqual([]);
});
