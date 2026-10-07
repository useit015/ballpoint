import { Scrawl, type ScrawlKind } from "@/registry/ballpoint/ui/scrawl";

const kinds: ScrawlKind[] = ["zigzag", "corner", "star", "slash"];

export default function ScrawlDemo() {
  return (
    <ul className="flex flex-wrap items-end justify-center gap-x-12 gap-y-8">
      {kinds.map((kind, i) => (
        <li key={kind} className="flex flex-col items-center gap-3">
          <Scrawl kind={kind} seed={`scrawl-${kind}`} delay={i * 250} scale={kind === "corner" ? 0.8 : 1} />
          <span className="text-sm text-ink-3">{kind}</span>
        </li>
      ))}
    </ul>
  );
}
