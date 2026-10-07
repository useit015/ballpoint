import type { PaperName } from "@/registry/themes";

/** The textured sheet for a paper, from scripts/paper-tiles.ts (the layers of --paper-tile); paint it with .paper-sheet. */
export const paperTile = (paper: PaperName, mode: "light" | "dark") => `none, url("/paper/tooth-${mode}.svg"), url("/paper/${paper}-${mode}.png")`;
