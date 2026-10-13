import { expect, test } from "@playwright/test";
import { open } from "./routes";

// The front page: everything on it that can be used, used.

test("the hero says what it is and points to the two places to go", async ({ page }) => {
  await open(page, "/", "light");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("An interface you can write on.");
  await expect(page.getByRole("link", { name: "Get started" })).toHaveAttribute("href", "/docs");
  await expect(page.getByRole("link", { name: "Browse components" })).toHaveAttribute("href", "/components");
});

test("each section has its heading, in order", async ({ page }) => {
  await open(page, "/", "light");
  const headings = await page.locator("main h2").allTextContents();
  expect(headings).toEqual(["Components, out of the box", "Simple, familiar API", "Customize your style", "Put the paper and ink in your app"]);
});

test("the Annotate demo changes its mark, and the code that makes it", async ({ page }) => {
  await open(page, "/", "light");
  const kinds = page.getByRole("radiogroup", { name: "Kind of mark" });
  await expect(kinds.getByRole("radio", { name: "highlight" })).toBeChecked();
  await kinds.getByRole("radio", { name: "circle" }).click();
  await expect(kinds.getByRole("radio", { name: "circle" })).toBeChecked();
  await expect(page.getByText('<Annotate type="circle">')).toBeVisible();
});

test("a redacted word is read by clicking it", async ({ page }) => {
  await open(page, "/", "light");
  const word = page.getByRole("button", { name: /The launch date, press to show/ });
  await word.click();
  await expect(page.getByRole("button", { name: "14 June" })).toHaveAttribute("aria-pressed", "true");
});

test("the checklist ticks and unticks", async ({ page }) => {
  await open(page, "/", "light");
  const item = page.getByRole("checkbox", { name: "Drink more coffee" });
  await expect(item).not.toBeChecked();
  await item.click();
  await expect(item).toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Ship something great" })).toBeChecked();
});

test("the subscribe demo works and says it sends nothing", async ({ page }) => {
  await open(page, "/", "light");
  const form = page.locator(".api-form");
  await form.locator("#api-email").fill("pat@example.com");
  await form.getByRole("button", { name: "Subscribe" }).click();
  await expect(form.getByRole("button", { name: "Subscribed" })).toBeVisible();
  await expect(form.getByText("Only a demo: nothing was sent.")).toBeVisible();
});

test("the code tabs swap the code and copy what is showing", async ({ page, context }) => {
  await open(page, "/", "light");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const code = page.locator(".api-code");
  await expect(code).toContainText("export function Subscribe()");
  await code.getByRole("tab", { name: "Install" }).click();
  await expect(code).toContainText("shadcn@latest add @ballpoint/button");
  await code.getByRole("button", { name: "Copy to clipboard" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("add @ballpoint/button");
});

test("picking a pen and a paper changes the specimen, with the keyboard too", async ({ page }) => {
  await open(page, "/", "light");
  const specimen = page.getByRole("group", { name: "Specimen" });
  await expect(specimen).toContainText("Blue ballpoint on cream.");
  await page.locator("label.pick", { hasText: "Green ink" }).click();
  await page.locator("label.pick", { hasText: "Legal pad" }).click();
  await expect(specimen).toContainText("Green ink on legal pad.");
  await expect(specimen).toContainText("Passes WCAG AA by day");
  // Arrow keys move through the pens, as through any radio group.
  const pens = page.getByRole("radiogroup", { name: "Pens" });
  await pens.getByRole("radio", { name: "Green ink" }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(pens.getByRole("radio", { name: "Pencil" })).toBeChecked();
  await expect(specimen).toContainText("Pencil on legal pad.");
});

test("the night side turns the whole page to night", async ({ page }) => {
  await open(page, "/", "light");
  const night = page.getByRole("switch", { name: "Turn the page to night" });
  await night.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await night.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("the landscape at the foot is drawn when the page gets there", async ({ page }) => {
  await open(page, "/", "light");
  await expect(page.locator(".foot-art path")).toHaveCount(0);
  await page.locator(".home-footer").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".foot-art path").count()).toBeGreaterThan(100);
});

test("the front page has one footer, and the other pages keep theirs", async ({ page }) => {
  await open(page, "/", "light");
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator(".home-footer")).toBeVisible();
  await open(page, "/docs", "light");
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator(".home-footer")).toHaveCount(0);
});

test("on a phone nothing is wider than the screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, "/", "light");
  await page.locator(".home-footer").scrollIntoViewIfNeeded();
  const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, window: innerWidth }));
  expect(widths.page).toBeLessThanOrEqual(widths.window);
});

