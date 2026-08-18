"use client";

import { FilterBar } from "@/components/filter-bar";
import { PipelineStrip } from "@/components/pipeline-strip";
import { WorkspaceHeader } from "@/components/workspace-chrome";
import {
  useRememberView,
  useWorkspace,
} from "@/components/workspace-provider";

/**
 * Board chrome: title, the pipeline strip and filters. The strip runs without
 * its legend here — the columns below already name every stage.
 */
export default function KanbanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRememberView("kanban");
  const { filtered } = useWorkspace();
  return (
    <>
      <WorkspaceHeader title="Kanban board" />
      <PipelineStrip applications={filtered} />
      <FilterBar />
      <main className="pb-12">{children}</main>
    </>
  );
}
