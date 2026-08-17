import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function readJson(file, required = true) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    if (required) throw new Error(`Unable to read required JSON ${file}: ${error.message}`);
    return null;
  }
}

function number(value) {
  if (value === null || value === undefined || value === '') return 0;
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function escape(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ').trim();
}

export function scoreExperiment(experiment) {
  const impressions = number(experiment.impressions);
  const interactions = number(experiment.interactions);
  const linkClicks = number(experiment.link_clicks);
  const externalBuilds = number(experiment.external_builds);
  const benchmarkSubmissions = number(experiment.benchmark_submissions);
  const follows = number(experiment.follows);
  return Number((
    externalBuilds * 100
    + benchmarkSubmissions * 80
    + follows * 20
    + linkClicks * 5
    + interactions * 2
    + Math.min(impressions / 100, 10)
  ).toFixed(3));
}

export function summarizeExperiments(experiments, modes) {
  return modes.map(mode => {
    const samples = experiments.filter(experiment => experiment.mode === mode);
    const totalScore = samples.reduce((sum, experiment) => sum + scoreExperiment(experiment), 0);
    const impressions = samples.reduce((sum, experiment) => sum + number(experiment.impressions), 0);
    const interactions = samples.reduce((sum, experiment) => sum + number(experiment.interactions), 0);
    return {
      mode,
      samples: samples.length,
      score: Number(totalScore.toFixed(3)),
      score_per_sample: samples.length ? Number((totalScore / samples.length).toFixed(3)) : null,
      impressions,
      interactions,
      engagement_rate: impressions ? Number((interactions / impressions).toFixed(4)) : null
    };
  });
}

export function chooseNextMode(summary, strategy) {
  const minimumSamples = 2;
  const underTested = summary.filter(item => item.samples < minimumSamples);
  if (underTested.length) {
    return [...underTested].sort((a, b) => {
      if (a.samples !== b.samples) return a.samples - b.samples;
      return (strategy.content_mix_percent[b.mode] || 0) - (strategy.content_mix_percent[a.mode] || 0);
    })[0].mode;
  }
  return [...summary].sort((a, b) => (b.score_per_sample || 0) - (a.score_per_sample || 0))[0].mode;
}

function selectStage(stars, strategy) {
  if (stars === null || stars === undefined) return null;
  return strategy.stages.find(stage => stars >= stage.min_stars && (stage.max_stars === null || stars <= stage.max_stars)) || null;
}

function isoWeekIndex(date) {
  return Math.floor(Date.parse(`${date}T00:00:00.000Z`) / (7 * 24 * 60 * 60 * 1000));
}

function modeLabel(mode) {
  return {
    useful_native_education_without_link: 'native education without a forced link',
    build_or_failure_log: 'build or failure log',
    visual_proof_or_tutorial: 'visual proof or tutorial',
    community_question_or_request: 'community question or tester request',
    release_or_direct_call_to_action: 'release or direct call to action'
  }[mode] || mode;
}

export function buildPropagationPlan({ review, strategy, experimentLog, contentSeeds, generatedAt = new Date().toISOString() }) {
  const experiments = Array.isArray(experimentLog.experiments) ? experimentLog.experiments : [];
  const modes = Object.keys(strategy.content_mix_percent || {});
  const summary = summarizeExperiments(experiments, modes);
  const nextMode = chooseNextMode(summary, strategy);
  const date = generatedAt.slice(0, 10);
  const seeds = contentSeeds.seeds || [];
  if (!seeds.length) throw new Error('At least one reviewed content seed is required.');
  const seed = seeds[isoWeekIndex(date) % seeds.length];
  const stars = review?.metrics?.stars ?? review?.growth_goal?.current_stars ?? null;
  const stage = selectStage(stars, strategy);
  const sufficientEvidence = summary.every(item => item.samples >= 2);

  const evidenceRows = summary.map(item => `| ${escape(modeLabel(item.mode))} | ${item.samples} | ${item.impressions} | ${item.interactions} | ${item.engagement_rate === null ? 'Unavailable' : `${(item.engagement_rate * 100).toFixed(2)}%`} | ${item.score_per_sample ?? 'Exploration'} |`).join('\n');
  const targetAction = stage?.id === 'proof'
    ? 'Ask for one reproducible external build or failure report; a star is secondary.'
    : 'Ask for the next stage outcome defined by the growth strategy.';

  const plan = {
    schema_version: 1,
    generated_at: generatedAt,
    repository: review.repository,
    stage: stage ? { id: stage.id, label: stage.label, primary_outcome: stage.primary_outcome } : null,
    selected_mode: nextMode,
    selection_basis: sufficientEvidence ? 'best observed score per sample' : 'controlled exploration until every mode has two observations',
    content_seed: seed,
    target_action: targetAction,
    experiment_summary: summary,
    publication_authority: 'review_required'
  };

  const markdown = `# Weekly propagation plan — ${date}\n\nThis is a reviewable multiplication plan, not publication authority. It may create briefs and drafts, but it may not post, reply, DM, create accounts, buy engagement, hide creator affiliation, or alter core skills.\n\n## Learning decision\n\n- Growth stage: ${stage?.label || 'Unavailable'}\n- Stage outcome: ${stage?.primary_outcome || 'Unavailable'}\n- Selected content mode: ${modeLabel(nextMode)}\n- Selection basis: ${plan.selection_basis}\n- Target action: ${targetAction}\n\n| Mode | Samples | Impressions | Interactions | Engagement | Evidence score/sample |\n|---|---:|---:|---:|---:|---:|\n${evidenceRows}\n\nPopularity and engagement rank experiments; they do not prove design quality. Null metrics remain unknown rather than becoming evidence of zero performance.\n\n## One source experiment\n\n- Case: [${seed.name}](${seed.url})\n- Archetype: ${seed.archetype}\n- Reusable lesson: ${seed.lesson}\n- Visual opening: ${seed.visual_hook}\n- Required limitation: ${seed.limitations}\n\nBefore creating content, capture the exact prompt, environment, elapsed time, manual interventions, failed attempts, screenshots at representative widths, and the final QA result. Do not publish a success edit that hides meaningful failures.\n\n## Multiplication map\n\n### 1. YouTube long form\n\n- Working title A: \`${seed.name}: can a non-designer ship this with one design OS?\`\n- Working title B: \`Why this AI interface feels wrong—and how the QA loop fixes it\`\n- First five seconds: show ${seed.visual_hook.toLowerCase()}\n- Structure: result → brief → ordinary failure → governed workflow → browser evidence → limitations → invitation for the next real project.\n- Description CTA: link the exact case and install command, then ask for a reproducible build or failure.\n\n### 2. Short video\n\n- 0–5s: visible before/after or state change.\n- 5–20s: one diagnosis from the reusable lesson.\n- 20–35s: the corrective workflow and final evidence.\n- Final line: “I built this open-source workflow; send me a real screen it should fail on next.”\n\n### 3. Threads — native value post\n\n- Write the reusable lesson as a complete Korean insight that works without leaving Threads.\n- Use the visual opening as a video or carousel with explanatory text.\n- Do not attach a repository link in the education variant. Reply with a disclosed link only when someone asks for the workflow or example.\n\n### 4. Threads or X — founder request\n\n- State creator affiliation in the first person.\n- Ask for one concrete UI screen or project, not generic support or empty stars.\n- Promise to publish the prompt, failures, corrections, QA, and limitations with permission.\n- Link directly to the relevant case or benchmark instructions, not a generic homepage when avoidable.\n\n### 5. X — English evidence note\n\n- Lead with the visual defect or lesson, not the product name.\n- Include one inspectable fact and the limitation.\n- End with the disclosed relationship and invitation to reproduce the result.\n\n### 6. Reddit/community participation\n\n- Find one current discussion where the lesson directly answers the question.\n- Write a complete answer without a link first.\n- Check the community's rules and disclose the relationship if the repository becomes relevant.\n- Never cross-post the same copy, automate replies, or send unsolicited DMs.\n\n## Review gate\n\nPublish an artifact only after all are true:\n\n- The lesson is supported by the linked case or a new reproducible build.\n- Claims, screenshots, captions, assets, and third-party rights are reviewed.\n- Creator affiliation is explicit wherever the project is linked or recommended.\n- Channel rules and frequency limits are current.\n- The CTA asks for usage evidence before stars.\n- A human has approved the final copy, media, channel, and time.\n\nAfter publication, append the URL and observed metrics to \`marketing/growth-experiments.json\`. The next weekly run will explore under-tested modes until each has at least two samples, then favor the strongest evidence score without exceeding the configured direct-promotion share.\n`;
  return { plan, markdown };
}

export function runPropagationPlan({
  reviewPath = path.resolve(process.env.PROPAGATION_REVIEW_PATH || 'artifacts/weekly/review.json'),
  strategyPath = path.join(root, 'config', 'growth-strategy.json'),
  experimentPath = path.join(root, 'marketing', 'growth-experiments.json'),
  seedPath = path.join(root, 'marketing', 'content-seeds.json'),
  markdownPath = path.resolve(process.env.PROPAGATION_MARKDOWN_OUTPUT || 'artifacts/weekly/propagation-plan.md'),
  jsonPath = path.resolve(process.env.PROPAGATION_JSON_OUTPUT || 'artifacts/weekly/propagation-plan.json'),
  generatedAt = new Date().toISOString()
} = {}) {
  const review = readJson(reviewPath);
  const strategy = readJson(strategyPath);
  const experimentLog = readJson(experimentPath);
  const contentSeeds = readJson(seedPath);
  const result = buildPropagationPlan({ review, strategy, experimentLog, contentSeeds, generatedAt });
  for (const file of [markdownPath, jsonPath]) fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(markdownPath, result.markdown);
  fs.writeFileSync(jsonPath, `${JSON.stringify(result.plan, null, 2)}\n`);
  return { ...result, markdownPath, jsonPath };
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const result = runPropagationPlan();
  console.log(result.markdownPath);
}
