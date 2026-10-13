"use client";

import { useId, useMemo, useState } from "react";
import { ComponentArt } from "@/components/component-art";
import { IntentLink } from "@/components/intent-link";
import { TornSheet } from "@/components/torn-sheet";
import { Heading } from "@/components/heading";
import { Card } from "@/registry/ballpoint/ui/card";
import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";

export type IndexDoc = { name: string; title: string; description: string; group: "Components" | "Drawn" };

const groups = [
  { title: "Components", id: "everyday", blurb: "The everyday set, with the names and props you know from shadcn/ui.", edge: "a" },
  { title: "Drawn", id: "drawn", blurb: "Only here: marks, margins and pages that make sense because they are drawn.", edge: "b" },
] as const;

/** Every component as a pencilled card on a torn sheet, with a filter that narrows them as you type. */
export function ComponentIndex({ docs }: { docs: IndexDoc[] }) {
  const [query, setQuery] = useState("");
  const input = useId();
  const q = query.trim().toLowerCase();
  const shown = useMemo(() => (q ? docs.filter((d) => `${d.title} ${d.description}`.toLowerCase().includes(q)) : docs), [docs, q]);

  return (
    <>
      <div className="index-bar">
        <Label htmlFor={input} className="sr-only">
          Filter components
        </Label>
        <Input id={input} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter, e.g. dialog" seed="index-filter" className="w-72 max-w-full" />
        <p aria-live="polite" className="text-ink-3">
          {q ? `${shown.length} of ${docs.length} match` : `${docs.length} components`}
        </p>
      </div>

      {shown.length === 0 && <p className="text-xl text-ink-2">Nothing drawn for &ldquo;{query}&rdquo; yet.</p>}

      {groups.map((group, i) => {
        const items = shown.filter((d) => d.group === group.title);
        if (!items.length) return null;
        return (
          <TornSheet key={group.id} aria-labelledby={group.id} edge={group.edge} className="index-sheet" style={{ "--tilt": i ? "0.2deg" : "-0.2deg" } as React.CSSProperties}>
            <div className="flex flex-col gap-2 pb-6">
              <Heading id={group.id}>{group.title}</Heading>
              <p className="max-w-2xl text-xl text-ink-3">{group.blurb}</p>
            </div>
            <ul className="index-grid">
              {items.map((doc) => (
                <li key={doc.name}>
                  <Card seed={`index-${doc.name}`} className="index-card">
                    <IntentLink href={`/docs/${doc.name}`} className="index-link">
                      <ComponentArt name={doc.name} className="index-art" />
                      <span className="index-title">{doc.title}</span>
                      <span className="index-desc">{doc.description}</span>
                    </IntentLink>
                  </Card>
                </li>
              ))}
            </ul>
          </TornSheet>
        );
      })}
    </>
  );
}
