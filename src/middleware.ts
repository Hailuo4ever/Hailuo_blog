import { defineMiddleware } from "astro:middleware";

const noStoreRoutes = [
	/^\/$/,
	/^\/\d+\/?$/,
	/^\/archive\/?$/,
	/^\/posts\//,
	/^\/contest-problems\.json$/,
	/^\/rss\.xml$/,
];

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();

	if (!noStoreRoutes.some((pattern) => pattern.test(context.url.pathname))) {
		return response;
	}

	const headers = new Headers(response.headers);
	headers.set("Cache-Control", "no-store, max-age=0");

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
