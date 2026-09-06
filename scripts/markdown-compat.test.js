import assert from "node:assert/strict";
import test from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkDirective from "remark-directive";
import rehypeComponents from "rehype-components";
import rehypeSlug from "rehype-slug";
import { parseDirectiveNode } from "../src/plugins/remark-directive-rehype.js";
import { MusicPlayerComponent } from "../src/plugins/rehype-component-music-player.mjs";

const processor = await createMarkdownProcessor({
	remarkPlugins: [remarkDirective, parseDirectiveNode],
	rehypePlugins: [
		rehypeSlug,
		[rehypeComponents, { components: { music: MusicPlayerComponent } }],
	],
});
test("keeps literal colon text and the original article heading anchor", async () => {
	const result = await processor.render("# A - 16:9");
	assert.match(result.code, /id="a---169"/);
	assert.match(result.code, /A - 16:9/);
});
test("legacy music directives retain native audio, cover and format sources", async () => {
	const result = await processor.render(
		':::music{title="Song" artist="Artist" cover="https://example.com/cover.png" mp3="https://example.com/song.mp3" flac="https://example.com/song.flac"}\n:::',
	);
	assert.match(result.code, /<audio[^>]*controls/);
	assert.match(result.code, /audio\/mpeg/);
	assert.match(result.code, /audio\/flac/);
	assert.match(result.code, /cover\.png/);
	assert.match(result.code, /preload="none"/);
});
