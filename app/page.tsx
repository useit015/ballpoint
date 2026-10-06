import ButtonDemo from "@/registry/ballpoint/examples/button-demo";

export default function Page() {
  return (
    <main>
      {[false, true].map((dark) => (
        <section key={String(dark)} className={`${dark ? "dark " : ""}bg-background px-6 py-12 text-foreground sm:px-12`}>
          <h1 className="mb-8 text-2xl font-bold tracking-wide uppercase">Ballpoint · button</h1>
          <ButtonDemo />
        </section>
      ))}
    </main>
  );
}
