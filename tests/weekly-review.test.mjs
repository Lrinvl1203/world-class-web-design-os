import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildWeeklyReview, selectGrowthStage, summarizeAdoptionEvidence, summarizeEvolution } from '../scripts/growth/weekly-review.mjs';

const projectRoot = path.resolve(import.meta.dirname, '..');

function snapshot({ stars = 2, views = 40, uniqueViews = 25, clones = 100, uniqueCloners = 30 } = {}) {
  return {
    captured_at: '2026-08-11T00:00:00.000Z',
    repository: 'Lrinvl1203/world-class-web-design-os',
    repository_signals: { stars, forks: 0, subscribers: 0, open_issues: 0 },
    traffic: {
      views: { count: views, uniques: uniqueViews },
      clones: { count: clones, uniques: uniqueCloners },
      referrers: [{ referrer: 'reddit.com', count: 5, uniques: 4 }]
    },
    distribution: { channels: [{ status: 'published' }, { status: 'pr_open' }, { status: 'pending' }] },
    external_pull_requests: [{ channel: 'Awesome list', url: 'https://github.com/example/list/pull/1', state: 'open', updated_at: '2026-08-10T00:00:00Z' }]
  };
}

const evolution = { date: '2026-08-11', signals: 4, candidates: 1, errors: [], proposals: [] };

test('growth strategy maps the current repository into proof and activation', () => {
  const strategy = JSON.parse(fs.readFileSync(path.join(projectRoot, 'config', 'growth-strategy.json'), 'utf8'));
  const stage = selectGrowthStage(5, strategy);
  assert.equal(stage.id, 'proof');
  const result = buildWeeklyReview({ current: snapshot({ stars: 5 }), evolution, strategy, generatedAt: '2026-08-17T00:10:00.000Z' });
  assert.equal(result.report.growth_goal.target_stars, 10000);
  assert.equal(result.report.growth_goal.stars_remaining, 9995);
  assert.match(result.markdown, /Proof and activation/);
  assert.match(result.markdown, /No astroturfing/);
});

test('weekly review compares repository and rolling traffic signals without claiming cohort conversion', () => {
  const result = buildWeeklyReview({
    current: snapshot({ stars: 4, uniqueViews: 35 }),
    previous: { snapshot: snapshot({ stars: 2, uniqueViews: 25 }) },
    evolution,
    generatedAt: '2026-08-18T00:10:00.000Z'
  });
  assert.equal(result.report.deltas.stars, 2);
  assert.equal(result.report.deltas.uniqueViews, 10);
  assert.match(result.markdown, /rolling windows/);
  assert.match(result.markdown, /Stars and traffic moved/);
  assert.doesNotMatch(result.markdown, /conversion rate/i);
});

test('traffic growth without star growth recommends proof and successful-use improvements', () => {
  const result = buildWeeklyReview({
    current: snapshot({ stars: 2, uniqueViews: 40 }),
    previous: snapshot({ stars: 2, uniqueViews: 25 }),
    evolution,
    generatedAt: '2026-08-18T00:10:00.000Z'
  });
  assert.ok(result.report.recommendations.some(item => item.includes('third-party proof')));
  assert.ok(result.report.recommendations.some(item => item.includes('do not weaken the threshold')));
});

test('verified adoption evidence is unique, reproducible, and independently inspectable', () => {
  const result = summarizeAdoptionEvidence({
    records: [
      { id: 'build-1', type: 'external_build', status: 'verified', reproducible: true, evidence_url: 'https://example.com/build-1' },
      { id: 'build-1', type: 'external_build', status: 'verified', reproducible: true, evidence_url: 'https://example.com/duplicate' },
      { id: 'build-2', type: 'external_build', status: 'pending', reproducible: true, evidence_url: 'https://example.com/build-2' },
      { id: 'build-3', type: 'external_build', status: 'verified', reproducible: false, evidence_url: 'https://example.com/build-3' },
      { id: 'comparison-1', type: 'independent_comparison', status: 'verified', evidence_url: 'https://example.com/comparison-1' },
      { id: 'comparison-2', type: 'independent_comparison', status: 'verified', evidence_url: 'http://example.com/comparison-2' }
    ]
  });
  assert.equal(result.external_builds.verified, 1);
  assert.equal(result.external_builds.target, 10);
  assert.equal(result.independent_comparisons.verified, 1);
  assert.equal(result.independent_comparisons.target, 2);
  assert.equal(result.pending_records, 1);
  assert.equal(result.rejected_records, 3);
});

