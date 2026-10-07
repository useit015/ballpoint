"use client";

import { useRef, useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { SignaturePad, type SignaturePadHandle } from "@/registry/ballpoint/ui/signature-pad";

export default function SignaturePadControls() {
  const pad = useRef<SignaturePadHandle>(null);
  const [empty, setEmpty] = useState(true);
  const [png, setPng] = useState("");
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <SignaturePad ref={pad} placeholder="Sign with your finger" onChange={(value) => {
          setEmpty(value === "");
          setPng("");
        }} seed="spc-pad" />
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" disabled={empty} onClick={() => pad.current?.undo()} seed="spc-undo">
          Undo
        </Button>
        <Button variant="ghost" size="sm" disabled={empty} onClick={() => pad.current?.clear()} seed="spc-clear">
          Clear
        </Button>
        <Button size="sm" disabled={empty} onClick={() => setPng(pad.current?.toDataURL("image/png") ?? "")} seed="spc-export">
          Export PNG
        </Button>
        {png && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={png} alt="The exported signature" className="h-10 w-auto" />
        )}
      </div>
    </div>
  );
}
