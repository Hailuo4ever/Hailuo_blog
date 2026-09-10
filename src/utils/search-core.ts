/** Query state is independent of the UI and Pagefind loader. */
export type SearchSort = "relevance" | "newest" | "oldest";
export interface SearchState {
	q: string;
	category: string;
	tags: string[];
	sort: SearchSort;
	page: number;
	match: "all" | "any";
}
export interface ArticleSearchResult {
	url: string;
	excerpt: string;
	meta: {
		title: string;
		date?: string;
		category?: string;
		description?: string;
	};
	filters?: Record<string, string[]>;
}
export interface SearchHit {
	id: string;
	data(): Promise<ArticleSearchResult>;
}
export interface PagefindAPI {
	options(options: { excerptLength: number }): Promise<void>;
	init(): Promise<void>;
	filters(): Promise<Record<string, Record<string, number>>>;
	search(
		query: string | null,
		options?: {
			filters?: Record<string, string | string[]>;
			sort?: Record<string, "asc" | "desc">;
		},
	): Promise<{ results: SearchHit[] }>;
}
/** A failed initialization must not poison all future attempts. */
export function createSearchLoader(
	initialize: () => Promise<PagefindAPI>,
): () => Promise<PagefindAPI> {
	let pending: Promise<PagefindAPI> | undefined;
	return () => {
		pending ??= Promise.resolve()
			.then(initialize)
			.catch((error) => {
				pending = undefined;
				throw error;
			});
		return pending;
	};
}
export const emptySearch = (): SearchState => ({
	q: "",
	category: "",
	tags: [],
	sort: "relevance",
	page: 1,
	match: "all",
});
export function readSearch(params: URLSearchParams): SearchState {
	const sort = params.get("sort");
	const page = Number(params.get("page"));
	return {
		q: (params.get("q") || "").trim(),
		category: params.get("category") || "",
		tags: [...new Set(params.getAll("tag").filter(Boolean))],
		sort: sort === "newest" || sort === "oldest" ? sort : "relevance",
		page: Number.isSafeInteger(page) && page > 0 ? page : 1,
		match: params.get("match") === "any" ? "any" : "all",
	};
}
export function searchParams(state: SearchState): string {
	const params = new URLSearchParams();
	if (state.q.trim()) params.set("q", state.q.trim());
	if (state.category) params.set("category", state.category);
	for (const tag of [...new Set(state.tags)]) params.append("tag", tag);
	if (state.sort !== "relevance") params.set("sort", state.sort);
	if (state.page > 1) params.set("page", String(state.page));
	if (state.match === "any") params.set("match", "any");
	return params.toString();
}
/** Quoted phrases stay together when relaxing a query. */
export function queryTerms(q: string): string[] {
	return [...new Set(q.trim().match(/"[^"]+"|[^\s"]+/g) || [])];
}
export async function findArticles(
	api: PagefindAPI,
	state: SearchState,
): Promise<SearchHit[]> {
	const filters: Record<string, string | string[]> = {};
	if (state.category) filters.category = state.category;
	if (state.tags.length) filters.tag = state.tags;
	const sort =
		state.sort === "relevance" && !state.q.trim() ? "newest" : state.sort;
	const options = {
		filters,
		...(sort !== "relevance"
			? {
					sort: {
						date: sort === "newest" ? ("desc" as const) : ("asc" as const),
					},
				}
			: {}),
	};
	const terms = queryTerms(state.q);
	const strictSearch = async (
		q: string | null,
	): Promise<{ results: SearchHit[] }> => {
		const candidateQuery =
			q && queryTerms(q).length > 1 && q.startsWith('"') && q.endsWith('"')
				? q.replaceAll('"', "")
				: q;
		const found = await api.search(candidateQuery, options);
		if (!q || !found.results.length) return found;
		// Pagefind may shorten an unknown Latin word to a code variable (e.g. z).
		// Intersect exact word/phrase handles while preserving native relevance.
		const constraints = [
			...new Set(
				queryTerms(q).flatMap((term) =>
					term.startsWith('"')
						? [term]
						: (term.match(/[a-z0-9]+/gi) || []).map((word) => `"${word}"`),
				),
			),
		].filter((term) => term !== q);
		const checks = await Promise.all(
			constraints.map((term) => api.search(term, options)),
		);
		const allowed = checks.map(
			(check) => new Set(check.results.map((hit) => hit.id)),
		);
		return {
			results: found.results.filter((hit) =>
				allowed.every((ids) => ids.has(hit.id)),
			),
		};
	};
	if (state.match !== "any" || terms.length < 2)
		return (await strictSearch(state.q.trim() || null)).results;
	// Keep detail loading lazy: rank the result handles, not hydrated documents.
	const groups = await Promise.all(terms.map((term) => strictSearch(term)));
	const merged = new Map<
		string,
		{ hit: SearchHit; count: number; rank: number }
	>();
	for (const group of groups)
		group.results.forEach((hit, rank) => {
			const old = merged.get(hit.id);
			merged.set(hit.id, {
				hit,
				count: (old?.count || 0) + 1,
				rank: (old?.rank || 0) + 1 / (rank + 1),
			});
		});
	if (sort !== "relevance") {
		// Ask Pagefind for the global date order without fetching every article.
		const ordered = await api.search(null, options);
		return ordered.results.flatMap((hit) => {
			const match = merged.get(hit.id);
			return match ? [match.hit] : [];
		});
	}
	return [...merged.values()]
		.sort(
			(a, b) =>
				b.count - a.count ||
				b.rank - a.rank ||
				a.hit.id.localeCompare(b.hit.id),
		)
		.map((item) => item.hit);
}

export async function loadSearchPage(
	hits: SearchHit[],
	page: number,
	size: number,
): Promise<ArticleSearchResult[]> {
	return Promise.all(
		hits.slice((page - 1) * size, page * size).map((hit) => hit.data()),
	);
}
