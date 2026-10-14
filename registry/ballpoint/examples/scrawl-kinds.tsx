import { Scrawl, type ScrawlKind } from "@/registry/ballpoint/ui/scrawl";

const kinds: ScrawlKind[] = ["spiral", "loops", "waves", "cross", "asterisk", "ring", "tick"];

export default function ScrawlKinds() {
  return (
    <ul className="grid w-full max-w-xl grid-cols-2 items-end gap-x-10 gap-y-9 sm:grid-cols-4">
      {kinds.map((kind, i) => (
        <li key={kind} className="flex flex-col items-center gap-3">
          <Scrawl kind={kind} seed={`sk-${kind}`} delay={i * 200} />
          <span className="font-mono text-sm text-ink-3">{kind}</span>
        </li>
      ))}
    </ul>
  );
}
