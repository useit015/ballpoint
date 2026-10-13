// Writes app/opengraph-image.jpg and app/twitter-image.jpg: the front page's
// hero as it looks when finished, 1200×630, for when the site is shared.
// Run it against a running server:  pnpm dev  and, in another shell,  pnpm og
// (BASE sets the server; it needs Google Chrome, as the e2e tests do).

import { copyFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.env.BASE ?? "http://localhost:3000";
const out = new URL("../app/opengraph-image.jpg", import.meta.url).pathname;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce", colorScheme: "light" });
await page.goto(base, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
// The picture and the words, without the page's furniture.
await page.addStyleTag({
  content: "header, .hero-bar, .callout, .home-coffee, main > :not(.home-hero), footer { display: none !important } .home-hero { min-height: 630px; padding-block: 24px !important; align-content: center }",
});
const top = await page.locator(".home-hero").evaluate((el) => el.getBoundingClientRect().top + scrollY);
await page.screenshot({ path: out, type: "jpeg", quality: 88, clip: { x: 0, y: top, width: 1200, height: 630 } });
copyFileSync(out, new URL("../app/twitter-image.jpg", import.meta.url).pathname);
await browser.close();
console.log("app/opengraph-image.jpg, app/twitter-image.jpg");
