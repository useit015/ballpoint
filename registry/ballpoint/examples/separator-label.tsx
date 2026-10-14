"use client";

import { Button } from "@/registry/ballpoint/ui/button";
import { Input } from "@/registry/ballpoint/ui/input";
import { Separator } from "@/registry/ballpoint/ui/separator";

export default function SeparatorLabel() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Button variant="outline" seed="sl-google">
        Continue with a pen name
      </Button>
      <Separator seed="sl-or">or</Separator>
      <form className="flex flex-col gap-3" onSubmit={(event) => event.preventDefault()}>
        <Input type="email" aria-label="Email" placeholder="you@example.com" seed="sl-email" />
        <Button seed="sl-send">Email me a link</Button>
      </form>
    </div>
  );
}
