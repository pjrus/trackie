"use client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical, MoreHorizontal } from "lucide-react";
import { deadlineLabel } from "@/lib/applications";
import { STAGES, type Application, type Stage } from "@/lib/types";
import { Badge, Card } from "@/components/ui/display";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ApplicationCard({
  application,
  onOpen,
  onMove,
}: {
  application: Application;
  onOpen: () => void;
  onMove: (stage: Stage) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: application.id, data: { application } });
  const deadline = deadlineLabel(application.nextStepDeadline);
  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`group relative p-4 ${isDragging ? "z-30 opacity-70 shadow-lg" : "hover:border-primary/45"}`}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-0.5 cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
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
          <p className="truncate text-xs font-bold uppercase tracking-[.13em] text-muted-foreground">
            {application.company || "Company not set"}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight">
            {application.role || "Role not set"}
          </h3>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="-mr-2 -mt-2 size-8"
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
      <div className="mt-5 flex items-end justify-between gap-3">
        <Badge
          className={
            application.priority === "High"
              ? "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
              : application.priority === "Low"
                ? "border-green-300 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
                : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
          }
        >
          {application.priority}
        </Badge>
        <span
          className={`flex items-center gap-1 text-xs ${deadline.includes("overdue") ? "font-semibold text-destructive" : "text-muted-foreground"}`}
        >
          <CalendarDays className="size-3.5" />
          {deadline}
        </span>
      </div>
    </Card>
  );
}
