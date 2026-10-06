import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";

/** A page or section title: the registry's SectionHeading, sized for the docs. */
export function Heading({ as = "h2", id, children, className }: { as?: "h1" | "h2" | "h3"; id?: string; children: ReactNode; className?: string }) {
  const text = typeof children === "string" ? children : (id ?? "heading");
  return (
    <SectionHeading as={as} id={id} seed={`${id ?? text}-underline`} className={cn("text-base tracking-wide", className)}>
      {children}
    </SectionHeading>
  );
}
