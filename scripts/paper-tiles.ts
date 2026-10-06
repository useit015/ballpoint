// Writes a paper texture for every paper in registry/themes.ts, by day and
// by night, to public/paper/<name>-<mode>.svg: a seamless 600px tile of soft
// crinkle relief and fine grain that averages out to that paper's colour, so
// text contrast on it is the contrast checked against --paper. The docs site
// paints the page with one (--paper-tile), and the customizer's preview and
// swatches swap in the one for the paper picked.

import { mkdirSync, writeFileSync } from "node:fs";
import { parseColor } from "../lib/color.ts";
import { papers } from "../registry/themes.ts";

const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const n = (x: number) => +x.toFixed(4);

// The relief's lighting averages 0.8; the slope is how deep the crinkles
// look. Night paper wants shallower relief and fainter grain.
const relief = { light: { slope: 0.3, grain: 0.06 }, dark: { slope: 0.21, grain: 0.04 } };

function tile(paper: string, mode: "light" | "dark") {
  const rgb = parseColor(paper).map(toGamma);
  const { slope, grain } = relief[mode];
  const funcs = ["R", "G", "B"].map((ch, i) => `<feFunc${ch} type='linear' slope='${slope}' intercept='${n(rgb[i] - slope * 0.8)}'/>`).join("");
  // Grain is the paper's own colour, much darker, so it never tints the sheet.
  const dark = rgb.map((c) => n(c * 0.38));
  return `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
<filter id='p' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>
<feTurbulence type='fractalNoise' baseFrequency='.007' numOctaves='4' seed='3' stitchTiles='stitch' result='n'/>
<feDiffuseLighting in='n' lighting-color='#fff' surfaceScale='5.5' diffuseConstant='1' result='l'><feDistantLight azimuth='225' elevation='55'/></feDiffuseLighting>
<feComponentTransfer>${funcs}<feFuncA type='linear' slope='0' intercept='1'/></feComponentTransfer>
</filter>
<filter id='t' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${dark[0]} 0 0 0 0 ${dark[1]} 0 0 0 0 ${dark[2]} 0 0 0 ${grain} ${n(-grain * 0.3)}'/></filter>
<rect width='100%' height='100%' filter='url(#p)'/><rect width='100%' height='100%' filter='url(#t)'/>
</svg>
`;
}

const dir = new URL("../public/paper/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const [name, paper] of Object.entries(papers)) {
  for (const mode of ["light", "dark"] as const) writeFileSync(new URL(`${name}-${mode}.svg`, dir), tile(paper.paper[mode], mode));
}
console.log(`public/paper: ${Object.keys(papers).length * 2} tiles`);
