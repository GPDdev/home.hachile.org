const SITE_ORIGIN = 'https://home.hachile.org';

function reply(data, status = 200, origin = '') {
  const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', vary: 'Origin' };
  if (origin === SITE_ORIGIN) headers['access-control-allow-origin'] = SITE_ORIGIN;
  return new Response(JSON.stringify(data), { status, headers });
}

export function cleanText(value, multiline = false) {
  if (typeof value !== 'string') return '';
  const text = value.normalize('NFC').replace(/\r\n?/g, '\n');
  return (multiline ? text.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '') : text.replace(/[\u0000-\u001f\u007f]/g, ' ')).trim();
}

async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function rateKey(ip, secret) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip));
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function verified(token, env) {
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  const form = new FormData();
  form.set('secret', env.TURNSTILE_SECRET);
  form.set('response', token);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true && result.hostname === 'home.hachile.org';
}

function publicMessage(row) {
  if (!row) return null;
  const { id, parent_id, created_at, hidden, reply_count } = row;
  return { id, parentId: parent_id, createdAt: created_at, hidden: !!hidden, replyCount: reply_count || 0,
    author: hidden ? null : row.author, title: hidden ? null : row.title, body: hidden ? null : row.body };
}

async function input(request) {
  if (Number(request.headers.get('content-length')) > 8192) return null;
  const raw = await request.text();
  if (raw.length > 8192) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

async function createMessage(request, env, parentId, origin) {
  const data = await input(request);
  if (!data || typeof data !== 'object') return reply({ error: 'invalid_json' }, 400, origin);
  const author = cleanText(data.author);
  const title = parentId ? null : cleanText(data.title);
  const body = cleanText(data.body, true);
  const maxBody = parentId ? 1000 : 2000;
  if (author.length < 2 || author.length > 32 || (!parentId && (title.length < 4 || title.length > 100)) || body.length < 2 || body.length > maxBody || !/^[a-f0-9]{64}$/.test(data.deleteToken || '')) {
    return reply({ error: 'invalid_fields' }, 400, origin);
  }
  if (parentId) {
    const parent = await env.DB.prepare('SELECT id FROM messages WHERE id = ? AND parent_id IS NULL').bind(parentId).first();
    if (!parent) return reply({ error: 'thread_not_found' }, 404, origin);
  }
  if (!await verified(data.turnstileToken, env)) return reply({ error: 'verification_failed' }, 403, origin);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare('DELETE FROM rate_limits WHERE next_at < ?').bind(now - 3600).run();
  const key = await rateKey(request.headers.get('CF-Connecting-IP') || 'unknown', env.RATE_SECRET);
  const limited = await env.DB.prepare('INSERT INTO rate_limits (key, next_at) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET next_at = excluded.next_at WHERE next_at <= ?').bind(key, now + 60, now).run();
  if (limited.meta.changes !== 1) return reply({ error: 'rate_limited' }, 429, origin);
  const id = crypto.randomUUID();
  await env.DB.prepare('INSERT INTO messages (id, parent_id, author, title, body, delete_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, parentId, author, title, body, await digest(data.deleteToken), now).run();
  return reply({ id, createdAt: now }, 201, origin);
}

async function deleteMessage(request, env, id, origin) {
  const data = await input(request);
  const token = data?.deleteToken;
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return reply({ error: 'invalid_token' }, 400, origin);
  const row = await env.DB.prepare('SELECT delete_hash FROM messages WHERE id = ?').bind(id).first();
  if (!row) return reply({ error: 'not_found' }, 404, origin);
  if (await digest(token) !== row.delete_hash) return reply({ error: 'not_yours' }, 403, origin);
  await env.DB.prepare("UPDATE messages SET hidden = 1, author = '', title = NULL, body = '' WHERE id = ?").bind(id).run();
  return reply({ ok: true }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    if (request.method === 'OPTIONS') {
      if (origin !== SITE_ORIGIN) return reply({ error: 'forbidden_origin' }, 403);
      return new Response(null, { status: 204, headers: { 'access-control-allow-origin': SITE_ORIGIN, 'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS', 'access-control-allow-headers': 'Content-Type', 'access-control-max-age': '86400' } });
    }
    if (request.method !== 'GET' && origin !== SITE_ORIGIN) return reply({ error: 'forbidden_origin' }, 403);
    const { pathname } = new URL(request.url);
    try {
      if (pathname === '/api/config' && request.method === 'GET') return reply({ turnstileSiteKey: env.TURNSTILE_SITE_KEY }, 200, origin);
      if (pathname === '/api/threads' && request.method === 'GET') {
        const rows = await env.DB.prepare('SELECT m.id, m.parent_id, m.author, m.title, m.body, m.created_at, m.hidden, (SELECT COUNT(*) FROM messages r WHERE r.parent_id = m.id) AS reply_count FROM messages m WHERE m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 30').all();
        return reply({ threads: rows.results.map(publicMessage) }, 200, origin);
      }
      if (pathname === '/api/threads' && request.method === 'POST') return createMessage(request, env, null, origin);
      const thread = pathname.match(/^\/api\/threads\/([a-f0-9-]{36})$/);
      if (thread && request.method === 'GET') {
        const root = await env.DB.prepare('SELECT id, parent_id, author, title, body, created_at, hidden FROM messages WHERE id = ? AND parent_id IS NULL').bind(thread[1]).first();
        if (!root) return reply({ error: 'thread_not_found' }, 404, origin);
        const rows = await env.DB.prepare('SELECT id, parent_id, author, title, body, created_at, hidden FROM messages WHERE parent_id = ? ORDER BY created_at ASC LIMIT 100').bind(thread[1]).all();
        return reply({ thread: publicMessage(root), replies: rows.results.map(publicMessage) }, 200, origin);
      }
      const responsePath = pathname.match(/^\/api\/threads\/([a-f0-9-]{36})\/replies$/);
      if (responsePath && request.method === 'POST') return createMessage(request, env, responsePath[1], origin);
      const deletion = pathname.match(/^\/api\/messages\/([a-f0-9-]{36})$/);
      if (deletion && request.method === 'DELETE') return deleteMessage(request, env, deletion[1], origin);
      return reply({ error: 'not_found' }, 404, origin);
    } catch (error) {
      console.error(error);
      return reply({ error: 'server_error' }, 500, origin);
    }
  }
};
