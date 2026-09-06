# Cloudflare 构建安全约定

## 当前部署结构

博客已迁移到 Firefly，使用显式内容 loader、`entry.id` 和 `render(entry)`，不再使用 Astro 5 旧式集合兼容桥。所有启用页面均静态生成到 `dist/`，由 `hailuoblog` Worker 的 Static Assets 托管，不再依赖 `dist/_worker.js` 或 `_routes.json` 补丁。

## 必须保持的约束

- Cloudflare Workers Builds 构建命令为 `pnpm run build`。
- 生产与非生产触发器的 Build caching 均保持关闭；该项目曾因恢复过期内容缓存而漏文章。
- 活动缓存目录保持 `./.astro-build-cache`。
- 每次构建前清理 `.astro-build-cache`、`node_modules/.astro` 和 `dist`；清理失败立即终止。
- 保留 `prebuild` 中的构建安全测试。
- 每次构建后按公开源码集合核对文章路由、归档、RSS 与站点地图；数量相同之外，URL 集合也必须一致。
- `draft: true` 不生成公开文章页面；`status: editing` 不等同于草稿。
- 本地、GitHub Actions 和 Cloudflare 使用 Node.js 24、锁定的 pnpm 与 `pnpm install --frozen-lockfile`。

`verify-posts` 不再读取旧 Svelte 序列化数据或检查状态徽章，而是解析 Firefly 的归档链接并比对实际产物。迁移基线检查 `verify:migration` 只用于此次主题迁移，不加入未来日常构建，避免阻止正常文章编辑。

## 发布流程

1. 在迁移分支完成 `pnpm check`、`pnpm type-check`、相关测试和 `pnpm build`。
2. 通过 Wrangler 本地预览检查文章直达、分页、搜索、RSS、评论和 404。
3. 确认待发布提交及最近正常的生产部署版本。
4. 在 Cloudflare 中保持 Build caching 关闭，首次迁移发布前执行 Clear build cache。
5. 通过现有流水线或 `pnpm deploy` 发布已验证的提交。
6. 复查线上首页、深层文章、搜索资源、RSS 与 Giscus 关联；如有文章丢失或路由故障，回滚到迁移前生产版本。

此次开发只进行本地验收，不执行生产发布或修改云端设置。

## 构建失败处理

- 数量或 URL 集合不一致时，不绕过校验；停止发布，清理平台缓存，并在同一提交重建。
- 升级 Astro、修改 loader 或缓存目录后，在下一次生产构建前清理 Cloudflare 缓存。
- Windows 上出现清理 `dist` 的 EPERM 时，先停止 Wrangler 预览，再重建。
- `wrangler dev` 的 workerd 必须支持配置中的兼容日期；目前锁定工具支持 `2026-09-04`。
