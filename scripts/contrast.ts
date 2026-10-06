// Fails if any ink token misses its WCAG contrast ratio against the paper,
// for every pen × paper pair in registry/themes.ts, by day and by night.
// Tokens come from registry/ballpoint/styles/base.css and are resolved the
// way the browser does (see lib/color.ts).

import { readFileSync } from "node:fs";
import postcss from "postcss";
import { contrast, over, parseColor, type Rgb } from "../lib/color.ts";
import { papers, pens, type PaperTheme, type PenTheme } from "../registry/themes.ts";

const css = postcss.parse(readFileSync(new URL("../registry/ballpoint/styles/base.css", import.meta.url), "utf8"));

function declsFor(match: (selector: string) => boolean) {
  const out: Record<string, string> = {};
  css.each((node) => {
    if (node.type !== "rule" || !match(node.selector.replace(/\s+/g, " "))) return;
    node.walkDecls((d) => {
      out[d.prop] = d.value;
    });
  });
  return out;
}

const derived = declsFor((s) => s.includes("[data-ink-scope]"));
const base = {
  light: { ...declsFor((s) => s === ":root"), ...derived },
  dark: { ...declsFor((s) => s === ":root"), ...derived, ...declsFor((s) => s === ".dark") },
};

// The defaults in base.css must be the blue pen on cream paper.
for (const mode of ["light", "dark"] as const) {
  const same = (a: string, b: string, what: string) => {
    if (a !== b) throw new Error(`base.css ${mode} ${what} (${a}) differs from themes.ts (${b})`);
  };
  same(base[mode]["--ink"], pens.blue.ink[mode], "--ink");
  same(base[mode]["--paper"], papers.cream.paper[mode], "--paper");
  same(base[mode]["--pen-red"], papers.cream.red[mode], "--pen-red");
}

type Vars = Record<string, string>;
const token = (name: string) => (v: Vars) => parseColor(v[name] ?? `var(${name})`, v);
const checks: { what: string; min: number; fg: (v: Vars) => Rgb; bg: (v: Vars) => Rgb }[] = [
  { what: "ink (text)", min: 4.5, fg: token("--ink"), bg: token("--paper") },
  { what: "ink-2 (text)", min: 4.5, fg: token("--ink-2"), bg: token("--paper") },
  { what: "ink-3 (muted text)", min: 4.5, fg: token("--ink-3"), bg: token("--paper") },
  { what: "pen-red (error text)", min: 4.5, fg: token("--pen-red"), bg: token("--paper") },
  { what: "ink-line (control boundary)", min: 3, fg: token("--ink-line"), bg: token("--paper") },
  {
    // The thinnest the shading gets: the fill alone, between pen strokes.
    what: "paper label on solid fill",
    min: 4.5,
    fg: token("--paper"),
    bg: (v) => over(parseColor(v["--ink"], v), Number(v["--ink-fill"]), parseColor(v["--paper"], v)),
  },
];

export function varsFor(pen: PenTheme, paper: PaperTheme, mode: "light" | "dark"): Vars {
  return {
    ...base[mode],
    "--ink": pen.ink[mode],
    "--paper": paper.paper[mode],
    "--pen-red": paper.red[mode],
    ...(pen.fill ? { "--ink-fill": String(pen.fill[mode]) } : {}),
  };
}

const quiet = process.argv.includes("--quiet");
let failed = 0;
for (const [penName, pen] of Object.entries(pens)) {
  for (const [paperName, paper] of Object.entries(papers)) {
    for (const mode of ["light", "dark"] as const) {
      const vars = varsFor(pen, paper, mode);
      const results = checks.map((c) => ({ ...c, ratio: contrast(c.fg(vars), c.bg(vars)) }));
      const bad = results.filter((r) => r.ratio < r.min);
      failed += bad.length;
      if (quiet && !bad.length) continue;
      const label = `${penName} on ${paperName} (${mode})`.padEnd(30);
      const lowest = results.reduce((a, b) => (a.ratio / a.min < b.ratio / b.min ? a : b));
      console.log(
        bad.length
          ? `✘ ${label} ${bad.map((b) => `${b.what} ${b.ratio.toFixed(2)} < ${b.min}`).join("; ")}`
          : `✔ ${label} tightest: ${lowest.what} ${lowest.ratio.toFixed(2)} ≥ ${lowest.min}`,
      );
    }
  }
}
if (failed) {
  console.error(`\n${failed} contrast check${failed === 1 ? "" : "s"} failed.`);
  process.exit(1);
}
