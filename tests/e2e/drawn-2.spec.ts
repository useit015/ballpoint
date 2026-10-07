import { expect, test, type Locator, type Page } from "@playwright/test";

// Special set 2: a pad you sign, a grid of days, a timeline that lands as
// the pen passes, the day/night switch, notes in the margin, a to-do list,
// words scribbled out, and pen tests.

/** Synthetic pointer events, for the pointer types a mouse can't produce. */
async function pull(surface: Locator, type: "pen" | "touch", points: [number, number, number][]) {
  await surface.evaluate(
    (el, { type, points }) => {
      const box = el.getBoundingClientRect();
      const fire = (name: string, [x, y, pressure]: [number, number, number], t: number) =>
        el.dispatchEvent(
          new PointerEvent(name, { bubbles: true, cancelable: true, pointerId: 7, pointerType: type, pressure, clientX: box.left + x, clientY: box.top + y, buttons: name === "pointerup" ? 0 : 1, timeStamp: t } as PointerEventInit),
        );
      fire("pointerdown", points[0], 0);
      points.slice(1).forEach((p, i) => fire("pointermove", p, (i + 1) * 16));
      fire("pointerup", points[points.length - 1], points.length * 16);
    },
    { type, points },
  );
}

const line = (y: number, pressure: number) => Array.from({ length: 30 }, (_, i) => [40 + i * 8, y + Math.sin(i / 3) * 2, pressure] as [number, number, number]);

async function signaturePad(page: Page) {
  await page.goto("/docs/signature-pad", { waitUntil: "networkidle" });
  const demo = page.locator("[data-preview]").first();
  const pad = demo.locator("[data-slot=signature-pad]");
  return { demo, pad, surface: pad.locator("[data-slot=signature-pad-surface]"), ink: pad.locator("svg g[filter] path") };
}

test("signature pad: a mouse signs, and the form submits the signature", async ({ page }) => {
  const { demo, pad, surface, ink } = await signaturePad(page);
  await expect(pad).toHaveAttribute("data-empty", "");
  const box = (await surface.boundingBox())!;
  await page.mouse.move(box.x + 40, box.y + 90);
  await page.mouse.down();
  for (let i = 1; i <= 25; i++) await page.mouse.move(box.x + 40 + i * 10, box.y + 90 - Math.sin(i / 2) * 20, { steps: 2 });
  await page.mouse.up();
  await expect(ink).toHaveCount(1);
  await expect(pad).not.toHaveAttribute("data-empty");

  await demo.getByRole("button", { name: "Sign" }).click();
  const submitted = await demo.getByRole("img", { name: "The signature, as the form sent it" }).getAttribute("src");
  expect(submitted).toMatch(/^data:image\/svg\+xml,/);
  const svg = decodeURIComponent(submitted!.replace("data:image/svg+xml,", ""));
  expect(svg).toContain("<path");
  // Exported in a concrete colour, so it reads the same outside the browser.
  expect(svg).toMatch(/fill="rgb\(\d+, \d+, \d+\)"/);
});

test("signature pad: a stylus presses wider, a finger signs without scrolling", async ({ page }) => {
  const { surface, ink } = await signaturePad(page);
  await pull(surface, "pen", line(50, 0.1));
  await pull(surface, "pen", line(110, 1));
  await expect(ink).toHaveCount(2);
  const [light, heavy] = await ink.evaluateAll((paths) => paths.map((p) => (p as SVGPathElement).getBBox().height));
  expect(heavy).toBeGreaterThan(light);

  expect(await surface.evaluate((el) => getComputedStyle(el).touchAction)).toBe("none");
  await pull(surface, "touch", line(80, 0));
  await expect(ink).toHaveCount(3);
});

test("signature pad: required stops an unsigned form; clear empties it", async ({ page }) => {
  const { demo, pad, surface, ink } = await signaturePad(page);
  const field = pad.locator("input");
  const clear = pad.getByRole("button", { name: "Clear" });
  await expect(clear).toBeDisabled();
  await demo.getByRole("button", { name: "Sign" }).click();
  expect(await field.evaluate((i) => (i as HTMLInputElement).validity.valueMissing)).toBe(true);
  await expect(demo.getByRole("img")).toHaveCount(0);

  await pull(surface, "pen", line(80, 0.6));
  await expect(ink).toHaveCount(1);
  expect(await field.inputValue()).toMatch(/^data:image\/svg\+xml,/);
  await clear.click();
  await expect(ink).toHaveCount(0);
  expect(await field.inputValue()).toBe("");
});

