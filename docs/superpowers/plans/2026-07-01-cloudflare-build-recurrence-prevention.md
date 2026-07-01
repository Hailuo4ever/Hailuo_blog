# Cloudflare Build Recurrence Prevention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent stale Astro content state from reaching a Cloudflare deployment, even if Cloudflare's build settings or repository scripts later drift.

**Architecture:** Keep Astro's active cache outside Cloudflare's restored dependency cache and delete all known cache/output directories before each build. Run the repository's build-safety contract automatically for every `pnpm run build`, fail closed when generated post inventory differs from source, and disable/purge Cloudflare's shared build cache on both production and preview triggers.

**Tech Stack:** Astro 5, Node.js test runner, pnpm, GitHub Actions, Cloudflare Workers Builds API

---

### Task 1: Enforce the build-safety contract on every build

**Files:**
- Modify: `scripts/prepare-build.test.js`
- Modify: `package.json`

- [ ] **Step 1: Write the failing test**

Add an assertion that `package.json` defines `prebuild` as the direct Node commands for both build-safety tests. This makes Cloudflare's existing `pnpm run build` command execute the contract automatically without relying on a separate CI-only step.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node scripts/prepare-build.test.js`

Expected: FAIL because `scripts.prebuild` is not defined.

- [ ] **Step 3: Add the minimum implementation**

Add this package script:

```json
"prebuild": "node scripts/prepare-build.test.js && node scripts/verify-posts.test.js"
```

- [ ] **Step 4: Run focused tests**

Run: `pnpm run test:build-safety`

Expected: all build-safety tests pass.

### Task 2: Document the fail-closed recovery procedure

**Files:**
- Create: `docs/cloudflare-build-safety.md`

- [ ] **Step 1: Record the protected invariants**

Document the required Cloudflare command (`pnpm run build`), disabled shared build cache, active cache directory, pre-build deletion targets, and post-build inventory equality requirement.

- [ ] **Step 2: Record recovery steps**

Document that any inventory mismatch must stop deployment, trigger a Cloudflare build-cache purge, and rebuild the same commit without bypassing `verify-posts`.

### Task 3: Harden Cloudflare Workers Builds settings

**Files:**
- External configuration: Cloudflare Workers Builds triggers for `hailuoblog`

- [ ] **Step 1: Inspect all triggers**

Confirm production and preview triggers both use `pnpm run build`, and capture their current cache settings.

- [ ] **Step 2: Disable shared build caching**

Set `build_caching_enabled` to `false` on both triggers. This trades some dependency-install speed for deterministic builds.

- [ ] **Step 3: Purge the existing shared cache**

Call the build-cache purge endpoint for both triggers so no previously persisted Astro data can be restored.

- [ ] **Step 4: Read both triggers back**

Verify both still use `pnpm run build` and now report `build_caching_enabled: false`.

### Task 4: Verify the complete build path

**Files:**
- Verify only

- [ ] **Step 1: Run build-safety tests**

Run: `pnpm run test:build-safety`

Expected: zero failures.

- [ ] **Step 2: Run a full clean build**

Run: `pnpm run build`

Expected: the prebuild contract runs, cache directories are cleared, Astro completes, and `verify-posts` reports equal source, generated-route, archive, and tracked-status counts.

- [ ] **Step 3: Inspect the final diff**

Run: `git diff --check` and `git status --short`.

Expected: no whitespace errors; only the planned package, test, plan, and runbook files are modified or added.
