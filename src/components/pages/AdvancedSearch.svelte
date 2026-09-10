<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { onMount } from "svelte";
import Result from "@/components/common/SearchResult.svelte";
import { emptySearch, findArticles, loadSearchPage, queryTerms, readSearch, searchParams, type ArticleSearchResult, type SearchHit } from "@/utils/search-core";
import { loadSearch } from "@/utils/search-service";

export let title = i18n(I18nKey.search);
export let description = "";
let state = emptySearch();
let items: ArticleSearchResult[] = [];
let hits: SearchHit[] = [];
let filters: Record<string, Record<string, number>> = {};
let status: "idle" | "loading" | "ready" | "error" = "idle";
let composing = false;
let request = 0;
let timer: ReturnType<typeof setTimeout>;
let lastURL = "";
$: pages = Math.max(1, Math.ceil(hits.length / 10));
$: active = !!(state.q.trim() || state.category || state.tags.length);

function writeURL(replace = false) {
    const params = searchParams(state);
    const next = `${window.location.pathname}${params ? `?${params}` : ""}`;
    if (next !== window.location.pathname + window.location.search) window.history[replace ? "replaceState" : "pushState"]({ ...window.history.state, url: next }, "", next);
    lastURL = window.location.href;
}
function cancel() { request++; clearTimeout(timer); }
async function run(updateURL = false) {
    cancel(); const id = request;
    const query = { ...state, tags: [...state.tags] };
    items = []; hits = [];
    if (updateURL) writeURL();
    if (import.meta.env.DEV) { status = "idle"; return; }
    status = "loading";
    try {
        const api = await loadSearch();
        const available = await api.filters();
        if (id !== request) return;
        filters = available;
        if (!(query.q.trim() || query.category || query.tags.length)) { status = "idle"; return; }
        const found = await findArticles(api, query);
        if (id !== request) return;
        const page = Math.min(query.page, Math.max(1, Math.ceil(found.length / 10)));
        const loaded = await loadSearchPage(found, page, 10);
        if (id !== request) return;
        hits = found; items = loaded; state.page = page; status = "ready"; writeURL(true);
    } catch { if (id === request) status = "error"; }
}
function change() { state.page = 1; void run(true); }
function input() {
    cancel(); items = []; hits = []; status = "loading";
    state.page = 1; state.match = "all";
    if (composing) return;
    timer = setTimeout(() => { void run(true); }, 300);
}
function tagChanged(tag: string, checked: boolean) {
    state.tags = checked ? [...state.tags, tag] : state.tags.filter(value => value !== tag); change();
}
async function paginate(page: number) {
    cancel(); const id = request; status = "loading"; items = []; state.page = page; writeURL();
    try {
        const loaded = await loadSearchPage(hits, page, 10);
        if (id !== request) return;
        items = loaded; status = "ready";
        document.getElementById("search-results-heading")?.focus();
    } catch { if (id === request) status = "error"; }
}
onMount(() => {
    const restore = () => {
        if (lastURL === window.location.href) return;
        lastURL = window.location.href;
        state = readSearch(new URLSearchParams(window.location.search)); void run();
    };
    restore();
    window.addEventListener("popstate", restore);
    document.addEventListener("astro:page-load", restore);
    return () => { cancel(); window.removeEventListener("popstate", restore); document.removeEventListener("astro:page-load", restore); };
});
</script>

