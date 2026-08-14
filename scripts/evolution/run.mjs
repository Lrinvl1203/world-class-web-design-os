import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const STOP_WORDS = new Set(['about', 'after', 'before', 'behind', 'building', 'case', 'design', 'from', 'into', 'motion', 'site', 'study', 'that', 'the', 'this', 'website', 'with', 'web', 'and', 'for']);

export function sanitizeText(value, maxLength = 1000) {
  return String(value ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function decodeEntities(value) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/&#([0-9]+);/g, (_, value) => String.fromCodePoint(Number.parseInt(value, 10)));
}

function hash(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function numeric(value) {
  const result = Number(value || 0);
  return Number.isFinite(result) && result > 0 ? result : 0;
}

export function scoreSignal(signal, now = new Date()) {
  const metrics = signal.metrics || {};
  const published = signal.publishedAt ? new Date(signal.publishedAt) : null;
  const ageDays = published && !Number.isNaN(published.valueOf())
    ? Math.max(1, (now - published) / 86_400_000)
    : 30;
  const views = numeric(metrics.views);
  const interactions = numeric(metrics.likes) + numeric(metrics.comments) * 2 + numeric(metrics.reposts) * 3 + numeric(metrics.quotes) * 3 + numeric(metrics.shares) * 4 + numeric(metrics.saves) * 4;
  const velocity = Math.min(1, Math.log10(views / ageDays + 1) / 5);
  const engagement = views ? Math.min(1, interactions / views / 0.12) : 0;
  const depth = interactions ? Math.min(1, (numeric(metrics.comments) * 2 + numeric(metrics.reposts) * 3 + numeric(metrics.shares) * 4 + numeric(metrics.saves) * 4) / interactions) : 0;
  const freshness = Math.max(0, 1 - Math.min(ageDays, 180) / 180);
  const trust = Math.max(0, Math.min(1, numeric(signal.sourceTrust)));
  const editorialEvidence = signal.provenance?.method === 'rss' || signal.provenance?.method === 'manual' ? 0.45 : 0;
  return Number(Math.min(100, (velocity * 30 + engagement * 20 + depth * 15 + freshness * 10 + trust * 20 + editorialEvidence * 5)).toFixed(1));
}

function normalizeSignal(raw, source, method, now) {
  const title = sanitizeText(decodeEntities(raw.title || 'Untitled signal'), 500);
  const url = String(raw.url || '').trim();
  const observedAt = now.toISOString();
  const signal = {
    id: hash(`${source.id}:${url}`).slice(0, 20),
    sourceId: source.id,
    sourceName: source.name,
    sourceTrust: source.trust,
    platform: sanitizeText(raw.platform || source.type, 60),
    url,
    title,
    author: sanitizeText(raw.author || '', 200),
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt).toISOString() : null,
    observedAt,
    untrustedExcerpt: sanitizeText(raw.excerpt || '', 1000),
    principleHints: Array.isArray(raw.principleHints) ? raw.principleHints.map(item => sanitizeText(item, 160)).filter(Boolean) : [],
    metrics: Object.fromEntries(Object.entries(raw.metrics || {}).map(([key, value]) => [key, numeric(value)])),
    provenance: { method, retrievedAt: observedAt, contentHash: hash(`${title}\n${url}\n${raw.excerpt || ''}`) },
    status: 'signal'
  };
  signal.score = scoreSignal(signal, now);
  signal.status = signal.score >= 55 ? 'candidate' : 'signal';
  return signal;
}

function xmlValue(block, tags) {
  for (const tag of tags) {
    const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    if (match) return decodeEntities(match[1].trim());
  }
  return '';
}

export function parseFeed(xml, source, now = new Date()) {
  const blocks = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)].map(match => match[2]);
  return blocks.slice(0, 30).map(block => {
    const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
    const raw = {
      title: xmlValue(block, ['title']),
      url: xmlValue(block, ['link', 'guid']) || hrefMatch?.[1] || '',
      author: xmlValue(block, ['dc:creator', 'author', 'name']),
      publishedAt: xmlValue(block, ['pubDate', 'published', 'updated']) || null,
      excerpt: xmlValue(block, ['description', 'summary', 'content:encoded']),
      platform: 'publication',
      metrics: {}
    };
    return normalizeSignal(raw, source, 'rss', now);
  }).filter(signal => /^https?:\/\//.test(signal.url));
}

