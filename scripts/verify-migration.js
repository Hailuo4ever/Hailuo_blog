import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { elements, sourcePosts, verifyPosts } from "./verify-posts.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const baseline = JSON.parse(
	fs.readFileSync(
		path.join(root, "docs/migration/fuwari-baseline.json"),
		"utf8",
	),
);
const hash = (file) =>
	crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const actual = new Map(sourcePosts(root).map((p) => [p.file, p]));
const issues = [];
let anchorCount = 0;
verifyPosts(root);
for (const old of baseline.posts) {
	const current = actual.get(old.file);
	if (!current) {
		issues.push(`Missing article: ${old.file}`);
		continue;
	}
	if (hash(path.join(root, "src/content/posts", old.file)) !== old.sha256)
		issues.push(`Article changed: ${old.file}`);
	if (current.draft !== old.draft || (!old.draft && current.url !== old.url))
		issues.push(`Visibility/URL changed: ${old.file}`);
	if (old.draft) continue;
	const html = fs.readFileSync(
		path.join(root, "dist", old.url, "index.html"),
		"utf8",
	);
	const ids = new Set(
		elements(html, (n) => Boolean(n.properties.id)).map((n) => n.properties.id),
	);
	for (const anchor of old.anchors) {
		anchorCount++;
		if (!ids.has(anchor)) issues.push(`Missing anchor: ${old.url}#${anchor}`);
	}
	const widget = elements(html, (n) => n.tagName === "giscus-widget")[0];
	if (
		!widget ||
		widget.properties.mapping !== "pathname" ||
		widget.properties.repo !== "Hailuo4ever/Hailuo_blog"
	)
		issues.push(`Comment mapping mismatch: ${old.url}`);
}
if (actual.size !== baseline.posts.length)
	issues.push("Article count changed during migration");
for (const asset of baseline.assets) {
	const file = path.join(root, asset.file);
	if (!fs.existsSync(file) || hash(file) !== asset.sha256)
		issues.push(`Asset changed/missing: ${asset.file}`);
}
if (issues.length) {
	console.error(issues.join("\n"));
	process.exitCode = 1;
} else
	console.log(
		`[verify-migration] ${actual.size} unchanged articles, ${baseline.assets.length} unchanged assets, ${anchorCount} preserved anchors; all URLs and comment mappings match.`,
	);
