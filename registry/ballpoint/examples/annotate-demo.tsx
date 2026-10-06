import { Annotate } from "@/registry/ballpoint/ui/annotate";

export default function AnnotateDemo() {
  return (
    <p className="max-w-md text-lg leading-loose text-ink-2">
      The plan was to{" "}
      <Annotate type="underline" seed="annotate-ship">
        ship on Friday
      </Annotate>
      . The build{" "}
      <Annotate type="circle" color="red" delay={500} seed="annotate-failed">
        failed
      </Annotate>{" "}
      twice, so we{" "}
      <Annotate type="scribble" as="del" delay={1000} seed="annotate-blamed">
        blamed the cache
      </Annotate>{" "}
      <Annotate type="highlight" as="mark" delay={1500} seed="annotate-read">
        read the logs
      </Annotate>{" "}
      and found it in{" "}
      <Annotate type="box" delay={2000} seed="annotate-minutes">
        ten minutes
      </Annotate>
      .
    </p>
  );
}
