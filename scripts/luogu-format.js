#!/usr/bin/env node

import process from "node:process";
import {
	analyzeFiles,
	applyFormattedFiles,
	ruleDefinitions,
	toPublicResult,
} from "./luogu-format/core.js";

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const files = args.filter((arg) => !arg.startsWith("--"));

if (flags.has("--help") || files.length === 0) {
	printHelp();
	process.exit(flags.has("--help") ? 0 : 2);
}

const jsonOutput = flags.has("--json");
const write = flags.has("--write");

try {
	if (write) {
		const results = applyFormattedFiles(files);
		writeOutput(results, jsonOutput, true);
		process.exit(0);
	}

	const results = analyzeFiles(files).map(toPublicResult);
	writeOutput(results, jsonOutput, false);

	const hasIssues = results.some((result) => result.issues.length > 0);
	process.exit(hasIssues ? 1 : 0);
} catch (error) {
	if (jsonOutput) {
		console.error(JSON.stringify({ error: error.message }, null, 2));
	} else {
		console.error(`[luogu-format] ${error.message}`);
	}
	process.exit(2);
}

function writeOutput(results, jsonOutputEnabled, wroteFiles) {
	if (jsonOutputEnabled) {
		console.log(
			JSON.stringify(
				{
					summary: summarizeResults(results),
					files: results,
				},
				null,
				2,
			),
		);
		return;
	}

	const summary = summarizeResults(results);
	console.log(
		`[luogu-format] ${summary.files} file(s), ${summary.changed} changed, ${summary.fixes} fix(es), ${summary.warnings} warning(s).`,
	);

	for (const result of results) {
		console.log(`\n${result.file}`);

		if (result.issues.length === 0) {
			console.log("  No issues.");
		} else {
			for (const issue of result.issues) {
				console.log(
					`  ${issue.severity.toUpperCase()} ${issue.ruleId}:${issue.line}:${issue.column} ${issue.message}`,
				);
			}
		}

		if (result.diff) {
			console.log("");
			console.log(result.diff);
		}
	}

	if (wroteFiles) {
		console.log("\n[luogu-format] Applied fixable changes.");
	}
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

function printHelp() {
	console.log(`Usage:
  pnpm run luogu:format -- --check <file...>
  pnpm run luogu:format -- --write <file...>
  pnpm run luogu:format -- --check --json <file...>

Flags:
  --check   Check files without writing. This is the default behavior.
  --write   Write fixable changes and print the diff.
  --json    Emit machine-readable JSON.
  --help    Show this help.

Rules:
${Object.entries(ruleDefinitions)
	.map(([ruleId, description]) => `  ${ruleId}  ${description}`)
	.join("\n")}`);
}
