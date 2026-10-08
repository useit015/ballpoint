import { expect, test, type Locator } from "@playwright/test";

async function pointer(surface: Locator, name: string, id: number, x: number, y = 80) {
  await surface.evaluate((el, event) => {
    const box = el.getBoundingClientRect();
    el.dispatchEvent(new PointerEvent(event.name, {
      bubbles: true, cancelable: true, pointerId: event.id, pointerType: "touch",
      clientX: box.left + event.x, clientY: box.top + event.y,
      buttons: event.name === "pointerup" ? 0 : 1,
    }));
  }, { name, id, x, y });
}

for (const ending of ["pointerup", "pointercancel", "lostpointercapture"]) {
  test(`signature pad ignores a second pointer's ${ending}`, async ({ page }) => {
    await page.goto("/docs/signature-pad", { waitUntil: "networkidle" });
    const pad = page.locator("[data-preview]").first().locator("[data-slot=signature-pad]");
    const surface = pad.locator("[data-slot=signature-pad-surface]");
    const ink = pad.locator("svg g[filter] path");
    await pointer(surface, "pointerdown", 7, 40);
    await pointer(surface, "pointermove", 7, 80);
    await expect(ink).toHaveCount(1);
    const original = await ink.getAttribute("d");
    await pointer(surface, "pointerdown", 8, 220, 120);
    await pointer(surface, "pointermove", 8, 260, 120);
    await pointer(surface, ending, 8, 260, 120);
    await expect(ink).toHaveAttribute("d", original!);
    await expect(pad.locator("input")).toHaveValue("");
    await pointer(surface, "pointermove", 7, 120);
    await pointer(surface, "pointerup", 7, 120);
    await expect(ink).toHaveCount(1);
    await expect(pad.locator("input")).toHaveValue(/^data:image\/svg\+xml,/);
    const first = await ink.evaluate((el) => (el as SVGPathElement).getBBox().x);
    expect(first).toBeLessThan(50);
    // Finishing the owner allows another pointer to start a separate stroke.
    await pointer(surface, "pointerdown", 8, 220, 120);
    await pointer(surface, "pointermove", 8, 260, 120);
    await pointer(surface, "pointerup", 8, 260, 120);
    await expect(ink).toHaveCount(2);
  });
}
