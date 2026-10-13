import type { ComponentProps, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** What holds a sheet to the page. */
export type Fastener = "none" | "tape";

/**
 * A sheet of paper torn from a pad and laid on the page: its own paper and a
 * ragged edge (app/torn.css). The paper and its shadow are a layer of their
 * own, painted once, so what moves on the sheet never repaints the shadow.
 *
 * This is the one paper the site is written on: the front page's sheets, and
 * the docs' code and examples (`flush` drops the padding, `slip` lays it
 * flatter). `tilt` sets it a little askew; `fastener` holds it down with
 * a strip of washi tape.
 */
export function TornSheet({
  as: Tag = "section",
  edge = "a",
  tilt,
  fastener = "none",
  flush = false,
  slip = false,
  className,
  style,
  children,
  ...props
}: Omit<ComponentProps<"section">, "ref"> & {
  as?: "section" | "div" | "aside" | "figure";
  edge?: "a" | "b";
  /** A CSS angle, e.g. "-0.4deg". */
  tilt?: string;
  fastener?: Fastener;
  /** No padding: the content sets its own. */
  flush?: boolean;
  /** A lighter lift than a sheet's, for code and examples. */
  slip?: boolean;
}) {
  const Content = Tag as "section";
  return (
    <div className={cn("torn-wrap", className)} data-edge={edge} data-weight={slip ? "slip" : undefined} style={{ ...(tilt ? { "--tilt": tilt } : null), ...style } as CSSProperties}>
      <div aria-hidden="true" className="torn-shadow">
        <div className="torn-paper" />
      </div>
      {fastener === "tape" && <span aria-hidden="true" className="torn-tape" />}
      <Content data-ink-scope="" data-flush={flush ? "" : undefined} className="torn" {...props}>
        {children}
      </Content>
    </div>
  );
}
