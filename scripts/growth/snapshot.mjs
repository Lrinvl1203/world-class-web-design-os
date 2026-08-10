import fs from 'node:fs';
import path from 'node:path';

const repository = process.env.GITHUB_REPOSITORY || 'Lrinvl1203/world-class-web-design-os';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const output = path.resolve(process.env.GROWTH_SNAPSHOT_OUTPUT || 'artifacts/growth/latest.json');
const distribution = JSON.parse(fs.readFileSync(path.resolve('config/distribution.json'), 'utf8'));
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'world-class-web-design-os-growth-pulse',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
};

async function github(endpoint) {
  const response = await fetch(`https://api.github.com/repos/${repository}${endpoint}`, { headers });
  if (!response.ok) return { unavailable: true, status: response.status };
  return response.json();
}

const [repo, views, clones, referrers, paths, discussions] = await Promise.all([
  github(''),
  github('/traffic/views'),
  github('/traffic/clones'),
  github('/traffic/popular/referrers'),
  github('/traffic/popular/paths'),
  github('/discussions?per_page=10')
]);

const snapshot = {
  captured_at: new Date().toISOString(),
  repository,
  repository_signals: repo.unavailable ? repo : {
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    subscribers: repo.subscribers_count,
    open_issues: repo.open_issues_count
  },
  traffic: { views, clones, referrers, popular_paths: paths },
  distribution: {
    updated_on: distribution.updated_on,
    channels: distribution.channels.map(({ id, channel, status, url, published_on, scheduled_for, opened_on, blocker }) => ({
      id, channel, status, url, published_on, scheduled_for, opened_on, blocker
    }))
  },
  discussions: Array.isArray(discussions)
    ? discussions.map(({ number, title, html_url, comments, upvote_count }) => ({ number, title, html_url, comments, upvote_count }))
    : discussions
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(output);
