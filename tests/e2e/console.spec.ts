import { expect, test } from "@playwright/test";
import { open, routes } from "./routes";

// No errors or warnings, hydration mismatches included: the strokes must
// come out the same on the server and in the browser.
for (const route of routes) {
  test(`console ${route}`, async ({ page }) => {
    const messages: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") messages.push(`${m.type()}: ${m.text()}`);
    });
    page.on("pageerror", (e) => messages.push(`pageerror: ${e.message}`));
    await open(page, route, "light");
    await page.waitForTimeout(300);
    expect(messages).toEqual([]);
  });
}
