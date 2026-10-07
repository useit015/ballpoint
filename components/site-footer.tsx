import Link from "next/link";
import { Separator } from "@/registry/ballpoint/ui/separator";

/** A ruled line and a few words at the foot of every page. */
export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-[85rem] px-4 pb-10 sm:px-8">
      <Separator seed="footer-rule" />
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-6 text-sm text-ink-3">
        <p>
          Drawn by{" "}
          <a href="https://st9wd.com" className="underline decoration-ink-4 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink">
            Oussama Nahiz
          </a>
          . MIT licensed; the components are yours once you add them.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/docs" className="transition-colors hover:text-ink">
            Docs
          </Link>
          <Link href="/docs/themes" className="transition-colors hover:text-ink">
            Pens and papers
          </Link>
          <Link href="/customize" className="transition-colors hover:text-ink">
            Customize
          </Link>
          <a href="https://github.com/useit015/ballpoint" className="transition-colors hover:text-ink">
            GitHub
          </a>
          <a href="/llms.txt" className="transition-colors hover:text-ink">
            llms.txt
          </a>
        </nav>
      </div>
    </footer>
  );
}
