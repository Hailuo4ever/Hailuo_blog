import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePostsDir = path.join(rootDir, "src", "content", "posts");
const distPostsDir = path.join(rootDir, "dist", "posts");
const archiveHtmlPath = path.join(rootDir, "dist", "archive", "index.html");
const postExtensions = new Set([".md", ".mdx"]);

function walkFiles(dir) {
	if (!fs.existsSync(dir)) return [];

	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const fullPath = path.join(dir, entry.name);
		return entry.isDirectory() ? walkFiles(fullPath) : [fullPath];
	});
}

function toPosixPath(value) {
	return value.split(path.sep).join("/");
}

function escapeHtml(value) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

function decodeHtml(value) {
	return value
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&");
}

function isDraftPost(file) {
	const content = fs.readFileSync(file, "utf8");
	const frontmatterMatch = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
	if (!frontmatterMatch) return false;

	return /^draft\s*:\s*true\s*(?:#.*)?$/im.test(frontmatterMatch[1]);
}

function fail(message, details = []) {
	console.error(`[verify-posts] ${message}`);
	for (const detail of details) {
		console.error(`  - ${detail}`);
	}
	process.exit(1);
}

const sourcePostIds = walkFiles(sourcePostsDir)
	.filter((file) => postExtensions.has(path.extname(file).toLowerCase()))
	.filter((file) => !isDraftPost(file))
	.map((file) => toPosixPath(path.relative(sourcePostsDir, file)))
	.sort((a, b) => a.localeCompare(b));

if (sourcePostIds.length === 0) {
	fail("No source posts were found under src/content/posts.");
}

if (!fs.existsSync(archiveHtmlPath)) {
	fail("dist/archive/index.html was not generated. Run pnpm run build first.");
}

const generatedPostPages = walkFiles(distPostsDir).filter(
	(file) => path.basename(file) === "index.html",
);

if (generatedPostPages.length !== sourcePostIds.length) {
	fail(
		`Generated post page count does not match source post count (${generatedPostPages.length} generated, ${sourcePostIds.length} source).`,
	);
}

const archiveHtml = fs.readFileSync(archiveHtmlPath, "utf8");
const archiveSourcePathCount =
	archiveHtml.match(/&quot;sourcePath&quot;:\[0,/g)?.length ?? 0;

if (archiveSourcePathCount !== sourcePostIds.length) {
	fail(
		`Archive data count does not match source post count (${archiveSourcePathCount} archive entries, ${sourcePostIds.length} source).`,
	);
}

const missingArchiveEntries = sourcePostIds.filter(
	(postId) => !archiveHtml.includes(escapeHtml(postId)),
);

if (missingArchiveEntries.length > 0) {
	fail("Archive folder data is missing source posts.", missingArchiveEntries);
}

const routeSlugs = [
	...archiveHtml.matchAll(/&quot;slug&quot;:\[0,&quot;([^&]*)&quot;\]/g),
].map((match) => decodeHtml(match[1]));

if (routeSlugs.length !== sourcePostIds.length) {
	fail(
		`Archive route count does not match source post count (${routeSlugs.length} archive routes, ${sourcePostIds.length} source).`,
	);
}

const missingRoutePages = routeSlugs.filter((slug) => {
	const routePath = path.join(distPostsDir, ...slug.split("/"), "index.html");
	return !fs.existsSync(routePath);
});

if (missingRoutePages.length > 0) {
	fail("Archive data points to post routes that were not generated.", missingRoutePages);
}

console.log(
	`[verify-posts] ${sourcePostIds.length} visible source posts, ${generatedPostPages.length} generated routes, ${archiveSourcePathCount} archive entries.`,
);
