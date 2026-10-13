import { Paper } from "@/registry/ballpoint/ui/paper";

export default function PaperTextures() {
  return (
    <div className="grid w-full max-w-3xl gap-x-8 gap-y-10 sm:grid-cols-3">
      <Paper lifted texture={false} className="min-h-40 -rotate-1">
        <h4 className="font-bold">Flat</h4>
        <p className="text-ink-2">texture=&#123;false&#125;: no grain, no fibres.</p>
      </Paper>
      <Paper lifted stains={3} className="min-h-40 rotate-1" seed="pt-stains">
        <h4 className="font-bold">Stained</h4>
        <p className="text-ink-2">Three coffee rings.</p>
      </Paper>
      <Paper lifted foxing className="min-h-40 -rotate-[0.5deg]">
        <h4 className="font-bold">Aged</h4>
        <p className="text-ink-2">Age spots (foxing).</p>
      </Paper>
    </div>
  );
}
