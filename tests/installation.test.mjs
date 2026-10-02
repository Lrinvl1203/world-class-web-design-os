import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { installSkills } from '../scripts/install-global.mjs';
import { doctorInstallation, runtimeRelativePath } from '../scripts/lib/installation.mjs';

test('complete install works from its runtime without the source checkout', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web design os install '));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  fs.mkdirSync(path.join(temp, '.codex/skills/unrelated'), { recursive: true });
  fs.writeFileSync(path.join(temp, '.codex/skills/unrelated/SKILL.md'), 'user-owned');
  installSkills({ targetRoot: temp });
  assert.equal(fs.readFileSync(path.join(temp, '.codex/skills/unrelated/SKILL.md'), 'utf8'), 'user-owned');
  const result = doctorInstallation({ targetRoot: temp });
  assert.equal(result.ready, true, result.problems.join('\n'));
  assert.equal(result.installed, 17);
  const runtime = path.join(temp, runtimeRelativePath);
  const cli = path.join(runtime, 'cli/web-design-os.mjs');
  const run = args => spawnSync(process.execPath, [cli, ...args], { cwd: temp, encoding: 'utf8' });
  assert.equal(run(['doctor', '--root', temp]).status, 0);
  assert.equal(run(['route', 'redesign website with keyboard interaction']).status, 0);
  assert.match(run(['search', 'editorial']).stdout, /\[.*\]/);
  assert.equal(run(['setup', path.join(temp, 'project')]).status, 0);
  assert.equal(run(['eval']).status, 0);
  for (const file of ['config/design-quality-rubric.json', 'cli/web-design-os.mjs',
    'scripts/capture-screenshots.mjs', 'tests/visual.spec.ts', 'evolution/README.md']) {
    assert.ok(fs.readFileSync(path.join(runtime, file)).length > 0, file);
  }
});

test('doctor rejects a legacy skills-only install and missing or changed dependencies', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-design-os-missing-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  installSkills({ targetRoot: temp });
  const runtime = path.join(temp, runtimeRelativePath);
  const rubric = path.join(runtime, 'config/design-quality-rubric.json');
  const original = fs.readFileSync(rubric);
  fs.unlinkSync(rubric);
  assert.ok(doctorInstallation({ targetRoot: temp }).problems.some(item => item.includes('Missing or unreadable: runtime/config/design-quality-rubric.json')));
  fs.writeFileSync(rubric, '{}');
  assert.equal(doctorInstallation({ targetRoot: temp }).ready, false);
  fs.writeFileSync(rubric, original);
  const reference = path.join(temp, '.codex/skills/design-critic/references/design-quality.md');
  fs.appendFileSync(reference, '\nlocal corruption');
  assert.ok(doctorInstallation({ targetRoot: temp }).problems.some(item => item.includes('Changed: skills/design-critic/references/design-quality.md')));
  fs.renameSync(runtime, path.join(temp, 'hidden-runtime'));
  const legacy = doctorInstallation({ targetRoot: temp });
  assert.equal(legacy.installed, 17);
  assert.equal(legacy.ready, false);
  assert.match(legacy.problems[0], /Runtime manifest/);
});

test('existing managed skills require overwrite, while all agent layouts share one runtime', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-design-os-agents-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  assert.throws(() => installSkills({ agent: 'unknown', targetRoot: temp }), /Unknown agent/);
  assert.equal(fs.readdirSync(temp).length, 0);
  const sourceRoot = path.resolve(import.meta.dirname, '..');
  assert.throws(() => installSkills({ targetRoot: sourceRoot, overwrite: true }), /outside the source skills/);
  const installed = installSkills({ agent: 'all', targetRoot: temp });
  assert.equal(installed.length, 6);
  assert.equal(new Set(installed.map(item => item.runtime)).size, 1);
  installed.forEach(item => assert.equal(doctorInstallation({ agent: item.agent, targetRoot: temp }).ready, true));
  assert.throws(() => installSkills({ targetRoot: temp }), /Target exists/);
  installSkills({ targetRoot: temp, overwrite: true });
  assert.equal(doctorInstallation({ targetRoot: temp }).ready, true);
});

test('standalone installer entry point handles Windows file URLs and spaces', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web design standalone '));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const installer = path.resolve(import.meta.dirname, '../scripts/install-global.mjs');
  const result = spawnSync(process.execPath, [installer, '--root', temp, '--agent', 'agents'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(doctorInstallation({ agent: 'agents', targetRoot: temp }).ready, true);
});
