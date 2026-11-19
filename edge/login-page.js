export function loginPage(incorrect) {
	return `<!doctype html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="color-scheme" content="dark">
	<title>访问密码 · Hailuo4ever</title>
	<style>
		body {
			margin: 0;
			min-height: 100dvh;
			display: grid;
			place-items: center;
			background: #000;
		}
		input {
			display: block;
			box-sizing: border-box;
			width: min(15rem, 75vw);
			padding: .65rem .2rem;
			border: 0;
			border-bottom: 1px solid #fff;
			border-radius: 0;
			background: transparent;
			color: #fff;
			caret-color: #fff;
			font: 1.25rem/1.4 monospace;
			letter-spacing: .15em;
			appearance: none;
		}
		input:focus { outline: none; border-bottom-width: 2px; }
		input[aria-invalid="true"] { border-bottom-style: dashed; }
		input::-ms-reveal { display: none; }
	</style>
</head>
<body><main>
	<form method="post" novalidate>
		<input name="password" type="password" aria-label="${incorrect ? "密码不正确，请重新输入访问密码" : "访问密码"}"
			autocomplete="current-password" enterkeyhint="go" autofocus required${incorrect ? ' aria-invalid="true"' : ""}>
	</form>
</main></body></html>`;
}
