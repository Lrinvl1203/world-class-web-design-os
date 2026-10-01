import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { auditQualityFile, auditQualityReport, formatQualityAudit } from '../scripts/lib/quality-audit.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'cli', 'web-design-os.mjs');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const rubric = read('config/design-quality-rubric.json');
const sample = () => read('examples/design-quality-score.sample.json');
const now = new Date('2026-10-02T12:00:00Z');
const audit = (report, options = {}) => auditQualityReport(report, rubric, { now, ...options });
const hasIssue = (result, code) => result.issues.some(issue => issue.code === code);
const run = (args, cwd = root) => spawnSync(process.execPath, [cli, 'audit', ...args], { cwd, encoding: 'utf8' });

function fieldReport() {
  const report = sample();
  report.hard_gates.field_core_web_vitals = {
    measurement_scope: 'field',
    percentile: 75,
    source: { type: 'crux', url: 'https://evidence.example/reports/2026-10-01', target: 'https://project.example/' },
    collected_at: '2026-10-01',
    metrics: { lcp_ms: 2500, inp_ms: 200, cls: 0.1 }
  };
  return report;
}

test('real prior Nocturne report passes internal checks with local proxy scope and field pending', () => {
  const result = audit(read('experiments/nocturne-concierge/design-quality-review.json'));
  assert.equal(result.valid, true);
  assert.equal(result.total, 92.8);
  assert.equal(result.decision, 'INTERNAL PASS');
  assert.equal(result.technical.status, 'REPORTED PASS');
  assert.equal(result.technical.core_web_vitals.scope, 'LOCAL/PROXY');
  assert.equal(result.field.status, 'PENDING');
  assert.equal(result.ok, true);
  assert.match(formatQualityAudit(result), /no browser executed/);
});

test('real Linehold report remains a valid 91.8 HOLD despite its passing technical declarations', () => {
  const report = read('experiments/linehold-forge/design-quality-review.json');
  report.release_decision = 'PASS'; // Free text cannot override the computed decision.
  const result = audit(report);
  assert.equal(result.valid, true);
  assert.equal(result.total, 91.8);
  assert.equal(result.design.status, 'HOLD');
  assert.equal(result.technical.status, 'REPORTED PASS');
  assert.equal(result.decision, 'HOLD');
  assert.equal(result.field.status, 'PENDING');
  assert.equal(result.ok, false);
  assert.ok(hasIssue(result, 'TOTAL_BELOW_THRESHOLD'));
});

test('newer reference reports keep their design score and expose missing performance measurements', () => {
  for (const [name, total] of [['afterimage-atlas', 92.7], ['sequence-desk', 92.8], ['orbital-commons', 94.3]]) {
    const result = audit(read(`experiments/${name}/design-quality-review.json`));
    assert.equal(result.valid, true, name);
    assert.equal(result.total, total, name);
    assert.equal(result.design.status, 'PASS', name);
    assert.equal(result.technical.status, 'INCOMPLETE', name);
    assert.equal(result.technical.core_web_vitals.metrics, null, name);
    assert.equal(result.decision, 'HOLD', name);
    assert.equal(result.field.status, 'PENDING', name);
    assert.equal(result.ok, false, name);
  }
});

test('scope-free sample reaches exactly 92 while its field evidence and scope stay unknown', () => {
  const result = audit(sample());
  assert.equal(result.valid, true);
  assert.equal(result.total, 92);
  assert.equal(result.ok, true);
  assert.equal(result.technical.core_web_vitals.scope, 'UNKNOWN');
  assert.equal(result.field.status, 'PENDING');
  const required = audit(sample(), { requireField: true });
  assert.equal(required.ok, false);
  assert.equal(required.decision, 'INTERNAL PASS');
  assert.ok(hasIssue(required, 'FIELD_REQUIRED'));
});

test('malformed top-level, scores, and gates are invalid without throwing', () => {
  for (const value of [null, [], true, 'pass', 42]) {
    assert.equal(audit(value).valid, false);
    for (const key of ['scores', 'hard_gates']) {
      const report = sample();
      report[key] = value;
      assert.equal(audit(report).valid, false, `${key}: ${String(value)}`);
    }
  }
});

test('every required category rejects missing, unknown, nonnumeric, infinite, and out-of-range scores', () => {
  for (const [name, rule] of Object.entries(rubric.categories)) {
    for (const value of [true, false, '1', null, [], {}, NaN, Infinity, -Infinity, -0.01, rule.max + 0.01]) {
      const report = sample();
      report.scores[name] = value;
      const result = audit(report);
      assert.equal(result.valid, false, `${name}: ${String(value)}`);
      assert.equal(result.total, null);
      assert.equal(result.ok, false);
    }
    const report = sample();
    delete report.scores[name];
    assert.ok(hasIssue(audit(report), 'SCORE_MISSING'), name);
  }
  const report = sample();
  report.scores.extra_credit = 100;
  assert.ok(hasIssue(audit(report), 'SCORE_UNKNOWN'));
  assert.equal(audit(report).total, null);
});

