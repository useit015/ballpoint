"use client";

import { Button } from "@/registry/ballpoint/ui/button";
import { toast } from "@/registry/ballpoint/ui/toast";

// Render <Toaster /> once near your root (the first example does); toast() works from anywhere.
export default function ToastActions() {
  return (
    <div className="flex flex-wrap gap-5">
      <Button variant="outline" seed="ta-info" onClick={() => toast.info("New refill available", { description: "Medium point, blue." })}>
        Info
      </Button>
      <Button variant="outline" seed="ta-warn" onClick={() => toast.warning("Running low", { description: "About a page of ink left." })}>
        Warning
      </Button>
      <Button variant="outline" seed="ta-sticky" onClick={() => toast("Stays until you close it", { timeout: 0, description: "No timer on this one." })}>
        Sticky
      </Button>
      <Button variant="ghost" seed="ta-clear" onClick={() => toast.dismiss()}>
        Clear all
      </Button>
    </div>
  );
}
