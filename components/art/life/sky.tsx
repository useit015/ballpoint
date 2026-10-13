"use client";

import { Hit, Poke } from "@/components/art/life/poke";
import { setNight, useNight } from "@/components/home/night";

/**
 * The sun by day and the moon by night: press it and the page turns to the
 * other, the ink spreading out from it. Over it, the rays turn (`data-sky`
 * on the picture; art.css has the rest).
 */
export function SkyPoke({ x, y }: { x: number; y: number }) {
  const night = useNight();
  const art = (e: { currentTarget: Element }) => e.currentTarget.closest(".art");
  return (
    <Poke
      label={night ? "The moon: turn the page to day" : "The sun: turn the page to night"}
      onPoke={(el) => void setNight(!night, el)}
      className="sky-poke"
      onPointerEnter={(e) => art(e)?.setAttribute("data-sky", "")}
      onPointerLeave={(e) => art(e)?.removeAttribute("data-sky")}
      onFocus={(e) => art(e)?.setAttribute("data-sky", "")}
      onBlur={(e) => art(e)?.removeAttribute("data-sky")}
    >
      <Hit x={x - 27} y={y - 27} width={54} height={54} round />
    </Poke>
  );
}
