import { test, expect } from '@playwright/test';

test('home visual baseline and critical guest paths', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('body')).toBeVisible();
  await page.locator('img').evaluateAll(async images => {
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => image.decode().catch(() => undefined)));
  });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, 'horizontal overflow detected').toBeFalsy();

  const deadHashLinks = await page.locator('a[href="#"]').count();
  expect(deadHashLinks, 'dead hash links detected').toBe(0);

  const hiddenCriticalContent = await page.locator('.reveal').evaluateAll(elements => elements.filter(element => {
    const style = getComputedStyle(element);
    return style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0;
  }).length);
  expect(hiddenCriticalContent, 'critical content is hidden in reduced-motion mode').toBe(0);

  await expect(page).toHaveScreenshot('home.webp', { fullPage: true });

  const floorStep = page.locator('[data-arrival="floor"]');
  await floorStep.click();
  await expect(floorStep).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-arrival-title]')).toContainText('Third floor');

  const wifiGuide = page.locator('[data-guide="wifi"]');
  await wifiGuide.click();
  await expect(wifiGuide).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-guide-title]')).toContainText('Wi‑Fi');

  const panelTrigger = page.locator('[data-panel-trigger]');
  await panelTrigger.click();
  await expect(panelTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#today-panel')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('.panel-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#today-panel')).toHaveAttribute('aria-hidden', 'true');
  await expect(panelTrigger).toBeFocused();

  expect(errors, `console/page errors: ${errors.join('\n')}`).toEqual([]);
});
