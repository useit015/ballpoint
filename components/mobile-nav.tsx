"use client";

import { useState } from "react";
import { DocsNav } from "@/components/docs-nav";
import type { NavGroup } from "@/lib/nav";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/ballpoint/ui/sheet";

/** Phones and tablets: the docs' contents in a sheet from the left. */
export function MobileNav({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-sm" seed="menu-open" className="md:hidden" />}>
        <InkIcon name="menu" />
        <span className="sr-only">Contents</span>
      </SheetTrigger>
      <SheetContent side="left" seed="menu" className="sm:max-w-xs">
        <SheetHeader>
          <SheetTitle>Contents</SheetTitle>
          <SheetDescription className="sr-only">Every page in the docs.</SheetDescription>
        </SheetHeader>
        <div className="no-scrollbar-docs min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-8 pl-9">
          <DocsNav groups={groups} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
