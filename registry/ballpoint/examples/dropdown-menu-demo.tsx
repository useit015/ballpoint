"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/ballpoint/ui/dropdown-menu";

export default function DropdownMenuDemo() {
  const [margins, setMargins] = useState(true);
  const [ruling, setRuling] = useState("lined");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" seed="menu-open" />}>Notebook</DropdownMenuTrigger>
      <DropdownMenuContent seed="menu" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notebook</DropdownMenuLabel>
          <DropdownMenuItem>
            New page
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Duplicate
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent seed="menu-share">
              <DropdownMenuItem>By email</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={margins} onCheckedChange={setMargins}>
          Show margins
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Ruling</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={ruling} onValueChange={setRuling}>
            <DropdownMenuRadioItem value="lined">Lined</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="squared">Squared</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="plain">Plain</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          Tear out page
          <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
