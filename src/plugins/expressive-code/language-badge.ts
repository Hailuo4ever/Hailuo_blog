/**
 * Based on the discussion at https://github.com/expressive-code/expressive-code/issues/153#issuecomment-2282218684
 */
import { definePlugin } from "@expressive-code/core";

export function pluginLanguageBadge() {
	return definePlugin({
		name: "Language Badge",
		baseStyles: () => `
      .frame:not(.has-title):not(.is-terminal) [data-language]::before {
        position: absolute;
        z-index: 2;
        right: 0.5rem;
        top: 0.5rem;
        padding: 0.1rem 0.5rem;
        content: attr(data-language);
        font-family: "Cascadia Code Variable", "Cascadia Code", "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
        color: var(--codeblock-badge-color);
        background: var(--codeblock-badge-bg);
        border: 1px solid var(--codeblock-badge-border);
        border-radius: 0.5rem;
        box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.08);
        pointer-events: none;
        transition: opacity 0.3s, background-color 0.3s, color 0.3s, border-color 0.3s;
        opacity: 0;
      }
      .frame:not(.has-title):not(.is-terminal) {
        @media (hover: none) {
          & [data-language]::before {
            opacity: 1;
            margin-right: 3rem;
          }
          & [data-language]:active::before {
            opacity: 0;
          }
        }
        @media (hover: hover) {
          & [data-language]::before {
            opacity: 1;
          }
          &:hover [data-language]::before {
            opacity: 0;
          }
        }
      }
    `,
	});
}
