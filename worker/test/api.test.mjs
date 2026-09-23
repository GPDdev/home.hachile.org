import test from 'node:test';
import assert from 'node:assert/strict';
import api, { cleanText } from '../src/index.js';

test('normalizes public text and rejects cross-origin writes', async () => {
  assert.equal(cleanText('  A\u0000B\r\nC  ', true), 'AB\nC');
  assert.equal(cleanText('  A\nB  '), 'A B');
  const denied = await api.fetch(new Request('https://home-api.hachile.org/api/threads', { method: 'POST', body: '{}' }), {});
  assert.equal(denied.status, 403);
  const config = await api.fetch(new Request('https://home-api.hachile.org/api/config', { headers: { Origin: 'https://home.hachile.org' } }), { TURNSTILE_SITE_KEY: 'public-key' });
  assert.equal((await config.json()).turnstileSiteKey, 'public-key');
  assert.equal(config.headers.get('access-control-allow-origin'), 'https://home.hachile.org');
});

test('creates a topic only after verification and bound SQL writes', async () => {
  const originalFetch = globalThis.fetch;
  const statements = [];
  globalThis.fetch = async () => new Response(JSON.stringify({ success: true, hostname: 'home.hachile.org' }));
  const env = {
    TURNSTILE_SECRET: 'test-secret', RATE_SECRET: 'test-rate-secret',
    DB: { prepare(sql) { statements.push(sql); return { bind() { return { async run() { return { meta: { changes: 1 } }; } }; } }; } }
  };
  try {
    const request = new Request('https://home-api.hachile.org/api/threads', {
      method: 'POST', headers: { Origin: 'https://home.hachile.org', 'Content-Type': 'application/json', 'CF-Connecting-IP': '127.0.0.1' },
      body: JSON.stringify({ author: 'Tester', title: 'A topic', body: '<script>plain text only</script>', deleteToken: 'a'.repeat(64), turnstileToken: 'valid' })
    });
    const response = await api.fetch(request, env);
    assert.equal(response.status, 201);
    assert.match((await response.json()).id, /^[a-f0-9-]{36}$/);
    assert.ok(statements.some(sql => sql.startsWith('INSERT INTO messages')));
    assert.ok(statements.every(sql => sql.includes('?')));
  } finally { globalThis.fetch = originalFetch; }
});
