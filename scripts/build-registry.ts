// Writes registry.json from registry/manifest.ts, filling the base item's
// cssVars and css from registry/ballpoint/styles/base.css:
//   :root / .dark    → literal colours to cssVars.light / .dark; everything
//                      derived (color-mix, var(), durations) to css[":root"]
//                      / css[".dark"]. The CLI gives every cssVar a
//                      `--name: var(--name)` line in @theme unless it looks
//                      like a colour literal, which would litter the
//                      user's stylesheet with self-references.
//   @theme inline    → cssVars.theme
//   everything else  → css (nested at-rules and rules, comments dropped)
// `shadcn build` then turns registry.json into public/r/*.json.

import { readFileSync, writeFileSync } from "node:fs";
import postcss, { type Container } from "postcss";
import { add, toObject, type CssObject } from "./registry-css.ts";
import { homepage, items } from "../registry/manifest.ts";
import { papers, pens, type PenTheme } from "../registry/themes.ts";

const source = readFileSync(new URL("../registry/ballpoint/styles/base.css", import.meta.url), "utf8");
const root = postcss.parse(source);

const vars = { light: {}, dark: {}, theme: {} } as Record<"light" | "dark" | "theme", Record<string, string>>;
const css: CssObject = {};

// Mirrors the CLI's own test for "this cssVar is a colour".
const isColorLiteral = (value: string) => /^(#|oklch|hsl|rgb)/.test(value);

function declsOf(node: Container, into: Record<string, string>, rest?: CssObject) {
  node.each((child) => {
    if (child.type === "decl") {
      if (!rest || isColorLiteral(child.value)) into[child.prop.replace(/^--/, "")] = child.value;
      else rest[child.prop] = child.value;
    } else if (child.type !== "comment") throw new Error(`Unexpected ${child.type} inside a variables block`);
  });
}

const derived = { ":root": {}, ".dark": {} } as Record<":root" | ".dark", CssObject>;
css[":root"] = derived[":root"];
css[".dark"] = derived[".dark"];

root.each((node) => {
  if (node.type === "rule" && node.selector === ":root") return declsOf(node, vars.light, derived[":root"]);
  if (node.type === "rule" && node.selector === ".dark") return declsOf(node, vars.dark, derived[".dark"]);
  if (node.type === "atrule" && node.name === "theme" && node.params === "inline") return declsOf(node, vars.theme);
  add(css, node);
});

// Pens and papers: each a registry:theme that sets only what it changes.
// The ink fill is a plain number, so it goes in css rather than cssVars.
const author = items[0].author;
const themes = [
  ...Object.entries(pens as Record<string, PenTheme>).map(([name, pen]) => ({
    name: `pen-${name}`,
    type: "registry:theme",
    title: pen.title,
    description: pen.description,
    author,
    cssVars: { light: { ink: pen.ink.light }, dark: { ink: pen.ink.dark } },
    ...(pen.fill ? { css: { ":root": { "--ink-fill": String(pen.fill.light) }, ".dark": { "--ink-fill": String(pen.fill.dark) } } } : {}),
  })),
  ...Object.entries(papers).map(([name, paper]) => ({
    name: `paper-${name}`,
    type: "registry:theme",
    title: paper.title,
    description: paper.description,
    author,
    cssVars: {
      light: { paper: paper.paper.light, "pen-red": paper.red.light },
      dark: { paper: paper.paper.dark, "pen-red": paper.red.dark },
    },
  })),
];

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "ballpoint",
  homepage,
  items: [
    ...items.map(({ styles, ...item }) => {
      if (item.type === "registry:base") return { ...item, cssVars: vars, css };
      // A component's own stylesheet ships as the item's css, merged into the
      // app's global CSS on add.
      if (styles) return { ...item, css: toObject(postcss.parse(readFileSync(new URL(`../${styles}`, import.meta.url), "utf8"))) };
      return item;
    }),
    ...themes,
  ],
};

writeFileSync(new URL("../registry.json", import.meta.url), `${JSON.stringify(registry, null, 2)}\n`);
console.log(`registry.json: ${registry.items.length} items, ${Object.keys(vars.light).length} light vars, ${Object.keys(css).length} css blocks`);
