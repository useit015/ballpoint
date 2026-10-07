import { Annotate } from "@/registry/ballpoint/ui/annotate";

export default function AnnotateReview() {
  return (
    <article className="flex max-w-md flex-col gap-4 text-lg leading-loose text-ink-2">
      <h3 className="text-xl font-bold text-ink">
        <Annotate type="underline" seed="ar-title">
          Release notes
        </Annotate>
      </h3>
      <p>
        This version is <Annotate type="highlight" as="mark" seed="ar-faster" delay={300}>twice as fast</Annotate>, and the{" "}
        <Annotate type="strike" color="red" as="del" seed="ar-old" delay={600}>
          old config file
        </Annotate>{" "}
        is gone. Read the <Annotate type="box" seed="ar-guide" delay={900}>migration guide</Annotate> first.
      </p>
      <p>
        Questions? <Annotate type="bracket" seed="ar-ask" delay={1200}>Ask in the issues</Annotate>.
      </p>
    </article>
  );
}
