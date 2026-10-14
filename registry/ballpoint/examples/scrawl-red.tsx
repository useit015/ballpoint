import { Scrawl } from "@/registry/ballpoint/ui/scrawl";

const lines = [
  ["Buy more blue pens", "tick"],
  ["Finish the draft by Friday", "ring"],
  ["Ask about the old notebook", "asterisk"],
  ["Paint the shed", "cross"],
] as const;

export default function ScrawlRed() {
  return (
    <ul className="flex w-full max-w-sm flex-col gap-5 text-lg">
      {lines.map(([text, kind], i) => (
        <li key={text} className="relative flex items-center gap-4">
          <span className="relative w-12 shrink-0">
            <Scrawl kind={kind} color="red" scale={0.7} seed={`sr-${kind}`} delay={i * 300} className="absolute -top-5 left-0" />
          </span>
          <span className="text-ink-2">{text}</span>
        </li>
      ))}
    </ul>
  );
}
