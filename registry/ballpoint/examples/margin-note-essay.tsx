import { MarginNote } from "@/registry/ballpoint/ui/margin-note";

export default function MarginNoteEssay() {
  return (
    <div className="w-full max-w-2xl">
      <p className="max-w-sm text-lg leading-relaxed text-ink-2">
        A good pen is{" "}
        <MarginNote note="not the expensive one" seed="mne-a">
          one you forget you are holding
        </MarginNote>
        . It starts on the first try, writes as fast as you think, and leaves a line you would{" "}
        <MarginNote note="check this!" color="red" seed="mne-b">
          not mind being read in
        </MarginNote>{" "}
        ten years. The paper matters just as much.
      </p>
    </div>
  );
}
