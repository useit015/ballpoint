import type { Metadata } from "next";
import { InkOrder } from "./order";

export const metadata: Metadata = { title: "Ink order", robots: { index: false } };

export default function Page() {
  return (
    <main id="main" className="mx-auto flex max-w-lg flex-col gap-8 p-8">
      <InkOrder />
    </main>
  );
}
