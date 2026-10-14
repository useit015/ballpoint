"use client";

import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/ballpoint/ui/table";

const rows = [
  { name: "Ada Lovelace", role: "Writer", pages: 412 },
  { name: "Grace Hopper", role: "Editor", pages: 268 },
  { name: "Katherine Johnson", role: "Illustrator", pages: 530 },
  { name: "Mary Jackson", role: "Writer", pages: 97 },
];

type Key = "name" | "role" | "pages";

export default function TableSortable() {
  const [sort, setSort] = useState<{ key: Key; dir: "asc" | "desc" }>({ key: "pages", dir: "desc" });
  const sorted = useMemo(() => {
    const out = [...rows].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0));
    return sort.dir === "asc" ? out : out.reverse();
  }, [sort]);
  // A first press sorts a column one way, the next the other.
  const press = (key: Key) => setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));
  const state = (key: Key) => (sort.key === key ? sort.dir : "none");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead sort={state("name")} onSort={() => press("name")}>
            Name
          </TableHead>
          <TableHead sort={state("role")} onSort={() => press("role")}>
            Role
          </TableHead>
          <TableHead className="text-right" sort={state("pages")} onSort={() => press("pages")}>
            Pages
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-bold">{row.name}</TableCell>
            <TableCell className="text-ink-2">{row.role}</TableCell>
            <TableCell className="text-right tabular-nums">{row.pages}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
