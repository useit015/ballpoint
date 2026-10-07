import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const style = "underline decoration-ink-4 underline-offset-4 transition-colors hover:decoration-ink";

/** A link inside prose: underlined in pencil, inked in on hover. */
export function TextLink({ href, className, ...props }: ComponentProps<"a">) {
  const external = !href || /^(https?:)?\/\//.test(href);
  if (external) return <a href={href} className={cn(style, className)} {...props} />;
  return <Link href={href} className={cn(style, className)} {...props} />;
}
