// The registry's items. scripts/build-registry.ts adds the base item's
// cssVars and css (from registry/ballpoint/styles/base.css) and writes
// registry.json for `shadcn build`.

export const registryUrl = (process.env.BALLPOINT_REGISTRY_URL ?? "http://localhost:4400").replace(/\/$/, "");
export const homepage = process.env.BALLPOINT_HOMEPAGE ?? "https://ballpoint.st9wd.com";

const author = "Oussama Nahiz <useit015@gmail.com>";

export type Item = {
  name: string;
  type: string;
  title: string;
  description: string;
  author?: string;
  extends?: "none";
  config?: Record<string, unknown>;
  font?: Record<string, unknown>;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: { path: string; type: string; target?: string }[];
  categories?: string[];
  docs?: string;
};

export const items: Item[] = [
  {
    name: "ballpoint",
    type: "registry:base",
    title: "Ballpoint",
    description: "Paper, one ink, a red pen, and the stroke engine every Ballpoint component draws with.",
    author,
    extends: "none",
    config: {
      registries: { "@ballpoint": `${registryUrl}/r/{name}.json` },
    },
    registryDependencies: ["utils", "@ballpoint/font-gaegu", "@ballpoint/ink-core"],
  },
  {
    name: "font-gaegu",
    type: "registry:font",
    title: "Gaegu",
    description: "An upright monoline print hand, the closest type to a ballpoint.",
    author,
    font: {
      family: "'Gaegu', 'Segoe Print', 'Bradley Hand', cursive",
      provider: "google",
      import: "Gaegu",
      variable: "--font-sans",
      weight: ["300", "400", "700"],
      subsets: ["latin"],
    },
  },
  {
    name: "ink-core",
    type: "registry:lib",
    title: "Ink core",
    description: "Seeded ballpoint stroke geometry, the SVG primitives that draw it, and a hook that sizes it to its element.",
    author,
    files: [
      { path: "registry/ballpoint/lib/ink-sketch.ts", type: "registry:lib" },
      { path: "registry/ballpoint/lib/ink.tsx", type: "registry:lib" },
      { path: "registry/ballpoint/lib/ink-outline.tsx", type: "registry:lib" },
      { path: "registry/ballpoint/hooks/use-ink-box.ts", type: "registry:hook" },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    title: "Button",
    description: "A pen-drawn box that lifts off a hatched shadow. Solid, outline, secondary, ghost, destructive and link.",
    author,
    dependencies: ["@base-ui/react", "class-variance-authority"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/button.tsx", type: "registry:ui" }],
  },
  {
    name: "input",
    type: "registry:ui",
    title: "Input",
    description: "A text field in a drawn box, or on the line you write on. Focus draws one more pass in full ink; invalid redraws it in red pen.",
    author,
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/input.tsx", type: "registry:ui" }],
  },
  {
    name: "textarea",
    type: "registry:ui",
    title: "Textarea",
    description: "A multi-line field in a drawn box that grows with its text, optionally on ruled lines.",
    author,
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/textarea.tsx", type: "registry:ui" }],
  },
  {
    name: "label",
    type: "registry:ui",
    title: "Label",
    description: "A label in the hand, that dims with the control it names.",
    author,
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/label.tsx", type: "registry:ui" }],
  },
  {
    name: "separator",
    type: "registry:ui",
    title: "Separator",
    description: "A gently wandering pen rule, horizontal or vertical.",
    author,
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/separator.tsx", type: "registry:ui" }],
  },
  {
    name: "field",
    type: "registry:ui",
    title: "Field",
    description: "Labels, descriptions, red-pen errors, fieldsets and choice cards: shadcn's field layout, drawn.",
    author,
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils", "@ballpoint/ink-core", "@ballpoint/label", "@ballpoint/separator"],
    files: [{ path: "registry/ballpoint/ui/field.tsx", type: "registry:ui" }],
  },
  {
    name: "checkbox",
    type: "registry:ui",
    title: "Checkbox",
    description: "A drawn box that ticks with a pull up and out past the corner, and dashes when indeterminate.",
    author,
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/checkbox.tsx", type: "registry:ui" }],
  },
  {
    name: "radio-group",
    type: "registry:ui",
    title: "Radio Group",
    description: "Drawn rings; choosing one inks a dot in the middle with a tight spiral.",
    author,
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/radio-group.tsx", type: "registry:ui" }],
  },
  {
    name: "switch",
    type: "registry:ui",
    title: "Switch",
    description: "A pill pulled in one motion, shaded in with the pen as the thumb slides across.",
    author,
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/switch.tsx", type: "registry:ui" }],
  },
  {
    name: "slider",
    type: "registry:ui",
    title: "Slider",
    description: "A pencilled line with the chosen range inked over it, and a drawn ring to drag.",
    author,
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/slider.tsx", type: "registry:ui" }],
  },
  {
    name: "card",
    type: "registry:ui",
    title: "Card",
    description: "A box pencilled around a block of content, with a ruled-off footer.",
    author,
    registryDependencies: ["utils", "@ballpoint/ink-core", "@ballpoint/separator"],
    files: [{ path: "registry/ballpoint/ui/card.tsx", type: "registry:ui" }],
  },
  {
    name: "badge",
    type: "registry:ui",
    title: "Badge",
    description: "A word circled or coloured in: a pill pulled once around it, shaded, hatched or in red pen.",
    author,
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/badge.tsx", type: "registry:ui" }],
  },
  {
    name: "avatar",
    type: "registry:ui",
    title: "Avatar",
    description: "A portrait circled with the pen; initials on a wash of ink when there's no picture.",
    author,
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/avatar.tsx", type: "registry:ui" }],
  },
  {
    name: "kbd",
    type: "registry:ui",
    title: "Kbd",
    description: "A keycap sketched as a small box with a heavier bottom edge.",
    author,
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/kbd.tsx", type: "registry:ui" }],
  },
  {
    name: "alert",
    type: "registry:ui",
    title: "Alert",
    description: "A note boxed off from the page; the destructive one in red pen.",
    author,
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/alert.tsx", type: "registry:ui" }],
  },
  {
    name: "skeleton",
    type: "registry:ui",
    title: "Skeleton",
    description: "A placeholder pencilled in with hatching the pen keeps going back over.",
    author,
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/skeleton.tsx", type: "registry:ui" }],
  },
  {
    name: "progress",
    type: "registry:ui",
    title: "Progress",
    description: "A pill shaded in as the work gets done; indeterminate slides a patch of shading along.",
    author,
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/progress.tsx", type: "registry:ui" }],
  },
  {
    name: "table",
    type: "registry:ui",
    title: "Table",
    description: "Rows ruled off by hand, three different lines so neighbours never match.",
    author,
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/table.tsx", type: "registry:ui" }],
  },
  {
    name: "tabs",
    type: "registry:ui",
    title: "Tabs",
    description: "The chosen tab boxed or underlined by hand; the mark slides across and redraws to fit.",
    author,
    dependencies: ["@base-ui/react", "class-variance-authority"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/tabs.tsx", type: "registry:ui" }],
  },
  {
    name: "accordion",
    type: "registry:ui",
    title: "Accordion",
    description: "Hand-ruled sections with a drawn chevron that turns over as they open.",
    author,
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "@ballpoint/ink-core"],
    files: [{ path: "registry/ballpoint/ui/accordion.tsx", type: "registry:ui" }],
  },
];
