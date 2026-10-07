"use client";

import { Button } from "@/registry/ballpoint/ui/button";
import { Input } from "@/registry/ballpoint/ui/input";

export default function InputWithButton() {
  return (
    <form onSubmit={(event) => event.preventDefault()} className="flex w-full max-w-md items-center gap-3">
      <Input type="email" placeholder="you@example.com" aria-label="Email" className="flex-1" seed="iwb-email" />
      <Button type="submit" seed="iwb-submit">
        Subscribe
      </Button>
    </form>
  );
}
