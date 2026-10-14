import { Button } from "@/registry/ballpoint/ui/button";
import { InkIcon, type IconName } from "@/registry/ballpoint/ui/ink-icons";
import { Kbd } from "@/registry/ballpoint/ui/kbd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/ballpoint/ui/tooltip";

const tools: [IconName, string, string][] = [
  ["pen", "Pen", "P"],
  ["eraser", "Eraser", "E"],
  ["ruler", "Ruler", "R"],
  ["scissors", "Cut", "X"],
  ["undo", "Undo", "⌘Z"],
];

export default function TooltipToolbar() {
  return (
    <TooltipProvider delay={300}>
      <div role="toolbar" aria-label="Tools" className="flex gap-1">
        {tools.map(([icon, name, key]) => (
          <Tooltip key={name}>
            <TooltipTrigger render={<Button variant="ghost" size="icon" seed={`tt-${name}`} />}>
              <InkIcon name={icon} />
              <span className="sr-only">{name}</span>
            </TooltipTrigger>
            <TooltipContent seed={`tt-c-${name}`}>
              {name} <Kbd className="ml-1">{key}</Kbd>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
