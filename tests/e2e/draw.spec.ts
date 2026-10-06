import { expect, test } from "@playwright/test";

// draw="auto": strokes wait, undrawn, until their drawing scrolls into view,
// then the pen runs once.
test("auto drawings wait until they scroll into view", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/docs/button", { waitUntil: "networkidle" });

  const below = page.locator("[data-preview]").nth(1).locator("[data-slot=button] svg").first();
  await expect(below).toHaveAttribute("data-ink-pending", "");
  // Waiting: undrawn, and no animation running yet.
  const waiting = await below.locator("path.ink-draw").first().evaluate((p) => {
    const cs = getComputedStyle(p);
    return { animation: cs.animationName, offset: cs.strokeDashoffset };
  });
  expect(waiting).toEqual({ animation: "none", offset: "1.05px" });

  await below.scrollIntoViewIfNeeded();
  await expect(below).not.toHaveAttribute("data-ink-pending");
  await expect(below.locator("path.ink-draw").first()).toHaveClass(/ink-drawn/, { timeout: 3000 });
});

test("reduced motion shows auto drawings finished, even before they're in view", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/docs/button", { waitUntil: "networkidle" });
  const stroke = page.locator("[data-preview]").nth(1).locator("[data-slot=button] svg path.ink-draw").first();
  expect(await stroke.evaluate((p) => getComputedStyle(p).strokeDashoffset)).toBe("0px");
});
