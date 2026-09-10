import { fromHtml } from "hast-util-from-html";

export const articleGlob = "posts/**/*.html";
export const indexOptions = {
	forceLanguage: "zh-cn",
	excludeSelectors: [
		"span.katex",
		"span.katex-display",
		"[data-pagefind-ignore]",
		".search-panel",
		"#search-panel",
	],
};

const escapeHTML = (value) =>
	String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
const classes = (node) => node.properties?.className || [];
const text = (node) => {
	if (
		node.properties?.ariaHidden === "true" ||
		node.properties?.dataPagefindIgnore !== undefined ||
		classes(node).some((name) => ["gutter", "anchor"].includes(name))
	)
		return "";
	return node.type === "text"
		? node.value
		: (node.children || []).map(text).join("");
};
function find(node, predicate) {
	if (predicate(node)) return node;
	for (const child of node.children || []) {
		const result = find(child, predicate);
		if (result) return result;
	}
}

/** Only parse known URL shapes. Never request an external site or infer a numeric ID. */
export function identifyProblem(raw) {
	let url;
	try {
		url = new URL(raw);
	} catch {
		return null;
	}
	if (!["https:", "http:"].includes(url.protocol)) return null;
	const host = url.hostname.toLowerCase().replace(/^www\./, "");
	const path = url.pathname;
	const cf =
		path.match(/^\/(?:contest|gym)\/(\d+)\/problem\/([A-Z]\d?)\/?$/i) ||
		path.match(/^\/problemset\/problem\/(\d+)\/([A-Z]\d?)\/?$/i);
	if (host === "codeforces.com" && cf)
		return {
			platform: "Codeforces",
			problemId: `${cf[1]}${cf[2].toUpperCase()}`,
			aliases: `CF${cf[1]}${cf[2]} CF ${cf[1]} ${cf[2]}`,
		};
	const at = path.match(/^\/contests\/([^/]+)\/tasks\/([^/]+)\/?$/);
	if (host === "atcoder.jp" && at) {
		const id = at[2].toUpperCase();
		return {
			platform: "AtCoder",
			problemId: id,
			aliases: `${id.replaceAll("_", " ")} ${id.replaceAll("_", "")}`,
		};
	}
	const nc = path.match(
		/^\/acm\/(?:contest\/(\d+)\/([A-Z]\d?)|problem\/(\d+))\/?$/i,
	);
	if (["ac.nowcoder.com", "acm.nowcoder.com"].includes(host) && nc)
		return {
			platform: "牛客",
			problemId: nc[3] || `${nc[1]}${nc[2].toUpperCase()}`,
			aliases: `Nowcoder ${nc[3] || `${nc[1]} ${nc[2]}`}`,
		};
	const lg = path.match(/^\/problem\/([A-Z]+\d+)\/?$/i);
	if (host === "luogu.com.cn" && lg)
		return {
			platform: "洛谷",
			problemId: lg[1].toUpperCase(),
			aliases: `Luogu ${lg[1]}`,
		};
	const qoj = path.match(/^\/(?:contest\/\d+\/)?problem\/(\d+)\/?$/);
	if (host === "qoj.ac" && qoj)
		return { platform: "QOJ", problemId: qoj[1], aliases: `QOJ${qoj[1]}` };
	const ac = path.match(/^\/problem\/content\/(?:description\/)?(\d+)\/?$/);
	if (host === "acwing.com" && ac)
		return {
			platform: "AcWing",
			problemId: `content/${ac[1]}`,
			aliases: `AcWing content ${ac[1]}`,
		};
	if (
		["acm.hdu.edu.cn", "hdu.acm.edu.cn"].includes(host) &&
		path === "/contest/problem" &&
		/^\d+$/.test(url.searchParams.get("cid") || "") &&
		/^\d+$/.test(url.searchParams.get("pid") || "")
	)
		return {
			platform: "HDU",
			problemId: `${url.searchParams.get("cid")}/${url.searchParams.get("pid")}`,
			aliases: `HDU ${url.searchParams.get("cid")} ${url.searchParams.get("pid")}`,
		};
	if (
		["acm.hdu.edu.cn", "hdu.acm.edu.cn"].includes(host) &&
		path === "/showproblem.php" &&
		/^\d+$/.test(url.searchParams.get("pid") || "")
	)
		return {
			platform: "HDU",
			problemId: url.searchParams.get("pid"),
			aliases: `HDU${url.searchParams.get("pid")}`,
		};
	return null;
}
/** Traverse rendered markup in document order, treating headings and code as atomic events. */
function* events(node) {
	if (node.type === "element") {
		if (
			node.properties?.dataPagefindIgnore !== undefined ||
			node.properties?.id === "encrypted-container" ||
			["script", "style", "button", "svg", "annotation"].includes(
				node.tagName,
			) ||
			classes(node).some((name) =>
				["katex", "katex-display", "anchor"].includes(name),
			)
		)
			return;
		if (/^h[1-6]$/.test(node.tagName)) {
			yield {
				kind: "heading",
				level: Number(node.tagName[1]),
				title: text(node).trim(),
				anchor: node.properties.id,
			};
			return;
		}
		if (node.tagName === "pre") {
			// Expressive Code wraps each line; restore newlines before parsing comments.
			const lines = [];
			function collect(child) {
				if (classes(child).includes("ec-line")) lines.push(text(child));
				else for (const nested of child.children || []) collect(nested);
			}
			collect(node);
			yield {
				kind: "code",
				value: lines.length ? lines.join("\n") : text(node),
			};
			return;
		}
		if (node.tagName === "a" && node.properties.href)
			yield { kind: "link", value: node.properties.href };
		if (classes(node).includes("expressive-code")) {
			const pre = find(node, (child) => child.tagName === "pre");
			if (pre) yield* events(pre);
			return;
		}
	}
	if (node.type === "text") yield { kind: "text", value: node.value };
	for (const child of node.children || []) yield* events(child);
	if (
		node.type === "element" &&
		["p", "li", "div", "blockquote", "br"].includes(node.tagName)
	)
		yield { kind: "text", value: "\n" };
}

