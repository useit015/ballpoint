import { MarginNote } from "@/registry/ballpoint/ui/margin-note";

const p = "max-w-xs self-center text-lg leading-relaxed text-ink-2";

export default function MarginNoteMarks() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-7">
      <p className={p}>
        The note can underline{" "}
        <MarginNote mark="underline" note="underlined" seed="mm-a">
          the words
        </MarginNote>
        .
      </p>
      <p className={p}>
        <MarginNote mark="circle" note="ringed, for a name" seed="mm-b">
          Ada Lovelace
        </MarginNote>{" "}
        gets a ring.
      </p>
      <p className={p}>
        A highlight for{" "}
        <MarginNote mark="highlight" note="the date" seed="mm-c">
          14 October
        </MarginNote>
        .
      </p>
      <p className={p}>
        And a box round the{" "}
        <MarginNote mark="box" color="red" note="check the figure" seed="mm-d">
          4,000
        </MarginNote>
        .
      </p>
    </div>
  );
}
