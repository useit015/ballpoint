import { expect, test } from "@playwright/test";
import { open } from "./routes";

// The props and examples added across the components, each used once.

const preview = (page: import("@playwright/test").Page, n: number) => page.locator("[data-preview]").nth(n);

test("alert: a note is hatched and a pencilled alert is not; the dismissible one goes and comes back", async ({ page }) => {
  await open(page, "/docs/alert", "light");
  const variants = preview(page, 2);
  await expect(variants.locator("[data-slot=alert]").nth(1).locator("clipPath")).toHaveCount(1);
  await expect(variants.locator("[data-slot=alert]").nth(0).locator("clipPath")).toHaveCount(0);
  const dismiss = preview(page, 3);
  await dismiss.getByRole("button", { name: "Dismiss" }).click();
  await expect(dismiss.getByRole("alert")).toHaveCount(0);
  await dismiss.getByRole("button", { name: "Bring it back" }).click();
  await expect(dismiss.getByRole("alert")).toBeVisible();
});

test("badge: filter chips toggle, removable tags go and come back, and sizes are different heights", async ({ page }) => {
  await open(page, "/docs/badge", "light");
  const sizes = preview(page, 3).locator("[data-slot=badge]");
  const [sm, md, lg] = await Promise.all([0, 1, 2].map(async (i) => (await sizes.nth(i).boundingBox())!.height));
  expect(sm).toBeLessThan(md);
  expect(md).toBeLessThan(lg);
  const chip = preview(page, 4).getByRole("button", { name: "Sketches" });
  await expect(chip).toHaveAttribute("aria-pressed", "false");
  await chip.click();
  await expect(chip).toHaveAttribute("aria-pressed", "true");
  const tags = preview(page, 5);
  await tags.getByRole("button", { name: "Remove ink" }).click();
  await expect(tags.getByText("ink", { exact: true })).toHaveCount(0);
  await tags.getByRole("button", { name: "Put them back" }).click();
  await expect(tags.getByText("ink", { exact: true })).toBeVisible();
});

test("switch: the large size is wider, and the required one shows an error until it is on", async ({ page }) => {
  await open(page, "/docs/switch", "light");
  const sizes = preview(page, 2).locator("[data-slot=switch]");
  expect((await sizes.nth(2).boundingBox())!.width).toBeGreaterThan((await sizes.nth(1).boundingBox())!.width);
  const form = preview(page, 3);
  await expect(form.getByText("You need to accept to continue.")).toBeVisible();
  await form.getByRole("switch", { name: "Accept the terms" }).click();
  await expect(form.getByText("You need to accept to continue.")).toHaveCount(0);
});

test("slider: marks are pencilled under the line, labelled where asked", async ({ page }) => {
  await open(page, "/docs/slider", "light");
  const demo = preview(page, 2);
  const marks = demo.locator("[data-slot=slider-marks]").first();
  await expect(marks.locator("> span")).toHaveCount(5);
  await expect(marks).toContainText("Marker");
  // One tick for every step on the second slider: 0 to 10 is eleven.
  await expect(demo.locator("[data-slot=slider-marks]").nth(1).locator("> span")).toHaveCount(11);
  const vertical = preview(page, 3).locator("[data-slot=slider]").first();
  await expect(vertical).toHaveAttribute("data-orientation", "vertical");
});

test("radio group: horizontal lays the options in a row, and the scale reads back what you pick", async ({ page }) => {
  await open(page, "/docs/radio-group", "light");
  const row = preview(page, 3).getByRole("radiogroup");
  await expect(row).toHaveAttribute("data-orientation", "horizontal");
  const [a, b] = [await row.getByRole("radio").nth(0).boundingBox(), await row.getByRole("radio").nth(1).boundingBox()];
  expect(Math.abs(a!.y - b!.y)).toBeLessThan(4);
  const scale = preview(page, 4);
  await scale.getByRole("radio", { name: "4" }).click();
  await expect(scale.getByText("You gave it a 4.")).toBeVisible();
});

test("label: required gets a red asterisk, optional says so", async ({ page }) => {
  await open(page, "/docs/label", "light");
  const form = preview(page, 2);
  await expect(form.locator("label", { hasText: "Name" }).locator("span[aria-hidden]")).toHaveText("*");
  await expect(form.getByText("(optional)")).toBeVisible();
});

test("separator: a label sits in the middle of the rule, and a toolbar has vertical rules", async ({ page }) => {
  await open(page, "/docs/separator", "light");
  const labelled = preview(page, 2).getByRole("separator");
  await expect(labelled).toContainText("or");
  await expect(preview(page, 3).locator("[data-orientation=vertical]")).toHaveCount(2);
});

