"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Annotate, type AnnotateType } from "@/registry/ballpoint/ui/annotate";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checklist, ChecklistItem } from "@/registry/ballpoint/ui/checklist";
import { MarginNote } from "@/registry/ballpoint/ui/margin-note";
import { Redact } from "@/registry/ballpoint/ui/redact";
import { Scrawl, type ScrawlKind } from "@/registry/ballpoint/ui/scrawl";
import { SignaturePad } from "@/registry/ballpoint/ui/signature-pad";
import { Doodle } from "@/components/home/doodle";
import { written } from "@/components/home/write";
import { burst } from "@/lib/art/doodles";

const marks: AnnotateType[] = ["highlight", "underline", "circle", "box"];

/** A sentence with one phrase marked up, and the four marks to try on it. */
export function AnnotateDemo() {
  const [type, setType] = useState<AnnotateType>("highlight");
  return (
    <div className="demo-annotate">
      <p className="demo-sentence">
        Mark{" "}
        <Annotate key={type} type={type} seed="demo-annotate">
          what matters
        </Annotate>{" "}
        with a simple, familiar API.
      </p>
      <div role="radiogroup" aria-label="Kind of mark" className="demo-chips">
        {marks.map((m) => (
          <button key={m} type="button" role="radio" aria-checked={m === type} className="demo-chip" onClick={() => setType(m)}>
            <Annotate type="underline" active={m === type} seed={`chip-${m}`} className="demo-chip-label">
              {m}
            </Annotate>
          </button>
        ))}
      </div>
      <code className="demo-code" aria-live="polite">{`<Annotate type="${type}">`}</code>
    </div>
  );
}

/** A line on a ruled page, with a note in its margin that you can rewrite. */
export function MarginNoteDemo() {
  const [note, setNote] = useState("Perfect for side thoughts.");
  return (
    <div className="demo-margin-demo">
      <div className="demo-page">
        <p className="demo-line">
          <MarginNote note={note.trim() || "…"} seed="demo-margin" className="demo-margin">
            Ship it on Friday.
          </MarginNote>
        </p>
      </div>
      <label className="demo-write">
        <span className="demo-write-label">Your note</span>
        <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={34} placeholder="Write a note" className="demo-write-input" />
      </label>
    </div>
  );
}

/** Words that stay scribbled out until you click them. */
export function RedactDemo() {
  return (
    <div className="demo-redact">
      <p className="demo-sentence">
        Launch day is{" "}
        <Redact label="The launch date" seed="demo-redact">
          14 June
        </Redact>
        .
      </p>
      <p className="demo-hint">Click the bar to read it, and again to cover it.</p>
    </div>
  );
}

type Scrawled = { id: number; kind: ScrawlKind; x: number; y: number; rotate: number; scale: number };
const kinds: ScrawlKind[] = ["zigzag", "star", "corner", "slash"];
const start: Scrawled[] = [
  { id: 1, kind: "zigzag", x: 18, y: 42, rotate: -6, scale: 0.9 },
  { id: 2, kind: "star", x: 50, y: 52, rotate: 8, scale: 1.2 },
  { id: 3, kind: "slash", x: 80, y: 38, rotate: -10, scale: 1.6 },
];

/** A page to scrawl on: click or press Enter anywhere on it, and the pen goes at it there. */
export function ScrawlDemo() {
  const [items, setItems] = useState<Scrawled[]>(start);
  const next = useRef(4);
  const add = (x: number, y: number) =>
    setItems((list) => {
      const n = next.current++;
      const made: Scrawled = { id: n, kind: kinds[n % kinds.length], x, y, rotate: ((n * 37) % 24) - 12, scale: 0.8 + ((n * 13) % 8) / 10 };
      return [...list, made].slice(-14);
    });
  const click = (e: PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    add(((e.clientX - box.left) / box.width) * 100, ((e.clientY - box.top) / box.height) * 100);
  };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    add(15 + ((next.current * 29) % 70), 25 + ((next.current * 17) % 50));
  };
  return (
    <div className="demo-scrawl">
      <div role="button" tabIndex={0} aria-label="Scrawl on the page: click, or press Enter" className="demo-scrawl-pad" onPointerDown={click} onKeyDown={key}>
        {items.map((s) => (
          <Scrawl key={s.id} kind={s.kind} scale={s.scale} rotate={s.rotate} seed={`demo-scrawl-${s.id}`} draw={s.id > 3 ? "mount" : "auto"} className="demo-scrawl-mark" style={{ left: `${s.x}%`, top: `${s.y}%` }} />
        ))}
        {items.length === 0 && <span className="demo-hint demo-scrawl-empty">Blank. Click to scrawl.</span>}
      </div>
      <div className="demo-scrawl-bar">
        <span className="demo-hint">Click to scrawl</span>
        <Button variant="ghost" size="sm" seed="demo-scrawl-clear" onClick={() => setItems([])} disabled={items.length === 0}>
          Clear
        </Button>
      </div>
    </div>
  );
}

const tasks = [
  ["ship", "Ship something great"],
  ["coffee", "Drink more coffee"],
  ["grass", "Touch grass (maybe)"],
] as const;

/** A short list to tick off; finish it and the pen celebrates. */
export function ChecklistDemo() {
  const [done, setDone] = useState<string[]>(["ship"]);
  const all = done.length === tasks.length;
  return (
    <div className="demo-checklist-demo">
      <Checklist value={done} onValueChange={setDone} aria-label="This week" className="demo-checklist">
        {tasks.map(([value, label]) => (
          <ChecklistItem key={value} value={value} seed={`demo-${value}`}>
            {label}
          </ChecklistItem>
        ))}
      </Checklist>
      <p className="demo-hint demo-progress" aria-live="polite">
        {all ? <span key="all">{written("All done. Go outside.")}</span> : `${done.length} of ${tasks.length} done`}
      </p>
      {all && <Doodle scene={burst("checklist-burst")} scale={1.4} run className="demo-burst" />}
    </div>
  );
}

/** A line to sign on, and a word when you have. */
export function SignatureDemo() {
  const [signed, setSigned] = useState(false);
  return (
    <div className="demo-signature-demo">
      <SignaturePad label="Your signature" placeholder="Sign here" seed="demo-signature" className="demo-signature" onChange={(value) => setSigned(value !== "")} />
      <p className="demo-hint" aria-live="polite">
        {signed ? "Signed. It is kept as an SVG, or a PNG." : "With a mouse, a finger or a pen."}
      </p>
    </div>
  );
}
