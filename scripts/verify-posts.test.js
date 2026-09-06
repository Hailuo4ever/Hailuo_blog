import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { verifyPosts } from "./verify-posts.js";

function fixture(t) {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "firefly-posts-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const write = (file, value) => {
		const dest = path.join(root, file);
		fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.writeFileSync(dest, value);
	};
	write(
		"src/content/posts/Notes/Hello World.md",
		"---\ntitle: Test\npublished: 2026-01-01\nstatus: editing\ndraft: false\n---\nVisible",
	);
	write(
		"src/content/posts/private.md",
		"---\ntitle: Private\npublished: 2026-01-01\ndraft: true\n---\nHidden",
	);
	write("dist/posts/notes/hello-world/index.html", "<h1>Test</h1>");
	write(
		"dist/archive/index.html",
		'<a class="archive-post" href="/posts/notes/hello-world/">Test</a>',
	);
	write(
		"dist/rss.xml",
		"<rss><channel><item><link>https://blog.hailuo4ever.com/posts/notes/hello-world/</link></item></channel></rss>",
	);
	write(
		"dist/sitemap-0.xml",
		"<urlset><url><loc>https://blog.hailuo4ever.com/posts/notes/hello-world/</loc></url></urlset>",
	);
	return { root, write };
}
test("editing stays public, draft stays private, legacy case/space URL survives", (t) => {
	assert.equal(verifyPosts(fixture(t).root).sourceCount, 1);
});
test("rejects stale routes from removed posts and leaked draft pages", (t) => {
	const { root, write } = fixture(t);
	write("dist/posts/private/index.html", "leak");
	assert.throws(() => verifyPosts(root), /unexpected \/posts\/private\//);
});
test("rejects newly added posts missing from cached build", (t) => {
	const { root, write } = fixture(t);
	write("src/content/posts/new.md", "---\ntitle: New\n---\nNew");
	assert.throws(() => verifyPosts(root), /missing \/posts\/new\//);
});
test("rejects missing archive entries without depending on island serialization", (t) => {
	const { root, write } = fixture(t);
	write("dist/archive/index.html", "<archive-panel></archive-panel>");
	assert.throws(() => verifyPosts(root), /Archive: missing/);
});
test("rejects RSS omissions and stale sitemap URLs", (t) => {
	const { root, write } = fixture(t);
	write("dist/rss.xml", "<rss/>");
	write(
		"dist/sitemap-0.xml",
		"<urlset><loc>https://blog.hailuo4ever.com/posts/deleted/</loc></urlset>",
	);
	assert.throws(
		() => verifyPosts(root),
		/RSS: missing[\s\S]*Sitemap: unexpected/,
	);
});
test("rejects two source files mapping to one legacy slug", (t) => {
	const { root, write } = fixture(t);
	write(
		"src/content/posts/collision.md",
		"---\ntitle: Duplicate\nslug: notes/hello-world\n---\nDuplicate",
	);
	assert.throws(() => verifyPosts(root), /colliding URLs/);
});
