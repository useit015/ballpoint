// The size of each scene, in its own units. Apart from the generators so the
// components that reserve a scene's space (before it is drawn) don't have to
// load them to know it.

export const heroBox = [800, 520] as const;
export const sideBox = [560, 400] as const;
export const footerBox = [1600, 440] as const;

// Where the things in the front page's picture are, for the pieces that live in it.

/** The sun by day, the moon by night. */
export const sky = { x: 640, y: 74 } as const;
/** The boat on the lake, at its waterline. */
export const lake = { x: 300, y: 418 } as const;
/** The tall pines either side of the lake, for those that sway. */
export const tallPines = [
  { cx: 150, base: 410, h: 118, fat: 1.05 },
  { cx: 92, base: 452, h: 186, fat: 1.05, lean: -3 },
  { cx: 36, base: 488, h: 268, fat: 1.1, lean: 4 },
  { cx: 742, base: 462, h: 192, fat: 1.05, lean: 3 },
  { cx: 690, base: 424, h: 120, fat: 1 },
  { cx: 782, base: 505, h: 262, fat: 1.1, lean: -4 },
];
