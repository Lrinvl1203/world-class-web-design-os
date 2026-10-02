import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root } from './lib/routing.mjs';
import { installationPaths, manifestName, packageManifest } from './lib/installation.mjs';

export function installSkills({ agent = 'codex', targetRoot, overwrite = false } = {}) {
  const targets = JSON.parse(fs.readFileSync(path.join(root, 'config', 'agent-targets.json'), 'utf8'));
  const agents = agent === 'all' ? Object.keys(targets) : [agent];
  const source = path.join(root, '.codex', 'skills');
  const manifest = packageManifest();
  const plans = agents.map(name => ({ agent: name, ...installationPaths({ agent: name, targetRoot }) }));
  if (plans.some(plan => plan.destination === source || plan.runtime === root)) {
    throw new Error('Choose an installation root outside the source skills and runtime.');
  }
  // Check every managed target before copying anything. Existing unrelated skills
  // are preserved; --overwrite applies only to this package's named skills/runtime.
  for (const plan of plans) {
    for (const name of manifest.skills) {
      if (fs.existsSync(path.join(plan.destination, name)) && !overwrite) {
        throw new Error(`Target exists: ${path.join(plan.destination, name)}. Re-run with --overwrite to update it.`);
      }
    }
  }
  const runtime = plans[0].runtime;
  const manifestPath = path.join(runtime, manifestName);
  if (fs.existsSync(runtime) && !overwrite) {
    const existing = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, 'utf8') : '';
    if (existing !== JSON.stringify(manifest, null, 2) + '\n') {
      throw new Error(`Runtime exists: ${runtime}. Re-run with --overwrite to update it.`);
    }
  }
  for (const item of manifest.files) {
    const destination = path.join(runtime, item.path);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, item.path), destination);
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  const installed = [];

  for (const plan of plans) {
    for (const name of manifest.skills) {
      fs.mkdirSync(plan.destination, { recursive: true });
      fs.cpSync(path.join(source, name), path.join(plan.destination, name), { recursive: true, force: true });
    }
    installed.push({ agent: plan.agent, destination: plan.destination, runtime });
  }
  return installed;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
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
