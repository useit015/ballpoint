import { Button } from "@/registry/ballpoint/ui/button";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { Kbd } from "@/registry/ballpoint/ui/kbd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/ballpoint/ui/tooltip";

const tools = [
  ["pencil", "Write", "W"],
  ["copy", "Duplicate", "D"],
  ["trash", "Tear out", "⌫"],
] as const;

export default function TooltipShortcut() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        {tools.map(([icon, label, key]) => (
          <Tooltip key={label}>
            <TooltipTrigger render={<Button variant="outline" size="icon" aria-label={label} seed={`tsh-${label}`} />}>
              <InkIcon name={icon} />
            </TooltipTrigger>
            <TooltipContent seed={`tsh-${label}-tip`}>
              {label} <Kbd seed={`tsh-${label}-key`} className="ml-1 text-paper">{key}</Kbd>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
