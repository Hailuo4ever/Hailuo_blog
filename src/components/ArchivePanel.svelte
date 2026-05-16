<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { getPostUrlBySlug } from "../utils/url-utils";

export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: Post[] = [];

const params = new URLSearchParams(window.location.search);
tags = params.has("tag") ? params.getAll("tag") : [];
categories = params.has("category") ? params.getAll("category") : [];
const uncategorized = params.get("uncategorized");

interface Post {
	slug: string;
	id: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date;
		status?: "published" | "editing";
	};
}

interface Group {
	type: "editing" | "month";
	year?: number;
	month?: number;
	posts: Post[];
}

interface FolderNode {
	type: "folder";
	name: string;
	path: string;
	count: number;
	children: TreeNode[];
}

interface PostNode {
	type: "post";
	name: string;
	post: Post;
}

type TreeNode = FolderNode | PostNode;
type ArchiveView = "timeline" | "folders";

interface TreeRow {
	node: TreeNode;
	depth: number;
}

const naturalCollator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: "base",
});

let activeView: ArchiveView = "timeline";
let groups: Group[] = [];
let treeRoot: FolderNode = createTreeRoot();
let expandedFolderPaths = new Set<string>();
let visibleTreeRows: TreeRow[] = [];
let allFolderPaths: string[] = [];
let areAllFoldersExpanded = false;

$: visibleTreeRows = getVisibleTreeRows(treeRoot, expandedFolderPaths);
$: allFolderPaths = getFolderPaths(treeRoot);
$: areAllFoldersExpanded =
	allFolderPaths.length > 0 &&
	allFolderPaths.every((path) => expandedFolderPaths.has(path));

function createTreeRoot(): FolderNode {
	return {
		type: "folder",
		name: "posts",
		path: "posts",
		count: 0,
		children: [],
	};
}

function getPostDate(post: Post) {
	return new Date(post.data.published);
}

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

function formatPostCount(count: number) {
	return `${count} ${i18n(count === 1 ? I18nKey.postCount : I18nKey.postsCount)}`;
}

function isEditingPost(post: Post) {
	return post.data.status === "editing";
}

function getArchiveDateLabel(post: Post) {
	return isEditingPost(post) ? i18n(I18nKey.editing) : formatDate(getPostDate(post));
}

function getGroupTitle(group: Group) {
	return group.type === "editing"
		? i18n(I18nKey.editing)
		: `${group.year}-${group.month?.toString().padStart(2, "0")}`;
}

function getFilteredPosts(posts: Post[]) {
	let filteredPosts = posts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	return filteredPosts;
}

function buildArchiveGroups(posts: Post[]) {
	const editingPosts = posts.filter(isEditingPost);
	const publishedPosts = posts.filter((post) => !isEditingPost(post));

	const grouped = publishedPosts.reduce(
		(acc, post) => {
			const date = getPostDate(post);
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const key = `${year}-${month}`;
			if (!acc[key]) {
				acc[key] = { type: "month", year, month, posts: [] };
			}
			acc[key].posts.push(post);
			return acc;
		},
		{} as Record<string, Group>,
	);

	const groupedPostsArray = Object.values(grouped);

	groupedPostsArray.sort((a, b) => {
		if (a.year !== b.year) return (b.year ?? 0) - (a.year ?? 0);
		return (b.month ?? 0) - (a.month ?? 0);
	});

	return editingPosts.length > 0
		? [{ type: "editing", posts: editingPosts }, ...groupedPostsArray]
		: groupedPostsArray;
}

function normalizePostPath(post: Post) {
	const sourcePath = (post.id || post.slug).replace(/\\/g, "/");
	return sourcePath.replace(/^\/+|\/+$/g, "").replace(/\.mdx?$/i, "");
}

function buildFolderTree(posts: Post[]) {
	const root = createTreeRoot();
	const folders = new Map<string, FolderNode>([[root.path, root]]);

	for (const post of posts) {
		const pathParts = normalizePostPath(post).split("/").filter(Boolean);
		const parts = pathParts.length > 0 ? pathParts : [post.slug];
		let currentFolder = root;
		root.count += 1;

		for (let i = 0; i < parts.length - 1; i++) {
			const folderPath = `posts/${parts.slice(0, i + 1).join("/")}`;
			let folder = folders.get(folderPath);

			if (!folder) {
				folder = {
					type: "folder",
					name: parts[i],
					path: folderPath,
					count: 0,
					children: [],
				};
				folders.set(folderPath, folder);
				currentFolder.children.push(folder);
			}

			folder.count += 1;
			currentFolder = folder;
		}

		currentFolder.children.push({
			type: "post",
			name: parts[parts.length - 1],
			post,
		});
	}

	sortTree(root);
	return root;
}

