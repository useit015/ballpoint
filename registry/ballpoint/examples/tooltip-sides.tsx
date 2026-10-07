import { Button } from "@/registry/ballpoint/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/ballpoint/ui/tooltip";

const sides = ["top", "right", "bottom", "left"] as const;

export default function TooltipSides() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-5">
        {sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" className="capitalize" seed={`ts-${side}`} />}>{side}</TooltipTrigger>
            <TooltipContent side={side} seed={`ts-${side}-tip`}>
              On the {side}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
