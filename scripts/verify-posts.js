import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { fromHtml } from "hast-util-from-html";
import { legacyPostSlug } from "../src/utils/legacy-post-slug.ts";

const defaultRoot = fileURLToPath(new URL("../", import.meta.url));
export function walkFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const file = path.join(dir, entry.name);
		return entry.isDirectory() ? walkFiles(file) : [file];
	});
}
export function sourcePosts(root) {
	const base = path.join(root, "src/content/posts");
	return walkFiles(base)
		.filter((f) => /\.(md|mdx)$/i.test(f))
		.map((file) => {
			const { data } = matter.read(file);
			const relative = path.relative(base, file).replaceAll("\\", "/");
			return {
				file: relative,
				draft: data.draft === true,
				url: `/posts/${legacyPostSlug(relative, data.slug)}/`,
			};
		});
}
export function elements(html, predicate) {
	const found = [];
	function visit(node) {
		if (node.type === "element" && predicate(node)) found.push(node);
		for (const child of node.children || []) visit(child);
	}
	visit(fromHtml(html));
	return found;
}
function normalizeUrl(value) {
	return decodeURI(new URL(value, "https://blog.hailuo4ever.com").pathname);
}
function requireSame(label, expected, actual, issues) {
	const wanted = new Set(expected),
		received = new Set(actual);
	if (actual.length !== received.size)
		issues.push(`${label}: duplicate entries`);
	for (const value of wanted)
		if (!received.has(value)) issues.push(`${label}: missing ${value}`);
	for (const value of received)
		if (!wanted.has(value)) issues.push(`${label}: unexpected ${value}`);
}
export function verifyPosts(root = defaultRoot) {
	const posts = sourcePosts(root).filter((p) => !p.draft);
	if (!posts.length) throw new Error("No visible source posts found");
	const urls = posts.map((p) => p.url);
	const issues = [];
	if (new Set(urls).size !== urls.length)
		issues.push("Source posts have colliding URLs");
	const dist = path.join(root, "dist");
	const routes = walkFiles(path.join(dist, "posts"))
		.filter((f) => path.basename(f) === "index.html")
		.map(
			(f) => `/${path.relative(dist, path.dirname(f)).replaceAll("\\", "/")}/`,
		);
	requireSame("Generated routes", urls, routes, issues);
	const archive = fs.readFileSync(
		path.join(dist, "archive/index.html"),
		"utf8",
	);
	const archiveUrls = elements(
		archive,
		(n) =>
			n.tagName === "a" && n.properties.className?.includes("archive-post"),
	).map((n) => normalizeUrl(n.properties.href));
	requireSame("Archive", urls, archiveUrls, issues);
	const rss = fs.readFileSync(path.join(dist, "rss.xml"), "utf8");
	const rssUrls = [
		...rss.matchAll(/<item\b[^>]*>[\s\S]*?<link>([\s\S]*?)<\/link>/g),
	].map((m) => normalizeUrl(m[1].replaceAll("&amp;", "&")));
	requireSame("RSS", urls, rssUrls, issues);
	const sitemapUrls = walkFiles(dist)
		.filter((f) => /^sitemap.*\.xml$/.test(path.basename(f)))
		.flatMap((f) => [
			...fs.readFileSync(f, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g),
		])
		.map((m) => normalizeUrl(m[1]))
		.filter((u) => u.startsWith("/posts/"));
	requireSame("Sitemap", urls, sitemapUrls, issues);
	if (issues.length) throw new Error(issues.join("\n"));
	return {
		sourceCount: posts.length,
		generatedCount: routes.length,
		archiveCount: archiveUrls.length,
		rssCount: rssUrls.length,
	};
}
if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	try {
		console.log("[verify-posts]", verifyPosts());
	} catch (error) {
		console.error("[verify-posts]", error.message);
		process.exitCode = 1;
	}
}
