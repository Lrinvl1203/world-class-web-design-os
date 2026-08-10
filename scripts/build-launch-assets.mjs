import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch();

async function rasterizeImage(source, destination) {
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

await rasterizeImage(
  path.join(root, 'tests', 'visual.spec.ts-snapshots', 'home-desktop-win32.webp'),
  path.join(root, 'site', 'assets', 'nocturne.jpg')
);
await rasterizeImage(
  path.join(root, 'tests', 'vanta.spec.ts-snapshots', 'vanta-home-desktop-win32.webp'),
  path.join(root, 'site', 'assets', 'vanta.jpg')
);

const social = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
await social.goto(pathToFileURL(path.join(root, 'site', 'social-card.html')).href, { waitUntil: 'load' });
await social.screenshot({ path: path.join(root, 'site', 'assets', 'social-preview.jpg'), type: 'jpeg', quality: 90 });
await social.close();
await browser.close();
