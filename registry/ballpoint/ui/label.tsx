"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * A plain <label>. `required` marks it with a red-pen asterisk (the control
 * still needs its own `required`), `optional` says so in lighter ink.
 */
function Label({ className, children, required, optional, ...props }: ComponentProps<"label"> & { required?: boolean; optional?: boolean }) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-base leading-tight select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="-ml-1 text-destructive">
          *
        </span>
      )}
      {optional && <span className="-ml-0.5 text-sm text-ink-3">(optional)</span>}
    </label>
  );
}

export { Label };
