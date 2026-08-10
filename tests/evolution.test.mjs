import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildProposals, loadHistory, parseFeed, runEvolution, sanitizeText, scoreSignal } from '../scripts/evolution/run.mjs';

test('sanitizes remote markup and control characters', () => {
  assert.equal(sanitizeText('<script>steal()</script><b>Useful</b>\u0000 idea'), 'Useful idea');
});

test('normalizes RSS entries without storing full markup', () => {
  const xml = '<rss><channel><item><title>Motion &amp; maker&#8217;s meaning</title><link>https://example.com/a</link><pubDate>Sat, 01 Aug 2026 00:00:00 GMT</pubDate><description><![CDATA[<p>Short excerpt</p>]]></description></item></channel></rss>';
  const signals = parseFeed(xml, { id: 'test', name: 'Test', type: 'rss', trust: 0.8 }, new Date('2026-08-09T00:00:00Z'));
  assert.equal(signals.length, 1);
  assert.equal(signals[0].title, 'Motion & maker’s meaning');
  assert.equal(signals[0].untrustedExcerpt, 'Short excerpt');
});

test('engagement and source trust affect discovery score', () => {
  const now = new Date('2026-08-09T00:00:00Z');
  const low = scoreSignal({ publishedAt: '2026-08-08T00:00:00Z', sourceTrust: 0.3, metrics: { views: 100, likes: 1 }, provenance: { method: 'official-api' } }, now);
  const high = scoreSignal({ publishedAt: '2026-08-08T00:00:00Z', sourceTrust: 0.9, metrics: { views: 100000, likes: 9000, shares: 1200 }, provenance: { method: 'official-api' } }, now);
  assert.ok(high > low);
});

test('proposal requires three independent sources', () => {
  const base = { score: 80, title: 'Purposeful kinetic typography', principleHints: ['kinetic typography'] };
  const policy = { minimumSignalScore: 55, minimumIndependentSourcesForProposal: 3 };
  assert.equal(buildProposals([{ ...base, id: '1', url: 'https://a.test/1', sourceId: 'a' }, { ...base, id: '2', url: 'https://b.test/2', sourceId: 'b' }], policy).length, 0);
  assert.equal(buildProposals([{ ...base, id: '1', url: 'https://same.test/1', sourceId: 'a' }, { ...base, id: '2', url: 'https://same.test/1', sourceId: 'b' }, { ...base, id: '3', url: 'https://same.test/1', sourceId: 'c' }], policy).length, 0);
  assert.ok(buildProposals([{ ...base, id: '1', url: 'https://a.test/1', sourceId: 'a' }, { ...base, id: '2', url: 'https://b.test/2', sourceId: 'b' }, { ...base, id: '3', url: 'https://c.test/3', sourceId: 'c' }], policy).length > 0);
});

test('offline run writes only reviewable inbox and report artifacts', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-design-os-evolution-'));
  const result = await runEvolution({ offline: true, date: '2026-08-09', outputRoot: temp, now: new Date('2026-08-09T00:00:00Z') });
  assert.ok(fs.existsSync(result.inboxPath));
  assert.ok(fs.existsSync(result.reportPath));
  assert.equal(result.proposals.length, 0);
});

test('history loader keeps only valid signals in the configured time window', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-design-os-history-'));
  const inbox = path.join(temp, 'evolution', 'inbox');
  fs.mkdirSync(inbox, { recursive: true });
  fs.writeFileSync(path.join(inbox, '2026-08-08.json'), JSON.stringify({ signals: [
    { id: 'recent', observedAt: '2026-08-08T00:00:00Z' },
    { id: 'old', observedAt: '2025-01-01T00:00:00Z' }
  ] }));
  fs.writeFileSync(path.join(inbox, 'broken.json'), '{not json');
  const history = loadHistory(temp, '2026-08-09', 30, new Date('2026-08-09T00:00:00Z'));
  assert.deepEqual(history.map(item => item.id), ['recent']);
});