function compareTreeNodes(a: TreeNode, b: TreeNode) {
	if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
	return naturalCollator.compare(a.name, b.name);
}

function sortTree(node: FolderNode) {
	node.children.sort(compareTreeNodes);
	for (const child of node.children) {
		if (child.type === "folder") sortTree(child);
	}
}

function getFolderPaths(root: FolderNode) {
	const paths: string[] = [];

	function visit(folder: FolderNode) {
		if (folder !== root) paths.push(folder.path);
		for (const child of folder.children) {
			if (child.type === "folder") visit(child);
		}
	}

	visit(root);
	return paths;
}

function getVisibleTreeRows(root: FolderNode, expandedPaths: Set<string>) {
	const rows: TreeRow[] = [];

	function visit(node: TreeNode, depth: number) {
		rows.push({ node, depth });

		if (node.type !== "folder" || !expandedPaths.has(node.path)) return;

		for (const child of node.children) {
			visit(child, depth + 1);
		}
	}

	for (const child of root.children) {
		visit(child, 0);
	}
	return rows;
}

function toggleFolder(path: string) {
	const nextExpandedPaths = new Set(expandedFolderPaths);

	if (nextExpandedPaths.has(path)) {
		nextExpandedPaths.delete(path);
	} else {
		nextExpandedPaths.add(path);
	}

	expandedFolderPaths = nextExpandedPaths;
}

function toggleAllFolders() {
	expandedFolderPaths = areAllFoldersExpanded ? new Set() : new Set(allFolderPaths);
}

function isFolderExpanded(path: string) {
	return expandedFolderPaths.has(path);
}

function getTreeRowPadding(depth: number) {
	return Math.min(depth, 5) * 1.1;
}

function getTreeRowKey(row: TreeRow) {
	return row.node.type === "folder"
		? `folder:${row.node.path}`
		: `post:${row.node.post.slug}`;
}

function getPostFileName(fileStem: string) {
	return /\.mdx?$/i.test(fileStem) ? fileStem : `${fileStem}.md`;
}

onMount(() => {
	const filteredPosts = getFilteredPosts(sortedPosts);
	groups = buildArchiveGroups(filteredPosts);
	treeRoot = buildFolderTree(filteredPosts);
	expandedFolderPaths = new Set();
});
</script>

