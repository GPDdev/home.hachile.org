# Gunpowder Central

`home.hachile.org` 的中英双语主页。中文主页在 `index.html`，修改后运行 `node tools/build-en.mjs` 生成 `/en/`；静态页面由 GitHub Pages 托管。

站内讨论区使用独立的 Cloudflare Worker + D1。部署和数据说明见 [worker/README.md](worker/README.md)。
