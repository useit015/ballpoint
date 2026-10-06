"use client";

import { Fragment, useSyncExternalStore } from "react";
import { install } from "@/lib/docs";
import { CodeFrame } from "@/components/code-frame";
import { CopyButton } from "@/components/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ballpoint/ui/tabs";

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

/** A URL or path may break after any slash on a narrow screen, never mid-word. */
function breakable(part: string) {
  return part.split(/(?<=\/)/).map((piece, i) => (
    <Fragment key={i}>
      {i > 0 && <wbr />}
      {piece}
    </Fragment>
  ));
}

/** `pnpm dlx shadcn@latest add …`, inked like code: the runner in the page's pen, the CLI in its red pen, the package in green. */
function Command({ command }: { command: string }) {
  const [runner, ...rest] = command.split(" ");
  const cliAt = rest.findIndex((part) => part.startsWith("shadcn@"));
  const lead = rest.slice(0, cliAt);
  const cli = rest[cliAt];
  const tail = rest.slice(cliAt + 1);
  return (
    <code>
      <span aria-hidden="true" className="select-none" style={{ color: "var(--code-quiet)" }}>
        ${" "}
      </span>
      <span style={{ color: "var(--code-keyword)", fontWeight: 600 }}>{[runner, ...lead].join(" ")}</span>{" "}
      <span style={{ color: "var(--code-name)" }}>{cli}</span>{" "}
      {tail.map((part, i) => (
        <span key={i} style={{ color: part.startsWith("@") || part.startsWith("http") ? "var(--code-string)" : "var(--code-plain)" }}>
          {breakable(part)}
          {i < tail.length - 1 ? " " : ""}
        </span>
      ))}
    </code>
  );
}

export function InstallCommand({ what, className }: { what: string; className?: string }) {
  const current = useSyncExternalStore(subscribe, read, () => "pnpm" as Manager);
  const command = install[current](what);
  return (
    <Tabs value={current} onValueChange={(v) => choose(v as Manager)} className="gap-0">
      <CodeFrame
        className={className}
        header={
          <>
            <TabsList variant="line" aria-label="Package manager" className="-ml-1 gap-1 text-sm">
              {managers.map((m) => (
                <TabsTrigger key={m} value={m} className="h-8 text-sm">
                  {m}
                </TabsTrigger>
              ))}
            </TabsList>
            <CopyButton text={command} />
          </>
        }
      >
        {managers.map((m) => (
          <TabsContent key={m} value={m}>
            <pre className="wrap">
              <Command command={install[m](what)} />
            </pre>
          </TabsContent>
        ))}
      </CodeFrame>
    </Tabs>
  );
}
