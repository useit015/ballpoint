"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { Stroke } from "@/registry/ballpoint/lib/ink";
import { lineStroke } from "@/registry/ballpoint/lib/ink-sketch";

// Ruled lines sit one line-height apart, under each line of text.
const LINE = 32;
const PAD_TOP = 8;

type TextareaProps = ComponentProps<"textarea"> &
  Omit<Pen, "fill" | "shadow"> & {
    /** "box" is drawn around the field; "lined" adds ruled lines to write on. */
    variant?: "box" | "lined";
    seed?: string | number;
  };

/**
 * A multi-line field in a drawn box that grows with its text. As with
 * Input, `className` styles the drawn box and other props go to the
 * <textarea>.
 */
function Textarea({ className, style, variant = "box", seed, roughness, passes, radius, corners, draw, weight, speed, ...props }: TextareaProps) {
  const pen = usePen({ roughness, passes, radius, corners, draw, weight, speed });
  const mode = pen.draw ?? "auto";
  return (
    <span data-slot="textarea" data-variant={variant} className={cn("group/textarea ink-within relative flex w-full min-w-0", className)}>
      <InkOutline
        pen={pen}
        seed={seed}
        estimate={[320, 112]}
        maxRadius={18}
        focusPass
        className={cn(
          "text-ink-line transition-colors duration-(--dur-hover)",
          "group-hover/textarea:text-ink-3 group-focus-within/textarea:text-ink",
          "group-has-[[aria-invalid=true]]/textarea:text-destructive",
          "group-has-disabled/textarea:opacity-50",
        )}
      >
        {({ w, h, s }) =>
          variant === "lined" &&
          Array.from({ length: Math.max(0, Math.floor((h - PAD_TOP - 6) / LINE)) }, (_, i) => {
            const y = PAD_TOP + (i + 1) * LINE - 4;
            return (
              <g key={i} className="text-ink-5">
                <Stroke d={lineStroke(s + 40 + i, [6, y], [w - 6, y + 0.4], { bow: 0.5, jitter: 0.3 })} draw={mode} delay={300 + i * 60} duration={360} width={1} />
              </g>
            );
          })
        }
      </InkOutline>
      <textarea
        data-slot="textarea-control"
        className={cn(
          "relative field-sizing-content min-h-28 w-full min-w-0 resize-none bg-transparent px-3 text-base leading-8 text-foreground outline-none placeholder:text-ink-3",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        style={{ paddingTop: PAD_TOP, paddingBottom: 6, ...style }}
        {...props}
      />
    </span>
  );
}

export { Textarea };
