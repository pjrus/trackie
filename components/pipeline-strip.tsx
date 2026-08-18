"use client";

import { useMemo } from "react";
import { daysUntilDeadline } from "@/lib/applications";
import { ACTIVE_STAGES } from "@/lib/constants";
import { STAGES, type Application, type Stage } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CLOSED_STAGES,
  LADDER,
  shortStage,
  stageColor,
} from "@/components/stage-ladder";
import { useWorkspace } from "@/components/workspace-provider";

function tally(applications: Application[]) {
  const byStage = new Map<Stage, number>(STAGES.map((stage) => [stage, 0]));
  let inFlight = 0;
  let dueThisWeek = 0;
  let overdue = 0;
  for (const app of applications) {
    byStage.set(app.stage, (byStage.get(app.stage) ?? 0) + 1);
    if (!ACTIVE_STAGES.has(app.stage)) continue;
    inFlight += 1;
    const days = daysUntilDeadline(app.nextStepDeadline);
    if (days === null) continue;
    if (days < 0) overdue += 1;
    else if (days <= 7) dueThisWeek += 1;
  }
  return { byStage, inFlight, dueThisWeek, overdue };
}

function Figure({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "brass" | "rust";
}) {
  const lit = value > 0;
  return (
    <span className="flex items-baseline gap-1.5">
      <span
        aria-hidden
        className={cn(
          "size-1.5 self-center",
          tone === "rust" ? "bg-destructive" : "bg-warning",
          !lit && "opacity-30",
        )}
      />
      <span
        className={cn(
          "font-mono text-sm font-semibold",
          !lit && "text-muted-foreground",
        )}
      >
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </span>
  );
}

/** One stage's share of the bar. Width is the count; colour is the rung. */
function Segment({
  stage,
  count,
  className,
}: {
  stage: Stage;
  count: number;
  className?: string;
}) {
  if (!count) return null;
  return (
    <span
      title={`${stage}: ${count}`}
      style={{ flexGrow: count, background: stageColor(stage) }}
      className={cn("h-full", className)}
    />
  );
}

/**
 * The workspace dashboard: how many applications are moving, what is due, and
 * the shape of the funnel. The bar is proportional, so a top-heavy pipeline
 * looks top-heavy — that reading is the whole point of putting it here.
 */
export function PipelineStrip({
  applications,
  showLegend = false,
}: {
  applications: Application[];
  showLegend?: boolean;
}) {
  const { filters, setFilters } = useWorkspace();
  const { byStage, inFlight, dueThisWeek, overdue } = useMemo(
    () => tally(applications),
    [applications],
  );
  const closed = CLOSED_STAGES.reduce(
    (total, stage) => total + (byStage.get(stage) ?? 0),
    0,
  );

  const toggleStage = (stage: Stage) =>
    setFilters({
      ...filters,
      stages: filters.stages.includes(stage)
        ? filters.stages.filter((item) => item !== stage)
        : [...filters.stages, stage],
    });

  return (
    <section
      aria-label="Pipeline summary"
      className="mx-4 mt-4 rounded-xl border bg-card px-5 py-4 lg:mx-8"
    >
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <p className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold leading-none">
            {inFlight}
          </span>
          <span className="eyebrow text-muted-foreground">in flight</span>
        </p>
        <Figure value={dueThisWeek} label="due this week" tone="brass" />
        <Figure value={overdue} label="overdue" tone="rust" />
        <p className="ml-auto font-mono text-xs text-muted-foreground">
          {applications.length} tracked
        </p>
      </div>

      {/* One proportional bar. The closed stages keep their true share but sit
          after a gap: they are exits from the ladder, not further rungs. An
          empty filter result leaves every segment at zero, so fall back to a
          flat track rather than letting the bar collapse to nothing. */}
      <div aria-hidden className="mt-4 flex h-2 items-stretch gap-1">
        {applications.length ? (
          <>
            {LADDER.map((stage) => (
              <Segment
                key={stage}
                stage={stage}
                count={byStage.get(stage) ?? 0}
              />
            ))}
            {CLOSED_STAGES.map((stage, index) => (
              <Segment
                key={stage}
                stage={stage}
                count={byStage.get(stage) ?? 0}
                className={index === 0 && closed ? "ml-3" : undefined}
              />
            ))}
          </>
        ) : (
          <span className="h-full w-full rounded-full bg-muted" />
        )}
      </div>

      {showLegend ? (
        <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
          {STAGES.map((stage) => {
            const count = byStage.get(stage) ?? 0;
            const selected = filters.stages.includes(stage);
            return (
              <button
                type="button"
                key={stage}
                onClick={() => toggleStage(stage)}
                aria-pressed={selected}
                className={cn(
                  "-mx-1 flex items-center gap-1.5 px-1 py-0.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected ? "text-foreground" : "text-muted-foreground",
                  count ? "hover:text-foreground" : "opacity-45",
                )}
              >
                <span
                  aria-hidden
                  className="size-2"
                  style={{ background: stageColor(stage) }}
                />
                {shortStage(stage)}
                <span className="font-mono font-semibold">{count}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
