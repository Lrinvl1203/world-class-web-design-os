import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch();

async function rasterizeImage(source, destination) {
  await mkdir(path.dirname(destination), { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(source).href, { waitUntil: 'load' });
  const image = page.locator('img');
  await image.evaluate(element => {
    document.documentElement.style.background = '#141411';
    document.body.style.margin = '0';
    element.style.display = 'block';
    element.style.width = '1200px';
    element.style.height = '750px';
    element.style.objectFit = 'cover';
    element.style.objectPosition = 'top';
  });
  await image.evaluate(element => element.decode());
  await image.screenshot({ path: destination, type: 'jpeg', quality: 78 });
  await page.close();
}

async function exportSnapshot(source, destination) {
  await mkdir(path.dirname(destination), { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(source).href, { waitUntil: 'load' });
  const image = page.locator('img');
  await image.evaluate(element => element.decode());
  await image.screenshot({ path: destination, type: 'png' });
  await page.close();
}

await rasterizeImage(
  path.join(root, 'tests', 'visual.spec.ts-snapshots', 'home-desktop-win32.webp'),
  path.join(root, 'site', 'assets', 'nocturne.jpg')
);
await rasterizeImage(
  path.join(root, 'tests', 'linehold.spec.ts-snapshots', 'linehold-home-desktop-win32.webp'),
  path.join(root, 'site', 'assets', 'linehold.jpg')
);
await rasterizeImage(
  path.join(root, 'tests', 'afterimage.spec.ts-snapshots', 'afterimage-home-desktop-win32.webp'),
  path.join(root, 'site', 'assets', 'afterimage.jpg')
);
await rasterizeImage(
  path.join(root, 'tests', 'sequence-desk.spec.ts-snapshots', 'sequence-desk-home-desktop-win32.webp'),
  path.join(root, 'site', 'assets', 'sequence-desk.jpg')
);
await rasterizeImage(
  path.join(root, 'tests', 'orbital-commons.spec.ts-snapshots', 'orbital-commons-home-desktop-win32.webp'),
  path.join(root, 'site', 'assets', 'orbital-commons.jpg')
);

for (const experiment of [
  ['afterimage', 'afterimage-home'],
  ['sequence-desk', 'sequence-desk-home'],
  ['orbital-commons', 'orbital-commons-home']
]) {
  const [directory, prefix] = experiment;
  for (const [suffix, screenshot] of [
    ['edge-mobile', 'mobile-320.png'],
    ['mobile', 'mobile-375.png'],
    ['mobile-wide', 'mobile-390.png'],
    ['tablet', 'tablet-768.png'],
    ['desktop', 'desktop-1440.png'],
    ['wide', 'desktop-1920.png']
  ]) {
    await exportSnapshot(
      path.join(root, 'tests', `${directory === 'afterimage' ? 'afterimage' : directory}.spec.ts-snapshots`, `${prefix}-${suffix}-win32.webp`),
      path.join(root, 'experiments', directory === 'afterimage' ? 'afterimage-atlas' : directory, 'screenshots', screenshot)
    );
  }
}

for (const [snapshot, screenshot] of [
  ['linehold-home-edge-mobile-win32.webp', 'mobile-320.png'],
  ['linehold-home-mobile-win32.webp', 'mobile-375.png'],
  ['linehold-home-mobile-wide-win32.webp', 'mobile-390.png'],
  ['linehold-home-tablet-win32.webp', 'tablet-768.png'],
  ['linehold-home-desktop-win32.webp', 'desktop-1440.png'],
  ['linehold-home-wide-win32.webp', 'desktop-1920.png']
]) {
  await exportSnapshot(
    path.join(root, 'tests', 'linehold.spec.ts-snapshots', snapshot),
    path.join(root, 'experiments', 'linehold-forge', 'screenshots', screenshot)
  );
}

const social = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
await social.goto(pathToFileURL(path.join(root, 'site', 'social-card.html')).href, { waitUntil: 'load' });
await social.screenshot({ path: path.join(root, 'site', 'assets', 'social-preview.jpg'), type: 'jpeg', quality: 90 });
await social.close();
await browser.close();
