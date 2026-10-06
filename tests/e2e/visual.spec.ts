import { expect, test } from "@playwright/test";
import { docs, open, themes } from "./routes";

// Seeded strokes draw the same pixels every time, so previews can be
// compared exactly. Update on purpose: `pnpm test:visual --update-snapshots`.
for (const name of docs) {
  for (const theme of themes) {
    test(`visual ${name} (${theme})`, async ({ page }) => {
      await open(page, `/docs/${name}`, theme);
      await expect(page.locator("[data-preview]").first()).toHaveScreenshot(`${name}-${theme}.png`);
    });
  }
}

for (const theme of themes) {
  test(`visual home (${theme})`, async ({ page }) => {
    await open(page, "/", theme);
    await expect(page.locator("main")).toHaveScreenshot(`home-${theme}.png`);
  });
}
