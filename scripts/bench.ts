// Performance budget: 200 drawn buttons mount in one commit, including the
// re-render each does after measuring itself (median of fresh page loads,
// headless Chrome, production build):
//   draw="none" under 50ms: the cost of the components themselves
//   draw="auto" under 60ms: plus holding every stroke until it's in view
// Needs `pnpm build` first; starts its own `next start`.

import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const budgets = { none: 50, auto: 60 } as const;
const port = 4410;
const modes = (process.argv[2] ? [process.argv[2]] : Object.keys(budgets)) as (keyof typeof budgets)[];

const server = spawn("pnpm", ["exec", "next", "start", "-p", String(port)], { stdio: "ignore" });
try {
  for (let i = 0; ; i++) {
    if (await fetch(`http://localhost:${port}/dev/bench`).then((r) => r.ok, () => false)) break;
    if (i > 100) throw new Error("next start didn't come up");
    await new Promise((r) => setTimeout(r, 200));
  }

  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage();
  const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
  const fmt = (xs: number[]) => xs.map((x) => x.toFixed(1)).join(", ");
  const commit = async () => {
    await page.getByRole("button", { name: "Mount 200" }).click();
    const raw = await page.evaluate(() => document.documentElement.dataset.bench);
    return (JSON.parse(raw ?? "{}") as { commit: number }).commit;
  };

  for (const mode of modes) {
    const url = `http://localhost:${port}/dev/bench?draw=${mode}`;
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
    const budget = budgets[mode];
    const ok = budget === undefined || median(cold) <= budget;
    console.log(`${ok ? "✔" : "✘"} draw=${mode}  cold: ${fmt(cold)} → median ${median(cold).toFixed(1)}ms${budget ? ` (budget ${budget})` : ""}`);
    console.log(`   ${" ".repeat(mode.length + 5)}warm: ${fmt(warm)} → median ${median(warm).toFixed(1)}ms`);
    if (!ok) process.exitCode = 1;
  }
  await browser.close();
} finally {
  server.kill();
}
