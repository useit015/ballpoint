import { Separator } from "@/registry/ballpoint/ui/separator";

export default function SeparatorSections() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <section>
        <h3 className="text-lg font-bold">Account</h3>
        <p className="text-ink-3">Your name and email.</p>
      </section>
      <Separator seed="ss-1" />
      <section>
        <h3 className="text-lg font-bold">Notebooks</h3>
        <p className="text-ink-3">Where your pages live.</p>
      </section>
      <Separator seed="ss-2" />
      <section>
        <h3 className="text-lg font-bold text-destructive">Danger zone</h3>
        <p className="text-ink-3">Delete everything. There is no undo.</p>
      </section>
    </div>
  );
}
