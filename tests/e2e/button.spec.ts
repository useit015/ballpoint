import { expect, test } from "@playwright/test";
import { open } from "./routes";

test.describe("button", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/docs/button", "light");
  });

  test("keyboard focus lifts the box and draws a visible ring", async ({ page }) => {
    const first = page.locator("[data-preview] [data-slot=button]").first();
    await first.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(first).toBeFocused();
    const style = await first.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { outline: cs.outlineStyle, width: cs.outlineWidth, translate: cs.translate };
    });
    // 1.5px snaps to whole device pixels, so 1px at 1x.
    expect(style.outline).toBe("solid");
    expect(parseFloat(style.width)).toBeGreaterThanOrEqual(1);
    expect(style.translate).toBe("-1.5px -1.5px");
  });

  test("activates with Enter and Space", async ({ page }) => {
    const redraw = page.getByRole("button", { name: "Redraw" });
    const stroke = page.locator("[data-preview] [data-slot=button] svg path[pathLength]").first();
    for (const key of ["Enter", " "]) {
      const before = await stroke.getAttribute("d");
      await redraw.focus();
      await page.keyboard.press(key);
      await expect(stroke).not.toHaveAttribute("d", before!);
    }
  });

  test("disabled buttons can't take focus", async ({ page }) => {
    const disabled = page.locator("[data-preview] [data-slot=button]", { hasText: "Disabled" });
    await expect(disabled).toBeDisabled();
    await disabled.evaluate((el) => (el as HTMLElement).focus());
    await expect(disabled).not.toBeFocused();
  });

  test("strokes are redrawn to the measured box", async ({ page }) => {
    const sizes = await page.locator("[data-preview] [data-slot=button][data-variant=outline]").evaluateAll((els) =>
      els.map((el) => {
        const box = el.querySelector("svg")!.viewBox.baseVal;
        return [Math.round(box.width - 20) - Math.round(el.getBoundingClientRect().width), Math.round(box.height - 20) - Math.round(el.getBoundingClientRect().height)];
      }),
    );
    for (const [dw, dh] of sizes) {
      expect(Math.abs(dw)).toBeLessThanOrEqual(2);
      expect(Math.abs(dh)).toBeLessThanOrEqual(2);
    }
  });
});
