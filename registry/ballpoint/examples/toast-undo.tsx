"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { toast } from "@/registry/ballpoint/ui/toast";

const start = ["Dear Ada", "Shopping list", "Sketch of a lake", "Recipe"];

export default function ToastUndo() {
  const [pages, setPages] = useState(start);
  const remove = (page: string, at: number) => {
    setPages((all) => all.filter((p) => p !== page));
    toast(`Tore out “${page}”`, {
      action: { label: "Undo", onClick: () => setPages((all) => [...all.slice(0, at), page, ...all.slice(at)]) },
    });
  };
  return (
    <ul className="flex w-full max-w-sm flex-col gap-2">
      {pages.map((page, at) => (
        <li key={page} className="flex items-center justify-between gap-3">
          {page}
          <Button variant="ghost" size="sm" seed={`tu-${page}`} onClick={() => remove(page, at)}>
            Tear out
          </Button>
        </li>
      ))}
      {pages.length === 0 && <li className="text-ink-3">An empty notebook.</li>}
    </ul>
  );
}
