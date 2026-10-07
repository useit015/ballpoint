import { createRng, hashSeed } from "@/registry/ballpoint/lib/ink-sketch";
import { HatchGrid, type HatchGridDay } from "@/registry/ballpoint/ui/hatch-grid";

// A made-up year of commits: busier midweek, with a few long weekends off.
const r = createRng(hashSeed("hatch-grid-demo"));
const days: HatchGridDay[] = Array.from({ length: 365 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  const busy = weekday === 0 || weekday === 6 ? 0.25 : 0.8;
  return { date, count: r() < busy ? Math.round(r() ** 2 * 12) : 0 };
});
const total = days.filter((d) => d.date <= "2026-10-06").reduce((sum, d) => sum + d.count, 0);

export default function HatchGridDemo() {
  return (
    <div className="flex w-full max-w-full flex-col gap-2">
      <HatchGrid
        data={days}
        today="2026-10-06"
        unit="commit"
        summary={`${total} commits in 2026`}
      />
      <p className="text-sm text-ink-3">
        <span className="font-bold text-ink">{total}</span> commits in 2026
      </p>
    </div>
  );
}
