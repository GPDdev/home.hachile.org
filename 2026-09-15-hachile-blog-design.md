# Hachile Blog 设计

日期：2026-09-15

## 目标

在不迁移现有 `hachile.org` 静态主页的前提下，新增使用 Astro 与 Firefly 主题的独立博客 `blog.hachile.org`。博客继续托管在 GitHub Pages，并从现有主页提供清晰入口。

## 架构

- 现有仓库 `GPDdev/gpddev.github.io` 继续独立发布 `hachile.org`。
- 新建独立仓库 `GPDdev/blog.hachile.org`，以 `CuteLeaf/Firefly` 模板为起点。
- 博客仓库使用 GitHub Actions 安装依赖、运行检查、构建 `dist`，再发布至 GitHub Pages。
- `blog.hachile.org` 使用 CNAME 指向 `gpddev.github.io`，GitHub Pages 为博客仓库绑定该自定义域名。
- 两个站点仅通过普通链接关联，不共享运行时、构建流程或部署状态。

选择独立模板仓库而不是直接 Fork，是为了保留清晰的项目历史与 Hachile 自有仓库身份；Firefly 的 MIT 许可与版权声明继续保留。博客不放入主站仓库，因为一个 GitHub Pages 仓库只对应一套站点发布配置与自定义域名。

## 品牌与导航

- 站点标题：`Hachile Blog`
- 作者：`Gunpowder`
- 站点地址：`https://blog.hachile.org`
- 默认语言：简体中文
- 时区：`Asia/Shanghai`
- 作者头像：复用主站的 `gunpowder-avatar.png`
- 博客导航包含返回 `https://hachile.org/` 的入口。
- 主站首页增加与 Gallery 同级的 Blog 入口卡，指向 `https://blog.hachile.org/`。

## 首发内容范围

保留 Firefly 的博客核心能力：

- 文章首页与文章详情页
- 归档、分类和标签
- 全文搜索
- RSS / Atom
- 亮色、暗色与跟随系统模式
- 响应式布局

首发版本关闭或不配置以下功能：

- 留言板与评论系统
- 动态、项目、书签和打赏页面
- 音乐播放器、看板娘及额外视觉特效
- 第三方统计和需要账号、令牌或外部 API 的功能

删除模板演示作者和演示文章，新增一篇中文欢迎文章，作为以后撰写 Markdown 文章的可编辑示例。模板许可、上游署名和必要版权信息保留。

## 内容与部署流程

1. 在博客仓库的文章目录新增或编辑 Markdown 文件。
2. 推送到博客仓库的默认分支。
3. GitHub Actions 使用 Node.js 22 和 pnpm 11 安装锁定依赖。
4. 工作流运行项目检查并执行生产构建。
5. `dist` 作为 GitHub Pages artifact 发布。
6. GitHub Pages 通过 `blog.hachile.org` 提供静态站点。

主站的发布流程不因博客构建失败而受影响，博客也不依赖主站构建产物。

## 故障处理

- 依赖、类型检查或构建失败时，GitHub Actions 停止发布并保留上一版可用站点。
- DNS 尚未生效时，可先通过 GitHub Pages 提供的部署地址检查构建结果。
- 自定义域名证书签发完成前不强制开启 HTTPS；签发后在 Pages 设置中启用 Enforce HTTPS。
- 不把账号密钥、评论系统令牌或其他秘密提交到仓库。

## 验收标准

- `pnpm check` 成功。
- `pnpm build` 成功并生成 `dist`。
- 生成页面中的 canonical、站点地图和订阅地址使用 `https://blog.hachile.org`。
- `public/CNAME` 的内容为 `blog.hachile.org`，并进入最终发布产物。
- 首页、欢迎文章、归档、分类、标签、搜索和订阅入口可访问。
- 博客能返回主站，主站 Blog 卡能进入博客。
- Firefly 演示身份、演示文章及未启用功能不会出现在首发站点。
- 桌面与移动宽度下没有明显布局溢出或导航不可用问题。

## 用户完成的外部配置

代码准备完成后，用户需要：

1. 在 GitHub 账号 `GPDdev` 下创建公开仓库 `blog.hachile.org` 并推送博客源码。
2. 在该仓库的 Settings → Pages 中选择 GitHub Actions 作为发布源。
3. 在域名 DNS 服务商处添加 `blog` 的 CNAME 记录，目标为 `gpddev.github.io`。
4. 在博客仓库 Settings → Pages 中将 Custom domain 设置为 `blog.hachile.org`。
5. 等待 DNS 检查与证书签发成功，再启用 Enforce HTTPS。

