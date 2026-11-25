# Gunpowder Central

<div align="center"><img alt="Tests: Node test suite" src="https://img.shields.io/badge/tests-node%20test-blue"><img alt="License: Apache 2.0" src="https://img.shields.io/badge/license-Apache--2.0-green"><img alt="Version: 1.15.1" src="https://img.shields.io/badge/version-1.15.1-lightgrey"><img alt="Language: HTML and JavaScript" src="https://img.shields.io/badge/language-HTML%20%2F%20JavaScript-orange"></div>

[访问网站](https://home.hachile.org/)

## 目录

- [介绍](#介绍)
- [本地预览](#本地预览)
- [维护](#维护)
- [讨论区 API](#讨论区-api)
- [参与贡献](#参与贡献)
- [许可证](#许可证)

## 介绍

`home.hachile.org` 的中英双语个人主页，汇集个人介绍、常用站点、社群、联系方式和更新日志。静态页面由 GitHub Pages 托管。站内讨论区使用独立的 Cloudflare Worker 和 D1 数据库。

## 本地预览

在仓库根目录启动静态服务器：

```sh
python -m http.server 8000
```

访问 http://localhost:8000/。讨论区需要单独部署 Worker，配置见 [worker/README.md](worker/README.md)。

## 维护

| 文件 | 用途 |
| --- | --- |
| `index.html` | 中文桌面版源页面与更新日志 |
| `tools/build-en.mjs` | 英文文案映射和页面生成 |
| `en/index.html`、`m/index.html`、`m/en/index.html` | 生成的英文与移动版页面 |
| `worker/` | 讨论区 API 与数据库迁移 |

修改中文主页或更新日志后，在仓库根目录运行：

```sh
node tools/build-en.mjs
```

提交时一并包含生成的页面，保证中英文、桌面和手机版同步。

## 讨论区 API

端点、部署命令、Turnstile 配置与数据处理方式见 [worker/README.md](worker/README.md)。请勿将密钥提交到仓库。

## 参与贡献

欢迎通过 [Issues](https://github.com/GPDdev/home.hachile.org/issues) 报告页面问题。修改讨论区后，可在 `worker/` 运行 `npm test`。

## 许可证

仓库现有许可证为 [Apache License 2.0](LICENSE)。第三方素材仍遵守各自的授权条款。
