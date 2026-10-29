/**
 * Recognize LaTeX's \(...\) before Markdown consumes the backslash escapes.
 * A syntax extension keeps code, HTML attributes and link destinations intact.
 */
export function remarkLatexInline() {
	const data = this.data();
	(data.micromarkExtensions ??= []).push({
		text: { 92: { name: "latexInline", tokenize } },
	});
	(data.fromMarkdownExtensions ??= []).push({
		enter: {
			latexInline(token) {
				const value = this.sliceSerialize(token).slice(2, -2);
				this.enter({
					type: "inlineMath",
					value,
					data: {
						hName: "code",
						hProperties: { className: ["language-math", "math-inline"] },
						hChildren: [{ type: "text", value }],
					},
				}, token);
			},
		},
		exit: {
			latexInline(token) {
				this.exit(token);
			},
		},
	});
}

function tokenize(effects, ok, nok) {
	return start;

	function start(code) {
		effects.enter("latexInline");
		effects.consume(code);
		return open;
	}

	function open(code) {
		if (code !== 40) return nok(code);
		effects.consume(code);
		return body;
	}

	function body(code) {
		// Inline delimiters must close on the same line. Block formulas use $$.
		if (code === null || code === -5 || code === -4 || code === -3) return nok(code);
		effects.consume(code);
		return code === 92 ? backslash : body;
	}

	function backslash(code) {
		if (code === 41) {
			effects.consume(code);
			effects.exit("latexInline");
			return ok;
		}
		// Consume escaped backslashes in pairs, so \\) is not a closing delimiter.
		if (code === 92) {
			effects.consume(code);
			return body;
		}
		return body(code);
	}
}
