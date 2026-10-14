import { Redact } from "@/registry/ballpoint/ui/redact";

export default function RedactLetter() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 text-lg leading-relaxed text-ink-2">
      <p>
        Dear <Redact seed="rl-name">Dr Hopper</Redact>,
      </p>
      <p>
        We write about the project at <Redact seed="rl-place">Harvard</Redact>. The budget stands at <Redact seed="rl-sum">£48,000</Redact> and the first test is
        set for <Redact seed="rl-date">March 3rd</Redact>.
      </p>
      <p>Please tell no one. Click a bar to read it, and again to cover it.</p>
    </div>
  );
}
