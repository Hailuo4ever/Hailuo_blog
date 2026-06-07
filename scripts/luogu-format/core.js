import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT_DIR = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
	"..",
);
export const POSTS_DIR = path.join(ROOT_DIR, "src", "content", "posts");

const markdownExtensions = new Set([".md", ".mdx"]);
const cjkRanges = "\\u3400-\\u9fff\\uf900-\\ufaff";
const cjkMatcher = new RegExp(`[${cjkRanges}]`, "u");
const puaStart = 0xe000;
const puaEnd = 0xf8ff;
const trailingUrlPunctuation = "，。！？；：、,.!?;:)）】」』》";

const fixSeverity = "fix";
const warningSeverity = "warning";

export const ruleDefinitions = {
	LG001: "Heading markers should be followed by one space.",
	LG002: "Markdown list markers should be followed by one space.",
	LG003: "Chinese text should use full-width punctuation.",
	LG004: "Chinese, English, numbers, inline code, and formulas need spacing.",
	LG005: "Chinese punctuation should not have surrounding spaces.",
	LG006: "Bare links should use Markdown link syntax.",
	LG007: "Formula notation can be normalized safely.",
	LG101: "Luogu solution headings should use # through ####.",
	LG102:
		"Images should use stable Luogu-hosted URLs when submitted as solutions.",
	LG103: "Images should not be wrapped in links.",
	LG104: "Most Luogu solutions should include a fenced code block.",
};

export function toPosixPath(value) {
	return value.split(path.sep).join("/");
}

export function sha256(value) {
	return crypto.createHash("sha256").update(value).digest("hex");
}

export function normalizeTargetPath(targetPath) {
	const absolutePath = path.resolve(ROOT_DIR, targetPath);
	const postsRoot = path.resolve(POSTS_DIR);
	const root = path.resolve(ROOT_DIR);

	if (
		absolutePath !== postsRoot &&
		!absolutePath.startsWith(`${postsRoot}${path.sep}`)
	) {
		throw new Error(
			`Refusing to format outside src/content/posts: ${toPosixPath(path.relative(root, absolutePath))}`,
		);
	}

	if (!markdownExtensions.has(path.extname(absolutePath).toLowerCase())) {
		throw new Error(`Unsupported file type: ${absolutePath}`);
	}

	if (!fs.existsSync(absolutePath)) {
		throw new Error(`File does not exist: ${absolutePath}`);
	}

	return {
		absolutePath,
		relativePath: toPosixPath(path.relative(root, absolutePath)),
	};
}

export function listMarkdownFiles(dir = POSTS_DIR) {
	if (!fs.existsSync(dir)) return [];

	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const files = entries.flatMap((entry) => {
		const entryPath = path.join(dir, entry.name);
		return entry.isDirectory() ? listMarkdownFiles(entryPath) : [entryPath];
	});

	return files
		.filter((file) => markdownExtensions.has(path.extname(file).toLowerCase()))
		.map((file) => {
			const content = fs.readFileSync(file, "utf8");
			return {
				path: toPosixPath(path.relative(ROOT_DIR, file)),
				title: readFrontmatterTitle(content) ?? path.basename(file),
			};
		})
		.sort((a, b) => a.path.localeCompare(b.path));
}

export function analyzeFile(targetPath) {
	const { absolutePath, relativePath } = normalizeTargetPath(targetPath);
	const originalContent = fs.readFileSync(absolutePath, "utf8");
	const result = analyzeContent(originalContent, relativePath);

	return {
		...result,
		absolutePath,
		file: relativePath,
	};
}

export function analyzeFiles(targetPaths) {
	return targetPaths.map((targetPath) => analyzeFile(targetPath));
}

export function applyFormattedFiles(fileRequests) {
	return fileRequests.map((request) => {
		const file = typeof request === "string" ? request : request.file;
		const expectedHash = typeof request === "string" ? undefined : request.hash;
		const result = analyzeFile(file);

		if (expectedHash && expectedHash !== result.hash) {
			const error = new Error(
				`${result.file} changed since the last check. Re-run the checker before applying fixes.`,
			);
			error.code = "STALE_FORMAT_HASH";
			throw error;
		}

		if (result.changed) {
			fs.writeFileSync(result.absolutePath, result.fixedContent, "utf8");
		}

		return toPublicResult(result);
	});
}

