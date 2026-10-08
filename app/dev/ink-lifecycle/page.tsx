import type { Metadata } from "next";
import { InkLifecycle } from "./lifecycle";

export const metadata: Metadata = { title: "Ink lifecycle", robots: { index: false } };

export default function Page() {
  return (
    <main id="main" className="mx-auto flex max-w-lg flex-col gap-8 p-8">
      <InkLifecycle />
    </main>
  );
}
