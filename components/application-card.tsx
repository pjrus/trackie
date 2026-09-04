"use client";
import { useDraggable } from "@dnd-kit/core";
import { CalendarDays, GripVertical, MoreHorizontal } from "lucide-react";
import { deadlineLabel } from "@/lib/applications";
import { STAGES, type Application, type Stage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/display";
import { Button } from "@/components/ui/button";
import {
  deadlineTone,
  deadlineToneClass,
  PRIORITY_DOT,
} from "@/components/stage-ladder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const applicationLabel = (application: Application) =>
  `${application.role || "Role not set"} at ${application.company || "Company not set"}`;

function Heading({ application }: { application: Application }) {
  return (
    <>
      <p className="eyebrow truncate text-muted-foreground">
        {application.company || "Company not set"}
      </p>
      <h3 className="mt-1.5 break-words font-display text-[15px] font-semibold leading-snug">
        {application.role || "Role not set"}
      </h3>
    </>
  );
}

function Meta({ application }: { application: Application }) {
  const tone = deadlineTone(application.nextStepDeadline);
  return (
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          aria-hidden
          className={cn("size-2", PRIORITY_DOT[application.priority])}
        />
        {application.priority}
      </span>
      <span
        className={cn(
          "flex items-center gap-1.5 font-mono text-[11px]",
          deadlineToneClass[tone],
          tone === "overdue" && "font-semibold",
        )}
      >
        <CalendarDays className="size-3.5 shrink-0" />
        {deadlineLabel(application.nextStepDeadline)}
      </span>
    </div>
  );
}

/** A 3px edge is the only place a card raises its voice: red past due, amber inside the week. */
function UrgencyRail({ application }: { application: Application }) {
  const tone = deadlineTone(application.nextStepDeadline);
  if (tone !== "overdue" && tone !== "soon") return null;
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-y-0 left-0 w-[3px]",
        tone === "overdue" ? "bg-destructive" : "bg-warning",
      )}
    />
  );
}

export function ApplicationCard({
  application,
  onOpen,
  onMove,
}: {
  application: Application;
  onOpen: () => void;
  onMove: (stage: Stage) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: application.id,
    data: { application },
  });
  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "group relative px-3.5 py-3 transition-[border-color,box-shadow,translate]",
        isDragging
          ? "opacity-40"
          : "hover:-translate-y-px hover:border-primary/40 hover:shadow-md",
      )}
    >
      <UrgencyRail application={application} />
      <div className="flex items-start gap-1.5">
        <button
          type="button"
          className="-ml-1 mt-0.5 shrink-0 cursor-grab touch-none p-1 text-muted-foreground/45 transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:text-muted-foreground active:cursor-grabbing"
          aria-label={`Move ${application.company || application.role}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Heading application={application} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="-mr-1.5 -mt-1 size-8 shrink-0 text-muted-foreground/60 hover:text-foreground"
              aria-label="Application actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onOpen}>
              Edit application
            </DropdownMenuItem>
            <DropdownMenuLabel>Move to stage</DropdownMenuLabel>
            {STAGES.filter((stage) => stage !== application.stage).map(
              (stage) => (
                <DropdownMenuItem key={stage} onSelect={() => onMove(stage)}>
                  {stage}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Meta application={application} />
    </Card>
  );
}

/** Static copy of the card rendered inside the drag overlay. */
export function ApplicationCardPreview({
  application,
}: {
  application: Application;
}) {
  return (
    <Card
      aria-hidden
      className="relative h-full w-full rotate-1 cursor-grabbing border-primary/60 px-3.5 py-3 shadow-lg"
    >
      <UrgencyRail application={application} />
      <div className="flex items-start gap-1.5">
        <span className="-ml-1 mt-0.5 shrink-0 p-1 text-muted-foreground">
          <GripVertical className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <Heading application={application} />
        </div>
        <span className="-mr-1.5 -mt-1 size-8 shrink-0" />
      </div>
      <Meta application={application} />
    </Card>
  );
}
