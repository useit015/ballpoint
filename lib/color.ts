// Colour maths for the contrast gate (scripts/contrast.ts) and the
// customizer's live readout: CSS Color 4 conversions, color-mix() in oklab,
// opacity composited the way browsers do, and WCAG contrast.

export type Rgb = [number, number, number]; // linear sRGB, 0…1
type Lab = [number, number, number];

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

/** WCAG 2 contrast ratio between two colours. */
export function contrast(a: Rgb, b: Rgb) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Paint `top` at `alpha` over `under`, blended in gamma-encoded sRGB as browsers do. */
export const over = (top: Rgb, alpha: number, under: Rgb): Rgb =>
  top.map((c, i) => toLinear(alpha * toGamma(clamp01(c)) + (1 - alpha) * toGamma(clamp01(under[i])))) as Rgb;

/** color-mix(in oklab, a p%, b), p in 0…1. */
export function mix(a: Rgb, p: number, b: Rgb): Rgb {
  const x = linearToOklab(a);
  const y = linearToOklab(b);
  return oklabToLinear(x.map((v, i) => v * p + y[i] * (1 - p)) as Lab);
}

/**
 * Read a colour the way base.css writes them: #hex, oklch(L C H),
 * color-mix(in oklab, A p%, B), or var(--x) looked up in `vars`.
 */
export function parseColor(value: string, vars: Record<string, string> = {}): Rgb {
  value = value.trim();
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  if (ref) {
    if (vars[ref[1]] === undefined) throw new Error(`Unknown token ${ref[1]}`);
    return parseColor(vars[ref[1]], vars);
  }
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    return [0, 2, 4].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255)) as Rgb;
  }
  const oklch = value.match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/);
  if (oklch) {
    const [L, C, h] = oklch.slice(1).map(Number);
    return oklabToLinear([L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)]);
  }
  const m = value.match(/^color-mix\(in oklab,\s*(.+?)\s+([\d.]+)%,\s*(.+)\)$/);
  if (m) return mix(parseColor(m[1], vars), Number(m[2]) / 100, parseColor(m[3], vars));
  throw new Error(`Can't read colour: ${value}`);
}

/** An oklch() string, rounded the way it would be written by hand. */
export const oklch = (L: number, C: number, H: number) => `oklch(${+L.toFixed(3)} ${+C.toFixed(3)} ${+H.toFixed(1)})`;
