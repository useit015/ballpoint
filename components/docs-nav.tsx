"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavGroup = { title: string; links: { href: string; title: string }[] };

export function DocsNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Docs" className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold tracking-wider text-ink-3 uppercase">{group.title}</h2>
          <ul className="flex flex-col gap-1">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("transition-colors", active ? "font-bold text-ink" : "text-ink-2 hover:text-ink")}
                  >
                    {link.title}
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
