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
    props: [
      { name: "htmlFor", type: "string", description: "The id of the control it names. Or wrap the control instead: the label lays it out beside the text." },
      { name: "className", type: "string", description: "A plain <label>: every prop goes to it." },
    ],
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
    props: [
      { name: "children", type: "ReactNode", description: "The key: a letter, a word, or an icon." },
      { name: "KbdGroup", type: "component", description: "Sets keys pressed together side by side, in the hand." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
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
    props: [
      { name: "className", type: "string", description: "Size and shape it: rounded-full makes a round placeholder." },
      { name: "seed", type: "string | number", description: "Pins the hatching." },
    ],
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
    props: [
      { name: "TableRow", type: "component", description: "Each row is ruled off underneath by hand, three different lines so neighbours never match." },
      { name: "TableFooter", type: "component", description: "Totals, set in bold under the rows." },
      { name: "TableCaption", type: "component", description: "A note under the table, in lighter ink." },
    ],
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
    props: [
      { name: "multiple", type: "boolean", default: "false", description: "On Accordion: lets more than one item stay open." },
      { name: "defaultValue", type: "string[]", description: "On Accordion: the items open to begin with." },
      { name: "AccordionTrigger seed", type: "string | number", description: "Pins the chevron's drawing." },
    ],
    primitive: { name: "Accordion", href: "https://base-ui.com/react/components/accordion" },
  },
  dialog: {
    group: "Components",
    examples: ["dialog-demo"],
    usage: `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Edit profile</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Save when you're done.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button />}>Save</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    props: [
      { name: "DialogContent showCloseButton", type: "boolean", default: "true", description: "A drawn cross in the top-right corner." },
      { name: "DialogFooter showCloseButton", type: "boolean", default: "false", description: "Adds an outlined Close button to the footer." },
      { name: "DialogTrigger render", type: "ReactElement", description: "Renders the trigger as your own element, usually a Button." },
      { name: "seed", type: "string | number", description: "On DialogContent: pins the drawing." },
    ],
    pen: ["draw", "roughness", "passes", "radius", "corners", "shadow", "weight", "speed"],
    primitive: { name: "Dialog", href: "https://base-ui.com/react/components/dialog" },
  },
  "alert-dialog": {
    group: "Components",
    examples: ["alert-dialog-demo"],
    usage: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this notebook?</AlertDialogTitle>
      <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep it</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    props: [
      { name: "AlertDialogContent size", type: '"default" | "sm"', default: '"default"', description: "Small centres everything and puts the two buttons side by side." },
      { name: "AlertDialogMedia", type: "component", description: "An icon in a ring drawn round it, beside the title." },
      { name: "AlertDialogAction / AlertDialogCancel", type: "Button props", description: "The answer, and the way out. Cancel closes the dialog and is outlined by default." },
      { name: "seed", type: "string | number", description: "On AlertDialogContent: pins the drawing." },
    ],
    pen: ["draw", "roughness", "passes", "radius", "corners", "shadow", "weight", "speed"],
    primitive: { name: "Alert Dialog", href: "https://base-ui.com/react/components/alert-dialog" },
  },
  sheet: {
    group: "Components",
    examples: ["sheet-demo"],
    usage: `import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>Save when you're done.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
    props: [
      { name: "SheetContent side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', description: "The edge it slides in from." },
      { name: "SheetContent showCloseButton", type: "boolean", default: "true", description: "A drawn cross in the top-right corner." },
      { name: "seed", type: "string | number", description: "On SheetContent: pins the drawing." },
    ],
    pen: ["draw", "roughness", "weight", "speed"],
    primitive: { name: "Dialog", href: "https://base-ui.com/react/components/dialog" },
  },
  popover: {
    group: "Components",
    examples: ["popover-demo"],
    usage: `import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>Open</PopoverTrigger>
  <PopoverContent>Place content here.</PopoverContent>
</Popover>`,
    props: [
      { name: "side", type: '"top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"', default: '"bottom"', description: "On PopoverContent: which side of the trigger it opens on." },
      { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "How it lines up with the trigger along that side." },
      { name: "sideOffset / alignOffset", type: "number", default: "8 / 0", description: "Gap from the trigger, and nudge along it, in px." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "roughness", "passes", "radius", "corners", "shadow", "weight", "speed"],
    primitive: { name: "Popover", href: "https://base-ui.com/react/components/popover" },
  },
  tooltip: {
    group: "Components",
    examples: ["tooltip-demo"],
    usage: `import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
    <TooltipContent>Saved to your notebook</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
    props: [
      { name: "TooltipProvider delay", type: "number", default: "0", description: "ms before a tooltip opens. Tooltips under one provider open instantly after the first." },
      { name: "side", type: '"top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"', default: '"top"', description: "On TooltipContent: which side of the trigger it shows on." },
      { name: "align / sideOffset / alignOffset", type: "string / number", default: '"center" / 8 / 0', description: "Placement along that side, in px." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["roughness", "radius", "weight"],
    primitive: { name: "Tooltip", href: "https://base-ui.com/react/components/tooltip" },
  },
  "dropdown-menu": {
    group: "Components",
    examples: ["dropdown-menu-demo"],
    usage: `import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Notebook</DropdownMenuLabel>
    <DropdownMenuItem>New page</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Tear out page</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    props: [
      { name: "DropdownMenuItem variant", type: '"default" | "destructive"', default: '"default"', description: "Destructive rows are written, and shaded, in red pen." },
      { name: "inset", type: "boolean", description: "On items, labels and sub-triggers: lines them up with checkable items." },
      { name: "DropdownMenuCheckboxItem checked", type: "boolean", description: "Ticked when true; the tick draws in and pulls back out." },
      { name: "DropdownMenuContent side / align", type: "string", default: '"bottom" / "start"', description: "Where it opens against the trigger." },
      { name: "seed", type: "string | number", description: "On DropdownMenuContent: pins the drawing." },
    ],
    pen: ["draw", "roughness", "passes", "radius", "corners", "shadow", "weight", "speed"],
    primitive: { name: "Menu", href: "https://base-ui.com/react/components/menu" },
  },
  select: {
    group: "Components",
    examples: ["select-demo"],
    usage: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pens = [
  { label: "Blue ballpoint", value: "blue" },
  { label: "Black fineliner", value: "black" },
]

<Select items={pens}>
  <SelectTrigger aria-label="Pen" className="w-52">
    <SelectValue placeholder="Pick a pen" />
  </SelectTrigger>
  <SelectContent>
    {pens.map((pen) => (
      <SelectItem key={pen.value} value={pen.value}>
        {pen.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>`,
    props: [
      { name: "Select items", type: "{ label, value }[]", description: "Lets SelectValue show the chosen item's label rather than its value." },
      { name: "SelectTrigger size", type: '"default" | "sm"', default: '"default"', description: "Height and type size, matching Input." },
      { name: "SelectContent alignItemWithTrigger", type: "boolean", default: "true", description: "Opens over the trigger with the chosen item lined up on it, like a native select. False drops it below." },
      { name: "seed", type: "string | number", description: "On SelectTrigger and SelectContent: pins the drawing." },
    ],
    pen: ["draw", "roughness", "passes", "radius", "corners", "shadow", "weight", "speed"],
    primitive: { name: "Select", href: "https://base-ui.com/react/components/select" },
  },
  toast: {
    group: "Components",
    examples: ["toast-demo"],
    usage: `// app/layout.tsx: once, near the root
import { Toaster } from "@/components/ui/toast"

<body>
  {children}
  <Toaster />
</body>

// anywhere
import { toast } from "@/components/ui/toast"

toast("Page torn out", { action: { label: "Undo", onClick: restore } })
toast.success("Saved")
toast.error("Couldn't send")
toast.promise(save(), { loading: "Saving…", success: "Saved", error: "Couldn't save" })`,
    props: [
      { name: "toast(title, options)", type: "string id", description: "Also toast.success, .error, .warning, .info, .loading (stays until dismissed), .promise, .update and .dismiss(id?)." },
      { name: "options", type: "{ description, action, timeout, priority, id, onClose }", description: "action is { label, onClick }; timeout 0 keeps it up; priority \"high\" announces it at once." },
      { name: "Toaster limit", type: "number", default: "3", description: "How many notes show at once; older ones wait." },
      { name: "Toaster timeout", type: "number", default: "5000", description: "ms before a note takes itself down." },
    ],
    pen: ["draw", "roughness", "passes", "radius", "corners", "shadow", "weight", "speed"],
    primitive: { name: "Toast", href: "https://base-ui.com/react/components/toast" },
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