export function analyzeContent(originalContent, file = "stdin.md") {
	const eol = originalContent.includes("\r\n") ? "\r\n" : "\n";
	const normalizedContent = originalContent.replace(/\r\n/g, "\n");
	const lines = normalizedContent.split("\n");
	const issues = [];
	const state = {
		frontmatter: lines[0]?.trim() === "---",
		frontmatterDone: lines[0]?.trim() !== "---",
		fenceMarker: "",
		mathBlock: false,
		hasFencedCode: false,
	};

	const fixedLines = lines.map((line, index) => {
		const lineNumber = index + 1;
		const lineMode = classifyLine(line, state);

		if (lineMode === "protected") return line;
		if (lineMode === "math")
			return formatMathLine(line, lineNumber, file, issues);

		return formatNormalLine(line, lineNumber, file, issues);
	});

	if (!state.hasFencedCode) {
		issues.push(createIssue(file, 1, "LG104", warningSeverity));
	}

	const fixedNormalizedContent = fixedLines.join("\n");
	const fixedContent =
		eol === "\r\n"
			? fixedNormalizedContent.replace(/\n/g, "\r\n")
			: fixedNormalizedContent;

	return {
		file,
		hash: sha256(originalContent),
		changed: fixedContent !== originalContent,
		issues,
		fixedContent,
		diff: createUnifiedDiff(originalContent, fixedContent, file),
	};
}

export function toPublicResult(result) {
	const fixCount = result.issues.filter(
		(issue) => issue.severity === fixSeverity,
	).length;
	const warningCount = result.issues.filter(
		(issue) => issue.severity === warningSeverity,
	).length;

	return {
		file: result.file,
		hash: result.hash,
		changed: result.changed,
		diff: result.diff,
		issues: result.issues,
		fixCount,
		warningCount,
	};
}

export function createUnifiedDiff(originalContent, fixedContent, file) {
	if (originalContent === fixedContent) return "";

	const oldLines = splitDiffLines(originalContent);
	const newLines = splitDiffLines(fixedContent);

	if (oldLines.length !== newLines.length) {
		return createFullFileDiff(oldLines, newLines, file);
	}

	const changedIndexes = oldLines
		.map((line, index) => (line === newLines[index] ? -1 : index))
		.filter((index) => index !== -1);

	if (changedIndexes.length === 0) return "";

	const context = 3;
	const hunks = [];
	let cursor = 0;

	while (cursor < changedIndexes.length) {
		const firstChanged = changedIndexes[cursor];
		let lastChanged = firstChanged;
		cursor += 1;

		while (
			cursor < changedIndexes.length &&
			changedIndexes[cursor] - lastChanged <= context * 2 + 1
		) {
			lastChanged = changedIndexes[cursor];
			cursor += 1;
		}

		const start = Math.max(0, firstChanged - context);
		const end = Math.min(oldLines.length - 1, lastChanged + context);
		const count = end - start + 1;
		const hunkLines = [`@@ -${start + 1},${count} +${start + 1},${count} @@`];

		for (let index = start; index <= end; index += 1) {
			if (oldLines[index] === newLines[index]) {
				hunkLines.push(` ${oldLines[index] ?? ""}`);
			} else {
				hunkLines.push(`-${oldLines[index] ?? ""}`);
				hunkLines.push(`+${newLines[index] ?? ""}`);
			}
		}

		hunks.push(hunkLines.join("\n"));
	}

	return [`--- a/${file}`, `+++ b/${file}`, ...hunks].join("\n");
}

function createFullFileDiff(oldLines, newLines, file) {
	return [
		`--- a/${file}`,
		`+++ b/${file}`,
		`@@ -1,${oldLines.length} +1,${newLines.length} @@`,
		...oldLines.map((line) => `-${line}`),
		...newLines.map((line) => `+${line}`),
	].join("\n");
}

function splitDiffLines(content) {
	const normalized = content.replace(/\r\n/g, "\n");
	if (normalized.length === 0) return [];
	return normalized.endsWith("\n")
		? normalized.slice(0, -1).split("\n")
		: normalized.split("\n");
}

function readFrontmatterTitle(content) {
	const frontmatter = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
	if (!frontmatter) return null;

	const title = frontmatter[1].match(
		/^title\s*:\s*(?:"([^"]*)"|'([^']*)'|(.+))$/im,
	);
	return (title?.[1] ?? title?.[2] ?? title?.[3] ?? "").trim() || null;
}

