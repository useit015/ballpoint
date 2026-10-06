import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { inkRules } from "@/registry/ballpoint/lib/ink";

// Rows are ruled off by hand: each row's ::after is painted in ink and
// masked by one of three drawn lines, so neighbouring rules differ and no
// row needs its own SVG.
const rule =
  "relative after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[2.5px] after:h-[5px] after:bg-current after:[mask-image:var(--ink-rule-1)] after:[mask-size:100%_100%] after:[mask-repeat:no-repeat] nth-[3n+2]:after:[mask-image:var(--ink-rule-2)] nth-[3n]:after:[mask-image:var(--ink-rule-3)]";

function Table({ className, style, ...props }: ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto" style={inkRules}>
      <table data-slot="table" className={cn("w-full caption-bottom text-base", className)} style={style} {...props} />
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
      className={cn(rule, "text-ink-4 transition-colors hover:bg-ink-5/30 has-aria-expanded:bg-ink-5/30 data-[state=selected]:bg-ink-5/50", className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn("h-11 px-3 text-left align-middle text-sm font-bold whitespace-nowrap text-ink-2 [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("p-3 align-middle whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />;
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("mt-4 text-sm text-ink-3", className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