test('weekly review separates noisy clone traffic from the verified adoption gate', () => {
  const result = buildWeeklyReview({
    current: snapshot({ stars: 7, clones: 436, uniqueCloners: 130 }),
    evolution,
    adoptionEvidence: { records: [] },
    generatedAt: '2026-08-24T01:29:05.329Z'
  });
  assert.deepEqual(result.report.adoption.external_builds, { verified: 0, target: 10, remaining: 10 });
  assert.deepEqual(result.report.adoption.independent_comparisons, { verified: 0, target: 2, remaining: 2 });
  assert.match(result.markdown, /Reproducible external builds: 0 \/ 10/);
  assert.match(result.markdown, /Independent comparisons: 0 \/ 2/);
  assert.match(result.markdown, /Clone traffic is unattributed/);
  assert.match(result.markdown, /never counted as an install or external build/);
  assert.doesNotMatch(result.markdown, /conversion rate/i);
});

test('unavailable GitHub metrics remain unavailable instead of becoming zero', () => {
  const current = snapshot();
  current.repository_signals = { unavailable: true, status: 403 };
  current.traffic.views = { unavailable: true, status: 403 };
  current.traffic_access = { status: 'unavailable' };
  const result = buildWeeklyReview({ current, evolution, generatedAt: '2026-08-11T00:10:00.000Z' });
  assert.equal(result.report.metrics.stars, null);
  assert.equal(result.report.metrics.views, null);
  assert.match(result.markdown, /Unavailable/);
  assert.match(result.markdown, /GROWTH_TRAFFIC_TOKEN/);
});

test('evolution summary uses only the latest dated inbox and matching proposal files', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-design-os-weekly-'));
  const inbox = path.join(temp, 'inbox');
  const proposals = path.join(temp, 'proposals');
  fs.mkdirSync(inbox, { recursive: true });
  fs.mkdirSync(proposals, { recursive: true });
  fs.writeFileSync(path.join(inbox, '2026-08-10.json'), JSON.stringify({ signals: [{ status: 'candidate' }], errors: [] }));
  fs.writeFileSync(path.join(inbox, '2026-08-11.json'), JSON.stringify({ signals: [{ status: 'candidate' }, { status: 'signal' }], errors: ['youtube: skipped'] }));
  fs.writeFileSync(path.join(proposals, '2026-08-10-old.md'), '# Old');
  fs.writeFileSync(path.join(proposals, '2026-08-11-new.md'), '# New');
  const result = summarizeEvolution(temp);
  assert.equal(result.date, '2026-08-11');
  assert.equal(result.signals, 2);
  assert.equal(result.candidates, 1);
  assert.deepEqual(result.proposals, ['2026-08-11-new.md']);
});

test('weekly workflow stays review-only and runs Monday morning in Seoul', () => {
  const workflow = fs.readFileSync(path.join(projectRoot, '.github', 'workflows', 'weekly-review.yml'), 'utf8');
  assert.match(workflow, /cron: '10 0 \* \* 1'/);
  assert.match(workflow, /permissions:\s+contents: read/);
  assert.match(workflow, /node scripts\/growth\/weekly-review\.mjs/);
  assert.match(workflow, /retention-days: 90/);
  assert.doesNotMatch(workflow, /contents: write|pull-requests: write|issues: write|git push|gh pr create|gh pr merge/);
});
