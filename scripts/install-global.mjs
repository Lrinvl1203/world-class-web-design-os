import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { root } from './lib/routing.mjs';

function copyDirectory(source, destination, overwrite) {
  if (fs.existsSync(destination) && !overwrite) {
    throw new Error(`Target exists: ${destination}. Re-run with --overwrite to update it.`);
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: overwrite });
}

export function installSkills({ agent = 'codex', targetRoot, overwrite = false } = {}) {
  const targets = JSON.parse(fs.readFileSync(path.join(root, 'config', 'agent-targets.json'), 'utf8'));
  const agents = agent === 'all' ? Object.keys(targets) : [agent];
  const source = path.join(root, '.codex', 'skills');
  const base = path.resolve(targetRoot || os.homedir());
  const installed = [];

  for (const name of agents) {
    if (!targets[name]) throw new Error(`Unknown agent '${name}'. Choose: ${Object.keys(targets).join(', ')}, all`);
    const destination = path.join(base, ...targets[name].split('/'));
    copyDirectory(source, destination, overwrite);
    installed.push({ agent: name, destination });
  }
  return installed;
}

if (import.meta.url === `file://${process.argv[1].replaceAll('\\', '/')}`) {
  const readValue = flag => {
    const index = process.argv.indexOf(flag);
    return index >= 0 ? process.argv[index + 1] : undefined;
  };
  const installed = installSkills({
    agent: readValue('--agent') || 'codex',
    targetRoot: readValue('--root'),
    overwrite: process.argv.includes('--overwrite')
  });
  installed.forEach(item => console.log(`${item.agent}: ${item.destination}`));
}
