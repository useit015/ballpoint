// Installs the registry into a brand-new Next.js app the way a user would,
// then proves the result compiles and builds:
//   1. build the registry against a local URL and serve public/ on :4400
//   2. create-next-app (same Next version as this repo), `shadcn init` the
//      base item, add and typecheck Badge alone, then add every other item
//   3. render every example on one page, then tsc and next build
//   4. check init left globals.css free of self-referencing variables
// `--serve` keeps the built app running on :4401 for a look in a browser.

import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { papers, pens } from "../registry/themes.ts";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = 4400;
const registryUrl = `http://localhost:${port}`;
const serve = process.argv.includes("--serve");
const work = join(tmpdir(), "ballpoint-install-test");
const app = join(work, "app");
const shadcn = join(repo, "node_modules/shadcn/dist/index.js");
const nextVersion = JSON.parse(readFileSync(join(repo, "package.json"), "utf8")).dependencies.next as string;

// Async on purpose: the registry server below lives in this process, so a
// blocking exec would leave it unable to answer the CLI.
function run(cmd: string, args: string[], cwd: string) {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  return new Promise<void>((resolve, reject) => {
    spawn(cmd, args, { cwd, stdio: "inherit", env: { ...process.env, BALLPOINT_REGISTRY_URL: registryUrl } })
      .on("error", reject)
      .on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args[0]} exited with ${code}`))));
  });
}

// 1. Registry, served the way a host would serve it.
await run("pnpm", ["registry:build"], repo);
const server = createServer((req, res) => {
  const file = join(repo, "public", decodeURIComponent(new URL(req.url ?? "/", registryUrl).pathname));
  if (!file.startsWith(join(repo, "public")) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": "application/json" }).end(readFileSync(file));
});
await new Promise<void>((resolve) => server.listen(port, resolve));

try {
  // 2. A fresh app. Only the scaffold is cached between runs: a cached
  //    node_modules in the temp folder was found missing files, so every run
  //    installs its own (offline from the pnpm store, so it's quick).
  const pristine = join(work, `scaffold-next-${nextVersion}`);
  if (!existsSync(join(pristine, "package.json"))) {
    rmSync(pristine, { recursive: true, force: true });
    mkdirSync(work, { recursive: true });
    await run(
      "pnpm",
      ["dlx", `create-next-app@${nextVersion}`, pristine, "--ts", "--tailwind", "--eslint", "--app", "--no-src-dir",
        "--import-alias", "@/*", "--use-pnpm", "--yes", "--disable-git", "--no-react-compiler", "--skip-install"],
      work,
    );
  }
  rmSync(app, { recursive: true, force: true });
  cpSync(pristine, app, { recursive: true, filter: (src) => !src.includes("/node_modules") });
  await run("pnpm", ["install", "--prefer-offline"], app);

  const registry = JSON.parse(readFileSync(join(repo, "registry.json"), "utf8")) as { items: { name: string; type: string }[] };
  const base = registry.items.find((item) => item.type === "registry:base");
  if (!base) throw new Error("registry.json has no registry:base item");
  await run("node", [shadcn, "init", `${registryUrl}/r/${base.name}.json`, "-y"], app);
  // Check a standalone component before the full set can supply its missing dependencies.
  await run("node", [shadcn, "add", "@ballpoint/badge", "-y"], app);
  writeFileSync(join(app, "app/page.tsx"), 'import { Badge } from "@/components/ui/badge";\n\nexport default function Page() { return <Badge>Installed alone</Badge>; }\n');
  await run("pnpm", ["exec", "next", "typegen"], app);
  await run("pnpm", ["exec", "tsc", "--noEmit"], app);
  const rest = registry.items.filter((item) => !["registry:base", "registry:font", "registry:lib"].includes(item.type));
  await run("node", [shadcn, "add", ...rest.map((item) => `@ballpoint/${item.name}`), "-y"], app);

  // 3. Every example on one page, with registry imports pointed at the installed copies.
  const examples = join(repo, "registry/ballpoint/examples");
  const demos = readdirSync(examples).filter((f) => f.endsWith(".tsx"));
  mkdirSync(join(app, "components/examples"), { recursive: true });
  for (const file of demos) {
    const source = readFileSync(join(examples, file), "utf8")
      .replaceAll("@/registry/ballpoint/ui/", "@/components/ui/")
      .replaceAll("@/registry/ballpoint/lib/", "@/lib/")
      .replaceAll("@/registry/ballpoint/hooks/", "@/hooks/");
    writeFileSync(join(app, "components/examples", file), source);
  }
  const names = demos.map((f) => f.replace(/\.tsx$/, ""));
  const ident = (name: string) => name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
  writeFileSync(
    join(app, "app/page.tsx"),
    `${names.map((n) => `import ${ident(n)} from "@/components/examples/${n}";`).join("\n")}

export default function Page() {
  return (
    <main>
      {[false, true].map((dark) => (
        <section key={String(dark)} className={\`\${dark ? "dark " : ""}flex flex-col gap-12 bg-background p-12 text-foreground\`}>
${names.map((n) => `          <${ident(n)} />`).join("\n")}
        </section>
      ))}
    </main>
  );
}
`,
  );
  // Route types (LayoutProps & co.) first, as `next build` would.
  await run("pnpm", ["exec", "next", "typegen"], app);
  await run("pnpm", ["exec", "tsc", "--noEmit"], app);
  await run("pnpm", ["exec", "next", "build"], app);

  // 4. The stylesheet init wrote should read like one a person wrote, and
  //    the themes added last should be the ones in force.
  const css = readFileSync(join(app, "app/globals.css"), "utf8");
  const lastPen = Object.values(pens).at(-1)!;
  const lastPaper = Object.values(papers).at(-1)!;
  for (const expected of [`--ink: ${lastPen.ink.light}`, `--paper: ${lastPaper.paper.light}`, `--pen-red: ${lastPaper.red.light}`]) {
    if (!css.includes(expected)) throw new Error(`globals.css should have "${expected}" after adding the themes`);
  }
  const selfRefs = [...css.matchAll(/^\s*--([\w-]+):\s*var\(--\1\);/gm)].map((m) => m[1]).filter((n) => n !== "font-sans");
  if (selfRefs.length) throw new Error(`globals.css has self-referencing variables: ${selfRefs.join(", ")}`);

  console.log(`\n✔ Installed ${registry.items.length} items into a fresh Next ${nextVersion} app; tsc and next build pass.\n  ${app}`);

  if (serve) {
    console.log("\nServing on http://localhost:4401 (Ctrl+C to stop)");
    spawn("pnpm", ["exec", "next", "start", "-p", "4401"], { cwd: app, stdio: "inherit" });
  } else {
    server.close();
  }
} catch (error) {
  server.close();
  throw error;
}
