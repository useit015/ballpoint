import { MarginNote } from "@/registry/ballpoint/ui/margin-note";

const p = "max-w-xs self-center text-lg leading-relaxed text-ink-2";

export default function MarginNotePointers() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-7">
      <p className={p}>
        The default is a curved{" "}
        <MarginNote pointer="arrow" note="pointer=&quot;arrow&quot;" seed="mp-a">
          arrow
        </MarginNote>{" "}
        to the words.
      </p>
      <p className={p}>
        Quieter still is a plain{" "}
        <MarginNote pointer="line" note="pointer=&quot;line&quot;, tilted the other way" tilt={2.5} seed="mp-b">
          line
        </MarginNote>
        .
      </p>
      <p className={p}>
        And with nothing between them, a mark does{" "}
        <MarginNote pointer="none" color="pencil" mark="underline" note="no pointer, in pencil" seed="mp-c">
          the work
        </MarginNote>
        .
      </p>
    </div>
  );
}
