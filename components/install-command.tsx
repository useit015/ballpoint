"use client";

import { useSyncExternalStore } from "react";
import { install } from "@/lib/docs";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

type Manager = keyof typeof install;
const managers = Object.keys(install) as Manager[];
const KEY = "ballpoint:pm";

// The chosen package manager is a per-viewer convenience: remembered in
// localStorage and shared by every install block on the page.
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("ballpoint:pm", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("ballpoint:pm", onChange);
  };
}

function read(): Manager {
  try {
    const v = localStorage.getItem(KEY);
    return managers.includes(v as Manager) ? (v as Manager) : "pnpm";
  } catch {
    return "pnpm";
  }
}

function choose(m: Manager) {
  try {
    localStorage.setItem(KEY, m);
  } catch {}
  window.dispatchEvent(new Event("ballpoint:pm"));
}

export function InstallCommand({ what, className }: { what: string; className?: string }) {
  const current = useSyncExternalStore(subscribe, read, () => "pnpm" as Manager);
  const command = install[current](what);
  return (
    <div className={cn("code-block", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-ink-5 pr-2 pl-4">
        <div role="tablist" aria-label="Package manager" className="flex gap-4 pt-1.5">
          {managers.map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={m === current}
              onClick={() => choose(m)}
              className={cn(
                "-mb-px cursor-pointer border-b-2 pb-1 text-sm transition-colors",
                m === current ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <CopyButton text={command} />
      </div>
      <pre className="overflow-x-auto px-4 py-3">
        <code>{command}</code>
      </pre>
    </div>
  );
}
