import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";
import { Paper } from "@/registry/ballpoint/ui/paper";

export default function PaperForm() {
  return (
    <Paper lifted edge="torn" tape="top" seed="pf-invite" tilt={1} className="w-full max-w-sm pt-9 pb-8">
      <h4 className="text-2xl font-bold">Save me a seat</h4>
      <p className="mt-1 text-ink-2">Controls draw on the sheet as if it were their own paper.</p>
      <form className="mt-5 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="paper-form-email">Email</Label>
          <Input id="paper-form-email" type="email" placeholder="you@domain.com" />
        </div>
        <Label>
          <Checkbox defaultChecked />
          Send me updates
        </Label>
        <Button type="button" className="w-fit">
          RSVP
        </Button>
      </form>
    </Paper>
  );
}
