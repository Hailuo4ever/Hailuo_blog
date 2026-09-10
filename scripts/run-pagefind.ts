import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import * as pagefind from "pagefind";
import {
	articleGlob,
	extractProblems,
	indexOptions,
	problemHTML,
} from "./problem-search.mjs";
import { resolveSiteRoot } from "./site-root";

function verify(result: { errors?: string[] }): void {
	if (result.errors?.length) throw new Error(result.errors.join("\n"));
}
async function htmlFiles(directory: string): Promise<string[]> {
	const paths: string[] = [];
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) paths.push(...(await htmlFiles(path)));
		else if (entry.name.endsWith(".html")) paths.push(path);
	}
	return paths;
}
const siteRoot = resolveSiteRoot();
try {
	const created = await pagefind.createIndex(indexOptions);
	verify(created);
	if (!created.index) throw new Error("Pagefind did not create an index");
	const index = created.index;
	const articles = await index.addDirectory({
		path: siteRoot,
		glob: articleGlob,
	});
	verify(articles);
	let problemCount = 0;
	const diagnostics: string[] = [];
	for (const path of await htmlFiles(join(siteRoot, "posts"))) {
		const extracted = extractProblems(await readFile(path, "utf8"));
		diagnostics.push(...extracted.diagnostics);
		for (const record of extracted.records) {
			verify(
				await index.addHTMLFile({
					url: record.url,
					content: problemHTML(record),
				}),
			);
			problemCount++;
		}
	}
	verify(await index.writeFiles({ outputPath: join(siteRoot, "pagefind") }));
	const report = {
		articles: articles.page_count,
		problems: problemCount,
		diagnostics,
	};
	await writeFile(
		join(siteRoot, "pagefind", "extraction-report.json"),
		JSON.stringify(report, null, 2),
	);
	console.log(
		`[search] Indexed ${report.articles} articles and ${problemCount} problems; ${diagnostics.length} extraction notices.`,
	);
	for (const notice of diagnostics) console.warn(`[search] ${notice}`);
} finally {
	await pagefind.close();
}
