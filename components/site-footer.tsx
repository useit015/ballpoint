import Link from "next/link";
import { inkRules } from "@/registry/ballpoint/lib/ink";

/** A ruled line and a few words at the foot of every page. */
export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-8" style={inkRules}>
      <div className="h-[5px] bg-ink-4 [mask-image:var(--ink-rule-2)] [mask-size:100%_100%] [mask-repeat:no-repeat]" />
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-6 text-sm text-ink-3">
        <p>
          Drawn by{" "}
          <a href="https://st9wd.com" className="underline decoration-ink-4 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink">
            Oussama Nahiz
          </a>
          . MIT licensed; the components are yours once you add them.
        </p>
        <nav aria-label="Footer" className="flex gap-5">
          <Link href="/docs" className="transition-colors hover:text-ink">
            Docs
          </Link>
          <Link href="/docs/themes" className="transition-colors hover:text-ink">
            Pens and papers
          </Link>
          <Link href="/customize" className="transition-colors hover:text-ink">
            Customize
          </Link>
        </nav>
      </div>
    </footer>
  );
}
