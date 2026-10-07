// Writes a paper texture for every paper in registry/themes.ts, by day and
// by night, to public/paper/<name>-<mode>.svg: a seamless 600px tile that
// looks like a sheet of real paper up close, and averages out to exactly
// that paper's colour, so text contrast on it is the contrast checked
// against --paper. The docs site paints the page with one (--paper-tile),
// and the customizer and the Pens and papers page swap in the one for the
// paper shown.
//
// The page is the portfolio's sheet: noise lit like paper under a window
// (feDiffuseLighting), so it carries a soft, crinkled relief and a fine
// speckled tooth, and stays its own hue. The docs' slips (code and examples)
// are card stock laid on it: a finer, stronger crinkle, and the odd fibre
// lying on the surface, mostly lighter than the sheet, a few darker.

import { mkdirSync, writeFileSync } from "node:fs";
import { mix, parseColor, type Rgb } from "../lib/color.ts";
import { papers } from "../registry/themes.ts";

const SIZE = 600;
// The mean of the lighting below, measured by rendering the filter in Chrome
// (one value per grain); the colour map is centred on it so the tile
// averages to the paper.
const MEAN_L = { page: 0.8175, slip: 0.8181 };

const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const n = (x: number) => +x.toFixed(4);
const hex = (c: number[]) => `#${c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("")}`;

/** A seeded generator, so the tiles are the same on every build. */
function rng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
}

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

type Grain = "page" | "slip";

const grains = {
  // baseFrequency, surfaceScale, how far the light moves the colour (by day, at night).
  page: { freq: ".007", relief: 5.5, day: 0.3, night: 0.21 },
  slip: { freq: ".012", relief: 2.8, day: 0.5, night: 0.34 },
} as const;

function tile(paper: string | Rgb, mode: "light" | "dark", kind: Grain = "page") {
  const rgb = (typeof paper === "string" ? parseColor(paper) : paper).map(toGamma);
  const g = grains[kind];
  // How far L moves the colour: the same amount on every channel, so the
  // sheet stays its own hue. The offset puts the tile's mean back on the paper.
  const slope = mode === "dark" ? g.night : g.day;
  const funcs = ["R", "G", "B"]
    .map((ch, i) => `<feFunc${ch} type='linear' slope='${slope}' intercept='${n(rgb[i] - slope * MEAN_L[kind])}'/>`)
    .join("");
  // The tooth: fine speckle, a touch of warm grey.
  const tooth = mode === "dark" ? "0.030 -0.009" : "0.060 -0.018";
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}'>
<filter id='p' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>
<feTurbulence type='fractalNoise' baseFrequency='${g.freq}' numOctaves='4' seed='3' stitchTiles='stitch' result='n'/>
<feDiffuseLighting in='n' lighting-color='#fff' surfaceScale='${g.relief}' diffuseConstant='1' result='l'><feDistantLight azimuth='225' elevation='55'/></feDiffuseLighting>
<feComponentTransfer>${funcs}<feFuncA type='linear' slope='0' intercept='1'/></feComponentTransfer>
</filter>
<filter id='t' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .22 0 0 0 ${tooth}'/></filter>
<rect width='100%' height='100%' filter='url(#p)'/><rect width='100%' height='100%' filter='url(#t)'/>${kind === "slip" ? fibres(rgb, mode) : ""}
</svg>
`;
}

// The docs' slips (code and examples): cream a shade lighter than the page.
// Keep in step with --slip in app/globals.css (the same mixes, in oklab).
const white = parseColor("#ffffff");
const ink = { light: parseColor("oklch(0.4 0.185 267)"), dark: parseColor("oklch(0.9 0.045 258)") };
const slip = {
  light: mix(parseColor(papers.cream.paper.light), 0.8, white),
  dark: mix(parseColor(papers.cream.paper.dark), 0.94, ink.dark),
};

const dir = new URL("../public/paper/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const [name, paper] of Object.entries(papers)) {
  for (const mode of ["light", "dark"] as const) writeFileSync(new URL(`${name}-${mode}.svg`, dir), tile(paper.paper[mode], mode));
}
for (const mode of ["light", "dark"] as const) writeFileSync(new URL(`slip-${mode}.svg`, dir), tile(slip[mode], mode, "slip"));
console.log(`public/paper: ${Object.keys(papers).length * 2 + 2} tiles`);
