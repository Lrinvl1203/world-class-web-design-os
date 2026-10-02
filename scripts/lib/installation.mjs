import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { root } from './routing.mjs';

export const manifestName = 'installation-manifest.json';
export const runtimeRelativePath = '.web-design-os/runtime';
const skillPrefix = '.codex/skills/';
const requiredFiles = ['package.json', 'LICENSE', 'NOTICE.md', 'cli/web-design-os.mjs',
  'config/agent-targets.json', 'config/design-quality-rubric.json', 'config/skill-routes.json',
  'config/viewports.json', 'scripts/lib/installation.mjs', 'scripts/lib/routing.mjs',
  'scripts/capture-screenshots.mjs', 'tests/visual.spec.ts', 'evolution/README.md',
  'evals/routing-cases.json'];
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const safeRelative = name => typeof name === 'string' && name.length > 0
  && !path.isAbsolute(name) && !name.includes('\\')
  && !name.split('/').some(part => ['.', '..', ''].includes(part));

// Explicit package allowlist: never copy the workstation, Git metadata, dependencies,
// or generated evidence directories. Also used by the ZIP builder.
export function packageFiles(sourceRoot = root) {
  const pkg = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'package.json'), 'utf8'));
  const result = new Set();
  function walk(relative) {
    if (!safeRelative(relative)) throw new Error(`Unsafe package path: ${relative}`);
    if (relative.split('/').some(name => /^(?:\.git|\.aws|node_modules|artifacts|test-results|credentials|auth\.json|\.env(?:\..*)?)$|\.(?:pem|key)$/i.test(name))) {
      throw new Error(`Forbidden package path: ${relative}`);
    }
    const file = path.join(sourceRoot, relative);
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) throw new Error(`Package symlink is unsupported: ${relative}`);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(file).sort()) walk(`${relative}/${name}`);
    } else if (stat.isFile()) result.add(relative);
  }
  for (const entry of ['package.json', ...pkg.files]) walk(entry);
  return [...result].sort();
}

export function packageManifest(sourceRoot = root) {
  const files = packageFiles(sourceRoot).map(relative => ({ path: relative, sha256: hash(path.join(sourceRoot, relative)) }));
  const skills = fs.readdirSync(path.join(sourceRoot, '.codex/skills'), { withFileTypes: true })
    .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  const version = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'package.json'), 'utf8')).version;
  return { schemaVersion: 1, package: 'world-class-web-design-os', version, skills, files };
}

export function installationPaths({ agent = 'codex', targetRoot } = {}) {
  const targets = JSON.parse(fs.readFileSync(path.join(root, 'config/agent-targets.json'), 'utf8'));
  if (!targets[agent]) throw new Error(`Unknown agent '${agent}'. Choose: ${Object.keys(targets).join(', ')}`);
  const base = path.resolve(targetRoot || os.homedir());
  return { base, destination: path.join(base, ...targets[agent].split('/')),
    runtime: path.join(base, runtimeRelativePath) };
}

export function doctorInstallation({ agent = 'codex', targetRoot } = {}) {
  const { destination, runtime } = installationPaths({ agent, targetRoot });
  const expectedNames = fs.readdirSync(path.join(root, '.codex/skills'), { withFileTypes: true })
    .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  const missing = expectedNames.filter(name => !fs.existsSync(path.join(destination, name, 'SKILL.md')));
  const problems = [];
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(runtime, manifestName), 'utf8'));
    if (manifest.schemaVersion !== 1 || manifest.package !== 'world-class-web-design-os'
        || !Array.isArray(manifest.files) || manifest.files.length === 0
        || JSON.stringify(manifest.skills) !== JSON.stringify(expectedNames)) throw new Error('invalid manifest structure');
    const seen = new Set();
    for (const item of manifest.files) {
      if (!safeRelative(item.path) || !/^[a-f0-9]{64}$/.test(item.sha256) || seen.has(item.path)) throw new Error('invalid manifest file entry');
      seen.add(item.path);
    }
    for (const required of [...requiredFiles, ...expectedNames.map(name => `${skillPrefix}${name}/SKILL.md`)]) {
      if (!seen.has(required)) throw new Error(`manifest omits ${required}`);
    }
  } catch (error) {
    problems.push(`Runtime manifest unavailable or invalid: ${error.message}`);
    manifest = null;
  }
  function check(file, expected, label) {
    try {
      if (!fs.statSync(file).isFile() || hash(file) !== expected) problems.push(`Changed: ${label}`);
    } catch { problems.push(`Missing or unreadable: ${label}`); }
  }
  for (const item of manifest?.files || []) {
    check(path.join(runtime, item.path), item.sha256, `runtime/${item.path}`);
    if (item.path.startsWith(skillPrefix)) {
      check(path.join(destination, item.path.slice(skillPrefix.length)), item.sha256, `skills/${item.path.slice(skillPrefix.length)}`);
    }
  }
  return { agent, destination, runtime, expected: expectedNames.length,
    installed: expectedNames.length - missing.length, missing, problems,
    checkedRuntimeFiles: manifest?.files.length || 0,
    ready: missing.length === 0 && problems.length === 0,
    basis: 'Bundled files and recorded SHA-256 integrity only; no agent, browser, dependency installation, or design effectiveness test.' };
}
