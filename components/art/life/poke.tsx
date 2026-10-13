"use client";

import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Something in a drawing that answers to a poke: a sun, a boat, a hiker. It
 * is a button for the keyboard and for assistive technology (Enter or Space
 * pokes it), and for the pointer a hit area laid over it, with the pen's
 * dashed ring around that area when it has focus.
 */
export function Poke({
  label,
  onPoke,
  className,
  children,
  ...rest
}: {
  label: string;
  onPoke: (target: SVGGElement) => void;
  className?: string;
  children: ReactNode;
} & Omit<React.SVGProps<SVGGElement>, "onClick" | "onKeyDown" | "children" | "className">) {
  const click = (e: MouseEvent<SVGGElement>) => onPoke(e.currentTarget);
  const key = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    onPoke(e.currentTarget);
  };
  return (
    <g role="button" tabIndex={0} aria-label={label} className={cn("poke", className)} onClick={click} onKeyDown={key} {...rest}>
      {children}
    </g>
  );
}

/** What a pointer can land on: a shape that is there for the hit and not for the eye. */
export function Hit(props: React.SVGProps<SVGRectElement> & { round?: boolean }) {
  const { round, ...rest } = props;
  return <rect className="hit" rx={round ? 999 : 3} {...rest} />;
}
