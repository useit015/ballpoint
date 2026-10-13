import { Fragment, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { UNIT, type Piece, type Scene } from "@/lib/art/kit";
import { PiecePath } from "@/components/art/piece-path";
import { ArtEffects } from "@/components/art/art-effects";
import { PenHand } from "@/components/art/pen-hand";

type Depth = 0 | 1 | 2;

/**
 * A scene of pen strokes (lib/art), one SVG per depth so the layers can drift
 * apart. Each stroke is a path in the ink's colour: "draw" strokes are run
 * in by the pen (a dash offset), "sweep" strokes are clusters the hand works
 * across. All timing is CSS (see app/art.css): the pen starts on load, or,
 * with `view`, when the drawing scrolls into view. With `pen`, a small
 * client leaf shows the pen at the tip of the strokes marked "lead".
 *
 * `life` puts living things (components/art/life) into a depth: they are
 * drawn in the scene's own units, and are not hidden from assistive
 * technology the way the strokes are.
 */
export function PenArt({
  scene,
  className,
  view = false,
  parallax = false,
  pen = false,
  scale,
  style,
  label,
  id,
  life,
  children,
}: {
  scene: Scene;
  className?: string;
  /** Wait for the drawing to scroll into view before the pen starts. */
  view?: boolean;
  parallax?: boolean;
  /** Show the pen that draws it. */
  pen?: boolean;
  /** Draw at this many px per unit, instead of filling the width. */
  scale?: number;
  style?: CSSProperties;
  label?: string;
  id?: string;
  life?: Partial<Record<Depth, ReactNode>>;
  children?: ReactNode;
}) {
  const [w, h] = scene.box;
  const depths = ([0, 1, 2] as const).filter((z) => scene.pieces.some((p) => p.z === z) || life?.[z]);
  return (
    <div
      id={id}
      role={label ? "img" : undefined}
      aria-label={label}
      data-art=""
      data-run={view ? undefined : ""}
      className={cn("art", className)}
      style={{ aspectRatio: `${w} / ${h}`, ...(scale ? { width: w * scale } : null), ...style } as CSSProperties}
    >
      {depths.map((z) => {
        const pieces = scene.pieces.filter((p) => p.z === z);
        return (
          <Fragment key={z}>
            {pieces.length > 0 && (
              <svg viewBox={`0 0 ${w * UNIT} ${h * UNIT}`} data-z={z} className="art-layer" focusable="false" aria-hidden="true">
                <Pieces pieces={pieces} />
                {z === 0 && children}
              </svg>
            )}
            {life?.[z] && (
              <svg viewBox={`0 0 ${w} ${h}`} data-z={z} className="art-layer art-life" focusable="false">
                {life[z]}
              </svg>
            )}
          </Fragment>
        );
      })}
      {pen && <PenHand box={scene.box} />}
      <ArtEffects view={view} parallax={parallax} />
    </div>
  );
}

/** The pieces in order, with those of one group (a cloud, a tree) wrapped to move as one. */
function Pieces({ pieces }: { pieces: Piece[] }) {
  const out: ReactNode[] = [];
  for (let i = 0; i < pieces.length; ) {
    const g = pieces[i].g;
    if (!g) {
      out.push(<PiecePath key={i} p={pieces[i]} />);
      i++;
      continue;
    }
    const start = i;
    const run: ReactNode[] = [];
    while (i < pieces.length && pieces[i].g === g) run.push(<PiecePath key={i} p={pieces[i++]} />);
    out.push(
      <g key={`g${start}`} className={g}>
        {run}
      </g>,
    );
  }
  return out;
}
