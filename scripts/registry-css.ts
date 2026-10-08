import type { ChildNode, Container } from "postcss";

export type CssObject = { [key: string]: string | CssObject };

export function toObject(node: Container): CssObject {
  const out: CssObject = {};
  node.each((child) => add(out, child));
  return out;
}

export function add(out: CssObject, child: ChildNode) {
  if (child.type === "comment") return;
  if (child.type === "decl") {
    out[child.prop] = child.important ? `${child.value} !important` : child.value;
  } else if (child.type === "rule") {
    const selector = child.selector.replace(/\s+/g, " ");
    out[selector] = merge(out[selector], toObject(child));
  } else if (child.type === "atrule") {
    const key = `@${child.name}${child.params ? ` ${child.params}` : ""}`;
    out[key] = merge(out[key], child.nodes ? toObject(child) : {});
  }
}

function merge(existing: string | CssObject | undefined, next: CssObject): CssObject {
  if (typeof existing !== "object") return next;
  const out = { ...existing };
  for (const [key, value] of Object.entries(next)) {
    out[key] = typeof value === "object" ? merge(out[key], value) : value;
  }
  return out;
}
