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
];
