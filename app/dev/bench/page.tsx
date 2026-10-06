import type { Metadata } from "next";
import { Bench } from "./bench";

export const metadata: Metadata = { title: "Bench", robots: { index: false } };

export default function Page() {
  return (
    <main className="p-8">
      <Bench />
    </main>
  );
}
