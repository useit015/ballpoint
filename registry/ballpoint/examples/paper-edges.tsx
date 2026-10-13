import { Paper } from "@/registry/ballpoint/ui/paper";

export default function PaperEdges() {
  return (
    <div className="grid w-full max-w-3xl gap-x-10 gap-y-14 sm:grid-cols-3">
      <Paper lifted edge="torn" variant="ruled" margin seed="pe-torn" tilt={-1.5} className="min-h-60 [--paper-margin:2.25rem]">
        <h4 className="font-bold">Torn</h4>
        <p>Out of a pad.</p>
        <p className="text-ink-2">The shadow follows the tear.</p>
      </Paper>
      <Paper lifted edge="dog-ear" variant="grid" tilt={1} className="min-h-60">
        <h4 className="text-xl font-bold">Dog-eared</h4>
        <p className="mt-2 text-ink-2">The corner turned down, to find the page again.</p>
      </Paper>
      <Paper lifted tape="corner" stains={1} seed="pe-taped" tilt={-2} className="min-h-60">
        <h4 className="text-xl font-bold">Taped</h4>
        <p className="mt-2 text-ink-2">Over a corner, or across the top.</p>
      </Paper>
    </div>
  );
}
