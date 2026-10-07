"use client";

import { useState } from "react";
import { Badge } from "@/registry/ballpoint/ui/badge";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/ballpoint/ui/table";

const rows = [
  ["Ada Lovelace", "Writer", "Active"],
  ["Grace Hopper", "Editor", "Active"],
  ["Katherine Johnson", "Illustrator", "Away"],
] as const;

export default function TableSelectable() {
  const [picked, setPicked] = useState<string[]>(["Grace Hopper"]);
  const all = picked.length === rows.length;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              aria-label="Select all"
              checked={all}
              indeterminate={picked.length > 0 && !all}
              onCheckedChange={(on) => setPicked(on ? rows.map(([n]) => n) : [])}
              seed="ts-all"
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([name, role, status]) => (
          <TableRow key={name} data-state={picked.includes(name) ? "selected" : undefined}>
            <TableCell>
              <Checkbox
                aria-label={`Select ${name}`}
                checked={picked.includes(name)}
                onCheckedChange={(on) => setPicked((p) => (on ? [...p, name] : p.filter((x) => x !== name)))}
                seed={`ts-${name}`}
              />
            </TableCell>
            <TableCell className="font-bold">{name}</TableCell>
            <TableCell className="text-ink-2">{role}</TableCell>
            <TableCell className="text-right">
              <Badge variant={status === "Active" ? "default" : "outline"} seed={`ts-b-${name}`}>
                {status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
