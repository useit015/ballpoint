"use client";

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { penStyle, useInkBox, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { createRng, handCurve } from "@/registry/ballpoint/lib/ink-sketch";
import { Annotate, type AnnotateType } from "@/registry/ballpoint/ui/annotate";

type P = readonly [number, number];
type Geometry = { line: string; head: string; box: [number, number, number, number] };

/** A curved pull from `a` to `b`, bowed to one side, with a head flicked on the end. */
function arrow(seed: number, a: P, b: P, bend: number, headed: boolean): Geometry {
  const r = createRng(seed);
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const len = Math.hypot(dx, dy) || 1;
  const [nx, ny] = [-dy / len, dx / len];
  // The bow grows with the arrow's length, but only so far: a long reach curves no more than a short one.
  const bow = bend * Math.min(len, 90) * 0.22;
  const mid: P = [a[0] + dx * 0.5 + nx * bow, a[1] + dy * 0.5 + ny * bow];
  const line = handCurve(seed, [a, mid, b], { jitter: 0.6 });
  // The head trails back along the way the line arrives.
  const [tx, ty] = [b[0] - mid[0], b[1] - mid[1]];
  const back = Math.atan2(-ty, -tx);
  const size = 6 + r() * 1.5;
  const wing = (turn: number): P => [b[0] + Math.cos(back + turn) * size, b[1] + Math.sin(back + turn) * size];
  const [w1, w2] = [wing(0.5 + r() * 0.1), wing(-0.5 - r() * 0.1)];
  const head = headed ? `M${w1[0].toFixed(1)} ${w1[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}L${w2[0].toFixed(1)} ${w2[1].toFixed(1)}` : "";
  const xs = [a[0], b[0], mid[0], w1[0], w2[0]];
  const ys = [a[1], b[1], mid[1], w1[1], w2[1]];
  const [x0, y0] = [Math.min(...xs) - 6, Math.min(...ys) - 6];
  return { line, head, box: [x0, y0, Math.max(...xs) + 6 - x0, Math.max(...ys) + 6 - y0] };
}

/**
 * A handwritten aside beside the words it's about, with an arrow drawn from
 * the note to them. On wide screens it sits out in the margin, level with
 * its words (the paragraph needs the room beside it, so keep it narrow); on
 * narrow ones it drops in under the line, pointing up. The arrow draws as
 * it scrolls into view.
 *
 * The pen can mark the words themselves (`mark`), draw the pointer as a
 * headed arrow, a plain line, or leave it out (`pointer`), and the note can
 * be set a little off the level (`tilt`) and written in ink, red pen or pencil.
 */
function MarginNote({
  note,
  side = "right",
  color = "ink",
  pointer = "arrow",
  mark = "none",
  tilt = -1.5,
  width,
  className,
  children,
  seed,
  draw,
  weight,
  speed,
}: Pick<Pen, "draw" | "weight" | "speed"> & {
  /** What's written in the margin. */
  note: ReactNode;
  side?: "left" | "right";
  color?: "ink" | "red" | "pencil";
  /** What runs from the note to the words: a headed arrow, a plain line, or nothing. */
  pointer?: "arrow" | "line" | "none";
  /** A mark drawn on the words the note is about, in the note's colour. */
  mark?: "none" | Extract<AnnotateType, "underline" | "circle" | "box" | "highlight">;
  /** Degrees the note is turned from level. */
  tilt?: number;
  /** How wide the note is on a wide screen, as a CSS length (default 9rem). */
  width?: string;
  /** Styles the note (width with --margin-note-width, 9rem). */
  className?: string;
  /** The words the note is about. */
  children: ReactNode;
  seed?: string | number;
}) {
  const pen = usePen({ draw, weight, speed });
  const s = useInkSeed(seed);
  const target = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLSpanElement>(null);
  const [ref] = useInkBox([140, 40]);
  const [where, setWhere] = useState<{ margin: boolean; a: P; b: P } | null>(null);
  const mode = pen.draw === "none" ? "none" : pen.draw === "mount" ? "mount" : "auto";
  const right = side === "right";

  // Where the arrow runs depends on where the note landed: measured, and
  // measured again whenever the text reflows.
  useLayoutEffect(() => {
    const noteEl = noteRef.current;
    const word = target.current;
    if (!noteEl || !word) return;
    const measure = () => {
      const n = noteEl.getBoundingClientRect();
      const t = word.getBoundingClientRect();
      const margin = getComputedStyle(noteEl).float !== "none";
      const next = margin
        ? {
            margin,
            a: [right ? -6 : n.width + 6, 11] as P,
            b: [right ? t.right - n.left + 4 : t.left - n.left - 4, t.top - n.top + t.height * 0.45] as P,
          }
        : { margin, a: [6, 10] as P, b: [Math.min(t.left - n.left + 10, 14), -4] as P };
      setWhere((prev) =>
        prev && prev.margin === next.margin && Math.abs(prev.b[0] - next.b[0]) < 1 && Math.abs(prev.b[1] - next.b[1]) < 1 ? prev : next,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(noteEl.parentElement ?? noteEl);
    observer.observe(word);
    return () => observer.disconnect();
  }, [right]);

  const geo = useMemo(() => (where && pointer !== "none" ? arrow(s, where.a, where.b, pointer === "line" ? 0.35 * (right ? -1 : 1) : right ? -1 : 1, pointer === "arrow") : null), [s, where, right, pointer]);

  return (
    <>
      <span ref={target} data-slot="margin-note-target">
        {mark === "none" ? (
          children
        ) : (
          <Annotate type={mark} color={color === "red" ? "red" : "ink"} seed={seed === undefined ? undefined : `${seed}-mark`} delay={150}>
            {children}
          </Annotate>
        )}
      </span>
      <span
        ref={noteRef}
        role="note"
        data-slot="margin-note"
        data-side={side}
        className={cn(
          "relative block text-sm leading-snug [--margin-note-gap:2.5rem] [--margin-note-width:9rem]",
          color === "red" ? "text-pen-red" : color === "pencil" ? "text-ink-3 italic" : "text-ink-2",
          // Narrow: under the line, set in so the arrow can point up.
          "my-1.5 ps-6",
          // Wide: floated out into the margin, level with the words.
          "lg:my-0 lg:w-(--margin-note-width) lg:ps-0",
          right
            ? "lg:float-right lg:clear-right lg:-me-[calc(var(--margin-note-width)+var(--margin-note-gap))]"
            : "lg:float-left lg:clear-left lg:-ms-[calc(var(--margin-note-width)+var(--margin-note-gap))] lg:text-right",
          className,
        )}
        style={{ rotate: `${tilt}deg`, ...(width ? { "--margin-note-width": width } : null), ...penStyle(pen) } as CSSProperties}
      >
        <InkSvg
          ref={ref}
          pending={mode === "auto"}
          box={geo?.box ?? [0, 0, 1, 1]}
          className={cn(color === "red" ? "text-pen-red" : "text-ink-3", !geo && "hidden")}
          style={geo ? { left: geo.box[0], top: geo.box[1], width: geo.box[2], height: geo.box[3] } : undefined}
        >
          {geo && (
            <>
              <Stroke d={geo.line} draw={mode} delay={200} duration={420} width={1.3} />
              {geo.head && <Stroke d={geo.head} draw={mode} delay={600} duration={160} width={1.3} />}
            </>
          )}
        </InkSvg>
        {note}
      </span>
    </>
  );
}

export { MarginNote };