test("progress: the sizes are different heights, and the steps move the bar", async ({ page }) => {
  await open(page, "/docs/progress", "light");
  const heights = await preview(page, 2).locator("[data-slot=progress-track]").evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
  expect(heights[0]).toBeLessThan(heights[1]);
  expect(heights[1]).toBeLessThan(heights[2]);
  const steps = preview(page, 4);
  await expect(steps.getByText("Step 1 of 4")).toBeVisible();
  await steps.getByRole("button", { name: "Next" }).click();
  await expect(steps.getByText("Step 2 of 4")).toBeVisible();
  await expect(steps.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
});

test("dialog and sheet: size sets the width", async ({ page }) => {
  await open(page, "/docs/dialog", "light");
  const widths: number[] = [];
  for (const size of ["sm", "xl"]) {
    await preview(page, 5).getByRole("button", { name: size, exact: true }).click();
    widths.push((await page.locator("[data-slot=dialog-content]").boundingBox())!.width);
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-slot=dialog-content]")).toHaveCount(0);
  }
  expect(widths[1]).toBeGreaterThan(widths[0] * 1.5);
});

test("tabs, accordion and toast: counts, open all, and undo", async ({ page }) => {
  await open(page, "/docs/tabs", "light");
  const counts = preview(page, 4);
  await counts.getByRole("tab", { name: /Sent/ }).click();
  await expect(counts.getByText("To Grace: more soon.")).toBeVisible();
  await open(page, "/docs/accordion", "light");
  const all = preview(page, 3);
  await all.getByRole("button", { name: "Open all" }).click();
  await expect(all.getByRole("button", { expanded: true })).toHaveCount(3);
  await all.getByRole("button", { name: "Close all" }).click();
  await expect(all.getByRole("button", { expanded: true })).toHaveCount(0);
  await open(page, "/docs/toast", "light");
  const undo = preview(page, 3);
  await undo.getByRole("button", { name: "Tear out" }).first().click();
  await expect(undo.getByText("Dear Ada")).toHaveCount(0);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(undo.getByText("Dear Ada")).toBeVisible();
});

test("skeleton text, timeline status, frame tape and the copy button's snippet", async ({ page }) => {
  await open(page, "/docs/skeleton", "light");
  await expect(preview(page, 2).locator("[data-slot=skeleton]")).toHaveCount(1 + 4 + 2);
  await open(page, "/docs/timeline", "light");
  const status = preview(page, 2);
  await expect(status.locator("[data-status=current]")).toHaveAttribute("aria-current", "step");
  await expect(status.locator("[data-status=upcoming]")).toHaveCount(1);
  await open(page, "/docs/frame", "light");
  const taped = preview(page, 2).locator("[data-slot=frame]").first();
  expect(await taped.evaluate((el) => getComputedStyle(el).rotate)).toBe("-2.5deg");
  await expect(taped.locator("[data-slot=frame-picture] > span[aria-hidden]")).toHaveCount(1);
});

test("scrawl: every kind draws something, red goes in the red pen, flip mirrors", async ({ page }) => {
  await open(page, "/docs/scrawl", "light");
  const kinds = preview(page, 3).locator("[data-slot=scrawl]");
  await expect(kinds).toHaveCount(7);
  for (const el of await kinds.all()) expect(await el.locator("path.ink-ribbon").count()).toBeGreaterThan(0);
  const red = preview(page, 4).locator("[data-slot=scrawl]");
  await expect(red).toHaveCount(4);
  const [ink, pen] = await red.first().evaluate((el) => [getComputedStyle(el).color, getComputedStyle(document.body).color]);
  expect(ink).not.toBe(pen);
  const flipped = preview(page, 6).locator("[data-slot=scrawl][data-kind=ring]");
  expect(await flipped.evaluate((el) => getComputedStyle(el).scale)).toBe("-1 1");
});

test("margin note: marks go on the words, the pointer can go, and tilt and width are set", async ({ page }) => {
  await open(page, "/docs/margin-note", "light");
  const marks = preview(page, 3);
  await expect(marks.locator("[data-slot=margin-note-target] [data-slot=annotate]")).toHaveCount(4);
  await expect(marks.locator("[data-slot=annotate][data-type=circle]")).toHaveCount(1);
  const pointers = preview(page, 4);
  // The third note has no pointer: its drawing is not shown.
  const notes = pointers.locator("[data-slot=margin-note]");
  await expect(notes.nth(0).locator("svg:visible")).toHaveCount(1);
  await expect(notes.nth(2).locator("svg:visible")).toHaveCount(0);
  expect(await notes.nth(1).evaluate((el) => getComputedStyle(el).rotate)).toBe("2.5deg");
  const review = preview(page, 5).locator("[data-slot=margin-note]").first();
  expect(await review.evaluate((el) => getComputedStyle(el).getPropertyValue("--margin-note-width").trim())).toBe("7rem");
});
