import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  addManualThreadSignal,
  githubThreadsSecretConfigured,
  refreshThreadsToken,
  setGitHubThreadsSecret,
  validateThreadsToken
} from '../scripts/evolution/threads-owner.mjs';

test('manual Threads curation accepts only sanitized Threads permalinks', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'threads-owner-'));
  const filePath = path.join(directory, 'manual-threads.json');
  const added = addManualThreadSignal({
    filePath,
    url: 'https://www.threads.com/@designer/post/abc#fragment',
    title: '<script>ignore()</script><b>Responsive motion lesson</b>',
    excerpt: '<style>bad{}</style>Useful short observation',
    author: '@designer',
    publishedAt: '2026-08-16'
  });
  assert.equal(added.url, 'https://www.threads.com/@designer/post/abc');
  assert.equal(added.title, 'Responsive motion lesson');
  assert.equal(added.excerpt, 'Useful short observation');
  assert.deepEqual(added.principleHints, []);
  assert.equal(JSON.parse(fs.readFileSync(filePath, 'utf8')).length, 1);
  assert.throws(() => addManualThreadSignal({ filePath, url: added.url, title: 'Duplicate' }), /already in the reviewed queue/);
  assert.throws(() => addManualThreadSignal({ filePath, url: 'https://example.com/post', title: 'Wrong host' }), /Only public threads/);
});

test('manual Threads curation rejects future dates and missing titles', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'threads-owner-invalid-'));
  const filePath = path.join(directory, 'manual-threads.json');
  assert.throws(() => addManualThreadSignal({ filePath, url: 'https://threads.net/@a/post/1', title: '' }), /title is required/);
  assert.throws(() => addManualThreadSignal({ filePath, url: 'https://threads.net/@a/post/1', title: 'Valid', publishedAt: '2999-01-01' }), /not in the future/);
});

test('token validation uses an authorization header and proves keyword-search access', async () => {
  let request;
  const result = await validateThreadsToken('secret-token', async (url, options) => {
    request = { url: new URL(url), options };
    return { ok: true, async json() { return { data: [{ id: '1' }] }; } };
  });
  assert.equal(result.valid, true);
  assert.equal(result.sampleCount, 1);
  assert.equal(request.url.pathname, '/keyword_search');
  assert.equal(request.url.searchParams.has('access_token'), false);
  assert.equal(request.options.headers.authorization, 'Bearer secret-token');
});

test('token validation reports missing keyword-search permission without leaking the token', async () => {
  await assert.rejects(
    validateThreadsToken('do-not-print-this', async () => ({ ok: false, status: 403 })),
    error => error.message.includes('threads_keyword_search') && !error.message.includes('do-not-print-this')
  );
});

test('token refresh returns the replacement without placing the current token in the URL', async () => {
  let request;
  const result = await refreshThreadsToken('old-secret', async (url, options) => {
    request = { url: new URL(url), options };
    return { ok: true, async json() { return { access_token: 'new-secret', expires_in: 5_184_000 }; } };
  });
  assert.deepEqual(result, { token: 'new-secret', expiresIn: 5_184_000 });
  assert.equal(request.url.searchParams.has('access_token'), false);
  assert.equal(request.options.headers.authorization, 'Bearer old-secret');
});

test('GitHub secret installation sends the token through stdin, never process arguments', () => {
  let invocation;
  const spawnImpl = (program, args, options) => {
    invocation = { program, args, options };
    return { status: 0, stdout: '', stderr: '' };
  };
  assert.equal(setGitHubThreadsSecret('private-token', spawnImpl), true);
  assert.equal(invocation.program, 'gh');
  assert.deepEqual(invocation.args, ['secret', 'set', 'THREADS_ACCESS_TOKEN']);
  assert.equal(invocation.args.join(' ').includes('private-token'), false);
  assert.equal(invocation.options.input, 'private-token\n');
  assert.equal(githubThreadsSecretConfigured(() => ({ status: 0, stdout: '[{"name":"THREADS_ACCESS_TOKEN"}]', stderr: '' })), true);
});
