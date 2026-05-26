import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wranglerConfigDir = path.join(rootDir, ".wrangler", "xdg-config");
const astroBin = path.join(rootDir, "node_modules", "astro", "astro.js");

fs.mkdirSync(wranglerConfigDir, { recursive: true });

const env = {
	...process.env,
	XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || wranglerConfigDir,
	WRANGLER_SEND_METRICS: process.env.WRANGLER_SEND_METRICS || "false",
	WRANGLER_SEND_ERROR_REPORTS:
		process.env.WRANGLER_SEND_ERROR_REPORTS || "false",
};

const child = spawn(process.execPath, [astroBin, "dev", ...process.argv.slice(2)], {
	cwd: rootDir,
	env,
	stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
	process.on(signal, () => {
		child.kill(signal);
	});
}

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}

	process.exit(code ?? 0);
});
