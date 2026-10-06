# Ballpoint UI — a shadcn-style registry drawn in ballpoint

Status: **approved 2026-10-06 · Phases 0–6 done · next: special set 2** · Owner: Oussama · Drafted 2026-10-06

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
| D21 | Docs code sits on a slip laid on the page: a translucent lift of the paper (its texture shows through) pencilled round in ink-4, set in Recursive Mono Casual, inked with the theme's own pens (page pen for keywords, the paper's red pen for names, green for strings, black fineliner for the rest, pencil for comments). Install commands are Ballpoint tabs on the same slip and wrap only after slashes; scrollbars are thin ink-4 | Your feedback, three rounds: a grey rounded box looked bad; Courier on a margin rule looked bad; a flat near-white slip and grey scrollbars didn't match the paper. Every code colour clears 5:1 on its slip for every pen × paper × mode |
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
| D37 | Papers are cream, white and **legal pad** (each with its own night shade), not "night" | Night is already every paper's dark mode. A night-only paper would put a pen's dark-blue day ink on navy, which breaks the rule that any pen goes on any paper |
| D38 | Derived tokens live in one rule, `:root, .dark, [data-ink-scope]`; any element with `data-ink-scope` and its own `--ink`/`--paper` gets a fully re-inked subtree | A custom property computed on :root is inherited as a finished colour, so overriding `--ink` on a container wouldn't reach `--ink-3` and friends. This is what lets the customizer preview a pen without repainting the site; users get it too |
| D39 | `radius="full"` is a pill only for single-line controls; checkboxes cap at 6px, textareas and choice cards at 18px (`InkOutline maxRadius`) | Seen in the customizer: a round checkbox reads as a radio, and a multi-line stadium looks wrong |
| D40 | The docs site has its own drawn icon | Without one Chrome sometimes asked for /favicon.ico before a test finished, failing the console check on a 404 at random |
| D41 | Many-row rules (table rows, accordion items) are a `::after` painted in ink and masked by one of three hand-ruled lines (`inkRules` CSS variables), not an SVG per row | A 500-row table would otherwise mount 500 measured drawings; neighbouring rows still differ |
| D42 | Progress shading is drawn once for the whole track and the indicator only uncovers it | Redrawing shading as the value grows made the strokes shimmer |
| D43 | Skeleton hatching clips to the element's own `border-radius` (CSS overflow), not a fixed SVG radius | `rounded-full` placeholders came out as rounded squares |
| D44 | `test:install` caches only the create-next-app scaffold and installs offline each run | The cached `node_modules` in the temp folder lost files (TypeScript's package was emptied), failing the run for reasons unrelated to the registry |
| D45 | The bench budget stands, but on this machine it is read alongside an interleaved A/B against the previous commit | Background load (load avg 4–7 all session) moves medians ±5ms around the 50ms line; Wave B vs Wave A under identical load: 46.5/51.0 vs 54.5/55.9ms, so no regression |
| D46 | Every paper has its own texture tile (scripts/paper-tiles.ts → public/paper/<paper>-<mode>.svg), averaging exactly to that paper; `.paper-sheet` paints one. The customizer preview and paper swatches use the picked paper's tile | Your feedback: backgrounds, papers and pencils must match the theme; the preview was flat colour on a textured page |
| D47 | Every overlay is a piece of paper: `.ink-paper` (popover colour, plus an optional texture through `--paper-texture`) with `InkPanel` drawing its outline and a hatched shadow offset down-right, drawn in as it opens ("mount") | One look for dialog, alert dialog, popover, menu, select and toast, built like the lifted button. The shadow is masked out under the face, so the face stays a real CSS background and the docs can texture it |
| D48 | The backdrop is tracing paper (`bg-paper/65` + 1.5px blur), not a black scrim | A black wash turns cream to grey; a sheet of tracing paper keeps the page's colour by day and by night |
| D49 | Highlighted menu and select rows are shaded with `inkWash`: three hand-shaded patches as CSS masks on a pseudo-element in the row's own colour | No SVG or observer per row; destructive rows shade in red for free. Base UI's `data-highlighted` drives it |
| D50 | Toast is Base UI Toast behind a global manager, with a sonner-style `toast()` / `toast.success` / `.promise` / `.dismiss` and one `<Toaster />` | shadcn's toast is sonner (two extra deps); this keeps the registry on Base UI alone and still lets any function raise a note |
| D51 | `InkGlyph` in ink-core: close, check, chevrons, dot, plus, minus, alert, info, loading, seeded by name | Overlays need small icons inside controls; drawn ones take the pen and can draw in (ticks on `data-checked`). Special set 1's `ink-icons` extends this set |
| D52 | The tooltip is the one inverted surface: an ink-shaded tab with paper text and a drawn tail, drawn finished | It must stand out from paper surfaces; the label clears 4.5:1 by the existing "paper label on solid fill" gate. Tooltips come and go too fast to watch them draw |
| D53 | The docs site's default focus ring lives in `@layer base` | Unlayered, it beat components' own `outline-none` and boxed highlighted menu rows |
| D54 | Outlines are one confident pass by default; buttons keep the portfolio's three. Controls rest at ink-3 and go to full ink on hover and focus; decoration (cards, preview frames) at ink-line | Your feedback ("still ass, needs attention to detail"), checked at 2× against st9wd.com: its lines are crisp full ink, ours were 60%/40% mixes gone over twice 2px apart, which read as blurry double borders on wide boxes |
| D55 | Rounded boxes wobble half as much (jitter 0.45 → 0.25) | At 2× the rounded inputs and cards looked lumpy rather than drawn |
| D56 | Code snippets have no border: a lighter patch of the page only | Your feedback: the pencilled frame around snippets still looked wrong |
| D57 | Section headings keep their swoosh inside their own box (padding), so content starts below it | Your feedback: the underlines made it look like there was no space |
| D58 | `InkGlyph` is its own class (`.ink-glyph`), not an overlay, so components size and lay it out like any icon; new arrow and ringed info/alert glyphs replace typed "+" and hand-written SVG | Alerts, buttons and menus excluded `.ink-sketch` from their icon rules, so glyphs fell out of layout |
| D59 | Menu and select highlights are a filled highlighter swipe (`swipePath`), not pen shading | The shading read as a grey smear |
| D60 | Docs: Preview/Code use the drawn Tabs; sidebar sorted A–Z, scrolls on its own, current page marked with a drawn dot; header marks the current section; home has a live example beside the hero, an Install row, and a ruled component index | First impressions: the home page was a wall of links and the docs tabs were a CSS underline |
| D61 | Paper textures model real paper: soft formation (pulp cloudiness), a fine lit tooth and a few fibres, mapped onto the paper's own colour around the filter's measured mean (0.5964), so every tile averages to its paper within 0.1/255 | Your feedback: the crinkle relief didn't look like real paper. Five prototypes compared at 2×; heavy tooth read as stucco, strong mottling as camouflage |
| D62 | Sheets of paper laid on the page (code slips, swatches, the customizer preview, the Pens and papers sheets) get their own texture, a soft paper shadow and 2px corners, never a drawn border | Your feedback: "all bgs" should look like paper. Code colours re-checked on the new slips (all ≥ 5:1) |
| D63 | Pens and papers is shown on real sheets: each pen writes live components on cream, each paper is a sheet of itself with the blue and red pens; both follow day and night through --pen-day/--pen-night and --paper-day/--paper-night scopes | The old page was swatches and seven install blocks |
| D64 | Every component page has the same parts in the same order: title, description, Base UI link; centred preview; Installation; Usage; Examples (when there are more); API reference; previous/next. Pages that had no props table now have one | Your feedback: component pages should be consistent. Five pages had no API section at all |
| D65 | Props are a ruled list (name and type, default on the right, description below), not a three-column table; each page lists its pen settings in one line and links to the full reference on Installation | The table crushed descriptions into a narrow column, and the same eight pen settings were repeated on every page |
| D66 | Docs chrome: drawn disclosure chevrons, a footer, a header that fits a phone (Components moves into the docs contents below `sm`) | At 390px the header pushed the page to 493px wide |
| D67 | Hosted on Vercel as project `ballpoint` (team oussama-nahizs-projects, next to the portfolio), deployed from the CLI; build runs `pnpm build` (registry + paper tiles + next) with `BALLPOINT_REGISTRY_URL=https://ballpoint.st9wd.com` and pnpm 11 via corepack | st9wd.com already lives there; no Git remote yet, so CLI deploys. Domain needs one CNAME at Namecheap |
| D68 | The shadcn registry directory PR waits until v1 (special sets 1–2) ships | Your call: reviewers and the directory's readers see the complete set first. The namespace URL template means items added later would appear anyway, so nothing is lost by waiting |
| D69 | Annotate is an inline-block sized to the words (line height 1.2), with one drawing per mark | The marks hug the text whatever the paragraph's leading. A mark spanning a line break would need per-line rects; it's for a word or a short phrase, and the docs say so |
| D70 | Paper's texture is one tile of faint black and white specks laid over `--paper`, not a tile per paper colour; its fibres are dark only | A component can't know the paper colour ahead of time. Specks centred on the measured noise mean keep the sheet its own colour on average; pale fibres were invisible on cream and read as scratches on navy |
| D71 | `ink-icons` is a registry:ui item on ink-core's glyph renderer (`GlyphSvg`), and includes every ink-core glyph | One grid, one renderer, one name space: `<InkIcon name="check" />` and the components' own ticks are the same drawing |
| D72 | Text written in (`.ink-write`) waits on its sibling's pending drawing via `:has()`, in base.css | No second observer: the heading starts writing when the IntersectionObserver releases its swoosh |
| D73 | State strokes (hover, focus, checked) honour their delay when drawing in | Annotate's `active` marks have several passes; without the delay they all ran at once |
| D74 | The docs dogfood the drawn set: headings are SectionHeading, code copy buttons are CopyButton | Anything wrong with them shows up on every page first |

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
| 3.5 | ✅ done 2026-10-06 | 4 pens (blue, black fineliner, pencil, green) and 3 papers (cream, white, legal pad) as `registry:theme` items; contrast gate now checks all 24 pen × paper × day/night pairs (it caught green being too light on cream and legal); base.css defaults asserted equal to blue on cream. `/customize`: pen (incl. your own hue), paper, night, roughness, weight, speed, passes, corners, fill, shadow; live sheet in a scoped theme; live WCAG readout; install command, InkProvider and CSS output. `/docs/themes` page. `test:e2e` 86/86 (6 customizer behaviours, screenshots unchanged pixel-for-pixel by the token refactor). `test:install` 20 items, asserts the last-added themes are the ones in force ✔ |
| 4 | ✅ done 2026-10-06 | card (ruled-off footer), badge (6 variants, render as link), avatar (drawn ring, fallback, badge, group), kbd, alert (red-pen destructive, action), skeleton (pencil hatching the pen keeps going back over), progress (shaded in; indeterminate patch), table (hand-ruled rows via masks), tabs (boxed or underlined mark that slides and redraws), accordion (ruled items, turning chevron). `test:e2e` 141/141 incl. 5 new behaviour tests (tab arrows move the mark, accordion opens and turns, progress values, badge as link, table rules are masks). Caught: card footer rule overflowing, round skeletons clipped square. `test:install` 30 items ✔. Bench: see D45 |
| 5 | ✅ done 2026-10-06 | dialog (lands askew and settles), alert-dialog (media ring, sm size), sheet (four sides; ruled inner edge hatching onto the page), popover, tooltip (shaded tab with tail), dropdown-menu (shaded highlight, drawn ticks and dots, submenus, scrolls inside its slip), select (drawn trigger box; opens over the trigger), toast (global `toast()`, stacked notes that fan out and swipe away). ink-core gains `InkPanel`, `InkGlyph`, `inkWash`; base gains `.ink-paper`. `test:e2e` 190/190 incl. 10 behaviour tests (focus trapped and returned, Escape, outside click on alert dialog, sheet sides, tooltip on hover and focus, menu keyboard + checkbox/radio + submenu, select by pointer and keyboard, toast action/dismiss/promise) and 16 open-state screenshots, each with axe clean. `test:install` 38 items ✔ |
| 5.5 | ✅ done 2026-10-06 | Detail pass after your review: single-pass outlines, darker control lines, smoother rounded boxes, borderless snippets, roomier headings, drawn icons in buttons and alerts, avatar group fixed, marker-swipe highlights, docs tabs/sidebar/header/home reworked. `test:e2e` 208/208 with every baseline redrawn; `test:install` 38 ✔ |
| 8a | ✅ 2026-10-07 | Production on Vercel, deployed from GitHub (useit015/ballpoint, private) on every push to `main`. DNS at Namecheap: `ballpoint` and `www` are A records to 216.198.79.1 and 76.76.21.21 (CNAMEs to Vercel resolved to 64.29.17.x / *.65, which don't answer from your network). `www.st9wd.com` attached to the portfolio project as a 308 redirect to st9wd.com. HTTPS: Let's Encrypt, valid to 2027-01-04 |
| 8b | ✅ 2026-10-07 | Repo public (useit015/ballpoint, topics set; history checked for secrets first). `/llms.txt` (index) and `/llms-full.txt` (every component's usage, props, pen settings), generated from `lib/docs.ts` so they can't drift; linked in README and footer with GitHub; e2e asserts every component is in both. Portfolio: Ballpoint added first under Projects, linking the live docs, with a pen icon drawn into the projects atlas. The shadcn registry directory PR waits for v1 (D68) |
| 6 | ✅ done 2026-10-07 | Special set 1: `annotate` (underline, circle, box, strike, scribble, bracket, highlight; ink or red pen; `as` for mark/del/s; `delay` to run marks in order; `active` draws in and pulls back out), `section-heading` (written in by a sweeping mask, swoosh, specks; the docs' own headings now use it), `paper` (texture as faint black/white specks, so it works on any paper colour; ruled on the baseline, squared, dotted; red margin; coffee rings, foxing, night lamp), `frame` (crossed photo frame, caption), `copy-button` (label swap with a drawn tick, icon sizes, status for screen readers, clipboard fallback; the docs' code blocks now use it), `ink-icons` (38 new icons on the glyph grid, plus every ink-core glyph). `test:e2e` 246/246 incl. 7 new behaviour tests (annotate in-view trigger, marks hug the words, active on/off, heading written in on scroll, copy + status + swap back, paper layers, every icon drawn); axe clean on the six new pages. Unit 41/41. `test:install` 44 items ✔ |
| 5–9 | not started | |
