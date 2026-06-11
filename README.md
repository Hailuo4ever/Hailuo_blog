# Hailuo4ever

[中文](#中文) | [English](#english)

Hailuo4ever is Hailuo's personal blog, built with Astro and Fuwari, and deployed on Cloudflare Pages.

## 中文

这是 Hailuo 的个人博客，用来记录技术学习、算法训练、竞赛题解、课程笔记、随笔日记和一些平常的想法。网站基于 Astro + Fuwari 搭建，并在原模板基础上加入了归档视图、题目搜索、文章状态、阅读体验和 Cloudflare 部署相关改造。

在线地址: <https://blog.hailuo4ever.com/>

### 主要内容

- 算法笔记: AcWing 基础课与提高课、常见算法专题整理。
- 竞赛题解: Codeforces、AtCoder、Nowcoder、蓝桥杯、洛谷、ICPC/CCPC 等比赛记录。
- 课程笔记: 离散数学、TRIZ 等学校课程内容。
- 生活记录: 日记、随笔、个人想法和成长记录。
- 使用说明: 一些工具、网络和站点相关教程。

### 页面与功能

- 主页: 展示最新文章、个人简介、标签、分类和个人链接。
- 归档: 支持时间线、文件夹、日历三种查看方式，并区分正在编辑的文章。
- 关于: 包含个人介绍、联系方式、站点说明和更新日志。
- 友链: 展示朋友博客链接。
- 搜索: 使用 Pagefind 做全文搜索，并额外支持竞赛题目关键词搜索。
- 文章页: 支持右侧目录、Giscus 评论、阅读时间、LaTeX、代码高亮、标题折叠、GitHub 卡片、提示块和音乐播放器等扩展。

### 技术栈

- Astro
- Svelte
- Tailwind CSS
- Fuwari
- Pagefind
- Expressive Code
- KaTeX
- Giscus
- Cloudflare Pages / Wrangler

### 本地开发

需要 Node.js 20 或更高版本，并使用 pnpm 安装依赖。

```sh
pnpm install
pnpm dev
```

常用命令:

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建生产版本，生成搜索索引，并校验文章输出 |
| `pnpm preview` | 构建后使用 Wrangler 本地预览 |
| `pnpm deploy` | 构建并部署到 Cloudflare |
| `pnpm check` | 运行 Astro 检查 |
| `pnpm format` | 使用 Biome 格式化 `src` 目录 |
| `pnpm lint` | 使用 Biome 检查并修复 `src` 目录 |
| `pnpm new-post <filename>` | 创建一篇新文章 |
| `pnpm verify:posts` | 校验文章生成结果和归档数据 |

### 写作格式

文章存放在 `src/content/posts/` 下，支持多级目录。新文章默认处于 `editing` 状态，可以在完成后改为 `published`。

```yaml
---
title: 文章标题
published: 2026-06-10
status: editing
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
---
```

字段说明:

- `title`: 文章标题。
- `published`: 发布时间。
- `status`: `editing` 或 `published`。
- `description`: 文章描述。
- `image`: 封面图片。
- `tags`: 标签列表。
- `category`: 分类，例如 `Algorithm`、`Diary`、`Instructions`、`school_lecture`。
- `draft`: 是否为草稿。
- `lang`: 当文章语言与站点默认语言不同时填写。

### 部署

站点使用 Astro Cloudflare adapter。`pnpm build` 会生成 `dist/`，修正 Cloudflare 路由，生成 Pagefind 搜索索引，并执行文章校验。`pnpm deploy` 会在构建完成后通过 Wrangler 部署。

### 许可

项目代码继承 MIT License。站内文章和图片等内容版权归作者所有，除非另有说明。

## English

This is Hailuo's personal blog for technical notes, algorithm training, contest solutions, course notes, diaries, and everyday thoughts. It is built with Astro + Fuwari and customized with archive views, problem search, post status tracking, reading improvements, and Cloudflare deployment support.

Site: <https://blog.hailuo4ever.com/>

### Content

- Algorithm notes: AcWing courses and algorithm topic notes.
- Contest solutions: Codeforces, AtCoder, Nowcoder, Lanqiao Cup, Luogu, ICPC/CCPC, and more.
- Course notes: Discrete Mathematics, TRIZ, and other school courses.
- Life records: diaries, essays, personal thoughts, and growth logs.
- Instructions: tutorials related to tools, network setup, and this site.

### Pages and Features

- Home: latest posts, profile, tags, categories, and profile links.
- Archive: timeline, folder, and calendar views, with a visible editing status for unfinished posts.
- About: personal introduction, contact information, site notes, and update log.
- Friend Links: links to friends' blogs.
- Search: Pagefind full-text search plus keyword search for contest problems.
- Post page: table of contents, Giscus comments, reading time, LaTeX, code highlighting, collapsible headings, GitHub cards, admonitions, and a music player.

### Tech Stack

- Astro
- Svelte
- Tailwind CSS
- Fuwari
- Pagefind
- Expressive Code
- KaTeX
- Giscus
- Cloudflare Pages / Wrangler

### Local Development

Node.js 20 or later is required. Dependencies are managed with pnpm.

```sh
pnpm install
pnpm dev
```

Common commands:

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm build` | Build the production site, generate the search index, and verify posts |
| `pnpm preview` | Build and preview locally with Wrangler |
| `pnpm deploy` | Build and deploy to Cloudflare |
| `pnpm check` | Run Astro checks |
| `pnpm format` | Format the `src` directory with Biome |
| `pnpm lint` | Check and fix the `src` directory with Biome |
| `pnpm new-post <filename>` | Create a new post |
| `pnpm verify:posts` | Verify generated post routes and archive data |

### Writing

Posts are stored under `src/content/posts/` and can use nested folders. New posts are created with the `editing` status and can be changed to `published` when finished.

```yaml
---
title: Post Title
published: 2026-06-10
status: editing
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
---
```

Field notes:

- `title`: post title.
- `published`: publish date.
- `status`: `editing` or `published`.
- `description`: post description.
- `image`: cover image.
- `tags`: tag list.
- `category`: category, such as `Algorithm`, `Diary`, `Instructions`, or `school_lecture`.
- `draft`: whether the post is a draft.
- `lang`: set this only when the post language differs from the site language.

### Deployment

The site uses the Astro Cloudflare adapter. `pnpm build` outputs `dist/`, patches Cloudflare routes, generates the Pagefind index, and verifies post output. `pnpm deploy` builds the site and deploys it through Wrangler.

### License

The project code follows the MIT License. Site articles and images belong to the author unless otherwise stated.
