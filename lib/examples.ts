import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import ButtonDemo from "@/registry/ballpoint/examples/button-demo";
import ButtonPens from "@/registry/ballpoint/examples/button-pens";

export const examples: Record<string, ComponentType> = {
  "button-demo": ButtonDemo,
  "button-pens": ButtonPens,
};

/** An example's source, with registry imports written the way they land in an app. */
export function exampleSource(name: string) {
  return readFileSync(join(process.cwd(), "registry/ballpoint/examples", `${name}.tsx`), "utf8")
    .replaceAll("@/registry/ballpoint/ui/", "@/components/ui/")
    .replaceAll("@/registry/ballpoint/lib/", "@/lib/")
    .replaceAll("@/registry/ballpoint/hooks/", "@/hooks/");
}

/** A registry item's own source, as `shadcn add` would write it. */
export function itemSource(path: string) {
  // Scoped to registry/ so the build only traces that folder.
  return readFileSync(join(process.cwd(), "registry", path.replace(/^registry\//, "")), "utf8")
    .replaceAll("@/registry/ballpoint/ui/", "@/components/ui/")
    .replaceAll("@/registry/ballpoint/lib/", "@/lib/")
    .replaceAll("@/registry/ballpoint/hooks/", "@/hooks/");
}
