import { Paper } from "@/registry/ballpoint/ui/paper";

export default function PaperTextures() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-3">
      <Paper lifted texture={false} className="min-h-32">
        <p>No texture: a flat sheet.</p>
      </Paper>
      <Paper lifted stains={3} className="min-h-32" seed="pt-stains">
        <p>Three coffee rings.</p>
      </Paper>
      <Paper lifted foxing className="min-h-32">
        <p>Age spots (foxing).</p>
      </Paper>
    </div>
  );
}
