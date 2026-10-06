import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { hashSeed, lineStroke, verticalStroke } from "@/registry/ballpoint/lib/ink-sketch";

const H = 200;

/**
 * A notebook margin: two near-vertical pulls down the left of a block, the
 * second lighter and not quite parallel. Stretches to the block's height;
 * only the length scales, so the line weight holds.
 */
export function MarginRule({ seed }: { seed: string }) {
  const s = hashSeed(seed);
  return (
    <InkSvg box={[0, 0, 6, H]} stretch className="text-ink-4" style={{ left: 2, top: 4, width: 6, height: "calc(100% - 8px)" }}>
      <Stroke d={verticalStroke(s, H)} width={1.3} />
      <Stroke d={lineStroke(s + 1, [4.6, 8], [4.1, H - 6], { bow: 0.6, jitter: 0.5 })} width={0.9} opacity={0.6} />
    </InkSvg>
  );
}
