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

## 部署与迁移记录

站点全部静态生成，由 Cloudflare Workers Static Assets 提供服务；配置文件为 `wrangler.jsonc`，服务名称 `hailuoblog`。不需要 KV、数据库或新的云端凭据。

- [迁移说明](docs/migration/firefly-migration.md)
- [构建安全与发布流程](docs/cloudflare-build-safety.md)
- [迁移前内容与 URL 基线](docs/migration/fuwari-baseline.json)

保留 `public/_headers` 中现有的缓存与 `X-Robots-Tag` 设置。GitHub Actions 对主分支执行检查和构建，只有已配置 Cloudflare 凭据时才执行部署。

## License / English

Hailuo's personal blog, built with Astro and Firefly and hosted on Cloudflare Workers. It contains algorithm notes, contest solutions, study notes, and personal writing. Use Node.js 24 and the pinned pnpm version; run `pnpm preview` to test the production search index locally.

Theme code follows the MIT License, retaining the Fuwari and Firefly copyright notices. Articles and personal images belong to their respective authors unless otherwise stated.
