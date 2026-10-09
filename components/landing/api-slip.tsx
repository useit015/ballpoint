import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { slipProps } from "@/lib/slip";
import { Annotate, type AnnotateType } from "@/registry/ballpoint/ui/annotate";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";

/** A token in a pen (the .code-block classes in app/globals.css). */
const T = ({ c, children }: { c: string; children: ReactNode }) => <span className={c}>{children}</span>;

/** An import line: the name in its pen, or marked up (`mark`). */
function Import({ name, from, mark }: { name: string; from: string; mark?: ReactNode }) {
  return (
    <>
      <T c="ck cb">import</T> <T c="cq">{"{"}</T> {mark ?? <T c="cn">{name}</T>} <T c="cq">{"}"}</T> <T c="ck cb">from</T> <T c="cs">{`"@/components/ui/${from}"`}</T>
      {"\n"}
    </>
  );
}

const captions: { type: AnnotateType; mark: string; rest: string }[] = [
  { type: "underline", mark: "Same names", rest: "and props as shadcn/ui, installed into components/ui." },
  { type: "circle", mark: "Base UI", rest: "underneath, so focus, keys and screen readers work as they should." },
  { type: "box", mark: "Seeded", rest: "strokes: the server and the browser draw the same wobble." },
];

/**
 * A slip with the code on it and what that code draws beside it, marked
 * up: what's the same as shadcn/ui, what Base UI does, and the seed every
 * outline comes from, each with the mark its caption carries.
 */
export function ApiSlip({ className }: { className?: string }) {
  return (
    <figure className={cn("slip grid gap-x-10 gap-y-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]", className)} {...slipProps("plain")}>
      <div className="code-block min-w-0">
        <pre className="wrap !p-0">
          <code>
            <Import name="Button" from="button" mark={<Annotate type="underline" seed="api-name" className="cn">Button</Annotate>} />
            <Import name="Checkbox" from="checkbox" />
            <Import name="Input" from="input" />
            <Import name="Label" from="label" />
            {"\n"}
            <T c="cq">{"<"}</T>
            <T c="cn">Input</T> <T c="ci">type</T>
            <T c="cq">=</T>
            <T c="cs">&quot;email&quot;</T> <T c="ci">placeholder</T>
            <T c="cq">=</T>
            <T c="cs">&quot;you@example.com&quot;</T> <T c="cq">{"/>"}</T>
            {"\n"}
            <T c="cq">{"<"}</T>
            <T c="cn">Label</T>
            <T c="cq">{">"}</T>
            {"\n  "}
            <T c="cq">{"<"}</T>
            <T c="cn">Checkbox</T>{" "}
            <Annotate type="circle" seed="api-base" className="ci mx-2">
              defaultChecked
            </Annotate>{" "}
            <T c="cq">{"/>"}</T> Send me the changelog
            {"\n"}
            <T c="cq">{"</"}</T>
            <T c="cn">Label</T>
            <T c="cq">{">"}</T>
            {"\n"}
            <T c="cq">{"<"}</T>
            <T c="cn">Button</T>{" "}
            <Annotate type="box" seed="api-seed" className="mx-2">
              <T c="ci">seed</T>
              <T c="cq">=</T>
              <T c="cs">&quot;subscribe&quot;</T>
            </Annotate>
            <T c="cq">{">"}</T>Subscribe<T c="cq">{"</"}</T>
            <T c="cn">Button</T>
            <T c="cq">{">"}</T>
          </code>
        </pre>
      </div>

      <div className="flex flex-col items-start justify-center gap-5" role="group" aria-label="What the code draws">
        <Input type="email" placeholder="you@example.com" seed="api-input" className="max-w-xs" />
        <Label>
          <Checkbox defaultChecked seed="api-check" />
          Send me the changelog
        </Label>
        <Button seed="subscribe">Subscribe</Button>
      </div>

      <figcaption className="grid gap-x-8 gap-y-3 text-ink-2 sm:grid-cols-3 lg:col-span-2">
        {captions.map(({ type, mark, rest }) => (
          <p key={mark}>
            <Annotate type={type} seed={`api-caption-${type}`} className={type === "underline" ? "text-ink" : "mx-1 text-ink"}>
              {mark}
            </Annotate>{" "}
            {rest}
          </p>
        ))}
      </figcaption>
    </figure>
  );
}
