"use client";
import {
  DndContext,
  DragOverlay,
  KeyboardCode,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCorners,
  getFirstCollision,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type KeyboardCoordinateGetter,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { useState } from "react";
import {
  ApplicationCard,
  ApplicationCardPreview,
  applicationLabel,
} from "@/components/application-card";
import { cn } from "@/lib/utils";
import { STAGES, type Application, type Stage } from "@/lib/types";

/**
 * Moves the dragged card to the neighbouring column. The sortable coordinate
 * getter cannot be used here: the cards are draggable but not droppable, so it
 * bails out before returning any coordinates.
 */
const columnCoordinateGetter: KeyboardCoordinateGetter = (
  event,
  { context: { active, collisionRect, droppableRects, droppableContainers } },
) => {
  if (event.code !== KeyboardCode.Left && event.code !== KeyboardCode.Right)
    return undefined;
  event.preventDefault();
  if (!active || !collisionRect) return undefined;
  const forward = event.code === KeyboardCode.Right;
  const candidates = droppableContainers.getEnabled().filter((container) => {
    if (container.disabled) return false;
    const rect = droppableRects.get(container.id);
    if (!rect) return false;
    return forward ? rect.left > collisionRect.left : rect.left < collisionRect.left;
  });
  const target = getFirstCollision(
    closestCorners({
      active,
      collisionRect,
      droppableRects,
      droppableContainers: candidates,
      pointerCoordinates: null,
    }),
    "id",
  );
  const rect = target === null ? undefined : droppableRects.get(target);
  return rect ? { x: rect.left, y: collisionRect.top } : undefined;
};

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
      // A fixed width only holds if nothing inside can push past it: min-w-0
      // stops the auto minimum, and the heading truncates rather than growing.
      className="flex w-[300px] min-w-0 shrink-0 flex-col"
    >
      <header className="mb-3">
        <div className="flex min-w-0 items-baseline justify-between gap-2">
          <h2
            id={headingId}
            className="truncate font-display text-[15px] font-semibold"
          >
            {stage}
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {applications.length}
          </span>
        </div>
      </header>
      <div
        // Columns run to the bottom of the viewport whether or not they hold
        // cards: an empty stage is still a place you can drop something.
        className={cn(
          "min-h-[calc(100dvh-19rem)] flex-1 space-y-2.5 rounded-lg p-1 transition-colors",
          isOver && "bg-accent ring-1 ring-primary/40",
        )}
      >
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
          <div className="grid h-24 place-items-center rounded-lg border border-dashed text-xs text-muted-foreground/70">
            Drop here
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
      coordinateGetter: columnCoordinateGetter,
      // The sensor scrolls the board when the next column sits off-centre; a
      // smooth scroll leaves the card behind its own drop target until the
      // animation settles.
      scrollBehavior: "auto",
    }),
  );
  const describe = (id: UniqueIdentifier | undefined) => {
    const app = applications.find((item) => item.id === id);
    return app ? applicationLabel(app) : "application";
  };
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
      // Keep the column rects measured so the first arrow key after picking a
      // card up already has somewhere to move to.
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={({ active: dragged }: DragStartEvent) =>
        setActive(applications.find((app) => app.id === dragged.id) ?? null)
      }
      onDragCancel={() => setActive(null)}
      onDragEnd={endDrag}
      accessibility={{
        announcements: {
          onDragStart: ({ active: dragged }) =>
            `Picked up ${describe(dragged.id)}.`,
          onDragOver: ({ over }) =>
            over ? `Over ${String(over.id)}.` : "Not over a stage.",
          onDragEnd: ({ active: dragged, over }) =>
            over
              ? `Moved ${describe(dragged.id)} to ${String(over.id)}.`
              : "Move cancelled.",
          onDragCancel: ({ active: dragged }) =>
            `Move cancelled. ${describe(dragged.id)} stayed in place.`,
        },
      }}
    >
      {/* While a card is held, arrow keys belong to the drag. The sensor binds
          its own handler a tick after pick-up, and until then the browser would
          scroll the board out from under the card. */}
      <div
        className="overflow-x-auto pb-5"
        onKeyDown={(event) => {
          if (active && (event.key === "ArrowLeft" || event.key === "ArrowRight"))
            event.preventDefault();
        }}
      >
        <div className="flex min-w-max items-stretch gap-5 px-4 lg:px-8">
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
      <DragOverlay dropAnimation={null}>
        {active ? <ApplicationCardPreview application={active} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
