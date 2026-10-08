"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type ComponentProps } from "react";

const query = "(hover: hover) and (pointer: fine)";
const subscribe = (onChange: () => void) => {
  const media = matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/**
 * A Link for long lists of pages (the docs contents, the components index,
 * search results). A plain Link downloads its page as soon as it scrolls
 * into view, so a list of forty pages downloads forty. With a mouse, this
 * one waits for a sign the reader means it: the pointer resting on it, or
 * keyboard focus, which leaves time to fetch the page before the click.
 * A finger lifts too soon after touching for that, so on touch screens it
 * prefetches as it comes into view, like any other Link.
 */
export function IntentLink({ onMouseEnter, onTouchStart, onFocus, ...props }: ComponentProps<typeof Link>) {
  const [meant, setMeant] = useState(false);
  const pointer = useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => true,
  );
  return (
    <Link
      {...props}
      prefetch={meant || !pointer ? null : false}
      onMouseEnter={(e) => {
        setMeant(true);
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        setMeant(true);
        onTouchStart?.(e);
      }}
      onFocus={(e) => {
        setMeant(true);
        onFocus?.(e);
      }}
    />
  );
}
