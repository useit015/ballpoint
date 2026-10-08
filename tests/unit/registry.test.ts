import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import postcss from "postcss";
import { items } from "../../registry/manifest.ts";
import { toObject } from "../../scripts/registry-css.ts";

describe("registry distribution", () => {
  it("preserves all pending drawing rules from the base stylesheet", () => {
    const root = postcss.parse(readFileSync(new URL("../../registry/ballpoint/styles/base.css", import.meta.url), "utf8"));
    const css = toObject(root);
    const layer = css["@layer components"];
    assert.ok(typeof layer === "object");
    const scripting = layer["@media (scripting: enabled)"];
    assert.ok(typeof scripting === "object");
    const expected: Record<string, Record<string, string>> = {};
    root.walkAtRules("media", (media) => {
      if (media.params !== "(scripting: enabled)" || media.parent?.type !== "atrule" || media.parent.name !== "layer") return;
      media.walkRules((rule) => {
        const declarations: Record<string, string> = {};
        rule.walkDecls((declaration) => { declarations[declaration.prop] = declaration.value; });
        expected[rule.selector.replace(/\s+/g, " ")] = declarations;
      });
    });
    assert.equal(Object.keys(expected).length, 3);
    assert.deepEqual(scripting, expected);
  });

  it("merges repeated selectors across nested layers and media queries", () => {
    const css = toObject(postcss.parse(`
      @layer components { @media (width > 20rem) { .control { color: blue; opacity: .5; } } }
      @layer components { @media (width > 20rem) { .control { color: red !important; padding: 1rem; } .label { color: green; } } }
    `));
    assert.deepEqual(css, {
      "@layer components": {
        "@media (width > 20rem)": {
          ".control": { color: "red !important", opacity: ".5", padding: "1rem" },
          ".label": { color: "green" },
        },
      },
    });
  });

  it("declares each registry item's direct package imports", () => {
    for (const item of items) {
      for (const file of item.files ?? []) {
        if (!/\.tsx?$/.test(file.path)) continue;
        const source = readFileSync(new URL(`../../${file.path}`, import.meta.url), "utf8");
        for (const match of source.matchAll(/from\s+["']([^"']+)["']/g)) {
          const specifier = match[1];
          if (specifier.startsWith("@/") || specifier.startsWith(".") || ["react", "react-dom"].includes(specifier)) continue;
          const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
          // The standard utils registry item supplies these two packages.
          const fromUtils = item.registryDependencies?.includes("utils") && ["clsx", "tailwind-merge"].includes(name);
          assert.ok(fromUtils || item.dependencies?.includes(name), `${item.name} must declare ${name} imported by ${file.path}`);
        }
      }
    }
  });
});
