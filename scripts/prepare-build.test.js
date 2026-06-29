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
	const astroCacheDir = path.join(rootDir, "node_modules", ".astro");
	const distDir = path.join(rootDir, "dist");
	const sourceDir = path.join(rootDir, "src");

	try {
		fs.mkdirSync(astroCacheDir, { recursive: true });
		fs.mkdirSync(distDir, { recursive: true });
		fs.mkdirSync(sourceDir, { recursive: true });
		fs.writeFileSync(path.join(astroCacheDir, "data-store.json"), "stale");
		fs.writeFileSync(path.join(distDir, "stale.html"), "stale");
		fs.writeFileSync(path.join(sourceDir, "keep.txt"), "keep");

		prepareBuild(rootDir);

		assert.equal(fs.existsSync(astroCacheDir), false);
		assert.equal(fs.existsSync(distDir), false);
		assert.equal(
			fs.readFileSync(path.join(sourceDir, "keep.txt"), "utf8"),
			"keep",
		);
	} finally {
		fs.rmSync(rootDir, { recursive: true, force: true });
	}
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
