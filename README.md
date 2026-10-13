# Ballpoint

A shadcn-style component registry drawn in blue ballpoint: docs, live
examples and a customizer at **https://ballpoint.st9wd.com**. Components are
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

For coding assistants, the docs are also plain markdown:
[`/llms.txt`](https://ballpoint.st9wd.com/llms.txt) (an index) and
[`/llms-full.txt`](https://ballpoint.st9wd.com/llms-full.txt) (every
component's usage, props and pen settings in one file).

## Develop

```bash
pnpm install
pnpm dev            # builds the registry, then serves the docs on :3000
pnpm lint && pnpm typecheck && pnpm test   # static checks + stroke determinism
pnpm contrast       # every token against WCAG, both themes (also runs in registry:build)
pnpm build          # registry + docs
pnpm test:e2e       # after build: a11y (axe, WCAG 2.2 AA), console/hydration, keyboard, screenshots
pnpm test:install   # installs every item into a fresh Next app, then tsc + next build
pnpm bench          # after build: 200 buttons must mount in under 50ms
```

pnpm is required (`packageManager: pnpm@11.8.0`). Browser tests use the
installed Google Chrome (`channel: "chrome"`). Screenshot baselines live in
`tests/e2e/__screenshots__`; refresh them deliberately with
`pnpm test:visual --update-snapshots`.

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
  `Stroke`, `InkMarks`) and their draw modes: `auto` (when first in view),
  `mount`, `hover`, `focus`, `checked`, `indeterminate` and `none`.
- `registry/ballpoint/lib/ink-outline.tsx`, `ink-panel.tsx`,
  `ink-glyphs.tsx`: a pen outline for controls, a lifted sheet of paper
  for overlays, and small drawn icons.
- `registry/ballpoint/hooks/use-ink-box.ts`: sizes a drawing to its element
  with one shared `ResizeObserver`, snapping to 2px so resizes redraw
  sparingly.
- `lib/art/`: the front page's drawings, made in code: seeded noise and short
  path helpers (`kit.ts`), mountains hatched down from their ridges, pines,
  water and grass (`nature.ts`), and the scenes built from them (`hero.ts`,
  `side.ts`, `footer.ts`, `doodles.ts`). The same seed draws the same picture
  on the server and in the browser. A scene's outlines are laid one after
  another by `track` (the strokes marked `lead`); the rest of it is worked in
  around them. `components/art/pen-art.tsx` lays a scene out as one SVG per
  depth, and `app/art.css` has the pen run along each stroke (`draw`) or the
  hand work across a cluster of them (`sweep`); `pen-hand.tsx` is the one
  small script that shows a pen at the tip of the lead strokes.
- `lib/art/people.ts`, `lib/art/creatures.ts`, `components/art/life/`,
  `app/life.css`: what lives in the pictures. People are posed by a small rig
  (a pelvis, two-bone legs, arms), so a walk is a real gait with each foot
  planted while the body passes over it; `footer-life.tsx` walks them up and
  down the trail, sits them by the fire, and lets a pointer (or Enter) make
  them wave and say something. The sun is a button that turns the page to
  night, the boat has a bite when it is poked, the fire can be stoked, the
  tent looked into, and birds scatter and pines sway under a pointer. Loops
  only run while the picture is on screen, and none of it moves under
  reduced motion. The footer's and the side panel's scenes are generated in
  the browser when they near the viewport, so they are not in the page's HTML.
- `components/home/`, `app/home.css`: the front page's sections. The torn
  paper's outlines in `app/torn.css` are written once by
  `scripts/torn-edges.ts` (`pnpm torn`). Picking a pen and a paper in
  "Customize your style" dresses the whole page (`html[data-pen]`,
  `html[data-paper]`), slips and torn sheets included: `pnpm paper` cuts a
  slip texture for each paper.
- `registry/ballpoint/ui/`: components. They use the same names and props
  as shadcn/ui, so they drop in as replacements.
- `registry/ballpoint/examples/`: demos used by the docs and by
  `test:install`.

`BALLPOINT_REGISTRY_URL` sets the host written into the base item's
`@ballpoint` namespace (default `http://localhost:4400`). Don't use
`REGISTRY_URL`: the shadcn CLI reads that one itself.

## Deploy

The site is a Vercel project (`ballpoint`). Every push to `main` deploys
to production at https://ballpoint.st9wd.com; other branches get preview
URLs. The build runs `pnpm build` with
`BALLPOINT_REGISTRY_URL=https://ballpoint.st9wd.com`, so the published
registry points at itself.

## Plan

See `plans/pending/ballpoint-ui.md`.

## License

MIT
