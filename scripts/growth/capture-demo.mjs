import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const repositoryRoot = path.resolve(import.meta.dirname, '..', '..');
const outputRoot = path.join(repositoryRoot, 'marketing', 'assets', 'demo');
const baseUrl = (process.env.DEMO_BASE_URL || 'https://lrinvl1203.github.io/world-class-web-design-os/').replace(/\/?$/, '/');
const viewport = { width: 1920, height: 1440 };

fs.mkdirSync(outputRoot, { recursive: true });

async function settle(page) {
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.complete
      ? Promise.resolve()
      : new Promise(resolve => {
        const done = () => resolve();
        image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
        setTimeout(done, 5_000);
      })));
  });
  await page.waitForTimeout(450);
}

async function capture(page, name) {
  const target = path.join(outputRoot, `${name}.png`);
  await page.screenshot({ path: target, animations: 'disabled' });
  return target;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await context.newPage();
const shots = {};

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
await settle(page);
shots.osHero = await capture(page, '01-os-hero');

await page.locator('#proof').scrollIntoViewIfNeeded();
await page.waitForTimeout(350);
shots.osProof = await capture(page, '02-os-proof');

await page.goto(new URL('experiments/nocturne-concierge/', baseUrl).href, { waitUntil: 'domcontentloaded' });
await settle(page);
shots.nocturneHero = await capture(page, '03-nocturne-hero');

await page.locator('[data-panel-trigger]').click();
await page.waitForTimeout(350);
shots.nocturnePanel = await capture(page, '04-nocturne-panel');

await page.goto(new URL('experiments/linehold-forge/', baseUrl).href, { waitUntil: 'domcontentloaded' });
await settle(page);
shots.lineholdHero = await capture(page, '05-linehold-hero');

await page.locator('#capabilities').scrollIntoViewIfNeeded();
await page.locator('[data-family="robotics"]').click();
await page.waitForTimeout(350);
shots.lineholdCapability = await capture(page, '06-linehold-capability');

const cursorPage = await context.newPage();
await cursorPage.setViewportSize({ width: 80, height: 104 });
await cursorPage.setContent(`<!doctype html><style>
  html,body{margin:0;background:transparent;overflow:hidden}
  svg{display:block;filter:drop-shadow(0 3px 4px rgba(0,0,0,.35))}
</style><svg width="80" height="104" viewBox="0 0 80 104" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 5 62 58 37 61 53 91 38 99 22 68 7 85Z" fill="#fff" stroke="#111" stroke-width="4" stroke-linejoin="round"/>
</svg>`);
const cursorAsset = path.join(outputRoot, 'cursor.png');
await cursorPage.screenshot({ path: cursorAsset, omitBackground: true });

const absoluteShots = Object.fromEntries(Object.entries(shots).map(([name, file]) => [name, path.resolve(file)]));
const config = {
  duration: 18,
  fps: 60,
  output_size: [1440, 1080],
  source_size: [1920, 1440],
  cursor_scale: 1.35,
  cursor_asset: path.resolve(cursorAsset),
  cursor_hotspot: [7, 5],
  click_strength: 10,
  rotation_strength_degrees: 4,
  preset: 'veryfast',
  crf: 19,
  shots: absoluteShots,
  scene_starts: [
    [0, 'osHero', 'fade'],
    [3.2, 'osProof', 'fade'],
    [6.2, 'nocturneHero', 'fade'],
    [8.8, 'nocturnePanel', 'fade'],
    [11.6, 'lineholdHero', 'fade'],
    [14.5, 'lineholdCapability', 'fade']
  ],
  cursor_keys: [
    [0, 1540, 110],
    [2.5, 1170, 1260],
    [3.2, 1170, 1260],
    [5.8, 1050, 520],
    [6.2, 1450, 110],
    [8.3, 420, 1080],
    [8.8, 420, 1080],
    [11.2, 1530, 110],
    [11.6, 1530, 110],
    [14.1, 360, 1190],
    [14.5, 360, 1190],
    [17.8, 390, 450]
  ],
  camera_keys: [
    [0, 960, 720, 1],
    [3.2, 960, 720, 1.04],
    [6.2, 960, 690, 1],
    [8.8, 1180, 700, 1.08],
    [11.6, 960, 680, 1],
    [14.5, 960, 700, 1.06],
    [18, 960, 700, 1.02]
  ],
  click_times: [2.7, 8.45, 14.2],
  output: path.join(repositoryRoot, 'site', 'assets', 'web-design-os-demo-4x3.mp4')
};

const configPath = path.join(outputRoot, 'render-config.json');
fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
await browser.close();

console.log(`Captured ${Object.keys(shots).length} states from ${baseUrl}`);
console.log(configPath);
