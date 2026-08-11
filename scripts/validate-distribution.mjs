import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'config', 'distribution.json');
const planPath = path.join(root, 'docs', 'growth-launch-plan.md');
const readmePath = path.join(root, 'README.md');
const allowedStatuses = new Set(['pending', 'published', 'scheduled', 'pr_open', 'merged', 'rejected']);

export function validateDistribution({ manifest, plan, readme, now = new Date() }) {
  const errors = [];
  const ids = new Set();

  if (manifest.schema_version !== 1) errors.push('schema_version must be 1');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.updated_on || '')) errors.push('updated_on must be YYYY-MM-DD');
  if (!Array.isArray(manifest.channels) || manifest.channels.length === 0) {
    errors.push('channels must be a non-empty array');
    return errors;
  }

  for (const [index, entry] of manifest.channels.entries()) {
    const label = entry.id || `channels[${index}]`;
    if (!/^[a-z0-9-]+$/.test(entry.id || '')) errors.push(`${label}: id must be kebab-case`);
    if (ids.has(entry.id)) errors.push(`${label}: duplicate id`);
    ids.add(entry.id);
    if (!entry.channel?.trim()) errors.push(`${label}: channel is required`);
    if (!allowedStatuses.has(entry.status)) errors.push(`${label}: unsupported status ${entry.status}`);

    if (entry.status === 'pending') {
      if (!entry.blocker?.trim()) errors.push(`${label}: pending entries require a blocker`);
      if (entry.featured) errors.push(`${label}: pending entries cannot be featured`);
      continue;
    }

    if (!entry.url) {
      errors.push(`${label}: ${entry.status} entries require a URL`);
      continue;
    }

    try {
      const parsed = new URL(entry.url);
      if (parsed.protocol !== 'https:') errors.push(`${label}: URL must use HTTPS`);
      if (entry.status === 'pr_open' && !/^\/[^/]+\/[^/]+\/pull\/\d+\/?$/.test(parsed.pathname)) {
        errors.push(`${label}: pr_open URL must point to a GitHub pull request`);
      }
    } catch {
      errors.push(`${label}: URL is invalid`);
    }

    if (!plan.includes(entry.url)) errors.push(`${label}: URL is missing from docs/growth-launch-plan.md`);
    if (entry.featured && !readme.includes(entry.url)) errors.push(`${label}: featured URL is missing from README.md`);
    if (entry.status === 'published' && !/^\d{4}-\d{2}-\d{2}$/.test(entry.published_on || '')) {
      errors.push(`${label}: published entries require published_on`);
    }
    if (entry.status === 'scheduled') {
      const scheduledAt = Date.parse(entry.scheduled_for || '');
      if (Number.isNaN(scheduledAt)) {
        errors.push(`${label}: scheduled entries require an ISO scheduled_for value`);
      } else if (scheduledAt < now.getTime()) {
        errors.push(`${label}: scheduled_for has passed; verify the channel and update its status`);
      }
    }
  }

  return errors;
}

export function validateRepositoryDistribution() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const plan = fs.readFileSync(planPath, 'utf8');
  const readme = fs.readFileSync(readmePath, 'utf8');
  return validateDistribution({ manifest, plan, readme });
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const errors = validateRepositoryDistribution();
  if (errors.length) {
    console.error(errors.map(error => `- ${error}`).join('\n'));
    process.exit(1);
  }
  console.log('Distribution manifest: READY');
}
