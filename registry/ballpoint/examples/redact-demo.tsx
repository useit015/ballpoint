import { Redact } from "@/registry/ballpoint/ui/redact";

export default function RedactDemo() {
  return (
    <p className="max-w-sm text-lg leading-relaxed text-ink-2">
      The launch is on <Redact seed="redact-date">October 14th</Redact>, and the code name is{" "}
      <Redact seed="redact-name">Blue Biro</Redact>. Click to read them.
    </p>
  );
}
