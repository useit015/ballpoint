import type { PaperName } from "@/registry/themes";

/** The textured sheet for a paper, from scripts/paper-tiles.ts; paint it with .paper-sheet. */
export const paperTile = (paper: PaperName, mode: "light" | "dark") => `url("/paper/${paper}-${mode}.svg")`;
