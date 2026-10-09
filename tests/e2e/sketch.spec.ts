import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The front page's sheet takes ink: what's drawn on it is read, and drawn
// again as what it was meant to be, with the code for it written beside it.

type P = { x: number; y: number };
const along = (a: P, b: P, n: number) => Array.from({ length: n + 1 }, (_, i) => ({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n }));
const box = (x: number, y: number, w: number, h: number) => [
  ...along({ x, y }, { x: x + w, y }, 14),
  ...along({ x: x + w, y }, { x: x + w, y: y + h }, 6),
  ...along({ x: x + w, y: y + h }, { x, y: y + h }, 14),
  ...along({ x, y: y + h }, { x: x + 2, y: y - 4 }, 6),
];

async function stroke(page: Page, points: P[]) {
  await page.mouse.move(points[0].x, points[0].y);
  await page.mouse.down();
  for (const p of points.slice(1)) await page.mouse.move(p.x, p.y, { steps: 2 });
  await page.mouse.up();
}

/** A spot of blank paper in the hero, right of the headline's first line. */
async function blank(page: Page) {
  const line = await page.locator("#hero > span").first().boundingBox();
  return { x: line!.x + line!.width + 60, y: line!.y + line!.height / 2 - 26 };
}

test("a box drawn on blank paper becomes a button, with its code beside it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const at = await blank(page);
  await stroke(page, box(at.x, at.y, 180, 52));
  const drawn = page.locator("[data-sketch-item]").getByRole("button", { name: "Ship it" });
  await expect(drawn).toBeVisible();
  await expect(page.locator(".sketch-code")).toHaveText("<Button>Ship it</Button>");
  await expect(page.locator(".sketch > p[aria-live]")).toHaveText("Drew a button.");
  // The rough stroke gives way to it.
  await expect(page.locator(".sketch-raw")).toHaveCount(0);
});

test("a word circled or scribbled out is marked up; a doodle stays as drawn", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const word = await page.locator("#hero").evaluate((h1) => {
    const text = [...h1.querySelectorAll("span")].map((s) => s.firstChild as Text).find((n) => n.data.includes("write"))!;
    const range = document.createRange();
    range.setStart(text, text.data.indexOf("write"));
    range.setEnd(text, text.data.indexOf("write") + 5);
    const r = range.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  });
  const loop = Array.from({ length: 41 }, (_, i) => {
    const a = -2.5 + (i / 40) * Math.PI * 2.2;
    return { x: word.x + word.w / 2 + Math.cos(a) * (word.w / 2 + 14), y: word.y + word.h / 2 + Math.sin(a) * (word.h / 2 + 6) };
  });
  await stroke(page, loop);
  await expect(page.locator(".sketch-code")).toHaveText('<Annotate type="circle">');

  const lede = await page.getByText("built on Base").boundingBox();
  await stroke(page, Array.from({ length: 12 }, (_, i) => ({ x: lede!.x + (i * 90) / 11, y: lede!.y + (i % 2 ? lede!.height - 6 : 6) })));
  const scribbled = page.getByRole("button", { name: /Words you scribbled out/ });
  await expect(scribbled).toHaveAttribute("aria-pressed", "false");
  await scribbled.click();
  await expect(scribbled).toHaveAttribute("aria-pressed", "true");

  const at = await blank(page);
  await stroke(page, Array.from({ length: 40 }, (_, i) => ({ x: at.x + i * 5, y: at.y + Math.sin(i / 3) * 14 })));
  await expect(page.locator(".sketch-raw")).toHaveCount(1);

  // Undo takes the doodle; the rubber takes the rest.
  await page.keyboard.press("ControlOrMeta+z");
  await expect(page.locator(".sketch-raw")).toHaveCount(0);
  await page.getByRole("button", { name: /Rub out/ }).click();
  await expect(page.locator(".sketch-code")).toHaveCount(0);
});

test("drawing doesn't start on links, buttons or code", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const start = await page.getByRole("link", { name: "Get started" }).boundingBox();
  await stroke(page, box(start!.x + 10, start!.y + 10, 120, 30));
  await expect(page.locator("[data-sketch-item], .sketch-raw")).toHaveCount(0);
});

test("the pen shows how once the page has written itself in, and stays still for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".sketch-code")).toHaveText(["<Button>Ship it</Button>", '<Annotate type="circle">'], { timeout: 12000 });
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(4000);
  await expect(page.locator(".sketch-code")).toHaveCount(0);
});

test("on a touch screen a finger scrolls until the pen is picked up", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  const cdp = await context.newCDPSession(page);
  const drag = async (points: P[]) => {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [points[0]] });
    for (const p of points.slice(1)) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [p] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };
  await drag(along({ x: 200, y: 600 }, { x: 200, y: 400 }, 12));
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await expect(page.locator(".sketch-raw, [data-sketch-item]")).toHaveCount(0);
  // Let the fling run out before going back up.
  await page.waitForTimeout(1500);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  const pick = page.getByRole("button", { name: "Pick up the pen" });
  await expect(pick).toBeVisible();
  await pick.tap();
  await expect(page.getByRole("button", { name: "Put the pen down" })).toHaveAttribute("aria-pressed", "true");
  const hint = await page.locator(".guide-try").boundingBox();
  await drag(box(hint!.x + 4, hint!.y + hint!.height + 16, 150, 46));
  await expect(page.locator("[data-sketch-item]").getByRole("button", { name: "Ship it" })).toBeVisible();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await context.close();
});