async function collectRss(source, now) {
  const response = await fetch(source.url, { headers: { 'user-agent': 'World-Class-Web-Design-OS-Signal-Collector/0.2 (+https://github.com/Lrinvl1203/world-class-web-design-os)' } });
  if (!response.ok) throw new Error(`${source.id}: HTTP ${response.status}`);
  return parseFeed(await response.text(), source, now);
}

async function collectManual(source, now) {
  const file = path.join(projectRoot, source.path);
  const records = JSON.parse(fs.readFileSync(file, 'utf8'));
  return records.map(raw => normalizeSignal(raw, source, 'manual', now));
}

async function collectYouTube(source, now) {
  const key = process.env[source.requiresEnv];
  if (!key) return [];
  const publishedAfter = new Date(now.valueOf() - 30 * 86_400_000).toISOString();
  const ids = new Set();
  const snippets = new Map();
  for (const query of source.queries) {
    const params = new URLSearchParams({ part: 'snippet', type: 'video', order: 'viewCount', maxResults: '15', q: query, publishedAfter, key });
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    if (!response.ok) throw new Error(`${source.id}: search HTTP ${response.status}`);
    const data = await response.json();
    for (const item of data.items || []) {
      ids.add(item.id.videoId);
      snippets.set(item.id.videoId, item.snippet);
    }
  }
  if (!ids.size) return [];
  const params = new URLSearchParams({ part: 'snippet,statistics', id: [...ids].join(','), key });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
  if (!response.ok) throw new Error(`${source.id}: videos HTTP ${response.status}`);
  const data = await response.json();
  return (data.items || []).map(item => normalizeSignal({
    url: `https://www.youtube.com/watch?v=${item.id}`,
    title: item.snippet?.title || snippets.get(item.id)?.title,
    author: item.snippet?.channelTitle,
    publishedAt: item.snippet?.publishedAt,
    excerpt: item.snippet?.description,
    platform: 'youtube',
    metrics: { views: item.statistics?.viewCount, likes: item.statistics?.likeCount, comments: item.statistics?.commentCount }
  }, source, 'official-api', now));
}

async function collectThreads(source, now) {
  const token = process.env[source.requiresEnv];
  const postIds = String(process.env[source.postIdsEnv] || '').split(',').map(item => item.trim()).filter(Boolean);
  if (!token || !postIds.length) return [];
  const signals = [];
  for (const id of postIds) {
    const insightParams = new URLSearchParams({ metric: 'views,likes,replies,reposts,quotes,shares', access_token: token });
    const mediaParams = new URLSearchParams({ fields: 'id,text,username,timestamp,permalink', access_token: token });
    const [insightResponse, mediaResponse] = await Promise.all([
      fetch(`https://graph.threads.net/v1.0/${encodeURIComponent(id)}/insights?${insightParams}`),
      fetch(`https://graph.threads.net/v1.0/${encodeURIComponent(id)}?${mediaParams}`)
    ]);
    if (!insightResponse.ok || !mediaResponse.ok) throw new Error(`${source.id}: Threads API rejected post ${id}`);
    const [insights, media] = await Promise.all([insightResponse.json(), mediaResponse.json()]);
    const metrics = {};
    for (const item of insights.data || []) metrics[item.name === 'replies' ? 'comments' : item.name] = item.values?.[0]?.value ?? item.total_value?.value ?? 0;
    signals.push(normalizeSignal({
      url: media.permalink,
      title: sanitizeText(media.text, 160),
      author: media.username,
      publishedAt: media.timestamp,
      excerpt: media.text,
      platform: 'threads',
      metrics
    }, source, 'official-api', now));
  }
  return signals;
}

