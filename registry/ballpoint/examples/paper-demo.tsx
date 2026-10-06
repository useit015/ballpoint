import { Paper } from "@/registry/ballpoint/ui/paper";

export default function PaperDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <Paper lifted stains={1} seed="paper-note" className="min-h-48">
        <p className="text-lg">Plain, with a coffee ring where the cup was set down.</p>
      </Paper>
      <Paper lifted variant="ruled" margin className="min-h-48">
        <p>Ruled, with a margin.</p>
        <p className="text-ink-2">Text set in the sheet&apos;s line height sits on the lines.</p>
      </Paper>
      <Paper lifted variant="grid" className="min-h-40">
        <p>Squared.</p>
      </Paper>
      <Paper lifted variant="dots" foxing lamp className="min-h-40">
        <p>Dotted, with age spots, and a lamp at night.</p>
      </Paper>
    </div>
  );
}
