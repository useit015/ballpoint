import { expect, test } from "@playwright/test";
import { open } from "./routes";

test("tabs: arrow keys move the choice and the mark follows it", async ({ page }) => {
  await open(page, "/docs/tabs", "light");
  const list = page.locator("[data-preview]").first().getByRole("tablist").first();
  const account = list.getByRole("tab", { name: "Account" });
  const password = list.getByRole("tab", { name: "Password" });
  const mark = list.locator('[data-slot="tabs-indicator"]');
  const before = await mark.evaluate((el) => el.getBoundingClientRect().left);
  await account.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(password).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("[data-preview]").first().getByRole("tabpanel").first()).toHaveText(/Use a long one/);
  await expect.poll(() => mark.evaluate((el) => el.getBoundingClientRect().left)).toBeGreaterThan(before + 20);
});

test("accordion: a trigger opens its panel and turns its chevron", async ({ page }) => {
  await open(page, "/docs/accordion", "light");
  const preview = page.locator("[data-preview]").first();
  const trigger = preview.getByRole("button", { name: "Does it work without JavaScript?" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(preview.getByText("The page renders with every stroke already drawn.")).toBeVisible();
  const turned = await trigger.locator('[data-slot="accordion-trigger-icon"]').evaluate((el) => getComputedStyle(el).rotate);
  expect(turned).toBe("180deg");
});

test("progress: reports its value, and indeterminate has none", async ({ page }) => {
  await open(page, "/docs/progress", "light");
  const bars = page.locator("[data-preview]").first().getByRole("progressbar");
  await expect(bars.nth(0)).toHaveAttribute("aria-valuenow", "30");
  await expect(bars.nth(3)).not.toHaveAttribute("aria-valuenow");
});

test("badge: render makes it a real link", async ({ page }) => {
  await open(page, "/docs/badge", "light");
  const link = page.locator("[data-preview]").first().getByRole("link", { name: "A link" });
  await expect(link).toHaveAttribute("href", "#badge");
  await expect(link).toHaveAttribute("data-slot", "badge");
});

test("table: rows are ruled with drawn masks, not borders", async ({ page }) => {
  await open(page, "/docs/table", "light");
  const row = page.locator("[data-preview] tbody tr").first();
  const after = await row.evaluate((el) => {
    const cs = getComputedStyle(el, "::after");
    return { mask: cs.maskImage.startsWith('url("data:image/svg+xml'), border: getComputedStyle(el).borderBottomWidth };
  });
  expect(after).toEqual({ mask: true, border: "0px" });
});

test("progress: the indicator moves inside a clip shaped like the track", async ({ page }) => {
  await open(page, "/docs/progress", "light");
  const indicator = page.locator("[data-preview]").first().locator('[data-slot="progress-indicator"]').nth(3);
  const clip = await indicator.evaluate((el) => {
    const parent = el.parentElement!;
    const track = parent.closest('[data-slot="progress-track"]')!.getBoundingClientRect();
    const box = parent.getBoundingClientRect();
    return {
      slot: parent.dataset.slot,
      overflow: getComputedStyle(parent).overflow,
      fits: Math.abs(box.left - track.left) < 1 && Math.abs(box.width - track.width) < 1,
      indeterminate: el.hasAttribute("data-indeterminate"),
    };
  });
  expect(clip).toEqual({ slot: "progress-clip", overflow: "hidden", fits: true, indeterminate: true });
});
