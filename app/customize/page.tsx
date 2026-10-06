import type { Metadata } from "next";
import { Customizer } from "@/components/customizer";
import { Heading } from "@/components/heading";

export const metadata: Metadata = {
  title: "Customize",
  description: "Pick a pen and a paper, set how the hand draws, and copy the result.",
};

export default function CustomizePage() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 pt-6 pb-24 sm:px-8">
      <header className="flex max-w-3xl flex-col gap-4">
        <Heading as="h1" id="customize" className="text-3xl">
          Customize
        </Heading>
        <p className="text-lg text-ink-2">
          Pick a pen and a paper, set how the hand draws, and watch the page redraw. Then copy the result: a theme to install, an
          InkProvider for your layout, or plain CSS.
        </p>
      </header>
      <Customizer />
    </main>
  );
}
