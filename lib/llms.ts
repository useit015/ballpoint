// /llms.txt and /llms-full.txt: the docs as plain markdown for language
// models (https://llmstxt.org). Built from the same data as the pages, so
// they can't drift from the site.

import { allDocs, install, penProps, tokens, type Doc, type Prop } from "@/lib/docs";
import { homepage } from "@/registry/manifest";
import { papers, pens } from "@/registry/themes";

const repo = "https://github.com/useit015/ballpoint";

const summary =
  "shadcn-style React components drawn in blue ballpoint, on Base UI. Same names and props as shadcn/ui; every border, fill, rule and icon is a seeded pen stroke. Installed with the shadcn CLI as source you own. React 19, Tailwind CSS 4, MIT.";

const about = [
  "Strokes are generated from a seed, so a component draws the same wobble on the server and in the browser. By default everything draws itself in the first time it scrolls into view; with reduced motion it appears already drawn.",
  "Everything is one ink at different pressures on one paper. Change `--ink` and `--paper` and the rest follows; shadcn's own token names (`--background`, `--primary`, `--border`, …) are mapped onto these, so shadcn blocks sit on the same page.",
];

const init = install.npm(`init ${homepage}/r/ballpoint.json`);

const themeItems = [
  ...Object.entries(pens).map(([name, pen]) => ({ name: `pen-${name}`, ...pen })),
  ...Object.entries(papers).map(([name, paper]) => ({ name: `paper-${name}`, ...paper })),
];

const props = (list: Prop[]) =>
  list.map((p) => `- \`${p.name}\`: \`${p.type}\`${p.default ? ` (default \`${p.default}\`)` : ""}. ${p.description}`);

export function llmsTxt() {
  return [
    "# Ballpoint",
    "",
    `> ${summary}`,
    "",
    ...about.flatMap((line) => [line, ""]),
    "## Install",
    "",
    `- \`${init}\`: writes the tokens into your global CSS, adds the Gaegu font, copies the stroke engine and registers the \`@ballpoint\` namespace in components.json.`,
    `- \`${install.npm("add @ballpoint/button")}\`: then any component by name.`,
    "",
    "## Docs",
    "",
    `- [Installation](${homepage}/docs): init, add, theme tokens and pen settings`,
    `- [Pens and papers](${homepage}/docs/themes): the other inks and paper stocks, each one registry item`,
    `- [Customizer](${homepage}/customize): try a pen, a paper and the pen settings together, and copy the result`,
    `- [Everything in one file](${homepage}/llms-full.txt): every component's usage, props and pen settings`,
    "",
    "## Components",
    "",
    ...allDocs.map((doc) => `- [${doc.title}](${homepage}/docs/${doc.name}): ${doc.description} \`@ballpoint/${doc.name}\``),
    "",
    "## Pens and papers",
    "",
    ...themeItems.map((t) => `- \`@ballpoint/${t.name}\`: ${t.title}. ${t.description}`),
    "",
    "## Optional",
    "",
    `- [Source on GitHub](${repo})`,
    `- [Registry index](${homepage}/r/registry.json): the shadcn registry, one JSON file per item under /r/`,
    "",
  ].join("\n");
}

function component(doc: Doc) {
  return [
    `## ${doc.title}`,
    "",
    doc.description,
    "",
    `Docs: ${homepage}/docs/${doc.name}`,
    "",
    "```bash",
    install.npm(`add @ballpoint/${doc.name}`),
    "```",
    "",
    "```tsx",
    doc.usage,
    "```",
    "",
    ...(doc.props?.length ? ["Props:", "", ...props(doc.props), ""] : []),
    ...(doc.pen?.length ? [`Pen settings: ${doc.pen.map((name) => `\`${name}\``).join(", ")} (see Pen settings above).`, ""] : []),
    ...(doc.primitive ? [`Every other prop goes to Base UI's ${doc.primitive.name}: ${doc.primitive.href}`, ""] : []),
  ];
}

export function llmsFullTxt() {
  return [
    "# Ballpoint",
    "",
    `> ${summary}`,
    "",
    ...about.flatMap((line) => [line, ""]),
    `Site: ${homepage}`,
    `Source: ${repo}`,
    "",
    "## Installation",
    "",
    "Ballpoint is a shadcn registry: the CLI copies the components into your app and you own them. It needs React 19 and Tailwind CSS 4; the examples assume Next.js.",
    "",
    "1. Set up the paper and ink. In an app that already has Tailwind CSS 4, run init with the Ballpoint base. It writes the colour, type and motion tokens into your global CSS, adds Gaegu with next/font, copies the stroke engine into lib/ and hooks/, and registers the @ballpoint namespace in components.json.",
    "",
    "```bash",
    init,
    "```",
    "",
    "2. Add components.",
    "",
    "```bash",
    install.npm("add @ballpoint/button"),
    "```",
    "",
    "```tsx",
    'import { Button } from "@/components/ui/button"',
    "",
    "<Button>Book a call</Button>",
    "```",
    "",
    "## Theming",
    "",
    "Everything is one ink at different pressures, mixed toward the paper in oklab so the hue never drifts.",
    "",
    ...tokens.map(([name, what]) => `- \`${name}\`: ${what}`),
    "",
    "Other pens and papers install the same way, for example `add @ballpoint/pen-black @ballpoint/paper-white`:",
    "",
    ...themeItems.map((t) => `- \`@ballpoint/${t.name}\`: ${t.title}. ${t.description}`),
    "",
    "## Pen settings",
    "",
    "Pass `seed` to pin a component's drawing. How the pen behaves is yours to set per component, or for a whole region with InkProvider; a `salt` there redraws everything inside in a slightly different hand.",
    "",
    "```tsx",
    'import { InkProvider } from "@/hooks/use-ink-box"',
    "",
    '<InkProvider radius={10} roughness={0.8} fill="hatch">',
    "  {children}",
    "</InkProvider>",
    "```",
    "",
    ...props(penProps),
    "",
    ...allDocs.flatMap(component),
  ].join("\n");
}
