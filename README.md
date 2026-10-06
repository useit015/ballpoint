# Ballpoint

A shadcn-style component registry drawn in blue ballpoint. Components are
copied into your project with the shadcn CLI, built on Base UI, and every
line in them is a seeded pen stroke. The same seed draws the same wobble on
the server and the client, the strokes regenerate to fit the real box, and
they can draw themselves in.

## Install (Next.js + Tailwind CSS 4)

```bash
pnpm dlx shadcn@latest init https://ballpoint.st9wd.com/r/ballpoint.json
pnpm dlx shadcn@latest add @ballpoint/button
```

`init` installs the paper and ink tokens, the Gaegu font, the stroke engine
(`lib/ink-sketch.ts`, `lib/ink.tsx`, `hooks/use-ink-box.ts`) and registers
the `@ballpoint` namespace in `components.json`. After that, each `add`
copies one component.

> The registry isn't deployed yet. Until it is, run it locally (below).

## Develop

```bash
pnpm install
pnpm dev            # builds the registry, then serves the docs on :3000
pnpm test:install   # installs every item into a fresh Next app, then tsc + next build
pnpm lint && pnpm typecheck && pnpm build
```

pnpm is required (`packageManager: pnpm@11.8.0`).

## How it's put together

- `registry/ballpoint/styles/base.css`: the base item's tokens and shared
  stroke rules, and the docs site's own stylesheet.
  `scripts/build-registry.ts` splits it into the item's `cssVars` and `css`.
- `registry/manifest.ts`: the item list. `pnpm registry:build` writes
  `registry.json`, and `shadcn build` turns it into `public/r/*.json`.
  Both outputs are generated and not committed.
- `registry/ballpoint/lib/ink-sketch.ts`: seeded stroke geometry (boxes,
  hatching, shading, pressured ballpoint ribbons).
- `registry/ballpoint/lib/ink.tsx`: server-safe SVG primitives (`InkSvg`,
  `Stroke`, `InkMarks`) with three draw modes: `mount`, `hover`, `none`.
- `registry/ballpoint/hooks/use-ink-box.ts`: sizes a drawing to its element
  with one shared `ResizeObserver`, snapping to 2px so resizes redraw
  sparingly.
- `registry/ballpoint/ui/`: components. They use the same names and props
  as shadcn/ui, so they drop in as replacements.
- `registry/ballpoint/examples/`: demos used by the docs and by
  `test:install`.

`BALLPOINT_REGISTRY_URL` sets the host written into the base item's
`@ballpoint` namespace (default `http://localhost:4400`). Don't use
`REGISTRY_URL`: the shadcn CLI reads that one itself.

## Plan

See `plans/pending/ballpoint-ui.md`.

## License

MIT
