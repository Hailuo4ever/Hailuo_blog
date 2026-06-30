import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultRootDir = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const postExtensions = new Set([".md", ".mdx"]);
const postStatuses = new Set(["published", "editing"]);

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

function readFrontmatter(file) {
	const content = fs.readFileSync(file, "utf8");
	const frontmatterMatch = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);

	return frontmatterMatch?.[1] ?? "";
}

function formatIssues(issues) {
	return issues
		.flatMap(({ message, details }) => [
			`[verify-posts] ${message}`,
			...details.map((detail) => `  - ${detail}`),
		])
		.join("\n");
}

export class PostVerificationError extends Error {
	constructor(issues) {
		super(formatIssues(issues));
		this.name = "PostVerificationError";
		this.issues = issues;
	}
}

function addIssue(issues, message, details = []) {
	issues.push({ message, details });
}

function readPostStatus(file, frontmatter, rootDir, issues) {
	const statusMatch = frontmatter.match(
		/^status\s*:\s*(?:"([^"]*)"|'([^']*)'|([^\s#]+))/im,
	);
	const status = (
		statusMatch?.[1] ??
		statusMatch?.[2] ??
		statusMatch?.[3] ??
		"published"
	).trim();

	if (!postStatuses.has(status)) {
		addIssue(
			issues,
			`Invalid status in ${path.relative(rootDir, file)}: ${status}`,
		);
	}

	return status;
}

