import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { CodeBlock } from "@/components/code-block";
import { Disclosure } from "@/components/disclosure";
import { Heading } from "@/components/heading";
import { InstallCommand } from "@/components/install-command";
import { DocPage } from "@/components/doc-page";
import { Pager } from "@/components/pager";
import { TextLink } from "@/components/text-link";
import { Badge } from "@/registry/ballpoint/ui/badge";
import { Preview } from "@/components/preview";
import { PropsTable } from "@/components/props-table";
import type { TocItem } from "@/components/toc";
import { allDocs, getDoc, penProps } from "@/lib/docs";
import { neighbours } from "@/lib/nav";
import { exampleSource, examples, itemSource } from "@/lib/examples";

export const dynamicParams = false;

export function generateStaticParams() {
  return allDocs.map((doc) => ({ name: doc.name }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[name]">): Promise<Metadata> {
  const doc = getDoc((await params).name);
  return doc ? { title: doc.title, description: doc.description } : {};
}

/** Every component page has the same parts, in the same order. */
export default async function ComponentPage({ params }: PageProps<"/docs/[name]">) {
  const doc = getDoc((await params).name);
  if (!doc) notFound();
  const [main, ...more] = doc.examples;
  const Example = examples[main];
  const pen = penProps.filter((prop) => doc.pen?.includes(prop.name));
  const { prev, next } = neighbours(doc.name);
  const toc: TocItem[] = [
    { id: "installation", title: "Installation" },
    { id: "usage", title: "Usage" },
    ...(more.length ? [{ id: "examples", title: "Examples" }, ...more.map((name) => ({ id: name, title: doc.exampleTitles?.[name]?.title ?? name, depth: 3 as const }))] : []),
    { id: "api", title: "API reference" },
  ];

  return (
    <DocPage toc={toc}>
      <header className="flex flex-col gap-4">
        <Heading as="h1" id={doc.name} className="text-3xl">
          {doc.title}
        </Heading>
        <p className="text-lg text-ink-2">{doc.description}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Badge variant={doc.group === "Drawn" ? "default" : "secondary"} seed={`${doc.name}-group`}>
            {doc.group === "Drawn" ? "Only in Ballpoint" : "From shadcn/ui"}
          </Badge>
          {doc.primitive && (
            <a href={doc.primitive.href} className="flex w-fit items-center gap-1.5 text-ink-3 transition-colors hover:text-ink">
              Built on Base UI {doc.primitive.name}
              <InkGlyph name="arrow-up-right" className="size-3.5" />
            </a>
          )}
        </div>
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
                <h3 id={name} className="scroll-mt-6 text-xl font-bold">
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
            <TextLink href={doc.primitive.href}>{doc.primitive.name}</TextLink>
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
              <TextLink href="/docs#pen">What each one does</TextLink>
              .
            </p>
          </div>
        )}
      </section>

      <Pager prev={prev} next={next} />
    </DocPage>
  );
}
