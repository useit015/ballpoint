import { items, type Item } from "@/registry/manifest";

export type Prop = { name: string; type: string; default?: string; description: string };

export type Doc = Item & {
  group: "Components" | "Drawn";
  /** First example is the page's main preview; the rest follow with titles. */
  examples: string[];
  exampleTitles?: Record<string, { title: string; description: string }>;
  /** Which shared pen settings it takes (see penProps). */
  pen?: readonly string[];
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
    pen: ["draw", "roughness", "passes", "radius", "corners", "fill", "shadow", "weight", "speed"],
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
  input: {
    group: "Components",
    examples: ["input-demo"],
    usage: `import { Input } from "@/components/ui/input"

<Input type="email" placeholder="you@example.com" />`,
    props: [
      { name: "variant", type: '"box" | "line"', default: '"box"', description: "Drawn around the field, or the line you write on." },
      { name: "className", type: "string", description: "Styles the drawn box (width, margins, type size). Every other prop goes to the <input>." },
      { name: "aria-invalid", type: "boolean", description: "Redraws the box in red pen." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    primitive: { name: "Input", href: "https://base-ui.com/react/components/input" },
    pen: ["draw", "roughness", "passes", "radius", "corners", "weight", "speed"],
  },
  textarea: {
    group: "Components",
    examples: ["textarea-demo"],
    usage: `import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Write something." />`,
    props: [
      { name: "variant", type: '"box" | "lined"', default: '"box"', description: "A drawn box, or one with ruled lines to write on." },
      { name: "className", type: "string", description: "Styles the drawn box. Every other prop goes to the <textarea>." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "roughness", "passes", "radius", "corners", "weight", "speed"],
  },
  label: {
    group: "Components",
    examples: ["label-demo"],
    usage: `import { Label } from "@/components/ui/label"

<Label htmlFor="email">Email</Label>`,
  },
  separator: {
    group: "Components",
    examples: ["separator-demo"],
    usage: `import { Separator } from "@/components/ui/separator"

<Separator />
<Separator orientation="vertical" />`,
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Which way the rule runs." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    primitive: { name: "Separator", href: "https://base-ui.com/react/components/separator" },
    pen: ["draw", "weight", "speed"],
  },
  field: {
    group: "Components",
    examples: ["field-demo"],
    usage: `import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field data-invalid>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" aria-invalid />
  <FieldDescription>We only write when it matters.</FieldDescription>
  <FieldError>That email is missing its domain.</FieldError>
</Field>`,
    props: [
      { name: "Field orientation", type: '"vertical" | "horizontal" | "responsive"', default: '"vertical"', description: "Label above the control, beside it, or beside it once the group is wide enough." },
      { name: "FieldLegend variant", type: '"legend" | "label"', default: '"legend"', description: "A fieldset title, or one sized like a label." },
      { name: "FieldError errors", type: "{ message?: string }[]", description: "Shows each unique message; children win if given." },
    ],
  },
  checkbox: {
    group: "Components",
    examples: ["checkbox-demo"],
    usage: `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

<Label>
  <Checkbox defaultChecked />
  Send me the newsletter
</Label>`,
    props: [
      { name: "indeterminate", type: "boolean", description: "Draws a dash instead of a tick." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    primitive: { name: "Checkbox", href: "https://base-ui.com/react/components/checkbox" },
    pen: ["draw", "roughness", "passes", "radius", "corners", "weight", "speed"],
  },
  "radio-group": {
    group: "Components",
    examples: ["radio-group-demo"],
    usage: `import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

<RadioGroup defaultValue="blue">
  <Label>
    <RadioGroupItem value="blue" />
    Blue ballpoint
  </Label>
  <Label>
    <RadioGroupItem value="pencil" />
    Pencil
  </Label>
</RadioGroup>`,
    props: [{ name: "RadioGroupItem seed", type: "string | number", description: "Pins the drawing." }],
    primitive: { name: "Radio", href: "https://base-ui.com/react/components/radio" },
    pen: ["draw", "passes", "weight", "speed"],
  },
  switch: {
    group: "Components",
    examples: ["switch-demo"],
    usage: `import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

<Label>
  <Switch defaultChecked />
  Draw things in
</Label>`,
    props: [
      { name: "size", type: '"default" | "sm"', default: '"default"', description: "Track size." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    primitive: { name: "Switch", href: "https://base-ui.com/react/components/switch" },
    pen: ["draw", "roughness", "passes", "fill", "weight", "speed"],
  },
  slider: {
    group: "Components",
    examples: ["slider-demo"],
    usage: `import { Slider } from "@/components/ui/slider"

<Slider defaultValue={40} aria-label="Roughness" />
<Slider defaultValue={[20, 70]} aria-label="Range" />`,
    props: [{ name: "seed", type: "string | number", description: "Pins the drawing." }],
    primitive: { name: "Slider", href: "https://base-ui.com/react/components/slider" },
    pen: ["draw", "weight", "speed"],
  },
  card: {
    group: "Components",
    examples: ["card-demo"],
    usage: `import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Ink refill</CardTitle>
    <CardDescription>Medium point, blue.</CardDescription>
  </CardHeader>
  <CardContent>Fits most clicky pens.</CardContent>
  <CardFooter>…</CardFooter>
</Card>`,
    props: [
      { name: "size", type: '"default" | "sm"', default: '"default"', description: "Inner spacing." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "roughness", "passes", "radius", "corners", "weight", "speed"],
  },
  badge: {
    group: "Components",
    examples: ["badge-demo"],
    usage: `import { Badge } from "@/components/ui/badge"

<Badge>New</Badge>
<Badge variant="outline">v1.2</Badge>
<Badge variant="link" render={<a href="/changelog" />}>Changelog</Badge>`,
    props: [
      { name: "variant", type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"', default: '"default"', description: "Coloured in, hatched, red pen, circled, circled on hover, or underlined." },
      { name: "render", type: "ReactElement", description: "Render as another element, e.g. a link." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "roughness", "radius", "fill", "weight", "speed"],
  },
  avatar: {
    group: "Components",
    examples: ["avatar-demo"],
    usage: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/me.jpg" alt="Me" />
  <AvatarFallback>ON</AvatarFallback>
</Avatar>`,
    props: [
      { name: "size", type: '"default" | "sm" | "lg"', default: '"default"', description: "24, 32 or 40px." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    primitive: { name: "Avatar", href: "https://base-ui.com/react/components/avatar" },
    pen: ["draw", "passes", "weight", "speed"],
  },
  kbd: {
    group: "Components",
    examples: ["kbd-demo"],
    usage: `import { Kbd, KbdGroup } from "@/components/ui/kbd"

<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>`,
    pen: ["draw", "roughness", "radius", "weight", "speed"],
  },
  alert: {
    group: "Components",
    examples: ["alert-demo"],
    usage: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert variant="destructive">
  <AlertTitle>The page couldn't be saved</AlertTitle>
  <AlertDescription>The connection dropped halfway.</AlertDescription>
</Alert>`,
    props: [
      { name: "variant", type: '"default" | "destructive"', default: '"default"', description: "Pencil, or red pen." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "roughness", "passes", "radius", "corners", "weight", "speed"],
  },
  skeleton: {
    group: "Components",
    examples: ["skeleton-demo"],
    usage: `import { Skeleton } from "@/components/ui/skeleton"

<Skeleton className="h-4 w-48" />`,
  },
  progress: {
    group: "Components",
    examples: ["progress-demo"],
    usage: `import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

<Progress value={40}>
  <ProgressLabel>Uploading</ProgressLabel>
  <ProgressValue />
</Progress>`,
    props: [
      { name: "value", type: "number | null", description: "null for indeterminate: a patch of shading slides along." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    primitive: { name: "Progress", href: "https://base-ui.com/react/components/progress" },
    pen: ["draw", "roughness", "passes", "radius", "fill", "weight", "speed"],
  },
  table: {
    group: "Components",
    examples: ["table-demo"],
    usage: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV-001</TableCell>
      <TableCell>£12.50</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  },
  tabs: {
    group: "Components",
    examples: ["tabs-demo"],
    usage: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">…</TabsContent>
  <TabsContent value="password">…</TabsContent>
</Tabs>`,
    props: [
      { name: "TabsList variant", type: '"default" | "line"', default: '"default"', description: "Box the chosen tab, or underline it." },
      { name: "TabsList seed", type: "string | number", description: "Pins the drawing." },
    ],
    primitive: { name: "Tabs", href: "https://base-ui.com/react/components/tabs" },
    pen: ["roughness", "passes", "radius", "corners", "weight", "speed"],
  },
  accordion: {
    group: "Components",
    examples: ["accordion-demo"],
    usage: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

<Accordion>
  <AccordionItem value="a">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes.</AccordionContent>
  </AccordionItem>
</Accordion>`,
    primitive: { name: "Accordion", href: "https://base-ui.com/react/components/accordion" },
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
