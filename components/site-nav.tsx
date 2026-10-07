"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/docs", title: "Docs", current: (p: string) => p === "/docs" || p === "/docs/themes" },
  // Phones reach everything from the menu and the search instead.
  { href: "/docs/button", title: "Components", current: (p: string) => p.startsWith("/docs/") && p !== "/docs/themes" },
  { href: "/customize", title: "Customize", current: (p: string) => p === "/customize" },
];

export function SiteNav() {
  const pathname = usePathname();
  return links.map((link) => {
    const current = link.current(pathname);
    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={current ? "page" : undefined}
        className={cn("transition-colors", current ? "text-ink" : "text-ink-3 hover:text-ink", "max-sm:hidden")}
      >
        {link.title}
      </Link>
    );
  });
}
