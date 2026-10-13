import type { CSSProperties } from "react";

/**
 * Words written in one after another, from `at` ms, about as fast as a hand
 * writes them. Each is its own element (the pen's soft edge sweeps across
 * it, .ink-write in base.css), so they wrap like words. Without scripts, or
 * under reduced motion, they are simply there.
 */
export function written(text: string, at = 0) {
  let t = at;
  return text.split(" ").flatMap((word, i) => {
    const d = 90 + word.length * 34;
    const style = { "--ink-d": `${d}ms`, "--ink-dd": `${Math.round(t)}ms` } as CSSProperties;
    t += d * 0.75 + 40;
    return [
      i > 0 ? " " : null,
      <span key={i} className="ink-write inline-block" style={style}>
        {word}
      </span>,
    ];
  });
}

/** How long `written(text)` takes, in ms. */
export function writing(text: string) {
  return text.split(" ").reduce((t, word) => t + (90 + word.length * 34) * 0.75 + 40, 0);
}
