# Gunpowder Central 讨论区 API

主页和 `/en/` 由 GitHub Pages 托管；`home-api.hachile.org` 是独立的 Cloudflare Worker，使用独立的 D1 数据库 `home-discussions`。没有账号系统。

## 维护

在 `worker/` 目录运行：

```sh
npm install
npx wrangler d1 migrations apply home-discussions --remote
npx wrangler deploy
```

`TURNSTILE_SITE_KEY` 是公开配置。`TURNSTILE_SECRET` 和 `RATE_SECRET` 必须通过 `wrangler secret put` 保存，不能提交到仓库。Turnstile 小组件仅允许 `home.hachile.org`。改动中文主页后运行 `node tools/build-en.mjs`（在仓库根目录）重新生成英文页。

## API

- `GET /api/config`：公开的 Turnstile site key。
- `GET /api/threads`：最近 30 个主题。
- `GET /api/threads/:id`：主题和最多 100 条回复。
- `POST /api/threads`：发布主题。
- `POST /api/threads/:id/replies`：回复。
- `DELETE /api/messages/:id`：凭当前浏览器保存的删除密钥隐藏自己的内容，并清空昵称与正文。

写入只接受 `https://home.hachile.org` 的 `Origin`，还会在服务器验证 Turnstile token、字段长度和每个 IP 的一分钟发帖间隔。前端用纯文本渲染用户内容，不解析 HTML。需要手动隐藏违规内容时，可在 Cloudflare D1 控制台执行：

```sql
UPDATE messages SET hidden = 1, author = '', title = NULL, body = '' WHERE id = '具体消息 UUID';
```

## 数据说明

昵称、主题与回复正文公开保存在 D1 中，默认不自动到期。删除 token 只存在发帖浏览器的 `localStorage`，D1 仅保存其 SHA-256 哈希；清除浏览器数据后无法自行删除。IP 不保存明文，只把 HMAC 后的限速标识保存在 D1，过期限速记录会在后续发帖时清理。没有单独的管理员网页。