<div class="card-base px-4 py-5 md:px-8 md:py-6">
	<div class="mb-4 flex flex-wrap gap-2">
		<button
			type="button"
			aria-pressed={activeView === "timeline"}
			class={`btn-plain h-9 rounded-lg px-3 text-sm font-bold transition-all ${
				activeView === "timeline"
					? "bg-[var(--btn-plain-bg-hover)] text-[var(--primary)]"
					: "text-50"
			}`}
			on:click={() => (activeView = "timeline")}
		>
			<Icon icon="material-symbols:timeline-rounded" class="mr-2 text-[1.25rem]"></Icon>
			{i18n(I18nKey.timelineArchive)}
		</button>
		<button
			type="button"
			aria-pressed={activeView === "folders"}
			class={`btn-plain h-9 rounded-lg px-3 text-sm font-bold transition-all ${
				activeView === "folders"
					? "bg-[var(--btn-plain-bg-hover)] text-[var(--primary)]"
					: "text-50"
			}`}
			on:click={() => (activeView = "folders")}
		>
			<Icon icon="material-symbols:folder-outline-rounded" class="mr-2 text-[1.25rem]"></Icon>
			{i18n(I18nKey.folderArchive)}
		</button>
		{#if activeView === "folders"}
			<button
				type="button"
				class="btn-plain ml-auto h-9 rounded-lg px-3 text-sm font-bold text-50 transition-all hover:text-[var(--primary)]"
				on:click={toggleAllFolders}
			>
				<Icon
					icon={areAllFoldersExpanded
						? "material-symbols:unfold-less-rounded"
						: "material-symbols:unfold-more-rounded"}
					class="mr-2 text-[1.25rem]"
				></Icon>
				{areAllFoldersExpanded ? i18n(I18nKey.collapseAll) : i18n(I18nKey.expandAll)}
			</button>
		{/if}
	</div>

	{#if activeView === "timeline"}
		{#each groups as group}
			<div>
				<div class="flex h-[3.75rem] w-full flex-row items-center">
					<div class="w-[15%] whitespace-nowrap text-right text-2xl font-bold text-75 transition md:w-[10%]">
						{getGroupTitle(group)}
					</div>
					<div class="w-[15%] md:w-[10%]">
						<div
							class="z-50 mx-auto h-3 w-3 rounded-full bg-none outline outline-3 -outline-offset-[2px] outline-[var(--primary)]"
						></div>
					</div>
					<div class="w-[70%] text-left text-50 transition md:w-[80%]">
						{formatPostCount(group.posts.length)}
					</div>
				</div>

				{#each group.posts as post}
					<a
						href={getPostUrlBySlug(post.slug)}
						aria-label={post.data.title}
						class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
					>
						<div class="flex h-full flex-row items-center justify-start">
							<div class="w-[15%] text-right text-sm text-50 transition md:w-[10%]">
								{getArchiveDateLabel(post)}
							</div>

							<div class="dash-line relative flex h-full w-[15%] items-center md:w-[10%]">
								<div
									class="z-50 mx-auto h-1 w-1 rounded bg-[oklch(0.5_0.05_var(--hue))] outline outline-4 outline-[var(--card-bg)] transition-all group-hover:h-5 group-hover:bg-[var(--primary)] group-hover:outline-[var(--btn-plain-bg-hover)] group-active:outline-[var(--btn-plain-bg-active)]"
								></div>
							</div>

							<div
								class="w-[70%] overflow-hidden overflow-ellipsis whitespace-nowrap pr-8 text-left font-bold text-75 transition-all group-hover:translate-x-1 group-hover:text-[var(--primary)] md:w-[65%] md:max-w-[65%]"
							>
								{post.data.title}
								{#if post.data.status === "editing"}
									<span
										class="ml-2 inline-flex rounded-md border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-1.5 py-0.5 text-xs font-semibold text-[var(--primary)]"
									>
										{i18n(I18nKey.editing)}
									</span>
								{/if}
							</div>

							<div
								class="hidden whitespace-nowrap text-left text-sm text-30 transition md:block md:w-[15%] md:overflow-hidden md:overflow-ellipsis"
							>
								{formatTag(post.data.tags)}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/each}
	{:else}
		<div class="space-y-1">
			{#each visibleTreeRows as row (getTreeRowKey(row))}
				{#if row.node.type === "folder"}
					<button
						type="button"
						aria-expanded={isFolderExpanded(row.node.path)}
						class="group btn-plain !flex h-10 w-full items-center rounded-lg text-left hover:text-[initial]"
						style={`padding-left: ${getTreeRowPadding(row.depth)}rem;`}
						on:click={() => toggleFolder(row.node.path)}
					>
						<Icon
							icon={isFolderExpanded(row.node.path)
								? "material-symbols:folder-open-rounded"
								: "material-symbols:folder-rounded"}
							class="mr-2 shrink-0 text-[1.25rem] text-[var(--primary)]"
						></Icon>
						<span
							class="min-w-0 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-75 transition group-hover:text-[var(--primary)]"
						>
							{row.node.name}{row.depth === 0 ? "/" : ""}
						</span>
						<span class="ml-3 shrink-0 text-sm text-30">
							{formatPostCount(row.node.count)}
						</span>
						<Icon
							icon={isFolderExpanded(row.node.path)
								? "material-symbols:keyboard-arrow-down-rounded"
								: "material-symbols:chevron-right-rounded"}
							class="ml-2 shrink-0 text-[1.25rem] text-30 transition group-hover:text-[var(--primary)]"
						></Icon>
					</button>
				{:else}
					<a
						href={getPostUrlBySlug(row.node.post.slug)}
						aria-label={row.node.post.data.title}
						class="group btn-plain !flex h-10 w-full items-center rounded-lg hover:text-[initial]"
						style={`padding-left: ${getTreeRowPadding(row.depth)}rem;`}
					>
						<Icon
							icon="material-symbols:article-outline-rounded"
							class="mr-2 shrink-0 text-[1.15rem] text-30 transition group-hover:text-[var(--primary)]"
						></Icon>
						<div class="min-w-0 flex-1 overflow-hidden">
							<div class="flex min-w-0 items-center">
								<span
									class="min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-75 transition group-hover:text-[var(--primary)]"
								>
									{row.node.post.data.title}
								</span>
								{#if row.node.post.data.status === "editing"}
									<span
										class="ml-2 shrink-0 rounded-md border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-1.5 py-0.5 text-xs font-semibold text-[var(--primary)]"
									>
										{i18n(I18nKey.editing)}
									</span>
								{/if}
							</div>
						</div>
						<span
							class="ml-3 hidden max-w-[35%] shrink-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-30 md:block"
						>
							{getPostFileName(row.node.name)}
						</span>
					</a>
				{/if}
			{/each}
		</div>
	{/if}
</div>
