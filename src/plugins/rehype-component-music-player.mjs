import { h } from "hastscript";

/** Legacy article directive, using native controls so Swup removal stops playback. */
export function MusicPlayerComponent(properties) {
	const sources = [
		[properties.mp3, "audio/mpeg"],
		[properties.flac, "audio/flac"],
		[properties.src, properties.type || "audio/mpeg"],
	].filter(([src]) => typeof src === "string" && src.trim());
	if (!sources.length) return h("p", "音频地址未配置");
	return h("figure", { class: "legacy-music", "data-pagefind-ignore": true }, [
		...(properties.cover
			? [
					h("img", {
						src: properties.cover,
						alt: properties.title || "音乐封面",
						loading: "lazy",
						width: 120,
						height: 120,
					}),
				]
			: []),
		h("figcaption", [
			properties.title || "音乐",
			properties.artist ? ` — ${properties.artist}` : "",
		]),
		h(
			"audio",
			{
				controls: true,
				preload: "none",
				style: "width:100%;max-width:32rem",
				"aria-label": properties.title || "音乐",
			},
			[
				...sources.map(([src, type]) => h("source", { src, type })),
				h("a", { href: sources[0][0] }, "下载音频"),
			],
		),
	]);
}
