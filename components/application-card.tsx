"use client";
import { useDraggable } from "@dnd-kit/core";
import { CalendarDays, GripVertical, MoreHorizontal } from "lucide-react";
import { daysUntilDeadline, deadlineLabel } from "@/lib/applications";
import { STAGES, type Application, type Priority, type Stage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge, Card } from "@/components/ui/display";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const priorityClass = (priority: Priority) =>
  priority === "High"
    ? "border-destructive/25 bg-destructive/10 text-destructive"
    : priority === "Low"
      ? "border-success/25 bg-success/10 text-success"
      : "border-warning/25 bg-warning/10 text-warning";

export const applicationLabel = (application: Application) =>
  `${application.role || "Role not set"} at ${application.company || "Company not set"}`;

function Heading({ application }: { application: Application }) {
  return (
    <>
      <p className="truncate text-xs font-bold uppercase tracking-[.13em] text-muted-foreground">
        {application.company || "Company not set"}
      </p>
      <h3 className="mt-1 font-display text-lg font-semibold leading-tight">
        {application.role || "Role not set"}
      </h3>
    </>
  );
}

function Meta({ application }: { application: Application }) {
  const days = daysUntilDeadline(application.nextStepDeadline);
  return (
    <div className="mt-5 flex items-end justify-between gap-3">
      <Badge className={priorityClass(application.priority)}>
        {application.priority}
      </Badge>
      <span
        className={cn(
          "flex items-center gap-1 text-xs",
          days !== null && days < 0
            ? "font-semibold text-destructive"
            : "text-muted-foreground",
        )}
      >
        <CalendarDays className="size-3.5 shrink-0" />
        {deadlineLabel(application.nextStepDeadline)}
      </span>
    </div>
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
        "group relative p-4",
        isDragging ? "opacity-40" : "hover:border-primary/45",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
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
              className="-mr-2 -mt-2 size-8 shrink-0"
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
      className="h-full w-full cursor-grabbing border-primary p-4 shadow-lg"
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0 p-1 text-muted-foreground">
          <GripVertical className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <Heading application={application} />
        </div>
        <span className="-mr-2 -mt-2 size-8 shrink-0" />
      </div>
      <Meta application={application} />
    </Card>
  );
}
