"use client";

import type { CSSProperties, ReactNode } from "react";
import { Badge } from "@/registry/ballpoint/ui/badge";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Label } from "@/registry/ballpoint/ui/label";
import { Progress } from "@/registry/ballpoint/ui/progress";
import { CopyButton } from "@/components/copy-button";
import { useInstallCommand } from "@/components/install-command";
import { paperTile } from "@/lib/paper";
import { cn } from "@/lib/utils";
import { papers, type PaperName, type PaperTheme, type PenTheme } from "@/registry/themes";

// Sheets lie a little askew, the way paper does on a desk.
const tilts = ["-rotate-[0.6deg]", "rotate-[0.4deg]", "-rotate-[0.3deg]", "rotate-[0.7deg]"];

/** The item's name and a button copying its install command. */
function AddLine({ item }: { item: string }) {
  const command = useInstallCommand(`add @ballpoint/${item}`);
  return (
    <div className="flex items-center justify-between gap-3 pt-1">
      <code className="font-mono text-sm text-ink-3 [font-variation-settings:'MONO'_1,'CASL'_1]">@ballpoint/{item}</code>
      <CopyButton text={command} />
    </div>
  );
}

function Sheet({ index, className, style, children }: { index: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div
      data-ink-scope=""
      className={cn("paper-sheet sheet flex flex-col gap-5 px-6 pt-6 pb-4 text-foreground motion-safe:transition-transform", tilts[index % tilts.length], className)}
      style={style}
    >
      {children}
    </div>
  );
}

/** A pen test: the pen's name, and a few components drawn with it, on the default paper. */
export function PenSheet({ name, pen, index }: { name: string; pen: PenTheme; index: number }) {
  const cream = papers.cream;
  return (
    <Sheet
      index={index}
      className="pen-scope paper-scope"
      style={
        {
          "--pen-day": pen.ink.light,
          "--pen-night": pen.ink.dark,
          "--paper-day": cream.paper.light,
          "--paper-night": cream.paper.dark,
          "--red-day": cream.red.light,
          "--red-night": cream.red.dark,
          "--tile-day": paperTile("cream", "light"),
          "--tile-night": paperTile("cream", "dark"),
        } as CSSProperties
      }
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold">{pen.title}</h3>
        <p className="text-ink-2">{pen.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <Button size="sm" seed={`pen-${name}-solid`}>
          Book a call
        </Button>
        <Button size="sm" variant="outline" seed={`pen-${name}-outline`}>
          Later
        </Button>
        <Label>
          <Checkbox defaultChecked seed={`pen-${name}-check`} />
          Ink
        </Label>
      </div>
      <Progress value={62} aria-label="Ink left" seed={`pen-${name}-progress`} />
      <AddLine item={`pen-${name}`} />
    </Sheet>
  );
}

/** A sheet of the paper itself, written on in blue, with the red pen that goes with it. */
export function PaperSheet({ name, paper, index }: { name: PaperName; paper: PaperTheme; index: number }) {
  return (
    <Sheet
      index={index}
      className="paper-scope"
      style={
        {
          "--paper-day": paper.paper.light,
          "--paper-night": paper.paper.dark,
          "--red-day": paper.red.light,
          "--red-night": paper.red.dark,
          "--tile-day": paperTile(name, "light"),
          "--tile-night": paperTile(name, "dark"),
        } as CSSProperties
      }
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold">{paper.title}</h3>
        <p className="text-ink-2">{paper.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Badge seed={`paper-${name}-badge`}>Paid</Badge>
        <Badge variant="destructive" seed={`paper-${name}-red`}>
          Overdue
        </Badge>
        <Button size="sm" variant="outline" seed={`paper-${name}-button`}>
          Send
        </Button>
      </div>
      <AddLine item={`paper-${name}`} />
    </Sheet>
  );
}
