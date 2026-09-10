import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
	extractProblems,
	identifyProblem,
	problemHTML,
} from "./problem-search.mjs";

const source = {
	sourceTitle: "2026 ICPC Asia EC 网络赛 I",
	url: "/posts/contests/xcpc/online/",
	date: "2026-09-06T00:00:00.000Z",
	tags: ["icpc", "算法题解"],
	category: "Algorithm",
};
function fixture(body, metadata = source) {
	return `<html><body><div data-problem-search='${JSON.stringify(metadata)}'><div class="markdown-content">${body}</div></div></body></html>`;
}
const code = (url, extra = "") =>
	`<div class="expressive-code"><pre><code><div class="ec-line"><div class="gutter">1</div><span>// URL: ${url}</span></div><div class="ec-line"><span>#include &lt;bits/stdc++.h&gt;</span></div><div class="ec-line">${extra}</div></code></pre><button>Copy</button></div>`;
test("Recall, repeated code, keywords and exact rendered anchor", () => {
	const url = "https://qoj.ac/contest/4071/problem/20016";
	const result = extractProblems(
		fixture(
			`<h1 id="a---recall">A - Recall<a class="anchor" href="#a---recall"><span data-pagefind-ignore>#</span></a></h1><blockquote><p>关键词：模拟，贪心</p></blockquote><h2 id="思路">思路</h2><p>维护一个栈。</p>${code(url)}<h2>正解</h2>${code(url)}<h1 id="b">B. Second</h1><p>独立的动态规划描述。</p>`,
		),
	);
	assert.equal(result.records.length, 2);
	const first = result.records[0];
	assert.equal(first.problemId, "20016");
	assert.equal(first.url, `${source.url}#a---recall`);
	assert.match(first.keywords, /模拟，贪心/);
	assert.match(first.body, /栈/);
	assert.doesNotMatch(first.body, /动态规划|include|Copy/);
	assert.equal(result.records[1].problemId, undefined);
	assert.equal(result.diagnostics.length, 1);
	const html = problemHTML(first);
	assert.doesNotMatch(html, /qoj\.ac|include|<a\b/);
	assert.match(html, /QOJ20016/);
});
test("nested problem headings end at the next same or higher heading, with duplicate title IDs preserved", () => {
	const { records } = extractProblems(
		fixture(
			'<h1>比赛</h1><h2 id="a-first">A-First</h2><h3>思路</h3><p>apple</p><h2 id="a-first-1">A-First</h2><p>banana</p><h1>赛后总结</h1><p>not-a-problem</p>',
		),
	);
	assert.equal(records.length, 2);
	assert.match(records[0].url, /#a-first$/);
	assert.match(records[1].url, /#a-first-1$/);
	assert.doesNotMatch(records[0].body, /banana/);
	assert.doesNotMatch(records[1].body, /not-a-problem/);
});
test("conflicting IDs are reported without guessing; code URL overrides reference links", () => {
	const a = "https://www.luogu.com.cn/problem/T663578";
	const b = "https://www.luogu.com.cn/problem/P16428";
	const conflict = extractProblems(
		fixture(`<h1 id="a">A - 珊瑚海</h1>${code(a)}${code(b)}`),
	);
	assert.equal(conflict.records[0].problemId, undefined);
	assert.match(conflict.diagnostics[0], /conflicting/);
	const reference = extractProblems(
		fixture(`<h1 id="a">A - 珊瑚海</h1><a href="${b}">参考题</a>${code(a)}`),
	);
	assert.equal(reference.records[0].problemId, "T663578");
});
test("all supported platforms parse only trusted host/path combinations", () => {
	const cases = [
		["https://codeforces.com/contest/2181/problem/A", "2181A"],
		["https://codeforces.com/problemset/problem/2181/A", "2181A"],
		["https://atcoder.jp/contests/abc461/tasks/abc461_e", "ABC461_E"],
		["https://acm.nowcoder.com/acm/contest/12345/A", "12345A"],
		["https://ac.nowcoder.com/acm/contest/133790/A", "133790A"],
		["https://www.luogu.com.cn/problem/T663578?contestId=274106", "T663578"],
		["https://qoj.ac/problem/20016", "20016"],
		["https://www.acwing.com/problem/content/description/2/", "content/2"],
		["https://acm.hdu.edu.cn/showproblem.php?pid=1000", "1000"],
		["https://acm.hdu.edu.cn/contest/problem?cid=1229&pid=1001", "1229/1001"],
	];
	for (const [url, id] of cases)
		assert.equal(identifyProblem(url)?.problemId, id);
	assert.equal(identifyProblem("https://evil.test/problem/20016"), null);
	assert.equal(identifyProblem("javascript:alert(1)"), null);
});
test("private, unmarked and unrecognized content is excluded", () => {
	const body = '<h1 id="a">A - Secret</h1><p>PRIVATE_SECRET</p>';
	assert.equal(
		extractProblems(fixture(body, { ...source, draft: true })).records.length,
		0,
	);
	assert.equal(
		extractProblems(fixture(body, { ...source, encrypted: true })).records
			.length,
		0,
	);
	assert.equal(
		extractProblems(
			fixture(`${body}<div id="encrypted-container">SECRET</div>`),
		).records.length,
		0,
	);
	assert.equal(
		extractProblems(`<div class="markdown-content">${body}</div>`).records
			.length,
		0,
	);
	const unknown = extractProblems(
		fixture('<h2 id="notes">思路</h2><p>not a problem</p>'),
	);
	assert.equal(unknown.records.length, 0);
	assert.match(unknown.diagnostics[0], /no recognized/);
});
if (process.argv.includes("--built")) {
	test("real rendered contest posts: QOJ, AtCoder, Luogu and Nowcoder", () => {
		const root = existsSync("dist/client") ? "dist/client/posts" : "dist/posts";
		const records = readdirSync(root, { recursive: true })
			.filter((name) => name.endsWith(".html"))
			.flatMap(
				(name) =>
					extractProblems(readFileSync(join(root, name), "utf8")).records,
			);
		assert.ok(
			records.some(
				(record) =>
					record.title === "Recall" &&
					record.platform === "QOJ" &&
					record.problemId === "20016",
			),
		);
		assert.ok(records.some((record) => record.problemId === "ABC461_E"));
		assert.ok(records.some((record) => record.problemId === "T663578"));
		assert.ok(records.some((record) => record.platform === "牛客"));
		assert.ok(
			records.every(
				(record) =>
					!record.body.includes("#include") && record.url.includes("#"),
			),
		);
		console.log(`Verified ${records.length} real problem records`);
	});
}
