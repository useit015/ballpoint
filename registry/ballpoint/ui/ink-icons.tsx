import { GlyphSvg, glyphs, shiftPath, type Glyph, type GlyphProps } from "@/registry/ballpoint/lib/ink-glyphs";
import { dotStroke, handCurve, hashSeed, lineStroke, ringStroke, roundedBoxStroke, tickStroke } from "@/registry/ballpoint/lib/ink-sketch";

// Everyday UI icons drawn with the pen on a 16px grid, the same grid as
// the glyphs inside the components (all of which are here too). Every
// stroke is seeded by the icon's name, so an icon is the same drawing
// wherever it appears, on the server and in the browser.

type P = readonly [number, number];

const k = (id: string) => hashSeed(`icon-${id}`);

/** One straight pull. */
const line = (id: string, a: P, b: P, bow = 0.4) => lineStroke(k(id), a, b, { bow, jitter: 0.12 });

/** Pulls joined without lifting the pen: sharp corners, each leg bowed a little. */
function poly(id: string, pts: P[]) {
  let d = "";
  for (let i = 1; i < pts.length; i++) {
    const leg = lineStroke(k(`${id}-${i}`), pts[i - 1], pts[i], { bow: 0.45, jitter: 0 });
    d += i === 1 ? leg : leg.replace(/^M[^C]*/, "");
  }
  return d;
}

/** A smooth pen line through points. */
const curve = (id: string, pts: P[], closed = false) => handCurve(k(id), pts, { jitter: 0.1, closed });

/** A ring of diameter d centred on (cx, cy). */
const ring = (id: string, cx: number, cy: number, d: number, turns = 1.06) => shiftPath(ringStroke(k(id), d, { turns }), cx - d / 2, cy - d / 2);

/** A rounded box, pulled in one motion. */
const box = (id: string, x: number, y: number, w: number, h: number, r: number) =>
  shiftPath(roundedBoxStroke(k(id), w, h, r, { jitter: 0.1, overrun: 0.04 }), x, y);

/** A small inked dot. */
const dot = (id: string, x: number, y: number, r = 0.9) => shiftPath(dotStroke(k(id), r), x, y);

/** Points round a circle, from angle a0 to a1 (degrees, clockwise from 3 o'clock). */
function arc(cx: number, cy: number, r: number, a0: number, a1: number, steps = 8): P[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });
}

/** An arrowhead on the end of a line: wings trailing back from `tip`, which is heading at `deg`. */
function head(id: string, tip: P, deg: number, len = 2.8, spread = 38) {
  const wing = (turn: number): P => {
    const a = ((deg + 180 + turn) * Math.PI) / 180;
    return [tip[0] + Math.cos(a) * len, tip[1] + Math.sin(a) * len];
  };
  return poly(id, [wing(spread), tip, wing(-spread)]);
}

/** Refresh: most of a circle, clockwise, with a head on the end. */
function refresh() {
  const pts = arc(8, 8, 5.6, -50, 230, 10);
  const end = pts[pts.length - 1];
  // Going clockwise, the pen is heading 90° on from where it is round the circle.
  return [curve("refresh", pts), head("refresh-head", end, 230 + 90)];
}

/** A crescent moon: the rim of one circle, then the edge of the one biting into it. */
function moon() {
  const [x1, y1, r1] = [7.6, 8.4, 6];
  const [x2, y2, r2] = [11.2, 4.8, 4.9];
  // Where the two circles cross.
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const a = (r1 * r1 - r2 * r2 + dist * dist) / (2 * dist);
  const h = Math.sqrt(r1 * r1 - a * a);
  const mx = x1 + (a * dx) / dist;
  const my = y1 + (a * dy) / dist;
  const p: P = [mx + (h * dy) / dist, my - (h * dx) / dist];
  const q: P = [mx - (h * dy) / dist, my + (h * dx) / dist];
  const deg = (c: P, cx: number, cy: number) => (Math.atan2(c[1] - cy, c[0] - cx) * 180) / Math.PI;
  // The outer rim, the long way round from p to q, away from the bite.
  const a0 = deg(p, x1, y1);
  let a1 = deg(q, x1, y1);
  if (a1 < a0) a1 += 360;
  const outer = a1 - a0 > 180 ? arc(x1, y1, r1, a0, a1, 12) : arc(x1, y1, r1, a0 + 360, a1, 12);
  // The bite, the short way back from q to p.
  const b0 = deg(q, x2, y2);
  let b1 = deg(p, x2, y2);
  if (b1 > b0) b1 -= 360;
  const inner = b0 - b1 > 180 ? arc(x2, y2, r2, b0, b1 + 360, 8) : arc(x2, y2, r2, b0, b1, 8);
  return curve("moon", [...outer, ...inner.slice(1)]);
}

