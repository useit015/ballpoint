import type { StaticImageData } from "next/image";
import type { PaperName } from "@/registry/themes";
import creamDark from "@/public/paper/cream-dark.png";
import creamLight from "@/public/paper/cream-light.png";
import fibresDark from "@/public/paper/slip-fibres-dark.svg";
import fibresLight from "@/public/paper/slip-fibres-light.svg";
import legalDark from "@/public/paper/legal-dark.png";
import legalLight from "@/public/paper/legal-light.png";
import slipDark from "@/public/paper/slip-dark.png";
import slipLegalDark from "@/public/paper/slip-legal-dark.png";
import slipLegalLight from "@/public/paper/slip-legal-light.png";
import slipLight from "@/public/paper/slip-light.png";
import slipWhiteDark from "@/public/paper/slip-white-dark.png";
import slipWhiteLight from "@/public/paper/slip-white-light.png";
import toothDark from "@/public/paper/tooth-dark.svg";
import toothLight from "@/public/paper/tooth-light.svg";
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

const slips: Record<PaperName, Record<"light" | "dark", StaticImageData>> = {
  cream: { light: slipLight, dark: slipDark },
  white: { light: slipWhiteLight, dark: slipWhiteDark },
  legal: { light: slipLegalLight, dark: slipLegalDark },
};
const fibres: Record<"light" | "dark", StaticImageData> = { light: fibresLight, dark: fibresDark };

/** The same for a slip laid on that paper (code and examples; torn sheets): a shade lighter, with fibres. Paint it with .slip. */
export const slipTile = (paper: PaperName, mode: "light" | "dark") => `url("${fibres[mode].src}"), url("${tooth[mode].src}"), url("${slips[paper][mode].src}")`;
