import { MarginNote } from "@/registry/ballpoint/ui/margin-note";
import { Paper } from "@/registry/ballpoint/ui/paper";

export default function MarginNoteReview() {
  return (
    <Paper lifted edge="dog-ear" stains={1} seed="mnr" className="w-full max-w-2xl px-8 py-8">
      <h4 className="mb-4 text-xl font-bold">Launch post, draft 2</h4>
      <ul className="flex max-w-sm flex-col gap-5 text-lg leading-relaxed text-ink-2">
        <li>
          We are{" "}
          <MarginNote mark="underline" note="good opening" seed="mnr-a" width="7rem">
            proud to announce
          </MarginNote>{" "}
          a library drawn by hand.
        </li>
        <li>
          It ships in{" "}
          <MarginNote mark="circle" color="red" note="still right?" seed="mnr-b" width="7rem">
            November
          </MarginNote>
          .
        </li>
        <li>
          With{" "}
          <MarginNote mark="highlight" color="pencil" note="ask legal" seed="mnr-c" width="7rem">
            forty components
          </MarginNote>{" "}
          to start.
        </li>
      </ul>
    </Paper>
  );
}
