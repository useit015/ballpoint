import { Scrawl } from "@/registry/ballpoint/ui/scrawl";

const sections = [
  ["Mornings", "Coffee, then the first page.", "zigzag"],
  ["Afternoons", "Letters, lists and errands.", "star"],
  ["Evenings", "Sketching until the lamp goes on.", "slash"],
] as const;

export default function ScrawlDividers() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {sections.map(([title, note, kind], i) => (
        <div key={title} className="flex flex-col gap-4">
          {i > 0 && <Scrawl kind={kind} scale={0.7} seed={`sd-${kind}`} delay={i * 200} className="self-center text-ink-3" />}
          <section>
            <h4 className="text-xl font-bold">{title}</h4>
            <p className="text-ink-2">{note}</p>
          </section>
        </div>
      ))}
    </div>
  );
}
