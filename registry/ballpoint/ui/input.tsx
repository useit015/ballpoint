"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";

type InputProps = InputPrimitive.Props &
  Pen & {
    /** "box" is drawn around the field; "line" is the line you write on. */
    variant?: "box" | "line";
    seed?: string | number;
  };

/**
 * A text field in a drawn box. The drawing sits in a wrapper around the
 * <input>, so `className` styles that box (width, margins, type size);
 * every other prop goes to the input. Focus draws one more pass in full ink;
 * aria-invalid redraws it in red pen.
 */
function Input({
  className,
  variant = "box",
  seed,
  roughness,
  passes,
  radius,
  corners,
  draw,
  weight,
  speed,
  ...props
}: Omit<InputProps, "fill" | "shadow">) {
  const pen = usePen({ roughness, passes, radius, corners, draw, weight, speed });
  return (
    <span
      data-slot="input"
      data-variant={variant}
      className={cn("group/input ink-within relative inline-flex h-10 w-full min-w-0 items-center", className)}
    >
      <InkOutline
        pen={pen}
        seed={seed}
        estimate={[240, 40]}
        shape={variant === "line" ? "line" : "box"}
        focusPass
        className={cn(
          "text-ink-3 transition-colors duration-(--dur-hover)",
          "group-hover/input:text-ink group-focus-within/input:text-ink",
          "group-has-[[aria-invalid=true]]/input:text-destructive group-has-[[data-invalid]]/input:text-destructive",
          "group-has-disabled/input:opacity-50",
        )}
      />
      <InputPrimitive
        data-slot="input-control"
        className={cn(
          "relative h-full w-full min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-ink-3",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:mr-3 file:border-0 file:bg-transparent file:text-base file:text-ink",
          variant === "line" ? "px-1" : "px-3",
        )}
        {...props}
      />
    </span>
  );
}

export { Input };
