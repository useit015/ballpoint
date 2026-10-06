import { createHighlighter, type Highlighter, type ThemeRegistration } from "shiki";

// One ink for code too. Tokens differ by pressure and weight rather than
// hue: keywords pressed hard, names in full ink, the plumbing (punctuation,
// operators) and comments lighter. Colours are CSS variables defined in
// app/globals.css, so code follows the theme.
const ink: ThemeRegistration = {
  name: "ink",
  type: "light",
  colors: { "editor.foreground": "var(--code-plain)", "editor.background": "transparent" },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "var(--code-quiet)", fontStyle: "italic" } },
    {
      scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.control", "variable.language", "constant.language"],
      settings: { foreground: "var(--code-strong)", fontStyle: "bold" },
    },
    {
      scope: ["entity.name.function", "support.function", "entity.name.tag", "support.class.component", "entity.name.type", "entity.name.class", "support.type"],
      settings: { foreground: "var(--code-strong)" },
    },
    { scope: ["string", "punctuation.definition.string", "string.template"], settings: { foreground: "var(--code-strong)" } },
    { scope: ["entity.other.attribute-name", "variable.parameter", "meta.object-literal.key"], settings: { foreground: "var(--code-plain)", fontStyle: "italic" } },
    { scope: ["constant.numeric", "constant", "support.constant"], settings: { foreground: "var(--code-plain)" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator", "punctuation.separator", "punctuation.terminator"], settings: { foreground: "var(--code-quiet)" } },
  ],
};

let highlighter: Promise<Highlighter> | undefined;

export async function highlight(code: string, lang: "tsx" | "bash" | "css" | "json" = "tsx") {
  highlighter ??= createHighlighter({ themes: [ink], langs: ["tsx", "bash", "css", "json"] });
  return (await highlighter).codeToHtml(code.trimEnd(), { lang, theme: "ink" });
}
