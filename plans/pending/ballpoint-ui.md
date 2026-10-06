# Ballpoint UI — a shadcn-style registry drawn in ballpoint

Status: **approved 2026-10-06 · Phases 0–3 done · next: Customizer + pens and papers (3.5)** · Owner: Oussama · Drafted 2026-10-06

A copy-in component library (installed with `shadcn add`, the way shadcn/ui
works) that brings the portfolio's look to other projects. It covers the
everyday components with the same names and props as shadcn/ui, plus a set of
components that only make sense in this style. Everything is drawn at runtime
from seeded strokes, so it renders the same on server and client, resizes
cleanly, and draws itself in.

## What we already have (and what it becomes)

| Portfolio source | Becomes | Notes |
|---|---|---|
| `lib/sketch.ts` (seeded geometry, pressured ink ribbons) | `@ballpoint/ink-core` (registry:lib) | The engine. Ported mostly as is, with new shapes added (chevrons, ticks, crosses, brackets, circles) |
| `components/ink/sketch.tsx` (`Stroke`, `SketchSvg`, `InkMarks`, `Underline`, `Hatch`, `InkDot`…) | `ink-core` primitives | Server-safe |
| `components/ink/measured.tsx` (`useParentSize`, `MeasuredBox`, `HoverLoop`) | `useInkBox` hook + `InkBox` | Generalised: one shared ResizeObserver, size rounded to 2px steps, memoised paths |
| `app/globals.css` tokens + Sketch/Reveal/Controls sections | `@ballpoint/ballpoint` (registry:base, `extends: "none"`) | cssVars + `css` (`@keyframes`, `@utility`, `@layer`) |
| Gaegu via `next/font` | `@ballpoint/font-gaegu` (registry:font) | |
| `public/paper-*.svg`, stains | `@ballpoint/paper` (registry:file + component) | Files go to `public/ballpoint/` |
| `ink-btn`, `copy-email`, `see-more`, `theme-toggle`, `contribution-cells`, `paper-doodles`, `not-found` strike, `margin-scrawl`, `heading`, `experience-section` timeline | Components (see the catalogue) | |
| `public/ink/glyphs.webp` atlas | **Not shipped**: these are tech logos, not UI icons | UI icons get rebuilt as seeded strokes |

## Architecture

```
ballpoint/                      new repo (useit015/ballpoint)
  app/                          Next 16 docs site: /docs/<item>, live previews, install commands
  registry/ballpoint/
    lib/sketch.ts               the engine (from face)
    lib/ink.tsx                 Stroke, SketchSvg, InkMarks, InkBox, useInkBox, cn
    icons/                      ~30 UI icons generated from strokes
    ui/<component>.tsx          everyday components (same names and props as shadcn)
    ink/<component>.tsx         components specific to this style
  registry.json                 item manifest → `shadcn build` → public/r/*.json
  scripts/contrast.ts           fails the build if a token misses its WCAG ratio
  tests/{visual,a11y,install}/
```

**Item layering.** Every component lists `ink-core` as a registry dependency.
`shadcn init @ballpoint/ballpoint` installs the tokens, CSS, font and engine
once. After that, `shadcn add @ballpoint/<name>` copies just the component.

**Tokens.** These are the portfolio's tokens (`--paper`, `--ink`, `--ink-2…5`,
the motion tokens). They are also mapped onto shadcn's names (`background`,
`foreground`, `primary`, `muted`, `border`, `input`, `ring`, `destructive`,
`card`, `popover`, …) so third-party shadcn blocks look roughly right. Two
tokens are new:
- `--ink-line` = ink mixed at 60%. This one carries control borders.
  **ink-4 is 2.05:1 on cream** (2.79:1 at night), which fails WCAG 1.4.11's
  3:1 for UI boundaries. ink@60% measures 3.11:1 in light and 4.94:1 in dark.
  ink-4 stays for decoration only.
- `--pen-red`: a red ballpoint, used only for destructive and invalid
  states, like a teacher's correction pen. It is the only second ink.

**Rendering rules (all components).**
- Decorative SVG is `aria-hidden`. Semantics come from the headless primitive.
- Seeds come from a `seed` prop, falling back to `hashSeed(useId())`. useId
  is stable between server and client, so there is no hydration drift.
