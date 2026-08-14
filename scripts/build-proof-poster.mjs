import path from 'node:path';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'site', 'assets');
const destination = path.join(assets, 'web-design-os-proof-15s-poster.jpg');
const imageNames = [
  'nocturne.jpg',
  'linehold.jpg',
  'afterimage.jpg',
  'sequence-desk.jpg',
  'orbital-commons.jpg'
];

await mkdir(assets, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const imageUrls = await Promise.all(imageNames.map(async name => {
  const bytes = await readFile(path.join(assets, name));
  return `data:image/jpeg;base64,${bytes.toString('base64')}`;
}));

await page.setContent(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    html, body { width: 1920px; height: 1080px; margin: 0; overflow: hidden; }
    body { display: grid; place-items: center; background: #0b1715; color: #f1ede3; font-family: Arial, Helvetica, sans-serif; }
    main { width: 1920px; height: 720px; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 1px; background: #ff4b24; }
    article { min-width: 0; min-height: 0; overflow: hidden; background: #f1ede3; }
    img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
    .title { padding: 42px; display: flex; flex-direction: column; justify-content: space-between; background: #141411; }
    .title p { margin: 0; font: 700 17px/1.2 ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: .08em; text-transform: uppercase; }
    .title h1 { margin: 0; max-width: 500px; font-size: 80px; line-height: .84; letter-spacing: -.075em; }
    .title em { color: #ff4b24; font-family: Georgia, serif; font-weight: 400; }
  </style>
</head>
<body>
  <main aria-label="Web Design OS proof reel poster">
    <article class="title"><p>Web Design OS / proof reel</p><h1>15 seconds.<br><em>Five outcomes.</em></h1></article>
    ${imageUrls.map(url => `<article><img src="${url}" alt=""></article>`).join('')}
  </main>
</body>
</html>`);

await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
await page.screenshot({ path: destination, type: 'jpeg', quality: 48 });
await browser.close();

console.log(`Built ${path.relative(root, destination)}`);
