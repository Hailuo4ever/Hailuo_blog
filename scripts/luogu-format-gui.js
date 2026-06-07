#!/usr/bin/env node

import http from "node:http";
import process from "node:process";
import {
	analyzeFiles,
	applyFormattedFiles,
	listMarkdownFiles,
	toPublicResult,
} from "./luogu-format/core.js";

const host = "127.0.0.1";
const preferredPort = Number.parseInt(
	process.env.LUOGU_FORMAT_PORT ?? "4177",
	10,
);

const server = http.createServer(async (request, response) => {
	try {
		const url = new URL(
			request.url ?? "/",
			`http://${request.headers.host ?? host}`,
		);

		if (request.method === "GET" && url.pathname === "/") {
			sendHtml(response, renderAppHtml());
			return;
		}

		if (request.method === "GET" && url.pathname === "/api/files") {
			sendJson(response, { files: listMarkdownFiles() });
			return;
		}

		if (request.method === "POST" && url.pathname === "/api/check") {
			const body = await readJsonBody(request);
			const files = normalizeCheckFiles(body.files);
			const results = analyzeFiles(files).map(toPublicResult);
			sendJson(response, {
				summary: summarizeResults(results),
				files: results,
			});
			return;
		}

		if (request.method === "POST" && url.pathname === "/api/apply") {
			const body = await readJsonBody(request);
			const files = normalizeApplyFiles(body.files);
			const results = applyFormattedFiles(files);
			sendJson(response, {
				summary: summarizeResults(results),
				files: results,
			});
			return;
		}

		sendJson(response, { error: "Not found" }, 404);
	} catch (error) {
		sendJson(
			response,
			{ error: error.message },
			error.code === "STALE_FORMAT_HASH" ? 409 : 400,
		);
	}
});

listen(preferredPort);

function listen(port) {
	server.once("error", (error) => {
		if (error.code === "EADDRINUSE" && port < preferredPort + 20) {
			listen(port + 1);
			return;
		}

		console.error(`[luogu-format-gui] ${error.message}`);
		process.exit(1);
	});

	server.listen(port, host, () => {
		console.log(`[luogu-format-gui] Open http://${host}:${port}/`);
	});
}

function normalizeCheckFiles(files) {
	if (!Array.isArray(files) || files.length === 0) {
		throw new Error("Expected a non-empty files array.");
	}

	return files.map((file) => {
		if (typeof file !== "string")
			throw new Error("Check files must be strings.");
		return file;
	});
}

function normalizeApplyFiles(files) {
	if (!Array.isArray(files) || files.length === 0) {
		throw new Error("Expected a non-empty files array.");
	}

	return files.map((file) => {
		if (typeof file === "string") return { file };
		if (typeof file?.file === "string" && typeof file?.hash === "string") {
			return { file: file.file, hash: file.hash };
		}
		throw new Error("Apply files must be strings or { file, hash } objects.");
	});
}

async function readJsonBody(request) {
	const chunks = [];
	for await (const chunk of request) {
		chunks.push(chunk);
	}

	const rawBody = Buffer.concat(chunks).toString("utf8");
	if (!rawBody.trim()) return {};

	return JSON.parse(rawBody);
}

function sendJson(response, payload, statusCode = 200) {
	response.writeHead(statusCode, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store",
	});
	response.end(JSON.stringify(payload, null, 2));
}

function sendHtml(response, html) {
	response.writeHead(200, {
		"content-type": "text/html; charset=utf-8",
		"cache-control": "no-store",
	});
	response.end(html);
}

function summarizeResults(results) {
	return results.reduce(
		(summary, result) => ({
			files: summary.files + 1,
			changed: summary.changed + (result.changed ? 1 : 0),
			fixes: summary.fixes + result.fixCount,
			warnings: summary.warnings + result.warningCount,
		}),
		{ files: 0, changed: 0, fixes: 0, warnings: 0 },
	);
}

