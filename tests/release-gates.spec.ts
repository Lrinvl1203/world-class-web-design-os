import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('release hard gates', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./', { waitUntil: 'networkidle' });
  await page.locator('img').evaluateAll(async images => {
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => Promise.race([
      image.decode().catch(() => undefined),
      new Promise(resolve => setTimeout(resolve, 3000))
    ])));
  });

  await expect(page.locator('h1')).toBeVisible();
  expect(await page.locator('a[href="#"]').count(), 'dead hash links').toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), 'horizontal overflow').toBeFalsy();

  const accessibility = await new AxeBuilder({ page })
    // The oversized N°24 footer watermark is aria-hidden decorative artwork, not information-bearing text.
    .exclude('.footer-mark[aria-hidden="true"]')
    .analyze();
  const serious = accessibility.violations.filter(violation => ['serious', 'critical'].includes(violation.impact || ''));
  expect(serious, serious.map(item => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
  expect(errors, `console/page errors: ${errors.join('\n')}`).toEqual([]);
});
