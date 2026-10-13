"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { IntentLink } from "@/components/intent-link";
import type { NavGroup } from "@/lib/nav";
import { inkRules } from "@/registry/ballpoint/lib/ink";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";

export type { NavGroup };

/** The group a page belongs to (the start pages sit in "Start"). */
const groupOf = (groups: NavGroup[], pathname: string) => groups.find((g) => g.links.some((l) => l.href === pathname))?.title;

/**
 * The index of the docs. The page you are on is marked as with a highlighter,
 * and only its group is open (the start pages leave Components open), so the
 * index is short enough to read without scrolling. A group opens and folds
 * from its title.
 */
export function DocsNav({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const nav = useRef<HTMLElement>(null);
  const here = groupOf(groups, pathname);
  const opened = (title?: string): Record<string, boolean> => ({ [title ?? ""]: true, ...(title === "Start" || !title ? { Components: true } : null) });
  const [open, setOpen] = useState(() => opened(here));
  const toggle = (title: string) => setOpen((o) => ({ ...o, [title]: !o[title] }));
  const id = useId();

  // Going to a page in another group opens that one and folds the rest.
  const [at, setAt] = useState(here);
  if (at !== here) {
    setAt(here);
    setOpen(opened(here));
  }

  // A long index opens at the page you are on, not at the top.
  useEffect(() => {
    const link = nav.current?.querySelector<HTMLElement>('[aria-current="page"]');
    const box = link?.closest<HTMLElement>("[data-scroll]");
    if (!link || !box) return;
    const at = link.getBoundingClientRect().top - box.getBoundingClientRect().top;
    if (at < 60 || at > box.clientHeight - 80) box.scrollTop += at - box.clientHeight / 3;
  }, []);

  return (
    <nav ref={nav} aria-label="Docs" className="dnav" style={inkRules}>
      {groups.map((group) => {
        const folds = group.title !== "Start";
        const isOpen = !folds || !!open[group.title];
        const body = `${id}-${group.title}`;
        return (
          <div key={group.title} className="dnav-group">
            <h2>
              {folds ? (
                <button type="button" aria-expanded={isOpen} aria-controls={body} onClick={() => toggle(group.title)}>
                  {group.title}
                  <span className="dnav-count">{group.links.length}</span>
                  <InkIcon name="chevron-down" className="dnav-chevron size-4" />
                </button>
              ) : (
                group.title
              )}
            </h2>
            <div id={body} className="dnav-body" data-open={isOpen} inert={!isOpen}>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <IntentLink href={link.href} onClick={onNavigate} aria-current={pathname === link.href ? "page" : undefined} className="dnav-link">
                      {link.title}
                    </IntentLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
