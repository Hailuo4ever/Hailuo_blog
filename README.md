# Hailuo4ever

Hailuo 的个人博客，使用 Astro + [Firefly](https://github.com/CuteLeaf/Firefly) 构建，部署在 Cloudflare Workers。

在线地址：[blog.hailuo4ever.com](https://blog.hailuo4ever.com/)

记录算法学习、竞赛题解、课程笔记、随笔和日常生活。提供 Firefly 原生归档、标签与分类筛选、Pagefind 全文搜索、响应式目录、代码高亮、LaTeX 和 Giscus 评论。

## 本地开发

使用 Node.js 24（见 `.node-version`）和 `package.json` 锁定的 pnpm 11.22.0。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

| 命令 | 用途 |
| --- | --- |
| `pnpm check` | Astro 类型与组件检查 |
| `pnpm type-check` | TypeScript 检查 |
| `pnpm build` | 清理缓存、生成静态页面及搜索索引、核对文章产物 |
| `pnpm preview` | 构建后启动本地 Wrangler 预览 |
| `pnpm deploy` | 构建并发布到现有 `hailuoblog` Worker |
| `pnpm new-post <filename>` | 创建文章，支持多级目录 |
| `pnpm test:build-safety` | 缓存清理与文章完整性回归测试 |
| `pnpm test:luogu-format` | 洛谷格式化工具测试 |
| `pnpm test:markdown-compat` | 旧标题锚点与音乐指令回归测试 |
| `pnpm verify:posts` | 比对源码、路由、归档、RSS 和站点地图 |
| `pnpm verify:migration` | 一次性核对 Fuwari 迁移基线；后续正常修改旧文章会导致此项失败 |
| `pnpm luogu:format` / `pnpm luogu:format:gui` | 保留的洛谷格式化工具 |

Windows 下重新构建前，应先停止正在使用 `dist` 的 Wrangler 预览，避免文件锁阻止缓存清理。Pagefind 需要生产构建，请使用 `pnpm preview` 验证实际搜索。

## 写作与配置

文章仍位于 `src/content/posts/`，支持 Markdown / MDX 与多级目录。现有正文、图片路径和文件名保持原样。

```yaml
---
title: 文章标题
published: 2026-09-06
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
---
```

`draft: true` 的文章不进入生产产物。历史 `status: editing` 字段保留为元数据，不再显示独立状态，也不影响公开范围。旧音乐指令继续支持 `title`、`artist`、`cover`、`mp3`、`flac` 和 `src`。

个人设置位于 `src/config/`：站点、头像、横幅、导航、友链、评论和侧栏分别管理。默认采用现有绿色主题、头像与横幅，关闭演示页面、广告、看板娘、背景视频、全站音乐和随机封面。

文章 URL 保留原 Astro 5 的 slug 规则；Giscus 沿用 `Hailuo4ever/Hailuo_blog` 的 `pathname` 映射。不要在迁移后重新命名现有文章目录，否则会改变链接及评论关联。

## 博客访问密码

首次访问时输入密码，解锁后回到原网址。同一浏览器在该域名下保持登录 7 天。文章、图片、RSS、搜索索引与 JSON 接口都经过服务端校验。

如果现有 `hailuoblog` Worker 的设置显示「不能将变量添加到只有静态资产的 Worker」，首次切换时请先保留 Only Me，发布包含 `edge/worker.js` 和新版 `wrangler.jsonc` 的代码。发布成功后刷新设置页，再添加密钥。配置完成前，博客会临时返回 503。

在 Cloudflare **Workers & Pages → 对应项目 → Settings → Variables and Secrets** 中添加两个 **Secret**：

| 名称 | 值 |
| --- | --- |
| `BLOG_PASSWORD` | 访客需要输入的密码，建议用密码管理器生成。 |
| `BLOG_SESSION_SECRET` | 独立的随机签名密钥。可在本机运行 `node -p "require('node:crypto').randomBytes(32).toString('hex')"` 生成。 |

修改任意一个 Secret 并使新配置生效后，旧登录会话即失效。缺少任意一个时站点返回 503。

- **现有 Worker**：目标项目为 `hailuoblog`。在控制台填好两个 Secret 后点击 **Deploy** 使配置生效。Worker 会在读取 `dist/` 中的文件前校验请求。
- **Cloudflare Pages Functions**：在 Pages 项目中分别设置 Production 和需要使用的 Preview 环境的 Secret。仓库根目录为构建根目录，构建命令为 `pnpm build`，输出目录为 `dist`。通过 Git 集成部署，或在仓库根目录构建后运行 `pnpm exec wrangler pages deploy dist --project-name <Pages项目名>`。根目录的 `functions/_middleware.js` 与 `public/_routes.json` 保护全部路径。免费计划在 **Settings → Runtime → Fail open / closed** 选择 **Fail closed**，避免 Functions 配额耗尽时直接提供文件。[Cloudflare 路由说明](https://developers.cloudflare.com/pages/functions/routing/#fail-open--closed)
- **本地预览**：在仓库根目录的 `.dev.vars` 中用两行 `名称="值"` 设置上述 Secret。此文件已被 Git 忽略。`pnpm build` 后，运行 `pnpm exec wrangler pages dev dist` 预览 Pages，或运行 `pnpm exec wrangler dev` 预览 Worker。日常写作用的 `pnpm dev` 直接启动 Astro。

切换 Cloudflare One 时，先通过现有 Access 验证，再确认能看到博客密码页、输错密码无法阅读、输入正确后能回到文章。确认后，在 Zero Trust 的 Access 应用中解除对博客域名的保护，再用无痕窗口复查。知道共享密码的人均可访问博客。

## 部署与迁移记录

站点全部静态生成，由 Cloudflare Workers Static Assets 提供服务；配置文件为 `wrangler.jsonc`，服务名称 `hailuoblog`。不需要 KV、数据库或新的云端凭据。

- [迁移说明](docs/migration/firefly-migration.md)
- [构建安全与发布流程](docs/cloudflare-build-safety.md)
- [迁移前内容与 URL 基线](docs/migration/fuwari-baseline.json)

密码校验层会为受保护的响应设置 `Cache-Control: private, no-store`。GitHub Actions 对主分支执行检查和构建，只有已配置 Cloudflare 凭据时才执行部署。

## License / English

Hailuo's personal blog, built with Astro and Firefly and hosted on Cloudflare Workers. It contains algorithm notes, contest solutions, study notes, and personal writing. Use Node.js 24 and the pinned pnpm version; run `pnpm preview` to test the production search index locally.

Theme code follows the MIT License, retaining the Fuwari and Firefly copyright notices. Articles and personal images belong to their respective authors unless otherwise stated.