test('category floors and release threshold are independently enforced with inclusive boundaries', () => {
  const report = sample();
  for (const [name, rule] of Object.entries(rubric.categories)) report.scores[name] = rule.max;
  report.scores.typography = rubric.categories.typography.floor;
  assert.equal(audit(report).ok, true);
  report.scores.typography -= 0.1;
  const below = audit(report);
  assert.ok(below.total > 92);
  assert.equal(below.valid, true);
  assert.equal(below.ok, false);
  assert.ok(hasIssue(below, 'SCORE_BELOW_FLOOR'));
  const threshold = sample();
  assert.equal(audit(threshold).ok, true);
  threshold.scores.composition -= 0.01;
  assert.equal(audit(threshold).ok, false);
});

test('optional totals and thresholds must be real numbers consistent with the rubric and actual sum', () => {
  for (const key of ['wdx_total', 'release_threshold']) {
    for (const value of [true, false, '92', null, [], NaN, Infinity, -1, 91, 93]) {
      const report = sample();
      report[key] = value;
      assert.equal(audit(report).valid, false, `${key}: ${String(value)}`);
    }
  }
  const report = sample();
  report.wdx_total = 92;
  report.release_threshold = 92;
  assert.equal(audit(report).valid, true);
});

test('hard gates require strict booleans and explicit false remains a valid technical failure', () => {
  const names = Object.keys(rubric.hard_gates).filter(name => typeof rubric.hard_gates[name] === 'boolean');
  for (const name of names) {
    for (const value of ['true', 'false', 1, 0, null, [], {}]) {
      const report = sample();
      report.hard_gates[name] = value;
      assert.equal(audit(report).valid, false, name);
    }
    const missing = sample();
    delete missing.hard_gates[name];
    assert.equal(audit(missing).valid, false, name);
    const failed = sample();
    failed.hard_gates[name] = false;
    const result = audit(failed);
    assert.equal(result.valid, true, name);
    assert.equal(result.technical.status, 'REPORTED FAIL', name);
    assert.equal(result.ok, false, name);
  }
});

test('local and field metrics reject invalid numbers and enforce inclusive metric limits', () => {
  for (const kind of ['local', 'field']) {
    for (const [name, limit] of [['lcp_ms', 2500], ['inp_ms', 200], ['cls', 0.1]]) {
      const values = [true, false, '1', null, [], {}, NaN, Infinity, -Infinity, -0.001];
      for (const value of values) {
        const report = fieldReport();
        const metrics = kind === 'local' ? report.hard_gates.core_web_vitals : report.hard_gates.field_core_web_vitals.metrics;
        metrics[name] = value;
        assert.equal(audit(report).valid, false, `${kind}.${name}: ${String(value)}`);
      }
      const report = fieldReport();
      const metrics = kind === 'local' ? report.hard_gates.core_web_vitals : report.hard_gates.field_core_web_vitals.metrics;
      metrics[name] = limit;
      assert.equal(audit(report, { requireField: true }).ok, true, `${kind}.${name} at limit`);
      metrics[name] = limit + 0.001;
      const failed = audit(report);
      assert.equal(failed.valid, true);
      assert.equal(failed.ok, false);
      assert.ok(hasIssue(failed, 'METRIC_LIMIT_EXCEEDED'));
      metrics[name] = 0;
      assert.equal(audit(report).ok, true);
      delete metrics[name];
      const absent = audit(report, { requireField: true });
      assert.equal(absent.valid, true);
      assert.equal(absent.ok, false);
    }
  }
});

test('malformed metric containers and scope never become passing declarations', () => {
  for (const value of [null, [], true, 1, 'passed']) {
    const report = sample();
    report.hard_gates.core_web_vitals = value;
    assert.equal(audit(report).valid, false);
  }
  const report = sample();
  report.hard_gates.core_web_vitals.measurement_scope = true;
  assert.equal(audit(report).valid, false);
  report.hard_gates.core_web_vitals.measurement_scope = 'field';
  assert.equal(audit(report, { requireField: true }).ok, false);
});

