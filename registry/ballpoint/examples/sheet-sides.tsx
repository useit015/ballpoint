import { Button } from "@/registry/ballpoint/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/ballpoint/ui/sheet";

const sides = ["top", "right", "bottom", "left"] as const;

export default function SheetSides() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" seed={`ss-${side}`} />}>{side}</SheetTrigger>
          <SheetContent side={side} seed={`ss-c-${side}`}>
            <SheetHeader>
              <SheetTitle>From the {side}</SheetTitle>
              <SheetDescription>A sheet slides in from any edge. It keeps its inner edge ruled by hand.</SheetDescription>
            </SheetHeader>
            <div className="h-24 px-6" />
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
