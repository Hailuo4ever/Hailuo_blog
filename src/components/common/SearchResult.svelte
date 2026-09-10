<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import type { ArticleSearchResult } from "@/utils/search-core";
export let item: ArticleSearchResult;
export let compact = false;
</script>

<div class:compact class="search-result">
    <div class="font-bold text-90 title">{item.meta.title}</div>
    {#if item.meta.type === "problem"}
        <div class="text-sm text-75 mt-1">{i18n(I18nKey.searchProblemSource)}{item.meta.sourceTitle}
            {#if item.meta.problemId}<span> · {item.meta.platform} {item.meta.problemId}</span>{/if}
        </div>
    {/if}
    <div class="text-xs text-50 flex flex-wrap gap-x-3 gap-y-1 mt-1">
        {#if item.meta.date}<time datetime={item.meta.date}>{item.meta.date.slice(0, 10)}</time>{/if}
        {#if item.meta.category}<span>{item.meta.category}</span>{/if}
        {#each item.filters?.tag || [] as tag}<span>#{tag}</span>{/each}
    </div>
    <div class="text-sm text-75 mt-2 excerpt">{@html item.excerpt}</div>
</div>

<style>
    .title { font-size: 1.3rem; overflow-wrap: anywhere; }
    .compact .title { font-size: 1rem; }
    .excerpt { overflow-wrap: anywhere; }
    .compact .excerpt { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .search-result :global(mark) { background: transparent; color: var(--primary); font-weight: 700; }
</style>
