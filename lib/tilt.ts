import type { Fastener } from "@/components/torn-sheet";

const hash = (key: string) => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return h >>> 0;
};

/**
 * How a slip lies on the page, from a key: a small tilt (about ±0.7deg) and
 * which of the two torn edges. It is held down only when asked to be
 * (`fastener`): tape is for the one slip a page leads with. The same key lays
 * it the same way on every visit.
 */
export function lay(key: string, fastener?: Fastener): { tilt: string; edge: "a" | "b"; fastener: Fastener } {
  const h = hash(key);
  const n = (h % 9) - 4;
  return {
    tilt: `${(n === 0 ? -0.4 : n * 0.17).toFixed(2)}deg`,
    edge: (h >> 5) % 2 ? "a" : "b",
    fastener: fastener ?? "none",
  };
}
