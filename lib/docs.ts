import { items, type Item } from "@/registry/manifest";

export type Prop = { name: string; type: string; default?: string; description: string };

export type Doc = Item & {
  group: "Components" | "Drawn";
  /** First example is the page's main preview; the rest follow with titles. */
  examples: string[];
  exampleTitles?: Record<string, { title: string; description: string }>;
  /** Takes the shared pen settings (see penProps). */
  pen?: boolean;
  usage: string;
  props?: Prop[];
  /** Base UI component the props pass through to, for the API link. */
  primitive?: { name: string; href: string };
};

const docs: Record<string, Omit<Doc, keyof Item>> = {
  button: {
    group: "Components",
    examples: ["button-demo", "button-pens"],
    exampleTitles: {
      "button-pens": {
        title: "Pen settings",
        description: "Corners, roughness, weight, fills and shadows, per button or for a whole group with InkProvider.",
      },
    },
    pen: true,
    usage: `import { Button } from "@/components/ui/button"

export function Actions() {
  return (
    <>
      <Button>Book a call</Button>
      <Button variant="outline">Copy email</Button>
    </>
  )
}`,
    props: [
      { name: "variant", type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"', default: '"default"', description: "Shaded solid, boxed, hatched, drawn on hover, red pen, or underlined." },
      { name: "size", type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', default: '"default"', description: "Height and type size. Icon sizes are square." },
      { name: "seed", type: "string | number", description: "Pins the drawing. By default each button gets its own wobble, stable between server and client." },
    ],
    primitive: { name: "Button", href: "https://base-ui.com/react/components/button" },
  },
};

/** The pen settings every drawn component takes, as props or from InkProvider. */
export const penProps: Prop[] = [
  { name: "draw", type: '"auto" | "mount" | "none"', default: '"auto"', description: "When the strokes draw themselves in: the first time they scroll into view, as soon as they render, or never (already drawn)." },
  { name: "roughness", type: "number", default: "1", description: "0 is ruler-neat, 1 a quick confident hand, 2 a scrawl." },
  { name: "passes", type: "1 | 2 | 3", description: "How many times an outline is gone over. Each component picks its own default." },
  { name: "radius", type: 'number | "full"', default: "0", description: 'Corner radius in px; "full" draws a pill.' },
  { name: "corners", type: '"crossed" | "joined"', default: '"crossed"', description: "Square corners: sides pulled separately past each other, or the box drawn in one motion." },
  { name: "fill", type: '"shade" | "hatch" | "scribble" | "flat"', description: "How an area is coloured in. Solid parts default to shade, light ones to hatch." },
  { name: "shadow", type: '"hatch" | "solid" | "none"', default: '"hatch"', description: 'What a lifted box leaves on the paper. "none" turns the lift off too.' },
  { name: "weight", type: "number", default: "1", description: "Line weight multiplier. Also settable in CSS as --ink-weight." },
  { name: "speed", type: "number", default: "1", description: "Drawing speed multiplier. Also settable in CSS as --ink-speed." },
];

export const allDocs: Doc[] = items.filter((item) => docs[item.name]).map((item) => ({ ...item, ...docs[item.name] }));

export const getDoc = (name: string) => allDocs.find((doc) => doc.name === name);

export const install = {
  pnpm: (what: string) => `pnpm dlx shadcn@latest ${what}`,
  npm: (what: string) => `npx shadcn@latest ${what}`,
  yarn: (what: string) => `yarn shadcn@latest ${what}`,
  bun: (what: string) => `bunx --bun shadcn@latest ${what}`,
};
