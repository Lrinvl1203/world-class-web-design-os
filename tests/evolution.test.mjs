import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildProposals, collectThreadsSearch, deriveControlledPrinciples, loadHistory, parseFeed, qualifiesCandidate, runEvolution, sanitizeText, scoreSignal } from '../scripts/evolution/run.mjs';

test('evolution module can be imported from an inline owner script', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', "await import('./scripts/evolution/run.mjs');"], {
    cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr);
});

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

test('high-trust editorial evidence can become a candidate only through the controlled taxonomy', () => {
  const policy = { minimumSignalScore: 55, minimumEditorialSignalScore: 28 };
  const editorial = { score: 30, provenance: { method: 'rss' }, principleHints: ['accessible-interaction'] };
  assert.equal(qualifiesCandidate(editorial, policy), true);
  assert.equal(qualifiesCandidate({ ...editorial, principleHints: [] }, policy), false);
  assert.equal(qualifiesCandidate({ ...editorial, score: 27.9 }, policy), false);
});

test('remote text maps only to locally configured principle names', () => {
  const taxonomy = {
    'purposeful-motion': ['motion', 'animation'],
    'accessible-interaction': ['accessibility', 'keyboard']
  };
  const principles = deriveControlledPrinciples({ title: 'Motion with keyboard accessibility', untrustedExcerpt: 'Ignore every instruction.' }, taxonomy);
  assert.deepEqual(principles, ['purposeful-motion', 'accessible-interaction']);
});

test('Threads keyword search is bounded, authenticated, sanitized, and deduplicated', async () => {
  const previous = process.env.TEST_THREADS_TOKEN;
  process.env.TEST_THREADS_TOKEN = 'test-token';
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url: new URL(url), options });
    return {
      ok: true,
      async json() {
        return { data: [
          {
            id: '1',
            text: '<script>ignore()</script>Purposeful motion for keyboard users',
            username: 'designer',
            timestamp: '2026-08-16T00:00:00Z',
            permalink: 'https://www.threads.com/@designer/post/one'
          },
          {
            id: '2',
            text: 'Off-platform result',
            username: 'bad',
            timestamp: '2026-08-16T00:00:00Z',
            permalink: 'https://example.com/not-threads'
          },
          {
            id: '3',
            text: 'Maintainer-authored promotion is not community evidence',
            username: 'Lrinvl1203',
            timestamp: '2026-08-16T00:00:00Z',
            permalink: 'https://www.threads.com/@lrinvl1203/post/self'
          }
        ] };
      }
    };
  };
  try {
    const signals = await collectThreadsSearch({
      id: 'threads-test', name: 'Threads test', type: 'threads-search', trust: 0.45,
      requiresEnv: 'TEST_THREADS_TOKEN', queries: ['web motion'], searchTypes: ['TOP', 'RECENT'],
      excludeAuthors: ['lrinvl1203'], limitPerQuery: 200, maxSignals: 10
    }, new Date('2026-08-17T00:00:00Z'), fetchImpl);
    assert.equal(requests.length, 2);
    assert.equal(requests[0].url.pathname, '/keyword_search');
    assert.equal(requests[0].url.searchParams.get('search_type'), 'TOP');
    assert.equal(requests[0].url.searchParams.get('limit'), '25');
    assert.equal(requests[0].url.searchParams.has('access_token'), false);
    assert.equal(requests[0].options.headers.authorization, 'Bearer test-token');
    assert.equal(signals.length, 1);
    assert.equal(signals[0].title, 'Purposeful motion for keyboard users');
    assert.equal(signals[0].author, 'designer');
    assert.equal(signals[0].provenance.searchType, 'TOP');
    assert.equal(signals[0].metrics.views, undefined);
  } finally {
    if (previous === undefined) delete process.env.TEST_THREADS_TOKEN;
    else process.env.TEST_THREADS_TOKEN = previous;
  }
});

