import type { ComponentProps, CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { createRng, hashSeed } from "@/registry/ballpoint/lib/ink-sketch";

// A sheet of paper: the paper colour with a texture laid over it that
// works on any paper (cream, white, legal pad, navy at night), printed
// rules, the marks a sheet picks up on a desk, and the way it lies there:
// torn from a pad or dog-eared, taped down, a little askew. Server-safe; no JS.

const SIZE = 600;
// The mean of the noise below, measured in Chrome: the grain lightens above
// it and darkens below, so the sheet keeps its colour on average.
const MEAN = 0.5964;
const n = (x: number) => +x.toFixed(3);

/**
 * The texture, as a tile of faint black and white specks over the paper:
 * formation (soft cloudiness where the pulp settled thicker or thinner), a
 * fine tooth catching the light, and the odd fibre lying in the surface.
 */
function grainTile() {
  const r = createRng(hashSeed("paper-grain"));
  const k = 0.13;
  const fibres: string[] = [];
  for (let i = 0; i < 36; i++) {
    const x = r() * SIZE;
    const y = r() * SIZE;
    const a = r() * Math.PI;
    const len = 4 + r() ** 2 * 22;
    const x1 = x + Math.cos(a) * len;
    const y1 = y + Math.sin(a) * len;
    const bend = (r() - 0.5) * len * 0.6;
    const cx = (x + x1) / 2 - Math.sin(a) * bend;
    const cy = (y + y1) / 2 + Math.cos(a) * bend;
    // Dark only: a pale fibre is lost on cream, and reads as a scratch on navy.
    fibres.push(`<path d='M${n(x)} ${n(y)}Q${n(cx)} ${n(cy)} ${n(x1)} ${n(y1)}' stroke='#000' stroke-width='${n(0.35 + r() * 0.4)}' opacity='${n(0.05 + r() * 0.07)}'/>`);
  }
  // Fibres crossing an edge carry on into the next tile.
  const repeats = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]].map(([dx, dy]) => `<use href='#f' x='${dx * SIZE}' y='${dy * SIZE}'/>`).join("");
  const broadcast = "1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}'><filter id='p' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='4' seed='4' stitchTiles='stitch' result='a'/><feColorMatrix in='a' values='${broadcast}' result='formation'/><feTurbulence type='fractalNoise' baseFrequency='1.25' numOctaves='2' seed='9' stitchTiles='stitch' result='b'/><feColorMatrix in='b' values='${broadcast}' result='grain'/><feComposite in='formation' in2='grain' operator='arithmetic' k2='0.5' k3='0.5' result='sheet'/><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='2' stitchTiles='stitch' result='c'/><feDiffuseLighting in='c' lighting-color='#fff' surfaceScale='1.2' diffuseConstant='1' result='d'><feDistantLight azimuth='225' elevation='62'/></feDiffuseLighting><feColorMatrix in='d' values='${broadcast}' result='tooth'/><feComposite in='sheet' in2='tooth' operator='arithmetic' k2='0.74' k3='0.26' result='L'/><feColorMatrix in='L' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${-k} 0 0 0 ${n(k * MEAN)}' result='dark'/><feColorMatrix in='L' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 ${k} 0 0 0 ${n(-k * MEAN)}' result='light'/><feMerge><feMergeNode in='dark'/><feMergeNode in='light'/></feMerge></filter><rect width='100%' height='100%' filter='url(#p)'/><g id='f' fill='none' stroke-linecap='round'>${fibres.join("")}</g>${repeats}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// A coffee ring where a cup was set down, its tide line darker, a second
