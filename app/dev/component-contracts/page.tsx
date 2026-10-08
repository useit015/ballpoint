import type { Metadata } from "next";
import { ComponentContracts } from "./contracts";

export const metadata: Metadata = { title: "Component contracts", robots: { index: false } };

export default function Page() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-lg flex-col gap-8 p-8">
      <ComponentContracts />
    </main>
  );
}
