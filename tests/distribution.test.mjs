import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { validateDistribution, validateRepositoryDistribution } from '../scripts/validate-distribution.mjs';

const root = path.resolve(import.meta.dirname, '..');

test('repository distribution manifest is internally consistent', () => {
  assert.deepEqual(validateRepositoryDistribution(), []);
});

test('distribution validation rejects duplicate channel ids', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'distribution.json'), 'utf8'));
  manifest.channels.push({ ...manifest.channels[0] });
  const errors = validateDistribution({
    manifest,
    plan: fs.readFileSync(path.join(root, 'docs', 'growth-launch-plan.md'), 'utf8'),
    readme: fs.readFileSync(path.join(root, 'README.md'), 'utf8')
  });
  assert.ok(errors.some(error => error.includes('duplicate id')));
});

test('pending channels require an explicit blocker but no public URL', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'distribution.json'), 'utf8'));
  const pending = manifest.channels.find(entry => entry.status === 'pending');
  assert.ok(pending);
  delete pending.blocker;
  const errors = validateDistribution({ manifest, plan: '', readme: '' });
  assert.ok(errors.some(error => error.includes('pending entries require a blocker')));
});
