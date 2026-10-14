"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/registry/ballpoint/ui/dropdown-menu";

const all = ["Title", "Author", "Pages", "Ruling", "Price"];

export default function DropdownMenuCheckboxes() {
  const [shown, setShown] = useState<string[]>(["Title", "Author", "Pages"]);
  const toggle = (column: string, on: boolean) => setShown((list) => (on ? all.filter((c) => c === column || list.includes(c)) : list.filter((c) => c !== column)));
  return (
    <div className="flex flex-col items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" seed="mc-open" />}>Columns ({shown.length})</DropdownMenuTrigger>
        <DropdownMenuContent seed="mc" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Show columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {all.map((column) => (
              <DropdownMenuCheckboxItem key={column} checked={shown.includes(column)} onCheckedChange={(on) => toggle(column, on)} closeOnClick={false}>
                {column}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-ink-2">{shown.length ? shown.join(" · ") : "Nothing to show."}</p>
    </div>
  );
}
