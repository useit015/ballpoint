import { cn } from "@/lib/utils";
import { smiley } from "@/lib/art/doodles";
import { Doodle } from "@/components/home/doodle";

const face = smiley("sticky-smile", 400);

/** A yellow sticky note, stuck on and a little crooked. */
export function StickyNote({ className }: { className?: string }) {
  return (
    <aside className={cn("sticky-note", className)}>
      <p>
        A component library for people who still love paper.
      </p>
      <Doodle scene={face} scale={0.9} run className="sticky-face" />
    </aside>
  );
}
