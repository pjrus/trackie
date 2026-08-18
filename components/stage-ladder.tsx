import { daysUntilDeadline } from "@/lib/applications";
import { STAGES, type Stage } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The five stages an application climbs through, in order. Rejected and
 * Withdrawn are not later rungs — they are exits — so they sit outside the
 * ladder everywhere it is drawn.
 */
export const LADDER = STAGES.slice(0, 5) as readonly Stage[];
export const CLOSED_STAGES = STAGES.slice(5) as readonly Stage[];

/** Position on the ladder, or null once an application has left it. */
export const rungOf = (stage: Stage) => {
  const index = LADDER.indexOf(stage);
  return index === -1 ? null : index + 1;
};

const STAGE_VARIABLE: Record<Stage, string> = {
  Applied: "var(--stage-applied)",
  "Online Assessment": "var(--stage-assessment)",
  "Phone Screen": "var(--stage-screen)",
  Interview: "var(--stage-interview)",
  Offer: "var(--stage-offer)",
  Rejected: "var(--stage-rejected)",
  Withdrawn: "var(--stage-withdrawn)",
};

export const stageColor = (stage: Stage) => STAGE_VARIABLE[stage];

/** Short forms for tight spaces. Only the two long stage names need one. */
export const shortStage = (stage: Stage) =>
  stage === "Online Assessment"
    ? "Assessment"
    : stage === "Phone Screen"
      ? "Screen"
      : stage;

export type DeadlineTone = "overdue" | "soon" | "scheduled" | "none";

/** How loudly a deadline should speak: past, inside a week, or just noted. */
export function deadlineTone(deadline: string, now = new Date()): DeadlineTone {
  const days = daysUntilDeadline(deadline, now);
  if (days === null) return "none";
  if (days < 0) return "overdue";
  if (days <= 7) return "soon";
  return "scheduled";
}

export const deadlineToneClass: Record<DeadlineTone, string> = {
  overdue: "text-destructive",
  soon: "text-warning",
  scheduled: "text-muted-foreground",
  none: "text-muted-foreground/70",
};

/**
 * The ladder at its smallest: five rungs, filled up to the current stage. An
 * application that has left the ladder shows five hollow rungs, which is the
 * honest picture — no progress is being made either way.
 */
export function StageTrack({
  stage,
  className,
}: {
  stage: Stage;
  className?: string;
}) {
  const rung = rungOf(stage);
  return (
    <span
      className={cn("inline-flex items-center gap-[3px]", className)}
      role="img"
      aria-label={
        rung ? `${stage}, rung ${rung} of ${LADDER.length}` : `${stage}, closed`
      }
    >
      {LADDER.map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-[3px] w-2.5",
            rung === null && "opacity-45",
          )}
          style={{
            background:
              rung !== null && index < rung ? stageColor(stage) : "var(--input)",
          }}
        />
      ))}
    </span>
  );
}
