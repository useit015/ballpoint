import { MarginNote } from "@/registry/ballpoint/ui/margin-note";

export default function MarginNoteDemo() {
  return (
    <div className="w-full max-w-xl">
      <p className="max-w-xs text-lg leading-relaxed text-ink-2">
        Every box is drawn as four pulls of the pen, and{" "}
        <MarginNote note="took three tries to get right" seed="margin-note-corners">
          the corners cross
        </MarginNote>{" "}
        the way they do when you sketch one quickly. The seed keeps the wobble the same on the server and in the browser.
      </p>
    </div>
  );
}
