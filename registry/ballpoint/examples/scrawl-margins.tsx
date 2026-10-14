import { Scrawl } from "@/registry/ballpoint/ui/scrawl";

export default function ScrawlMargins() {
  return (
    <div className="relative w-full max-w-md px-10 py-6">
      <Scrawl kind="asterisk" color="red" scale={0.6} seed="sm-a" delay={300} className="absolute top-5 left-1" />
      <Scrawl kind="tick" color="red" scale={0.7} seed="sm-b" delay={700} className="absolute top-28 left-0" />
      <Scrawl kind="ring" scale={0.7} seed="sm-c" delay={1000} className="absolute right-0 bottom-8" flip />
      <p className="text-lg leading-relaxed text-ink-2">
        Read slowly, the whole page is drawn in the margins as well: a star where something was important, a tick where it checked out, and a
        ring round the one line worth coming back to. Nobody drew them to be looked at. They are the sound of someone reading with a pen in
        hand.
      </p>
    </div>
  );
}
