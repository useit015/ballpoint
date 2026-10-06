import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { CodeBlock } from "@/components/code-block";
import { Disclosure } from "@/components/disclosure";
import { Heading } from "@/components/heading";
import { InstallCommand } from "@/components/install-command";
import { Pager } from "@/components/pager";
import { Preview } from "@/components/preview";
import { PropsTable } from "@/components/props-table";
import { allDocs, getDoc, penProps } from "@/lib/docs";
import { exampleSource, examples, itemSource } from "@/lib/examples";

export const dynamicParams = false;

export function generateStaticParams() {
  return allDocs.map((doc) => ({ name: doc.name }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[name]">): Promise<Metadata> {
  const doc = getDoc((await params).name);
  return doc ? { title: doc.title, description: doc.description } : {};
}

// The sidebar's order, for the previous and next links.
const ordered = [...allDocs].sort((a, b) => a.title.localeCompare(b.title));
const link = (doc?: (typeof allDocs)[number]) => doc && { href: `/docs/${doc.name}`, title: doc.title };

const textLink = "underline decoration-ink-4 underline-offset-4 transition-colors hover:decoration-ink";

/** Every component page has the same parts, in the same order. */
export default async function ComponentPage({ params }: PageProps<"/docs/[name]">) {
  const doc = getDoc((await params).name);
  if (!doc) notFound();
  const [main, ...more] = doc.examples;
  const Example = examples[main];
  const at = ordered.findIndex((d) => d.name === doc.name);
  const pen = penProps.filter((prop) => doc.pen?.includes(prop.name));

  return (
    <article className="flex flex-col gap-14">
      <header className="flex flex-col gap-4">
        <Heading as="h1" id={doc.name} className="text-3xl">
          {doc.title}
        </Heading>
        <p className="text-lg text-ink-2">{doc.description}</p>
        {doc.primitive && (
          <a href={doc.primitive.href} className="flex w-fit items-center gap-1.5 text-ink-3 transition-colors hover:text-ink">
            Built on Base UI {doc.primitive.name}
            <InkGlyph name="arrow-up-right" className="size-3.5" />
          </a>
        )}
      </header>

      <Preview code={<CodeBlock code={exampleSource(main)} />}>
        <Example />
      </Preview>

      <section className="flex flex-col gap-5">
        <Heading id="installation">Installation</Heading>
        <InstallCommand what={`add @ballpoint/${doc.name}`} />
        <Disclosure summary="Or copy the source">
          {doc.files?.map((file) => (
            <CodeBlock key={file.path} title={file.path.split("/").slice(-2).join("/")} code={itemSource(file.path)} />
          ))}
        </Disclosure>
      </section>

      <section className="flex flex-col gap-5">
        <Heading id="usage">Usage</Heading>
        <CodeBlock code={doc.usage} />
      </section>

      {more.length > 0 && (
        <section className="flex flex-col gap-8">
          <Heading id="examples">Examples</Heading>
          {more.map((name) => {
            const More = examples[name];
            const meta = doc.exampleTitles?.[name];
            return (
              <div key={name} className="flex flex-col gap-3">
                <h3 id={name} className="text-xl font-bold">
                  {meta?.title ?? name}
                </h3>
                {meta && <p className="text-ink-2">{meta.description}</p>}
                <Preview code={<CodeBlock code={exampleSource(name)} />}>
                  <More />
                </Preview>
              </div>
            );
          })}
        </section>
      )}

      <section className="flex flex-col gap-5">
        <Heading id="api">API reference</Heading>
        {doc.props && <PropsTable props={doc.props} />}
        {doc.primitive && (
          <p className="text-ink-2">
            Every other prop goes to Base UI&apos;s{" "}
            <a href={doc.primitive.href} className={textLink}>
              {doc.primitive.name}
            </a>
            .
          </p>
        )}
        {pen.length > 0 && (
          <div className="flex flex-col gap-3 pt-4">
            <h3 id="pen-settings" className="text-xl font-bold">
              Pen settings
            </h3>
            <p className="text-ink-2">
              The drawing also takes{" "}
              {pen.map((prop, i) => (
                <span key={prop.name}>
                  <code className="inline-code">{prop.name}</code>
                  {i < pen.length - 2 ? ", " : i === pen.length - 2 ? " and " : ""}
                </span>
              ))}
              , as props or from the nearest <code className="inline-code">InkProvider</code>.{" "}
              <Link href="/docs#pen" className={textLink}>
                What each one does
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      <Pager prev={link(ordered[at - 1])} next={link(ordered[at + 1])} />
    </article>
  );
}
