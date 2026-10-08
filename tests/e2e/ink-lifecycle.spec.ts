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
