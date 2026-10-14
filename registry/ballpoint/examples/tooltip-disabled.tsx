import { Button } from "@/registry/ballpoint/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/ballpoint/ui/tooltip";

// A disabled button gets no pointer events, so the tooltip hangs off a wrapper that does.
export default function TooltipDisabled() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<span tabIndex={0} className="inline-flex rounded-sm" />}>
          <Button disabled seed="td-publish" className="pointer-events-none">
            Publish
          </Button>
        </TooltipTrigger>
        <TooltipContent seed="td-tip">Write at least one page first</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
