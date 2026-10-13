import { expect, test } from "@playwright/test";
import { docs, open, themes } from "./routes";

// Seeded strokes draw the same pixels every time, so previews can be
// compared exactly. Update on purpose: `pnpm test:visual --update-snapshots`.
for (const name of docs) {
  for (const theme of themes) {
    test(`visual ${name} (${theme})`, async ({ page }) => {
      await open(page, `/docs/${name}`, theme);
      const previews = page.locator("[data-preview]");
      const count = await previews.count();
      for (let i = 0; i < count; i++) {
        await expect(previews.nth(i)).toHaveScreenshot(i ? `${name}-${i}-${theme}.png` : `${name}-${theme}.png`);
      }
    });
  }
}

for (const theme of themes) {
  test(`visual home (${theme})`, async ({ page }) => {
    await open(page, "/", theme);
    // The night panel's picture is drawn when its section is near: go there and wait for it.
    await page.locator(".home-customize").scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator(".custom-night-art path").count()).toBeGreaterThan(50);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator("main")).toHaveScreenshot(`home-${theme}.png`);
  });
}

for (const theme of themes) {
  test(`visual customizer (${theme})`, async ({ page }) => {
    await open(page, "/customize", theme);
    await expect(page.locator("[data-customizer-preview]")).toHaveScreenshot(`customizer-${theme}.png`);
  });
}
