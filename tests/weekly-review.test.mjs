import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildWeeklyReview, summarizeEvolution } from '../scripts/growth/weekly-review.mjs';

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

test('unavailable GitHub metrics remain unavailable instead of becoming zero', () => {
  const current = snapshot();
  current.repository_signals = { unavailable: true, status: 403 };
  current.traffic.views = { unavailable: true, status: 403 };
  const result = buildWeeklyReview({ current, evolution, generatedAt: '2026-08-11T00:10:00.000Z' });
  assert.equal(result.report.metrics.stars, null);
  assert.equal(result.report.metrics.views, null);
  assert.match(result.markdown, /Unavailable/);
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
  assert.doesNotMatch(workflow, /contents: write|pull-requests: write|issues: write|git push|gh pr create|gh pr merge/);
});
