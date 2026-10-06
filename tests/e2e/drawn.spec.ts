import { expect, test } from "@playwright/test";

// The drawn set: marks that wait for the reader, a heading written in,
// a copy button that says so.

test("annotate waits until it scrolls into view, then draws", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/docs/annotate", { waitUntil: "networkidle" });

  const mark = page.locator("[data-preview]").nth(1).locator("[data-slot=annotate][data-type=circle] > svg");
  await expect(mark).toHaveAttribute("data-ink-pending", "");
  const waiting = await mark.locator("path.ink-draw").first().evaluate((p) => {
    const cs = getComputedStyle(p);
    return { animation: cs.animationName, offset: cs.strokeDashoffset };
  });
  expect(waiting).toEqual({ animation: "none", offset: "1.05px" });

  await mark.scrollIntoViewIfNeeded();
  await expect(mark).not.toHaveAttribute("data-ink-pending");
  await expect(mark.locator("path.ink-draw").first()).toHaveClass(/ink-drawn/, { timeout: 4000 });
});

test("annotate marks hug the words, not the line they sit in", async ({ page }) => {
  await page.goto("/docs/annotate", { waitUntil: "networkidle" });
  const word = page.locator("[data-preview]").first().locator("[data-slot=annotate]").first();
  const [box, size] = await word.evaluate((el) => [el.getBoundingClientRect().height, parseFloat(getComputedStyle(el).fontSize)]);
  expect(box).toBeLessThan(size * 1.3);
});

test("annotate with active draws in and pulls back out", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/annotate", { waitUntil: "networkidle" });
  const demo = page.locator("[data-preview]").nth(2);
  const milk = demo.locator("[data-slot=annotate][data-type=strike]");
  const plumber = demo.locator("[data-slot=annotate][data-type=circle]");
  await expect(milk).not.toHaveAttribute("data-checked");
  await expect(plumber).toHaveAttribute("data-checked", "");
  const shown = (el: typeof milk) => el.locator("path.ink-checked-draw").first().evaluate((p) => getComputedStyle(p).opacity);
  expect(await shown(milk)).toBe("0");
  expect(await shown(plumber)).toBe("1");

  await demo.getByRole("button", { name: "Done" }).click();
  await expect(milk).toHaveAttribute("data-checked", "");
  await expect(plumber).not.toHaveAttribute("data-checked");
  expect(await shown(milk)).toBe("1");
  expect(await shown(plumber)).toBe("0");
});

test("section heading is written in once it scrolls into view", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/docs/section-heading", { waitUntil: "networkidle" });

  // The docs' own headings are section headings; the last is below the fold.
  const heading = page.locator("[data-slot=section-heading]").last();
  const write = () => heading.locator(".ink-write").evaluate((h) => getComputedStyle(h).getPropertyValue("--ink-write"));
  expect(await write()).toBe("0%");
  await heading.scrollIntoViewIfNeeded();
  await expect.poll(write, { timeout: 4000 }).toBe("130%");
});

test("copy button copies, says so, and swaps back", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/copy-button", { waitUntil: "networkidle" });
  const demo = page.locator("[data-preview]").first();
  // Located by slot: its accessible name changes to "Copied" while it says so.
  const button = demo.locator("[data-slot=copy-button]").first();
  await expect(button).toHaveAccessibleName("Copy email");

  await button.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("hello@example.com");
  await expect(button).toHaveAttribute("data-copied", "");
  await expect(button).toHaveAccessibleName("Copied");
  await expect(demo.getByRole("status").first()).toHaveText("Copied to clipboard");
  await expect(button.locator("[data-glyph=check]")).toBeVisible();
  await expect(button).not.toHaveAttribute("data-copied", { timeout: 3000 });

  // Icon size: named by its label, swaps the copy icon for the tick.
  const icon = demo.locator("[data-slot=copy-button]").nth(1);
  await expect(icon).toHaveAccessibleName("Copy command");
  await expect(icon.locator("[data-glyph=copy]")).toBeVisible();
  await icon.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("npx shadcn@latest add @ballpoint/copy-button");
  await expect(icon.locator("[data-glyph=check]")).toBeVisible();
});

test("paper: textured, ruled on the baseline, rings where asked", async ({ page }) => {
  await page.goto("/docs/paper", { waitUntil: "networkidle" });
  const sheets = page.locator("[data-slot=paper]");
  await expect(sheets).toHaveCount(4);
  for (const sheet of await sheets.all()) {
    expect(await sheet.evaluate((el) => getComputedStyle(el).backgroundImage)).toContain("data:image/svg+xml");
  }
  // One coffee ring on the plain sheet.
  await expect(sheets.first().locator("> span[aria-hidden]")).toHaveCount(1);
  // The ruled sheet's line height is its rule spacing.
  const ruled = page.locator("[data-slot=paper][data-variant=ruled]");
  expect(await ruled.evaluate((el) => getComputedStyle(el).lineHeight)).toBe("32px");
});

test("ink icons: every icon is drawn, and can be named", async ({ page }) => {
  await page.goto("/docs/ink-icons", { waitUntil: "networkidle" });
  const icons = page.locator("[data-preview] svg[data-slot=ink-glyph]");
  expect(await icons.count()).toBeGreaterThanOrEqual(50);
  for (const icon of await icons.all()) {
    expect(await icon.locator("path").count()).toBeGreaterThan(0);
    await expect(icon).toHaveAttribute("aria-hidden", "true");
  }
});
