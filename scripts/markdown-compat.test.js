import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/contrib/mhchem.mjs";
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

test("math renderer, stylesheet and mhchem use the same KaTeX instance", async () => {
	const require = createRequire(import.meta.url);
	const rendererRequire = createRequire(require.resolve("rehype-katex"));
	assert.equal(
		require.resolve("katex"),
		rendererRequire.resolve("katex"),
		"KaTeX CSS/mhchem must match rehype-katex's renderer",
	);
	const css = await readFile(require.resolve("katex/dist/katex.css"), "utf8");
	assert.ok(css.includes(`content: "${require("katex").version}"`));

	const mathProcessor = await createMarkdownProcessor({
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	});
	const result = await mathProcessor.render(String.raw`$a_0, a_{31}, 2^{i+1}, b_{L-1}$

$$
\sum_{i=0}^{31}a_i2^i=\frac{n}{2}
$$

$\ce{H2O}$`);
	assert.doesNotMatch(result.code, /katex-error/);
	assert.match(result.code, /class="katex-display"/);
	assert.match(result.code, /class="mfrac"/);
	assert.match(result.code, /class="msupsub"/);
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
