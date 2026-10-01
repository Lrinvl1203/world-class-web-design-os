import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { auditProofReports, formatProofAudit } from '../scripts/audit-proof.mjs';

test('public proof integrity does not convert HOLD or missing measurements into release readiness', () => {
  const result = auditProofReports();
  assert.equal(result.integrity_ok, true);
  assert.equal(result.reports.length, 5);
  assert.equal(result.design_passes, 4);
  assert.equal(result.internal_passes, 1);
  assert.equal(result.field_reported_passes, 0);
  assert.equal(result.reports.find(report => report.id === 'linehold-forge').decision, 'HOLD');
  assert.match(formatProofAudit(result), /Integrity success is not release readiness/);
});

test('deleting a seeded proof report cannot silently remove it from the audit', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-design-os-proof-audit-'));
  try {
    fs.mkdirSync(path.join(temp, 'marketing'));
    fs.writeFileSync(path.join(temp, 'marketing', 'content-seeds.json'), JSON.stringify({ seeds: [{ id: 'missing-case' }] }));
    const result = auditProofReports({ repositoryRoot: temp });
    assert.equal(result.reports.length, 1);
    assert.equal(result.integrity_ok, false);
    assert.equal(result.reports[0].decision, 'INVALID');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('proof ids cannot escape the experiments directory or count twice', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-design-os-proof-ids-'));
  try {
    fs.mkdirSync(path.join(temp, 'marketing'));
    const file = path.join(temp, 'marketing', 'content-seeds.json');
    fs.writeFileSync(file, JSON.stringify({ seeds: [{ id: '../outside' }] }));
    assert.throws(() => auditProofReports({ repositoryRoot: temp }), /safe experiment directory names/);
    fs.writeFileSync(file, JSON.stringify({ seeds: [{ id: 'one' }, { id: 'one' }] }));
    assert.throws(() => auditProofReports({ repositoryRoot: temp }), /unique/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
