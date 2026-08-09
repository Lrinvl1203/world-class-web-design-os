import { defineConfig } from '@playwright/test';

const baseURL = process.env.TARGET_URL || 'http://127.0.0.1:3000';
const staticDirectory = process.env.STATIC_DIR;
const staticPort = Number(process.env.STATIC_PORT || 4173);

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 8_000, toHaveScreenshot: { animations: 'disabled' } },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: staticDirectory ? {
    command: `node scripts/serve-static.mjs ${staticDirectory} ${staticPort}`,
    url: `http://127.0.0.1:${staticPort}`,
    reuseExistingServer: false
  } : undefined,
  projects: [
    { name: 'edge-mobile', use: { viewport: { width: 320, height: 568 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
    { name: 'mobile-wide', use: { viewport: { width: 390, height: 844 } } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'wide', use: { viewport: { width: 1920, height: 1080 } } }
  ]
});
