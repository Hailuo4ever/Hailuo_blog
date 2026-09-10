import assert from "node:assert/strict";
import test from "node:test";
import {
	createSearchLoader,
	emptySearch,
	findArticles,
	loadSearchPage,
	queryTerms,
	readSearch,
	searchParams,
} from "../src/utils/search-core.ts";

test("unknown Latin words cannot shorten to variables; quoted groups remain separate", async () => {
	const hit = { id: "a", data: async () => ({ url: "/a" }) };
	const queries = [];
	const api = {
		search: async (q) => {
			queries.push(q);
			return { results: q === '"unknownword"' ? [] : [hit] };
		},
	};
	assert.deepEqual(
		await findArticles(api, { ...emptySearch(), q: "unknownword" }),
		[],
	);
	assert.equal(
		(
			await findArticles(api, {
				...emptySearch(),
				q: '"dynamic programming" "segment tree"',
			})
		).length,
		1,
	);
	assert.ok(queries.includes("dynamic programming segment tree"));
	assert.ok(queries.includes('"dynamic programming"'));
	assert.ok(queries.includes('"segment tree"'));
});

test("URL state round trips Chinese, repeated tags, sorting, page and partial mode", () => {
	const state = {
		type: "article",
		q: '线段树 "dynamic programming"',
		category: "Algorithm",
		tags: ["题解", "icpc"],
		sort: "oldest",
		page: 2,
		match: "any",
	};
	assert.deepEqual(readSearch(new URLSearchParams(searchParams(state))), state);
	assert.equal(searchParams(emptySearch()), "");
	assert.deepEqual(
		readSearch(new URLSearchParams("page=-1&sort=bad&match=bad&tag=a&tag=a")),
		{ ...emptySearch(), tags: ["a"] },
	);
	assert.deepEqual(queryTerms('线段树 "dynamic programming" 线段树'), [
		"线段树",
		'"dynamic programming"',
	]);
});
test("strict queries preserve AND tags, phrases, and native date ordering", async () => {
	const calls = [];
	const api = {
		search: async (...args) => {
			calls.push(args);
			return { results: [] };
		},
	};
	await findArticles(api, {
		...emptySearch(),
		q: '"动态规划" ICPC',
		category: "Algorithm",
		tags: ["A", "B"],
	});
	await findArticles(api, { ...emptySearch(), category: "Algorithm" });
	assert.deepEqual(calls[0], [
		'"动态规划" ICPC',
		{ filters: { type: "problem", category: "Algorithm", tag: ["A", "B"] } },
	]);
	assert.deepEqual(calls[1], [
		null,
		{
			filters: { type: "problem", category: "Algorithm" },
			sort: { date: "desc" },
		},
	]);
});
test("relaxation ranks by matched term count then reciprocal rank without hydration", async () => {
	const hit = (id) => ({
		id,
		data: () => {
			throw new Error("must stay lazy");
		},
	});
	const api = {
		search: async (q) => ({
			results: (q.replaceAll('"', "") === "one"
				? ["a", "b", "c"]
				: ["d", "c", "b"]
			).map(hit),
		}),
	};
	const results = await findArticles(api, {
		...emptySearch(),
		q: "one two",
		match: "any",
	});
	assert.deepEqual(
		results.map((hit) => hit.id),
		["b", "c", "a", "d"],
	);
});
test("partial date order is global and preserves filters", async () => {
	const calls = [];
	const api = {
		search: async (q, options) => {
			calls.push(options);
			return {
				results: (q === null
					? ["c", "b", "a"]
					: q.replaceAll('"', "") === "one"
						? ["a"]
						: ["c"]
				).map((id) => ({ id })),
			};
		},
	};
	const results = await findArticles(api, {
		...emptySearch(),
		q: "one two",
		match: "any",
		sort: "oldest",
		tags: ["x"],
	});
	assert.deepEqual(
		results.map((hit) => hit.id),
		["c", "a"],
	);
	assert.ok(
		calls.every(
			(options) =>
				options.filters.type === "problem" &&
				options.filters.tag[0] === "x" &&
				options.sort.date === "asc",
		),
	);
});
test("only visible result details load", async () => {
	const loaded = [];
	const hits = Array.from({ length: 27 }, (_, id) => ({
		id: String(id),
		data: async () => {
			loaded.push(id);
			return { url: String(id) };
		},
	}));
	await loadSearchPage(hits, 1, 5);
	assert.deepEqual(loaded, [0, 1, 2, 3, 4]);
	loaded.length = 0;
	await loadSearchPage(hits, 3, 10);
	assert.deepEqual(loaded, [20, 21, 22, 23, 24, 25, 26]);
});
test("concurrent initialization shares one promise and failed initialization can retry", async () => {
	let count = 0;
	const api = {};
	const load = createSearchLoader(async () => {
		if (++count === 1) throw new Error("offline");
		return api;
	});
	const first = load();
	assert.equal(first, load());
	await assert.rejects(first, /offline/);
	assert.equal(await load(), api);
	assert.equal(await load(), api);
	assert.equal(count, 2);
});
