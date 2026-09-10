import { createSearchLoader, type PagefindAPI } from "./search-core";
import { url } from "./url-utils";

let attempt = 0;

export const loadSearch: () => Promise<PagefindAPI> = createSearchLoader(
	async () => {
		if (import.meta.env.DEV) throw new Error("SEARCH_BUILD_REQUIRED");
		// Browsers cache failed module imports too. A retry needs a fresh module URL.
		const retry = attempt++;
		const path =
			url("/pagefind/pagefind.js") + (retry ? `?retry=${retry}` : "");
		const api: PagefindAPI = await import(/* @vite-ignore */ path);
		await api.options({ excerptLength: 30 });
		await api.init();
		return api;
	},
);