<section class="card-base p-6 md:p-9 mb-4 rounded-(--radius-large) text-75">
    <h1 class="text-3xl font-bold text-90 mb-4">{title}</h1>
    {#if description}<p class="text-50 mb-4">{description}</p>{/if}
    <form on:submit|preventDefault={() => { if (!composing) { state.page = 1; void run(true); } }}>
        <label for="full-search-input" class="sr-only">{i18n(I18nKey.search)}</label>
        <div class="flex gap-2">
            <input id="full-search-input" type="search" bind:value={state.q} placeholder={i18n(I18nKey.search)} on:input={event => { state.q = event.currentTarget.value; input(); }}
                on:compositionstart={() => { composing = true; cancel(); }} on:compositionend={event => { state.q = event.currentTarget.value; composing = false; input(); }} class="search-field min-w-0 flex-1 text-75" />
            <button type="submit" class="btn-plain px-4 rounded-lg">{i18n(I18nKey.search)}</button>
        </div>
        <div class="flex flex-wrap gap-4 mt-4">
            <label class="flex-1 min-w-40 text-sm text-75">{i18n(I18nKey.searchCategory)}
                <select aria-label={i18n(I18nKey.searchCategory)} bind:value={state.category} on:change={event => { state.category = event.currentTarget.value; change(); }} class="search-field w-full mt-1">
                    <option value="">{i18n(I18nKey.searchAllCategories)}</option>
                    {#each [...new Set([...Object.keys(filters.category || {}), ...(state.category ? [state.category] : [])])].sort() as category}<option value={category}>{category}</option>{/each}
                </select>
            </label>
            <label class="flex-1 min-w-40 text-sm text-75">{i18n(I18nKey.searchSort)}
                <select aria-label={i18n(I18nKey.searchSort)} value={!state.q.trim() && state.sort === "relevance" ? "newest" : state.sort} on:change={event => { state.sort = event.currentTarget.value as typeof state.sort; change(); }} class="search-field w-full mt-1">
                    <option value="relevance" disabled={!state.q.trim()}>{i18n(I18nKey.searchRelevance)}</option>
                    <option value="newest">{i18n(I18nKey.searchNewest)}</option>
                    <option value="oldest">{i18n(I18nKey.searchOldest)}</option>
                </select>
            </label>
        </div>
        <details class="mt-4 text-sm text-75" open={state.tags.length > 0}>
            <summary class="cursor-pointer">{i18n(I18nKey.searchTags)}{state.tags.length ? ` (${state.tags.length})` : ""}</summary>
            <div class="flex flex-wrap gap-2 mt-3 max-h-48 overflow-y-auto">
                {#each [...new Set([...Object.keys(filters.tag || {}), ...state.tags])].sort() as tag}
                    <label class="tag-option"><input type="checkbox" checked={state.tags.includes(tag)} on:change={event => tagChanged(tag, event.currentTarget.checked)} /> {tag}</label>
                {/each}
            </div>
        </details>
        {#if state.category || state.tags.length}<button type="button" class="text-sm text-(--primary) mt-3 underline" on:click={() => { state.category = ""; state.tags = []; change(); }}>{i18n(I18nKey.searchClearFilters)}</button>{/if}
    </form>
</section>

<section aria-busy={status === "loading"}>
    <h2 id="search-results-heading" tabindex="-1" class="text-75 px-2 mb-3 outline-none" aria-live="polite">
        {#if status === "ready"}{i18n(I18nKey.searchResultCount).replace("{count}", String(hits.length))}{/if}
    </h2>
    {#if state.match === "any"}
        <div class="card-base p-4 rounded-xl mb-4 text-75">{i18n(I18nKey.searchPartial)} <button class="text-(--primary) underline" on:click={() => { state.match = "all"; change(); }}>{i18n(I18nKey.searchStrict)}</button></div>
    {/if}
    {#if import.meta.env.DEV}<p class="notice text-50">{i18n(I18nKey.searchDevNotice)}</p>
    {:else if status === "loading"}<p class="notice text-50" role="status">{i18n(I18nKey.searchLoading)}</p>
    {:else if status === "error"}<div class="notice text-50" role="alert">{i18n(I18nKey.searchError)} <button class="text-(--primary) underline" on:click={() => run()}>{i18n(I18nKey.searchRetry)}</button></div>
    {:else if !active}<p class="notice text-50">{i18n(I18nKey.searchTypeSomething)}</p>
    {:else if status === "ready" && !hits.length}
        <div class="notice text-50">{i18n(I18nKey.searchNoResults)}
            {#if state.match === "all" && queryTerms(state.q).length > 1}<button class="block mx-auto mt-3 text-(--primary) underline" on:click={() => { state.match = "any"; change(); }}>{i18n(I18nKey.searchRelax)}</button>{/if}
        </div>
    {:else}
        <div class="space-y-4">{#each items as item}<a href={item.url} class="card-base block p-6 rounded-(--radius-large) search-card"><Result {item} /></a>{/each}</div>
    {/if}
    {#if status === "ready" && pages > 1}
        <nav aria-label={i18n(I18nKey.searchPagination)} class="flex justify-center items-center gap-4 mt-5 text-75">
            <button class="btn-plain p-3 rounded-lg" disabled={state.page <= 1} on:click={() => paginate(state.page - 1)}>{i18n(I18nKey.searchPrevious)}</button>
            <span>{state.page} / {pages}</span>
            <button class="btn-plain p-3 rounded-lg" disabled={state.page >= pages} on:click={() => paginate(state.page + 1)}>{i18n(I18nKey.searchNext)}</button>
        </nav>
    {/if}
</section>
<style>
    .search-field { padding: .8rem; border: 1px solid var(--line-divider); border-radius: .6rem; background: var(--card-bg); color: inherit; }
    .search-field:focus-visible, .search-card:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
    .tag-option { padding: .35rem .6rem; background: var(--btn-plain-bg-hover); border-radius: .5rem; cursor: pointer; }
    input[type="checkbox"] { accent-color: var(--primary); }
    .notice { padding: 2.5rem 1.5rem; text-align: center; border-radius: var(--radius-large); background: var(--card-bg); }
    .search-card:hover { box-shadow: inset 3px 0 var(--primary); }
    button:disabled { opacity: .4; cursor: default; }
</style>
