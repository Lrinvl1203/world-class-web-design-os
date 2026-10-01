import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const defaultRubricPath = path.join(root, 'config', 'design-quality-rubric.json');
const metricNames = ['lcp_ms', 'inp_ms', 'cls'];
const own = (object, key) => Object.hasOwn(object, key);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const finiteNumber = value => typeof value === 'number' && Number.isFinite(value);
const roundTotal = value => Math.round(value * 1e10) / 1e10;

function isHttpsUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

/**
 * Read-only audit of report declarations, never a browser run or source verification.
 * Optional field evidence belongs at hard_gates.field_core_web_vitals:
 * { measurement_scope: 'field', percentile: 75,
 *   source: { type: 'crux'|'rum', url: 'https://...evidence', target: 'https://...site' },
 *   collected_at: 'YYYY-MM-DD', metrics: { lcp_ms: number, inp_ms: number, cls: number } }
 * A complete contract establishes REPORTED PASS only. No evidence is fetched and no
 * browser-run freshness, authenticity, or coverage of a deployment is inferred.
 */
export function auditQualityReport(report, rubric, { requireField = false, now = new Date() } = {}) {
  const issues = [];
  let valid = true;
  const add = (code, category, location, message, { invalid = false, severity = 'error' } = {}) => {
    if (invalid) valid = false;
    issues.push({ code, severity, category, path: location, message });
  };
  const invalid = (code, category, location, message) => add(code, category, location, message, { invalid: true });
  const pending = (code, category, location, message) => add(code, category, location, message, { severity: 'warning' });
  const missing = (object, name, category, location) => {
    if (own(object, name)) return false;
    pending('EVIDENCE_MISSING', category, `${location}.${name}`, `Provide ${name} evidence.`);
    return true;
  };
  const limits = rubric.hard_gates.core_web_vitals;
  const threshold = rubric.release_threshold;
  const today = new Date(now).toISOString().slice(0, 10);

  if (!record(report)) {
    invalid('REPORT_SHAPE', 'shape', '$', 'The report must be a JSON object.');
    report = {};
  }
  const scores = record(report.scores) ? report.scores : {};
  if (!record(report.scores)) invalid('SCORES_SHAPE', 'shape', 'scores', 'scores must be an object containing every rubric category.');
  const categories = [];
  let scoreShapeValid = record(report.scores);
  let total = 0;
  let designPassed = true;
  for (const name of Object.keys(scores).sort()) {
    if (!own(rubric.categories, name)) {
      invalid('SCORE_UNKNOWN', 'shape', `scores.${name}`, 'This score category is not in the rubric.');
      scoreShapeValid = false;
    }
  }
  for (const [name, rule] of Object.entries(rubric.categories)) {
    const score = scores[name];
    let status = 'PASS';
    if (!own(scores, name)) {
      invalid('SCORE_MISSING', 'shape', `scores.${name}`, 'Required score is missing.');
      scoreShapeValid = false;
      status = 'INVALID';
    } else if (!finiteNumber(score) || score < 0 || score > rule.max) {
      invalid('SCORE_INVALID', 'shape', `scores.${name}`, `Score must be a finite number from 0 through ${rule.max}.`);
      scoreShapeValid = false;
      status = 'INVALID';
    } else {
      total += score;
      if (score < rule.floor) {
        add('SCORE_BELOW_FLOOR', 'design', `scores.${name}`, `${score} is below the ${rule.floor} category floor.`);
        designPassed = false;
        status = 'HOLD';
      }
    }
    categories.push({ name, score: status === 'INVALID' ? null : score, max: rule.max, floor: rule.floor, status });
  }
  total = scoreShapeValid ? roundTotal(total) : null;
  if (total !== null && total < threshold) {
    add('TOTAL_BELOW_THRESHOLD', 'design', 'scores', `${total} is below the ${threshold} release threshold.`);
    designPassed = false;
  }
  for (const [name, expected] of [['wdx_total', total], ['release_threshold', threshold]]) {
    if (!own(report, name)) continue;
    if (!finiteNumber(report[name]) || report[name] < 0) {
      invalid('DECLARED_NUMBER_INVALID', 'integrity', name, `${name} must be a finite nonnegative number.`);
    } else if (expected !== null && Math.abs(report[name] - expected) > 1e-8) {
      invalid('DECLARED_NUMBER_MISMATCH', 'integrity', name, `Declared ${report[name]} does not match the computed/rubric value ${expected}.`);
    }
  }
  const design = { status: !scoreShapeValid ? 'INVALID' : designPassed ? 'PASS' : 'HOLD', threshold, categories };

  const gates = record(report.hard_gates) ? report.hard_gates : {};
  let technicalInvalid = !record(report.hard_gates);
  let technicalFailed = false;
  if (technicalInvalid) invalid('GATES_SHAPE', 'shape', 'hard_gates', 'hard_gates must be an object.');
  const gateResults = [];
  for (const [name, required] of Object.entries(rubric.hard_gates)) {
    if (typeof required !== 'boolean') continue;
    const value = gates[name];
    let status = 'REPORTED PASS';
    if (!own(gates, name) || typeof value !== 'boolean') {
      invalid('GATE_BOOLEAN_REQUIRED', 'shape', `hard_gates.${name}`, 'Required hard gate must be a literal boolean.');
      technicalInvalid = true;
      status = 'INVALID';
    } else if (value !== required) {
      add('GATE_FAILED', 'technical', `hard_gates.${name}`, 'The report declares a failed hard gate.');
      technicalFailed = true;
      status = 'REPORTED FAIL';
    }
    gateResults.push({ name, reported: typeof value === 'boolean' ? value : null, status });
  }

  function inspectMetrics(metrics, category, location) {
    const result = { status: 'REPORTED PASS', metrics: {} };
    let incomplete = false;
    let malformed = false;
    let failed = false;
    if (!record(metrics)) {
      invalid('METRICS_SHAPE', 'shape', location, 'Metrics must be an object.');
      malformed = true;
      metrics = {};
    }
    for (const name of metricNames) {
      const limit = limits[`${name}_max`];
      const value = metrics[name];
      let status = 'REPORTED PASS';
      if (missing(metrics, name, category, location)) {
        incomplete = true;
        status = 'UNMEASURED';
      } else if (!finiteNumber(value) || value < 0) {
        invalid('METRIC_INVALID', 'shape', `${location}.${name}`, 'Metric must be a finite nonnegative number.');
        malformed = true;
        status = 'INVALID';
      } else if (value > limit) {
        add('METRIC_LIMIT_EXCEEDED', category, `${location}.${name}`, `${value} exceeds the ${limit} rubric limit.`);
        failed = true;
        status = 'REPORTED FAIL';
      }
      result.metrics[name] = { value: ['UNMEASURED', 'INVALID'].includes(status) ? null : value, limit, status };
    }
    result.status = malformed ? 'INVALID' : failed ? 'REPORTED FAIL' : incomplete ? 'UNMEASURED' : 'REPORTED PASS';
    return result;
  }

  let diagnostics = { status: 'UNMEASURED', scope: 'UNKNOWN', metrics: null };
  if (!own(gates, 'core_web_vitals')) {
    pending('DIAGNOSTICS_MISSING', 'technical', 'hard_gates.core_web_vitals', 'Local performance diagnostics are unmeasured in this report.');
  } else {
    const metrics = gates.core_web_vitals;
    diagnostics = { ...inspectMetrics(metrics, 'technical', 'hard_gates.core_web_vitals'), scope: 'UNKNOWN' };
    if (record(metrics) && own(metrics, 'measurement_scope')) {
      if (typeof metrics.measurement_scope !== 'string' || !metrics.measurement_scope.trim()) {
        invalid('SCOPE_INVALID', 'shape', 'hard_gates.core_web_vitals.measurement_scope', 'measurement_scope must be a nonempty string.');
        diagnostics.status = 'INVALID';
      } else if (/\b(local|lab|synthetic|proxy|chromium|lighthouse|next-frame)\b/i.test(metrics.measurement_scope)) {
        diagnostics.scope = 'LOCAL/PROXY';
      } else if (metrics.measurement_scope === 'field') {
        diagnostics.scope = 'FIELD DECLARED';
      }
    }
    if (diagnostics.scope === 'UNKNOWN') pending('DIAGNOSTIC_SCOPE_UNKNOWN', 'technical', 'hard_gates.core_web_vitals.measurement_scope', 'The measurement scope is unknown; these numbers establish no field evidence.');
  }
  technicalInvalid ||= diagnostics.status === 'INVALID';
  technicalFailed ||= diagnostics.status === 'REPORTED FAIL';
  const technical = {
    status: technicalInvalid ? 'INVALID' : technicalFailed ? 'REPORTED FAIL' : diagnostics.status === 'UNMEASURED' ? 'INCOMPLETE' : 'REPORTED PASS',
    basis: 'Report declarations only; no browser executed or browser-run freshness verified.',
    gates: gateResults,
    core_web_vitals: diagnostics
  };

  const field = { status: 'PENDING', basis: 'Declared evidence only; sources are not fetched or independently verified.', measurement_scope: null, percentile: null, source: null, collected_at: null, metrics: null };
  const evidence = gates.field_core_web_vitals;
  const fieldPath = 'hard_gates.field_core_web_vitals';
  if (!own(gates, 'field_core_web_vitals') || typeof evidence === 'string') {
    pending('FIELD_EVIDENCE_PENDING', 'field', fieldPath, 'Provide structured field metrics, scope, percentile, source provenance, target, and collection date; a status string is not evidence.');
  } else if (!record(evidence)) {
    invalid('FIELD_EVIDENCE_SHAPE', 'shape', fieldPath, 'Field evidence must be an object; a boolean cannot establish a field pass.');
  } else {
    const before = issues.length;
    if (!missing(evidence, 'measurement_scope', 'field', fieldPath)) {
      if (typeof evidence.measurement_scope !== 'string') invalid('FIELD_SCOPE_INVALID', 'shape', `${fieldPath}.measurement_scope`, 'Field measurement_scope must be a string.');
      else {
        field.measurement_scope = evidence.measurement_scope;
        if (evidence.measurement_scope !== 'field') pending('FIELD_SCOPE_UNVERIFIED', 'field', `${fieldPath}.measurement_scope`, 'Only the exact field scope qualifies; local, synthetic, and proxy measurements do not.');
      }
    }
    if (!missing(evidence, 'percentile', 'field', fieldPath)) {
      if (!finiteNumber(evidence.percentile) || evidence.percentile < 0 || evidence.percentile > 100) invalid('FIELD_PERCENTILE_INVALID', 'shape', `${fieldPath}.percentile`, 'percentile must be a finite number from 0 through 100.');
      else {
        field.percentile = evidence.percentile;
        if (evidence.percentile !== limits.field_percentile) pending('FIELD_PERCENTILE_UNVERIFIED', 'field', `${fieldPath}.percentile`, `The rubric requires the ${limits.field_percentile}th percentile.`);
      }
    }
    if (!missing(evidence, 'source', 'field', fieldPath)) {
      if (!record(evidence.source)) invalid('FIELD_SOURCE_SHAPE', 'shape', `${fieldPath}.source`, 'source must identify its type, evidence URL, and measured target URL/origin.');
      else {
        const source = evidence.source;
        field.source = { type: source.type ?? null, url: source.url ?? null, target: source.target ?? null };
        for (const key of ['type', 'url', 'target']) {
          if (missing(source, key, 'field', `${fieldPath}.source`)) continue;
          if (typeof source[key] !== 'string' || !source[key].trim()) invalid('FIELD_SOURCE_INVALID', 'shape', `${fieldPath}.source.${key}`, 'Source provenance must be a nonempty string.');
          else if (key === 'type' && !['crux', 'rum'].includes(source.type)) pending('FIELD_SOURCE_UNSUPPORTED', 'field', `${fieldPath}.source.type`, 'The field source must be crux or rum.');
          else if (key !== 'type' && !isHttpsUrl(source[key])) invalid('FIELD_SOURCE_URL_INVALID', 'shape', `${fieldPath}.source.${key}`, 'Provide an HTTPS URL without embedded credentials.');
        }
      }
    }
    if (!missing(evidence, 'collected_at', 'field', fieldPath)) {
      if (!isDate(evidence.collected_at) || evidence.collected_at > today) invalid('FIELD_DATE_INVALID', 'shape', `${fieldPath}.collected_at`, 'collected_at must be a real YYYY-MM-DD date that is not in the future.');
      else field.collected_at = evidence.collected_at;
    }
    if (!missing(evidence, 'metrics', 'field', fieldPath)) {
      const measured = inspectMetrics(evidence.metrics, 'field', `${fieldPath}.metrics`);
      field.metrics = measured.metrics;
      if (measured.status === 'REPORTED FAIL') field.status = 'REPORTED FAIL';
    }
    if (issues.length === before) field.status = 'REPORTED PASS';
  }
  if (requireField && field.status !== 'REPORTED PASS') add('FIELD_REQUIRED', 'field', fieldPath, '--require-field requires a complete, passing field evidence contract.');

  const internalPass = design.status === 'PASS' && technical.status === 'REPORTED PASS' && field.status !== 'REPORTED FAIL';
  const decision = !valid ? 'INVALID' : internalPass ? 'INTERNAL PASS' : 'HOLD';
  const nextActions = [];
  if (!valid) nextActions.push('Repair report shape and inconsistent declarations before using this audit.');
  if (design.status === 'HOLD') nextActions.push('Improve the artifact and obtain an independent review; preserve rubric thresholds and category floors.');
  if (technical.status === 'REPORTED FAIL') nextActions.push('Fix reported technical failures and rerun browser QA and performance diagnostics.');
  if (technical.status === 'INCOMPLETE') nextActions.push('Measure and record missing performance diagnostics with their measurement scope.');
  if (field.status === 'PENDING') nextActions.push('Collect real-user field evidence and record the documented field evidence contract.');
  if (field.status === 'REPORTED FAIL') nextActions.push('Resolve the reported field performance failure and collect new field evidence.');
  if (decision === 'INTERNAL PASS') nextActions.push('Review actual browser and source evidence before release; this read-only audit verifies report declarations only.');
  return { valid, total, design, technical, field, decision, ok: valid && internalPass && (!requireField || field.status === 'REPORTED PASS'), require_field: requireField, issues, next_actions: nextActions };
}

