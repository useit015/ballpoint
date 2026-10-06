import Link from "next/link";
import { Button } from "@/registry/ballpoint/ui/button";
import { InstallCommand } from "@/components/install-command";
import { Heading } from "@/components/heading";
import { allDocs } from "@/lib/docs";
import { homepage } from "@/registry/manifest";

export default function Home() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-4 pt-10 pb-24 sm:px-8 sm:pt-16">
      <section className="flex max-w-3xl flex-col gap-6">
        <Heading as="h1" id="ballpoint" className="text-5xl normal-case tracking-normal">
          Ballpoint
        </Heading>
        <p className="text-xl text-ink-2">
          shadcn-style components drawn in blue ballpoint. Same names and props as shadcn/ui, on Base UI, installed with the shadcn CLI.
          Every line is a seeded pen stroke: the same on the server and the client, redrawn to fit, and able to draw itself in.
        </p>
        <div className="flex flex-wrap gap-5 pt-2">
          <Button render={<Link href="/docs" />} nativeButton={false} size="lg" seed="hero-start" draw="mount">
            Get started
          </Button>
          <Button render={<Link href="/docs/button" />} nativeButton={false} variant="outline" size="lg" seed="hero-components" draw="mount">
            Components
          </Button>
        </div>
      </section>

      <section className="flex max-w-3xl flex-col gap-4">
        <h2 className="text-lg text-ink-3">One command sets up the paper, the ink and the font:</h2>
        <InstallCommand what={`init ${homepage}/r/ballpoint.json`} />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg text-ink-3">Drawn so far</h2>
        <ul className="flex flex-wrap gap-6">
          {allDocs.map((doc) => (
            <li key={doc.name}>
              <Link href={`/docs/${doc.name}`} className="text-xl underline decoration-ink-4 underline-offset-4 hover:decoration-ink">
                {doc.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
