import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-5 sm:px-8">
      <Link href="/" className="text-2xl font-bold tracking-wide">
        Ballpoint
      </Link>
      <nav className="flex items-center gap-5 text-lg">
        <SiteNav />
        <ThemeToggle />
      </nav>
    </header>
  );
}
