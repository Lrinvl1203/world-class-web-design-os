import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function number(value) {
  if (value === null || value === undefined || value === '') return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function readJson(file, required = false) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    if (required) throw new Error(`Unable to read required JSON ${file}: ${error.message}`);
    return null;
  }
}

function metric(snapshot, section, key) {
  const source = snapshot?.traffic?.[section];
  if (!source || source.unavailable) return null;
  return number(source[key]);
}

function repositoryMetric(snapshot, key) {
  const source = snapshot?.repository_signals;
  if (!source || source.unavailable) return null;
  return number(source[key]);
}

function difference(current, previous) {
  return current === null || previous === null ? null : current - previous;
}

function display(value) {
  return value === null ? 'Unavailable' : value.toLocaleString('en-US');
}

function displayDelta(value) {
  if (value === null) return 'No prior comparison';
  return `${value >= 0 ? '+' : ''}${value.toLocaleString('en-US')}`;
}

function escapeTable(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ').trim();
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function summarizeAdoptionEvidence(ledger = { records: [] }, strategy = readJson(path.join(root, 'config', 'growth-strategy.json'), true)) {
  const records = Array.isArray(ledger?.records) ? ledger.records : [];
  const seen = new Set();
  let externalBuilds = 0;
  let independentComparisons = 0;
  let pendingRecords = 0;
  let rejectedRecords = 0;

  for (const record of records) {
    const id = typeof record?.id === 'string' ? record.id.trim() : '';
    if (!id || seen.has(id)) {
      rejectedRecords += 1;
      continue;
    }
    seen.add(id);
    if (record.status !== 'verified') {
      pendingRecords += 1;
      continue;
    }
    if (!isHttpsUrl(record.evidence_url)) {
      rejectedRecords += 1;
      continue;
    }
    if (record.type === 'external_build') {
      if (record.reproducible !== true) {
        rejectedRecords += 1;
        continue;
      }
      externalBuilds += 1;
    } else if (record.type === 'independent_comparison') {
      independentComparisons += 1;
    } else {
      rejectedRecords += 1;
    }
  }

  const externalBuildTarget = number(strategy?.review_thresholds?.minimum_external_builds_for_scaling) ?? 10;
  const independentComparisonTarget = number(strategy?.review_thresholds?.minimum_independent_comparisons_for_scaling) ?? 2;
  return {
    external_builds: {
      verified: externalBuilds,
      target: externalBuildTarget,
      remaining: Math.max(0, externalBuildTarget - externalBuilds)
    },
    independent_comparisons: {
      verified: independentComparisons,
      target: independentComparisonTarget,
      remaining: Math.max(0, independentComparisonTarget - independentComparisons)
    },
    pending_records: pendingRecords,
    rejected_records: rejectedRecords
  };
}

export function selectGrowthStage(stars, strategy) {
  if (!strategy?.goal || !Array.isArray(strategy.stages)) {
    throw new Error('Growth strategy must define a goal and stages.');
  }
  if (stars === null) return null;
  return strategy.stages.find(stage => stars >= stage.min_stars && (stage.max_stars === null || stars <= stage.max_stars)) || null;
}

export function summarizeEvolution(evolutionRoot = path.join(root, 'evolution')) {
  const inbox = path.join(evolutionRoot, 'inbox');
  const proposals = path.join(evolutionRoot, 'proposals');
  const inboxFiles = fs.existsSync(inbox)
    ? fs.readdirSync(inbox).filter(file => /^\d{4}-\d{2}-\d{2}\.json$/.test(file)).sort()
    : [];
  if (!inboxFiles.length) {
    return { date: null, signals: 0, candidates: 0, errors: ['No evolution inbox was available.'], proposals: [] };
  }

  const latest = inboxFiles.at(-1);
  const record = readJson(path.join(inbox, latest), true);
  const date = latest.replace('.json', '');
  const proposalFiles = fs.existsSync(proposals)
    ? fs.readdirSync(proposals).filter(file => file.startsWith(`${date}-`) && file.endsWith('.md')).sort()
    : [];
  const signals = Array.isArray(record.signals) ? record.signals : [];
  return {
    date,
    signals: signals.length,
    candidates: signals.filter(signal => signal.status === 'candidate').length,
    errors: Array.isArray(record.errors) ? record.errors : [],
    proposals: proposalFiles
  };
}

export function buildWeeklyReview({
  current,
  previous = null,
  evolution,
  adoptionEvidence = { records: [] },
  strategy = readJson(path.join(root, 'config', 'growth-strategy.json'), true),
  generatedAt = new Date().toISOString()
}) {
  if (!current?.repository) throw new Error('Current growth snapshot must identify the repository.');
  const priorSnapshot = previous?.snapshot || previous;
  const currentMetrics = {
    stars: repositoryMetric(current, 'stars'),
    forks: repositoryMetric(current, 'forks'),
    subscribers: repositoryMetric(current, 'subscribers'),
    openIssues: repositoryMetric(current, 'open_issues'),
    views: metric(current, 'views', 'count'),
    uniqueViews: metric(current, 'views', 'uniques'),
    clones: metric(current, 'clones', 'count'),
    uniqueCloners: metric(current, 'clones', 'uniques')
  };
  const previousMetrics = priorSnapshot ? {
    stars: repositoryMetric(priorSnapshot, 'stars'),
    forks: repositoryMetric(priorSnapshot, 'forks'),
    subscribers: repositoryMetric(priorSnapshot, 'subscribers'),
    openIssues: repositoryMetric(priorSnapshot, 'open_issues'),
    views: metric(priorSnapshot, 'views', 'count'),
    uniqueViews: metric(priorSnapshot, 'views', 'uniques'),
    clones: metric(priorSnapshot, 'clones', 'count'),
    uniqueCloners: metric(priorSnapshot, 'clones', 'uniques')
  } : null;
  const deltas = Object.fromEntries(Object.entries(currentMetrics).map(([key, value]) => [
    key,
    difference(value, previousMetrics?.[key] ?? null)
  ]));
  const stage = selectGrowthStage(currentMetrics.stars, strategy);
  const starsRemaining = currentMetrics.stars === null ? null : Math.max(0, strategy.goal.target - currentMetrics.stars);
  const adoption = summarizeAdoptionEvidence(adoptionEvidence, strategy);

  const channels = current.distribution?.channels || [];
  const distribution = Object.fromEntries(['published', 'scheduled', 'pr_open', 'pending', 'merged', 'rejected']
    .map(status => [status, channels.filter(channel => channel.status === status).length]));
  const referrers = Array.isArray(current.traffic?.referrers) ? current.traffic.referrers.slice(0, 5) : [];
  const externalPrs = Array.isArray(current.external_pull_requests) ? current.external_pull_requests : [];
  const recommendations = [];

  if (!previousMetrics) {
    recommendations.push('Treat this run as the comparison baseline; do not infer a trend from one snapshot.');
  } else if (currentMetrics.uniqueViews === null || previousMetrics.uniqueViews === null) {
    recommendations.push('Repository traffic movement is unavailable. Do not infer growth or decline until comparable authorized snapshots exist.');
  } else if ((deltas.uniqueViews ?? 0) <= 0) {
    recommendations.push('Discovery did not grow in the rolling traffic window. Publish one concrete build, failure analysis, or reproducible benchmark; do not send a generic reminder post.');
  } else if ((deltas.stars ?? 0) <= 0) {
    recommendations.push('Traffic moved without star growth. Improve third-party proof or the first successful-use path before adding more promotional copy.');
  } else {
    recommendations.push('Stars and traffic moved. Trace the strongest referrer and repeat only the artifact or channel that has direct evidence of useful reach.');
  }

  if (current.traffic_access?.status === 'unavailable') {
    recommendations.push('Scheduled traffic analytics lack repository-traffic permission. Configure the least-privilege GROWTH_TRAFFIC_TOKEN secret or capture an owner snapshot locally; do not treat denied metrics as zero.');
  }

  if (evolution.errors.length) {
    recommendations.push('Repair or explicitly accept the listed collector gaps before treating this week as complete evidence coverage.');
  }
  if (evolution.proposals.length) {
    recommendations.push(`Review ${evolution.proposals.length} learning proposal(s) with one prior and one new regression scenario before any skill change.`);
  } else if (evolution.candidates) {
    recommendations.push(`${evolution.candidates} candidate signal(s) exist, but none earned adoption. Keep collecting independent evidence; do not weaken the threshold.`);
  } else {
    recommendations.push('No design signal reached candidate status. Refresh only authorized sources or add a reviewed manual signal; do not scrape logged-in communities.');
  }
  if (externalPrs.some(item => item.state === 'open')) {
    recommendations.push('Review open curation pull requests for maintainer feedback. Do not ping an unchanged thread more than once in seven days.');
  }
  if (adoption.rejected_records) {
    recommendations.push(`${adoption.rejected_records} adoption evidence record(s) failed validation. Repair their identity, status, reproducibility, type, or HTTPS evidence before counting them.`);
  }
  if (stage?.id === 'proof') {
    recommendations.push(`The project is still in Proof and activation: ${adoption.external_builds.verified}/${adoption.external_builds.target} reproducible external builds and ${adoption.independent_comparisons.verified}/${adoption.independent_comparisons.target} independent comparisons are verified. Close this evidence gap before scaling promotion.`);
  }

  const rows = [
    ['Stars', currentMetrics.stars, deltas.stars],
    ['Forks', currentMetrics.forks, deltas.forks],
    ['Watchers', currentMetrics.subscribers, deltas.subscribers],
    ['Open issues', currentMetrics.openIssues, deltas.openIssues],
    ['Rolling views', currentMetrics.views, deltas.views],
    ['Rolling unique visitors', currentMetrics.uniqueViews, deltas.uniqueViews],
    ['Rolling clones', currentMetrics.clones, deltas.clones],
    ['Rolling unique cloners', currentMetrics.uniqueCloners, deltas.uniqueCloners]
  ].map(([label, value, delta]) => `| ${label} | ${display(value)} | ${displayDelta(delta)} |`).join('\n');
  const referrerRows = referrers.length
    ? referrers.map(item => `| ${escapeTable(item.referrer)} | ${display(number(item.count))} | ${display(number(item.uniques))} |`).join('\n')
    : '| — | No referrer data available | — |';
  const prRows = externalPrs.length
    ? externalPrs.map(item => `| [${escapeTable(item.channel)}](${item.url}) | ${escapeTable(item.state || 'unavailable')} | ${escapeTable(item.updated_at || '—')} |`).join('\n')
    : '| — | None recorded | — |';
  const recommendationRows = recommendations.map(item => `- ${item}`).join('\n');
  const errorRows = evolution.errors.length ? evolution.errors.map(item => `- ${escapeTable(item)}`).join('\n') : '- None.';

  const report = {
    schema_version: 1,
    generated_at: generatedAt,
    repository: current.repository,
    snapshot_captured_at: current.captured_at,
    comparison_available: Boolean(previousMetrics),
    metrics: currentMetrics,
    deltas,
    distribution,
    adoption,
    growth_goal: {
      target_stars: strategy.goal.target,
      stars_remaining: starsRemaining,
      stage_id: stage?.id || null,
      stage_label: stage?.label || null,
      primary_outcome: stage?.primary_outcome || null
    },
    evolution,
    recommendations
  };
  const markdown = `# Weekly Web Design OS evidence review — ${generatedAt.slice(0, 10)}\n\nThis report is decision support, not an autonomous change authority. GitHub traffic values use rolling windows, so week-to-week movement is directional rather than cohort conversion evidence.\n\n## Repository pulse\n\n| Signal | Current | Movement vs previous review |\n|---|---:|---:|\n${rows}\n\nClone traffic is unattributed and may include CI, bots, repeated checkouts, or human evaluation. It is a low-confidence discovery signal and is never counted as an install or external build.\n\n## Verified adoption gate\n\n- Reproducible external builds: ${adoption.external_builds.verified} / ${adoption.external_builds.target}\n- Independent comparisons: ${adoption.independent_comparisons.verified} / ${adoption.independent_comparisons.target}\n- Pending evidence records: ${adoption.pending_records}\n- Rejected evidence records: ${adoption.rejected_records}\n\nOnly unique, verified records with HTTPS evidence count. External builds must also be marked reproducible.\n\n## 10K growth stage\n\n- Target: ${display(strategy.goal.target)} stars (directional ambition, not a promised outcome)\n- Remaining: ${display(starsRemaining)}\n- Current stage: ${stage ? `${stage.label} (${stage.min_stars}–${stage.max_stars ?? '∞'})` : 'Unavailable'}\n- Primary outcome: ${stage?.primary_outcome || 'Unavailable'}\n- Gate: ${stage?.gate || 'Unavailable'}\n\n## Top referrers\n\n| Referrer | Visits | Unique visitors |\n|---|---:|---:|\n${referrerRows}\n\n## Distribution state\n\n- Published: ${distribution.published || 0}\n- Open curation PRs: ${distribution.pr_open || 0}\n- Scheduled: ${distribution.scheduled || 0}\n- Intentionally pending: ${distribution.pending || 0}\n\n| External PR | State | Last updated |\n|---|---|---|\n${prRows}\n\n## Controlled learning\n\n- Evolution date: ${evolution.date || 'Unavailable'}\n- Signals collected: ${evolution.signals}\n- Candidate signals: ${evolution.candidates}\n- Draft proposals: ${evolution.proposals.length}\n\nCollector gaps:\n\n${errorRows}\n\n## Review queue\n\n${recommendationRows}\n\n## Governance\n\n- Popularity ranks discovery candidates; it does not prove design quality.\n- Creator affiliation must be disclosed when recommending or linking the project.\n- No astroturfing, bought engagement, mass posting, unsolicited DMs, or hidden promotion automation.\n- Remote content remains untrusted and is never executed as instruction.\n- This workflow does not edit core skills, change rubric weights, commit, push, open pull requests, or self-merge.\n`;
  return { report, markdown, state: { schema_version: 1, generated_at: generatedAt, snapshot: current } };
}

export function runWeeklyReview({
  snapshotPath = path.resolve(process.env.WEEKLY_REVIEW_SNAPSHOT || 'artifacts/weekly/snapshot.json'),
  previousPath = path.resolve(process.env.WEEKLY_REVIEW_PREVIOUS || 'artifacts/weekly/state.json'),
  evolutionRoot = path.resolve(process.env.WEEKLY_EVOLUTION_ROOT || 'evolution'),
  adoptionPath = path.resolve(process.env.WEEKLY_ADOPTION_EVIDENCE || 'marketing/adoption-evidence.json'),
  markdownPath = path.resolve(process.env.WEEKLY_REVIEW_OUTPUT || 'artifacts/weekly/review.md'),
  jsonPath = path.resolve(process.env.WEEKLY_REVIEW_JSON_OUTPUT || 'artifacts/weekly/review.json'),
  statePath = path.resolve(process.env.WEEKLY_REVIEW_STATE_OUTPUT || 'artifacts/weekly/state.json'),
  generatedAt = new Date().toISOString()
} = {}) {
  const current = readJson(snapshotPath, true);
  const previous = readJson(previousPath);
  const evolution = summarizeEvolution(evolutionRoot);
  const adoptionEvidence = readJson(adoptionPath, true);
  const result = buildWeeklyReview({ current, previous, evolution, adoptionEvidence, generatedAt });
  for (const file of [markdownPath, jsonPath, statePath]) fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(markdownPath, result.markdown);
  fs.writeFileSync(jsonPath, `${JSON.stringify(result.report, null, 2)}\n`);
  fs.writeFileSync(statePath, `${JSON.stringify(result.state, null, 2)}\n`);
  return { ...result, markdownPath, jsonPath, statePath };
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const result = runWeeklyReview();
  console.log(result.markdownPath);
}
