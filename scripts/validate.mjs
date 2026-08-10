import { spawnSync } from 'node:child_process';

const distribution = spawnSync(process.execPath, ['scripts/validate-distribution.mjs'], {
  stdio: 'inherit'
});
if ((distribution.status ?? 1) !== 0) process.exit(distribution.status ?? 1);

const candidates = process.platform === 'win32'
  ? [['py', ['-3']], ['python3', []], ['python', []]]
  : [['python3', []], ['python', []], ['py', ['-3']]];

function runPython(script, args = []) {
  for (const [command, prefix] of candidates) {
    const result = spawnSync(command, [...prefix, script, ...args], {
      stdio: 'inherit'
    });

    if (result.error?.code === 'ENOENT') continue;
    if (process.platform === 'win32' && result.status === 9009) continue;
    return result.status ?? 1;
  }

  console.error('No working Python 3 interpreter was found.');
  return 1;
}

const validations = [
  ['scripts/validate_skills.py'],
  ['scripts/validate_design_quality_score.py', ['examples/design-quality-score.sample.json']]
];

for (const [script, args] of validations) {
  const status = runPython(script, args);
  if (status !== 0) process.exit(status);
}