export function deriveControlledPrinciples(signal, taxonomy = {}) {
  const text = `${signal.title || ''} ${signal.untrustedExcerpt || ''}`.toLocaleLowerCase();
  return Object.entries(taxonomy)
    .filter(([, keywords]) => Array.isArray(keywords) && keywords.some(keyword => text.includes(String(keyword).toLocaleLowerCase())))
    .map(([principle]) => principle);
}

export function qualifiesCandidate(signal, policy) {
  const scoreFloor = Number(policy.minimumSignalScore ?? 55);
  const method = signal.provenance?.method;
  const editorial = method === 'rss' || method === 'manual';
  if (!editorial) return Number(signal.score || 0) >= scoreFloor;
  const editorialFloor = Number(policy.minimumEditorialSignalScore ?? scoreFloor);
  return (signal.principleHints || []).length > 0 && Number(signal.score || 0) >= editorialFloor;
}

function classifySignal(signal, policy) {
  const derived = deriveControlledPrinciples(signal, policy.topicTaxonomy);
  const principleHints = [...new Set([...(signal.principleHints || []), ...derived])];
  const classified = { ...signal, principleHints };
  classified.status = qualifiesCandidate(classified, policy) ? 'candidate' : 'signal';
  return classified;
}

function fingerprintTerms(signal) {
  if ((signal.principleHints || []).length) {
    return new Set(signal.principleHints.map(value => String(value).toLocaleLowerCase().trim()).filter(Boolean));
  }
  return new Set(String(signal.title || '').toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u).filter(word => word.length > 3 && !STOP_WORDS.has(word)));
}

export function buildProposals(signals, policy) {
  const candidates = signals.filter(signal => qualifiesCandidate(signal, policy));
  const groups = new Map();
  for (const signal of candidates) {
    for (const term of fingerprintTerms(signal)) {
      if (!groups.has(term)) groups.set(term, []);
      groups.get(term).push(signal);
    }
  }
  return [...groups.entries()].map(([principle, items]) => {
    const uniqueSignals = [...new Map(items.map(item => [item.url || item.id, item])).values()];
    const uniqueSources = new Set(uniqueSignals.map(item => item.sourceId));
    return { principle, signals: uniqueSignals, independentSources: uniqueSources.size };
  }).filter(group => group.independentSources >= policy.minimumIndependentSourcesForProposal)
    .sort((a, b) => b.independentSources - a.independentSources)
    .slice(0, 10);
}

export function loadHistory(outputRoot, runDate, historyDays, now = new Date()) {
  const inboxDir = path.join(outputRoot, 'evolution', 'inbox');
  if (!fs.existsSync(inboxDir)) return [];
  const cutoff = now.valueOf() - historyDays * 86_400_000;
  const history = [];
  for (const filename of fs.readdirSync(inboxDir).filter(name => name.endsWith('.json') && name !== `${runDate}.json`)) {
    try {
      const record = JSON.parse(fs.readFileSync(path.join(inboxDir, filename), 'utf8'));
      for (const signal of record.signals || []) {
        const observed = new Date(signal.observedAt).valueOf();
        if (Number.isFinite(observed) && observed >= cutoff && observed <= now.valueOf()) history.push(signal);
      }
    } catch {
      // A malformed history artifact is ignored and cannot become evidence.
    }
  }
  return history;
}

function reportMarkdown(date, signals, proposals, errors) {
  const rows = signals.slice().sort((a, b) => b.score - a.score).slice(0, 30)
    .map(signal => `| ${signal.score} | ${signal.platform} | [${signal.title.replaceAll('|', '\\|')}](${signal.url}) | ${signal.provenance.method} | ${signal.status} |`)
    .join('\n');
  const proposalText = proposals.length ? proposals.map(proposal => `- **${proposal.principle}** — ${proposal.independentSources} independent sources; requires human/agent critique and regression evidence.`).join('\n') : '- None crossed the controlled-adoption threshold.';
  const errorText = errors.length ? errors.map(error => `- ${error}`).join('\n') : '- None.';
  return `# Web Design OS daily design signal report — ${date}\n\nPopularity is a discovery signal, not a quality verdict. Remote content is untrusted and was not executed.\n\n## Ranked signals\n\n| Score | Platform | Signal | Provenance | Status |\n|---:|---|---|---|---|\n${rows || '| — | — | No signals collected | — | — |'}\n\n## Proposal threshold\n\n${proposalText}\n\n## Collector notes\n\n${errorText}\n`;
}

