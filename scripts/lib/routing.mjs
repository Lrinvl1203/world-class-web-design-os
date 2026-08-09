import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function loadRoutes() {
  return JSON.parse(fs.readFileSync(path.join(root, 'config', 'skill-routes.json'), 'utf8'));
}

export function routeSkills(input, options = {}) {
  const config = loadRoutes();
  const normalized = String(input || '').toLocaleLowerCase();
  const scored = config.routes.map((route, index) => {
    const matches = route.keywords.filter(keyword => normalized.includes(keyword.toLocaleLowerCase()));
    return { skill: route.skill, score: matches.length, matches, index };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const fullBuild = /\b(build|design|redesign|website|landing page|web app)\b|웹사이트|웹페이지|랜딩|리디자인|디자인해/.test(normalized);
  const limit = Number(options.limit || config.maxActiveSpecialists || 3);
  const selected = scored.slice(0, Math.max(1, limit));

  return {
    orchestrator: fullBuild ? config.alwaysStartForFullBuild : null,
    specialists: selected,
    contextBudget: limit,
    note: 'Load only these specialists for the current phase; re-route when the phase changes.'
  };
}

export { root };
