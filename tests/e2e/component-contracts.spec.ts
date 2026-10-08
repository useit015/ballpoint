import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/dev/component-contracts", { waitUntil: "networkidle" });
});

test("state class callbacks receive checked, active, and open states", async ({ page }) => {
  const checkbox = page.getByRole("checkbox", { name: "Callback checkbox" });
  await expect(checkbox).toHaveClass(/consumer-unchecked/);
  await checkbox.click();
  await expect(checkbox).toHaveClass(/consumer-checked/);
  // Callback classes are merged with the component's layout classes.
  await expect(checkbox).toHaveClass(/inline-flex/);
  await expect(page.getByRole("tab", { name: "First" })).toHaveClass(/consumer-active/);
  await page.getByRole("tab", { name: "Second" }).click();
  await expect(page.getByRole("tab", { name: "First" })).toHaveClass(/consumer-inactive/);
  await expect(page.getByRole("tab", { name: "Second" })).toHaveClass(/consumer-active/);
  await page.getByRole("button", { name: "Open callback popover" }).click();
  await expect(page.locator("[data-slot=popover-content]")).toHaveClass(/consumer-open/);
});

test("checklists honor canceled changes and still accept uncanceled changes", async ({ page }) => {
  const blocked = page.getByRole("checkbox", { name: "Blocked completion" });
  await blocked.click();
  await expect(blocked).not.toBeChecked();
  await expect(blocked.locator("..")).not.toHaveAttribute("data-done");
  const allowed = page.getByRole("checkbox", { name: "Allowed completion" });
  await allowed.click();
  await expect(allowed).toBeChecked();
  await allowed.click();
  await expect(allowed).not.toBeChecked();
});

test("choice cards retain outlines and expose object and callback refs", async ({ page }) => {
  for (const name of ["object-card", "callback-card"]) {
    await expect(page.getByTestId(name).locator(":scope > svg")).toHaveCount(1);
  }
  await page.getByRole("button", { name: "Read refs" }).click();
  await expect(page.locator("output")).toHaveText("LABEL,LABEL");
});
