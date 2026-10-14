import { createRng, hashSeed } from "@/registry/ballpoint/lib/ink-sketch";
import { HatchGrid, type HatchGridDay } from "@/registry/ballpoint/ui/hatch-grid";

// Three made-up habits over the same half-year, each with its own rhythm.
const habits = [
  { name: "Write a page", chance: 0.8, peak: 4, unit: "page" },
  { name: "Draw something", chance: 0.4, peak: 3, unit: "drawing" },
  { name: "Read in bed", chance: 0.6, peak: 2, unit: ["chapter", "chapters"] as [string, string] },
];

function year(name: string, chance: number, peak: number): HatchGridDay[] {
  const r = createRng(hashSeed(name));
  return Array.from({ length: 182 }, (_, i) => {
    const date = new Date(Date.UTC(2026, 3, 1 + i)).toISOString().slice(0, 10);
    return { date, count: r() < chance ? 1 + Math.floor(r() ** 2 * peak) : 0 };
  });
}

export default function HatchGridHabits() {
  return (
    <div className="flex w-full flex-col gap-8">
      {habits.map(({ name, chance, peak, unit }) => {
        const data = year(name, chance, peak);
        const total = data.filter((d) => d.date <= "2026-09-30").reduce((n, d) => n + d.count, 0);
        return (
          <div key={name} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="font-bold">{name}</span>
              <span className="text-sm text-ink-3 tabular-nums">{total} since April</span>
            </div>
            <HatchGrid data={data} today="2026-09-30" unit={unit} summary={`${name}: ${total} since April`} />
          </div>
        );
      })}
    </div>
  );
}
