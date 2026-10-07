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
    examples: ["button-demo", "button-pens", "button-icons", "button-loading", "button-link", "button-actions"],
    exampleTitles: {
      "button-pens": {
        title: "Pen settings",
        description: "Corners, roughness, weight, fills and shadows, per button or for a whole group with InkProvider.",
      },
      "button-icons": { title: "With icons", description: "Icons sit beside the label, or stand alone in the icon sizes." },
      "button-loading": { title: "Loading", description: "Disable the button while it works and show a spinning loop; the label says what is happening." },
      "button-link": { title: "As a link", description: "Render the button’s drawing on an <a> with render and nativeButton={false}." },
      "button-actions": { title: "Form actions", description: "Cancel, save and publish in order of weight; a destructive choice beside a quiet alternative." },
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
    examples: ["input-demo", "input-types", "input-states", "input-with-button"],
    exampleTitles: {
      "input-types": { title: "Types", description: "Password, number, search and file inputs, each with a field label and hint." },
      "input-states": { title: "States", description: "Read-only, disabled, and invalid in the box or on the line." },
      "input-with-button": { title: "With a button", description: "An email field and a submit button on one row." },
    },
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
    examples: ["textarea-demo", "textarea-counter", "textarea-states", "textarea-with-button"],
    exampleTitles: {
      "textarea-counter": { title: "Character count", description: "A live count that turns red when the note runs over." },
      "textarea-states": { title: "States", description: "Invalid with a message, read-only and disabled." },
      "textarea-with-button": { title: "With a button", description: "A message field with its send button." },
    },
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
    examples: ["label-demo", "label-controls"],
    exampleTitles: {
      "label-controls": { title: "With controls", description: "Wrap a switch, radio or checkbox so the whole row is clickable; mark required fields; disabled controls dim their label." },
    },
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
    examples: ["field-demo", "field-settings", "field-errors"],
    exampleTitles: {
      "field-settings": { title: "Settings list", description: "A fieldset of horizontal fields, each with a title, a hint and a switch." },
      "field-errors": { title: "Several errors", description: "Give FieldError a list of errors and it shows each distinct message once." },
    },
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
    examples: ["checkbox-demo", "checkbox-states", "checkbox-cards"],
    exampleTitles: {
      "checkbox-states": { title: "States", description: "Unchecked, checked, mixed, disabled, and invalid with an error." },
      "checkbox-cards": { title: "Choice cards", description: "Wrap a Field in FieldLabel and the whole row becomes the target." },
    },
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
    examples: ["radio-group-demo", "radio-group-states"],
    exampleTitles: {
      "radio-group-states": { title: "States", description: "A disabled option, and a group with no choice made yet and an error." },
    },
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
    examples: ["switch-demo", "switch-settings"],
    exampleTitles: {
      "switch-settings": { title: "In a card", description: "A controlled switch in a settings card, and a disabled one beside it." },
    },
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
    examples: ["slider-demo", "slider-controlled"],
    exampleTitles: {
      "slider-controlled": { title: "Controlled", description: "Read the value as it moves: a single pen-pressure value and a price range in steps of five." },
    },
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
      { name: "AccordionTrigger header", type: "Accordion.Header props", description: "Reaches the heading row, an h3 by default. Pass { render: <div /> } to keep it out of the page outline." },
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
  "ink-icons": {
    group: "Drawn",
    examples: ["ink-icons-demo"],
    usage: `import { InkIcon } from "@/components/ui/ink-icons"

<Button variant="ghost" size="icon" aria-label="Search">
  <InkIcon name="search" />
</Button>`,
    props: [
      { name: "name", type: "IconName", description: "Which icon. iconNames lists them all." },
      { name: "draw", type: '"none" | "mount" | "hover" | "focus" | "checked"', default: '"none"', description: "When it draws itself in: never (already drawn), as it appears, or while its trigger is hovered, focused or checked." },
      { name: "label", type: "string", description: "Names the icon for screen readers when it stands on its own. Without it the icon is hidden from them." },
      { name: "duration", type: "number", default: "240", description: "ms each stroke takes to draw in." },
      { name: "className", type: "string", description: "Size it like any icon (size-4, size-5); it takes the text colour." },
    ],
  },
  annotate: {
    group: "Drawn",
    examples: ["annotate-demo", "annotate-types", "annotate-active"],
    exampleTitles: {
      "annotate-types": { title: "Seven marks", description: "Underline, circle, box, strike, scribble, bracket and highlight, in the ink or the red pen." },
      "annotate-active": { title: "On and off", description: "With active, a mark draws in when it turns true and pulls back out when it turns false." },
    },
    usage: `import { Annotate } from "@/components/ui/annotate"

<p>
  The build <Annotate type="circle" color="red">failed</Annotate> twice.
</p>`,
    props: [
      { name: "type", type: '"underline" | "circle" | "box" | "strike" | "scribble" | "bracket" | "highlight"', default: '"underline"', description: "The mark. A highlight is shaded in behind the words." },
      { name: "color", type: '"ink" | "red"', default: '"ink"', description: "The ink, or the red pen corrections are made in." },
      { name: "as", type: '"span" | "mark" | "del" | "s" | "ins" | "em" | "strong"', default: '"span"', description: "The element: mark for a highlight, del or s for words struck out, so the meaning survives without the drawing." },
      { name: "delay", type: "number", default: "0", description: "ms after it scrolls into view before the pen starts. Rising delays draw a run of marks one after another." },
      { name: "active", type: "boolean", description: "Draws the mark while true and pulls it back out when false, instead of drawing it once." },
      { name: "brackets", type: '"both" | "left" | "right"', default: '"both"', description: "Which brackets a bracket draws." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "roughness", "passes", "weight", "speed"],
  },
  "section-heading": {
    group: "Drawn",
    examples: ["section-heading-demo"],
    usage: `import { SectionHeading } from "@/components/ui/section-heading"

<section aria-labelledby="projects">
  <SectionHeading id="projects" specks>Projects</SectionHeading>
</section>`,
    props: [
      { name: "as", type: '"h1" | "h2" | "h3" | "h4"', default: '"h2"', description: "The heading level." },
      { name: "id", type: "string", description: "The heading's id, for aria-labelledby and links. Also seeds the drawing." },
      { name: "specks", type: "boolean", default: "false", description: "A few scratches beside the swoosh, where the pen was lifted." },
      { name: "delay", type: "number", default: "0", description: "ms after it scrolls into view before the pen starts." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "weight", "speed"],
  },
  paper: {
    group: "Drawn",
    examples: ["paper-demo"],
    usage: `import { Paper } from "@/components/ui/paper"

<Paper variant="ruled" margin lifted stains={1}>
  <p>Dear diary,</p>
</Paper>`,
    props: [
      { name: "variant", type: '"plain" | "ruled" | "grid" | "dots"', default: '"plain"', description: "Plain, ruled like a notebook, squared like graph paper, or dotted. Lines are --paper-rule apart (2rem), in the ink at low strength." },
      { name: "margin", type: "boolean", default: "false", description: "The red margin line down the left (--paper-margin), with the content moved clear of it." },
      { name: "texture", type: "boolean", default: "true", description: "The grain and fibres. They work on any paper colour, and average out to it, so text contrast is the contrast against --paper." },
      { name: "stains", type: "number", default: "0", description: "Coffee rings, up to 3. Brown by day; a faint warm tide line at night." },
      { name: "foxing", type: "boolean", default: "false", description: "Age spots scattered over the sheet." },
      { name: "lamp", type: "boolean", default: "false", description: "At night, a desk lamp warming the top of the sheet. Nothing by day." },
      { name: "lifted", type: "boolean", default: "false", description: "A soft shadow under the sheet." },
      { name: "as", type: '"div" | "main" | "section" | "article" | "aside"', default: '"div"', description: "The element." },
      { name: "seed", type: "string | number", description: "Moves the coffee rings." },
    ],
  },
  frame: {
    group: "Drawn",
    examples: ["frame-demo"],
    usage: `import { Frame } from "@/components/ui/frame"

<Frame caption="Drawn on a Tuesday">
  <img src="/portrait.jpg" alt="Me, at my desk" className="size-40" />
</Frame>`,
    props: [
      { name: "caption", type: "ReactNode", description: "Written under the frame, as the figure's caption." },
      { name: "gap", type: "number", default: "6", description: "px between the picture and the frame." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "roughness", "passes", "weight", "speed"],
  },
  "copy-button": {
    group: "Drawn",
    examples: ["copy-button-demo"],
    usage: `import { CopyButton } from "@/components/ui/copy-button"

<CopyButton value="hello@example.com">Copy email</CopyButton>`,
    props: [
      { name: "value", type: "string | (() => string)", description: "What to copy, or a function that returns it when clicked." },
      { name: "children", type: "ReactNode", default: '"Copy"', description: "The label. Icon sizes show the copy icon instead and use this as the button's accessible name." },
      { name: "copiedLabel", type: "ReactNode", default: '"Copied"', description: "Shown, after a drawn tick, once it's copied." },
      { name: "timeout", type: "number", default: "1600", description: "ms before it goes back to the label." },
      { name: "onCopy", type: "(value: string) => void", description: "Called once the value is on the clipboard." },
      { name: "variant, size", type: "Button's", default: '"outline"', description: "Any Button variant and size; icon sizes swap the copy icon for the tick." },
    ],
    pen: ["draw", "roughness", "passes", "radius", "corners", "fill", "shadow", "weight", "speed"],
  },
  "signature-pad": {
    group: "Drawn",
    examples: ["signature-pad-demo"],
    usage: `import { SignaturePad } from "@/components/ui/signature-pad"

<form action={sign}>
  <SignaturePad name="signature" required />
  <Button type="submit">Sign</Button>
</form>`,
    props: [
      { name: "name", type: "string", description: "The form field the signature is submitted under, as a data URL." },
      { name: "required", type: "boolean", description: "The form won't submit unsigned; the pad turns red and the browser says why." },
      { name: "valueFormat", type: '"svg" | "png"', default: '"svg"', description: "What the form receives." },
      { name: "onChange", type: "(value: string) => void", description: "After every stroke, and on clear, with the form value (empty when cleared)." },
      { name: "ref", type: "Ref<SignaturePadHandle>", description: "clear(), undo(), isEmpty(), strokes(), toSVG(options), toDataURL(type, options). Exports are trimmed to the ink, in blue ballpoint unless you pass a color." },
      { name: "label", type: "string", default: '"Signature"', description: "Names the pad for screen readers." },
      { name: "placeholder", type: "string", default: '"Sign here"', description: "Written above the line until the first stroke." },
      { name: "disabled", type: "boolean", description: "Stops the pen." },
      { name: "seed", type: "string | number", description: "Pins the drawing of the box and the line." },
    ],
    pen: ["draw", "roughness", "weight", "speed"],
  },
  "hatch-grid": {
    group: "Drawn",
    examples: ["hatch-grid-demo"],
    usage: `import { HatchGrid } from "@/components/ui/hatch-grid"

<HatchGrid
  data={days} // { date: "2026-01-01", count: 3 }[]
  today="2026-10-06"
  summary="1,203 commits in 2026"
/>`,
    props: [
      { name: "data", type: "{ date: string; count: number; level?: 0 | 1 | 2 | 3 | 4 }[]", description: "One entry a day. Level is worked out from count when left out: none, then quarters of the busiest day." },
      { name: "today", type: "string", description: "Days after it are drawn dotted, still to come." },
      { name: "unit", type: "string | [string, string]", default: '"contribution"', description: 'What\'s counted, for the hover label ("3 commits on Oct 6th, 2026"). The plural adds an s; pass [one, many] when it doesn\'t.' },
      { name: "label", type: "(day) => string", description: "What hovering a day says, in place of the unit's sentence. A function, so pass it from a client component." },
      { name: "summary", type: "string", description: "What the grid shows, for screen readers; to them it's one image." },
    ],
    pen: ["draw", "speed"],
  },
  timeline: {
    group: "Drawn",
    examples: ["timeline-demo", "timeline-vertical"],
    exampleTitles: {
      "timeline-vertical": { title: "Down the side", description: "For more stops, longer ones, or narrow screens: a line down the left, each stop landing as the pen reaches it." },
    },
    usage: `import { Timeline, TimelineDescription, TimelineItem, TimelineTime, TimelineTitle } from "@/components/ui/timeline"

<Timeline>
  <TimelineItem>
    <TimelineTitle>Ballpoint</TimelineTitle>
    <TimelineTime dateTime="2026">2026</TimelineTime>
    <TimelineDescription>The pen, for everyone.</TimelineDescription>
  </TimelineItem>
</Timeline>`,
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "An arrow across the top, each stop a column (scrolling sideways when there are more than fit), or a line down the side." },
      { name: "TimelineTime", type: "component", description: "A time element; pass dateTime for a machine-readable date." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "weight", "speed"],
  },
  "ink-theme-toggle": {
    group: "Drawn",
    examples: ["ink-theme-toggle-demo"],
    usage: `import { InkThemeToggle } from "@/components/ui/ink-theme-toggle"

// On its own: toggles .dark on <html> and remembers it.
<InkThemeToggle />

// With next-themes:
const { resolvedTheme, setTheme } = useTheme()
<InkThemeToggle theme={resolvedTheme} onThemeChange={setTheme} />`,
    props: [
      { name: "theme", type: '"light" | "dark"', description: "The current theme, when a theme library manages it." },
      { name: "onThemeChange", type: '(theme: "light" | "dark") => void', description: "Called with the new theme, inside the view transition, so the blot reveals it." },
      { name: "storageKey", type: "string", default: '"theme"', description: "Where the choice is kept in localStorage when the toggle manages the theme itself." },
      { name: "…", type: "Button's", description: "Any other Button prop (variant, size, seed)." },
    ],
  },
  "margin-note": {
    group: "Drawn",
    examples: ["margin-note-demo"],
    usage: `import { MarginNote } from "@/components/ui/margin-note"

<p className="max-w-xs">
  Every box is drawn as four pulls, and{" "}
  <MarginNote note="took three tries">the corners cross</MarginNote>.
</p>`,
    props: [
      { name: "note", type: "ReactNode", description: "What's written in the margin." },
      { name: "side", type: '"left" | "right"', default: '"right"', description: "Which margin. Below lg the note drops in under the line instead." },
      { name: "color", type: '"ink" | "red"', default: '"ink"', description: "The ink, or the red pen." },
      { name: "className", type: "string", description: "Styles the note; --margin-note-width (9rem) and --margin-note-gap (2.5rem) set its size and distance." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "weight", "speed"],
  },
  checklist: {
    group: "Drawn",
    examples: ["checklist-demo"],
    usage: `import { Checklist, ChecklistItem } from "@/components/ui/checklist"

<Checklist defaultValue={["pens"]}>
  <ChecklistItem value="pens">Buy more blue pens</ChecklistItem>
  <ChecklistItem value="ship">Ship it</ChecklistItem>
</Checklist>`,
    props: [
      { name: "value / defaultValue", type: "string[]", description: "The done items, controlled or not." },
      { name: "onValueChange", type: "(value: string[]) => void", description: "Called as items are ticked and unticked." },
      { name: "ChecklistItem value", type: "string", description: "What the list reports when this item is done." },
      { name: "ChecklistItem disabled", type: "boolean", description: "Can't be ticked or unticked." },
    ],
    primitive: { name: "CheckboxGroup", href: "https://base-ui.com/react/components/checkbox-group" },
  },
  redact: {
    group: "Drawn",
    examples: ["redact-demo"],
    usage: `import { Redact } from "@/components/ui/redact"

<p>The code name is <Redact>Blue Biro</Redact>.</p>`,
    props: [
      { name: "label", type: "string", default: '"Hidden text"', description: "What screen readers hear while it's hidden; they don't get the words until it's shown." },
      { name: "revealed / defaultRevealed", type: "boolean", default: "false", description: "Shown or scribbled over, controlled or not." },
      { name: "onRevealedChange", type: "(revealed: boolean) => void", description: "Called as it's clicked." },
      { name: "seed", type: "string | number", description: "Pins the scribble." },
    ],
    pen: ["roughness", "weight", "speed"],
  },
  scrawl: {
    group: "Drawn",
    examples: ["scrawl-demo"],
    usage: `import { Scrawl } from "@/components/ui/scrawl"

<section className="relative">
  <Scrawl kind="star" rotate={-8} className="absolute -right-16 top-4" />
  …
</section>`,
    props: [
      { name: "kind", type: '"zigzag" | "corner" | "star" | "slash"', default: '"zigzag"', description: "Which pen test." },
      { name: "scale", type: "number", default: "1", description: "Size; the line stays the same weight." },
      { name: "rotate", type: "number", default: "0", description: "Degrees." },
      { name: "delay", type: "number", default: "0", description: "ms after it comes into view before the pen starts." },
      { name: "seed", type: "string | number", description: "Pins the drawing." },
    ],
    pen: ["draw", "speed"],
  },
};

/** The theme tokens, as the Installation page and llms-full.txt list them. */
export const tokens = [
  ["--paper", "The page. Cream by day, navy by night."],
  ["--ink", "The pen. Text, strokes, focus rings."],
  ["--ink-2, --ink-3", "Lighter pressure for secondary and muted text. Both clear 4.5:1."],
  ["--ink-line", "Control borders: the lightest pressure that clears 3:1."],
  ["--ink-4, --ink-5", "Decoration only: rules, washes, hatching."],
  ["--pen-red", "The only other pen, for destructive and invalid states."],
  ["--ink-fill", "How solid a pen-shaded fill is under its strokes."],
];

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