test("every note's arrow is drawn, and it lands by the thing the note is about", async ({ page }) => {
  await open(page, "/", "light");
  // Each note, and what it is about; the arrow's box must reach to within a hand's width of it.
  const notes = [
    ["Same components.", "#hero-art"],
    ["Go on, click them.", "#demo-redact"],
    ["Just like shadcn.", "#api-code"],
    ["Flip it.", "#night-control"],
    ["Then add what you need.", "#start-command"],
  ] as const;
  for (const [text, target] of notes) {
    const note = page.locator(".callout", { hasText: text });
    await note.scrollIntoViewIfNeeded();
    await expect.poll(() => note.locator(".callout-arrow path").count(), { message: text }).toBeGreaterThan(0);
    const gap = await note.evaluate((el, sel) => {
      const a = el.querySelector(".callout-arrow")!.getBoundingClientRect();
      const t = document.querySelector(sel)!.getBoundingClientRect();
      return Math.max(t.left - a.right, a.left - t.right, t.top - a.bottom, a.top - t.bottom, 0);
    }, target);
    expect(gap, `${text} → ${target}`).toBeLessThanOrEqual(24);
  }
});

test("pointing at a line of code marks its part of the form, and the form marks its line", async ({ page }) => {
  await open(page, "/", "light");
  const grid = page.locator(".api-grid");
  await page.locator('.api-code .line[data-for="button"]').hover();
  await expect(grid).toHaveAttribute("data-part", "button");
  await page.locator('.api-code .line[data-for="input"]').hover();
  await expect(grid).toHaveAttribute("data-part", "input");
  await page.mouse.move(5, 5);
  await expect(grid).not.toHaveAttribute("data-part", /.+/);
  // From the other side: tabbing into the form.
  await page.locator("#api-email").focus();
  await expect(grid).toHaveAttribute("data-part", "input");
  await expect(page.locator('.api-code .line[data-for="input"]')).toHaveCSS("box-shadow", /inset/);
});

test("the margin note says whatever you write in it", async ({ page }) => {
  await open(page, "/", "light");
  await page.getByLabel("Your note").fill("Mind the gap");
  await expect(page.locator('[data-slot="margin-note"]')).toHaveText("Mind the gap");
});

test("the Scrawl page takes a scrawl wherever you click, and clears", async ({ page }) => {
  await open(page, "/", "light");
  const marks = page.locator(".demo-scrawl-mark");
  const before = await marks.count();
  await page.locator(".demo-scrawl-pad").click({ position: { x: 40, y: 30 } });
  await expect(marks).toHaveCount(before + 1);
  await page.getByRole("button", { name: "Clear" }).first().click();
  await expect(marks).toHaveCount(0);
});

test("finish the checklist and the pen celebrates", async ({ page }) => {
  await open(page, "/", "light");
  await expect(page.getByText("1 of 3 done")).toBeVisible();
  await page.getByRole("checkbox", { name: "Drink more coffee" }).click();
  await page.getByRole("checkbox", { name: "Touch grass (maybe)" }).click();
  await expect(page.getByText("All done. Go outside.")).toBeVisible();
  await expect(page.locator(".demo-burst")).toBeVisible();
});

test("picking a pen and a paper dresses the whole page, and putting them back undoes it", async ({ page }) => {
  await open(page, "/", "light");
  const html = page.locator("html");
  await page.locator("label.pick", { hasText: "Green ink" }).click();
  await expect(html).toHaveAttribute("data-pen", "green");
  const ink = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--ink").trim());
  expect(ink).toContain("0.38 0.1 158");
  await page.locator("label.pick", { hasText: "Legal pad" }).click();
  await expect(html).toHaveAttribute("data-paper", "legal");
  await page.locator("label.pick", { hasText: "Blue ballpoint" }).click();
  await page.locator("label.pick", { hasText: "Cream" }).click();
  await expect(html).not.toHaveAttribute("data-pen", /.+/);
  await expect(html).not.toHaveAttribute("data-paper", /.+/);
});

