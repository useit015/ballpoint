"use client";

import { Button } from "@/registry/ballpoint/ui/button";
import { toast } from "@/registry/ballpoint/ui/toast";

const save = (ok: boolean) => new Promise<void>((resolve, reject) => setTimeout(() => (ok ? resolve() : reject(new Error("offline"))), 1600));

// One note that follows the work: pending, then done, or failed.
export default function ToastPromise() {
  return (
    <div className="flex flex-wrap gap-5">
      <Button seed="tp-ok" onClick={() => toast.promise(save(true), { loading: "Saving the page…", success: "Page saved", error: "Couldn't save" })}>
        Save
      </Button>
      <Button variant="outline" seed="tp-fail" onClick={() => toast.promise(save(false), { loading: "Saving the page…", success: "Page saved", error: "Couldn't save: you're offline" })}>
        Save, offline
      </Button>
    </div>
  );
}
