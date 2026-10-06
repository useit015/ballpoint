import { expect, test, type Locator } from "@playwright/test";
import { open } from "./routes";

// Reduced motion: state strokes switch instantly, so their end state can be
// read straight away.
const shown = (stroke: Locator) => stroke.evaluate((p) => getComputedStyle(p).opacity === "1" && getComputedStyle(p).strokeDashoffset === "0px");

test.describe("checkbox", () => {
  test("ticks and unticks from the keyboard", async ({ page }) => {
    await open(page, "/docs/checkbox", "light");
    const box = page.getByRole("checkbox", { name: "Ink" });
    const tick = box.locator("path.ink-checked-draw");
    await expect(box).toHaveAttribute("aria-checked", "false");
    expect(await shown(tick)).toBe(false);
    await box.focus();
    await page.keyboard.press(" ");
    await expect(box).toHaveAttribute("aria-checked", "true");
    expect(await shown(tick)).toBe(true);
    await page.keyboard.press(" ");
    await expect(box).toHaveAttribute("aria-checked", "false");
  });

  test("a partial selection draws a dash, a full one a tick", async ({ page }) => {
    await open(page, "/docs/checkbox", "light");
    const all = page.getByRole("checkbox", { name: "Everything you need" });
    await expect(all).toHaveAttribute("aria-checked", "mixed");
    expect(await shown(all.locator("path.ink-indeterminate-draw"))).toBe(true);
    await page.getByRole("checkbox", { name: "Ink" }).click();
    await page.getByRole("checkbox", { name: "A steady hand" }).click();
    await expect(all).toHaveAttribute("aria-checked", "true");
    expect(await shown(all.locator("path.ink-checked-draw"))).toBe(true);
  });
});

test("radio: arrows move the choice and the dot follows", async ({ page }) => {
  await open(page, "/docs/radio-group", "light");
  const blue = page.getByRole("radio", { name: "Blue ballpoint" });
  const black = page.getByRole("radio", { name: "Black fineliner" });
  await blue.focus();
  await page.keyboard.press("ArrowDown");
  await expect(black).toHaveAttribute("aria-checked", "true");
  expect(await shown(black.locator("path.ink-checked-draw"))).toBe(true);
  expect(await shown(blue.locator("path.ink-checked-draw"))).toBe(false);
});

test("choice card: clicking the card chooses it and inks its box", async ({ page }) => {
  await open(page, "/docs/radio-group", "light");
  await page.locator("[data-preview]").getByText("Navy, for the lamp.").click();
  await expect(page.getByRole("radio", { name: /Night/ })).toHaveAttribute("aria-checked", "true");
  const outline = page.locator('[data-slot="field-label"]', { hasText: "Night" }).locator("svg.ink-sketch").first();
  const ink = await page.evaluate(() => getComputedStyle(document.body).color);
  // The ink eases over --dur-hover; wait for it to settle (still hovered).
  await expect.poll(() => outline.evaluate((el) => getComputedStyle(el).color)).toBe(ink);
});

test("switch: Space switches it, the thumb slides and the track shades", async ({ page }) => {
  await open(page, "/docs/switch", "light");
  const sw = page.getByRole("switch", { name: "Off" });
  const thumb = sw.locator('[data-slot="switch-thumb"]');
  const before = await thumb.evaluate((el) => getComputedStyle(el).translate);
  await sw.focus();
  await page.keyboard.press(" ");
  await expect(sw).toHaveAttribute("aria-checked", "true");
  expect(await thumb.evaluate((el) => getComputedStyle(el).translate)).not.toBe(before);
  expect(await shown(sw.locator("path.ink-checked-draw").first())).toBe(true);
});

test("slider: arrow keys move the value", async ({ page }) => {
  await open(page, "/docs/slider", "light");
  const thumb = page.getByRole("slider", { name: "Roughness" });
  await expect(thumb).toHaveAttribute("aria-valuenow", "40");
  await thumb.focus();
  await page.keyboard.press("ArrowRight");
  await expect(thumb).toHaveAttribute("aria-valuenow", "41");
  const range = page.getByRole("slider", { name: "Price range, to" });
  await range.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(range).toHaveAttribute("aria-valuenow", "69");
});

test.describe("input", () => {
  test("focus draws one more pass in full ink", async ({ page }) => {
    await open(page, "/docs/input", "light");
    const field = page.getByLabel("Email");
    const pass = page.locator('[data-slot="input"]').first().locator("path.ink-focus-draw");
    expect(await shown(pass)).toBe(false);
    await field.focus();
    expect(await shown(pass)).toBe(true);
    await field.fill("ada@example.com");
    await expect(field).toHaveValue("ada@example.com");
  });

  test("aria-invalid redraws the box in red pen", async ({ page }) => {
    await open(page, "/docs/input", "light");
    const box = page.locator('[data-slot="input"]', { has: page.getByLabel("Invite code") }).locator("svg.ink-sketch");
    const red = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--pen-red").trim());
    const color = await box.evaluate((el) => getComputedStyle(el).color);
    const expected = await page.evaluate((c) => {
      const probe = document.createElement("i");
      probe.style.color = c;
      document.body.append(probe);
      const out = getComputedStyle(probe).color;
      probe.remove();
      return out;
    }, red);
    expect(color).toBe(expected);
  });
});
