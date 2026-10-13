import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";

/**
 * A page or section title: the registry's SectionHeading, set the way the
 * front page sets its own (italic, written in, underlined by hand; the page
 * title with the long swoosh). Sections get a link to themselves in the
 * margin on hover.
 */
export function Heading({ as = "h2", id, children, className }: { as?: "h1" | "h2" | "h3"; id?: string; children: ReactNode; className?: string }) {
  const text = typeof children === "string" ? children : (id ?? "heading");
  return (
    <div className="group/heading relative w-fit max-w-full scroll-mt-6">
      <SectionHeading as={as} id={id} seed={`${id ?? text}-underline`} underline={as === "h1" ? "swoosh" : undefined} className={cn("scroll-mt-6", as === "h1" ? "doc-h1" : as === "h2" ? "doc-h2" : "doc-h3", className)}>
        {children}
      </SectionHeading>
      {id && as !== "h1" && (
        <a
          href={`#${id}`}
          aria-label={`Link to ${text}`}
          className="absolute top-1.5 -left-9 hidden size-7 items-center justify-center text-ink-3 opacity-0 transition-opacity group-hover/heading:opacity-100 hover:text-ink focus-visible:opacity-100 md:flex"
        >
          <InkIcon name="link" className="size-4" />
        </a>
      )}
    </div>
  );
}
