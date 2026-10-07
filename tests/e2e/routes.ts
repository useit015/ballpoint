import type { Page } from "@playwright/test";
import { allDocs } from "../../lib/docs";

export const docs = allDocs.map((doc) => doc.name);
export const routes = ["/", "/components", "/docs", "/docs/themes", "/customize", ...docs.map((name) => `/docs/${name}`)];
export const themes = ["light", "dark"] as const;

/** Open a page in a theme, with its fonts loaded and its strokes measured. */
export async function open(page: Page, route: string, theme: (typeof themes)[number]) {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
  await page.goto(route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}
