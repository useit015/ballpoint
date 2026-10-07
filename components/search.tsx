"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";
import { Badge } from "@/registry/ballpoint/ui/badge";
import { Button } from "@/registry/ballpoint/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/registry/ballpoint/ui/dialog";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { Input } from "@/registry/ballpoint/ui/input";
import { Kbd } from "@/registry/ballpoint/ui/kbd";
import { cn } from "@/lib/utils";

export type SearchEntry = { href: string; title: string; group: string; description: string };

/** Title matches first (those that start with the query before those that merely contain it), then descriptions. */
function find(entries: SearchEntry[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return entries;
  const score = (e: SearchEntry) => {
    const title = e.title.toLowerCase();
    if (title.startsWith(q)) return 0;
    if (title.includes(q)) return 1;
    return e.description.toLowerCase().includes(q) ? 2 : 3;
  };
  return entries
    .map((entry) => [entry, score(entry)] as const)
    .filter(([, s]) => s < 3)
    .sort((a, b) => a[1] - b[1])
    .map(([entry]) => entry);
}

/** Jump to any page: opened from the header, with / or Ctrl/⌘ K. */
export function Search({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const listId = useId();
  const results = useMemo(() => find(entries, query), [entries, query]);
  const at = Math.min(active, results.length - 1);

  const toggle = (next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery("");
      setActive(0);
    }
  };

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey)) {
        e.preventDefault();
        toggle(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length) setActive((at + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    } else if (e.key === "Enter" && results[at]) {
      e.preventDefault();
      go(results[at].href);
    }
  };

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger render={<Button variant="ghost" size="sm" seed="search-open" className="gap-2 text-ink-2 max-sm:size-9 max-sm:px-0" />}>
        <InkIcon name="search" className="size-4" />
        <span className="max-sm:sr-only">Search</span>
        <Kbd className="max-md:hidden" aria-hidden="true">
          /
        </Kbd>
      </DialogTrigger>
      <DialogContent seed="search" showCloseButton={false} className="max-w-xl gap-4 p-5 sm:p-6">
        <DialogTitle className="sr-only">Search the docs</DialogTitle>
        <DialogDescription className="sr-only">Type to filter components and pages; use the arrow keys and Enter to open one.</DialogDescription>
        <Input
          autoFocus
          placeholder="Search components and pages"
          aria-label="Search components and pages"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results[at] ? `${listId}-${at}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          seed="search-input"
        />
        {results.length ? (
          <ul id={listId} role="listbox" aria-label="Results" className="-mx-2 no-scrollbar-docs flex max-h-72 flex-col gap-0.5 overflow-y-auto overscroll-contain px-2 py-1">
            {results.map((entry, i) => (
              <li key={entry.href} role="presentation">
                <Link
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === at}
                  href={entry.href}
                  onClick={() => setOpen(false)}
                  onMouseMove={() => setActive(i)}
                  className={cn("flex items-baseline justify-between gap-4 px-3 py-2 transition-colors", i === at ? "bg-ink-5/50 text-ink" : "text-ink-2")}
                >
                  <span className="min-w-0">
                    <span className="font-bold">{entry.title}</span>
                    {entry.description && <span className="block truncate text-sm text-ink-3">{entry.description}</span>}
                  </span>
                  <Badge variant="outline" className="shrink-0" draw="none">
                    {entry.group}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-1 py-6 text-center text-ink-3" role="status">
            Nothing drawn for “{query}”.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
