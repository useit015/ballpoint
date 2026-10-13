import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";
import { Callout } from "@/components/home/callout";
import { ApiPlayground, type ApiPanel } from "@/components/home/api-playground";
import { highlight } from "@/lib/highlight";
import { install } from "@/lib/install";
import { homepage } from "@/registry/manifest";

const use = `import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Subscribe() {
  return (
    <form className="grid gap-4">
      <Input type="email" placeholder="you@domain.com" />
      <Label>
        <Checkbox defaultChecked /> Send me updates
      </Label>
      <Button>Subscribe</Button>
    </form>
  )
}`;

const add = `${install.pnpm(`init ${homepage}/r/ballpoint.json`)}
${install.pnpm("add @ballpoint/button @ballpoint/input")}`;

const theme = `:root {
  --paper: #ede8df;
  --ink: oklch(0.4 0.185 267);
}

.dark {
  --paper: oklch(0.215 0.038 266);
  --ink: oklch(0.9 0.045 258);
}`;

/** Which part of the form a line of the code makes: the page links the two. */
const parts: [string, string][] = [["<Input", "input"], ["<Checkbox", "checkbox"], ["<Button", "button"]];
const partOf = (text: string) => {
  const hit = parts.find(([tag]) => text.includes(tag));
  return hit ? { "data-for": hit[1] } : undefined;
};

/** "Simple, familiar API": the code beside what it draws. */
export async function Api() {
  const panels: ApiPanel[] = await Promise.all(
    [
      { value: "use", label: "Use it", code: use, lang: "tsx" as const },
      { value: "install", label: "Install", code: add, lang: "bash" as const },
      { value: "theme", label: "Make it yours", code: theme, lang: "css" as const },
    ].map(async ({ lang, ...p }) => ({ ...p, html: await highlight(p.code, lang, p.value === "use" ? partOf : undefined) })),
  );
  return (
    <section aria-labelledby="api" className="home-api">
      <header className="home-head">
        <SectionHeading id="api" underline="double" seed="home-api" className="home-h2">
          Simple, familiar API
        </SectionHeading>
        <p className="home-sub">The code you would write with shadcn/ui, and what it draws.</p>
      </header>
      <ApiPlayground panels={panels}>
        <Callout lines={["Just like shadcn.", "With more soul."]} target="api-code" bend={-0.28} seed="api-callout" delay={200} className="api-callout" />
      </ApiPlayground>
    </section>
  );
}
