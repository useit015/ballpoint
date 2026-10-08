// The shadcn CLI, run by each package manager. Kept apart from lib/docs.ts so
// the install blocks (client components) don't ship every page's docs.
export const install = {
  pnpm: (what: string) => `pnpm dlx shadcn@latest ${what}`,
  npm: (what: string) => `npx shadcn@latest ${what}`,
  yarn: (what: string) => `yarn shadcn@latest ${what}`,
  bun: (what: string) => `bunx --bun shadcn@latest ${what}`,
};
