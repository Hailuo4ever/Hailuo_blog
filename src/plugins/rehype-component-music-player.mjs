import { h } from "hastscript";

export function MusicPlayerComponent({
	title: trackTitle,
	artist,
	cover,
	mp3,
	flac,
	src,
	type,
}) {
	const sources = [
		[mp3, "audio/mpeg"],
		[flac, "audio/flac"],
		[src, type],
	].filter(([url]) => typeof url === "string" && url.trim());
	if (!sources.length) return h("p", "音频地址未配置");
	const title = trackTitle || "音乐";

	return h(
		"article-music",
		{ role: "group", "aria-label": title, "data-pagefind-ignore": true },
		[
			h(
				"button.track-toggle",
				{ type: "button", hidden: true, "aria-label": `播放 ${title}` },
				[
					...(cover
						? [
								h("img", {
									src: cover,
									alt: "",
									loading: "lazy",
									width: 60,
									height: 60,
								}),
							]
						: []),
					h("span.track-symbol", { "aria-hidden": true }),
				],
			),
			h("div.track-info", [
				h("span.track-title", { title }, title),
				...(artist ? [h("span.track-artist", { title: artist }, artist)] : []),
				h("div.track-timeline", { hidden: true }, [
					h("input", {
						type: "range",
						min: 0,
						max: 0,
						step: 1,
						value: 0,
						disabled: true,
						"aria-label": `${title} 播放进度`,
					}),
					h("span.track-time", "0:00 / –:––"),
				]),
				h("span.track-status", { role: "status" }),
			]),
			h("audio", { controls: true, preload: "none", "aria-label": title }, [
				...sources.map(([src, type]) => h("source", { src, type })),
				h("a", { href: sources[0][0] }, "下载音频"),
			]),
		],
	);
}