// rim where it was set down again, and a few drips.
const ring = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><filter id='w' x='-15%' y='-15%' width='130%' height='130%'><feTurbulence type='fractalNoise' baseFrequency='.012' numOctaves='1' seed='8' result='lo'/><feDisplacementMap in='SourceGraphic' in2='lo' scale='5' xChannelSelector='R' yChannelSelector='G' result='d'/><feTurbulence type='fractalNoise' baseFrequency='.09' numOctaves='2' seed='3' result='hi'/><feDisplacementMap in='d' in2='hi' scale='3.5' xChannelSelector='R' yChannelSelector='G'/></filter><filter id='m' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.045' numOctaves='3' seed='5' result='n'/><feColorMatrix in='n' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.6 -.35' result='a'/><feComposite in='SourceGraphic' in2='a' operator='in'/></filter><radialGradient id='g'><stop offset='.5' stop-opacity='.04'/><stop offset='.88' stop-opacity='.11'/><stop offset='.97' stop-opacity='.2'/><stop offset='1' stop-opacity='0'/></radialGradient></defs><g filter='url(#w)'><g filter='url(#m)'><circle cx='196' cy='204' r='132' fill='url(#g)'/></g><circle cx='196' cy='204' r='131' fill='none' stroke='#000' stroke-opacity='.42' stroke-width='2.2'/><circle cx='196' cy='204' r='127' fill='none' stroke='#000' stroke-opacity='.12' stroke-width='7'/><circle cx='218' cy='188' r='129' fill='none' stroke='#000' stroke-opacity='.26' stroke-width='1.8' stroke-dasharray='300 60 180 90 120 900' stroke-dashoffset='40'/></g><circle cx='338' cy='92' r='5' fill-opacity='.22' filter='url(#w)'/><circle cx='352' cy='78' r='2.4' fill-opacity='.2' filter='url(#w)'/><circle cx='70' cy='330' r='3' fill-opacity='.16' filter='url(#w)'/><circle cx='326' cy='110' r='1.6' fill-opacity='.18' filter='url(#w)'/></svg>`;

// Age spots (foxing): small rust-brown flecks, a few with a faint halo.
function foxing() {
  const r = createRng(hashSeed("paper-foxing"));
  const spots: string[] = [];
  for (let i = 0; i < 14; i++) {
    const [x, y] = [Math.round(r() * 900), Math.round(r() * 1300)];
    const size = [0.8, 1.2, 1.6, 2.2, 3.2][Math.floor(r() * 5)];
    spots.push(`<circle cx='${x}' cy='${y}' r='${size}' fill-opacity='${n(0.12 + r() * 0.18)}'/>`);
    if (size > 2) spots.push(`<circle cx='${x}' cy='${y}' r='${n(size * 2.6)}' fill-opacity='.05'/>`);
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='1300'><filter id='w'><feTurbulence type='fractalNoise' baseFrequency='.3' numOctaves='2' seed='2'/><feDisplacementMap in='SourceGraphic' scale='3'/></filter><g filter='url(#w)'>${spots.join("")}</g></svg>`;
}

const url = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const grain = grainTile();
const ringMask = url(ring);
const foxingMask = url(foxing());

// Printed rules, in the ink at low strength so they follow the pen theme.
const rule = "color-mix(in oklab, var(--ink) 22%, transparent)";
const square = "color-mix(in oklab, var(--ink) 15%, transparent)";
// Rules sit --paper-rule-offset down, so text in the sheet's line height
// writes on them (just under the baseline, descenders crossing).
const across = (color: string) =>
  `repeating-linear-gradient(to bottom, transparent 0 calc(var(--paper-rule) - 1px), ${color} calc(var(--paper-rule) - 1px) var(--paper-rule)) 0 var(--paper-rule-offset)`;
const lines = {
  plain: [],
  ruled: [across(rule)],
  grid: [across(square), `repeating-linear-gradient(to right, transparent 0 calc(var(--paper-rule) - 1px), ${square} calc(var(--paper-rule) - 1px) var(--paper-rule))`],
  dots: [`radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--ink) 34%, transparent) 1px, transparent 1.5px) 0 0 / var(--paper-rule) var(--paper-rule)`],
} as const;

type Variant = keyof typeof lines;
type Edge = "straight" | "torn" | "dog-ear";

/** The depth of a tear at each step along an edge, in px: slow swells and fine jags, the way paper tears. */
function tear(r: () => number, steps: number, depth: number) {
  const p1 = r() * 6;
  const p2 = r() * 6;
  return Array.from({ length: steps + 1 }, (_, i) => Math.max(0.4, depth * (0.55 + Math.sin(i * 0.31 + p1) * 0.45 + Math.sin(i * 0.83 + p2) * 0.3 + (r() - 0.5) * 0.72)));
}