function renderAppHtml() {
	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Luogu Format Checker</title>
	<style>
		:root {
			color-scheme: light dark;
			--bg: #f6f7f9;
			--panel: #ffffff;
			--text: #1d2433;
			--muted: #6b7280;
			--line: #d8dee8;
			--accent: #0f766e;
			--accent-strong: #115e59;
			--warn: #a16207;
			--danger: #b42318;
			--add-bg: #ecfdf3;
			--del-bg: #fff1f2;
			--code-bg: #111827;
			--code-text: #e5e7eb;
		}

		@media (prefers-color-scheme: dark) {
			:root {
				--bg: #12151c;
				--panel: #1b202a;
				--text: #e5e7eb;
				--muted: #9ca3af;
				--line: #303846;
				--accent: #2dd4bf;
				--accent-strong: #5eead4;
				--warn: #facc15;
				--danger: #fb7185;
				--add-bg: #0f2f24;
				--del-bg: #3b1720;
				--code-bg: #0b1020;
				--code-text: #d1d5db;
			}
		}

		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			background: var(--bg);
			color: var(--text);
			font: 14px/1.5 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		}

		button,
		input {
			font: inherit;
		}

		button {
			border: 1px solid var(--line);
			border-radius: 6px;
			background: var(--panel);
			color: var(--text);
			cursor: pointer;
			padding: 0.55rem 0.75rem;
		}

		button.primary {
			border-color: var(--accent-strong);
			background: var(--accent);
			color: #ffffff;
		}

		button:disabled {
			cursor: not-allowed;
			opacity: 0.55;
		}

		.shell {
			display: grid;
			grid-template-columns: minmax(280px, 360px) 1fr;
			min-height: 100vh;
		}

		.sidebar {
			border-right: 1px solid var(--line);
			background: var(--panel);
			padding: 1rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			min-width: 0;
		}

		.main {
			padding: 1rem;
			min-width: 0;
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			margin-bottom: 1rem;
		}

		h1 {
			font-size: 1.2rem;
			margin: 0;
		}

		.toolbar {
			display: flex;
			gap: 0.5rem;
			flex-wrap: wrap;
		}

		.search {
			width: 100%;
			border: 1px solid var(--line);
			border-radius: 6px;
			background: transparent;
			color: var(--text);
			padding: 0.55rem 0.7rem;
		}

		.files {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			overflow: auto;
			min-height: 0;
		}

		.file-row {
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 0.55rem;
			align-items: start;
			padding: 0.45rem 0.25rem;
			border-radius: 6px;
		}

		.file-row:hover {
			background: color-mix(in srgb, var(--accent) 9%, transparent);
		}

		.file-title {
			font-weight: 600;
			overflow-wrap: anywhere;
		}

		.file-path {
			color: var(--muted);
			font-size: 0.78rem;
			overflow-wrap: anywhere;
		}

		.summary {
			display: grid;
			grid-template-columns: repeat(4, minmax(110px, 1fr));
			gap: 0.75rem;
			margin-bottom: 1rem;
		}

		.metric {
			border: 1px solid var(--line);
			border-radius: 8px;
			background: var(--panel);
			padding: 0.75rem;
		}

		.metric strong {
			display: block;
			font-size: 1.35rem;
		}

		.metric span {
			color: var(--muted);
			font-size: 0.78rem;
			text-transform: uppercase;
			letter-spacing: 0;
		}

		.result {
			border: 1px solid var(--line);
			border-radius: 8px;
			background: var(--panel);
			margin-bottom: 1rem;
			overflow: hidden;
		}

		.result-head {
			display: flex;
			justify-content: space-between;
			gap: 1rem;
			padding: 0.8rem 0.9rem;
			border-bottom: 1px solid var(--line);
		}

		.badge {
			border-radius: 999px;
			border: 1px solid var(--line);
			color: var(--muted);
			font-size: 0.78rem;
			padding: 0.1rem 0.5rem;
			white-space: nowrap;
		}

		.badge.fix {
			color: var(--accent-strong);
			border-color: color-mix(in srgb, var(--accent) 60%, var(--line));
		}

		.badge.warning {
			color: var(--warn);
			border-color: color-mix(in srgb, var(--warn) 60%, var(--line));
		}

		table {
			width: 100%;
			border-collapse: collapse;
		}

		th,
		td {
			text-align: left;
			border-bottom: 1px solid var(--line);
			padding: 0.45rem 0.65rem;
			vertical-align: top;
		}

		th {
			color: var(--muted);
			font-size: 0.78rem;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0;
		}

		.diff {
			margin: 0;
			background: var(--code-bg);
			color: var(--code-text);
			overflow: auto;
			padding: 0.8rem;
			font: 12px/1.45 "Cascadia Code", "JetBrains Mono", Consolas, monospace;
			white-space: pre;
		}

		.diff .add {
			display: block;
			background: var(--add-bg);
			color: var(--text);
		}

		.diff .del {
			display: block;
			background: var(--del-bg);
			color: var(--text);
		}

		.diff .hunk {
			display: block;
			color: var(--accent-strong);
		}

		.empty,
		.error {
			border: 1px dashed var(--line);
			border-radius: 8px;
			padding: 1rem;
			color: var(--muted);
			background: var(--panel);
		}

		.error {
			color: var(--danger);
		}

		@media (max-width: 840px) {
			.shell {
				grid-template-columns: 1fr;
			}

			.sidebar {
				border-right: 0;
				border-bottom: 1px solid var(--line);
				max-height: 48vh;
			}

			.summary {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}
		}
	</style>
