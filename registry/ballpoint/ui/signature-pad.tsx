"use client";

import { useEffect, useId, useImperativeHandle, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type Ref } from "react";
import { cn } from "@/lib/utils";
import { penStyle, useInkBox, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { crossStroke, inkRibbon, ruleStroke } from "@/registry/ballpoint/lib/ink-sketch";
import { Button } from "@/registry/ballpoint/ui/button";

/** A point of a signature: where the ball was, and how wide a line it laid. */
export type SignaturePoint = { x: number; y: number; w: number };
export type SignatureStroke = SignaturePoint[];

export type SignatureExport = {
  /** The ink colour; any CSS colour. Defaults to blue ballpoint, whatever the theme. */
  color?: string;
  /** px of paper kept round the signature. */
  padding?: number;
  /** Pixel density of a PNG. */
  scale?: number;
};

export type SignaturePadHandle = {
  clear: () => void;
  undo: () => void;
  isEmpty: () => boolean;
  strokes: () => SignatureStroke[];
  /** The signature as an SVG document, trimmed to the ink. */
  toSVG: (options?: SignatureExport) => string;
  /** The signature as a data URL: SVG, or PNG on a transparent ground. */
  toDataURL: (type?: "image/svg+xml" | "image/png", options?: SignatureExport) => string;
};

const LINE = 1024;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Resolves any CSS colour (oklch included) to rgb(), for files opened outside the browser. */
function toRgb(color: string) {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return color;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

function bounds(strokes: SignatureStroke[], padding: number) {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const p of strokes.flat()) {
    x0 = Math.min(x0, p.x - p.w);
    y0 = Math.min(y0, p.y - p.w);
    x1 = Math.max(x1, p.x + p.w);
    y1 = Math.max(y1, p.y + p.w);
  }
  if (x0 === Infinity) return { x: 0, y: 0, w: 1, h: 1 };
  return { x: x0 - padding, y: y0 - padding, w: x1 - x0 + padding * 2, h: y1 - y0 + padding * 2 };
}

function exportSVG(strokes: SignatureStroke[], { color = "oklch(0.4 0.185 267)", padding = 8 }: SignatureExport = {}) {
  const b = bounds(strokes, padding);
  const r = (n: number) => +n.toFixed(1);
  const d = strokes.map(inkRibbon).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(b.x)} ${r(b.y)} ${r(b.w)} ${r(b.h)}" width="${Math.ceil(b.w)}" height="${Math.ceil(b.h)}"><path fill="${toRgb(color)}" d="${d}"/></svg>`;
}

