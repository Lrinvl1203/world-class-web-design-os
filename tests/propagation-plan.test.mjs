import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { buildPropagationPlan, chooseNextMode, scoreExperiment, summarizeExperiments } from '../scripts/growth/propagation-plan.mjs';

const root = path.resolve(import.meta.dirname, '..');
const strategy = JSON.parse(fs.readFileSync(path.join(root, 'config', 'growth-strategy.json'), 'utf8'));
const seeds = JSON.parse(fs.readFileSync(path.join(root, 'marketing', 'content-seeds.json'), 'utf8'));

test('propagation scoring values external proof above impressions', () => {
  const shallowReach = scoreExperiment({ impressions: 1000, interactions: 2, external_builds: 0 });
  const realBuild = scoreExperiment({ impressions: 20, interactions: 0, external_builds: 1 });
  assert.ok(realBuild > shallowReach);
});

test('under-tested modes are explored before performance is exploited', () => {
  const modes = Object.keys(strategy.content_mix_percent);
  const summary = summarizeExperiments([
    { mode: modes[0], impressions: 100, interactions: 10 },
    { mode: modes[0], impressions: 100, interactions: 10 }
  ], modes);
  assert.notEqual(chooseNextMode(summary, strategy), modes[0]);
});

test('weekly plan multiplies one reviewed seed but keeps publication human-gated', () => {
  const result = buildPropagationPlan({
    review: { repository: 'Lrinvl1203/world-class-web-design-os', metrics: { stars: 5 } },
    strategy,
    experimentLog: { experiments: [] },
    contentSeeds: seeds,
    generatedAt: '2026-08-17T00:10:00.000Z'
  });
  assert.equal(result.plan.stage.id, 'proof');
  assert.equal(result.plan.publication_authority, 'review_required');
  assert.match(result.markdown, /YouTube long form/);
  assert.match(result.markdown, /Threads — native value post/);
  assert.match(result.markdown, /may not post, reply, DM/);
  assert.match(result.markdown, /human has approved/);
});
