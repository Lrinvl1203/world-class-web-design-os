import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('Afterimage Atlas renders and preserves inspect interaction', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toContainText('An image is never');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), 'horizontal overflow').toBeFalsy();
  const feed = page.getByRole('tab', { name: /2026/ });
  await feed.click();
  await expect(feed).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('The wall fits inside a hand');
  const serious = (await new AxeBuilder({ page }).analyze()).violations.filter(v => ['serious','critical'].includes(v.impact || ''));
  expect(serious, serious.map(v => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  await expect(page).toHaveScreenshot('afterimage-home.webp', { fullPage: true });
  expect(errors).toEqual([]);
});
