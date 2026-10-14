import { expect, test } from "@playwright/test";
import { open } from "./routes";

// Card and Table: what they do beyond a box and some rules.

test("a lifted card has a shadow under it, and a plain one does not", async ({ page }) => {
  await open(page, "/docs/card", "light");
  const variants = page.locator("[data-preview]").nth(1);
  const lifted = variants.locator("[data-slot=card][data-variant=lifted]").first();
  const outline = variants.locator("[data-slot=card][data-variant=outline]").first();
  await expect(lifted.locator("mask")).toHaveCount(1);
  await expect(outline.locator("mask")).toHaveCount(0);
  const wash = variants.locator("[data-slot=card][data-variant=wash]").first();
  await expect(wash.locator("clipPath")).toHaveCount(1);
});

test("an interactive card is a radio button, and picking one selects it", async ({ page }) => {
  await open(page, "/docs/card", "light");
  const group = page.getByRole("radiogroup", { name: "What to write" });
  const letter = group.getByRole("radio", { name: /A letter/ });
  const sketch = group.getByRole("radio", { name: /A sketch/ });
  await expect(letter).toHaveAttribute("aria-checked", "true");
  await expect(letter).toHaveAttribute("data-selected", "");
  await sketch.click();
  await expect(sketch).toHaveAttribute("aria-checked", "true");
  await expect(sketch).toHaveAttribute("data-selected", "");
  await expect(letter).not.toHaveAttribute("data-selected", "");
  // It rises on hover.
  await page.mouse.move(0, 0);
  const before = (await letter.boundingBox())!.y;
  await letter.hover();
  await expect.poll(async () => (await letter.boundingBox())!.y).toBeLessThan(before);
});

test("a card's media runs across the top of the box", async ({ page }) => {
  await open(page, "/docs/card", "light");
  const media = page.locator("[data-slot=card-media]").first();
  const card = page.locator("[data-slot=card]").filter({ has: media }).first();
  const [m, c] = [(await media.boundingBox())!, (await card.boundingBox())!];
  expect(m.y - c.y).toBeLessThan(8);
  expect(c.width - m.width).toBeLessThan(10);
});

test("sorting a table by a column re-orders it, and the header says how", async ({ page }) => {
  await open(page, "/docs/table", "light");
  const demo = page.locator("[data-preview]").nth(2);
  const names = () => demo.locator("tbody tr td:first-child").allTextContents();
  const head = (label: string) => demo.getByRole("columnheader", { name: label });
  expect(await names()).toEqual(["Katherine Johnson", "Ada Lovelace", "Grace Hopper", "Mary Jackson"]);
  await expect(head("Pages")).toHaveAttribute("aria-sort", "descending");
  await expect(head("Name")).toHaveAttribute("aria-sort", "none");
  await head("Name").getByRole("button").click();
  await expect(head("Name")).toHaveAttribute("aria-sort", "ascending");
  expect(await names()).toEqual(["Ada Lovelace", "Grace Hopper", "Katherine Johnson", "Mary Jackson"]);
  await head("Name").getByRole("button").click();
  await expect(head("Name")).toHaveAttribute("aria-sort", "descending");
  expect((await names())[0]).toBe("Mary Jackson");
  await expect(head("Pages")).toHaveAttribute("aria-sort", "none");
});

test("a striped table hatches every other row and rules its columns", async ({ page }) => {
  await open(page, "/docs/table", "light");
  const table = page.locator("[data-preview]").nth(1).locator("table");
  await expect(table).toHaveAttribute("data-variant", "striped");
  await expect(table).toHaveAttribute("data-columns", "");
  const bg = (n: number) => table.locator("tbody tr").nth(n).evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(await bg(0)).toBe("none");
  expect(await bg(1)).toContain("repeating-linear-gradient");
  const rule = await table.locator("tbody tr").first().locator("td").nth(1).evaluate((el) => getComputedStyle(el, "::before").maskImage);
  expect(rule).toContain("data:image/svg+xml");
});

test("an empty table says so across every column, until the filter finds something", async ({ page }) => {
  await open(page, "/docs/table", "light");
  const demo = page.locator("[data-preview]").nth(4);
  await expect(demo.getByText(/No notebook matches/)).toBeVisible();
  expect(await demo.locator("tbody td").getAttribute("colspan")).toBe("3");
  await demo.getByRole("textbox", { name: "Filter notebooks" }).fill("ruled");
  await expect(demo.getByText(/No notebook matches/)).toBeHidden();
  await expect(demo.locator("tbody tr")).toHaveCount(2);
});
