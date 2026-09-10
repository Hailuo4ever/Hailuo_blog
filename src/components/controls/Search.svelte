<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { onMount, tick } from "svelte";
import Icon from "@/components/common/Icon.svelte";
import Result from "@/components/common/SearchResult.svelte";
import SearchTypeSwitch from "@/components/common/SearchTypeSwitch.svelte";
import { FLOATING_PANEL_CLOSE_EVENT } from "@/utils/floating-panel-utils";
import { navigateToPage } from "@/utils/navigation-utils";
import {
	type ArticleSearchResult,
	emptySearch,
	findArticles,
	loadSearchPage,
} from "@/utils/search-core";
import { loadSearch } from "@/utils/search-service";
import { getSearchUrl } from "@/utils/url-utils";

let keyword = "";
let searchType: "problem" | "article" = "problem";
let results: ArticleSearchResult[] = [];
let total = 0;
let status: "idle" | "loading" | "ready" | "error" = "idle";
let selected = -1;
let panel: HTMLDivElement;
let desktop: HTMLInputElement;
let mobile: HTMLInputElement;
let composing = false;
let timer: ReturnType<typeof setTimeout>;
let request = 0;

function cancel() {
	clearTimeout(timer);
	request++;
	selected = -1;
	status = "idle";
}
function open() {
	panel?.classList.remove("float-panel-closed");
}
function close() {
	cancel();
	panel?.classList.add("float-panel-closed");
}
function schedule() {
	cancel();
	results = [];
	total = 0;
	open();
	if (composing || !keyword.trim()) return;
	status = "loading";
	const id = request;
	const query = keyword.trim();
	const type = searchType;
	timer = setTimeout(async () => {
		try {
			const hits = await findArticles(await loadSearch(), {
				...emptySearch(),
				q: query,
				type,
			});
			if (id !== request) return;
			const items = await loadSearchPage(hits, 1, 5);
			if (id !== request) return;
			total = hits.length;
			results = items;
			status = "ready";
		} catch {
			if (id === request) status = "error";
		}
	}, 300);
}
function focus(event: FocusEvent) {
	if (
		(event.currentTarget as HTMLElement).hasAttribute(
			"data-floating-panel-focus-return",
		)
	)
		return;
	void loadSearch().catch(() => {});
	schedule();
}
async function toggle() {
	if (!panel.classList.contains("float-panel-closed")) {
		close();
		return;
	}
	open();
	await tick();
	mobile.focus();
}
function go(event: MouseEvent, target: string) {
	if (
		event.ctrlKey ||
		event.metaKey ||
		event.shiftKey ||
		event.altKey ||
		event.button !== 0
	)
		return;
	event.preventDefault();
	close();
	navigateToPage(target);
}
function keys(event: KeyboardEvent) {
	if (event.isComposing || composing) return;
	if (event.key === "ArrowDown" || event.key === "ArrowUp") {
		if (!results.length) return;
		event.preventDefault();
		open();
		selected =
			selected < 0
				? event.key === "ArrowDown"
					? 0
					: results.length - 1
				: (selected + (event.key === "ArrowDown" ? 1 : results.length - 1)) %
					results.length;
		document
			.getElementById(`quick-result-${selected}`)
			?.scrollIntoView({ block: "nearest" });
	} else if (event.key === "Enter" && keyword.trim()) {
		event.preventDefault();
		const target = results[selected]?.url || getSearchUrl(keyword, searchType);
		close();
		navigateToPage(target);
	}
}
onMount(() => {
	const shortcut = (event: KeyboardEvent) => {
		if (
			(event.ctrlKey || event.metaKey) &&
			event.key.toLowerCase() === "k" &&
			!event.isComposing
		) {
			event.preventDefault();
			if (window.matchMedia("(min-width: 1024px)").matches) {
				desktop.focus();
				if (document.activeElement === desktop) schedule();
			} else {
				open();
				mobile.focus();
			}
		}
	};
	document.addEventListener("keydown", shortcut);
	panel.addEventListener(FLOATING_PANEL_CLOSE_EVENT, cancel);
	return () => {
		cancel();
		document.removeEventListener("keydown", shortcut);
		panel.removeEventListener(FLOATING_PANEL_CLOSE_EVENT, cancel);
	};
});
</script>

