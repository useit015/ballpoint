"use client";

import { useMemo, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { InkProvider, type InkFill, type InkShadow, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";
import { Separator } from "@/registry/ballpoint/ui/separator";
import { Slider } from "@/registry/ballpoint/ui/slider";
import { Switch } from "@/registry/ballpoint/ui/switch";
import { Textarea } from "@/registry/ballpoint/ui/textarea";
import { InstallCommand } from "@/components/install-command";
import { PaperSwatch } from "@/components/paper-swatch";
import { PlainCode } from "@/components/plain-code";
import { contrast, mix, oklch, over, parseColor } from "@/lib/color";
import { paperTile } from "@/lib/paper";
import { cn } from "@/lib/utils";
import { papers, pens, type PaperName, type PenName } from "@/registry/themes";

type Settings = {
  pen: PenName | "custom";
  /** Hue of the custom pen. */
  hue: number;
  paper: PaperName;
  /** null: follow the site's own theme. */
  night: boolean | null;
  roughness: number;
  /** 0: each component's own default. */
  passes: 0 | 1 | 2 | 3;
  radius: "0" | "6" | "12" | "full";
  corners: "crossed" | "joined";
  fill: "auto" | InkFill;
  shadow: InkShadow;
  weight: number;
  speed: number;
};

const defaults: Settings = {
  pen: "blue",
  hue: 200,
  paper: "cream",
  night: null,
  roughness: 1,
  passes: 0,
  radius: "0",
  corners: "crossed",
  fill: "auto",
  shadow: "hatch",
  weight: 1,
  speed: 1,
};

// A custom pen keeps the ballpoint's weight and changes only its hue.
const customInk = (hue: number) => ({ light: oklch(0.4, 0.14, hue), dark: oklch(0.88, 0.06, hue) });

function siteIsDark() {
  return document.documentElement.classList.contains("dark");
}

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function Customizer() {
  const [s, setS] = useState(defaults);
  const [salt, setSalt] = useState(0);
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setS((prev) => ({ ...prev, [key]: value }));
  const siteDark = useSyncExternalStore(subscribeTheme, siteIsDark, () => false);
  const night = s.night ?? siteDark;
  const mode = night ? "dark" : "light";

  const colours = useMemo(() => {
    const ink = s.pen === "custom" ? customInk(s.hue) : pens[s.pen].ink;
    const paper = papers[s.paper];
    return { ink: ink[mode], paper: paper.paper[mode], red: paper.red[mode], fill: mode === "dark" ? 0.72 : 0.78, inks: ink };
  }, [s.pen, s.hue, s.paper, mode]);

  const pen: Pen = {
    roughness: s.roughness,
    passes: s.passes || undefined,
    radius: s.radius === "full" ? "full" : Number(s.radius),
    corners: s.corners,
    fill: s.fill === "auto" ? undefined : s.fill,
    shadow: s.shadow,
    weight: s.weight,
    speed: s.speed,
  };

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
      <aside className="flex w-full shrink-0 flex-col gap-7 lg:sticky lg:top-6 lg:w-80">
        <Group title="Pen">
          <RadioGroup value={s.pen} onValueChange={(v) => set("pen", v as Settings["pen"])} aria-label="Pen" className="gap-2">
            {(Object.keys(pens) as PenName[]).map((name) => (
              <Swatched key={name} value={name} label={pens[name].title} ink={pens[name].ink[mode]} />
            ))}
            <Swatched value="custom" label="Your own" ink={customInk(s.hue)[mode]} />
          </RadioGroup>
          {s.pen === "custom" && (
            <Range label="Hue" value={s.hue} min={0} max={359} step={1} onChange={(v) => set("hue", v)} format={(v) => `${v}°`} />
          )}
        </Group>

        <Group title="Paper">
          <RadioGroup value={s.paper} onValueChange={(v) => set("paper", v as PaperName)} aria-label="Paper" className="grid-cols-3 gap-2">
            {(Object.keys(papers) as PaperName[]).map((name) => (
              <Label key={name} className="flex-col items-start gap-1.5">
                <PaperSwatch paper={name} mode={mode} className="h-8 w-full" />
                <span className="flex items-center gap-2">
                  <RadioGroupItem value={name} seed={`paper-${name}`} />
                  {papers[name].title}
                </span>
              </Label>
            ))}
          </RadioGroup>
          <Label>
            <Switch checked={night} onCheckedChange={(v) => set("night", v)} size="sm" seed="night" />
            Night
          </Label>
        </Group>

        <Group title="Hand">
          <Range label="Roughness" value={s.roughness} min={0} max={2} step={0.1} onChange={(v) => set("roughness", v)} />
          <Range label="Line weight" value={s.weight} min={0.5} max={2} step={0.1} onChange={(v) => set("weight", v)} format={(v) => `${v}×`} />
          <Range label="Drawing speed" value={s.speed} min={0.25} max={3} step={0.25} onChange={(v) => set("speed", v)} format={(v) => `${v}×`} />
          <Choice
            label="Passes"
            value={String(s.passes)}
            onChange={(v) => set("passes", Number(v) as Settings["passes"])}
            options={[
              ["0", "Auto"],
              ["1", "1"],
              ["2", "2"],
              ["3", "3"],
            ]}
          />
        </Group>

        <Group title="Shape">
          <Choice
            label="Corners"
            value={s.radius}
            onChange={(v) => set("radius", v as Settings["radius"])}
            options={[
              ["0", "Square"],
              ["6", "Soft"],
              ["12", "Round"],
              ["full", "Pill"],
            ]}
          />
          {s.radius === "0" && (
            <Choice
              label="Square corners"
              value={s.corners}
              onChange={(v) => set("corners", v as Settings["corners"])}
              options={[
                ["crossed", "Crossed"],
                ["joined", "Joined"],
              ]}
            />
          )}
          <Choice
            label="Fill"
            value={s.fill}
            onChange={(v) => set("fill", v as Settings["fill"])}
            options={[
              ["auto", "Auto"],
              ["shade", "Shade"],
              ["hatch", "Hatch"],
              ["scribble", "Scribble"],
              ["flat", "Flat"],
            ]}
          />
          <Choice
            label="Shadow"
            value={s.shadow}
            onChange={(v) => set("shadow", v as InkShadow)}
            options={[
              ["hatch", "Hatched"],
              ["solid", "Solid"],
              ["none", "None"],
            ]}
          />
        </Group>

        <div className="flex gap-4">
          <Button variant="outline" size="sm" seed="redraw" onClick={() => setSalt((x) => x + 1)}>
            Redraw
          </Button>
          <Button variant="ghost" size="sm" seed="reset" onClick={() => setS(defaults)}>
            Reset
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-10">
        <section
          data-ink-scope=""
          data-customizer-preview=""
          aria-label="Preview"
          className={cn("paper-sheet relative px-5 py-8 text-foreground sm:px-8", night && "dark")}
          style={
            {
              "--ink": colours.ink,
              "--paper": colours.paper,
              "--pen-red": colours.red,
              "--paper-tile": paperTile(s.paper, mode),
              borderRadius: "var(--hand-radius)",
            } as CSSProperties
          }
        >
          <InkProvider key={salt} salt={salt || undefined} {...pen}>
            <Sheet />
          </InkProvider>
        </section>

        <Readout ink={colours.ink} paper={colours.paper} red={colours.red} fill={colours.fill} />
        <Output s={s} inks={colours.inks} />
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-bold tracking-wider text-ink-3 uppercase">{title}</h2>
      {children}
    </section>
  );
}

function Swatched({ value, label, ink }: { value: string; label: string; ink: string }) {
  return (
    <Label>
      <RadioGroupItem value={value} seed={`pen-${value}`} />
      <svg aria-hidden="true" viewBox="0 0 40 10" className="h-3 w-10 overflow-visible" style={{ color: ink }}>
        <path d="M1 7C8 2 13 9 20 5S32 2 39 4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
      </svg>
      {label}
    </Label>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => String(v),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between text-base">
        <span>{label}</span>
        <span className="font-mono text-sm text-ink-3">{format(value)}</span>
      </div>
      <Slider value={value} min={min} max={max} step={step} onValueChange={(v) => onChange(v as number)} aria-label={label} seed={`range-${label}`} draw="none" />
    </div>
  );
}

function Choice({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return (
    <div className="flex flex-col gap-2">
      <span id={`choice-${label}`}>{label}</span>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as string)} aria-labelledby={`choice-${label}`} className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map(([v, text]) => (
          <Label key={v} className="text-base">
            <RadioGroupItem value={v} seed={`${label}-${v}`} draw="none" />
            {text}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}

/** A little of everything, so the pen can be judged on real parts. */
function Sheet() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-5">
        <Button seed="s-solid">Book a call</Button>
        <Button variant="outline" seed="s-outline">
          Copy email
        </Button>
        <Button variant="secondary" seed="s-secondary">
          Secondary
        </Button>
        <Button variant="ghost" seed="s-ghost">
          Ghost
        </Button>
        <Button variant="destructive" seed="s-destructive">
          Delete
        </Button>
        <Button variant="link" seed="s-link">
          A link
        </Button>
      </div>
      <Separator seed="s-sep" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="s-email">Email</FieldLabel>
            <Input id="s-email" type="email" placeholder="you@example.com" seed="s-email" />
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="s-code">Invite code</FieldLabel>
            <Input id="s-code" aria-invalid defaultValue="NOPE-123" seed="s-code" />
            <FieldDescription className="text-destructive">That code has already been used.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="s-notes">Notes</FieldLabel>
            <Textarea id="s-notes" variant="lined" rows={3} defaultValue="Buy ink." seed="s-notes" />
          </Field>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Label>
              <Checkbox defaultChecked seed="s-check-1" />
              Paper
            </Label>
            <Label>
              <Checkbox seed="s-check-2" />
              A steady hand
            </Label>
          </div>
          <RadioGroup defaultValue="morning" aria-label="Time" className="flex gap-5">
            <Label>
              <RadioGroupItem value="morning" seed="s-radio-1" />
              Morning
            </Label>
            <Label>
              <RadioGroupItem value="evening" seed="s-radio-2" />
              Evening
            </Label>
          </RadioGroup>
          <Label>
            <Switch defaultChecked seed="s-switch" />
            Draw things in
          </Label>
          <Slider defaultValue={[25, 70]} aria-label="Range" seed="s-slider" />
          <RadioGroup defaultValue="a" aria-label="Plan" className="grid-cols-2 gap-4">
            {[
              ["a", "Notebook", "Lined, cream."],
              ["b", "Sketchbook", "Plain, heavy."],
            ].map(([v, title, d]) => (
              <FieldLabel key={v}>
                <Field orientation="horizontal">
                  <RadioGroupItem value={v} seed={`s-card-${v}`} />
                  <FieldContent>
                    <FieldTitle>{title}</FieldTitle>
                    <FieldDescription>{d}</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}

/** The same checks as the contrast gate, live, for the pen and paper in view. */
function Readout({ ink, paper, red, fill }: { ink: string; paper: string; red: string; fill: number }) {
  const rows = useMemo(() => {
    const i = parseColor(ink);
    const p = parseColor(paper);
    return [
      ["Text", contrast(i, p), 4.5],
      ["Muted text", contrast(mix(i, 0.77, p), p), 4.5],
      ["Control borders", contrast(mix(i, 0.6, p), p), 3],
      ["Errors (red pen)", contrast(parseColor(red), p), 4.5],
      ["Labels on solid buttons", contrast(p, over(i, fill, p)), 4.5],
    ] as const;
  }, [ink, paper, red, fill]);
  const failing = rows.filter(([, r, min]) => r < min);
  return (
    <section aria-labelledby="readout" className="flex flex-col gap-3">
      <h2 id="readout" className="text-sm font-bold tracking-wider text-ink-3 uppercase">
        Contrast
      </h2>
      <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {rows.map(([what, ratio, min]) => (
          <li key={what} className={cn("flex justify-between gap-4", ratio < min && "text-destructive")}>
            <span>{what}</span>
            <span className="font-mono text-sm leading-7">
              {ratio.toFixed(2)} {ratio >= min ? "✓" : `✗ needs ${min}`}
            </span>
          </li>
        ))}
      </ul>
      <p role="status" className="text-sm text-ink-3">
        {failing.length ? "This pen is too light on this paper for the WCAG ratios above; try a darker hue or another paper." : "Every pair passes WCAG AA."}
      </p>
    </section>
  );
}

function Output({ s, inks }: { s: Settings; inks: { light: string; dark: string } }) {
  const props = [
    s.roughness !== 1 && `roughness={${s.roughness}}`,
    s.passes && `passes={${s.passes}}`,
    s.radius !== "0" && (s.radius === "full" ? `radius="full"` : `radius={${s.radius}}`),
    s.radius === "0" && s.corners !== "crossed" && `corners="${s.corners}"`,
    s.fill !== "auto" && `fill="${s.fill}"`,
    s.shadow !== "hatch" && `shadow="${s.shadow}"`,
    s.weight !== 1 && `weight={${s.weight}}`,
    s.speed !== 1 && `speed={${s.speed}}`,
  ].filter(Boolean) as string[];
  const themes = [s.pen !== "blue" && s.pen !== "custom" && `@ballpoint/pen-${s.pen}`, s.paper !== "cream" && `@ballpoint/paper-${s.paper}`].filter(
    Boolean,
  ) as string[];
  const open = props.length > 3 ? `<InkProvider\n  ${props.join("\n  ")}\n>` : `<InkProvider ${props.join(" ")}>`;

  return (
    <section aria-labelledby="output" className="flex flex-col gap-5">
      <h2 id="output" className="text-sm font-bold tracking-wider text-ink-3 uppercase">
        Use it
      </h2>
      {themes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-ink-2">Install the pen and paper:</p>
          <InstallCommand what={`add ${themes.join(" ")}`} />
        </div>
      )}
      {s.pen === "custom" && (
        <PlainCode title="app/globals.css" code={`:root {\n  --ink: ${inks.light};\n}\n\n.dark {\n  --ink: ${inks.dark};\n}`} />
      )}
      {props.length > 0 ? (
        <PlainCode
          title="app/layout.tsx"
          code={`import { InkProvider } from "@/hooks/use-ink-box"\n\n${open}\n  {children}\n</InkProvider>`}
        />
      ) : (
        !themes.length && s.pen !== "custom" && <p className="text-ink-2">These are the defaults: nothing to add.</p>
      )}
    </section>
  );
}
