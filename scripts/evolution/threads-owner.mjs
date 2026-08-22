#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isThreadsPermalink, sanitizeText } from './run.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const defaultManualPath = path.join(projectRoot, 'evolution', 'manual-threads.json');

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function canonicalThreadsUrl(value) {
  const url = new URL(String(value || '').trim());
  if (!isThreadsPermalink(url.toString())) throw new Error('Only public threads.com or threads.net HTTPS permalinks are accepted.');
  url.hash = '';
  return url.toString();
}

function validPublishedAt(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf()) || date.valueOf() > Date.now() + 86_400_000) {
    throw new Error('Published time must be a valid date that is not in the future.');
  }
  return date.toISOString();
}

export function addManualThreadSignal({ filePath = defaultManualPath, url, title, excerpt = '', author = '', publishedAt = null }) {
  const canonicalUrl = canonicalThreadsUrl(url);
  const cleanTitle = sanitizeText(title, 500);
  if (!cleanTitle) throw new Error('A short factual title is required.');
  const records = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
  if (!Array.isArray(records)) throw new Error('The manual Threads queue must contain a JSON array.');
  if (records.length >= 200) throw new Error('The reviewed Threads queue is capped at 200 links; archive or remove stale entries before adding more.');
  if (records.some(record => canonicalThreadsUrl(record.url) === canonicalUrl)) throw new Error('That Threads URL is already in the reviewed queue.');
  records.push({
    url: canonicalUrl,
    title: cleanTitle,
    author: sanitizeText(author, 200),
    publishedAt: validPublishedAt(publishedAt),
    excerpt: sanitizeText(excerpt, 1000),
    platform: 'threads',
    principleHints: [],
    metrics: {}
  });
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(records, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, filePath);
  return records.at(-1);
}

export async function validateThreadsToken(token, fetchImpl = fetch) {
  const cleanToken = String(token || '').trim();
  if (!cleanToken) throw new Error('No Threads access token was provided.');
  const params = new URLSearchParams({
    q: 'web design',
    search_type: 'TOP',
    search_mode: 'KEYWORD',
    limit: '1',
    fields: 'id,permalink,text,timestamp,username'
  });
  const response = await fetchImpl(`https://graph.threads.net/keyword_search?${params}`, {
    headers: { authorization: `Bearer ${cleanToken}` }
  });
  if (!response.ok) {
    throw new Error(`Threads keyword search returned HTTP ${response.status}. Confirm threads_basic and threads_keyword_search permissions.`);
  }
  const payload = await response.json();
  if (!Array.isArray(payload.data)) throw new Error('Threads returned an unexpected keyword-search response.');
  return { valid: true, sampleCount: payload.data.length };
}

export async function refreshThreadsToken(token, fetchImpl = fetch) {
  const cleanToken = String(token || '').trim();
  if (!cleanToken) throw new Error('No long-lived Threads token was provided.');
  const params = new URLSearchParams({ grant_type: 'th_refresh_token' });
  const response = await fetchImpl(`https://graph.threads.net/refresh_access_token?${params}`, {
    headers: { authorization: `Bearer ${cleanToken}` }
  });
  if (!response.ok) throw new Error(`Threads token refresh returned HTTP ${response.status}. Refresh before the current long-lived token expires.`);
  const payload = await response.json();
  const refreshed = String(payload.access_token || '').trim();
  if (!refreshed) throw new Error('Threads did not return a refreshed access token.');
  return { token: refreshed, expiresIn: Number(payload.expires_in) || null };
}

