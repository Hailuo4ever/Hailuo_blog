# Fuwari → Firefly 迁移记录

## 基线与交付范围

- 博客分支：`codex/migrate-firefly`。
- 迁移前提交：`3231ad3e76d7f47a67bf8a689dcdd2ef04f3b02b`。
- 上游：[CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly)，版本 `6.16.7`。
- 固定上游提交：`db331cff041a1b264026fcee36930fab4d2485db`。
- 内容基线：[fuwari-baseline.json](./fuwari-baseline.json)，117 篇文章、12 个原资源文件、2407 个旧标题锚点。
- 原有未提交文章改动（`notebook/data_structure.md` 与 `contests/xcpc/2024_ICPC_EC_Online_II.md`）已纳入工作区内容基线，未被覆盖。
- 迁移期间仓库 HEAD 更新为 `88ae154429674348c9aedd17b2121a7816662be8`（`upd`），提交了上述两篇文章的既有改动；该提交并非本次迁移操作创建，内容仍与捕获的基线一致。
- 本次仅修改本地仓库、生成构建产物与预览；未提交 Git commit、未推送、未发布生产、未修改 Cloudflare 云端设置。

旧站在重新安装完整依赖后通过 Astro 检查（0 errors / 0 warnings）及生产构建，公开源码、路由、归档、状态计数均为 117。旧源码副本与构建日志保存在本次任务可视化目录，生产回滚仍以原提交及 Cloudflare 历史部署为准。

## 实现选择

主题源码、依赖与锁文件采用固定上游版本；Node.js 使用 24，pnpm 固定 11.22.0。pnpm 11 的项目配置放在 `pnpm-workspace.yaml`，本地缓存位于被 Git 忽略的 `.pnpm-store/firefly-migration`。

首页采用 Firefly 原生横幅、单列文章及桌面双侧栏；手机使用原生响应式布局。保留 Hailuo4ever 站名、绿色主题（hue 150）、原头像、横幅、社交链接、三条友链和关于页。站点开始日期依据关于页上线记录设置为 2026-04-24。字体采用系统字体，不额外请求字体服务；OG 图片生成默认关闭。

旧三视图归档、竞赛题目搜索接口、编辑状态展示和生日专属装饰已移除。归档筛选、全文搜索、代码块、目录、阅读体验采用 Firefly 原生功能。相册、动态、书签导航、打赏、广告、看板娘、全站音乐和背景视频默认关闭；没有导入上游演示文章或演示图片。

### 内容与 URL 兼容

- 显式 loader 使用 `legacyPostSlug` 兼容 Astro 5：逐级 GitHub slug、保留多级路径、处理末尾 index，并尊重显式 frontmatter slug。
- 保留原 Markdown 文件及资源路径，`status` 为可选历史元数据；公开范围仍仅由 `draft` 决定。
- Giscus 使用原仓库、分类 ID、`pathname` 映射、底部输入和浅色／透明暗色主题。评论内容保存在原 GitHub Discussions 中，无须搬迁。
- 为旧 `:::music` 指令提供原生 audio 渲染，保留封面及 MP3／FLAC 源，关闭自动预加载；页面移除后不会遗留自定义播放器实例。
- 修复 remark-directive 对 `16:9` 等普通冒号文本的解析，保留 `a---169` 等旧标题锚点；评论标题保留 `comments-heading`。
- 修复上游友链页在关闭自定义内容后仍要求示例 Markdown 的问题，以及字体关闭时 Font 组件类型为 never 的问题。

### Cloudflare 与构建安全

所有启用页面都可预渲染，因此采用 Firefly 的静态构建 + Cloudflare Workers Static Assets。保留 Worker 名称 `hailuoblog`、现有域名和 CI 凭据引用；移除旧 adapter 的 Worker 入口及 `_routes.json` 补丁。`build`、`preview`、`deploy` 的用途保持一致。

