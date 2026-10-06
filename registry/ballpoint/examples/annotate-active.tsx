"use client";

import { useState } from "react";
import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { Button } from "@/registry/ballpoint/ui/button";

export default function AnnotateActive() {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg text-ink-2">
        <Annotate type="strike" active={done} seed="annotate-milk">
          Buy milk
        </Annotate>{" "}
        and{" "}
        <Annotate type="circle" color="red" active={!done} seed="annotate-call">
          call the plumber
        </Annotate>
      </p>
      <Button variant="outline" size="sm" seed="annotate-toggle" onClick={() => setDone((d) => !d)}>
        {done ? "Not done yet" : "Done"}
      </Button>
    </div>
  );
}
