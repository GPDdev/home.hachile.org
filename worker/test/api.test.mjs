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
