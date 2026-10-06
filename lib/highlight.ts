import { createHighlighter, type Highlighter, type ThemeRegistration } from "shiki";

// Code inked with a four-colour ballpoint: blue keywords, green strings,
// red for names (functions, components, tags), black for the rest, and
// pencil for comments. The colours are CSS variables in app/globals.css,
// so code follows the theme.
const ink: ThemeRegistration = {
  name: "ink",
  type: "light",
  colors: { "editor.foreground": "var(--code-plain)", "editor.background": "transparent" },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "var(--code-comment)", fontStyle: "italic" } },
    {
      scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.control", "variable.language", "constant.language", "keyword.operator.new"],
      settings: { foreground: "var(--code-keyword)", fontStyle: "bold" },
    },
    { scope: ["string", "punctuation.definition.string", "string.template", "string.quoted"], settings: { foreground: "var(--code-string)" } },
    {
      scope: ["entity.name.function", "support.function", "entity.name.tag", "support.class.component", "entity.name.type", "entity.name.class", "support.type"],
      settings: { foreground: "var(--code-name)" },
    },
    { scope: ["entity.other.attribute-name", "variable.parameter", "meta.object-literal.key", "support.type.property-name"], settings: { foreground: "var(--code-plain)", fontStyle: "italic" } },
    { scope: ["constant.numeric", "constant.other", "support.constant"], settings: { foreground: "var(--code-string)" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator", "punctuation.separator", "punctuation.terminator", "meta.tag.punctuation"], settings: { foreground: "var(--code-quiet)" } },
  ],
};

let highlighter: Promise<Highlighter> | undefined;

export async function highlight(code: string, lang: "tsx" | "bash" | "css" | "json" = "tsx") {
  highlighter ??= createHighlighter({ themes: [ink], langs: ["tsx", "bash", "css", "json"] });
  return (await highlighter).codeToHtml(code.trimEnd(), { lang, theme: "ink" });
}
