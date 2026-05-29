import rss from "@astrojs/rss";
import { getSortedPosts, isFinishedPost } from "@utils/content-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

const parser = new MarkdownIt();

function getDirectiveAttribute(attributes: string, name: string) {
	const match = attributes.match(new RegExp(`${name}="([^"]*)"`, "i"));
	return match?.[1] || "";
}

function replaceMusicDirectives(content: string) {
	return content.replace(/^::music\{([^}]*)\}$/gm, (_match, attributes) => {
		const title = getDirectiveAttribute(attributes, "title") || "Audio";
		const artist = getDirectiveAttribute(attributes, "artist");
		const mp3 = getDirectiveAttribute(attributes, "mp3");
		const flac = getDirectiveAttribute(attributes, "flac");
		const src = getDirectiveAttribute(attributes, "src");
		const audioUrl = mp3 || src || flac;
		const label = artist ? `${title} - ${artist}` : title;
		const links = audioUrl ? [`[${label}](${audioUrl})`] : [label];

		if (flac && flac !== audioUrl) {
			links.push(`[FLAC](${flac})`);
		}

		return `Music: ${links.join(" / ")}`;
	});
}

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

export async function GET(context: APIContext) {
	const blog = (await getSortedPosts()).filter((post) =>
		isFinishedPost(post.data),
	);

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: context.site ?? "https://blog.hailuo4ever.com",
		items: blog.map((post) => {
			const content =
				typeof post.body === "string" ? post.body : String(post.body || "");
			const cleanedContent = stripInvalidXmlChars(
				replaceMusicDirectives(content),
			);
			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: post.data.description || "",
				link: url(`/posts/${post.slug}/`),
				content: sanitizeHtml(parser.render(cleanedContent), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		}),
		customData: `<language>${siteConfig.lang}</language>`,
	});
}
