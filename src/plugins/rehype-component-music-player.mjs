/// <reference types="mdast" />
import { h } from "hastscript";

const sourceKeys = ["mp3", "flac", "src"];

function getFirstSource(properties) {
	return sourceKeys.find(
		(key) =>
			typeof properties?.[key] === "string" && properties[key].trim() !== "",
	);
}

/**
 * Creates a reusable music player component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} [properties.title] - Track title.
 * @param {string} [properties.artist] - Track artist.
 * @param {string} [properties.cover] - Album cover URL.
 * @param {string} [properties.mp3] - Preferred MP3 source URL.
 * @param {string} [properties.flac] - Optional FLAC source URL.
 * @param {string} [properties.src] - Generic source URL.
 * @param {string} [properties.type] - MIME type for the generic source.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created music player component.
 */
export function MusicPlayerComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0) {
		return h(
			"div",
			{ class: "hidden" },
			'Invalid directive. ("music" directive must be leaf type "::music{title="Song" mp3="https://..."}")',
		);
	}

	if (!getFirstSource(properties)) {
		return h(
			"div",
			{ class: "hidden" },
			'Invalid music directive. Provide one of "mp3", "flac", or "src".',
		);
	}

	return h("hailuo-audio-player", {
		title: properties.title || "Untitled track",
		artist: properties.artist || "",
		cover: properties.cover || "",
		mp3: properties.mp3 || "",
		flac: properties.flac || "",
		src: properties.src || "",
		type: properties.type || "",
		"data-pagefind-ignore": true,
	});
}
