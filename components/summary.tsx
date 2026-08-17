import { ACTIVE_STAGES } from "@/lib/constants";
import { STAGES, type Application } from "@/lib/types";

export function Summary({ applications }: { applications: Application[] }) {
  const counts = new Map(STAGES.map((stage) => [stage, 0]));
  let active = 0;
  for (const app of applications) {
    counts.set(app.stage, (counts.get(app.stage) ?? 0) + 1);
    if (ACTIVE_STAGES.has(app.stage)) active += 1;
  }
  return (
    <section
      aria-label="Application summary"
      className="grid gap-px border-y bg-border sm:grid-cols-4 xl:grid-cols-8"
    >
      <div className="bg-primary px-5 py-4 text-primary-foreground sm:col-span-2 xl:col-span-1">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] opacity-75">
          Active
        </p>
        <p className="mt-1 font-display text-3xl font-semibold">{active}</p>
      </div>
      {STAGES.map((stage, index) => (
        <div
          className={`bg-card px-5 py-4 ${index > 2 ? "hidden xl:block" : ""}`}
          key={stage}
        >
          <p className="truncate text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">
            {stage}
          </p>
          <p className="mt-1 font-display text-2xl font-semibold">
            {counts.get(stage)}
          </p>
        </div>
      ))}
    </section>
  );
}
