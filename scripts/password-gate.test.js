import assert from "node:assert/strict";
import test from "node:test";
import { onRequest } from "../functions/_middleware.js";

const origin = "https://blog.example";
const url = origin + "/posts/article/?from=archive";
const env = { BLOG_PASSWORD: "test password", BLOG_SESSION_SECRET: "local test key" };
const locked = () => assert.fail("Private assets must only be read after authentication");
const visit = (init, bindings = env, next = locked) =>
	onRequest({ request: new Request(url, init), env: bindings, next });
const submit = (password) => visit({
	method: "POST",
	headers: { Origin: origin },
	body: new URLSearchParams({ password }),
});

test("visitors get the form and missing configuration closes the site", async () => {
	const http = await onRequest({ request: new Request(url.replace("https:", "http:")), env, next: locked });
	assert.equal(http.status, 303);
	assert.equal(http.headers.get("Location"), url);
	const response = await visit();
	assert.equal(response.status, 401);
	assert.match(await response.text(), /type="password"/);
	assert.equal((await visit({ method: "HEAD" })).body, null);
	for (const key of Object.keys(env)) {
		assert.equal((await visit({}, { ...env, [key]: "" })).status, 503);
	}
	const wrong = await submit("wrong");
	assert.equal(wrong.status, 401);
	assert.equal(wrong.headers.get("Set-Cookie"), null);
});

test("login returns to the article and signed access ends on expiry or secret rotation", async () => {
	const login = await submit(env.BLOG_PASSWORD);
	assert.equal(login.status, 303);
	assert.equal(login.headers.get("Location"), url);
	const cookie = login.headers.get("Set-Cookie").split(";")[0];
	const init = { headers: { Cookie: cookie } };
	const asset = () => new Response("article", { headers: { "Cache-Control": "public" } });
	const response = await visit(init, env, asset);
	assert.equal(await response.text(), "article");
	assert.equal(response.headers.get("Cache-Control"), "private, no-store");
	for (const key of Object.keys(env)) {
		assert.equal((await visit(init, { ...env, [key]: "new secret" })).status, 401);
	}
	const expires = cookie.slice(cookie.indexOf("=") + 1, cookie.indexOf("."));
	const edited = cookie.replace("=" + expires + ".", "=" + (Number(expires) + 60) + ".");
	assert.equal((await visit({ headers: { Cookie: edited } })).status, 401);
	const clock = test.mock.method(Date, "now", () => Number(expires) * 1000);
	try {
		assert.equal((await visit(init)).status, 401);
	} finally {
		clock.mock.restore();
	}
});
