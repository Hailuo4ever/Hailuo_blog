import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

let prepareBuild;
try {
	({ prepareBuild } = await import("./prepare-build.js"));
} catch (error) {
	assert.fail(`prepare-build module must exist: ${error.message}`);
}

test("removes restored Astro and output caches before a build", () => {
	const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "hailuo-build-"));
	const activeAstroCacheDir = path.join(rootDir, ".astro-build-cache");
	const restoredAstroCacheDir = path.join(rootDir, "node_modules", ".astro");
	const distDir = path.join(rootDir, "dist");
	const sourceDir = path.join(rootDir, "src");

	try {
		fs.mkdirSync(activeAstroCacheDir, { recursive: true });
		fs.mkdirSync(restoredAstroCacheDir, { recursive: true });
		fs.mkdirSync(distDir, { recursive: true });
		fs.mkdirSync(sourceDir, { recursive: true });
		fs.writeFileSync(
			path.join(activeAstroCacheDir, "data-store.json"),
			"stale",
		);
		fs.writeFileSync(
			path.join(restoredAstroCacheDir, "data-store.json"),
			"stale",
		);
		fs.writeFileSync(path.join(distDir, "stale.html"), "stale");
		fs.writeFileSync(path.join(sourceDir, "keep.txt"), "keep");

		prepareBuild(rootDir);

		assert.equal(fs.existsSync(activeAstroCacheDir), false);
		assert.equal(fs.existsSync(restoredAstroCacheDir), false);
		assert.equal(fs.existsSync(distDir), false);
		assert.equal(
			fs.readFileSync(path.join(sourceDir, "keep.txt"), "utf8"),
			"keep",
		);
	} finally {
		fs.rmSync(rootDir, { recursive: true, force: true });
	}
});

test("keeps the active Astro cache outside Cloudflare's restored cache", () => {
	const astroConfig = fs.readFileSync(
		new URL("../astro.config.mjs", import.meta.url),
		"utf8",
	);

	assert.match(
		astroConfig,
		/cacheDir:\s*["']\.\/\.astro-build-cache["']/,
	);
});

test("runs cache preparation before Astro without relying on --force", () => {
	const packageJson = JSON.parse(
		fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
	);

	assert.match(
		packageJson.scripts.build,
		/^node scripts\/prepare-build\.js && astro build &&/,
	);
	assert.doesNotMatch(packageJson.scripts.build, /astro build --force/);
});

test("runs post verification without a nested package-manager process", () => {
	const packageJson = JSON.parse(
		fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
	);

	assert.match(packageJson.scripts.build, /&& node scripts\/verify-posts\.js$/);
	assert.doesNotMatch(packageJson.scripts.build, /pnpm run verify:posts/);
});

test("runs build safety tests in GitHub before the full build", () => {
	const packageJson = JSON.parse(
		fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
	);
	const workflow = fs.readFileSync(
		new URL("../.github/workflows/build.yml", import.meta.url),
		"utf8",
	);

	assert.equal(
		packageJson.scripts["test:build-safety"],
		"node scripts/prepare-build.test.js && node scripts/verify-posts.test.js",
	);
	assert.match(workflow, /run: pnpm run test:build-safety/);
});

test("runs build safety tests automatically before every package build", () => {
	const packageJson = JSON.parse(
		fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
	);

	assert.equal(
		packageJson.scripts.prebuild,
		"node scripts/prepare-build.test.js && node scripts/verify-posts.test.js",
	);
});

test("uses the native legacy collection runtime for the legacy entry API", () => {
	const astroConfig = fs.readFileSync(
		new URL("../astro.config.mjs", import.meta.url),
		"utf8",
	);
	const contentConfig = fs.readFileSync(
		new URL("../src/content/config.ts", import.meta.url),
		"utf8",
	);

	assert.match(contentConfig, /type:\s*["']content["']/);
	assert.match(
		astroConfig,
		/legacy:\s*{[\s\S]*?collections:\s*true[\s\S]*?}/,
		"legacy collection definitions must not use Astro's Content Layer compatibility bridge",
	);
});

test("ignores the project-local pnpm store", () => {
	const gitignore = fs.readFileSync(
		new URL("../.gitignore", import.meta.url),
		"utf8",
	);

	assert.match(gitignore, /^\.pnpm-store\/$/m);
});
