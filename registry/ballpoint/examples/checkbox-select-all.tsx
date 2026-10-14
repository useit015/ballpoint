"use client";

import { useState } from "react";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Label } from "@/registry/ballpoint/ui/label";

const items = ["Notebooks", "Stamps", "Stickers", "Tape"];

export default function CheckboxSelectAll() {
  const [picked, setPicked] = useState<string[]>(["Stamps", "Tape"]);
  const all = picked.length === items.length;
  return (
    <div className="flex flex-col gap-4">
      <Label className="font-bold">
        <Checkbox
          checked={all}
          indeterminate={picked.length > 0 && !all}
          onCheckedChange={(on) => setPicked(on ? items : [])}
          seed="csa-all"
        />
        Everything on the desk
      </Label>
      <div className="flex flex-col gap-3 pl-8">
        {items.map((item) => (
          <Label key={item}>
            <Checkbox checked={picked.includes(item)} onCheckedChange={(on) => setPicked((list) => (on ? [...list, item] : list.filter((x) => x !== item)))} seed={`csa-${item}`} />
            {item}
          </Label>
        ))}
      </div>
    </div>
  );
}
