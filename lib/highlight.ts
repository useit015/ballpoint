import { createCssVariablesTheme, createHighlighter, type Highlighter } from "shiki";

// One ink for code too: tokens are coloured by CSS variables that map onto
// the ink pressures in app/globals.css, so code follows the theme.
const ink = createCssVariablesTheme({ name: "ink", variablePrefix: "--code-", fontStyle: true });

let highlighter: Promise<Highlighter> | undefined;

export async function highlight(code: string, lang: "tsx" | "bash" | "css" | "json" = "tsx") {
  highlighter ??= createHighlighter({ themes: [ink], langs: ["tsx", "bash", "css", "json"] });
  return (await highlighter).codeToHtml(code.trimEnd(), { lang, theme: "ink" });
}
