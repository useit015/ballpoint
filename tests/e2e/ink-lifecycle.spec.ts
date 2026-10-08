import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/dev/ink-lifecycle", { waitUntil: "networkidle" });
});

test("a conditionally attached SVG releases the heading and measures its box", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle specks" }).click();
  const drawings = page.locator("[data-slot=section-heading] > svg");
  await expect(drawings).toHaveCount(2);
  await expect(page.locator("[data-slot=section-heading] > svg[data-ink-pending]")).toHaveCount(0);
  await expect.poll(() => page.getByRole("heading", { name: "Conditional drawing" }).evaluate((el) => getComputedStyle(el).getPropertyValue("--ink-write").trim())).toBe("130%");
  await page.getByRole("button", { name: "Toggle specks" }).click();
  await page.getByRole("button", { name: "Toggle specks" }).click();
  await expect(page.locator("[data-slot=section-heading] > svg[data-ink-pending]")).toHaveCount(0);
});

test("draw-mode and SVG replacement changes keep auto drawings registered", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle variant" }).click();
  await page.getByRole("button", { name: "Set auto", exact: true }).click();
  const svg = page.getByTestId("dynamic-button").locator(":scope > svg");
  await expect(svg).not.toHaveAttribute("data-ink-pending");
  await page.getByRole("button", { name: "Set mount", exact: true }).click();
  await page.getByRole("button", { name: "Set auto", exact: true }).click();
  await expect(svg).not.toHaveAttribute("data-ink-pending");
  await page.getByRole("button", { name: "Toggle variant" }).click();
  await page.getByRole("button", { name: "Toggle variant" }).click();
  await expect(svg).not.toHaveAttribute("data-ink-pending");
});

test("direct and provider animation opt-outs leave hatch columns finished", async ({ page }) => {
  for (const name of ["Direct opt-out", "Provider opt-out"]) {
    const svg = page.getByRole("img", { name });
    await expect(svg.locator("g.ink-land")).toHaveCount(0);
    expect(await svg.locator(":scope > g").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  }
});

// One pen: what's in view together is drawn in reading order, each part
// once the one before is under way; what's further down waits to be seen.
test.describe("drawing order", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { released: string[] };
      w.released = [];
      new MutationObserver((records) => {
        for (const r of records) {
          const el = r.target as Element;
          if (el.hasAttribute("data-ink-pending")) continue;
          const part = el.tagName === "svg" ? el.parentElement! : el;
          // The page's own drawings, not the site's header.
          if (part.closest("main")) w.released.push(part.getAttribute("data-testid") ?? part.getAttribute("data-slot") ?? part.textContent!.trim());
        }
      }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-ink-pending"] });
    });
  });

  test("in view together, drawn in reading order, one after another", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto("/dev/ink-order", { waitUntil: "networkidle" });
    // Held until the pen gets to it.
    const list = page.getByTestId("list");
    await expect.poll(() => page.evaluate(() => (window as unknown as { released: string[] }).released.length), { timeout: 5000 }).toBe(4);
    const released = await page.evaluate(() => (window as unknown as { released: string[] }).released);
    expect(released).toEqual(["section-heading", "list", "section-heading", "separator"]);
    await expect(list).not.toHaveAttribute("data-ink-pending");
    await expect.poll(() => list.locator("li").last().evaluate((li) => getComputedStyle(li).opacity)).toBe("1");
    // Below the fold still waits.
    await expect(page.locator("[data-slot=section-heading] > svg[data-ink-pending]")).toHaveCount(1);
    await page.getByRole("heading", { name: "Below" }).scrollIntoViewIfNeeded();
    await expect(page.locator("[data-slot=section-heading] > svg[data-ink-pending]")).toHaveCount(0);
  });

  test("a stage holds what lands in it until its turn", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto("/dev/ink-order", { waitUntil: "commit" });
    const first = page.getByTestId("list").locator("li").first();
    await expect(page.getByTestId("list")).toHaveAttribute("data-ink-pending", "");
    expect(await first.evaluate((li) => getComputedStyle(li).opacity)).toBe("0");
    await expect(page.getByTestId("list")).not.toHaveAttribute("data-ink-pending");
  });
});
