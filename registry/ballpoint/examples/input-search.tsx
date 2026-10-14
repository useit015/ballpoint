"use client";

import { useState } from "react";
import { Input } from "@/registry/ballpoint/ui/input";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { Kbd } from "@/registry/ballpoint/ui/kbd";

const things = ["Cream notebook", "Blue ballpoint", "Legal pad", "Fineliner set", "Graph pad", "Pencil case"];

export default function InputSearch() {
  const [query, setQuery] = useState("");
  const shown = things.filter((t) => t.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="relative">
        <InkIcon name="search" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3" />
        <Input type="search" aria-label="Search" placeholder="Search the shop" value={query} onChange={(event) => setQuery(event.target.value)} seed="is-search" className="w-full pl-9" />
        {!query && <Kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">/</Kbd>}
      </div>
      <ul className="flex flex-col gap-1 text-ink-2">
        {shown.map((t) => (
          <li key={t}>{t}</li>
        ))}
        {shown.length === 0 && <li className="text-ink-3">Nothing called that.</li>}
      </ul>
    </div>
  );
}
