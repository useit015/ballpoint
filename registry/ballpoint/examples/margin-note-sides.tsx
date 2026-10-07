import { MarginNote } from "@/registry/ballpoint/ui/margin-note";

export default function MarginNoteSides() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <p className="max-w-xs self-center text-lg leading-relaxed text-ink-2">
        <MarginNote side="left" note="the other margin" seed="mns-left">
          This note
        </MarginNote>{" "}
        sits on the left, where the first words of a line leave room for it.
      </p>
      <p className="max-w-xs self-center text-lg leading-relaxed text-ink-2">
        Use red for a correction: the figure was{" "}
        <MarginNote color="red" note="check this!" seed="mns-red">
          4,000
        </MarginNote>
        , not 400.
      </p>
    </div>
  );
}
