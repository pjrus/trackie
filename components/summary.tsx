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
      className="mx-4 mt-4 mb-4 grid divide-x divide-border overflow-hidden rounded-lg border bg-card sm:grid-cols-4 xl:grid-cols-8 lg:mx-8"
    >
      <div className="px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-primary">
          Active
        </p>
        <p className="text-xl font-semibold text-primary">{active}</p>
      </div>
      {STAGES.map((stage, index) => (
        <div
          className={`px-4 py-2.5 ${index > 2 ? "hidden xl:block" : ""}`}
          key={stage}
        >
          <p className="truncate text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
            {stage}
          </p>
          <p className="text-lg font-semibold">{counts.get(stage)}</p>
        </div>
      ))}
    </section>
  );
}
