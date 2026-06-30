import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const verifyModule = await import("./verify-posts.js");

assert.equal(
	typeof verifyModule.verifyPosts,
	"function",
	"verify-posts should export a testable verifyPosts function",
);

const { PostVerificationError, verifyPosts } = verifyModule;

function createFixture() {
	return fs.mkdtempSync(path.join(os.tmpdir(), "hailuo-verify-posts-"));
}

function writePost(rootDir, id, status = "published") {
	const postPath = path.join(
		rootDir,
		"src",
		"content",
		"posts",
		...id.split("/"),
	);
	fs.mkdirSync(path.dirname(postPath), { recursive: true });
	fs.writeFileSync(
		postPath,
		[
			"---",
			`title: ${id}`,
			`status: ${status}`,
			"draft: false",
			"---",
			"",
			"Fixture body.",
		].join("\n"),
	);
}

function writeGeneratedPage(rootDir, slug) {
	const pagePath = path.join(
		rootDir,
		"dist",
		"posts",
		...slug.split("/"),
		"index.html",
	);
	fs.mkdirSync(path.dirname(pagePath), { recursive: true });
	fs.writeFileSync(pagePath, "<!doctype html>");
}

function writeArchive(rootDir, entries) {
	const archivePath = path.join(rootDir, "dist", "archive", "index.html");
	const serializedEntries = entries
		.map(
			({ id, slug, status = "published" }) =>
				`&quot;sourcePath&quot;:[0,&quot;${id}&quot;]` +
				`&quot;status&quot;:[0,&quot;${status}&quot;]` +
				`&quot;slug&quot;:[0,&quot;${slug}&quot;]`,
		)
		.join("");

	fs.mkdirSync(path.dirname(archivePath), { recursive: true });
	fs.writeFileSync(archivePath, serializedEntries);
}

test("accepts a complete set of generated post routes", () => {
	const rootDir = createFixture();

	try {
		writePost(rootDir, "kept.md");
		writePost(rootDir, "nested/second.md", "editing");
		writeGeneratedPage(rootDir, "kept");
		writeGeneratedPage(rootDir, "nested/second");
		writeArchive(rootDir, [
			{ id: "kept.md", slug: "kept" },
			{ id: "nested/second.md", slug: "nested/second", status: "editing" },
		]);

		assert.deepEqual(verifyPosts(rootDir), {
			sourceCount: 2,
			generatedCount: 2,
			archiveCount: 2,
			statusCount: 2,
		});
	} finally {
		fs.rmSync(rootDir, { recursive: true, force: true });
	}
});

test("reports every missing source post when generated output is incomplete", () => {
	const rootDir = createFixture();

	try {
		writePost(rootDir, "kept.md");
		writePost(rootDir, "missing.md");
		writeGeneratedPage(rootDir, "kept");
		writeArchive(rootDir, [{ id: "kept.md", slug: "kept" }]);

		assert.throws(
			() => verifyPosts(rootDir),
			(error) => {
				assert.ok(error instanceof PostVerificationError);
				assert.match(error.message, /1 generated, 2 source/);
				assert.match(error.message, /missing\.md/);
				return true;
			},
		);
	} finally {
		fs.rmSync(rootDir, { recursive: true, force: true });
	}
});
