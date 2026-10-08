// Writes the paper textures for every paper in registry/themes.ts, by day and
// by night: seamless tiles that look like a sheet of real paper up close, and
// average out to exactly that paper's colour, so text contrast on it is the
// contrast checked against --paper. The docs site paints the page with one
// (--paper-tile, in app/globals.css), and the customizer and the Pens and
// papers page swap in the one for the paper shown.
//
// The page is the portfolio's sheet: noise lit like paper under a window
// (feDiffuseLighting), so it carries a soft, crinkled relief and a fine
// speckled tooth, and stays its own hue. The docs' slips (code and examples)
// are card stock laid on it: a finer, stronger crinkle, and the odd fibre
// lying on the surface, mostly lighter than the sheet, a few darker.
//
// Each texture is three layers, painted over each other (--paper-tile-size):
// - public/paper/<name>-<mode>.png, the relief: a 600px tile of the lit noise.
//   It's drawn by an SVG filter, but kept as the picture Chrome paints from it:
//   on a phone the filter costs a few hundred ms of raster for every tile and
//   every scale, where the PNG (a few dozen colours, indexed) is a quick
//   decode. It records the SVG it was painted from; when that changes, this
//   script paints it again in Chrome (CHROME_PATH, or the installed Chrome),
//   and fails without one, so a stale relief never ships.
// - public/paper/tooth-<mode>.svg, the tooth: a small seamless tile of fine
//   speckle, cheap to paint and sharp at any pixel density.
// - public/paper/slip-fibres-<mode>.svg, the slips' fibres.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mix, parseColor, type Rgb } from "../lib/color.ts";
import { papers } from "../registry/themes.ts";
import { encodePng, readPngText } from "./png.ts";

const SIZE = 600;
// The tooth's tile. Keep in step with --paper-tile-size in app/globals.css.
const TOOTH = 128;
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
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}'>
<g id='f' fill='none' stroke-linecap='round'>${paths.join("")}</g>${repeats}
</svg>
`;
}

type Grain = "page" | "slip";

const grains = {
  // baseFrequency, surfaceScale, how far the light moves the colour (by day, at night).
  page: { freq: ".007", relief: 5.5, day: 0.3, night: 0.21 },
  slip: { freq: ".012", relief: 2.8, day: 0.5, night: 0.34 },
} as const;

/** The relief: noise lit like paper, mapped onto the paper's colour. */
function relief(rgb: number[], mode: "light" | "dark", kind: Grain) {
  const g = grains[kind];
  // How far L moves the colour: the same amount on every channel, so the
  // sheet stays its own hue. The offset puts the tile's mean back on the paper.
  const slope = mode === "dark" ? g.night : g.day;
  const funcs = ["R", "G", "B"]
    .map((ch, i) => `<feFunc${ch} type='linear' slope='${slope}' intercept='${n(rgb[i] - slope * MEAN_L[kind])}'/>`)
    .join("");
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}'>
<filter id='p' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>
<feTurbulence type='fractalNoise' baseFrequency='${g.freq}' numOctaves='4' seed='3' stitchTiles='stitch' result='n'/>
<feDiffuseLighting in='n' lighting-color='#fff' surfaceScale='${g.relief}' diffuseConstant='1' result='l'><feDistantLight azimuth='225' elevation='55'/></feDiffuseLighting>
<feComponentTransfer>${funcs}<feFuncA type='linear' slope='0' intercept='1'/></feComponentTransfer>
</filter>
<rect width='100%' height='100%' filter='url(#p)'/>
</svg>
`;
}

/** The tooth: fine speckle, a touch of warm grey. */
function tooth(mode: "light" | "dark") {
  const alpha = mode === "dark" ? "0.030 -0.009" : "0.060 -0.018";
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${TOOTH}' height='${TOOTH}'>
<filter id='t' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .22 0 0 0 ${alpha}'/></filter>
<rect width='100%' height='100%' filter='url(#t)'/>
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
const gamma = (paper: string | Rgb) => (typeof paper === "string" ? parseColor(paper) : paper).map(toGamma);

const dir = new URL("../public/paper/", import.meta.url);
mkdirSync(dir, { recursive: true });

const reliefs: { file: URL; svg: string }[] = [];
for (const [name, paper] of Object.entries(papers)) {
  for (const mode of ["light", "dark"] as const) reliefs.push({ file: new URL(`${name}-${mode}.png`, dir), svg: relief(gamma(paper.paper[mode]), mode, "page") });
}
for (const mode of ["light", "dark"] as const) {
  reliefs.push({ file: new URL(`slip-${mode}.png`, dir), svg: relief(gamma(slip[mode]), mode, "slip") });
  writeFileSync(new URL(`tooth-${mode}.svg`, dir), tooth(mode));
  writeFileSync(new URL(`slip-fibres-${mode}.svg`, dir), fibres(gamma(slip[mode]), mode));
}

// What a relief was painted from: its SVG, and the size it was painted at.
const source = (svg: string) => createHash("sha256").update(`${SIZE}px\n${svg}`).digest("hex").slice(0, 32);
const stale = reliefs.filter(({ file, svg }) => !existsSync(file) || readPngText(readFileSync(file)).Source !== source(svg));
if (stale.length) await paint(stale);
console.log(`public/paper: ${reliefs.length} reliefs${stale.length ? ` (${stale.length} painted)` : ""}, 2 tooth tiles, 2 fibre tiles`);

/** Paints reliefs in Chrome, the way the page would, and saves them as PNGs. */
async function paint(list: typeof reliefs) {
  const names = list.map(({ file }) => file.pathname.split("/").pop()).join(", ");
  let browser;
  try {
    const { chromium } = await import("@playwright/test");
    browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" });
  } catch (error) {
    throw new Error(
      `public/paper: ${names} no longer match scripts/paper-tiles.ts, and there's no Chrome here to paint them again. ` +
        `Run \`pnpm paper\` where Chrome is installed (or with CHROME_PATH set) and commit the PNGs.`,
      { cause: error },
    );
  }
  try {
    const page = await browser.newPage();
    for (const { file, svg } of list) {
      const b64 = await page.evaluate(
        async ({ svg, size }) => {
          const img = new Image();
          img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
          await img.decode();
          const canvas = new OffscreenCanvas(size, size);
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, size, size);
          const px = ctx.getImageData(0, 0, size, size).data;
          let s = "";
          for (let i = 0; i < px.length; i += 0x8000) s += String.fromCharCode(...px.subarray(i, i + 0x8000));
          return btoa(s);
        },
        { svg, size: SIZE },
      );
      writeFileSync(file, encodePng(SIZE, SIZE, Buffer.from(b64, "base64"), { Source: source(svg), Software: "scripts/paper-tiles.ts" }));
    }
  } finally {
    await browser.close();
  }
}
