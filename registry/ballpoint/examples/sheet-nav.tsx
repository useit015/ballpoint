import { Button } from "@/registry/ballpoint/ui/button";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/ballpoint/ui/sheet";

const links = [
  ["home", "Home"],
  ["pencil", "Notes"],
  ["calendar", "Calendar"],
  ["settings", "Settings"],
] as const;

export default function SheetNav() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" aria-label="Open menu" seed="sn-open" />}>
        <InkIcon name="menu" />
      </SheetTrigger>
      <SheetContent side="left" seed="sn">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Pages in the app.</SheetDescription>
        </SheetHeader>
        <nav aria-label="App" className="flex flex-col gap-1 px-4">
          {links.map(([icon, label]) => (
            <SheetClose key={label} render={<Button variant="ghost" className="justify-start" seed={`sn-${label}`} />}>
              <InkIcon name={icon} /> {label}
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
