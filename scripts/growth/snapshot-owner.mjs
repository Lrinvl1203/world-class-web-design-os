import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const snapshotScript = path.join(root, 'scripts', 'growth', 'snapshot.mjs');

function ownerToken() {
  const configured = process.env.GROWTH_TRAFFIC_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (configured) return configured;
  try {
    return execFileSync('gh', ['auth', 'token'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true
    }).trim();
  } catch {
    throw new Error('Owner traffic capture requires either GROWTH_TRAFFIC_TOKEN or an authenticated GitHub CLI (`gh auth login`).');
  }
}

const token = ownerToken();
const result = spawnSync(process.execPath, [snapshotScript], {
  cwd: root,
  env: { ...process.env, GH_TOKEN: token, GROWTH_TRAFFIC_TOKEN_CONFIGURED: 'owner-session' },
  stdio: 'inherit',
  windowsHide: true
});

if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1);
