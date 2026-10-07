"use client";

import { HatchGrid, type HatchGridDay } from "@/registry/ballpoint/ui/hatch-grid";

// Twelve weeks of pages written: explicit levels, plus a custom hover line.
const pages = [0, 2, 5, 3, 0, 0, 1, 4, 6, 2, 0, 3, 1, 0, 7, 8, 2, 0, 0, 1, 3, 5, 0, 0];
const days: HatchGridDay[] = Array.from({ length: 84 }, (_, i) => {
  const count = pages[(i * 7) % pages.length] ?? 0;
  return {
    date: new Date(Date.UTC(2026, 6, 13 + i)).toISOString().slice(0, 10),
    count,
    level: count === 0 ? 0 : count < 3 ? 1 : count < 5 ? 2 : count < 7 ? 3 : 4,
  };
});

export default function HatchGridCustom() {
  return (
    <HatchGrid
      data={days}
      today="2026-10-03"
      unit={["page", "pages"]}
      label={(day) => (day.count === 0 ? `A day off, ${day.date}` : `${day.count} written on ${day.date}`)}
      summary="Pages written over twelve weeks"
    />
  );
}