<div id="search-bar" class="hidden lg:flex items-center h-11 mr-2 rounded-lg bg-black/4 dark:bg-white/5">
    <Icon icon="material-symbols:search" class="text-xl ml-3 text-50" />
    <input bind:this={desktop} id="search-input-desktop" bind:value={keyword} aria-label={i18n(I18nKey.search)} placeholder={i18n(searchType === "problem" ? I18nKey.searchProblemHint : I18nKey.search)}
        aria-controls="search-panel" aria-activedescendant={selected >= 0 ? `quick-result-${selected}` : undefined}
        data-floating-panel-no-expanded on:focus={focus} on:input={event => { keyword = event.currentTarget.value; schedule(); }} on:keydown={keys}
        on:compositionstart={() => { composing = true; cancel(); }} on:compositionend={event => { keyword = event.currentTarget.value; composing = false; schedule(); }}
        class="bg-transparent outline-0 h-full w-40 focus:w-60 transition-all px-3 text-sm text-75" />
</div>
<button on:click={toggle} aria-label={i18n(I18nKey.search)} aria-controls="search-panel" aria-expanded="false" id="search-switch"
    class="btn-plain lg:hidden! rounded-lg w-9 h-9 md:w-11 md:h-11">
    <Icon icon="material-symbols:search" class="text-xl" />
</button>
<div bind:this={panel} id="search-panel" class="float-panel float-panel-closed absolute md:w-120 top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2 search-panel"
    data-floating-panel data-floating-panel-trigger="search-switch search-input-desktop" inert aria-hidden="true">
    <SearchTypeSwitch value={searchType} on:change={event => { searchType = event.detail; schedule(); }} />
    <input bind:this={mobile} bind:value={keyword} aria-label={i18n(I18nKey.search)} placeholder={i18n(searchType === "problem" ? I18nKey.searchProblemHint : I18nKey.search)}
        aria-controls="quick-results" aria-activedescendant={selected >= 0 ? `quick-result-${selected}` : undefined}
        on:focus={focus} on:input={event => { keyword = event.currentTarget.value; schedule(); }} on:keydown={keys}
        on:compositionstart={() => { composing = true; cancel(); }} on:compositionend={event => { keyword = event.currentTarget.value; composing = false; schedule(); }}
        class="lg:hidden w-full p-3 mb-2 rounded-xl bg-black/4 dark:bg-white/5 text-75 outline-0" />
    <div aria-live="polite" class="text-sm text-50 p-2">
        {#if import.meta.env.DEV}{i18n(I18nKey.searchDevNotice)}
        {:else if status === "loading"}{i18n(I18nKey.searchLoading)}
        {:else if status === "error"}{i18n(I18nKey.searchError)} <button class="text-(--primary) underline" on:click={schedule}>{i18n(I18nKey.searchRetry)}</button>
        {:else if !keyword.trim()}{i18n(searchType === "problem" ? I18nKey.searchProblemHint : I18nKey.searchTypeSomething)}
        {:else if status === "ready"}{i18n(searchType === "problem" ? I18nKey.searchProblemCount : I18nKey.searchResultCount).replace("{count}", String(total))}{/if}
    </div>
    <div id="quick-results">
        {#each results as item, index}
            <a id={`quick-result-${index}`} href={item.url} on:click={event => go(event, item.url)}
                class:active={selected === index} class="block p-3 rounded-xl hover:bg-(--btn-plain-bg-hover)"><Result {item} compact /></a>
        {/each}
    </div>
    {#if status === "ready" && !total}<p class="p-3 text-50">{i18n(I18nKey.searchNoResults)}</p>{/if}
    {#if keyword.trim()}
        <a href={getSearchUrl(keyword, searchType)} on:click={event => go(event, getSearchUrl(keyword, searchType))} class="block p-3 text-center font-bold text-(--primary)">{i18n(I18nKey.searchAllResults)}</a>
    {/if}
</div>
<style>
    .search-panel { max-height: calc(100dvh - 100px); overflow-y: auto; }
    .active { background: var(--btn-plain-bg-hover); outline: 2px solid var(--primary); outline-offset: -2px; }
</style>
