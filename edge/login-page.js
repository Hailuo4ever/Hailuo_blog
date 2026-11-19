export function loginPage(incorrect) {
	return `<!doctype html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="color-scheme" content="light dark">
	<title>访问密码 · Hailuo4ever</title>
	<style>
		:root { color-scheme: light dark; --bg: #f0f5f2; --card: #fff; --ink: #19372d; --muted: #51675e; --line: #a7b9b0; --accent: #216548; --error: #a12730; }
		@media (prefers-color-scheme: dark) {
			:root { --bg: #131e19; --card: #1d2b24; --ink: #e5f0e9; --muted: #b5c6bc; --line: #677e6f; --accent: #99d4b3; --error: #ffb3b5; }
		}
		* { box-sizing: border-box; }
		body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 1.25rem; background: var(--bg); color: var(--ink); font: 1rem/1.5 system-ui, sans-serif; }
		main { width: min(100%, 25rem); padding: clamp(1.5rem, 7vw, 2.75rem); border-radius: 1.25rem; background: var(--card); box-shadow: 0 12px 45px #1736290c; }
		h1 { margin: 0; font: 600 2rem/1.2 Georgia, serif; }
		p { margin: .65rem 0 1.75rem; color: var(--muted); }
		label { display: block; font-weight: 600; }
		input, button { width: 100%; border-radius: .6rem; padding: .75rem .9rem; font: inherit; }
		input { margin-top: .4rem; border: 1px solid var(--line); background: var(--card); color: var(--ink); }
		button { margin-top: 1rem; border: 0; background: var(--accent); color: var(--card); font-weight: 650; cursor: pointer; }
		:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
		#error { margin: .5rem 0 0; color: var(--error); }
	</style>
</head>
<body><main>
	<h1>Hailuo4ever</h1>
	<p>输入密码，继续阅读博客。</p>
	<form method="post">
		<label for="password">访问密码</label>
		<input id="password" name="password" type="password" autocomplete="current-password" required${incorrect ? ' aria-invalid="true" aria-describedby="error"' : ""}>
		${incorrect ? '<p id="error" role="alert">密码不正确，请重试。</p>' : ""}
		<button type="submit">进入博客</button>
	</form>
</main></body></html>`;
}