- Boxes render first with an estimated size, stretched to fit, so there is
  never an empty frame. Then they measure and regenerate (the portfolio's
  pattern).
- All state styling is CSS on the primitive's data attributes
  (`data-checked`, `data-open`, `data-highlighted`, `data-disabled`, …). No JS
  animation for hover, focus or press.
- Draw-on is controlled with `draw="mount" | "inview" | "hover" | "none"`,
  with a sensible default per component. Whole-app off switch:
  `[data-ink-draw="off"]`.
- Reduced motion: strokes appear finished, with short crossfades only (as on
  the portfolio).
- Motion follows the README vocabulary (Write, Draw, Ink, Circle, Lift, Boil,
  Blot): transform and opacity only, no bounce.

## Catalogue

**Everyday** (same names and props as shadcn, so they drop in as replacements)
- Wave A, forms and actions: button (solid / outline / secondary / ghost / link / destructive), input, textarea, label, field (label + hint + red-pen error), checkbox, radio-group, switch, slider
- Wave B, display: card, badge, separator, avatar (crossed frame), kbd, alert, skeleton (pencil hatching), progress (shading fill), table, tabs, accordion
- Wave C, overlays: dialog, alert-dialog, sheet, popover, tooltip, dropdown-menu, select, toast
- Wave D, navigation and complex (v1.1): breadcrumb, pagination, slider, toggle, toggle-group, calendar / date-picker (graph-paper cells), combobox, command

**Special to this style**
- Set 1: `annotate` (underline · circle · box · strike · scribble-out · bracket · hatch-highlight, inline, drawn when scrolled into view), `section-heading` (written in, swoosh, specks), `paper` (tile + coffee ring + night lamp), `frame` (crossed photo frame), `copy-button` (label swap + drawn tick), `ink-icons`
- Set 2: `signature-pad` (pressured ballpoint input; form value plus SVG/PNG export), `hatch-grid` (contribution-style heatmap, 5 hatch levels), `timeline` (arrow whose columns land as the pen passes), `ink-theme-toggle` (sun/moon + ink-blot view transition), `margin-note` (handwritten aside with an arrow to its target, shown inline on mobile), `checklist` (done items get struck through), `redact` (scribbled-out text, revealed on click), `scrawls` (margin pen tests)

## Phases (riskiest first; each phase ends green)

| # | Phase | Size | Verification (named) |
|---|---|---|---|
| 0 | **Pipeline proof.** Create the repo, a minimal `registry.json` with `ballpoint` base + `font-gaegu` + `ink-core` + `button`, then `shadcn build` | S | `pnpm registry:build` passes schema validation. `pnpm test:install` creates a fresh Next 16 + Tailwind 4 app in tmp, runs `shadcn init` from the local registry, `add button`, then `tsc` and `next build`. The button renders drawn (screenshot) |
| 1 | **Engine port.** `sketch.ts` + new shapes; `ink.tsx` with `InkBox`/`useInkBox` (shared ResizeObserver, 2px rounding, memo); `--ink-line`, `--pen-red`; `scripts/contrast.ts` | M | `pnpm test` determinism suite (same seed gives the same path string under node and jsdom). Bench: 200 InkBoxes mount in under 50ms. `pnpm contrast` passes |
| 2 | **Docs shell + test harness.** Preview pages, install-command block, "redraw" seed shuffle, light/dark; Playwright visual + axe runners | M | `pnpm test:visual` (reduced-motion emulation, both themes) and `pnpm test:a11y` run on the button page |
| — | *Checkpoint: review the button, tokens and docs page together before scaling out* | | |
| 2.5 | **Pen settings.** `InkProvider`/props, auto-draw on view, `roundedBoxStroke`, weight/speed variables, fill and shadow styles; button takes them all | S | unit snapshot for new geometry; e2e: strokes stay pending until in view, then draw; visual baselines for a pen-settings example; bench still under 50ms |
| 3 | Wave A, form controls (+ slider, moved from Wave D) | M | visual + a11y + keyboard script per control; `test:install` adds all of Wave A |
| 3.5 | **Customizer + pens and papers.** Docs customizer page; `registry:theme` pens and papers | M | contrast gate covers every pen × paper; e2e drives the customizer and checks the copied code; `test:install` adds a theme |
| 4 | Wave B, display | M | same |
| 5 | Wave C, overlays (focus trap, exit drawing, portals) | M | same + focus-return checks |
| — | *Checkpoint* | | |
| 6 | Special set 1 | M | same + `annotate` in-view trigger test |
| 7 | Special set 2 | M | same + signature-pad pointer/pen/touch test and form submit value |
| 8 | Launch: deploy, README, `llms.txt`, registry index page | S | production URL serves `/r/registry.json`; `shadcn add @ballpoint/button` works in a fresh app against prod |
| 9 | Wave D (v1.1) | M | same as 3 |

