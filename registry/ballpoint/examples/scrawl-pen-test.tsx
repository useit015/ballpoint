import { Paper } from "@/registry/ballpoint/ui/paper";
import { Scrawl } from "@/registry/ballpoint/ui/scrawl";

export default function ScrawlPenTest() {
  return (
    <Paper variant="ruled" margin edge="torn" lifted seed="spt" tilt={-0.8} className="w-full max-w-md pb-5">
      <p className="text-ink-3">Testing the new pen</p>
      <div className="relative h-[6rem]">
        <Scrawl kind="spiral" scale={1.1} seed="spt-a" delay={100} className="absolute top-1 left-0" />
        <Scrawl kind="loops" scale={1.3} seed="spt-b" delay={500} className="absolute top-0 left-20" />
        <Scrawl kind="waves" seed="spt-c" delay={900} className="absolute top-14 left-6" />
        <Scrawl kind="zigzag" scale={0.7} rotate={90} seed="spt-d" delay={1200} className="absolute top-2 right-4" />
      </div>
      <p>Works. Smooth, too.</p>
    </Paper>
  );
}