/** Two links of a chain, each a long loop leaning at 45°. */
function link(id: string, cx: number, cy: number) {
  const pts: P[] = [];
  const [len, r, t] = [3.6, 2.1, -Math.PI / 4];
  // A stadium: round one end, along, round the other, back.
  for (let i = 0; i <= 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const x = Math.cos(a) * r + (Math.cos(a) > 0 ? len / 2 : -len / 2);
    const y = Math.sin(a) * r;
    pts.push([cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)]);
  }
  return curve(id, pts.slice(0, -1), true);
}

/** A pencil lying from bottom-left to top-right: its tip, sides, and the end. */
function pencil() {
  const tip: P = [2.2, 13.8];
  const u: P = [Math.SQRT1_2, -Math.SQRT1_2];
  const n: P = [Math.SQRT1_2, Math.SQRT1_2];
  const at = (d: number, w: number): P => [tip[0] + u[0] * d + n[0] * w, tip[1] + u[1] * d + n[1] * w];
  return [
    poly("pencil-a", [at(3.6, -1.8), at(0, 0), at(3.6, 1.8)]),
    poly("pencil-b", [at(3.6, 1.8), at(14.2, 1.8), at(14.2, -1.8), at(3.6, -1.8)]),
    line("pencil-c", at(11.6, -1.8), at(11.6, 1.8)),
  ];
}