function classifyLine(line, state) {
	if (state.frontmatter) {
		if (state.frontmatterDone) return false;

		if (line.trim() === "---" && state.frontmatterStarted) {
			state.frontmatter = false;
			state.frontmatterDone = true;
		}

		state.frontmatterStarted = true;
		return "protected";
	}

	if (state.fenceMarker) {
		if (line.trimStart().startsWith(state.fenceMarker)) {
			state.fenceMarker = "";
		}
		return "protected";
	}

	const fence = line.match(/^\s*(`{3,}|~{3,})/);
	if (fence) {
		state.fenceMarker = fence[1][0].repeat(fence[1].length);
		state.hasFencedCode = true;
		return "protected";
	}

	if (state.mathBlock) {
		if (line.includes("$$")) state.mathBlock = false;
		return "math";
	}

	if (/^\s*\$\$/.test(line)) {
		const afterOpening = line.replace(/^\s*\$\$/, "");
		if (!afterOpening.includes("$$")) {
			state.mathBlock = true;
		}
		return "math";
	}

	return "normal";
}

function formatNormalLine(line, lineNumber, file, issues) {
	let current = line;

	reportWholeLineRule(
		current,
		(next) => next.replace(/^(\s{0,3})(#{1,6})([^#\s].*)$/, "$1$2 $3"),
		file,
		lineNumber,
		"LG001",
		issues,
	);

	reportWholeLineRule(
		current,
		(next) => next.replace(/^(\s{0,3})([-+*])(?=\S)/, "$1$2 "),
		file,
		lineNumber,
		"LG002",
		issues,
	);

	reportWholeLineRule(
		current,
		(next) => next.replace(/^(\s{0,3})(\d+)\.(?=\S)/, "$1$2. "),
		file,
		lineNumber,
		"LG002",
		issues,
	);

	addLineWarnings(current, lineNumber, file, issues);

	const { masked, tokens } = maskInline(current);

	reportMaskedRule(
		masked,
		(next) => normalizeEnglishPunctuation(next, tokens),
		file,
		lineNumber,
		"LG003",
		issues,
	);

	reportMaskedRule(
		masked,
		(next) => normalizeCjkSpacing(next, tokens),
		file,
		lineNumber,
		"LG004",
		issues,
	);

	reportMaskedRule(
		masked,
		(next) => normalizeChinesePunctuationSpacing(next, tokens),
		file,
		lineNumber,
		"LG005",
		issues,
	);

	current = formatInlineMathTokens(masked, tokens, file, lineNumber, issues);

	reportWholeLineRule(current, wrapBareUrls, file, lineNumber, "LG006", issues);

	return current;
}

function formatMathLine(line, lineNumber, file, issues) {
	const next = formatBlockMathLine(line);
	if (next !== line) {
		issues.push(createIssue(file, lineNumber, "LG007", fixSeverity));
	}
	return next;
}

function reportWholeLineRule(line, fixer, file, lineNumber, ruleId, issues) {
	const next = fixer(line);
	if (next !== line) {
		issues.push(createIssue(file, lineNumber, ruleId, warningSeverity));
	}
}

function reportMaskedRule(masked, fixer, file, lineNumber, ruleId, issues) {
	const next = fixer(masked);
	if (next !== masked) {
		issues.push(createIssue(file, lineNumber, ruleId, warningSeverity));
	}
}

function addLineWarnings(line, lineNumber, file, issues) {
	const heading = line.match(/^\s{0,3}(#{5,6})\s+/);
	if (heading) {
		issues.push(createIssue(file, lineNumber, "LG101", warningSeverity));
	}

	if (/\[!\[[^\]]*]\([^)]+]\]\([^)]+\)/.test(line)) {
		issues.push(createIssue(file, lineNumber, "LG103", warningSeverity));
	}

	for (const match of line.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)) {
		const imageUrl = match[1].trim();
		const isLuoguHost =
			imageUrl.startsWith("https://cdn.luogu.com.cn/") ||
			imageUrl.startsWith("https://img.luogu.com.cn/") ||
			imageUrl.startsWith("https://ipic.luogu.com.cn/");

		if (!isLuoguHost) {
			issues.push(createIssue(file, lineNumber, "LG102", warningSeverity));
		}
	}
}

function createIssue(file, line, ruleId, severity) {
	return {
		file,
		line,
		column: 1,
		ruleId,
		severity,
		message: ruleDefinitions[ruleId],
	};
}

function maskInline(line) {
	const tokens = [];
	let masked = "";
	let index = 0;

	while (index < line.length) {
		const urlToken = readUrlToken(line, index);
		if (urlToken) {
			masked += addToken(tokens, "url", urlToken.value);
			index = urlToken.end;
			continue;
		}

		const codeToken = readInlineCodeToken(line, index);
		if (codeToken) {
			masked += addToken(tokens, "code", codeToken.value);
			index = codeToken.end;
			continue;
		}

		const mathToken = readInlineMathToken(line, index);
		if (mathToken) {
			masked += addToken(tokens, "math", mathToken.value);
			index = mathToken.end;
			continue;
		}

		masked += line[index];
		index += 1;
	}

	return { masked, tokens };
}

function restoreInline(masked, tokens) {
	return tokens.reduce(
		(output, token, index) => output.replaceAll(tokenChar(index), token.value),
		masked,
	);
}

function formatInlineMathTokens(masked, tokens, file, lineNumber, issues) {
	let changed = false;

	for (const token of tokens) {
		if (token.type !== "math") continue;

		const next = formatInlineMathToken(token.value);
		if (next !== token.value) {
			token.value = next;
			changed = true;
		}
	}

	if (changed) {
		issues.push(createIssue(file, lineNumber, "LG007", fixSeverity));
	}

	return restoreInline(masked, tokens);
}

function formatInlineMathToken(value) {
	if (!value.startsWith("$") || !value.endsWith("$") || value.length < 2) {
		return value;
	}

	return `$${formatMathExpression(value.slice(1, -1), { trim: true })}$`;
}

function formatBlockMathLine(line) {
	const opening = line.match(/^(\s*\$\$)([\s\S]*)$/);
	if (opening) {
		const prefix = opening[1];
		const rest = opening[2];
		const closingIndex = rest.indexOf("$$");

		if (closingIndex !== -1) {
			const inner = rest.slice(0, closingIndex);
			const suffix = rest.slice(closingIndex);
			return `${prefix}${formatMathExpression(inner, { trim: true })}${suffix}`;
		}

		return `${prefix}${formatMathExpression(rest, { trimStart: true })}`;
	}

	const closingIndex = line.indexOf("$$");
	if (closingIndex !== -1) {
		const inner = line.slice(0, closingIndex);
		const suffix = line.slice(closingIndex);
		return `${formatMathExpression(inner, { trimEnd: true })}${suffix}`;
	}

	return formatMathExpression(line);
}

function formatMathExpression(expression, options = {}) {
	const trim = options.trim ?? false;
	const trimStart = options.trimStart ?? false;
	const trimEnd = options.trimEnd ?? false;
	let leading = "";
	let trailing = "";
	let body = expression;

	if (trim) {
		body = body.trim();
	} else {
		if (!trimStart) {
			leading = body.match(/^\s*/u)?.[0] ?? "";
			body = body.slice(leading.length);
		} else {
			body = body.trimStart();
		}

		if (!trimEnd) {
			trailing = body.match(/\s*$/u)?.[0] ?? "";
			body = body.slice(0, body.length - trailing.length);
		} else {
			body = body.trimEnd();
		}
	}

	const protectedText = maskLatexTextCommands(body);
	let next = protectedText.masked;

	next = next
		.replace(/\u2264/g, " \\le ")
		.replace(/\u2265/g, " \\ge ")
		.replace(/\u2260/g, " \\ne ")
		.replace(/\u00d7/g, " \\times ")
		.replace(/\u00f7/g, " \\div ")
		.replace(/\u2192/g, " \\to ")
		.replace(/\u221e/g, "\\infty")
		.replace(/\u2026/g, "\\cdots")
		.replace(/\uff0c/g, ",")
		.replace(/\u3001/g, ",")
		.replace(/\uff1b/g, ";")
		.replace(/\uff1a/g, ":")
		.replace(/\uff08/g, "(")
		.replace(/\uff09/g, ")")
		.replace(/\u3002/g, ".")
		.replace(/\uff01/g, "!")
		.replace(/\uff1f/g, "?")
		.replace(/<=/g, " \\le ")
		.replace(/>=/g, " \\ge ")
		.replace(/!=/g, " \\ne ");

	const latexRelation = String.raw`\\(?:le|ge|ne|times|div|to)\b`;
	next = next
		.replace(new RegExp(`\\s*(${latexRelation}|[=<>])\\s*`, "g"), " $1 ")
		.replace(/[ \t]+([,;:])/g, "$1")
		.replace(/([,;:])(?=\S)/g, "$1 ")
		.replace(/[ \t]{2,}/g, " ")
		.trim();

	return `${leading}${restoreInline(next, protectedText.tokens)}${trailing}`;
}

function maskLatexTextCommands(value) {
	const tokens = [];
	const masked = value.replace(
		/\\(?:text|textrm|textbf|textit|mathrm|operatorname)\s*\{(?:[^{}]|\{[^{}]*\})*\}/g,
		(match) => addToken(tokens, "latexText", match),
	);

	return { masked, tokens };
}

function addToken(tokens, type, value) {
	if (tokens.length > puaEnd - puaStart) {
		throw new Error("Too many protected inline spans in one line.");
	}

	const valueChar = tokenChar(tokens.length);
	tokens.push({ type, value });
	return valueChar;
}

function tokenChar(index) {
	return String.fromCharCode(puaStart + index);
}

function readInlineCodeToken(line, index) {
	if (line[index] !== "`") return null;

	const run = line.slice(index).match(/^`+/)?.[0];
	if (!run) return null;

	const closingIndex = line.indexOf(run, index + run.length);
	if (closingIndex === -1) return null;

	return {
		value: line.slice(index, closingIndex + run.length),
		end: closingIndex + run.length,
	};
}

function readInlineMathToken(line, index) {
	if (
		line[index] !== "$" ||
		line[index + 1] === "$" ||
		isEscaped(line, index)
	) {
		return null;
	}

	for (let cursor = index + 1; cursor < line.length; cursor += 1) {
		if (
			line[cursor] === "$" &&
			line[cursor + 1] !== "$" &&
			!isEscaped(line, cursor)
		) {
			return {
				value: line.slice(index, cursor + 1),
				end: cursor + 1,
			};
		}
	}

	return null;
}

function readUrlToken(line, index) {
	const startsWithUrl =
		line.startsWith("https://", index) || line.startsWith("http://", index);
	if (!startsWithUrl) return null;

	let end = index;
	while (end < line.length && !/[\s<>"'[\]{}]/u.test(line[end])) {
		end += 1;
	}

	while (end > index && trailingUrlPunctuation.includes(line[end - 1])) {
		end -= 1;
	}

	if (end === index) return null;

	return {
		value: line.slice(index, end),
		end,
	};
}

function isEscaped(line, index) {
	let backslashes = 0;
	for (
		let cursor = index - 1;
		cursor >= 0 && line[cursor] === "\\";
		cursor -= 1
	) {
		backslashes += 1;
	}
	return backslashes % 2 === 1;
}

function normalizeEnglishPunctuation(value, tokens) {
	const tokenChars = tokenClass(tokens, ["math", "code"]);
	const cjkOrToken = `${cjkRanges}${tokenChars}`;
	const cjkTokenOrAscii = `${cjkOrToken}A-Za-z0-9`;
	let next = value
		.replace(
			new RegExp(`([${cjkTokenOrAscii}])\\s*,\\s*(?=[${cjkOrToken}])`, "gu"),
			"$1，",
		)
		.replace(
			new RegExp(`([${cjkOrToken}])\\s*,\\s*(?=[A-Za-z0-9])`, "gu"),
			"$1，",
		)
		.replace(
			new RegExp(`([${cjkTokenOrAscii}])\\s*;\\s*(?=[${cjkOrToken}])`, "gu"),
			"$1；",
		)
		.replace(
			new RegExp(`([${cjkOrToken}])\\s*;\\s*(?=[A-Za-z0-9])`, "gu"),
			"$1；",
		)
		.replace(
			new RegExp(`([${cjkTokenOrAscii}])\\s*:\\s*(?=[${cjkOrToken}])`, "gu"),
			"$1：",
		)
		.replace(
			new RegExp(`([${cjkOrToken}])\\s*:\\s*(?=[A-Za-z0-9])`, "gu"),
			"$1：",
		)
		.replace(
			new RegExp(
				`([${cjkTokenOrAscii}])\\s*\\?+\\s*(?=[${cjkOrToken}]|$)`,
				"gu",
			),
			"$1？",
		)
		.replace(
			new RegExp(`([${cjkOrToken}])\\s*\\?+\\s*(?=[A-Za-z0-9])`, "gu"),
			"$1？",
		)
		.replace(
			new RegExp(`([${cjkTokenOrAscii}])\\s*!+\\s*(?=[${cjkOrToken}]|$)`, "gu"),
			"$1！",
		)
		.replace(
			new RegExp(`([${cjkOrToken}])\\s*!+\\s*(?=[A-Za-z0-9])`, "gu"),
			"$1！",
		)
		.replace(
			new RegExp(`([${cjkTokenOrAscii}])\\s*\\.\\s*(?=[${cjkOrToken}])`, "gu"),
			"$1。",
		)
		.replace(new RegExp(`([${cjkOrToken}])\\s*\\.\\s*(?=$)`, "gu"), "$1。");

	if (new RegExp(`[${cjkOrToken}]`, "u").test(value)) {
		next = next.replace(/([A-Za-z0-9])\s*\.\s*$/u, "$1。");
	}

	return next;
}

function normalizeCjkSpacing(value, tokens) {
	const spacingTokenChars = tokenClass(tokens, ["math", "code"]);
	let next = value
		.replace(new RegExp(`([${cjkRanges}])([A-Za-z0-9])`, "gu"), "$1 $2")
		.replace(new RegExp(`([A-Za-z0-9])([${cjkRanges}])`, "gu"), "$1 $2");

	if (spacingTokenChars) {
		next = next
			.replace(
				new RegExp(`([${cjkRanges}])([${spacingTokenChars}])`, "gu"),
				"$1 $2",
			)
			.replace(
				new RegExp(`([${spacingTokenChars}])([${cjkRanges}])`, "gu"),
				"$1 $2",
			);
	}

	return next;
}

function normalizeChinesePunctuationSpacing(value, tokens) {
	const tokenChars = tokenClass(tokens, ["math", "code"]);
	const closingPunctuation = "，。！？；：、）】」』》";
	const openingPunctuation = "（【「『《";
	const allPunctuation = `${closingPunctuation}${openingPunctuation}`;
	const nextChars = `A-Za-z0-9${cjkRanges}${tokenChars}`;
	const previousChars = `A-Za-z0-9${cjkRanges}${tokenChars}`;

	return value
		.replace(new RegExp(`[ \\t]+([${closingPunctuation}])`, "gu"), "$1")
		.replace(new RegExp(`([${openingPunctuation}])[ \\t]+`, "gu"), "$1")
		.replace(
			new RegExp(`([${allPunctuation}])[ \\t]+(?=[${nextChars}])`, "gu"),
			"$1",
		)
		.replace(
			new RegExp(`([${previousChars}])[ \\t]+([${allPunctuation}])`, "gu"),
			"$1$2",
		);
}

function tokenClass(tokens, types) {
	return tokens
		.map((token, index) =>
			types.includes(token.type) ? escapeClassChar(tokenChar(index)) : "",
		)
		.join("");
}

function escapeClassChar(value) {
	return value.replace(/[\\\]^]/g, "\\$&");
}

function wrapBareUrls(line) {
	return line.replace(
		/https?:\/\/[^\s<>"'[\]{}]+/g,
		(rawUrl, offset, source) => {
			let url = rawUrl;
			let trailing = "";

			while (url.length > 0 && trailingUrlPunctuation.includes(url.at(-1))) {
				trailing = `${url.at(-1)}${trailing}`;
				url = url.slice(0, -1);
			}

			if (!url || shouldSkipBareUrl(source, offset, rawUrl.length)) {
				return rawUrl;
			}

			return `[${url}](${url})${trailing}`;
		},
	);
}

function shouldSkipBareUrl(line, offset, rawLength) {
	const before = line.slice(0, offset);
	const after = line.slice(offset + rawLength);

	if (before.endsWith("<") && after.startsWith(">")) return true;
	if (/\[[^\]]*]\($/.test(before) || /!\[[^\]]*]\($/.test(before)) return true;
	if (/[A-Za-z-]+=$/.test(before) || /[A-Za-z-]+="$/.test(before)) return true;

	const openBracket = before.lastIndexOf("[");
	const closeBracket = before.lastIndexOf("]");
	if (openBracket > closeBracket && after.startsWith("](")) return true;

	return false;
}

export function hasCjk(value) {
	return cjkMatcher.test(value);
}