export function setGitHubThreadsSecret(token, spawnImpl = spawnSync) {
  const cleanToken = String(token || '').trim();
  if (!cleanToken) throw new Error('Refusing to store an empty Threads token.');
  const result = spawnImpl('gh', ['secret', 'set', 'THREADS_ACCESS_TOKEN'], {
    cwd: projectRoot,
    input: `${cleanToken}\n`,
    encoding: 'utf8',
    windowsHide: true
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`GitHub rejected the secret update: ${sanitizeText(result.stderr || 'unknown error', 300)}`);
  return true;
}

export function githubThreadsSecretConfigured(spawnImpl = spawnSync) {
  const result = spawnImpl('gh', ['secret', 'list', '--json', 'name'], {
    cwd: projectRoot,
    encoding: 'utf8',
    windowsHide: true
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Unable to inspect GitHub secret names: ${sanitizeText(result.stderr || 'unknown error', 300)}`);
  return JSON.parse(result.stdout || '[]').some(secret => secret.name === 'THREADS_ACCESS_TOKEN');
}

async function readHidden(prompt) {
  if (!process.stdin.isTTY) {
    let input = '';
    for await (const chunk of process.stdin) input += chunk;
    return input.trim();
  }
  process.stderr.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  return new Promise((resolve, reject) => {
    let value = '';
    const finish = (error) => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stderr.write('\n');
      if (error) reject(error);
      else resolve(value.trim());
    };
    const onData = chunk => {
      for (const character of chunk) {
        if (character === '\u0003') return finish(new Error('Cancelled.'));
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u0008' || character === '\u007f') value = [...value].slice(0, -1).join('');
        else value += character;
      }
    };
    process.stdin.on('data', onData);
  });
}

async function askQuestions(initial = {}) {
  const { createInterface } = await import('node:readline/promises');
  const readline = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const url = initial.url || await readline.question('Threads permalink: ');
    const title = initial.title || await readline.question('Short factual title: ');
    const excerpt = initial.excerpt ?? await readline.question('Optional short observation/excerpt: ');
    const author = initial.author ?? await readline.question('Optional author handle: ');
    const publishedAt = initial.publishedAt ?? await readline.question('Optional published date/time (ISO or YYYY-MM-DD): ');
    return { url, title, excerpt, author, publishedAt };
  } finally {
    readline.close();
  }
}

function printHelp() {
  console.log(`Threads owner tools

  npm run threads:doctor
  npm run threads:connect
  npm run threads:refresh
  npm run threads:add

connect and refresh read the token through hidden input or stdin, validate the official keyword-search permission, and update the GitHub Actions secret without printing or storing the token. add accepts a manually reviewed public permalink and never scrapes Threads.`);
}

async function main() {
  const command = process.argv[2] || 'help';
  if (command === 'help' || command === '--help' || command === '-h') return printHelp();
  if (command === 'doctor') {
    const configured = githubThreadsSecretConfigured();
    console.log(`GitHub Actions THREADS_ACCESS_TOKEN: ${configured ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
    console.log('Live value validation requires `npm run threads:connect` or `npm run threads:refresh`; GitHub correctly prevents reading stored secret values back.');
    if (!configured) process.exitCode = 1;
    return;
  }
  if (command === 'connect' || command === 'refresh') {
    const current = process.env.THREADS_ACCESS_TOKEN || await readHidden('Paste Threads access token (input hidden): ');
    let token = current;
    let expiresIn = null;
    if (command === 'refresh') ({ token, expiresIn } = await refreshThreadsToken(current));
    const validation = await validateThreadsToken(token);
    setGitHubThreadsSecret(token);
    console.log(`THREADS_ACCESS_TOKEN stored in GitHub Actions; keyword search returned ${validation.sampleCount} sample(s).`);
    if (expiresIn) console.log(`Reported lifetime: ${Math.floor(expiresIn / 86_400)} days. Refresh before expiry.`);
    return;
  }
  if (command === 'add') {
    const record = await askQuestions({
      url: option('--url'),
      title: option('--title'),
      excerpt: option('--excerpt'),
      author: option('--author'),
      publishedAt: option('--published-at')
    });
    const added = addManualThreadSignal(record);
    console.log(`Added reviewed Threads signal: ${added.url}`);
    console.log('Run `npm run web-design-os -- evolve --offline` to classify it through the controlled taxonomy.');
    return;
  }
  throw new Error(`Unknown command '${command}'.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(`threads-owner: ${sanitizeText(error.message, 500)}`);
    process.exit(1);
  });
}
