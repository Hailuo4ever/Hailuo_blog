# Cloudflare 构建安全约定

## 必须保持的不变量

- Cloudflare Workers Builds 的构建命令必须是 `pnpm run build`，不要直接调用 `astro build`。
- 生产与非生产触发器的 **Build caching** 必须关闭。Cloudflare 的构建缓存是项目级共享状态，曾恢复过期的 Astro 内容数据。
- Astro 的活动缓存目录必须保持为 `./.astro-build-cache`，不能改回默认的 `node_modules/.astro`。
- 在 `src/content/config.ts` 仍使用旧式 `type: "content"`，且页面仍调用 `entry.slug` / `entry.render()` 期间，`astro.config.mjs` 必须保持 `legacy.collections: true`。删除它会重新启用 Astro 5 的 Content Layer 兼容桥，Cloudflare 冷构建可能只看到部分文章。
- 每次构建前必须删除 `.astro-build-cache`、`node_modules/.astro` 和 `dist`。
- 每次 `pnpm run build` 必须先通过 `prebuild` 中的构建安全测试。
- 部署前，`verify-posts` 输出的源码文章、生成路由、归档条目和状态条目数量必须相等。

这些约束分别由以下文件执行：

- `astro.config.mjs`
- `scripts/prepare-build.js`
- `scripts/prepare-build.test.js`
- `scripts/verify-posts.js`
- `package.json`
- `.github/workflows/build.yml`

## 发布前检查

运行：

```sh
pnpm run build
```

成功日志的最后部分必须包含类似下面的内容；具体数字会随文章增加而变化，但四个数字必须相等：

```text
[verify-posts] 83 visible source posts, 83 generated routes, 83 archive entries, 83 tracked statuses.
```

如果构建未运行安全测试、未清理缓存或四个数字不相等，不得部署。

## 数量不一致时的恢复步骤

1. 停止当前部署，不要删除或绕过 `verify-posts`。
2. 在 Cloudflare Dashboard 打开 **Workers & Pages → hailuoblog → Settings → Builds**。
3. 确认构建命令仍为 `pnpm run build`，并确认 **Build caching** 处于关闭状态。
4. 确认 `astro.config.mjs` 仍设置了 `legacy.collections: true`；除非已经完整迁移到显式 loader、`entry.id` 和 `render(entry)`，否则不得删除。
5. 执行 **Clear build cache**。
6. 对同一个 Git commit 重新构建；不要通过额外提交掩盖平台缓存问题。
7. 只有在四项文章清单数量一致后才允许部署。

## 何时必须主动清理 Cloudflare 构建缓存

出现以下任一改动后，在下一次生产构建前清理一次：

- Astro 或 `@astrojs/cloudflare` 的主版本升级；
- `cacheDir`、内容集合 loader/schema 或构建命令发生变化；
- Cloudflare 的 Build caching 被重新启用过；
- 日志出现恢复 `node_modules/.astro` 或构建产物缓存的迹象。

Cloudflare 将构建缓存定义为项目级共享缓存，详见 [Workers Builds build caching](https://developers.cloudflare.com/workers/ci-cd/builds/build-caching/)。