</head>
<body>
	<div class="shell">
		<aside class="sidebar">
			<div>
				<h1>Luogu Format Checker</h1>
				<div class="file-path">Local Markdown formatter for solution drafts</div>
			</div>
			<input id="filter" class="search" type="search" placeholder="Filter files">
			<div class="toolbar">
				<button id="selectAll" type="button">Select shown</button>
				<button id="clearAll" type="button">Clear</button>
			</div>
			<div id="files" class="files"></div>
		</aside>
		<main class="main">
			<div class="header">
				<div>
					<h1>Preview and apply fixes</h1>
					<div id="status" class="file-path">Loading files...</div>
				</div>
				<div class="toolbar">
					<button id="check" class="primary" type="button">Check selected</button>
					<button id="apply" type="button" disabled>Apply shown fixes</button>
				</div>
			</div>
			<div id="summary" class="summary"></div>
			<div id="output" class="empty">Select one or more Markdown files, then run a check.</div>
		</main>
	</div>
	<script>
		const state = {
			files: [],
			results: [],
			selected: new Set(),
			filter: "",
		};

		const nodes = {
			files: document.querySelector("#files"),
			filter: document.querySelector("#filter"),
			selectAll: document.querySelector("#selectAll"),
			clearAll: document.querySelector("#clearAll"),
			check: document.querySelector("#check"),
			apply: document.querySelector("#apply"),
			status: document.querySelector("#status"),
			summary: document.querySelector("#summary"),
			output: document.querySelector("#output"),
		};

		nodes.filter.addEventListener("input", () => {
			state.filter = nodes.filter.value.toLowerCase();
			renderFiles();
		});

		nodes.selectAll.addEventListener("click", () => {
			for (const file of visibleFiles()) state.selected.add(file.path);
			renderFiles();
		});

		nodes.clearAll.addEventListener("click", () => {
			state.selected.clear();
			renderFiles();
		});

		nodes.check.addEventListener("click", () => runCheck());
		nodes.apply.addEventListener("click", () => applyFixes());

		loadFiles();

		async function loadFiles() {
			try {
				const payload = await requestJson("/api/files");
				state.files = payload.files;
				nodes.status.textContent = state.files.length + " Markdown file(s) found.";
				renderFiles();
			} catch (error) {
				showError(error.message);
			}
		}

		async function runCheck() {
			const files = [...state.selected];
			if (files.length === 0) {
				showError("Select at least one file.");
				return;
			}

			setBusy(true, "Checking " + files.length + " file(s)...");
			try {
				const payload = await requestJson("/api/check", { files });
				state.results = payload.files;
				nodes.status.textContent = "Last check completed.";
				renderResults(payload.summary, payload.files);
			} catch (error) {
				showError(error.message);
			} finally {
				setBusy(false);
			}
		}

		async function applyFixes() {
			const files = state.results
				.filter((result) => result.changed)
				.map((result) => ({ file: result.file, hash: result.hash }));

			if (files.length === 0) return;

			setBusy(true, "Applying fixes...");
			try {
				await requestJson("/api/apply", { files });
				await runCheck();
			} catch (error) {
				showError(error.message);
			} finally {
				setBusy(false);
			}
		}

		function renderFiles() {
			const shown = visibleFiles();
			nodes.files.innerHTML = shown
				.map((file) => {
					const checked = state.selected.has(file.path) ? "checked" : "";
					return '<label class="file-row"><input type="checkbox" data-file="' + escapeHtml(file.path) + '" ' + checked + '><span><span class="file-title">' + escapeHtml(file.title) + '</span><span class="file-path">' + escapeHtml(file.path) + '</span></span></label>';
				})
				.join("");

			for (const checkbox of nodes.files.querySelectorAll("input[type=checkbox]")) {
				checkbox.addEventListener("change", () => {
					if (checkbox.checked) state.selected.add(checkbox.dataset.file);
					else state.selected.delete(checkbox.dataset.file);
				});
			}
		}

		function renderResults(summary, results) {
			nodes.apply.disabled = !results.some((result) => result.changed);
			nodes.summary.innerHTML = [
				metric("Files", summary.files),
				metric("Changed", summary.changed),
				metric("Fixes", summary.fixes),
				metric("Warnings", summary.warnings),
			].join("");

			if (results.length === 0) {
				nodes.output.className = "empty";
				nodes.output.textContent = "No files checked.";
				return;
			}

			nodes.output.className = "";
			nodes.output.innerHTML = results.map(renderResult).join("");
		}

		function renderResult(result) {
			const issues = result.issues.length === 0
				? '<div class="empty">No issues in this file.</div>'
				: '<table><thead><tr><th>Type</th><th>Rule</th><th>Line</th><th>Message</th></tr></thead><tbody>' +
					result.issues.map((issue) => '<tr><td><span class="badge ' + escapeHtml(issue.severity) + '">' + escapeHtml(issue.severity) + '</span></td><td>' + escapeHtml(issue.ruleId) + '</td><td>' + issue.line + '</td><td>' + escapeHtml(issue.message) + '</td></tr>').join("") +
					'</tbody></table>';

			const diff = result.diff
				? '<pre class="diff">' + renderDiff(result.diff) + '</pre>'
				: '<div class="empty">No automatic diff.</div>';

			return '<section class="result"><div class="result-head"><div><strong>' + escapeHtml(result.file) + '</strong><div class="file-path">' + result.fixCount + ' fix(es), ' + result.warningCount + ' warning(s)</div></div><span class="badge">' + (result.changed ? "changed" : "unchanged") + '</span></div>' + issues + diff + '</section>';
		}

		function renderDiff(diff) {
			return diff.split("\\n").map((line) => {
				const escaped = escapeHtml(line);
				if (line.startsWith("+") && !line.startsWith("+++")) return '<span class="add">' + escaped + '</span>';
				if (line.startsWith("-") && !line.startsWith("---")) return '<span class="del">' + escaped + '</span>';
				if (line.startsWith("@@")) return '<span class="hunk">' + escaped + '</span>';
				return '<span>' + escaped + '</span>';
			}).join("\\n");
		}

		function metric(label, value) {
			return '<div class="metric"><strong>' + value + '</strong><span>' + label + '</span></div>';
		}

		function visibleFiles() {
			if (!state.filter) return state.files;
			return state.files.filter((file) =>
				file.path.toLowerCase().includes(state.filter) ||
				file.title.toLowerCase().includes(state.filter)
			);
		}

		function setBusy(busy, message) {
			nodes.check.disabled = busy;
			nodes.apply.disabled = busy || !state.results.some((result) => result.changed);
			if (message) nodes.status.textContent = message;
		}

		function showError(message) {
			nodes.output.className = "error";
			nodes.output.textContent = message;
		}

		async function requestJson(url, body) {
			const response = await fetch(url, {
				method: body ? "POST" : "GET",
				headers: body ? { "content-type": "application/json" } : undefined,
				body: body ? JSON.stringify(body) : undefined,
			});
			const payload = await response.json();
			if (!response.ok) throw new Error(payload.error || "Request failed.");
			return payload;
		}

		function escapeHtml(value) {
			return String(value)
				.replaceAll("&", "&amp;")
				.replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;")
				.replaceAll('"', "&quot;")
				.replaceAll("'", "&#39;");
		}
	</script>
</body>
</html>`;
}
