import { Button } from "@/registry/ballpoint/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/ballpoint/ui/tooltip";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-5">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" seed="tooltip-open" />}>Hover me</TooltipTrigger>
          <TooltipContent seed="tooltip">Saved to your notebook</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Add a page" seed="tooltip-icon" />}>
            <InkGlyph name="plus" />
          </TooltipTrigger>
          <TooltipContent side="right" seed="tooltip-right">
            Add a page
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
