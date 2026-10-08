import { expect, test } from "@playwright/test";
import { pens } from "../../registry/themes";
import { contrast, over, parseColor } from "../../lib/color";
import { open } from "./routes";

test.describe("customizer", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/customize", "light");
  });

  test("starts on the defaults, with nothing to add", async ({ page }) => {
    await expect(page.getByText("These are the defaults: nothing to add.")).toBeVisible();
    await expect(page.getByRole("status")).toHaveText("Every pair passes WCAG AA.");
  });

  test("a pen and paper re-ink the preview and give the install command", async ({ page }) => {
    const preview = page.locator("[data-customizer-preview]");
    await page.getByRole("radio", { name: "Black fineliner" }).click();
    await page.getByRole("radio", { name: "Legal pad" }).click();
    expect(await preview.evaluate((el) => el.style.getPropertyValue("--ink"))).toBe(pens.black.ink.light);
    // Derived tones follow inside the scope.
    const text = await preview.evaluate((el) => getComputedStyle(el).color);
    const ink = await preview.evaluate((el, c) => {
      const probe = document.createElement("i");
      probe.style.color = c;
      el.append(probe);
      const out = getComputedStyle(probe).color;
      probe.remove();
      return out;
    }, pens.black.ink.light);
    expect(text).toBe(ink);
    await expect(page.locator("pre").filter({ hasText: "add @ballpoint/pen-black @ballpoint/paper-legal" })).toBeVisible();
  });

  test("hand settings redraw the sheet and become InkProvider props", async ({ page }) => {
    // An outline pass (the shading strokes come first and ignore the radius).
    const stroke = page.locator("[data-customizer-preview] [data-slot=button]").first().locator("svg path[pathLength]").last();
    const before = await stroke.getAttribute("d");
    await page.getByRole("radio", { name: "Pill" }).click();
    await expect(stroke).not.toHaveAttribute("d", before!);
    const roughness = page.getByRole("slider", { name: "Roughness" });
    await roughness.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("pre").filter({ hasText: '<InkProvider roughness={1.1} radius="full">' })).toBeVisible();
  });

  test("night switches the preview to its dark pen and paper", async ({ page }) => {
    await page.getByRole("switch", { name: "Night" }).click();
    await expect(page.locator("[data-customizer-preview]")).toHaveClass(/\bdark\b/);
    expect(await page.locator("[data-customizer-preview]").evaluate((el) => el.style.getPropertyValue("--ink"))).toBe(pens.blue.ink.dark);
  });

  test("a light preview on a dark page uses the fill shown in its contrast readout", async ({ page }) => {
    await page.getByRole("button", { name: "Switch to dark theme", exact: true }).click();
    await expect(page.getByRole("switch", { name: "Night", exact: true })).toBeChecked();
    await page.getByRole("switch", { name: "Night", exact: true }).click();
    const preview = page.locator("[data-customizer-preview]");
    await expect(preview).not.toHaveClass(/\bdark\b/);
    const paint = await preview.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        ink: style.getPropertyValue("--ink"), paper: style.getPropertyValue("--paper"),
        fill: Number(style.getPropertyValue("--ink-fill")),
      };
    });
    const paper = parseColor(paint.paper);
    const ratio = contrast(paper, over(parseColor(paint.ink), paint.fill, paper));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    await expect(page.locator("li").filter({ hasText: "Labels on solid buttons" })).toHaveText(`Labels on solid buttons${ratio.toFixed(2)} ✓`);
  });

  test("your own pen gives the CSS for it", async ({ page }) => {
    await page.getByRole("radio", { name: "Your own" }).click();
    await expect(page.getByRole("slider", { name: "Hue" })).toBeVisible();
    await expect(page.locator("pre").filter({ hasText: "--ink: oklch(0.4 0.14 200);" })).toBeVisible();
  });

  test("reset goes back to the defaults", async ({ page }) => {
    await page.getByRole("radio", { name: "Pencil" }).click();
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByRole("radio", { name: "Blue ballpoint" })).toHaveAttribute("aria-checked", "true");
    await expect(page.getByText("These are the defaults: nothing to add.")).toBeVisible();
  });
});
