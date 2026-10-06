import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import { Heading } from "@/components/heading";
import { InstallCommand } from "@/components/install-command";
import { Preview } from "@/components/preview";
import { PropsTable } from "@/components/props-table";
import { allDocs, getDoc } from "@/lib/docs";
import { exampleSource, examples, itemSource } from "@/lib/examples";

export const dynamicParams = false;

export function generateStaticParams() {
  return allDocs.map((doc) => ({ name: doc.name }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[name]">): Promise<Metadata> {
  const doc = getDoc((await params).name);
  return doc ? { title: doc.title, description: doc.description } : {};
}

export default async function ComponentPage({ params }: PageProps<"/docs/[name]">) {
  const doc = getDoc((await params).name);
  if (!doc) notFound();
  const [main] = doc.examples;
  const Example = examples[main];

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-5">
        <Heading as="h1" id={doc.name} className="text-3xl">
          {doc.title}
        </Heading>
        <p className="text-lg text-ink-2">{doc.description}</p>
      </header>

      <Preview code={<CodeBlock code={exampleSource(main)} />}>
        <Example />
      </Preview>

      <section className="flex flex-col gap-4">
        <Heading id="install">Install</Heading>
        <InstallCommand what={`add @ballpoint/${doc.name}`} />
        <details className="group">
          <summary className="cursor-pointer text-ink-2 hover:text-ink">Or copy the source</summary>
          <div className="mt-4 flex flex-col gap-4">
            {doc.files?.map((file) => (
              <CodeBlock key={file.path} title={file.path.split("/").slice(-2).join("/")} code={itemSource(file.path)} />
            ))}
          </div>
        </details>
      </section>

      <section className="flex flex-col gap-4">
        <Heading id="usage">Usage</Heading>
        <CodeBlock code={doc.usage} />
      </section>

      {doc.props && (
        <section className="flex flex-col gap-4">
          <Heading id="api">API</Heading>
          <PropsTable props={doc.props} />
          {doc.primitive && (
            <p className="text-ink-2">
              Every other prop goes to Base UI&apos;s{" "}
              <a href={doc.primitive.href} className="underline decoration-ink-4 underline-offset-4 hover:decoration-ink">
                {doc.primitive.name}
              </a>
              .
            </p>
          )}
        </section>
      )}
    </article>
  );
}
