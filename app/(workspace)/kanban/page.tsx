"use client";

import { KanbanBoard } from "@/components/kanban-board";
import {
  ViewSkeleton,
  WorkspaceEmptyState,
} from "@/components/workspace-chrome";
import { useWorkspace } from "@/components/workspace-provider";

export default function KanbanPage() {
  const { isLoaded, sorted, openApplication, moveApplication } = useWorkspace();
  if (!isLoaded) return <ViewSkeleton variant="kanban" />;
  if (!sorted.length) return <WorkspaceEmptyState />;
  return (
    <KanbanBoard
      applications={sorted}
      onOpen={openApplication}
      onMove={moveApplication}
    />
  );
}
