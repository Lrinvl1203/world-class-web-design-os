import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('Sequence Desk resolves a launch decision with accountable feedback', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Resolve the decision');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), 'horizontal overflow').toBeFalsy();
  await page.getByRole('tab', { name: /Onboarding/ }).click();
  await expect(page.locator('[data-question]')).toContainText('first-run task');
  await page.getByRole('button', { name: /Resolve & continue/ }).click();
  await expect(page.locator('[data-message]')).toContainText('nothing was transmitted');
  await expect(page.locator('[data-active-node]')).toBeFocused();
  const serious = (await new AxeBuilder({ page }).analyze()).violations.filter(v => ['serious','critical'].includes(v.impact || ''));
  expect(serious, serious.map(v => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  await expect(page).toHaveScreenshot('sequence-desk-home.webp', { fullPage: true });
  expect(errors).toEqual([]);
});