export function extractProblems(html) {
	const tree = fromHtml(html);
	const container = find(
		tree,
		(node) => node.properties?.dataProblemSearch !== undefined,
	);
	if (
		!container ||
		find(container, (node) => node.properties?.id === "encrypted-container")
	)
		return { records: [], diagnostics: [] };
	const source = JSON.parse(String(container.properties.dataProblemSearch));
	if (source.draft || source.encrypted) return { records: [], diagnostics: [] };
	const markdown = find(container, (node) =>
		classes(node).includes("markdown-content"),
	);
	if (!markdown)
		return {
			records: [],
			diagnostics: [`${source.url}: missing article body`],
		};
	const records = [];
	const diagnostics = [];
	let current;
	const finish = () => {
		if (!current) return;
		const candidates = new Map();
		for (const raw of [...current.commentUrls, ...current.links]) {
			const identity = identifyProblem(raw);
			if (identity)
				candidates.set(`${identity.platform}:${identity.problemId}`, identity);
		}
		let identity = {};
		// A code header identifies the solved problem; prose links may reference other problems.
		const primary = new Map(
			current.commentUrls
				.map(identifyProblem)
				.filter(Boolean)
				.map((item) => [`${item.platform}:${item.problemId}`, item]),
		);
		const chosen = primary.size ? primary : candidates;
		if (chosen.size === 1) identity = [...chosen.values()][0];
		else
			diagnostics.push(
				`${source.url}#${current.anchor}: ${chosen.size ? "conflicting problem IDs" : "no platform problem ID"}`,
			);
		const body = current.body
			.join("")
			.replace(/[ \t]+/g, " ")
			.replace(/\n\s*\n/g, "\n")
			.trim();
		const keywords = [...body.matchAll(/关键词\s*[:：]\s*([^\n]+)/g)]
			.map((match) => match[1])
			.join(" ");
		records.push({
			...source,
			...identity,
			code: current.code,
			title: current.title,
			url: `${source.url}#${current.anchor}`,
			body,
			keywords,
		});
		current = undefined;
	};
	for (const event of events(markdown)) {
		if (event.kind === "heading") {
			if (current && event.level <= current.level) finish();
			const match = event.title.match(
				/^([A-Z]\d?|1\d{3})\s*[-–—.．、]\s*(\S.*)$/,
			);
			if (!current && match) {
				if (!event.anchor) {
					diagnostics.push(`${source.url}: missing anchor for ${event.title}`);
					continue;
				}
				current = {
					level: event.level,
					anchor: event.anchor,
					code: match[1],
					title: match[2],
					body: [],
					commentUrls: [],
					links: [],
				};
			} else if (current) current.body.push(`\n${event.title}\n`);
		} else if (current && event.kind === "code") {
			for (const match of event.value.matchAll(
				/(?:^|\n)\s*(?:\/\/|#|\*)\s*URL:\s*(https?:\/\/\S+)/gi,
			))
				current.commentUrls.push(match[1]);
		} else if (current && event.kind === "link")
			current.links.push(event.value);
		else if (current && event.kind === "text") current.body.push(event.value);
	}
	finish();
	if (!records.length)
		diagnostics.push(`${source.url}: no recognized problem headings`);
	return { records, diagnostics };
}

/** Virtual documents retain the real article fragment URL; no extra routes are emitted. */
export function problemHTML(record) {
	const meta = {
		type: "problem",
		title: `${record.code} · ${record.title}`,
		sourceTitle: record.sourceTitle,
		problemCode: record.code,
		platform: record.platform || "",
		problemId: record.problemId || "",
		date: record.date,
		category: record.category || "",
	};
	const metas = Object.entries(meta)
		.map(
			([key, value]) =>
				`<meta data-pagefind-meta="${key}[content]" content="${escapeHTML(value)}">`,
		)
		.join("");
	return `<html lang="zh-cn"><head>${metas}</head><body data-pagefind-body>
<span data-pagefind-filter="type[data-value]" data-value="problem"></span>
<h1 data-pagefind-weight="10">${escapeHTML(meta.title)}</h1>
<p data-pagefind-weight="10">${escapeHTML(`${record.platform || ""} ${record.problemId || ""} ${record.aliases || ""}`)}</p>
<p data-pagefind-weight="3">${escapeHTML(record.sourceTitle)}</p>
<p data-pagefind-weight="5">${escapeHTML(record.keywords)}</p>
<span data-pagefind-filter="category[data-value]" data-value="${escapeHTML(record.category)}"></span>
${record.tags.map((tag) => `<span data-pagefind-filter="tag[data-value]" data-value="${escapeHTML(tag)}"></span>`).join("")}
<time data-pagefind-sort="date[datetime]" datetime="${escapeHTML(record.date)}"></time>
<div>${escapeHTML(record.body)}</div></body></html>`;
}
