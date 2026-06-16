import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

const config = read("src/config.ts");
const types = read("src/types/config.ts");
const component = read("src/components/comments/GiscusComments.astro");
const layout = read("src/layouts/Layout.astro");

assert.match(
	types,
	/theme:\s*string;/,
	"CommentConfig should expose the light giscus theme",
);
assert.match(
	types,
	/darkTheme:\s*string;/,
	"CommentConfig should expose the dark giscus theme",
);

assert.match(
	config,
	/theme:\s*"light"/,
	"commentsConfig should set the default light giscus theme",
);
assert.match(
	config,
	/darkTheme:\s*"transparent_dark"/,
	"commentsConfig should set a dark giscus theme",
);

assert.match(
	component,
	/data-theme=\{commentsConfig\.theme\}/,
	"GiscusComments should pass the light theme to the runtime container",
);
assert.match(
	component,
	/data-dark-theme=\{commentsConfig\.darkTheme\}/,
	"GiscusComments should pass the dark theme to the runtime container",
);

assert.match(
	layout,
	/container\?\.dataset\.darkTheme/,
	"Layout runtime should read the dark giscus theme from the container",
);
assert.match(
	layout,
	/container\?\.dataset\.theme/,
	"Layout runtime should read the light giscus theme from the container",
);
assert.match(
	layout,
	/script\.setAttribute\('data-theme', getGiscusTheme\(container\)\)/,
	"Initial giscus script theme should be resolved from the current container",
);
assert.match(
	layout,
	/frame\.closest(?:<HTMLElement>)?\(GISCUS_CONTAINER_SELECTOR\)/,
	"Runtime theme updates should resolve the iframe's owning giscus container",
);

console.log("giscus theme config checks passed");
