"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { SignaturePad } from "@/registry/ballpoint/ui/signature-pad";

export default function SignaturePadDemo() {
  const [signed, setSigned] = useState("");
  return (
    <form
      className="flex w-full max-w-md flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSigned(String(new FormData(event.currentTarget).get("signature") ?? ""));
      }}
    >
      <SignaturePad name="signature" required seed="signature-demo" />
      <div className="flex min-h-12 items-center gap-4">
        <Button type="submit" seed="signature-submit">
          Sign
        </Button>
        {signed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={signed} alt="The signature, as the form sent it" className="h-12 w-auto" />
        )}
      </div>
    </form>
  );
}