const icons = {
  ...glyphs,
  "arrow-left": { paths: [line("arrow-l", [14.2, 7.9], [2.4, 8.2]), poly("arrow-l-head", [[6.6, 3.9], [2.2, 8.1], [6.5, 12.2]])], width: 1.6 },
  "arrow-up": { paths: [line("arrow-u", [8.1, 14.2], [7.9, 2.4]), poly("arrow-u-head", [[3.9, 6.6], [8, 2.2], [12.1, 6.5]])], width: 1.6 },
  "arrow-down": { paths: [line("arrow-d", [7.9, 1.8], [8.1, 13.6]), poly("arrow-d-head", [[3.9, 9.4], [8, 13.8], [12.1, 9.5]])], width: 1.6 },
  "check-circle": { paths: [ring("check-ring", 8, 8, 13.4), shiftPath(tickStroke(k("check-c"), 7), 4.6, 4.8)], width: 1.5 },
  "x-circle": { paths: [ring("x-ring", 8, 8, 13.4), line("x-a", [5.6, 5.6], [10.4, 10.4]), line("x-b", [10.4, 5.7], [5.7, 10.3])], width: 1.5 },
  copy: {
    paths: [box("copy-front", 2, 5.6, 8.4, 8.6, 1.4), poly("copy-back", [[5.6, 5.2], [5.6, 2], [14, 2], [14, 10.4], [10.9, 10.4]])],
    width: 1.5,
  },
  "external-link": {
    paths: [poly("ext-box", [[7, 2.6], [2.4, 2.6], [2.4, 13.6], [13.4, 13.6], [13.4, 9]]), line("ext-arrow", [7.6, 8.4], [13.8, 2.2]), poly("ext-head", [[9.6, 2.1], [13.9, 2.1], [13.9, 6.4]])],
    width: 1.5,
  },
  link: { paths: [link("link-a", 6.1, 9.9), link("link-b", 9.9, 6.1)], width: 1.45 },
  search: { paths: [ring("search-ring", 6.8, 6.8, 9.6), line("search-handle", [10.5, 10.5], [14.2, 14.2])], width: 1.6 },
  menu: { paths: [line("menu-1", [2.2, 4], [13.8, 3.9]), line("menu-2", [2.2, 8], [13.8, 8.1]), line("menu-3", [2.2, 12.1], [13.8, 12])], width: 1.6 },
  more: { paths: [dot("more-1", 3.4, 8), dot("more-2", 8, 8), dot("more-3", 12.6, 8)], width: 1.5 },
  "more-vertical": { paths: [dot("more-v1", 8, 3.4), dot("more-v2", 8, 8), dot("more-v3", 8, 12.6)], width: 1.5 },
  sun: {
    paths: [
      ring("sun-ring", 8, 8, 6.2),
      ...Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 + 0.2;
        return line(`sun-ray-${i}`, [8 + Math.cos(a) * 4.8, 8 + Math.sin(a) * 4.8], [8 + Math.cos(a) * 6.8, 8 + Math.sin(a) * 6.8], 0.2);
      }),
    ],
    width: 1.5,
  },
  moon: { paths: [moon()], width: 1.5 },
  mail: { paths: [box("mail-box", 1.8, 3.4, 12.4, 9.4, 1.2), poly("mail-flap", [[2.3, 4.3], [8, 9.1], [13.7, 4.3]])], width: 1.5 },
  send: { paths: [poly("send-a", [[7.4, 8.6], [1.8, 6.8], [14.2, 1.8], [9.4, 14.2], [7.4, 8.6], [14.2, 1.8]])], width: 1.5 },
  heart: {
    paths: [
      curve("heart", [
        [8, 13.8], [4.6, 10.8], [2.2, 8.2], [1.8, 5.4], [3.2, 3.2], [5.6, 2.7], [7.3, 3.9], [8, 5.6],
        [8.7, 3.9], [10.4, 2.7], [12.8, 3.2], [14.2, 5.4], [13.8, 8.2], [11.4, 10.8], [8, 13.8],
      ]),
    ],
    width: 1.5,
  },
  star: {
    paths: [
      poly(
        "star",
        Array.from({ length: 11 }, (_, i) => {
          const a = ((i * 36 - 90) * Math.PI) / 180;
          const r = i % 2 ? 3 : 6.6;
          return [8 + Math.cos(a) * r, 8.6 + Math.sin(a) * r] as const;
        }),
      ),
    ],
    width: 1.4,
  },
  sparkle: {
    paths: [
      curve("sparkle", [[7, 1.8], [7.7, 6.6], [12.2, 7.6], [7.7, 8.6], [7, 14.2], [6.3, 8.6], [1.8, 7.6], [6.3, 6.6], [7, 1.8]]),
      line("sparkle-a", [12.6, 1.6], [12.6, 5]),
      line("sparkle-b", [10.9, 3.3], [14.3, 3.3]),
    ],
    width: 1.4,
  },
  home: {
    paths: [poly("home-roof", [[1.6, 8.2], [8, 2], [14.4, 8.2]]), poly("home-walls", [[3.6, 6.4], [3.6, 14], [12.4, 14], [12.4, 6.4]]), poly("home-door", [[6.6, 14], [6.6, 10.2], [9.4, 10.2], [9.4, 14]])],
    width: 1.5,
  },
  user: { paths: [ring("user-head", 8, 5.2, 5.6), curve("user-body", [[2.4, 14.4], [3.4, 11.2], [5.6, 9.8], [8, 9.5], [10.4, 9.8], [12.6, 11.2], [13.6, 14.4]])], width: 1.5 },
  settings: {
    paths: [
      line("set-1a", [1.8, 4], [3.4, 4]), ring("set-1k", 5, 4, 3), line("set-1b", [6.6, 4], [14.2, 4]),
      line("set-2a", [1.8, 8], [9, 8]), ring("set-2k", 10.6, 8, 3), line("set-2b", [12.2, 8], [14.2, 8]),
      line("set-3a", [1.8, 12], [5.8, 12]), ring("set-3k", 7.4, 12, 3), line("set-3b", [9, 12], [14.2, 12]),
    ],
    width: 1.4,
  },
  trash: {
    paths: [
      line("trash-lid", [1.8, 4.2], [14.2, 4]),
      poly("trash-handle", [[5.8, 4], [6.2, 2], [9.8, 2], [10.2, 4]]),
      poly("trash-can", [[3.4, 4.2], [4.3, 14.2], [11.7, 14.2], [12.6, 4.2]]),
      line("trash-i", [6.4, 6.8], [6.7, 11.8]),
      line("trash-ii", [9.6, 6.8], [9.3, 11.8]),
    ],
    width: 1.45,
  },
  pencil: { paths: pencil(), width: 1.45 },
  download: { paths: [line("dl-shaft", [8, 1.8], [8, 10.2]), poly("dl-head", [[4.6, 7], [8, 10.4], [11.4, 7]]), poly("dl-tray", [[2, 10.6], [2, 14], [14, 14], [14, 10.6]])], width: 1.5 },
  upload: { paths: [line("ul-shaft", [8, 10.4], [8, 2]), poly("ul-head", [[4.6, 5.4], [8, 2], [11.4, 5.4]]), poly("ul-tray", [[2, 10.6], [2, 14], [14, 14], [14, 10.6]])], width: 1.5 },
  calendar: {
    paths: [
      box("cal-box", 1.8, 3.2, 12.4, 11, 1.2),
      line("cal-rule", [2.2, 6.8], [13.8, 6.7]),
      line("cal-ring-a", [5, 1.6], [5.1, 4.6]),
      line("cal-ring-b", [11, 1.6], [10.9, 4.6]),
      dot("cal-d1", 5.4, 10.2, 0.7),
      dot("cal-d2", 8.2, 10.2, 0.7),
    ],
    width: 1.45,
  },
  clock: { paths: [ring("clock-ring", 8, 8, 13), poly("clock-hands", [[8, 4.2], [8, 8.2], [10.8, 10]])], width: 1.5 },
  bell: {
    paths: [
      curve("bell", [[2.4, 12], [3.8, 10.2], [4.2, 6.8], [5.2, 4], [8, 2.6], [10.8, 4], [11.8, 6.8], [12.2, 10.2], [13.6, 12]]),
      line("bell-rim", [2.2, 12.1], [13.8, 11.9]),
      curve("bell-clapper", [[6.5, 13.6], [8, 14.6], [9.5, 13.6]]),
    ],
    width: 1.45,
  },
  eye: {
    paths: [
      curve("eye-lids", [[1.4, 8], [4.4, 4.4], [8, 3.4], [11.6, 4.4], [14.6, 8], [11.6, 11.6], [8, 12.6], [4.4, 11.6]], true),
      ring("eye-pupil", 8, 8, 4.4),
    ],
    width: 1.45,
  },
  lock: {
    paths: [box("lock-body", 2.8, 7.2, 10.4, 7.2, 1.2), curve("lock-shackle", [[5, 7.2], [5, 4.8], [6, 2.9], [8, 2.2], [10, 2.9], [11, 4.8], [11, 7.2]]), dot("lock-hole", 8, 10.8, 0.8)],
    width: 1.5,
  },
  filter: { paths: [poly("filter", [[1.8, 2.6], [14.2, 2.6], [9.4, 8.4], [9.4, 13.6], [6.6, 12.2], [6.6, 8.4], [1.8, 2.6]])], width: 1.45 },
  refresh: { paths: refresh(), width: 1.5 },
  bookmark: { paths: [poly("bookmark", [[3.8, 1.8], [12.2, 1.8], [12.2, 14.2], [8, 10.8], [3.8, 14.2], [3.8, 1.8]])], width: 1.45 },
  image: {
    paths: [box("image-box", 1.8, 2.6, 12.4, 10.8, 1.2), poly("image-hills", [[2.2, 12.4], [5.8, 8.2], [8.6, 10.8], [10.4, 9], [13.8, 12.4]]), ring("image-sun", 10.6, 6, 2.6)],
    width: 1.45,
  },
  file: { paths: [poly("file", [[9.6, 1.8], [3, 1.8], [3, 14.2], [13, 14.2], [13, 5.2], [9.6, 1.8], [9.6, 5.2], [13, 5.2]])], width: 1.45 },
  folder: { paths: [poly("folder", [[1.8, 5.6], [1.8, 13.6], [14.2, 13.6], [14.2, 5.6], [7.8, 5.6], [6.4, 3.2], [1.8, 3.2], [1.8, 5.6]])], width: 1.45 },
  code: { paths: [poly("code-l", [[5.2, 4.2], [1.8, 8], [5.2, 11.8]]), poly("code-r", [[10.8, 4.2], [14.2, 8], [10.8, 11.8]]), line("code-slash", [9.3, 2.8], [6.7, 13.2])], width: 1.5 },
  terminal: { paths: [poly("term-prompt", [[2.2, 4], [6, 7.8], [2.2, 11.6]]), line("term-cursor", [7.8, 12.2], [13.8, 12.1])], width: 1.6 },
} satisfies Record<string, Glyph>;

export type IconName = keyof typeof icons;

/** Every icon's name, in the order above. */
export const iconNames = Object.keys(icons) as IconName[];

/**
 * A pen-drawn icon. Size it with a class (`size-5`); it takes the text
 * colour. `draw="mount"` draws it in as it appears; `label` names it for
 * screen readers when it stands alone.
 */
export function InkIcon({ name, ...props }: GlyphProps & { name: IconName }) {
  return <GlyphSvg glyph={icons[name]} name={name} {...props} />;
}
