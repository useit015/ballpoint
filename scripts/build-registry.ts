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
import postcss, { type ChildNode, type Container } from "postcss";
import { homepage, items } from "../registry/manifest.ts";

type CssObject = { [key: string]: string | CssObject };

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

function toObject(node: Container): CssObject {
  const out: CssObject = {};
  node.each((child) => add(out, child));
  return out;
}

function add(out: CssObject, child: ChildNode) {
  if (child.type === "comment") return;
  if (child.type === "decl") {
    out[child.prop] = child.important ? `${child.value} !important` : child.value;
  } else if (child.type === "rule") {
    out[child.selector] = merge(out[child.selector], toObject(child));
  } else if (child.type === "atrule") {
    const key = `@${child.name}${child.params ? ` ${child.params}` : ""}`;
    out[key] = merge(out[key], child.nodes ? toObject(child) : {});
  }
}

function merge(existing: string | CssObject | undefined, next: CssObject): CssObject {
  return typeof existing === "object" ? { ...existing, ...next } : next;
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

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "ballpoint",
  homepage,
  items: items.map((item) => (item.type === "registry:base" ? { ...item, cssVars: vars, css } : item)),
};

writeFileSync(new URL("../registry.json", import.meta.url), `${JSON.stringify(registry, null, 2)}\n`);
console.log(`registry.json: ${registry.items.length} items, ${Object.keys(vars.light).length} light vars, ${Object.keys(css).length} css blocks`);
