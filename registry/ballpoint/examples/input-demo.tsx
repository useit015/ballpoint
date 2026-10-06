import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";

export default function InputDemo() {
  return (
    <div className="grid w-full max-w-md gap-6">
      <div className="grid gap-2">
        <Label htmlFor="input-email">Email</Label>
        <Input id="input-email" type="email" placeholder="you@example.com" seed="input-email" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="input-name">Name, written on the line</Label>
        <Input id="input-name" variant="line" placeholder="Oussama" seed="input-name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="input-code">Invite code</Label>
        <Input id="input-code" aria-invalid defaultValue="NOPE-123" seed="input-code" />
        <p className="text-sm text-destructive">That code has already been used.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Rounded" radius={10} seed="input-rounded" aria-label="Rounded" />
        <Input placeholder="Disabled" disabled seed="input-disabled" aria-label="Disabled" />
      </div>
    </div>
  );
}
