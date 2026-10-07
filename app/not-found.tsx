import Link from "next/link";
import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { Button } from "@/registry/ballpoint/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-[85rem] flex-1 flex-col items-start justify-center gap-6 px-4 py-24 sm:px-8">
      <h1 className="text-4xl font-bold">
        <Annotate type="scribble" as="del" seed="not-found">
          This page
        </Annotate>{" "}
        was never drawn
      </h1>
      <p className="max-w-lg text-lg text-ink-2">Nothing lives at this address. Press / to search the docs, or start again from the top.</p>
      <div className="flex flex-wrap gap-5">
        <Button render={<Link href="/docs" />} nativeButton={false} seed="not-found-docs">
          Read the docs
        </Button>
        <Button render={<Link href="/" />} nativeButton={false} variant="outline" seed="not-found-home">
          Back home
        </Button>
      </div>
    </main>
  );
}
