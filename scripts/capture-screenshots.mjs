import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const target = process.env.TARGET_URL || process.argv[2];
if (!target) {
  console.error('Set TARGET_URL or pass a URL: node scripts/capture-screenshots.mjs http://localhost:3000');
  process.exit(2);
}
const cfg = JSON.parse(await fs.readFile(new URL('../config/viewports.json', import.meta.url), 'utf8'));
const out = path.resolve('artifacts/screenshots');
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  for (const vp of cfg.viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const errors=[];
    page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
    await page.goto(target, { waitUntil: 'networkidle' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    await page.screenshot({ path: path.join(out, `${vp.name}-${vp.width}x${vp.height}.png`), fullPage: true });
    const result = { viewport: vp, overflow, consoleErrors: errors };
    await fs.writeFile(path.join(out, `${vp.name}.json`), JSON.stringify(result, null, 2));
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`Captured ${cfg.viewports.length} viewports into ${out}`);
