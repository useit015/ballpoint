"use client";

import { Button } from "@/registry/ballpoint/ui/button";
import { Toaster, toast } from "@/registry/ballpoint/ui/toast";

const save = () => new Promise<string>((resolve) => setTimeout(() => resolve("page 12"), 1600));

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-5">
      <Button variant="outline" seed="toast-plain" onClick={() => toast("Page torn out", { description: "It's in the bin for 30 days.", action: { label: "Undo", onClick: () => toast.success("Page put back") } })}>
        Tear out a page
      </Button>
      <Button variant="outline" seed="toast-success" onClick={() => toast.success("Saved", { description: "Every line, safe and sound." })}>
        Save
      </Button>
      <Button variant="outline" seed="toast-error" onClick={() => toast.error("Couldn't send", { description: "The post office is closed. Try again later." })}>
        Send
      </Button>
      <Button variant="outline" seed="toast-promise" onClick={() => toast.promise(save(), { loading: "Saving…", success: (page) => `Saved ${page}`, error: "Couldn't save" })}>
        Save slowly
      </Button>
      <Toaster />
    </div>
  );
}
