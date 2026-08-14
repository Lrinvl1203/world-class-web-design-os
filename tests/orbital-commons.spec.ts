import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('Orbital Commons keeps the canvas comparison equivalent in HTML', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Heat belongs');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), 'horizontal overflow').toBeFalsy();
  await page.getByRole('button', { name: /Cool roofs \+ trees/ }).click();
  await expect(page.locator('[data-result]')).toContainText('distribute benefit most evenly');
  await expect(page.locator('[data-row="2"]')).toHaveAttribute('aria-current', 'true');
  const serious = (await new AxeBuilder({ page }).analyze()).violations.filter(v => ['serious','critical'].includes(v.impact || ''));
  expect(serious, serious.map(v => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  if (!process.env.CI) await expect(page).toHaveScreenshot('orbital-commons-home.webp', { fullPage: true });
  expect(errors).toEqual([]);
});
