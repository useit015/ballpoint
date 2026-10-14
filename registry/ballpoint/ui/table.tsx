import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { inkRules } from "@/registry/ballpoint/lib/ink";
import { hashSeed, verticalStroke } from "@/registry/ballpoint/lib/ink-sketch";

// Rows are ruled off by hand: each row's ::after is painted in ink and
// masked by one of three drawn lines, so neighbouring rules differ and no
// row needs its own SVG. Column rules are the same trick turned upright.
const rule =
  "relative after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[2.5px] after:h-[5px] after:bg-current after:[mask-image:var(--ink-rule-1)] after:[mask-size:100%_100%] after:[mask-repeat:no-repeat] nth-[3n+2]:after:[mask-image:var(--ink-rule-2)] nth-[3n]:after:[mask-image:var(--ink-rule-3)]";

const inkColumns: CSSProperties = Object.fromEntries(
  [1, 2, 3].map((n) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-1 0 6 100' preserveAspectRatio='none'><path d='${verticalStroke(hashSeed(`ink-col-${n}`), 100)}' fill='none' stroke='black' stroke-width='1.3' stroke-linecap='round'/></svg>`;
    return [`--ink-col-${n}`, `url("data:image/svg+xml,${encodeURIComponent(svg)}")`];
  }),
);

// With `columns`, every cell but the first in a row gets a rule down its left
// side, a different drawn line for each of three columns in turn.
const cols = "group-data-columns/table:not-first:before:pointer-events-none group-data-columns/table:not-first:before:absolute group-data-columns/table:not-first:before:inset-y-1.5 group-data-columns/table:not-first:before:left-0 group-data-columns/table:not-first:before:w-1 group-data-columns/table:not-first:before:bg-ink-4 group-data-columns/table:not-first:before:content-[''] group-data-columns/table:not-first:before:[mask-image:var(--ink-col-1)] group-data-columns/table:not-first:before:[mask-size:100%_100%] group-data-columns/table:nth-[3n+1]:before:[mask-image:var(--ink-col-2)] group-data-columns/table:nth-[3n]:before:[mask-image:var(--ink-col-3)]";

// A hatched wash for hover, selection and stripes: fine pen lines, not a tint.
const hatch = "repeating-linear-gradient(-50deg, color-mix(in oklab, var(--ink) 15%, transparent) 0 1px, transparent 1px 5px)";

/**
 * Rows ruled off by hand. `variant="striped"` hatches every other row,
 * `columns` rules the columns too, and `size="compact"` tightens the rows.
 */
function Table({
  className,
  style,
  variant = "plain",
  columns = false,
  size = "default",
  ...props
}: ComponentProps<"table"> & {
  /** Plain rows, or every other row hatched. */
  variant?: "plain" | "striped";
  /** Rule between the columns, by hand, the way the rows are. */
  columns?: boolean;
  size?: "default" | "compact";
}) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto" style={{ ...inkRules, ...inkColumns, "--table-hatch": hatch } as CSSProperties}>
      <table
        data-slot="table"
        data-variant={variant}
        data-columns={columns ? "" : undefined}
        data-size={size}
        className={cn(
          "group/table w-full caption-bottom text-base [--table-y:--spacing(3)] data-[size=compact]:[--table-y:--spacing(1.5)]",
          "data-[variant=striped]:[&_tbody_tr:nth-child(even)]:bg-(image:--table-hatch)",
          className,
        )}
        style={style}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:text-ink-line [&_tr]:after:h-[6px]", className)} {...props} />;
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:after:hidden", className)} {...props} />;
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("font-bold [&>tr]:last:after:hidden", className)} {...props} />;
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        rule,
        "text-ink-4 transition-colors hover:bg-(image:--table-hatch) has-aria-expanded:bg-(image:--table-hatch) data-[state=selected]:bg-ink-5/40 data-[state=selected]:bg-(image:--table-hatch)",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A column heading. Give it `sort` (and `onSort`) to make it a button that
 * sorts by the column: the pen's chevron points the way it is sorted, and the
 * cell says so to assistive technology.
 */
function TableHead({ className, children, sort, onSort, ...props }: ComponentProps<"th"> & { sort?: "asc" | "desc" | "none"; onSort?: () => void }) {
  const sortable = sort !== undefined;
  return (
    <th
      data-slot="table-head"
      aria-sort={sort === "asc" ? "ascending" : sort === "desc" ? "descending" : sortable ? "none" : undefined}
      className={cn("relative h-11 px-3 text-left align-middle text-sm font-bold whitespace-nowrap text-ink-2 [&:has([role=checkbox])]:pr-0", cols, className)}
      {...props}
    >
      {sortable ? (
        <button type="button" onClick={onSort} className="group/sort -mx-2 inline-flex items-center gap-1 rounded-sm px-2 py-1 font-[inherit] text-[inherit] transition-colors hover:text-ink [th.text-right_&]:flex-row-reverse">
          {children}
          <span aria-hidden="true" className="relative inline-grid size-4 place-items-center">
            {sort === "none" ? (
              <>
                <InkGlyph name="chevron-up" className="absolute size-3 -translate-y-[4.5px] opacity-40 transition-opacity group-hover/sort:opacity-90" />
                <InkGlyph name="chevron-down" className="absolute size-3 translate-y-[4.5px] opacity-40 transition-opacity group-hover/sort:opacity-90" />
              </>
            ) : (
              <InkGlyph name={sort === "asc" ? "chevron-up" : "chevron-down"} className="size-4 text-ink" />
            )}
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("relative px-3 py-(--table-y) align-middle whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0", cols, className)} {...props} />;
}

/** A row that says there is nothing here, across every column. */
function TableEmpty({ colSpan, className, children = "Nothing here yet." }: { colSpan: number; className?: string; children?: ReactNode }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className={cn("py-10 text-center whitespace-normal text-ink-3", className)}>
        {children}
      </TableCell>
    </TableRow>
  );
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("mt-4 text-sm text-ink-3", className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableEmpty, TableCaption };
