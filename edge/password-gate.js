import { loginPage } from "./login-page.js";

const COOKIE = "__Host-blog_session";
const WEEK = 7 * 24 * 60 * 60;
const MAX_FORM_BYTES = 8192;
const encoder = new TextEncoder();
const privateHeaders = {
	"Cache-Control": "private, no-store",
	"X-Robots-Tag": "noindex",
};

function lockedResponse(request, status, message, headers) {
	return new Response(request.method === "HEAD" ? null : message, {
		status,
		headers: {
			...privateHeaders,
			"Content-Type": "text/plain; charset=utf-8",
			"Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
			"X-Content-Type-Options": "nosniff",
			...headers,
		},
	});
}

function prompt(request, incorrect = false) {
	return lockedResponse(request, 401, loginPage(incorrect), {
		"Content-Type": "text/html; charset=utf-8",
	});
}

function sessionData(request, password, expires) {
	return encoder.encode(JSON.stringify([new URL(request.url).origin, password, expires]));
}

async function signingKey(secret) {
	return crypto.subtle.importKey("raw", encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function hasSession(request, env) {
	const pair = (request.headers.get("Cookie") || "").split(";")
		.map((item) => item.trim()).find((item) => item.startsWith(COOKIE + "="));
	const token = pair?.slice(COOKIE.length + 1);
	const match = token && /^(\d{10})\.([A-Za-z0-9+/]{43}=)$/.exec(token);
	if (!match || Number(match[1]) <= Date.now() / 1000) return false;

	const signature = Uint8Array.from(atob(match[2]), (char) => char.charCodeAt(0));
	return crypto.subtle.verify("HMAC", await signingKey(env.BLOG_SESSION_SECRET),
		signature, sessionData(request, env.BLOG_PASSWORD, Number(match[1])));
}

async function readPassword(request) {
	const reader = request.body?.getReader();
	if (!reader) return null;
	const buffer = new Uint8Array(MAX_FORM_BYTES);
	let size = 0;
	while (true) {
		const { value, done } = await reader.read();
		if (done) break;
		if (size + value.length > buffer.length) {
			await reader.cancel();
			return null;
		}
		buffer.set(value, size);
		size += value.length;
	}
	const form = new URLSearchParams(new TextDecoder().decode(buffer.subarray(0, size)));
	return form.get("password");
}

async function login(request, env) {
	if (request.headers.get("Origin") !== new URL(request.url).origin) {
		return lockedResponse(request, 403, "请从本站密码页提交。");
	}
	if (request.headers.get("Content-Type")?.split(";")[0] !== "application/x-www-form-urlencoded") {
		return lockedResponse(request, 415, "请使用密码表单。");
	}
	const password = await readPassword(request);
	if (!password) return prompt(request, true);
	const key = await signingKey(env.BLOG_SESSION_SECRET);
	const expected = await crypto.subtle.sign("HMAC", key, encoder.encode(env.BLOG_PASSWORD));
	if (!await crypto.subtle.verify("HMAC", key, expected, encoder.encode(password))) {
		return prompt(request, true);
	}
	const expires = Math.floor(Date.now() / 1000) + WEEK;
	const mac = await crypto.subtle.sign("HMAC", key, sessionData(request, env.BLOG_PASSWORD, expires));
	const token = expires + "." + btoa(String.fromCharCode(...new Uint8Array(mac)));
	return lockedResponse(request, 303, null, {
		Location: request.url,
		"Set-Cookie": `${COOKIE}=${token}; Path=/; Max-Age=${WEEK}; HttpOnly; Secure; SameSite=Lax`,
	});
}

export async function passwordGate(request, env, next) {
	const url = new URL(request.url);
	if (url.protocol === "http:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
		url.protocol = "https:";
		return lockedResponse(request, 303, null, { Location: url.href });
	}
	if (!env.BLOG_PASSWORD || !env.BLOG_SESSION_SECRET) {
		return lockedResponse(request, 503, "博客访问密码尚未配置，请稍后再试。");
	}
	// The blog is static. The form posts back to its own URL to preserve deep links.
	if (request.method === "POST") return login(request, env);
	if (!await hasSession(request, env)) return prompt(request);

	const asset = await next();
	const response = new Response(asset.body, asset);
	response.headers.set("Cache-Control", privateHeaders["Cache-Control"]);
	return response;
}