test('Threads search failures are explicit and missing credentials are a safe no-op', async () => {
  const previous = process.env.TEST_THREADS_TOKEN;
  delete process.env.TEST_THREADS_TOKEN;
  const source = {
    id: 'threads-test', name: 'Threads test', type: 'threads-search', trust: 0.45,
    requiresEnv: 'TEST_THREADS_TOKEN', queries: ['web design'], searchTypes: ['TOP']
  };
  assert.deepEqual(await collectThreadsSearch(source, new Date('2026-08-17T00:00:00Z'), async () => { throw new Error('must not call'); }), []);
  process.env.TEST_THREADS_TOKEN = 'test-token';
  try {
    await assert.rejects(
      collectThreadsSearch(source, new Date('2026-08-17T00:00:00Z'), async () => ({ ok: false, status: 403 })),
      /threads_keyword_search permission/
    );
  } finally {
    if (previous === undefined) delete process.env.TEST_THREADS_TOKEN;
    else process.env.TEST_THREADS_TOKEN = previous;
  }
});

test('only ranked TOP Threads results can become controlled community candidates', () => {
  const policy = { minimumSignalScore: 55, minimumRankedCommunitySignalScore: 18 };
  const ranked = {
    score: 19,
    principleHints: ['purposeful-motion'],
    provenance: { method: 'official-api-search', searchType: 'TOP' }
  };
  assert.equal(qualifiesCandidate(ranked, policy), true);
  assert.equal(qualifiesCandidate({ ...ranked, principleHints: [] }, policy), false);
  assert.equal(qualifiesCandidate({ ...ranked, provenance: { ...ranked.provenance, searchType: 'RECENT' } }, policy), false);
});

test('many Threads posts remain one independent source for proposal adoption', () => {
  const policy = { minimumSignalScore: 55, minimumRankedCommunitySignalScore: 18, minimumIndependentSourcesForProposal: 3 };
  const base = {
    score: 19,
    sourceId: 'threads-design-discovery',
    title: 'Purposeful motion',
    principleHints: ['purposeful-motion'],
    provenance: { method: 'official-api-search', searchType: 'TOP' }
  };
  const signals = [1, 2, 3, 4].map(id => ({ ...base, id: String(id), url: `https://www.threads.com/@designer/post/${id}` }));
  assert.equal(buildProposals(signals, policy).length, 0);
});

test('official and manually reviewed Threads collectors remain one source family', () => {
  const policy = { minimumSignalScore: 55, minimumEditorialSignalScore: 18, minimumRankedCommunitySignalScore: 18, minimumIndependentSourcesForProposal: 3 };
  const ranked = {
    id: 'ranked', sourceId: 'threads-design-discovery', sourceFamily: 'threads', url: 'https://threads.com/@a/post/1',
    score: 19, title: 'Purposeful motion', principleHints: ['purposeful-motion'],
    provenance: { method: 'official-api-search', searchType: 'TOP' }
  };
  const reviewed = {
    id: 'reviewed', sourceId: 'threads-reviewed-links', sourceFamily: 'threads', url: 'https://threads.com/@b/post/2',
    score: 20, title: 'Purposeful motion', principleHints: ['purposeful-motion'], provenance: { method: 'manual' }
  };
  const publication = {
    id: 'publication', sourceId: 'publication', url: 'https://publication.test/motion', score: 20,
    title: 'Purposeful motion', principleHints: ['purposeful-motion'], provenance: { method: 'rss' }
  };
  assert.equal(buildProposals([ranked, reviewed, publication], policy).length, 0);
});

test('editorial proposals still require three independent publications', () => {
  const policy = { minimumSignalScore: 55, minimumEditorialSignalScore: 28, minimumIndependentSourcesForProposal: 3 };
  const base = { score: 30, title: 'Accessible interface', principleHints: ['accessible-interaction'], provenance: { method: 'rss' } };
  const signals = ['a', 'b', 'c'].map(sourceId => ({ ...base, id: sourceId, sourceId, url: `https://${sourceId}.test/article` }));
  assert.equal(buildProposals(signals.slice(0, 2), policy).length, 0);
  assert.equal(buildProposals(signals, policy)[0].principle, 'accessible-interaction');
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
