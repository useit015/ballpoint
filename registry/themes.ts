// Pens and papers, published as registry:theme items (@ballpoint/pen-*,
// @ballpoint/paper-*) and offered by the docs customizer. A pen sets the
// ink; a paper sets the paper and the red pen that shows up on it. Every
// pen × paper pair, by day and by night, must pass scripts/contrast.ts.
// Blue ballpoint on cream is the default in styles/base.css.

export type ByTheme<T> = { light: T; dark: T };

export type PenTheme = {
  title: string;
  description: string;
  ink: ByTheme<string>;
  /** How solid shaded fills are, if this pen needs other than the default. */
  fill?: ByTheme<number>;
};

export type PaperTheme = {
  title: string;
  description: string;
  paper: ByTheme<string>;
  red: ByTheme<string>;
};

export const pens = {
  blue: {
    title: "Blue ballpoint",
    description: "The default: a cheap blue ballpoint, pale blue at night.",
    ink: { light: "oklch(0.4 0.185 267)", dark: "oklch(0.9 0.045 258)" },
  },
  black: {
    title: "Black fineliner",
    description: "A felt-tip fineliner: nearly black by day, nearly white by night.",
    ink: { light: "oklch(0.26 0.012 265)", dark: "oklch(0.94 0.006 265)" },
  },
  pencil: {
    title: "Pencil",
    description: "Soft graphite, a little grey and a little shine.",
    ink: { light: "oklch(0.37 0.012 255)", dark: "oklch(0.86 0.01 255)" },
  },
  green: {
    title: "Green ink",
    description: "A fountain-pen green.",
    ink: { light: "oklch(0.38 0.1 158)", dark: "oklch(0.88 0.08 158)" },
  },
} satisfies Record<string, PenTheme>;

export const papers = {
  cream: {
    title: "Cream",
    description: "The default: warm notebook stock, navy at night.",
    paper: { light: "#ede8df", dark: "oklch(0.215 0.038 266)" },
    red: { light: "oklch(0.5 0.19 27)", dark: "oklch(0.74 0.14 25)" },
  },
  white: {
    title: "White",
    description: "Bright copier paper, near-black at night.",
    paper: { light: "oklch(0.985 0.003 95)", dark: "oklch(0.2 0.006 270)" },
    red: { light: "oklch(0.52 0.2 27)", dark: "oklch(0.74 0.14 25)" },
  },
  legal: {
    title: "Legal pad",
    description: "Yellow legal pad, dark olive at night.",
    paper: { light: "oklch(0.95 0.075 100)", dark: "oklch(0.24 0.03 95)" },
    red: { light: "oklch(0.5 0.19 27)", dark: "oklch(0.75 0.13 30)" },
  },
} satisfies Record<string, PaperTheme>;

export type PenName = keyof typeof pens;
export type PaperName = keyof typeof papers;
