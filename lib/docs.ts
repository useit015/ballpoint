import { items, type Item } from "@/registry/manifest";

export type Prop = { name: string; type: string; default?: string; description: string };

export type Doc = Item & {
  group: "Components" | "Drawn";
  /** First example is the page's main preview. */
  examples: string[];
  usage: string;
  props?: Prop[];
  /** Base UI component the props pass through to, for the API link. */
  primitive?: { name: string; href: string };
};

const docs: Record<string, Omit<Doc, keyof Item>> = {
  button: {
    group: "Components",
    examples: ["button-demo"],
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
      { name: "draw", type: '"none" | "mount"', default: '"none"', description: '"mount" draws the box in when the button first renders.' },
    ],
    primitive: { name: "Button", href: "https://base-ui.com/react/components/button" },
  },
};

export const allDocs: Doc[] = items.filter((item) => docs[item.name]).map((item) => ({ ...item, ...docs[item.name] }));

export const getDoc = (name: string) => allDocs.find((doc) => doc.name === name);

export const install = {
  pnpm: (what: string) => `pnpm dlx shadcn@latest ${what}`,
  npm: (what: string) => `npx shadcn@latest ${what}`,
  yarn: (what: string) => `yarn shadcn@latest ${what}`,
  bun: (what: string) => `bunx --bun shadcn@latest ${what}`,
};
