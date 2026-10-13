import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * A sheet of paper torn from a pad and laid on the page: its own paper and a
 * ragged edge (app/torn.css). The paper and its shadow are a layer of their
 * own, painted once, so what moves on the sheet never repaints the shadow.
 */
export function TornSheet({ as: Tag = "section", edge = "a", className, children, ...props }: Omit<ComponentProps<"section">, "ref"> & { as?: "section" | "div" | "aside"; edge?: "a" | "b" }) {
  return (
    <div className={cn("torn-wrap", className)} data-edge={edge}>
      <div aria-hidden="true" className="torn-shadow">
        <div className="torn-paper" />
      </div>
      <Tag data-ink-scope="" className="torn" {...props}>
        {children}
      </Tag>
    </div>
  );
}
