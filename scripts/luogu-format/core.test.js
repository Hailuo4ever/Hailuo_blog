import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
	analyzeContent,
	analyzeFile,
	applyFormattedFiles,
	ROOT_DIR,
} from "./core.js";

test("formats only inline and block formulas while keeping other content unchanged", () => {
	const source = [
		"---",
		"title: \u6d4b\u8bd5Post",
		"---",
		"",
		"#\u6807\u9898",
		"\u4e2d\u6587ABC\u548c\u6570\u5b57123,\u8fd9\u884c\u4e0d\u5e94\u88ab\u6539.",
		"\u516c\u5f0f$a<=b\uff0cc\u2265d$\u7ed3\u675f",
		"\u8bbf\u95ee https://example.com/a.b?x=1\u3002",
		"![](https://example.com/a.png)",
		"",
		"```cpp",
		"// \u4ee3\u7801\u5757\u91cc\u7684 x<=y\uff0cz\u2265w \u4e0d\u8981\u6539",
		"```",
		"",
		"$$ x<=y\uff0cz\u2260w $$",
		"",
	].join("\n");

	const result = analyzeContent(source, "sample.md");

	assert.equal(result.changed, true);
	assert.ok(result.fixedContent.includes("#\u6807\u9898"));
	assert.equal(result.fixedContent.includes("# \u6807\u9898"), false);
	assert.ok(
		result.fixedContent.includes(
			"\u4e2d\u6587ABC\u548c\u6570\u5b57123,\u8fd9\u884c\u4e0d\u5e94\u88ab\u6539.",
		),
	);
	assert.ok(
		result.fixedContent.includes(
			"\u516c\u5f0f$a \\le b, c \\ge d$\u7ed3\u675f",
		),
	);
	assert.ok(
		result.fixedContent.includes(
			"\u8bbf\u95ee https://example.com/a.b?x=1\u3002",
		),
	);
	assert.ok(
		result.fixedContent.includes(
			"// \u4ee3\u7801\u5757\u91cc\u7684 x<=y\uff0cz\u2265w \u4e0d\u8981\u6539",
		),
	);
	assert.ok(result.fixedContent.includes("$$x \\le y, z \\ne w$$"));
	assert.ok(result.issues.some((issue) => issue.ruleId === "LG001"));
	assert.ok(result.issues.some((issue) => issue.ruleId === "LG003"));
	assert.ok(result.issues.some((issue) => issue.ruleId === "LG007"));
	assert.equal(
		result.issues.some(
			(issue) => issue.ruleId === "LG007" && issue.severity === "fix",
		),
		true,
	);
	assert.equal(
		result.issues.some((issue) => issue.ruleId === "LG104"),
		false,
	);
});

test("reports non-formula structural issues without changing content", () => {
	const source = [
		"---",
		"title: Plain",
		"---",
		"",
		"##### Deep",
		"Only prose.",
		"",
	].join("\n");

	const result = analyzeContent(source, "plain.md");

	assert.equal(result.changed, false);
	assert.ok(result.issues.some((issue) => issue.ruleId === "LG101"));
	assert.ok(result.issues.some((issue) => issue.ruleId === "LG104"));
});

test("applies formula-only formatted content only when the saved hash matches", () => {
	const testFile = path.join(
		ROOT_DIR,
		"src",
		"content",
		"posts",
		"__luogu_format_test__.md",
	);
	const relativeFile = "src/content/posts/__luogu_format_test__.md";
	const source = [
		"---",
		"title: Hash Test",
		"---",
		"",
		"\u516c\u5f0f$a<=b$",
		"",
		"```cpp",
		"int main() {}",
		"```",
		"",
	].join("\n");

	fs.writeFileSync(testFile, source, "utf8");

	try {
		const before = analyzeFile(relativeFile);
		assert.equal(before.changed, true);

		const [applied] = applyFormattedFiles([
			{ file: relativeFile, hash: before.hash },
		]);
		assert.equal(applied.changed, true);
		assert.equal(fs.readFileSync(testFile, "utf8"), before.fixedContent);

		const after = analyzeFile(relativeFile);
		assert.equal(after.changed, false);

		assert.throws(
			() => applyFormattedFiles([{ file: relativeFile, hash: "stale" }]),
			/STale|changed since the last check/i,
		);
	} finally {
		if (fs.existsSync(testFile)) {
			fs.unlinkSync(testFile);
		}
	}
});
