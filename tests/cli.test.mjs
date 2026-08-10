import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const cli = path.join(repositoryRoot, 'cli', 'web-design-os.mjs');

function runCli(args) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: repositoryRoot,
    encoding: 'utf8'
  });
}

test('doctor counts only the 17 Web Design OS skills', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-design-os-doctor-'));
  const install = runCli(['install', '--agent', 'codex', '--root', temp, '--overwrite']);
  assert.equal(install.status, 0, install.stderr);

  const unrelated = path.join(temp, '.codex', 'skills', 'unrelated-skill');
  fs.mkdirSync(unrelated, { recursive: true });
  fs.writeFileSync(path.join(unrelated, 'SKILL.md'), '# Unrelated skill\n');

  const doctor = runCli(['doctor', '--agent', 'codex', '--root', temp]);
  assert.equal(doctor.status, 0, doctor.stderr);
  assert.match(doctor.stdout, /READY\s+codex/);
  assert.match(doctor.stdout, /17\/17 Web Design OS skills/);
  assert.doesNotMatch(doctor.stdout, /18\/17/);
});
