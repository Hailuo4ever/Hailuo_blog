import { getCollection, type CollectionEntry } from "astro:content";
import type { APIRoute, MarkdownHeading } from "astro";
import { formatDateToYYYYMMDD } from "@utils/date-utils";
import { getPostUrlBySlug } from "@utils/url-utils";
import type { ContestProblemSearchItem } from "@/global";

export const prerender = true;

type PostEntry = CollectionEntry<"posts">;

type HeadingSection = {
	title: string;
	content: string;
	headingIndex: number;
};

const headingLineRegex = /^#(?!#)\s+(.+?)\s*$/;
const keywordLineRegex = /^>?\s*(?:题目\s*)?关键词\s*[：:；;]\s*(.+)$/u;
const keywordSeparatorRegex = /[，、,;；]/u;

function normalizeMarkdownHeadingText(text: string): string {
	return text.replace(/\s*#+\s*$/, "").trim();
}

function collectTopLevelHeadingSections(body: string): HeadingSection[] {
	const lines = body.split(/\r?\n/);
	const headingLines: Array<{ title: string; lineIndex: number }> = [];
	let fenceMarker: "`" | "~" | null = null;

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		const line = lines[lineIndex];
		const trimmed = line.trim();
		const fenceMatch = trimmed.match(/^(`{3,}|~{3,})/);

		if (fenceMatch) {
			const currentFenceMarker = fenceMatch[1][0] as "`" | "~";
			if (!fenceMarker) {
				fenceMarker = currentFenceMarker;
			} else if (fenceMarker === currentFenceMarker) {
				fenceMarker = null;
			}
			continue;
		}

		if (fenceMarker) continue;

		const headingMatch = line.match(headingLineRegex);
		if (!headingMatch) continue;

		headingLines.push({
			title: normalizeMarkdownHeadingText(headingMatch[1]),
			lineIndex,
		});
	}

	return headingLines.map((heading, headingIndex) => {
		const nextHeading = headingLines[headingIndex + 1];
		const endLineIndex = nextHeading?.lineIndex ?? lines.length;

		return {
			title: heading.title,
			content: lines.slice(heading.lineIndex + 1, endLineIndex).join("\n"),
			headingIndex,
		};
	});
}

function parseKeywords(sectionContent: string): string[] {
	const keywords = new Set<string>();

	for (const line of sectionContent.split(/\r?\n/)) {
		const match = line.trim().match(keywordLineRegex);
		if (!match) continue;

		for (const keyword of match[1].split(keywordSeparatorRegex)) {
			const normalizedKeyword = keyword.trim();
			if (normalizedKeyword) keywords.add(normalizedKeyword);
		}
	}

	return Array.from(keywords);
}

async function extractContestProblems(
	post: PostEntry,
): Promise<ContestProblemSearchItem[]> {
	const body = typeof post.body === "string" ? post.body : "";
	const sections = collectTopLevelHeadingSections(body);
	if (sections.length === 0) return [];

	const { headings } = await post.render();
	const topLevelHeadings = headings.filter(
		(heading: MarkdownHeading) => heading.depth === 1,
	);

	return sections.flatMap((section) => {
		const heading = topLevelHeadings[section.headingIndex];
		if (!heading?.slug) return [];

		const keywords = parseKeywords(section.content);

		return {
			url: `${getPostUrlBySlug(post.slug)}#${heading.slug}`,
			title: normalizeMarkdownHeadingText(heading.text || section.title),
			contestTitle: post.data.title,
			keywords,
			published: formatDateToYYYYMMDD(post.data.published),
			slug: post.slug,
		};
	});
}

export const GET: APIRoute = async () => {
	const posts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const contestPosts = posts
		.filter((post) => post.slug.startsWith("contests/"))
		.sort((a, b) => {
			const dateDiff =
				b.data.published.getTime() - a.data.published.getTime();
			return dateDiff || a.slug.localeCompare(b.slug);
		});

	const problems = (
		await Promise.all(contestPosts.map((post) => extractContestProblems(post)))
	).flat();

	return new Response(JSON.stringify(problems), {
		headers: {
			"Cache-Control": "public, max-age=3600",
			"Content-Type": "application/json; charset=utf-8",
		},
	});
};