function exportPNG(strokes: SignatureStroke[], { color = "oklch(0.4 0.185 267)", padding = 8, scale = 2 }: SignatureExport = {}) {
  const b = bounds(strokes, padding);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(b.w * scale);
  canvas.height = Math.ceil(b.h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.setTransform(scale, 0, 0, scale, -b.x * scale, -b.y * scale);
  ctx.fillStyle = color;
  for (const stroke of strokes) ctx.fill(new Path2D(inkRibbon(stroke)));
  return canvas.toDataURL("image/png");
}

/**
 * A line to sign on. Draw with a mouse, a finger or a pen (a stylus's
 * pressure presses the line wider); the ink lands like a ballpoint's,
 * thinning where the hand moves fast. Inside a form it submits the
 * signature as a data URL under `name` (`required` works); `ref` exports
 * SVG or PNG, clears and undoes.
 */
function SignaturePad({
  name,
  required,
  disabled,
  valueFormat = "svg",
  label = "Signature",
  placeholder = "Sign here",
  onChange,
  className,
  ref,
  seed,
  draw,
  roughness,
  weight,
  speed,
}: Pick<Pen, "draw" | "roughness" | "weight" | "speed"> & {
  /** The form field the signature is submitted under. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  /** What the form receives: an SVG or a PNG data URL. */
  valueFormat?: "svg" | "png";
  /** Names the pad for screen readers. */
  label?: string;
  placeholder?: string;
  /** Called after every stroke and on clear, with the form value ("" when empty). */
  onChange?: (value: string) => void;
  className?: string;
  ref?: Ref<SignaturePadHandle>;
  seed?: string | number;
}) {
  const pen = usePen({ draw, roughness, weight, speed });
  const s = useInkSeed(seed);
  const uid = useId().replace(/[^\w-]/g, "");
  const [strokes, setStrokes] = useState<SignatureStroke[]>([]);
  // The stroke being drawn: built up in a ref by the pointer handlers,
  // and copied into state to render as it grows.
  const building = useRef<SignatureStroke | null>(null);
  const pointer = useRef<number | null>(null);
  const [active, setActive] = useState<SignatureStroke | null>(null);
  const hand = useRef({ x: 0, y: 0, t: 0, v: 0 });
  const [invalid, setInvalid] = useState(false);
  const [status, setStatus] = useState("");
  const [lineRef, [lineW]] = useInkBox([LINE, 4]);
  const mode = pen.draw ?? "auto";

  const value = useMemo(() => {
    if (!strokes.length || typeof document === "undefined") return "";
    return valueFormat === "png" ? exportPNG(strokes) : `data:image/svg+xml,${encodeURIComponent(exportSVG(strokes))}`;
  }, [strokes, valueFormat]);

  const changed = useRef(onChange);
  useEffect(() => {
    changed.current = onChange;
  });
  const reported = useRef(value);
  useEffect(() => {
    if (reported.current === value) return;
    reported.current = value;
    changed.current?.(value);
  }, [value]);

  useImperativeHandle(
    ref,
    () => ({
      clear: () => setStrokes([]),
      undo: () => setStrokes((all) => all.slice(0, -1)),
      isEmpty: () => strokes.length === 0,
      strokes: () => strokes,
      toSVG: (options) => exportSVG(strokes, options),
      toDataURL: (type = "image/svg+xml", options) =>
        type === "image/png" ? exportPNG(strokes, options) : `data:image/svg+xml,${encodeURIComponent(exportSVG(strokes, options))}`,
    }),
    [strokes],
  );

  function point(e: PointerEvent, el: HTMLElement): SignaturePoint | null {
    const box = el.getBoundingClientRect();
    const h = hand.current;
    const px = e.clientX - box.left;
    const py = e.clientY - box.top;
    const dt = Math.max(e.timeStamp - h.t, 1);
    // The pen trails the pointer a beat, which smooths a mouse's jitter.
    const x = h.x + (px - h.x) * 0.55;
    const y = h.y + (py - h.y) * 0.55;
    const dist = Math.hypot(x - h.x, y - h.y);
    if (dist < 0.8) return null;
    const v = h.v * 0.7 + (dist / dt) * 0.3;
    hand.current = { x, y, t: e.timeStamp, v };
    // A ballpoint lays a thinner line the faster it moves; a stylus presses it wider.
    let w = clamp(2.3 - v * 0.38, 1.1, 2.3);
    if (e.pointerType === "pen" && e.pressure > 0) w *= 0.5 + e.pressure;
    const stroke = building.current!;
    const last = stroke[stroke.length - 1];
    return { x, y, w: last.w * 0.65 + w * 0.35 };
  }

  function down(e: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || pointer.current !== null || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.preventDefault();
    pointer.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    hand.current = { x, y, t: e.timeStamp, v: 0 };
    const w = e.pointerType === "pen" && e.pressure > 0 ? 2 * (0.5 + e.pressure) : 2.4;
    building.current = [{ x, y, w }];
    setActive(building.current.slice());
  }

  function move(e: ReactPointerEvent<HTMLDivElement>) {
    const stroke = building.current;
    if (!stroke || e.pointerId !== pointer.current) return;
    const el = e.currentTarget;
    const samples = e.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const sample of samples.length ? samples : [e.nativeEvent]) {
      const p = point(sample, el);
      if (p) stroke.push(p);
    }
    setActive(stroke.slice());
  }

  function up(e: ReactPointerEvent<HTMLDivElement>) {
    const stroke = building.current;
    if (!stroke || e.pointerId !== pointer.current) return;
    building.current = null;
    pointer.current = null;
    setActive(null);
    // Lifting off: the line flicks off thin if the hand was still moving.
    const last = stroke[stroke.length - 1];
    if (stroke.length > 1) stroke.push({ ...last, w: last.w * (hand.current.v > 0.9 ? 0.4 : 0.85) });
    setStrokes((all) => [...all, stroke]);
    setInvalid(false);
    setStatus(strokes.length ? "" : "Signed");
  }

  const empty = strokes.length === 0 && !active;

  return (
    <div
      role="group"
      aria-label={label}
      data-slot="signature-pad"
      data-empty={empty ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      className={cn("group/signature ink-within relative h-40 w-full max-w-md text-foreground", disabled && "opacity-50", className)}
      style={penStyle(pen)}
    >
      <InkOutline
        pen={pen}
        seed={s}
        estimate={[448, 160]}
        focusPass
        maxRadius={12}
        className={cn("text-ink-3 transition-colors duration-(--dur-hover) group-hover/signature:text-ink", invalid && "text-destructive group-hover/signature:text-destructive")}
      />
      {/* The line to sign on, with its cross. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 bottom-9 h-[5px]">
        <InkSvg ref={lineRef} pending={mode === "auto"} box={[0, -1, lineW, 5]} stretch className="inset-0 size-full text-ink-4">
          <Stroke d={ruleStroke(s + 3, lineW)} draw={mode === "none" ? "none" : mode} duration={600} width={1.1} />
        </InkSvg>
        <svg viewBox="0 0 12 12" className="ink-glyph absolute -top-4 left-0 size-3 text-ink-3">
          <Stroke d={crossStroke(s + 4, 12)} width={1.4} />
        </svg>
        <span className="absolute -top-7 left-6 text-sm text-ink-3 transition-opacity duration-(--dur-hover) group-not-data-empty/signature:opacity-0">{placeholder}</span>
      </div>
      {/* The ink. */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible text-ink">
        <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
          {/* The paper's tooth: a few pits the ball skips over. */}
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="7" result="n" />
          <feColorMatrix in="n" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.6 0 0 0 1.75" result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
        </filter>
        <g filter={`url(#grain-${uid})`} fill="currentColor">
          {strokes.map((stroke, i) => (
            <path key={i} d={inkRibbon(stroke)} />
          ))}
          {active && <path d={inkRibbon(active)} opacity={0.97} />}
        </g>
      </svg>
      {/* Where the pen goes down. touch-none: a finger signs instead of scrolling. */}
      <div
        data-slot="signature-pad-surface"
        className={cn("absolute inset-0 touch-none select-none", disabled ? "cursor-not-allowed" : "cursor-crosshair")}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onLostPointerCapture={up}
      />
      <Button
        type="button"
        variant="ghost"
        size="xs"
        draw="none"
        disabled={disabled || strokes.length === 0}
        className="absolute top-2 right-2 text-ink-3 hover:text-ink"
        onClick={() => {
          setStrokes([]);
          setStatus("Signature cleared");
        }}
      >
        Clear
      </Button>
      {/* The form value: an input the browser validates (required) and anchors its message to. */}
      <input
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={() => {}}
        onInvalid={() => setInvalid(true)}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-full opacity-0"
      />
      <span role="status" className="sr-only">
        {status}
      </span>
    </div>
  );
}

export { SignaturePad };
