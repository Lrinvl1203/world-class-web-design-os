import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { routeSkills, loadRoutes } from '../scripts/lib/routing.mjs';

const broadTask = 'build website ' + loadRoutes().routes.flatMap(route => route.keywords).join(' ');

test('routing defaults to the three-specialist phase budget', () => {
  const result = routeSkills(broadTask);
  assert.equal(result.orchestrator, 'web-design-orchestrator');
  assert.equal(result.contextBudget, 3);
  assert.equal(result.specialists.length, 3);
});

test('a caller cannot override the three-specialist maximum', () => {
  const result = routeSkills(broadTask, { limit: 99 });
  assert.equal(result.contextBudget, 3);
  assert.deepEqual(result.specialists, routeSkills(broadTask).specialists);
});

test('routing can request a smaller phase budget', () => {
  assert.equal(routeSkills(broadTask, { limit: 1 }).specialists.length, 1);
  assert.equal(routeSkills(broadTask, { limit: '2' }).contextBudget, 2);
});

test('post-project and evolution tasks select the existing continuous-learning module', () => {
  for (const query of ['post-project repeated defect learning record', 'evolution root cause', '회고 반복 결함']) {
    assert.equal(routeSkills(query).specialists[0].skill, 'continuous-learning');
  }
});

test('ordinary UI feedback does not trigger post-project learning', () => {
  const result = routeSkills('form interaction state feedback');
  assert.equal(result.specialists[0].skill, 'interaction-design');
  assert.ok(!result.specialists.some(s => s.skill === 'continuous-learning'));
});

test('component selection routes to the existing component-source-router module', () => {
  assert.equal(routeSkills('choose a component registry and accessible primitive').specialists[0].skill, 'component-source-router');
});

test('invalid limits fail instead of silently changing the budget', () => {
  for (const limit of [0, -1, 1.5, NaN, Infinity, 'bogus']) {
    assert.throws(() => routeSkills(broadTask, { limit }), /positive integer/);
  }
});

test('the public route CLI enforces and reports the effective budget', () => {
  const cli = path.resolve(import.meta.dirname, '../cli/web-design-os.mjs');
  const valid = spawnSync(process.execPath, [cli, 'route', broadTask, '--limit', '99'], { encoding: 'utf8' });
  assert.equal(valid.status, 0, valid.stderr);
  assert.equal(JSON.parse(valid.stdout).specialists.length, 3);
  const invalid = spawnSync(process.execPath, [cli, 'route', 'build website', '--limit', '0'], { encoding: 'utf8' });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /positive integer/);
});
