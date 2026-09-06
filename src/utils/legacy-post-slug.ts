import { slug } from "github-slugger";

/** Preserve Astro 5 legacy collection URLs, including nested paths and index posts. */
export function legacyPostSlug(entry: string, explicitSlug?: unknown): string {
	if (typeof explicitSlug === "string") return explicitSlug;
	return entry
		.replaceAll("\\", "/")
		.replace(/\.(md|mdx)$/i, "")
		.split("/")
		.map((segment) => slug(segment))
		.join("/")
		.replace(/\/index$/, "");
}
