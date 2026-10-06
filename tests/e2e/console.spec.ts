import { expect, test } from "@playwright/test";
import { allDocs } from "../../lib/docs";
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

// The plain-text docs for language models list every component, and every
// component's usage makes it into the full file.
test("llms.txt and llms-full.txt", async ({ request }) => {
  const short = await request.get("/llms.txt");
  expect(short.headers()["content-type"]).toContain("text/plain");
  const full = await request.get("/llms-full.txt");
  const [shortText, fullText] = await Promise.all([short.text(), full.text()]);
  expect(shortText).toMatch(/^# Ballpoint\n\n> /);
  for (const doc of allDocs) {
    expect(shortText).toContain(`/docs/${doc.name})`);
    expect(fullText).toContain(`## ${doc.title}\n`);
    expect(fullText).toContain(doc.usage);
  }
});
