import { Paper } from "@/registry/ballpoint/ui/paper";

export default function PaperDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-x-10 gap-y-12 sm:grid-cols-2">
      <Paper lifted stains={1} seed="paper-note" className="min-h-56 -rotate-1">
        <h4 className="text-xl font-bold">Plain</h4>
        <p className="mt-2 text-ink-2">A clean sheet, with a coffee ring where the cup was set down.</p>
      </Paper>
      <Paper lifted variant="ruled" margin className="min-h-56 rotate-1">
        <h4 className="font-bold">Ruled</h4>
        <p>Buy ink.</p>
        <p>Fill the notebook.</p>
        <p className="text-ink-2">Text in the sheet&apos;s line height sits on the lines.</p>
      </Paper>
      <Paper lifted variant="grid" className="min-h-56 rotate-[0.8deg]">
        <h4 className="text-xl font-bold">Squared</h4>
        <p className="mt-2 text-ink-2">For plans, diagrams and things that need to line up.</p>
      </Paper>
      <Paper lifted variant="dots" foxing lamp className="min-h-56 -rotate-[0.6deg]">
        <h4 className="text-xl font-bold">Dotted</h4>
        <p className="mt-2 text-ink-2">With age spots, and a desk lamp when the page turns to night.</p>
      </Paper>
    </div>
  );
}
