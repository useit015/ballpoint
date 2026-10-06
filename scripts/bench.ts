// Performance budget: 200 drawn buttons mount in one commit, including the
// re-render each does after measuring itself, in under 50ms (median of
// fresh page loads, headless Chrome, production build).
// Needs `pnpm build` first; starts its own `next start`.

import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const BUDGET_MS = 50;
const port = 4410;
const url = `http://localhost:${port}/dev/bench`;

const server = spawn("pnpm", ["exec", "next", "start", "-p", String(port)], { stdio: "ignore" });
try {
  for (let i = 0; ; i++) {
    if (await fetch(url).then((r) => r.ok, () => false)) break;
    if (i > 100) throw new Error("next start didn't come up");
    await new Promise((r) => setTimeout(r, 200));
  }

  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage();
  const commit = async () => {
    await page.getByRole("button", { name: "Mount 200" }).click();
    const raw = await page.evaluate(() => document.documentElement.dataset.bench);
    return (JSON.parse(raw ?? "{}") as { commit: number }).commit;
  };

  const cold: number[] = [];
  for (let i = 0; i < 7; i++) {
    await page.goto(url, { waitUntil: "networkidle" });
    cold.push(await commit());
  }
  const warm: number[] = [];
  for (let i = 0; i < 7; i++) {
    await page.getByRole("button", { name: "Clear" }).click();
    warm.push(await commit());
  }
  await browser.close();

  const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
  const fmt = (xs: number[]) => xs.map((x) => x.toFixed(1)).join(", ");
  console.log(`cold: ${fmt(cold)} → median ${median(cold).toFixed(1)}ms`);
  console.log(`warm: ${fmt(warm)} → median ${median(warm).toFixed(1)}ms`);
  if (median(cold) > BUDGET_MS) {
    console.error(`\nOver budget: 200 buttons should mount in under ${BUDGET_MS}ms.`);
    process.exitCode = 1;
  }
} finally {
  server.kill();
}
