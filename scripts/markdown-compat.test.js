import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import { remarkLatexInline } from "../src/plugins/remark-latex-inline.js";
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

const latexProcessor = await createMarkdownProcessor({
	remarkPlugins: [remarkMath, remarkLatexInline],
	rehypePlugins: [rehypeKatex],
});

test("LaTeX parentheses render inline, preserving TeX commands and Markdown context", async () => {
	const result = await latexProcessor.render(String.raw`中文 \(n\)，**\(a_1^2\)** 和 \(\frac{n}{2}\)。

| formula |
| --- |
| \(x_i\) |

> \(a + b\)

$z$

$$
\sum_i x_i
$$`);
	assert.doesNotMatch(result.code, /katex-error/);
	assert.equal((result.code.match(/class="katex"/g) || []).length, 7);
	assert.match(result.code, /<strong><span class="katex"/);
	assert.match(result.code, /<td><span class="katex"/);
	assert.match(result.code, /class="mfrac"/);
	assert.match(result.code, /class="katex-display"/);
	assert.match(result.code, /a \+\s+b<\/annotation>/);
});

test("code, escaped delimiters, normal parentheses and unmatched delimiters stay literal", async () => {
	const source = String.raw`普通 (n)，\\(n\\)，未闭合 \(n。

\`\(code\)\`

\`\`\`text
\(fenced\)
\`\`\`

    \(indented\)

<span title="\(attribute\)">HTML</span>

[link](https://example.com/\(path\))`.replaceAll("\\`", "`");
	const result = await latexProcessor.render(source);
	assert.doesNotMatch(result.code, /class="katex"/);
	assert.match(result.code, /<code>\\\(code\\\)<\/code>/);
	assert.ok(result.code.includes("\\(fenced\\)"));
	assert.ok(result.code.includes("\\(indented\\)"));
	assert.ok(result.code.includes('title="\\(attribute\\)"'));
});

test("unclosed inline math does not consume following lines", async () => {
	const result = await latexProcessor.render(String.raw`> \(unclosed
> ordinary text\)

Valid: \(n\)`);
	assert.equal((result.code.match(/class="katex"/g) || []).length, 1);
	assert.match(result.code, /ordinary text/);
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
		remarkPlugins: [remarkMath, remarkLatexInline],
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
