import { test, expect } from '@playwright/test';

test('Linehold Forge visual baseline and supplier-evaluation paths', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('img').evaluateAll(async images => {
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => image.decode().catch(() => undefined)));
  });

  await expect(page.locator('h1')).toContainText('Parts that');
  await expect(page.locator('#capabilities')).toBeVisible();
  await expect(page.locator('#quality')).toBeVisible();
  await expect(page.locator('#rfq')).toBeVisible();
  await expect(page.locator('nav[aria-label="Primary navigation"]')).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, 'horizontal overflow detected').toBeFalsy();
  expect(await page.locator('a[href="#"]').count(), 'dead hash links detected').toBe(0);

  const undersizedPrimaryTargets = await page.locator('button, .button, .header-cta, input, select').evaluateAll(elements => elements.filter(element => {
    const rect = element.getBoundingClientRect();
    return rect.width < 44 || rect.height < 44;
  }).length);
  expect(undersizedPrimaryTargets, 'critical pointer targets under 44px').toBe(0);

  await expect(page).toHaveScreenshot('linehold-home.webp', { fullPage: true });

  const energy = page.locator('[data-family="energy"]');
  await energy.click();
  await expect(energy).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-family-title]')).toHaveText('Vaned flow paths');
  await expect(page.locator('[data-family-tolerance]')).toHaveText('±0.015 mm');

  await page.locator('input[name="quantity"]').fill('8');
  await page.locator('[data-rfq-form] button[type="submit"]').click();
  await expect(page.locator('[data-rfq-heading]')).toHaveText('8-part first-lot brief');
  await expect(page.locator('[data-rfq-summary]')).toContainText('Nothing was transmitted');
  await expect(page.locator('.rfq-output')).toBeFocused();

  await page.keyboard.press('Tab');
  expect(errors, `console/page errors: ${errors.join('\n')}`).toEqual([]);
});
