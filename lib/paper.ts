import type { StaticImageData } from "next/image";
import type { PaperName } from "@/registry/themes";
import creamDark from "@/public/paper/cream-dark.png";
import creamLight from "@/public/paper/cream-light.png";
import legalDark from "@/public/paper/legal-dark.png";
import legalLight from "@/public/paper/legal-light.png";
import toothDark from "@/public/paper/tooth-dark.png";
import toothLight from "@/public/paper/tooth-light.png";
import whiteDark from "@/public/paper/white-dark.png";
import whiteLight from "@/public/paper/white-light.png";

// Imported, like the ones in app/globals.css, so each gets a hashed URL the
// browser keeps rather than asking for it again on every visit.
const relief: Record<PaperName, Record<"light" | "dark", StaticImageData>> = {
  cream: { light: creamLight, dark: creamDark },
  white: { light: whiteLight, dark: whiteDark },
  legal: { light: legalLight, dark: legalDark },
};
const tooth: Record<"light" | "dark", StaticImageData> = { light: toothLight, dark: toothDark };

/** The textured sheet for a paper, from scripts/paper-tiles.ts (the layers of --paper-tile); paint it with .paper-sheet. */
export const paperTile = (paper: PaperName, mode: "light" | "dark") => `none, url("${tooth[mode].src}"), url("${relief[paper][mode].src}")`;
