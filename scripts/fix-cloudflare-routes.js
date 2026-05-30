import fs from "node:fs";
import path from "node:path";

const routesPath = path.resolve("dist", "_routes.json");

if (!fs.existsSync(routesPath)) {
	console.warn("[routes] dist/_routes.json was not found; skipping route patch.");
	process.exit(0);
}

const routes = JSON.parse(fs.readFileSync(routesPath, "utf8"));

const shouldRunWorkerFirst = (route) => {
	return (
		route === "/" ||
		route === "/posts/*" ||
		route === "/archive" ||
		route === "/contest-problems.json" ||
		route === "/rss.xml" ||
		/^\/\d+$/.test(route)
	);
};

routes.include = Array.from(new Set(["/*", ...(routes.include ?? [])]));
routes.exclude = (routes.exclude ?? []).filter(
	(route) => !shouldRunWorkerFirst(route),
);

fs.writeFileSync(routesPath, `${JSON.stringify(routes, null, 2)}\n`);

console.log("[routes] Routed posts, listing pages, RSS, and contest index to Worker.");
