import fs from 'node:fs';
import path from 'node:path';
import { routeSkills, root } from './lib/routing.mjs';

const cases = JSON.parse(fs.readFileSync(path.join(root, 'evals', 'routing-cases.json'), 'utf8'));
let failures = 0;

for (const item of cases) {
  const result = routeSkills(item.input);
  const actual = [result.orchestrator, ...result.specialists.map(entry => entry.skill)].filter(Boolean);
  const missing = item.mustInclude.filter(skill => !actual.includes(skill));
  const forbidden = item.mustExclude.filter(skill => actual.includes(skill));
  if (missing.length || forbidden.length) {
    failures += 1;
    console.error(`FAIL: ${item.input}\n  actual=${actual.join(', ')}\n  missing=${missing.join(', ')} forbidden=${forbidden.join(', ')}`);
  }
}

if (failures) process.exit(1);
console.log(`Routing eval passed: ${cases.length}/${cases.length}`);
