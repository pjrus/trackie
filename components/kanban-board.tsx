"use client";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { ApplicationCard } from "@/components/application-card";
import { Card } from "@/components/ui/display";
import { STAGES, type Application, type Stage } from "@/lib/types";

function Column({
  stage,
  applications,
  onOpen,
  onMove,
}: {
  stage: Stage;
  applications: Application[];
  onOpen: (app: Application) => void;
  onMove: (id: string, stage: Stage) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: stage });
  const headingId = `stage-${stage.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={`w-[315px] shrink-0 rounded-xl border bg-secondary/35 p-3 ${isOver ? "border-primary bg-accent/60" : ""}`}
    >
      <header className="mb-3 flex items-center justify-between px-1 py-1">
        <h2 id={headingId} className="font-display text-lg font-semibold">
          {stage}
        </h2>
        <span className="rounded-full border bg-background px-2 py-0.5 text-xs font-bold text-muted-foreground">
          {applications.length}
        </span>
      </header>
      <div className="min-h-40 space-y-3">
        {applications.length ? (
          applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onOpen={() => onOpen(app)}
              onMove={(next) => onMove(app.id, next)}
            />
          ))
        ) : (
          <div className="grid min-h-32 place-items-center rounded-lg border border-dashed text-xs text-muted-foreground">
            Drop an application here
          </div>
        )}
      </div>
    </section>
  );
}

export function KanbanBoard({
  applications,
  onOpen,
  onMove,
}: {
  applications: Application[];
  onOpen: (app: Application) => void;
  onMove: (id: string, stage: Stage) => void;
}) {
  const [active, setActive] = useState<Application | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const endDrag = ({ active: dragged, over }: DragEndEvent) => {
    setActive(null);
    if (!over) return;
    const app = applications.find((item) => item.id === dragged.id);
    const stage = STAGES.find((item) => item === over.id);
    if (app && stage && stage !== app.stage) onMove(app.id, stage);
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active: dragged }: DragStartEvent) =>
        setActive(applications.find((app) => app.id === dragged.id) ?? null)
      }
      onDragCancel={() => setActive(null)}
      onDragEnd={endDrag}
      accessibility={{
        announcements: {
          onDragStart: ({ active }) =>
            `Picked up application ${String(active.id)}.`,
          onDragOver: ({ over }) =>
            over ? `Over ${String(over.id)} stage.` : "Not over a stage.",
          onDragEnd: ({ over }) =>
            over ? `Moved to ${String(over.id)}.` : "Move cancelled.",
          onDragCancel: () => "Move cancelled.",
        },
      }}
    >
      <div className="overflow-x-auto pb-5">
        <div className="flex min-w-max gap-4 px-4 lg:px-8">
          {STAGES.map((stage) => (
            <Column
              key={stage}
              stage={stage}
              applications={applications.filter((app) => app.stage === stage)}
              onOpen={onOpen}
              onMove={onMove}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {active ? (
          <Card className="w-[290px] p-4 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[.13em] text-muted-foreground">
              {active.company || "Company not set"}
            </p>
            <p className="mt-1 font-display text-lg font-semibold">
              {active.role || "Role not set"}
            </p>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