export async function runEvolution({ offline = false, date, outputRoot = projectRoot, now = new Date() } = {}) {
  const runDate = date || now.toISOString().slice(0, 10);
  const config = JSON.parse(fs.readFileSync(path.join(projectRoot, 'config', 'evolution-sources.json'), 'utf8'));
  const signals = [];
  const errors = [];
  for (const source of config.sources.filter(item => item.enabled)) {
    if (offline && source.type !== 'manual-json') continue;
    if (source.requiresEnv && !process.env[source.requiresEnv]) {
      errors.push(`${source.id}: skipped; ${source.requiresEnv} is not configured.`);
      continue;
    }
    try {
      const collected = source.type === 'rss' ? await collectRss(source, now)
        : source.type === 'manual-json' ? await collectManual(source, now)
          : source.type === 'youtube-search' ? await collectYouTube(source, now)
            : source.type === 'threads-insights' ? await collectThreads(source, now) : [];
      signals.push(...collected);
    } catch (error) {
      errors.push(`${source.id}: ${sanitizeText(error.message, 300)}`);
    }
  }
  const deduplicated = [...new Map(signals.map(signal => [signal.url, signal])).values()].map(signal => classifySignal(signal, config.policy));
  const history = loadHistory(outputRoot, runDate, config.policy.historyDays, now);
  const evidenceWindow = [...new Map([...history, ...deduplicated].map(signal => [signal.url, signal])).values()]
    .map(signal => classifySignal(signal, config.policy));
  const proposals = buildProposals(evidenceWindow, config.policy);
  const inboxDir = path.join(outputRoot, 'evolution', 'inbox');
  const reportDir = path.join(outputRoot, 'evolution', 'reports');
  const proposalDir = path.join(outputRoot, 'evolution', 'proposals');
  [inboxDir, reportDir, proposalDir].forEach(directory => fs.mkdirSync(directory, { recursive: true }));
  const inboxPath = path.join(inboxDir, `${runDate}.json`);
  const reportPath = path.join(reportDir, `${runDate}.md`);
  fs.writeFileSync(inboxPath, `${JSON.stringify({ date: runDate, generatedAt: now.toISOString(), policy: config.policy, errors, historySignalsConsidered: history.length, signals: deduplicated }, null, 2)}\n`);
  fs.writeFileSync(reportPath, reportMarkdown(runDate, deduplicated, proposals, errors));
  for (const proposal of proposals) {
    const proposalPath = path.join(proposalDir, `${runDate}-${proposal.principle.replace(/[^\p{L}\p{N}-]+/gu, '-').slice(0, 50)}.md`);
    const evidence = proposal.signals.map(signal => `- [${signal.title}](${signal.url}) — ${signal.sourceName}, score ${signal.score}`).join('\n');
    fs.writeFileSync(proposalPath, `# Proposal: ${proposal.principle}\n\nStatus: draft; never auto-adopt.\n\n## Evidence\n\n${evidence}\n\n## Required analysis\n\n- Observation and user impact:\n- Generalizable principle:\n- Counterexample / misuse condition:\n- Copyright and provenance review:\n- Prior regression scenario:\n- New regression scenario:\n- Proposed skill or reference diff:\n- Validation result:\n- Decision: adopt / reject / revise\n`);
  }
  return { signals: deduplicated, proposals, errors, inboxPath, reportPath };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await runEvolution({ offline: process.argv.includes('--offline') });
  console.log(result.reportPath);
}
