import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { open, routes, themes } from "./routes";

// WCAG 2.2 AA on every page, in both themes.
for (const route of routes) {
  for (const theme of themes) {
    test(`a11y ${route} (${theme})`, async ({ page }) => {
      await open(page, route, theme);
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
}
