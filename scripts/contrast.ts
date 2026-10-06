// Fails if any ink token misses its WCAG contrast ratio against the paper,
// in either theme. Tokens are read from registry/ballpoint/styles/base.css
// and resolved the way the browser does: var() chains, color-mix() in
// oklab, and opacity composited over the paper in sRGB.

import { readFileSync } from "node:fs";
import postcss from "postcss";

type Rgb = [number, number, number]; // linear sRGB, 0…1
type Lab = [number, number, number];

// ─── Colour maths (CSS Color 4) ─────────────────────────────────────────
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp01 = (c: number) => Math.min(1, Math.max(0, c));

function oklabToLinear([L, a, b]: Lab): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function linearToOklab([r, g, b]: Rgb): Lab {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

const luminance = ([r, g, b]: Rgb) => 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b);
const ratio = (a: Rgb, b: Rgb) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Paint `top` at `alpha` over `under`, blended in gamma-encoded sRGB as browsers do. */
const over = (top: Rgb, alpha: number, under: Rgb): Rgb =>
  top.map((c, i) => toLinear(alpha * toGamma(clamp01(c)) + (1 - alpha) * toGamma(clamp01(under[i])))) as Rgb;

// ─── Token resolution ───────────────────────────────────────────────────
const css = postcss.parse(readFileSync(new URL("../registry/ballpoint/styles/base.css", import.meta.url), "utf8"));

function declsFor(selector: string) {
  const out: Record<string, string> = {};
  css.each((node) => {
    if (node.type === "rule" && node.selector === selector) node.walkDecls((d) => {
        out[d.prop] = d.value;
      });
  });
  return out;
}

function parseColor(value: string, vars: Record<string, string>): Rgb {
  value = value.trim();
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  if (ref) return resolve(ref[1], vars);
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    return [0, 2, 4].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255)) as Rgb;
  }
  const oklch = value.match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/);
  if (oklch) {
    const [L, C, h] = oklch.slice(1).map(Number);
    return oklabToLinear([L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)]);
  }
  const mix = value.match(/^color-mix\(in oklab,\s*(.+?)\s+([\d.]+)%,\s*(.+)\)$/);
  if (mix) {
    const p = Number(mix[2]) / 100;
    const a = linearToOklab(parseColor(mix[1], vars));
    const b = linearToOklab(parseColor(mix[3], vars));
    return oklabToLinear(a.map((v, i) => v * p + b[i] * (1 - p)) as Lab);
  }
  throw new Error(`Can't read colour: ${value}`);
}

function resolve(name: string, vars: Record<string, string>): Rgb {
  const value = vars[name];
  if (value === undefined) throw new Error(`Unknown token ${name}`);
  return parseColor(value, vars);
}

// ─── Checks ─────────────────────────────────────────────────────────────
type Check = { what: string; min: number; fg: (v: Record<string, string>) => Rgb; bg: (v: Record<string, string>) => Rgb };
const token = (name: string) => (v: Record<string, string>) => resolve(name, v);

const checks: Check[] = [
  { what: "ink (text)", min: 4.5, fg: token("--ink"), bg: token("--paper") },
  { what: "ink-2 (text)", min: 4.5, fg: token("--ink-2"), bg: token("--paper") },
  { what: "ink-3 (muted text)", min: 4.5, fg: token("--ink-3"), bg: token("--paper") },
  { what: "pen-red (error text)", min: 4.5, fg: token("--pen-red"), bg: token("--paper") },
  { what: "ink-line (control boundary, 1.4.11)", min: 3, fg: token("--ink-line"), bg: token("--paper") },
  { what: "ring (focus indicator)", min: 3, fg: token("--ring"), bg: token("--paper") },
  {
    // The thinnest the shading gets: the fill alone, between pen strokes.
    what: "paper label on solid fill (--ink-fill)",
    min: 4.5,
    fg: token("--paper"),
    bg: (v) => over(resolve("--ink", v), Number(v["--ink-fill"]), resolve("--paper", v)),
  },
];

const light = declsFor(":root");
const themes = { light, dark: { ...light, ...declsFor(".dark") } };

// --quiet: only report failures (used by registry:build).
const quiet = process.argv.includes("--quiet");
let failed = 0;
for (const [theme, vars] of Object.entries(themes)) {
  for (const check of checks) {
    const r = ratio(check.fg(vars), check.bg(vars));
    const ok = r >= check.min;
    if (!ok) failed++;
    if (quiet && ok) continue;
    console.log(`${ok ? "✔" : "✘"} ${theme.padEnd(5)} ${check.what.padEnd(42)} ${r.toFixed(2).padStart(5)} ≥ ${check.min}`);
  }
}
if (failed) {
  console.error(`\n${failed} contrast check${failed === 1 ? "" : "s"} failed.`);
  process.exit(1);
}
