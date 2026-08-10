import { spawnSync } from 'node:child_process';
import path from 'node:path';

const cli = path.resolve('node_modules', '@playwright', 'test', 'cli.js');
const result = spawnSync(process.execPath, [
  cli, 'test',
  'tests/release-gates.spec.ts',
  'tests/launch-site.spec.ts',
  '--project=edge-mobile',
  '--project=mobile',
  '--project=tablet',
  '--project=desktop',
  '--project=wide'
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    TARGET_URL: 'http://127.0.0.1:4175',
    STATIC_DIR: 'site',
    STATIC_PORT: '4175'
  }
});

if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