/**
 * A clip-path for a torn sheet: along each edge a point is a percentage of its
 * length, across it a few px, so the tear is as deep on a phone as on a wide
 * screen. Seeded, so a sheet tears the same way on the server and in the browser.
 */
function tornOutline(seed: string | number) {
  const r = createRng(hashSeed(`torn-${seed}`));
  const [top, right, bottom, left] = [tear(r, 70, 6), tear(r, 42, 4.5), tear(r, 70, 7), tear(r, 42, 4.5)];
  const f = (v: number) => Math.round(v * 10) / 10;
  const pts = [
    ...top.map((d, i) => `${f((i / 70) * 100)}% ${f(d)}px`),
    ...right.map((d, i) => `calc(100% - ${f(d)}px) ${f((i / 42) * 100)}%`),
    ...bottom.map((d, i) => `${f(100 - (i / 70) * 100)}% calc(100% - ${f(d)}px)`),
    ...left.map((d, i) => `${f(d)}px ${f(100 - (i / 42) * 100)}%`),
  ];
  return `polygon(${pts.join(",")})`;
}

const DOG_EAR = "1.6rem";
const dogEar = `polygon(0 0, 100% 0, 100% calc(100% - ${DOG_EAR}), calc(100% - ${DOG_EAR}) 100%, 0 100%)`;

// Washi tape: a little see-through, with torn ends and faint stripes.
const tapeEnds = "polygon(0 0, 3% 20%, 0 42%, 3% 64%, 0 86%, 2% 100%, 100% 100%, 97% 80%, 100% 58%, 97% 36%, 100% 14%, 98% 0)";
const tapeStripes = "repeating-linear-gradient(115deg, oklch(1 0 0 / 0.16) 0 7px, transparent 7px 14px)";

/**
 * A sheet of paper to lay content on: textured, optionally ruled, squared
 * or dotted, and marked with coffee rings and age spots. It can be torn from
 * a pad or dog-eared (`edge`), taped down (`tape`) and set a little askew
 * (`tilt`). At night a desk lamp lights it a touch warmer near the top (`lamp`).
 *
 * Ruled lines are `--paper-rule` apart (2rem) and the sheet's line height
 * matches, so text writes on them; `--paper-rule-offset` moves them down
 * if you change the padding or the type size.
 */
