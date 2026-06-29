import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);

export function prepareBuild(rootDir = projectRoot) {
	const resolvedRoot = path.resolve(rootDir);
	const targets = [
		path.join(resolvedRoot, "node_modules", ".astro"),
		path.join(resolvedRoot, "dist"),
	];

	for (const target of targets) {
		const relativeTarget = path.relative(resolvedRoot, target);
		if (relativeTarget.startsWith("..") || path.isAbsolute(relativeTarget)) {
			throw new Error(
				`Refusing to remove a path outside the project: ${target}`,
			);
		}
		fs.rmSync(target, { recursive: true, force: true });
	}

	return targets;
}

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	prepareBuild();
	console.log("[build] Cleared restored Astro and dist caches.");
}
