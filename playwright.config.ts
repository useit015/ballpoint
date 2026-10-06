import { defineConfig } from "@playwright/test";

// Runs against the production build (`pnpm build` first) in the system's
// Chrome, so no browser download. Motion is reduced: strokes render
// finished, which is what screenshots should compare.
export default defineConfig({
  testDir: "tests/e2e",
  snapshotPathTemplate: "tests/e2e/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4420",
    channel: "chrome",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 900 },
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled" },
  },
  webServer: {
    command: "pnpm exec next start -p 4420",
    url: "http://localhost:4420",
    reuseExistingServer: !process.env.CI,
  },
});
