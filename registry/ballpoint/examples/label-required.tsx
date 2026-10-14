"use client";

import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";

export default function LabelRequired() {
  return (
    <form className="grid w-full max-w-sm gap-5" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-2">
        <Label htmlFor="lr-name" required>
          Name
        </Label>
        <Input id="lr-name" required placeholder="Ada Lovelace" seed="lr-name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lr-email" required>
          Email
        </Label>
        <Input id="lr-email" type="email" required placeholder="ada@example.com" seed="lr-email" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lr-note" optional>
          Anything we should know
        </Label>
        <Input id="lr-note" placeholder="Left-handed, say" seed="lr-note" />
      </div>
    </form>
  );
}