function inputFailure(reportPath, code, message) {
  return { report_path: reportPath, valid: false, total: null, design: { status: 'INVALID' }, technical: { status: 'INVALID' }, field: { status: 'PENDING' }, decision: 'INVALID', ok: false, issues: [{ code, severity: 'error', category: 'input', path: '$', message }], next_actions: ['Provide a readable JSON report and rerun the audit.'] };
}

export function auditQualityFile(reportPath = path.join(process.cwd(), 'design-quality-review.json'), options = {}) {
  const resolved = path.resolve(reportPath);
  let source;
  try {
    source = fs.readFileSync(resolved, 'utf8');
  } catch (error) {
    return inputFailure(resolved, 'REPORT_UNREADABLE', `Could not read report (${error.code || 'read error'}).`);
  }
  let report;
  try {
    report = JSON.parse(source.replace(/^\uFEFF/, ''));
  } catch {
    return inputFailure(resolved, 'REPORT_JSON_INVALID', 'Report is not valid JSON.');
  }
  const rubric = JSON.parse(fs.readFileSync(options.rubricPath || defaultRubricPath, 'utf8'));
  return { report_path: resolved, ...auditQualityReport(report, rubric, options) };
}

export function formatQualityAudit(result) {
  const lines = [
    `${result.decision} | FIELD ${result.field.status}`,
    ...(result.report_path ? [`Report: ${result.report_path}`] : []),
    `Report integrity: ${result.valid ? 'VALID' : 'INVALID'}`,
    `Design: ${result.design.status}${result.total === null ? '' : ` (${result.total}/100; threshold ${result.design.threshold})`}`,
    `Technical: ${result.technical.status} (report declarations; no browser executed)`,
    ...(result.technical.core_web_vitals ? [`Performance diagnostics: ${result.technical.core_web_vitals.status}; scope ${result.technical.core_web_vitals.scope}`] : []),
    'Field evidence is assessed from declarations; sources and deployment freshness are not independently verified.'
  ];
  for (const issue of result.issues) lines.push(`- ${issue.severity.toUpperCase()} ${issue.code} [${issue.path}]: ${issue.message}`);
  for (const action of result.next_actions) lines.push(`Next: ${action}`);
  return lines.join('\n');
}
