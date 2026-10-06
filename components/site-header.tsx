import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-8 sm:py-5">
      <Link href="/" className="text-xl font-bold tracking-wide sm:text-2xl">
        Ballpoint
      </Link>
      <nav className="flex items-center gap-3.5 text-base sm:gap-5 sm:text-lg">
        <SiteNav />
        <ThemeToggle />
      </nav>
    </header>
  );
}