test('vague field status, booleans, and lab proxies cannot satisfy field-required policy', () => {
  for (const value of ['PASS', 'passed', 'verified', 'PENDING_REAL_DEPLOYMENT', true, false, { passed: true }, {}]) {
    const report = sample();
    report.hard_gates.field_core_web_vitals = value;
    const result = audit(report, { requireField: true });
    assert.equal(result.field.status, 'PENDING');
    assert.equal(result.ok, false);
  }
  for (const scope of ['local', 'lab', 'field proxy', 'Local Chromium diagnostic', 'FIELD', '']) {
    const report = fieldReport();
    report.hard_gates.field_core_web_vitals.measurement_scope = scope;
    assert.equal(audit(report, { requireField: true }).ok, false, scope);
  }
});

test('complete synthetic field evidence is a declared pass only and is read without mutation', () => {
  const report = fieldReport();
  const before = structuredClone(report);
  const result = audit(report, { requireField: true });
  assert.equal(result.valid, true);
  assert.equal(result.field.status, 'REPORTED PASS');
  assert.equal(result.ok, true);
  assert.equal(result.decision, 'INTERNAL PASS');
  assert.match(result.field.basis, /not fetched or independently verified/);
  assert.deepEqual(report, before);
  assert.deepEqual(audit(report, { requireField: true }), result);
  report.hard_gates.field_core_web_vitals.source.type = 'rum';
  assert.equal(audit(report, { requireField: true }).ok, true);
});

test('each field evidence component is required and provenance/date/percentile fail closed', () => {
  for (const key of ['measurement_scope', 'percentile', 'source', 'collected_at', 'metrics']) {
    const report = fieldReport();
    delete report.hard_gates.field_core_web_vitals[key];
    assert.equal(audit(report, { requireField: true }).ok, false, key);
    assert.equal(audit(report).field.status, 'PENDING', key);
  }
  for (const key of ['type', 'url', 'target']) {
    const report = fieldReport();
    delete report.hard_gates.field_core_web_vitals.source[key];
    assert.equal(audit(report, { requireField: true }).ok, false, key);
  }
  for (const [key, values] of [
    ['percentile', [true, '75', NaN, -1, 101, 50, 95]],
    ['collected_at', ['2026-10-03', '2026-02-30', '2026-13-01', '2026-10-01T12:00:00Z', 'yesterday', true]],
    ['source', [null, [], 'CrUX', true]],
    ['metrics', [null, [], true]]
  ]) {
    for (const value of values) {
      const report = fieldReport();
      report.hard_gates.field_core_web_vitals[key] = value;
      assert.equal(audit(report, { requireField: true }).ok, false, `${key}: ${String(value)}`);
    }
  }
  for (const [key, values] of [
    ['type', ['lighthouse', '', true]],
    ['url', ['http://example.com', 'javascript:alert(1)', 'file:///report', 'https://user:secret@example.com', '']],
    ['target', ['not-a-url', '', true]]
  ]) {
    for (const value of values) {
      const report = fieldReport();
      report.hard_gates.field_core_web_vitals.source[key] = value;
      assert.equal(audit(report, { requireField: true }).ok, false, `source.${key}: ${String(value)}`);
    }
  }
});

test('CLI default path follows project cwd and boolean flags never consume the report path', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'quality-audit-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const destination = path.join(temp, 'design-quality-review.json');
  fs.writeFileSync(destination, JSON.stringify(sample()));
  const before = fs.readFileSync(destination, 'utf8');
  for (const args of [['--json'], ['--json', destination], [destination, '--json']]) {
    const result = run(args, temp);
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.report_path, destination);
    assert.equal(output.total, 92);
  }
  assert.equal(run(['--require-field', '--json', destination], temp).status, 1);
  assert.equal(fs.readFileSync(destination, 'utf8'), before);
  assert.deepEqual(fs.readdirSync(temp), ['design-quality-review.json']);
});

test('CLI returns structured input errors and exposes real HOLD through nonzero exit', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'quality-audit-input-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const invalidFile = path.join(temp, 'invalid.json');
  fs.writeFileSync(invalidFile, '{');
  for (const [report, code] of [[invalidFile, 'REPORT_JSON_INVALID'], [path.join(temp, 'missing.json'), 'REPORT_UNREADABLE']]) {
    const result = run(['--json', report]);
    assert.equal(result.status, 1);
    const output = JSON.parse(result.stdout);
    assert.equal(output.valid, false);
    assert.ok(hasIssue(output, code));
  }
  fs.writeFileSync(invalidFile, fs.readFileSync(path.join(root, 'examples/design-quality-score.sample.json'), 'utf8').replace('2100', '1e999'));
  assert.equal(auditQualityFile(invalidFile).valid, false);
  const held = run(['experiments/linehold-forge/design-quality-review.json', '--json']);
  assert.equal(held.status, 1);
  assert.equal(JSON.parse(held.stdout).decision, 'HOLD');
  assert.equal(run(['--unknown']).status, 1);
  assert.equal(run(['one.json', 'two.json']).status, 1);
});
