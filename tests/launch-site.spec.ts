import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('launch site passes rendered quality gates', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Design with a');
  await expect(page.getByRole('heading', { name: /Inspect the output/ })).toBeVisible();
  await expect(page.locator('img')).toHaveCount(3);
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));

  const transferredBytes = await page.evaluate(() => performance.getEntriesByType('resource')
    .reduce((total, entry) => total + ((entry as PerformanceResourceTiming).transferSize || 0), 0));
  expect(transferredBytes, 'launch-site transferred resource budget').toBeLessThan(500_000);

  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), 'horizontal overflow').toBeFalsy();

  const accessibility = await new AxeBuilder({ page }).analyze();
  const serious = accessibility.violations.filter(violation => ['serious', 'critical'].includes(violation.impact || ''));
  expect(serious, serious.map(item => `${item.id}: ${item.help}`).join('\n')).toEqual([]);

  const frameTab = page.getByRole('tab', { name: /Frame/ });
  await frameTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Direct/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: /Direct/ })).toContainText('Choose a point of view');

  await page.getByRole('tab', { name: 'All supported agents' }).click();
  await expect(page.locator('#install-command')).toContainText('--agent all');

  await page.screenshot({ path: `artifacts/launch-site/${testInfo.project.name}.png`, fullPage: true, animations: 'disabled' });
  expect(errors, `console/page errors: ${errors.join('\n')}`).toEqual([]);
});

test('critical message and install path survive without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(baseURL || '/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#hero-command')).toContainText('github:Lrinvl1203/world-class-web-design-os');
  await expect(page.locator('#stage-panel')).toContainText('Find the job before the style');
  await context.close();
});
