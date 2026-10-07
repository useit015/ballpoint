"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import type { NavGroup } from "@/lib/nav";
import { cn } from "@/lib/utils";

export type { NavGroup };

export function DocsNav({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Docs" className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold tracking-wider text-ink-3 uppercase">{group.title}</h2>
          <ul className="flex flex-col gap-1.5">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative inline-block transition-colors", active ? "font-bold text-ink" : "text-ink-2 hover:text-ink")}
                  >
                    {link.title}
                    {/* The current page gets a dot in the margin, not another underline. */}
                    {active && <InkGlyph name="dot" className="absolute top-1/2 -left-3.5 size-2 -translate-y-1/2" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
