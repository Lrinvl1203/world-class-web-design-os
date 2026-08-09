#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { routeSkills, root } from '../scripts/lib/routing.mjs';
import { installSkills } from '../scripts/install-global.mjs';
import { runEvolution } from '../scripts/evolution/run.mjs';

function value(flag, fallback) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function positional(start = 3) {
  const result = [];
  for (let index = start; index < process.argv.length; index += 1) {
    if (process.argv[index].startsWith('--')) {
      index += 1;
      continue;
    }
    result.push(process.argv[index]);
  }
  return result;
}

function printHelp() {
  console.log(`WDX CLI

  wdx route "task description"             Route to at most three active specialists
  wdx search "editorial motion" [--limit 8] Search the evidence atlas
  wdx setup [target]                        Create .wdx/project-context.md
  wdx install --agent codex|all [--overwrite]
  wdx evolve [--offline] [--date YYYY-MM-DD]
  wdx eval                                 Run routing and evolution regression tests`);
}

function searchAtlas(query, limit = 8) {
  const atlas = fs.readFileSync(path.join(root, '.codex', 'skills', 'reference-forensics', 'references', 'award-pattern-atlas.md'), 'utf8');
  const tokens = String(query).toLocaleLowerCase().split(/[^\p{L}\p{N}.+]+/u).filter(Boolean);
  const rows = atlas.split(/\r?\n/).filter(line => /^\|\s*\d+\s*\|/.test(line));
  return rows.map(line => {
    const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
    const haystack = line.toLocaleLowerCase();
    const score = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
    return { score, id: cells[0], reference: cells[1], source: cells[2], evidence: cells[3], lesson: cells[4], warning: cells[5] };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score || Number(a.id) - Number(b.id)).slice(0, limit);
}

const command = process.argv[2];

try {
  if (!command || ['help', '--help', '-h'].includes(command)) {
    printHelp();
  } else if (command === 'route') {
    const input = positional().join(' ');
    if (!input) throw new Error('Provide a task description.');
    console.log(JSON.stringify(routeSkills(input, { limit: Number(value('--limit', 3)) }), null, 2));
  } else if (command === 'search') {
    const query = positional().join(' ');
    if (!query) throw new Error('Provide search terms.');
    const results = searchAtlas(query, Number(value('--limit', 8)));
    if (!results.length) console.log('No evidence atlas matches. Broaden the query.');
    results.forEach(item => console.log(`[${item.evidence}] ${item.reference}\n  ${item.lesson}\n  Avoid: ${item.warning}`));
  } else if (command === 'setup') {
    const target = path.resolve(positional()[0] || process.cwd());
    const destination = path.join(target, '.wdx', 'project-context.md');
    if (fs.existsSync(destination)) throw new Error(`Will not overwrite ${destination}`);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, 'templates', 'project-context.md'), destination);
    console.log(destination);
  } else if (command === 'install') {
    const installed = installSkills({
      agent: value('--agent', 'codex'),
      targetRoot: value('--root'),
      overwrite: process.argv.includes('--overwrite')
    });
    installed.forEach(item => console.log(`${item.agent}: ${item.destination}`));
  } else if (command === 'evolve') {
    const result = await runEvolution({ offline: process.argv.includes('--offline'), date: value('--date') });
    console.log(`Collected ${result.signals.length} signals; ${result.proposals.length} proposal(s).`);
    console.log(result.reportPath);
  } else if (command === 'eval') {
    const commands = [
      ['node', ['scripts/evaluate-routes.mjs']],
      ['node', ['--test', 'tests/evolution.test.mjs']]
    ];
    for (const [program, args] of commands) {
      const result = spawnSync(program, args, { cwd: root, stdio: 'inherit' });
      if (result.status !== 0) process.exit(result.status ?? 1);
    }
  } else {
    throw new Error(`Unknown command '${command}'. Run 'wdx help'.`);
  }
} catch (error) {
  console.error(`wdx: ${error.message}`);
  process.exit(1);
}
