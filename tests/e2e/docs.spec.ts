import { expect, test } from "@playwright/test";
import { open } from "./routes";

// The docs shell: the index, the page header, the snippets, the components list.

test("the index marks the page you are on, and carries a breadcrumb to it", async ({ page }) => {
  await open(page, "/docs/button", "light");
  const index = page.getByRole("navigation", { name: "Docs" });
  await expect(index.getByRole("link", { name: "Button", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(index.locator('[aria-current="page"]')).toHaveCount(1);
  const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(crumbs.getByRole("link", { name: "Components" })).toHaveAttribute("href", "/components");
  await expect(crumbs.getByText("Button")).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Button");
});

test("only the group you are in is open, and a group opens and folds from its title", async ({ page }) => {
  await open(page, "/docs/annotate", "light");
  const index = page.getByRole("navigation", { name: "Docs" });
  const components = index.getByRole("button", { name: /^Components/ });
  const drawn = index.getByRole("button", { name: /^Drawn/ });
  await expect(drawn).toHaveAttribute("aria-expanded", "true");
  await expect(components).toHaveAttribute("aria-expanded", "false");
  await expect(index.getByRole("link", { name: "Accordion" })).toBeHidden();
  await components.click();
  await expect(index.getByRole("link", { name: "Accordion" })).toBeVisible();
  // Going to a page in the other group folds this one.
  await index.getByRole("link", { name: "Button", exact: true }).click();
  await page.waitForURL("**/docs/button");
  await expect(drawn).toHaveAttribute("aria-expanded", "false");
  await expect(components).toHaveAttribute("aria-expanded", "true");
});

test("the index scrolls on its own, and at its end the wheel goes on into the page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 700 });
  await open(page, "/docs/button", "light");
  const index = page.getByRole("navigation", { name: "Docs" });
  await index.getByRole("button", { name: /^Drawn/ }).click();
  const box = page.locator(".docs-scroll");
  await expect(box).toHaveCSS("overscroll-behavior-y", "auto");
  expect(await box.evaluate((el) => el.scrollHeight - el.clientHeight)).toBeGreaterThan(300);
  await box.evaluate((el) => (el.scrollTop = 0));
  const before = await page.evaluate(() => scrollY);
  await page.mouse.move(120, 400);
  await page.mouse.wheel(0, 200);
  await expect.poll(() => box.evaluate((el) => el.scrollTop)).toBeGreaterThan(100);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  for (let i = 0; i < 10; i++) await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 200);
});

test("Jump to opens the search", async ({ page }) => {
  await open(page, "/docs/button", "light");
  await page.getByRole("button", { name: /Jump to/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.type("dialog");
  await expect(page.getByRole("dialog").getByRole("option").first()).toBeVisible();
});

test("on this page follows where you are reading", async ({ page }) => {
  await open(page, "/docs/button", "light");
  const toc = page.getByRole("navigation", { name: "On this page" });
  await expect(toc.getByRole("link", { name: "Installation" })).toHaveAttribute("aria-current", "location");
  await page.locator("#api").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("api")!.scrollIntoView({ behavior: "instant" }));
  await expect(toc.getByRole("link", { name: "API reference" })).toHaveAttribute("aria-current", "location");
});

test("a long listing is folded to its first lines, and opens", async ({ page }) => {
  await open(page, "/docs/button", "light");
  await page.getByRole("button", { name: /copy the source/i }).click();
  const fold = page.locator("#installation").locator("xpath=ancestor::section").locator(".code-fold").first();
  await expect(fold).toBeVisible();
  await expect(fold).toHaveAttribute("data-folded", "");
  const folded = (await fold.boundingBox())!.height;
  await fold.getByRole("button", { name: /Show all \d+ lines/ }).click();
  await expect(fold).not.toHaveAttribute("data-folded", "");
  expect((await fold.boundingBox())!.height).toBeGreaterThan(folded * 3);
  await expect(fold.getByRole("button", { name: "Fold it up" })).toHaveAttribute("aria-expanded", "true");
});

test("a short snippet has line numbers and is not folded", async ({ page }) => {
  await open(page, "/docs/button", "light");
  const usage = page.locator("#usage").locator("xpath=ancestor::section").locator(".code-block");
  await expect(usage).toHaveAttribute("data-numbers", "");
  await expect(usage.locator(".code-fold")).toHaveCount(0);
  await expect(usage.locator(".line").first()).toContainText("import { Button }");
});

test("the components list filters as you type, and says when nothing matches", async ({ page }) => {
  await open(page, "/components", "light");
  const filter = page.getByRole("searchbox", { name: "Filter components" });
  const cards = page.locator(".index-card");
  const all = await cards.count();
  expect(all).toBeGreaterThan(30);
  await filter.fill("dialog");
  await expect(page.getByText(/\d+ of \d+ match/)).toBeVisible();
  const some = await cards.count();
  expect(some).toBeGreaterThan(0);
  expect(some).toBeLessThan(all);
  await expect(cards.first().getByRole("link")).toContainText(/Dialog/);
  await filter.fill("zzzz");
  await expect(page.getByText(/Nothing drawn for/)).toBeVisible();
  await expect(cards).toHaveCount(0);
});

test("the installation steps are numbered, and the page has its own header", async ({ page }) => {
  await open(page, "/docs", "light");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Installation");
  await expect(page.locator(".doc-step")).toHaveCount(2);
});

test("on a phone the index lives in the menu and nothing is wider than the screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await open(page, "/docs/button", "light");
  await expect(page.locator(".docs-side")).toBeHidden();
  await page.getByRole("button", { name: "Contents" }).click();
  await expect(page.getByRole("dialog").getByRole("link", { name: "Button", exact: true })).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  const wide = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(wide).toBeLessThanOrEqual(0);
});