Steps that need a person outside this session are written down rather than
assumed: DNS for the docs domain, and the PR adding `@ballpoint` to
shadcn's registry directory (`ui.shadcn.com/r/registries.json`, currently
425 entries, none hand-drawn). I draft these. You confirm and perform them.

## Decision log

| # | Decision | Why |
|---|---|---|
| D1 | Distribute as a shadcn registry (copy-in), not an npm package | "shadcn-style installable". Users own the code and can redraw it |
| D2 | Same names and props as shadcn for everyday components | Drop-in swap is the adoption story |
| D3 | Ship our own stroke icons; no raster atlas | The portfolio atlas is tech logos. Stroke icons get the draw-on and take any ink colour |
| D4 | `--ink-line` (60%) for control borders | ink-4 fails 3:1 non-text contrast (measured 2.05:1 in light) |
| D5 | Red pen only for destructive/invalid | Keeps the "one ink" restraint while giving errors a distinct colour |
| D6 | Deterministic seeds → screenshot tests are stable | Same seed, same pixels, so visual regression has no flake from randomness |
| D7 | Name `ballpoint`, namespace `@ballpoint` | Says what it is; unused among the 425 registries in shadcn's directory (checked 2026-10-06) |
| D8 | New repo `useit015/ballpoint` with its own docs site | Its own versioning and deploys; the portfolio can install from it later |
| D9 | Base UI primitives | Its enter/exit data attributes let strokes draw in and out with plain CSS; shadcn supports it. Check the package name in Phase 0 |
| D10 | v1 = Waves A–C + special sets 1–2; Wave D in v1.1 | About 41 items is a full-feeling launch without calendar, combobox or command |
| D11 | Rescale Tailwind's own `text-xs…5xl` for Gaegu instead of custom size tokens | Found in Phase 0: tailwind-merge read `text-control` as a colour and dropped the solid button's label colour. Standard names also size shadcn blocks correctly |
| D12 | Only literal colours go in `cssVars`; derived tones and timings go in `css` `:root` / `.dark` | Found in Phase 0: the CLI adds a `--x: var(--x)` @theme line for every non-literal cssVar. `test:install` now fails if any appear |
| D13 | The base item carries `config.registries` | `shadcn init <base url>` writes the `@ballpoint` namespace into components.json, so `add @ballpoint/x` works with no manual setup and before any directory listing |
| D14 | Env var is `BALLPOINT_REGISTRY_URL` | `REGISTRY_URL` is read by the shadcn CLI itself and redirects its default registry |
| D15 | Pinned to releases older than 7 days (shadcn 4.21.0, Base UI 1.8.0, Next 16.3.6) | Matches your npm `min-release-age=7` policy |
| D16 | `--ink-fill` is 0.78 in light, 0.72 at night | The contrast gate measured the portfolio's 0.72 at 4.22:1 for a paper label on light shading. 0.78 gives 4.87:1; night has room to spare (7.28:1) |
| D17 | Components generate only the strokes their variant shows, and cache by (variant, seed, size) | Shading and hatching were ~70% of path cost and were computed for every variant |
| D18 | `useInkFrame` returns `ref` separately from the spreadable `frame` | The React Compiler lint treats an object holding a ref as a ref |
| D19 | Benches run in headless Chrome via Playwright (`channel: "chrome"`, no browser download) | The in-app browser pane throttles when hidden, so its timings swung 59–400ms |
| D20 | `InkSeedProvider` / `useInkSeed` ship in ink-core | Lets the docs "Redraw" previews, and lets users give a region its own hand, without touching each component |
| D21 | Docs code is set on the paper, not in a box: a pen-drawn margin rule, Courier Prime, and an ink-only shiki theme where tokens differ by pressure and weight (keywords bold, names and strings full ink, plumbing and comments ink-3) | Your feedback: Victor Mono in a grey rounded box looked bad, and nearly every token came out the same ink. Compared Courier Prime, Sometype Mono and Xanh Mono on the page; Courier reads as code typed onto the paper and annotated in pen |
| D22 | Screenshot tests run with reduced motion | Strokes render finished, so baselines compare drawn results, not animation frames. Stable across 3× repeats |
| D23 | Components draw themselves in by default, the first time they scroll into view (`draw="auto"`); `"mount"` and `"none"` remain | Checkpoint call. "On view" rather than "on mount" so below-the-fold parts are seen being drawn. Strokes wait behind `data-ink-pending` (one shared IntersectionObserver), only under `@media (scripting: enabled)` so a no-JS page still shows them. Reduced motion shows them finished |
| D24 | Pen settings on every component as props, and for a subtree via `<InkProvider>`: roughness, passes, radius, corners, fill, shadow, draw, weight, speed, salt | Checkpoint call. Geometry knobs are JS (they change paths); weight and speed are CSS variables (`--ink-weight`, `--ink-speed`), so they can also be set in plain CSS. Replaces `InkSeedProvider` |
| D25 | Rounded and pill shapes: `radius` (px or `"full"`), drawn by a new `roundedBoxStroke` | Checkpoint call. A hand-drawn rounded box is one continuous pull that runs on past where it closed; `capsuleStroke` becomes a pill of it |
| D26 | A Customizer page in the docs: controls, a live sheet that redraws as you drag, copyable provider props + CSS | Checkpoint call. It's built from the library's own controls, so it lands after Wave A, and **slider moves from Wave D into Wave A** |
| D27 | Pens and papers ship in v1 as `registry:theme` items: pens blue ballpoint (default), black fineliner, pencil, green ink; papers cream (default), white, night. Every pen × paper pair must pass the contrast gate | Checkpoint call (was v1.2). Graph paper's grid is drawn by the `paper` component (special set 1), not a colour theme |
| D28 | Fill styles: `shade` (solid's default), `hatch` (secondary's default), `scribble`, `flat`; shadows: `hatch` (default), `solid`, `none` (no lift either) | One vocabulary for how any area is coloured in, shared by every component that fills |
| D29 | Bench budget split by draw mode: `draw="none"` < 50ms (the components' own cost), `draw="auto"` < 60ms | Auto-draw is the default by your call and costs real work (an observer per drawing, animations on release). Interleaved A/B against the pre-pen commit under identical load: ≈ +5ms per 200 buttons |
| D30 | Strokes carry plain `--ink-w` / `--ink-d` / `--ink-dd` (registered `@property`, not inherited); the weight/speed `calc()` lives once in base.css. Waiting strokes have no animation at all until released | Per-path `calc()` strings and 1,200 paused animations were the measurable part of the pen-settings cost (auto went 63.8 → 51.7ms in the same session) |
| D31 | Input and Textarea render a wrapper that holds the drawing; `className` styles that box, every other prop goes to the control | An `<input>` can't hold an SVG. Type classes still reach the text through inheritance. The one deliberate API difference from shadcn, documented on both pages |
| D32 | Separator pulled forward from Wave B into Wave A | shadcn's Field depends on it |
| D33 | Ticks, dots, dashes, switch shading and the input focus pass draw in and out with CSS transitions keyed off Base UI's `data-checked` / `data-indeterminate` / `:focus-within`; one shared `InkOutline` draws every control's box, ring or writing line | No remounting, so state changes animate both ways and work with auto-draw. Hover lightens only unchecked controls (it was washing out checked ones) |
| D34 | Orientation styling uses `data-[orientation=…]`, not shadcn's `data-horizontal:` / `data-vertical:` | Those shorthands come from shadcn's own stylesheet, which Ballpoint doesn't ship; the vertical slider collapsed without them |
| D35 | Screenshot tolerance tightened from 0.2% to 0.01% of pixels | 0.2% let a real change (a paper patch behind a label, a resize grip) pass. Renders are deterministic, so strict costs nothing |
| D36 | Choice cards (a FieldLabel wrapping a Field) are detected from the DOM after mount; their layout comes from CSS `:has()` | Server-rendered children reach the client as references, so comparing element types never matched |

## Always / Never

- **Always:** server-renders without layout shift; reduced-motion path; keyboard and screen-reader parity with shadcn; both themes treated as equals; every item passes `test:install` before it counts as done; read `node_modules/next/dist/docs/` before writing Next code (AGENTS.md).
- **Never:** sticker-bomb decoration by default (specials are opt-in); marker or comic fonts; JS-driven hover animation; touching the portfolio repo during v1; publishing, posting or DNS changes without your yes.

## Out of scope (v1)

npm package, Vue/Svelte ports, a chart library, a Figma kit, and moving the
portfolio onto the library.

## Progress

| Phase | State | Evidence |
|---|---|---|
| 0 | ✅ done 2026-10-06 | `pnpm test:install`: fresh Next 16.3.6 app → `shadcn init` base (tokens, Gaegu via next/font, engine, namespace) → `add @ballpoint/button` → `tsc` ✔ `next build` ✔, no self-referencing vars. Checked in the browser: 6 variants × 8 sizes in both themes, hover lift and shadow, ghost hover-draw, focus ring, no console errors. Repo: lint ✔ typecheck ✔ build ✔ |
| 1 | ✅ done 2026-10-06 | New shapes (tick, cross, dash, plus, chevron, ring, capsule); `useInkFrame` + ink settle; `--ink-fill` token. `pnpm test` 36/36: determinism for all 32 generators, geometry snapshot, degenerate boxes (caught a NaN in `capsuleStroke` at 0×0, fixed). `pnpm contrast` 14/14, wired into `registry:build`. `pnpm bench`: 200 buttons cold median 45.7ms, warm 36.7ms (budget 50; about 10% margin). `test:install` ✔ lint ✔ typecheck ✔ |
| 2 | ✅ done 2026-10-06 | Docs site: home, Installation (init, add, tokens, drawing), `/docs/[item]` with Preview/Code tabs and Redraw, package-manager install tabs, collapsible source, usage, API table; phone layout with folded contents and no sideways scroll. `pnpm test:e2e` 17/17: axe WCAG 2.2 AA on every page × both themes, no console errors or hydration warnings, keyboard focus/Enter/Space/disabled, strokes match measured boxes, screenshots (stable 3/3). `test:install` ✔, `bench` cold median 42.4ms |
| 2.5 | ✅ done 2026-10-06 | `InkProvider` + pen props (roughness, passes, radius/pill, corners, fill, shadow, draw, weight, speed, salt); auto-draw on first view; `roundedBoxStroke`/`roundedRectPath`. Docs: "Pen settings" example and table, installation section. `pnpm test` 37/37 (snapshot: only capsule changed + rounded box added). `pnpm test:e2e` 19/19, including pending-until-in-view and reduced-motion-finished; main button screenshot unchanged pixel for pixel. Caught and fixed: outline/destructive faces were getting a fill. `test:install` ✔. **Bench inconclusive**: the machine was under load (load avg ≈ 5, `mobileassetd` at 100%) and even the previous commit measured 43–47ms; re-run on a quiet machine |
| 3 | ✅ done 2026-10-06 | input (box/line), textarea (box/lined, grows), label, separator, field (+ set, legend, group, content, title, description, separator, error, drawn choice cards), checkbox (tick/dash), radio-group (spiral dot), switch (shaded track, 4 fills), slider (single/range/steps/vertical). `pnpm test:e2e` 72/72: axe on every page × both themes, console clean, 8 behaviour tests (keyboard tick/untick, indeterminate→checked, radio arrows, card click, switch Space, slider arrows incl. range labels, input focus pass, red-pen invalid), screenshots at 0.01%. Caught: slider thumbs unlabelled, vertical slider collapsed, choice cards undetected, hover washing out checked controls. `test:install` 13 items ✔. `bench` ✔ none 48.3 / auto 53.8ms (under load avg 6.8) |
| 3.5–9 | not started | |
