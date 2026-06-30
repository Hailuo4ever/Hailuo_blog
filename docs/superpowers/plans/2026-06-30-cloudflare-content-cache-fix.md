# Cloudflare Content Cache Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Cloudflare and GitHub build regenerate the complete Astro content collection instead of consuming a project-wide restored content cache.

**Architecture:** Astro will write active build artifacts to a project-local `.astro-build-cache` directory that Cloudflare Workers Builds does not automatically restore. The build preparation script will remove both that active cache and the legacy/default `node_modules/.astro` cache before every build, while GitHub Actions will run focused build-safety tests before invoking the full build.

**Tech Stack:** Astro 5, Node.js test runner, pnpm, GitHub Actions, Cloudflare Workers Builds.

---

### Task 1: Reproduce the incomplete cache cleanup in a unit test

**Files:**
- Modify: `scripts/prepare-build.test.js`

- [ ] **Step 1: Extend the fixture with the active isolated cache**

```js
const activeAstroCacheDir = path.join(rootDir, ".astro-build-cache");
const restoredAstroCacheDir = path.join(rootDir, "node_modules", ".astro");
fs.mkdirSync(activeAstroCacheDir, { recursive: true });
fs.mkdirSync(restoredAstroCacheDir, { recursive: true });
fs.writeFileSync(path.join(activeAstroCacheDir, "data-store.json"), "stale");
fs.writeFileSync(path.join(restoredAstroCacheDir, "data-store.json"), "stale");
```

- [ ] **Step 2: Require both cache locations to be removed**

```js
assert.equal(fs.existsSync(activeAstroCacheDir), false);
assert.equal(fs.existsSync(restoredAstroCacheDir), false);
```

- [ ] **Step 3: Require the Astro configuration and CI safety command**

```js
assert.match(astroConfig, /cacheDir:\s*["']\.\/\.astro-build-cache["']/);
assert.equal(
  packageJson.scripts["test:build-safety"],
  "node scripts/prepare-build.test.js && node scripts/verify-posts.test.js",
);
assert.match(workflow, /run: pnpm run test:build-safety/);
```

- [ ] **Step 4: Run the test and verify RED**

Run: `node scripts/prepare-build.test.js`

Expected: FAIL because `.astro-build-cache` is not removed or configured and the CI safety command does not exist.

### Task 2: Isolate the active Astro cache from Cloudflare's restored cache

**Files:**
- Modify: `astro.config.mjs`
- Modify: `scripts/prepare-build.js`
- Modify: `.gitignore`

- [ ] **Step 1: Configure the isolated cache directory**

```js
export default defineConfig({
  cacheDir: "./.astro-build-cache",
  site: "https://blog.hailuo4ever.com/",
});
```

- [ ] **Step 2: Clear both active and restored cache locations**

```js
const targets = [
  path.join(resolvedRoot, ".astro-build-cache"),
  path.join(resolvedRoot, "node_modules", ".astro"),
  path.join(resolvedRoot, "dist"),
];
```

- [ ] **Step 3: Ignore the generated active cache**

```gitignore
.astro-build-cache/
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node scripts/prepare-build.test.js`

Expected: all preparation tests pass.

### Task 3: Make GitHub CI guard the cache contract

**Files:**
- Modify: `package.json`
- Modify: `.github/workflows/build.yml`

- [ ] **Step 1: Add a focused test command**

```json
"test:build-safety": "node scripts/prepare-build.test.js && node scripts/verify-posts.test.js"
```

- [ ] **Step 2: Run it before the GitHub build**

```yaml
- name: Run build safety tests
  run: pnpm run test:build-safety
```

- [ ] **Step 3: Run the focused suite**

Run: `node scripts/prepare-build.test.js && node scripts/verify-posts.test.js`

Expected: 5 or more tests pass with zero failures.

### Task 4: Verify a cold production-equivalent build

**Files:**
- Verify: `dist/`

- [ ] **Step 1: Run the complete build from cleared caches**

Run: `pnpm run build`

Expected: Astro builds all visible posts and `verify-posts` reports 82 source posts, 82 generated routes, and 82 archive entries.

- [ ] **Step 2: Re-run focused tests after the build**

Run: `node scripts/prepare-build.test.js && node scripts/verify-posts.test.js`

Expected: all tests pass after the real build.

- [ ] **Step 3: Inspect the final diff**

Run: `git diff --check && git status --short`

Expected: no whitespace errors and only the planned files are modified.
