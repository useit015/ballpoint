"use client";

import { useState } from "react";
import { Input } from "@/registry/ballpoint/ui/input";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "@/registry/ballpoint/ui/table";

const notebooks = [
  ["Cream A5", "Ruled", "96"],
  ["Legal pad", "Ruled", "50"],
  ["Sketchbook", "Plain", "120"],
  ["Graph pad", "Squared", "80"],
];

export default function TableEmptyExample() {
  const [query, setQuery] = useState("zzz");
  const shown = notebooks.filter(([name, kind]) => `${name} ${kind}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="flex w-full flex-col gap-4">
      <Input aria-label="Filter notebooks" placeholder="Filter notebooks" value={query} onChange={(event) => setQuery(event.target.value)} className="max-w-xs" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Notebook</TableHead>
            <TableHead>Paper</TableHead>
            <TableHead className="text-right">Pages</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.length ? (
            shown.map(([name, kind, pages]) => (
              <TableRow key={name}>
                <TableCell className="font-bold">{name}</TableCell>
                <TableCell className="text-ink-2">{kind}</TableCell>
                <TableCell className="text-right tabular-nums">{pages}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableEmpty colSpan={3}>No notebook matches &ldquo;{query}&rdquo;. Try &ldquo;ruled&rdquo;.</TableEmpty>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
