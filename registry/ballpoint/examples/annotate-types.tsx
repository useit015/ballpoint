import { Annotate, type AnnotateType } from "@/registry/ballpoint/ui/annotate";

const types: AnnotateType[] = ["underline", "circle", "box", "strike", "scribble", "bracket", "highlight"];

export default function AnnotateTypes() {
  return (
    <ul className="grid gap-x-12 gap-y-7 text-lg sm:grid-cols-2">
      {types.map((type, i) => (
        <li key={type} className="flex items-baseline justify-between gap-6">
          <span className="text-sm text-ink-3">{type}</span>
          <Annotate type={type} color={type === "circle" || type === "strike" ? "red" : "ink"} delay={i * 200} seed={`annotate-${type}`}>
            a ballpoint
          </Annotate>
        </li>
      ))}
    </ul>
  );
}
