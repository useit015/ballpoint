import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { open, themes } from "./routes";

const preview = (page: Page) => page.locator("[data-preview]").first();

async function axe(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

// ─── Behaviour: opening, focus inside, closing, focus back on the trigger ───

test("dialog: opens with focus inside, Escape closes it and focus goes back", async ({ page }) => {
  await open(page, "/docs/dialog", "light");
  const trigger = preview(page).getByRole("button", { name: "Edit profile" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Edit profile" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Name")).toBeFocused();
  // Focus stays inside while tabbing.
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    await expect.poll(() => dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("dialog: the drawn close button closes it", async ({ page }) => {
  await open(page, "/docs/dialog", "light");
  await preview(page).getByRole("button", { name: "Edit profile" }).click();
  const dialog = page.getByRole("dialog", { name: "Edit profile" });
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
});

test("alert dialog: an outside click doesn't dismiss it; Cancel does, and focus goes back", async ({ page }) => {
  await open(page, "/docs/alert-dialog", "light");
  const trigger = preview(page).getByRole("button", { name: "Delete notebook" });
  await trigger.click();
  const dialog = page.getByRole("alertdialog", { name: "Delete this notebook?" });
  await expect(dialog).toBeVisible();
  await page.mouse.click(10, 10);
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Keep it" }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("sheet: slides in against the side it's asked for", async ({ page }) => {
  await open(page, "/docs/sheet", "light");
  const viewport = page.viewportSize()!;
  for (const side of ["right", "left", "bottom"] as const) {
    const trigger = preview(page).getByRole("button", { name: side, exact: true });
    await trigger.click();
    const sheet = page.getByRole("dialog", { name: "Edit profile" });
    await expect(sheet).toBeVisible();
    const box = (await sheet.boundingBox())!;
    if (side === "right") expect(Math.round(box.x + box.width)).toBe(viewport.width);
    if (side === "left") expect(Math.round(box.x)).toBe(0);
    if (side === "bottom") expect(Math.round(box.y + box.height)).toBe(viewport.height);
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  }
});

test("popover: opens beside its trigger and Escape closes it", async ({ page }) => {
  await open(page, "/docs/popover", "light");
  const trigger = preview(page).getByRole("button", { name: "Page size" });
  await trigger.click();
  const popover = page.getByRole("dialog", { name: "Page size" });
  await expect(popover).toBeVisible();
  const [t, p] = [(await trigger.boundingBox())!, (await popover.boundingBox())!];
  expect(p.y).toBeGreaterThan(t.y + t.height);
  await page.keyboard.press("Escape");
  await expect(popover).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("tooltip: shows on hover and on keyboard focus, and describes its trigger", async ({ page }) => {
  await open(page, "/docs/tooltip", "light");
  const trigger = preview(page).getByRole("button", { name: "Hover me" });
  await trigger.hover();
  const tip = page.locator('[data-slot="tooltip-content"]');
  await expect(tip).toHaveText("Saved to your notebook");
  await page.mouse.move(0, 0);
  await expect(tip).toBeHidden();
  await preview(page).getByRole("button", { name: "Add a page" }).focus();
  await expect(tip).toHaveText("Add a page");
});

test("dropdown menu: keyboard opens it, checks items and returns focus", async ({ page }) => {
  await open(page, "/docs/dropdown-menu", "light");
  const trigger = preview(page).getByRole("button", { name: "Notebook" });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const menu = page.getByRole("menu", { name: "Notebook" });
  await expect(menu).toBeVisible();
  const margins = menu.getByRole("menuitemcheckbox", { name: "Show margins" });
  await expect(margins).toHaveAttribute("aria-checked", "true");
  await margins.click();
  await expect(margins).toHaveAttribute("aria-checked", "false");
  const squared = menu.getByRole("menuitemradio", { name: "Squared" });
  await squared.click();
  await expect(squared).toHaveAttribute("aria-checked", "true");
  await expect(menu.getByRole("menuitemradio", { name: "Lined" })).toHaveAttribute("aria-checked", "false");
  // The submenu opens to the side with the right arrow.
  await menu.getByRole("menuitem", { name: "Share" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("menuitem", { name: "Copy link" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("dropdown menu: the highlighted row is shaded, never outlined", async ({ page }) => {
  await open(page, "/docs/dropdown-menu", "light");
  await preview(page).getByRole("button", { name: "Notebook" }).click();
  const row = page.getByRole("menuitem", { name: "Duplicate" });
  await row.hover();
  await expect(row).toHaveAttribute("data-highlighted", "");
  expect(await row.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("none");
  await expect.poll(async () => Number(await row.evaluate((el) => getComputedStyle(el, "::before").opacity))).toBeGreaterThan(0.1);
});

test("select: picking an option shows it on the trigger", async ({ page }) => {
  await open(page, "/docs/select", "light");
  const trigger = preview(page).getByRole("combobox", { name: "Pen", exact: true });
  await expect(trigger).toHaveText("Blue ballpoint");
  await trigger.click();
  await page.getByRole("option", { name: "Green ink" }).click();
  await expect(trigger).toHaveText("Green ink");
  // And from the keyboard, with the pointer out of the way: the list opens
  // over the trigger, and a resting pointer would highlight what's under it.
  await page.mouse.move(0, 0);
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  // It opens on the chosen item, then the arrow moves on past the rule.
  await expect(page.getByRole("option", { name: "Green ink" })).toHaveAttribute("data-highlighted", "");
  // Keys pressed while the list is still settling into place are ignored.
  await page.waitForTimeout(300);
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: "HB pencil" })).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveText("HB pencil");
  await expect(trigger).toBeFocused();
});

test("toast: notes appear, carry their action, and can be dismissed", async ({ page }) => {
  await open(page, "/docs/toast", "light");
  await preview(page).getByRole("button", { name: "Save", exact: true }).click();
  const region = page.getByRole("region", { name: /notifications/i });
  const saved = region.getByRole("dialog").filter({ hasText: "Saved" });
  await expect(saved).toBeVisible();
  // The close button is hidden from assistive tech until the stack fans out.
  await saved.hover();
  await saved.getByRole("button", { name: "Dismiss" }).click();
  await expect(saved).toBeHidden();

  await preview(page).getByRole("button", { name: "Tear out a page" }).click();
  await region.getByRole("dialog").filter({ hasText: "Page torn out" }).hover();
  await region.getByRole("button", { name: "Undo" }).click();
  await expect(region.getByText("Page put back")).toBeVisible();

  await preview(page).getByRole("button", { name: "Save slowly" }).click();
  await expect(region.getByText("Saving…")).toBeVisible();
  await expect(region.getByText("Saved page 12")).toBeVisible({ timeout: 5000 });
});

// ─── Open: screenshots and WCAG with each overlay showing ───────────────────

const overlays: { name: string; open: (page: Page) => Promise<void>; shot: (page: Page) => Locator }[] = [
  {
    name: "dialog",
    open: (page) => preview(page).getByRole("button", { name: "Edit profile" }).click(),
    shot: (page) => page.locator('[data-slot="dialog-content"]'),
  },
  {
    name: "alert-dialog",
    open: (page) => preview(page).getByRole("button", { name: "Delete notebook" }).click(),
    shot: (page) => page.locator('[data-slot="alert-dialog-content"]'),
  },
  {
    name: "sheet",
    open: (page) => preview(page).getByRole("button", { name: "right", exact: true }).click(),
    shot: (page) => page.locator('[data-slot="sheet-content"]'),
  },
  {
    name: "popover",
    open: (page) => preview(page).getByRole("button", { name: "Page size" }).click(),
    shot: (page) => page.locator('[data-slot="popover-content"]'),
  },
  {
    name: "tooltip",
    open: (page) => preview(page).getByRole("button", { name: "Hover me" }).hover(),
    shot: (page) => page.locator('[data-slot="tooltip-content"]'),
  },
  {
    name: "dropdown-menu",
    open: async (page) => {
      await preview(page).getByRole("button", { name: "Notebook" }).click();
      await page.getByRole("menuitem", { name: "Duplicate" }).hover();
    },
    shot: (page) => page.locator('[data-slot="dropdown-menu-content"]'),
  },
  {
    name: "select",
    open: (page) => preview(page).getByRole("combobox", { name: "Pen", exact: true }).click(),
    shot: (page) => page.locator('[data-slot="select-content"]'),
  },
  {
    name: "toast",
    open: async (page) => {
      await preview(page).getByRole("button", { name: "Send" }).click();
      await preview(page).getByRole("button", { name: "Save", exact: true }).click();
    },
    shot: (page) => page.locator('[data-slot="toast"]').first(),
  },
];

for (const overlay of overlays) {
  for (const theme of themes) {
    test(`open ${overlay.name} (${theme})`, async ({ page }) => {
      await open(page, `/docs/${overlay.name}`, theme);
      await overlay.open(page);
      const target = overlay.shot(page);
      await expect(target).toBeVisible();
      expect(await axe(page)).toEqual([]);
      // The drawn shadow and overshooting strokes sit outside the element's box.
      await expect(page).toHaveScreenshot(`open-${overlay.name}-${theme}.png`, { clip: await padded(page, target, 24) });
    });
  }
}

/** The element's box grown by `pad` on every side, kept inside the viewport. */
async function padded(page: Page, target: Locator, pad: number) {
  const box = (await target.boundingBox())!;
  const { width, height } = page.viewportSize()!;
  const x = Math.max(0, box.x - pad);
  const y = Math.max(0, box.y - pad);
  return { x, y, width: Math.min(width, box.x + box.width + pad) - x, height: Math.min(height, box.y + box.height + pad) - y };
}