function readSourcePost(file, sourcePostsDir, rootDir, issues) {
	const frontmatter = readFrontmatter(file);
	const draft = /^draft\s*:\s*true\s*(?:#.*)?$/im.test(frontmatter);
	const id = toPosixPath(path.relative(sourcePostsDir, file));

	return {
		file,
		id,
		draft,
		status: readPostStatus(file, frontmatter, rootDir, issues),
	};
}

function getArchivePostStatus(archiveHtml, postId) {
	const sourcePathToken = `&quot;sourcePath&quot;:[0,&quot;${escapeHtml(postId)}&quot;]`;
	const sourcePathIndex = archiveHtml.indexOf(sourcePathToken);

	if (sourcePathIndex === -1) return null;

	const nextSourcePathIndex = archiveHtml.indexOf(
		"&quot;sourcePath&quot;:[0,&quot;",
		sourcePathIndex + sourcePathToken.length,
	);
	const postSegment =
		nextSourcePathIndex === -1
			? archiveHtml.slice(sourcePathIndex)
			: archiveHtml.slice(sourcePathIndex, nextSourcePathIndex);
	const statusMatch = postSegment.match(
		/&quot;status&quot;:\[0,&quot;([^&]*)&quot;\]/,
	);

	return statusMatch ? decodeHtml(statusMatch[1]) : null;
}

export function verifyPosts(rootDir = defaultRootDir) {
	const resolvedRootDir = path.resolve(rootDir);
	const sourcePostsDir = path.join(resolvedRootDir, "src", "content", "posts");
	const distPostsDir = path.join(resolvedRootDir, "dist", "posts");
	const archiveHtmlPath = path.join(
		resolvedRootDir,
		"dist",
		"archive",
		"index.html",
	);
	const issues = [];

	const sourcePosts = walkFiles(sourcePostsDir)
		.filter((file) => postExtensions.has(path.extname(file).toLowerCase()))
		.map((file) =>
			readSourcePost(file, sourcePostsDir, resolvedRootDir, issues),
		)
		.filter((post) => !post.draft)
		.sort((a, b) => a.id.localeCompare(b.id));
	const sourcePostIds = sourcePosts.map((post) => post.id);

	if (sourcePostIds.length === 0) {
		addIssue(issues, "No source posts were found under src/content/posts.");
	}

	if (!fs.existsSync(archiveHtmlPath)) {
		addIssue(
			issues,
			"dist/archive/index.html was not generated. Run pnpm run build first.",
		);
		throw new PostVerificationError(issues);
	}

	const generatedPostPages = walkFiles(distPostsDir).filter(
		(file) => path.basename(file) === "index.html",
	);
	const archiveHtml = fs.readFileSync(archiveHtmlPath, "utf8");
	const archiveSourceIds = [
		...archiveHtml.matchAll(
			/&quot;sourcePath&quot;:\[0,&quot;([^&]*)&quot;\]/g,
		),
	].map((match) => decodeHtml(match[1]));
	const archiveSourceIdSet = new Set(archiveSourceIds);
	const sourcePostIdSet = new Set(sourcePostIds);
	const missingArchiveEntries = sourcePostIds.filter(
		(postId) => !archiveSourceIdSet.has(postId),
	);
	const unexpectedArchiveEntries = archiveSourceIds.filter(
		(postId) => !sourcePostIdSet.has(postId),
	);

	if (generatedPostPages.length !== sourcePostIds.length) {
		addIssue(
			issues,
			`Generated post page count does not match source post count (${generatedPostPages.length} generated, ${sourcePostIds.length} source).`,
			[
				...missingArchiveEntries.map((postId) => `Missing: ${postId}`),
				...unexpectedArchiveEntries.map((postId) => `Unexpected: ${postId}`),
			],
		);
	}

	if (archiveSourceIds.length !== sourcePostIds.length) {
		addIssue(
			issues,
			`Archive data count does not match source post count (${archiveSourceIds.length} archive entries, ${sourcePostIds.length} source).`,
		);
	}

	if (missingArchiveEntries.length > 0) {
		addIssue(
			issues,
			"Archive folder data is missing source posts.",
			missingArchiveEntries,
		);
	}

	if (unexpectedArchiveEntries.length > 0) {
		addIssue(
			issues,
			"Archive folder data contains unexpected source posts.",
			unexpectedArchiveEntries,
		);
	}

	const staleArchiveStatuses = sourcePosts
		.filter((post) => archiveSourceIdSet.has(post.id))
		.map((post) => ({
			...post,
			archiveStatus: getArchivePostStatus(archiveHtml, post.id),
		}))
		.filter((post) => post.archiveStatus !== post.status);

	if (staleArchiveStatuses.length > 0) {
		addIssue(
			issues,
			"Archive data has stale post status values.",
			staleArchiveStatuses.map(
				(post) =>
					`${post.id}: source status is ${post.status}, archive status is ${
						post.archiveStatus ?? "missing"
					}`,
			),
		);
	}

	const routeSlugs = [
		...archiveHtml.matchAll(/&quot;slug&quot;:\[0,&quot;([^&]*)&quot;\]/g),
	].map((match) => decodeHtml(match[1]));

	if (routeSlugs.length !== sourcePostIds.length) {
		addIssue(
			issues,
			`Archive route count does not match source post count (${routeSlugs.length} archive routes, ${sourcePostIds.length} source).`,
		);
	}

	const missingRoutePages = routeSlugs.filter((slug) => {
		const routePath = path.join(distPostsDir, ...slug.split("/"), "index.html");
		return !fs.existsSync(routePath);
	});

	if (missingRoutePages.length > 0) {
		addIssue(
			issues,
			"Archive data points to post routes that were not generated.",
			missingRoutePages,
		);
	}

	if (issues.length > 0) {
		throw new PostVerificationError(issues);
	}

	return {
		sourceCount: sourcePostIds.length,
		generatedCount: generatedPostPages.length,
		archiveCount: archiveSourceIds.length,
		statusCount: sourcePosts.length,
	};
}

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	try {
		const result = verifyPosts();
		console.log(
			`[verify-posts] ${result.sourceCount} visible source posts, ${result.generatedCount} generated routes, ${result.archiveCount} archive entries, ${result.statusCount} tracked statuses.`,
		);
	} catch (error) {
		if (!(error instanceof PostVerificationError)) throw error;
		console.error(error.message);
		process.exitCode = 1;
	}
}