function Paper({
  as: Tag = "div",
  variant = "plain",
  margin = false,
  texture = true,
  stains = 0,
  foxing: spotted = false,
  lamp = false,
  lifted = false,
  edge = "straight",
  tape = "none",
  tilt = 0,
  seed,
  className,
  style,
  children,
  ...props
}: ComponentProps<"div"> & {
  as?: "div" | "main" | "section" | "article" | "aside";
  /** Plain, ruled like a notebook, squared like graph paper, or dotted. */
  variant?: Variant;
  /** The red margin line down the left of a ruled sheet. */
  margin?: boolean;
  /** The paper's grain and fibres. */
  texture?: boolean;
  /** How many coffee rings (0–3). */
  stains?: number;
  /** Age spots scattered over the sheet. */
  foxing?: boolean;
  /** At night, a desk lamp warming the top of the sheet and falling off toward the edges. */
  lamp?: boolean;
  /** A soft shadow under the sheet, as if laid on the page. */
  lifted?: boolean;
  /** Cut square, torn from a pad, or with the bottom corner turned down. */
  edge?: Edge;
  /** A strip of washi tape across the top, or over a corner. */
  tape?: "none" | "top" | "corner";
  /** Degrees to turn the sheet, as if it were dropped there. */
  tilt?: number;
  /** Moves the coffee rings and the tear. */
  seed?: string | number;
}) {
  const r = createRng(hashSeed(seed ?? "paper"));
  const rings = Array.from({ length: Math.max(0, Math.min(3, stains)) }, (_, i) => {
    const size = 170 + r() * 90;
    return {
      top: `${12 + r() * 70}%`,
      left: i % 2 ? `${6 + r() * 14}%` : `${80 + r() * 14}%`,
      size,
      rotate: `${Math.round(r() * 360)}deg`,
      faint: i > 0,
    };
  });
  const ruled = variant === "ruled" || variant === "grid";
  const backgrounds = [...(texture ? [`${grain} 0 0 / ${SIZE}px ${SIZE}px`] : []), ...lines[variant]];
  if (margin) backgrounds.push(`linear-gradient(to right, transparent 0 var(--paper-margin), color-mix(in oklab, var(--pen-red) 45%, transparent) var(--paper-margin) calc(var(--paper-margin) + 1px), transparent calc(var(--paper-margin) + 1px)) 0 0 / 100% 100% no-repeat`);
  const shape = edge === "torn" ? tornOutline(seed ?? "paper") : edge === "dog-ear" ? dogEar : undefined;
  const cut = shape ? { clipPath: shape } : undefined;

  return (
    <Tag
      data-slot="paper"
      data-variant={variant}
      data-edge={edge}
      className={cn(
        "relative isolate p-6 text-foreground [--paper-margin:3rem] [--paper-rule-offset:1rem] [--paper-rule:2rem]",
        ruled && "leading-(--paper-rule)",
        edge === "torn" && "px-8 py-7",
        margin && "ps-[calc(var(--paper-margin)+1rem)]",
        className,
      )}
      style={{ ...(tilt ? { rotate: `${tilt}deg` } : null), ...style } as CSSProperties}
      {...props}
    >
      {/* The shadow follows the sheet's outline, so a torn edge casts a torn shadow. */}
      {lifted && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 [filter:drop-shadow(0_1px_1px_rgb(0_0_0/0.14))_drop-shadow(0_12px_14px_rgb(0_0_0/0.14))]">
          <span className={cn("block size-full bg-paper", !shape && "rounded-[2px]")} style={cut} />
        </span>
      )}
      {/* The paper itself: its colour and grain, its rules, and what it has picked up. */}
      <span
        aria-hidden="true"
        data-part="sheet"
        className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", !shape && "rounded-[2px]")}
        style={{ background: backgrounds.length ? `${backgrounds.join(", ")}, var(--paper)` : "var(--paper)", ...cut } as CSSProperties}
      >
        {rings.map((ring, i) => (
          <span
            key={i}
            className="absolute -translate-1/2 bg-(--stain)"
            style={{
              mixBlendMode: "var(--stain-blend)" as CSSProperties["mixBlendMode"],
              top: ring.top,
              left: ring.left,
              width: ring.size,
              height: ring.size,
              rotate: ring.rotate,
              opacity: `calc(var(--stain-strength) * ${ring.faint ? 0.55 : 1})`,
              mask: `${ringMask} center / contain no-repeat`,
            }}
          />
        ))}
        {spotted && (
          <span
            className="absolute inset-0 bg-(--stain)"
            style={{ mixBlendMode: "var(--stain-blend)" as CSSProperties["mixBlendMode"], opacity: "calc(var(--stain-strength) * 0.8)", mask: `${foxingMask} 0 0 / 900px 1300px repeat` }}
          />
        )}
        {lamp && <span className="absolute inset-0 bg-(image:--lamp)" />}
      </span>
      {/* The corner, turned down: the flap lies over the sheet, a shade darker, the back of the paper. */}
      {edge === "dog-ear" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 z-10"
          style={{ width: DOG_EAR, height: DOG_EAR, background: "linear-gradient(to bottom right, color-mix(in oklab, var(--paper) 84%, var(--ink)) 0 46%, color-mix(in oklab, var(--paper) 55%, var(--ink)) 50%, transparent 50%)", boxShadow: "-1px -1px 2px rgb(0 0 0 / 0.08)" }}
        />
      )}
      {tape !== "none" && (
        <span
          aria-hidden="true"
          data-part="tape"
          className={cn(
            "pointer-events-none absolute z-10 h-6 w-24 bg-[oklch(0.86_0.07_88/0.62)] shadow-[0_1px_2px_rgb(0_0_0/0.2)] dark:bg-[oklch(0.72_0.06_88/0.4)]",
            tape === "top" ? "-top-3 left-1/2 -translate-x-1/2 -rotate-3" : "-top-1 -left-7 w-28 -rotate-45",
          )}
          style={{ backgroundImage: tapeStripes, clipPath: tapeEnds }}
        />
      )}
      {children}
    </Tag>
  );
}

export { Paper };
