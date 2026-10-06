// Writes a paper texture for every paper in registry/themes.ts, by day and
// by night, to public/paper/<name>-<mode>.svg: a seamless 600px tile that
// looks like a sheet of real paper up close, and averages out to exactly
// that paper's colour, so text contrast on it is the contrast checked
// against --paper. The docs site paints the page with one (--paper-tile),
// and the customizer and the Pens and papers page swap in the one for the
// paper shown.
//
// Real paper, at screen scale, is nearly flat. What gives it away is:
//   formation  soft cloudiness a few millimetres across, where the pulp
//              settled thicker or thinner
//   tooth      a fine surface roughness catching the light
//   fibres     the odd fibre lying on the surface, mostly lighter than the
//              sheet, a few darker
// The first two are one noise L, mapped onto the paper's colour so the
// sheet stays its own hue; fibres are drawn on top.

import { mkdirSync, writeFileSync } from "node:fs";
import { mix, parseColor, type Rgb } from "../lib/color.ts";
import { papers } from "../registry/themes.ts";

const SIZE = 600;
// The mean of L below, measured by rendering the filter in Chrome; the
// colour map is centred on it so the tile averages to the paper.
const MEAN_L = 0.5964;

const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const n = (x: number) => +x.toFixed(4);
const hex = (c: number[]) => `#${c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("")}`;

/** A seeded generator, so the tiles are the same on every build. */
function rng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const broadcastR = "1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1";

function fibres(rgb: number[], mode: "light" | "dark") {
  const r = rng(11);
  const shade = hex(rgb.map((c) => c * (mode === "dark" ? 0.55 : 0.7)));
  const glint = hex(rgb.map((c) => c + (1 - c) * (mode === "dark" ? 0.16 : 0.85)));
  const count = mode === "dark" ? 28 : 40;
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = r() * SIZE;
    const y = r() * SIZE;
    const a = r() * Math.PI;
    const len = 4 + r() ** 2 * 22;
    const x1 = x + Math.cos(a) * len;
    const y1 = y + Math.sin(a) * len;
    const bend = (r() - 0.5) * len * 0.6;
    const cx = (x + x1) / 2 - Math.sin(a) * bend;
    const cy = (y + y1) / 2 + Math.cos(a) * bend;
    const light = r() < 0.55;
    const opacity = light ? (mode === "dark" ? 0.18 : 0.35) + r() * 0.25 : 0.1 + r() * 0.1;
    paths.push(
      `<path d='M${n(x)} ${n(y)}Q${n(cx)} ${n(cy)} ${n(x1)} ${n(y1)}' stroke='${light ? glint : shade}' stroke-width='${n(0.35 + r() * 0.4)}' opacity='${n(opacity)}'/>`,
    );
  }
  // Drawn again on every side, so fibres crossing an edge carry on into the next tile.
  const repeats = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]
    .map(([dx, dy]) => `<use href='#f' x='${dx * SIZE}' y='${dy * SIZE}'/>`)
    .join("");
  return `<g id='f' fill='none' stroke-linecap='round'>${paths.join("")}</g>${repeats}`;
}

function tile(paper: string | Rgb, mode: "light" | "dark") {
  const rgb = (typeof paper === "string" ? parseColor(paper) : paper).map(toGamma);
  // How far L moves the colour: proportional to the paper by day (a lighter
  // or darker patch of the same paper), a small fixed amount at night, where
  // proportional would vanish into the navy.
  const scale = rgb.map((c) => (mode === "dark" ? 0.027 : 0.085 * c));
  const offset = rgb.map((c, i) => c - scale[i] * MEAN_L);
  const rows = rgb.map((_, i) => `${n(scale[i])} 0 0 0 ${n(offset[i])}`).join(" ");
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}'>
<filter id='p' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>
<feTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='4' seed='4' stitchTiles='stitch' result='a'/><feColorMatrix in='a' values='${broadcastR}' result='formation'/>
<feTurbulence type='fractalNoise' baseFrequency='1.25' numOctaves='2' seed='9' stitchTiles='stitch' result='b'/><feColorMatrix in='b' values='${broadcastR}' result='grain'/>
<feComposite in='formation' in2='grain' operator='arithmetic' k1='0' k2='0.5' k3='0.5' k4='0' result='sheet'/>
<feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='2' stitchTiles='stitch' result='c'/><feDiffuseLighting in='c' lighting-color='#fff' surfaceScale='1.2' diffuseConstant='1' result='d'><feDistantLight azimuth='225' elevation='62'/></feDiffuseLighting><feColorMatrix in='d' values='${broadcastR}' result='tooth'/>
<feComposite in='sheet' in2='tooth' operator='arithmetic' k1='0' k2='0.74' k3='0.26' k4='0' result='L'/>
<feColorMatrix in='L' values='${rows} 0 0 0 0 1'/>
</filter>
<rect width='100%' height='100%' filter='url(#p)'/>${fibres(rgb, mode)}
</svg>
`;
}

// The docs' code slips: a lighter sheet laid on the cream page. Keep in step
// with --code-slip in app/globals.css (the same mixes, in oklab).
const white = parseColor("#ffffff");
const ink = { light: parseColor("oklch(0.4 0.185 267)"), dark: parseColor("oklch(0.9 0.045 258)") };
const slip = {
  light: mix(parseColor(papers.cream.paper.light), 0.55, white),
  dark: mix(parseColor(papers.cream.paper.dark), 0.9, ink.dark),
};

const dir = new URL("../public/paper/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const [name, paper] of Object.entries(papers)) {
  for (const mode of ["light", "dark"] as const) writeFileSync(new URL(`${name}-${mode}.svg`, dir), tile(paper.paper[mode], mode));
}
for (const mode of ["light", "dark"] as const) writeFileSync(new URL(`slip-${mode}.svg`, dir), tile(slip[mode], mode));
console.log(`public/paper: ${Object.keys(papers).length * 2 + 2} tiles`);