test("hatch grid: a year of days, the future dotted, hovering says what a day holds", async ({ page }) => {
  await page.goto("/docs/hatch-grid", { waitUntil: "networkidle" });
  const grid = page.locator("[data-slot=hatch-grid]");
  const days = grid.locator("svg use");
  await expect(days).toHaveCount(365);
  // After 2026-10-06, still to come.
  expect(await days.evaluateAll((uses) => uses.filter((u) => /-f-\d$/.test(u.getAttribute("href") ?? "")).length)).toBe(365 - 279);

  const svg = grid.locator("svg[role=img]");
  await expect(svg).toHaveAccessibleName(/commits in 2026/);
  await grid.evaluate((el) => (el.scrollLeft = 0));
  const box = (await svg.boundingBox())!;
  // The first column's Thursday: Jan 1st, 2026.
  await page.mouse.move(box.x + 5, box.y + 4 * 14.5 + 5);
  await expect(page.locator("[data-slot=hatch-grid-label]")).toHaveText(/on Jan 1st, 2026$/);
});

test("timeline: stops wait for the arrow, then land in order as the pen passes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/docs/timeline", { waitUntil: "networkidle" });
  const timeline = page.locator("[data-preview]").nth(1).locator("[data-slot=timeline]");
  const stops = timeline.locator("[data-slot=timeline-item] .ink-land");
  const opacity = (i: number) => stops.nth(i).evaluate((el) => getComputedStyle(el).opacity);
  expect(await opacity(0)).toBe("0");

  await timeline.scrollIntoViewIfNeeded();
  await expect.poll(() => opacity(0), { timeout: 4000 }).toBe("1");
  const delays = await stops.evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).getPropertyValue("--ink-dd"))));
  expect([...delays].sort((a, b) => a - b)).toEqual(delays);
  await expect.poll(() => opacity(delays.length - 1), { timeout: 4000 }).toBe("1");
});

test("ink theme toggle: switches the theme, remembers it, and says what it will do", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/docs/ink-theme-toggle", { waitUntil: "networkidle" });
  const toggle = page.locator("[data-preview] [data-slot=ink-theme-toggle]");
  await expect(toggle).toHaveAccessibleName("Switch to dark theme");
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
  await expect(toggle).toHaveAccessibleName("Switch to light theme");
  await expect(page.locator("html")).not.toHaveAttribute("data-ink-theme-transition");
  await toggle.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("margin note: out in the margin on wide screens, under the line on narrow ones", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/docs/margin-note", { waitUntil: "networkidle" });
  const note = page.locator("[data-slot=margin-note]");
  await expect(note).toHaveAttribute("role", "note");
  expect(await note.evaluate((el) => getComputedStyle(el).float)).toBe("right");
  await expect(note.locator("svg path")).toHaveCount(2);
  // The arrow ends at the words, to the left of the note.
  const target = (await page.locator("[data-slot=margin-note-target]").boundingBox())!;
  const noteBox = (await note.boundingBox())!;
  expect(noteBox.x).toBeGreaterThan(target.x + target.width);

  await page.setViewportSize({ width: 390, height: 800 });
  await expect.poll(() => note.evaluate((el) => getComputedStyle(el).float)).toBe("none");
  await expect(note.locator("svg path")).toHaveCount(2);
});

test("checklist: ticking strikes an item through; unticking pulls the line back out", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/checklist", { waitUntil: "networkidle" });
  const items = page.locator("[data-preview] [data-slot=checklist-item]");
  // The line through the words: the drawing in the item's last span.
  const struck = (i: number) => items.nth(i).locator(":scope > span:last-child > svg path").evaluate((p) => getComputedStyle(p).opacity);
  await expect(items.nth(0)).toHaveAttribute("data-done", "");
  await expect(items.nth(1)).not.toHaveAttribute("data-done");
  expect(await struck(1)).toBe("0");

  await items.nth(1).getByRole("checkbox").click();
  await expect(items.nth(1)).toHaveAttribute("data-done", "");
  await expect(items.nth(1).getByRole("checkbox")).toBeChecked();
  expect(await struck(1)).toBe("1");

  await items.nth(0).getByText("Buy more blue pens").click();
  await expect(items.nth(0)).not.toHaveAttribute("data-done");
});

test("redact: hidden from everyone until clicked, then shown", async ({ page }) => {
  await page.goto("/docs/redact", { waitUntil: "networkidle" });
  const word = page.locator("[data-preview] [data-slot=redact]").first();
  await expect(word).toHaveAttribute("aria-pressed", "false");
  await expect(word).toHaveAccessibleName("Hidden text, press to show");
  await expect(word.getByText("October 14th")).toHaveAttribute("aria-hidden", "true");

  await word.focus();
  await page.keyboard.press("Enter");
  await expect(word).toHaveAttribute("aria-pressed", "true");
  await expect(word).toHaveAccessibleName("October 14th");
  await expect.poll(() => word.getByText("October 14th").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await word.click();
  await expect(word).toHaveAttribute("aria-pressed", "false");
});

test("scrawls are decoration: drawn, and hidden from screen readers", async ({ page }) => {
  await page.goto("/docs/scrawl", { waitUntil: "networkidle" });
  const scrawls = page.locator("[data-preview] [data-slot=scrawl]");
  await expect(scrawls).toHaveCount(4);
  for (const scrawl of await scrawls.all()) {
    await expect(scrawl).toHaveAttribute("aria-hidden", "true");
    expect(await scrawl.locator("path.ink-ribbon").count()).toBeGreaterThan(0);
  }
});
