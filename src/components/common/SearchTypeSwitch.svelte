<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { createEventDispatcher } from "svelte";
import type { SearchType } from "@/utils/search-core";
export let value: SearchType;
const dispatch = createEventDispatcher<{ change: SearchType }>();
</script>

<div role="group" aria-label={i18n(I18nKey.search)} class="flex gap-2 mb-3">
    <button type="button" aria-pressed={value === "problem"} on:click={() => dispatch("change", "problem")} class="px-4 py-2 rounded-lg text-sm font-bold">{i18n(I18nKey.searchProblems)}</button>
    <button type="button" aria-pressed={value === "article"} on:click={() => dispatch("change", "article")} class="px-4 py-2 rounded-lg text-sm font-bold">{i18n(I18nKey.searchArticles)}</button>
</div>
<style>
    button { color: var(--primary); background: var(--btn-plain-bg-hover); }
    button[aria-pressed="true"] { color: var(--card-bg); background: var(--primary); }
    button:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
</style>
