# 题目与文章搜索

导航弹层和 `/search/` 默认检索题目，可切换到文章。输入题名、题号、算法关键词，例如 `Recall`、`20016`、`QOJ 20016`、`ABC461 E` 或 `贪心 栈`。结果只链接博客中的题解小节，不展示原题链接。

## 索引范围与来源

沿用 Pagefind 中文分词与静态构建。文章索引保留；题目索引仅从公开、未加密的 `src/content/posts/contests` 文章的最终 HTML 提取。Notebook、课程笔记和加密正文不参加题目提取。

支持 `A - Recall`、`A. Recall`、`A-青春常数`，以及杭电 `1001 - 小丑牌` 标题。题目结束于下一个同级或更高级标题，下级思路、做法属于当前题。直接复用渲染后的标题 ID，包括重复标题的后缀。每题多份代码合并，跨文章保留独立题解。

程序代码不参与检索，仅从 URL 注释识别题号；无注释时尝试该题段落内的已知原题链接。支持 Codeforces、AtCoder、牛客、洛谷、QOJ、AcWing、HDU，不访问外站。来源比赛名称取文章标题。HDU 比赛局部题号包含比赛 ID；AcWing URL 的 content ID 不一定等于官方题号，因此显示 `content/N`，不推算编号。

缺失或冲突题号时保留题名和来源，不猜测。构建输出 `[search]` 诊断，并生成 `dist/pagefind/extraction-report.json`（Cloudflare 构建为 `dist/client/pagefind/extraction-report.json`），列出需检查的文章锚点。无需修改文章格式。

## 操作与状态

- `Ctrl/Cmd + K` 聚焦，上下键选择，Enter 打开结果，Esc 关闭并恢复焦点。兼容中文输入法。
- 弹层最多加载 5 条详情；完整页面每页 10 条。
- 分类单选、标签多选并取交集；支持相关度、最新、最早排序。无关键词但有筛选时允许浏览，默认最新。
- 严格搜索要求关键词落在同一条题目记录中，支持引号短语与英文完整词。无结果时可手动放宽为任一关键词，按题目记录去重并优先展示命中更多关键词的结果。
- URL 保留 `q`、`category`、重复的 `tag`、`sort=newest|oldest`、`page`、`match=any`；题目类型默认省略，文章模式为 `type=article`。切换类型保留关键词并回第一页。支持刷新、前进后退和 Swup。
- 加载失败显示重试；开发服务器提示需要构建预览，不提供假结果。

## 本地验证

```sh
pnpm test:search
pnpm test:problem-search
pnpm type-check
pnpm check
pnpm build
pnpm test:search-index
pnpm exec biome ci ./src --reporter=github
pnpm exec astro preview
```

`test:search-index` 验证真实构建的 QOJ Recall、AtCoder、洛谷、牛客记录。提取测试覆盖标题层级、重复锚点、重复代码、编号冲突、私有内容和平台解析。CI 运行搜索单测和构建后提取测试。

浏览器验收还包括类型切换、分页、筛选交集、历史恢复、手机明暗主题、键盘定位、加载失败重试、慢请求后清空。通过网络请求检查详情片段数量为 5／10。`.gitattributes` 固定源代码 LF，避免 Windows 换行差异影响完整 Biome CI。
