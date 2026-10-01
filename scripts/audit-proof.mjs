import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root } from './lib/routing.mjs';
import { auditQualityFile } from './lib/quality-audit.mjs';

// The public content seeds require reports even if one is accidentally deleted.
// Include additional experiments too, so an unlisted report cannot escape review.
export function auditProofReports({ repositoryRoot = root } = {}) {
  const seeds = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'marketing', 'content-seeds.json'), 'utf8')).seeds;
  if (!Array.isArray(seeds) || seeds.length === 0) throw new Error('Public proof seeds must be a non-empty array.');
  const ids = seeds.map(seed => seed?.id);
  if (ids.some(id => typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))) {
    throw new Error('Public proof ids must be safe experiment directory names.');
  }
  if (new Set(ids).size !== ids.length) throw new Error('Public proof ids must be unique.');
  const experiments = path.join(repositoryRoot, 'experiments');
  if (fs.existsSync(experiments)) {
    for (const entry of fs.readdirSync(experiments, { withFileTypes: true })) {
      if (entry.isDirectory() && fs.existsSync(path.join(experiments, entry.name, 'design-quality-review.json'))) ids.push(entry.name);
    }
  }
  const reports = [...new Set(ids)].sort().map(id => {
    const report = `experiments/${id}/design-quality-review.json`;
    try {
      return { id, report, ...auditQualityFile(path.join(repositoryRoot, report)) };
    } catch (error) {
      return { id, report, valid: false, total: null, decision: 'INVALID', ok: false,
        design: { status: 'INVALID' }, technical: { status: 'INVALID' }, field: { status: 'PENDING' },
        issues: [{ code: 'report_unreadable', severity: 'error', category: 'integrity', path: report, message: error.message }] };
    }
  });
  return {
    basis: 'Recorded report integrity and declarations; no browser or field data was collected by this audit.',
    integrity_ok: reports.every(report => report.valid),
    design_passes: reports.filter(report => report.design.status === 'PASS').length,
    internal_passes: reports.filter(report => report.decision === 'INTERNAL PASS').length,
    field_reported_passes: reports.filter(report => report.field.status === 'REPORTED PASS').length,
    reports
  };
}

export function formatProofAudit(result) {
  const lines = [result.basis, '', 'Case | Score | Design | Reported technical checks | Field evidence | Decision'];
  for (const report of result.reports) {
    lines.push(`${report.id} | ${report.total ?? 'unknown'} | ${report.design.status} | ${report.technical.status} | ${report.field.status} | ${report.decision}`);
    for (const issue of report.issues.filter(issue => issue.severity === 'error')) lines.push(`  ${issue.code}: ${issue.message}`);
  }
  lines.push('', `Proof report integrity: ${result.integrity_ok ? 'VALID' : 'INVALID'} (${result.reports.length} reports).`,
    `Design thresholds: ${result.design_passes}/${result.reports.length}; internal declarations: ${result.internal_passes}/${result.reports.length}; reported field passes: ${result.field_reported_passes}/${result.reports.length}.`,
    'HOLD, INCOMPLETE, and PENDING remain visible. Integrity success is not release readiness.');
  return lines.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = auditProofReports();
    console.log(process.argv.includes('--json') ? JSON.stringify(result, null, 2) : formatProofAudit(result));
    if (!result.integrity_ok) process.exitCode = 1;
  } catch (error) {
    console.error(`audit-proof: ${error.message}`);
    process.exitCode = 1;
  }
}
