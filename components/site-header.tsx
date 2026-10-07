import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { Search } from "@/components/search";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { navGroups, searchEntries } from "@/lib/nav";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-[85rem] items-center justify-between gap-6 px-4 py-4 sm:px-8 sm:py-5">
      <div className="flex items-center gap-2">
        <MobileNav groups={navGroups} />
        <Link href="/" className="text-xl font-bold tracking-wide sm:text-2xl">
          Ballpoint
        </Link>
      </div>
      <nav className="flex items-center gap-2 text-base sm:gap-4 sm:text-lg">
        <SiteNav />
        <Search entries={searchEntries} />
        <ThemeToggle />
      </nav>
    </header>
  );
}