test("the sun is a button that turns the page to night, and the moon turns it back", async ({ page }) => {
  await open(page, "/", "light");
  await page.getByRole("button", { name: "The sun: turn the page to night" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "The moon: turn the page to day" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("the man in the boat has a bite when he is poked", async ({ page }) => {
  await open(page, "/", "light");
  const boat = page.getByRole("button", { name: "The fisherman: give him a bite" });
  await boat.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".boat-rig")).toHaveAttribute("data-bite", "");
  await expect(page.locator(".boat-rig")).not.toHaveAttribute("data-bite", "", { timeout: 6000 });
});

test("birds scatter when a pointer passes over them, and a pine sways", async ({ page }) => {
  await open(page, "/", "light");
  await page.locator(".flock .hit").first().hover();
  await expect(page.locator(".flock")).toHaveAttribute("data-scared", "");
  await page.locator(".tree-hit").nth(2).hover();
  await expect(page.locator("#hero-art g.tree.t2")).toHaveAttribute("data-sway", "");
  // Pressing one shakes it, and it lets go of what it held.
  await page.locator(".tree-hit").nth(1).click();
  await expect(page.locator("#hero-art g.tree.t1")).toHaveAttribute("data-shake", "");
  await expect(page.locator("#hero-art .fleck").first()).toBeAttached();
});

test("the people on the trail walk, and say something when they are poked", async ({ page }) => {
  await open(page, "/", "light");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".home-footer").scrollIntoViewIfNeeded();
  await expect(page.locator(".hiker")).toHaveCount(5, { timeout: 15_000 });
  const at = () => page.locator(".hiker").first().evaluate((el) => Number(/translate\(([-\d.]+)/.exec(el.getAttribute("transform") ?? "")?.[1]));
  const before = await at();
  await expect.poll(at, { timeout: 8000 }).not.toBe(before);
  // Asked, the first says something, in a bubble, and stays where it is while it does.
  const first = page.getByRole("button", { name: /^Hiker 1 of 5/ });
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".say").first()).toBeVisible();
  // Arrow keys go on to the next.
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: /^Hiker 2 of 5/ })).toBeFocused();
});

test("the fire can be stoked and the tent looked into", async ({ page }) => {
  await open(page, "/", "light");
  await page.locator(".home-footer").scrollIntoViewIfNeeded();
  await expect(page.locator(".fire")).toHaveCount(1, { timeout: 15_000 });
  await page.getByRole("button", { name: "The campfire: stoke it" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".fire")).toHaveAttribute("data-stoked", "");
  await page.getByRole("button", { name: "The tent: see who is in" }).focus();
  await page.keyboard.press("Space");
  await expect(page.locator(".tent-poke")).toHaveAttribute("data-open", "");
  await expect(page.locator(".say")).toBeVisible();
});

test("the panel beside the pens shows the side the page is not on", async ({ page }) => {
  await open(page, "/", "light");
  const panel = page.locator(".custom-night");
  await panel.scrollIntoViewIfNeeded();
  await expect(panel).toHaveAccessibleName("The night side");
  await expect(panel).toHaveClass(/\bdark\b/);
  await expect(panel.locator(".art-night").first()).toHaveCSS("visibility", "visible");
  await expect(panel.locator(".art-day").first()).toHaveCSS("visibility", "hidden");
  await page.getByRole("switch", { name: "Turn the page to night" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(panel).toHaveAccessibleName("The day side");
  await expect(panel).not.toHaveClass(/\bdark\b/);
  await expect(panel.locator(".art-day").first()).toHaveCSS("visibility", "visible");
  await expect(panel.locator(".art-night").first()).toHaveCSS("visibility", "hidden");
  // Its paper is the day's, though the page is at night.
  const paper = await panel.evaluate((el) => getComputedStyle(el).backgroundColor);
  const page_ = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  expect(paper).not.toBe(page_);
});

test("sheets and slips take the paper that was picked, not only the page", async ({ page }) => {
  await open(page, "/", "light");
  const sheet = page.locator(".torn-paper").first();
  const cream = await sheet.evaluate((el) => getComputedStyle(el).backgroundImage);
  const yellow = await page.locator(".sticky-note").evaluate((el) => getComputedStyle(el).getPropertyValue("--sticky"));
  await page.locator("label.pick", { hasText: "Legal pad" }).click();
  await expect.poll(() => sheet.evaluate((el) => getComputedStyle(el).backgroundImage)).not.toBe(cream);
  await expect(sheet).toHaveCSS("background-image", /slip-legal-light/);
  // A sticky note that would be the colour of the paper is another colour.
  const note = await page.locator(".sticky-note").evaluate((el) => getComputedStyle(el).getPropertyValue("--sticky"));
  expect(note).not.toBe(yellow);
  await page.locator("label.pick", { hasText: "Cream" }).click();
  await expect(sheet).toHaveCSS("background-image", cream);
});