兼容日期设为 `2026-09-04`，与锁定 workerd 支持范围一致。保留原 `_headers` 文件，包括既有 `X-Robots-Tag: noindex`，此次迁移未调整搜索引擎收录策略。

保留独立 Astro 缓存目录与构建前清理，构建后验证完整 URL 集合、归档、RSS 和站点地图。正常构建不运行固定迁移哈希校验，后续正常文章编辑不会被历史基线阻塞。Windows 重建前须停止正在占用 dist 的 Wrangler 预览。

## 验证

- `pnpm install --frozen-lockfile --offline`：锁定依赖安装通过。
- `pnpm check`：254 个文件，0 errors / 0 warnings / 0 hints。
- `pnpm type-check`：通过。
- `pnpm exec biome ci ./src`：295 个文件通过。
- 最终生产构建通过，源码、文章路由、归档、RSS 均为 117 篇，站点地图集合一致。
- Wrangler 类型生成及 `deploy --dry-run` 通过，本地预览使用最终构建产物；没有发布到云端。
- `pnpm test:build-safety`：14 项通过，覆盖缓存清理、缺失文章、陈旧路由、草稿泄漏、归档／RSS／站点地图不一致和 slug 冲突。
- `pnpm test:luogu-format`：3 项通过。
- `pnpm test:markdown-compat`：2 项通过，验证冒号标题锚点与音乐指令真实渲染。
- `pnpm verify:migration`：117 篇文章及 12 个原资源 SHA-256 未变，旧 URL、2407 个锚点和评论配置一致。
- 真实新增构建：加入一篇公开测试文章与一篇草稿后，仅公开文章进入 118 篇产物，草稿没有生成页面，也不在归档／RSS／站点地图中。浏览器 Pagefind 查询确认公开文章可检索，草稿文本不在命中内容中（相似词可能模糊命中公开测试文章）。
- 删除两篇临时文章后再次完整构建，恢复 117 篇；临时文章源码和页面均不存在，原公开测试路由返回 404。Pagefind 命中内容及 URL 不再包含测试文章（相似查询仍可能模糊匹配真实文章）。

浏览器环境为本地 Wrangler `http://127.0.0.1:8787`，Chrome，桌面 1440×1000、手机 390×844。Browser 插件不可用，采用 Playwright CLI。验证了页面身份、非空渲染、无框架错误覆盖层、控制台、截图及实际交互：

- 首页显示真实头像、横幅、文章、分类与统计；搜索“算法”返回真实文章。
- 首页 → Diary 分类 → 归档显示 6 篇 → Birthday 文章的 Swup 导航正常。
- 亮暗模式切换生效，Giscus iframe 使用 `transparent_dark` 及原文章 pathname。
- 手机图论文章无横向溢出，渲染 181 个 KaTeX 节点、13 个代码块；目录跳到 `#lca` 后标题位于视口顶部下方。
- 代码复制后读取剪贴板，确认复制了 2024 字符的代码及 `#include`。
- 生日音乐控件具有原封面、MP3／FLAC 源及 `preload="none"`；友链页正常，测试页面无应用控制台错误。
- 126 个本地 HTTP 路径（含全部 117 篇文章和主要入口）均返回 200，未知路径返回 404，无尾斜杠文章地址 307 跳转至原规范地址。

没有发送测试评论或操作 GitHub Discussions，也没有验证生产域名上的登录流程。音频验证限于控件及源地址，未主动播放。原文中少量 KaTeX 非严格语法提示在旧站也存在；关闭的动态集合为空时的 loader 提示不影响产物。

## 发布与回滚

参照 [构建安全约定](../cloudflare-build-safety.md)，先审阅本地结果，再发布同一验证提交。首次迁移上线前清理 Cloudflare 构建缓存，并保持 Build caching 关闭。旧部署可用于回滚；未提交的文章应单独保留，不应通过 reset 或覆盖工作区来回滚主题。

后续上游更新请对照本记录中的固定 SHA，在保留兼容 helper、音乐插件、Giscus 配置及构建校验的前提下合入。
