"use client";

import { FilterBar } from "@/components/filter-bar";
import { PipelineStrip } from "@/components/pipeline-strip";
import { WorkspaceHeader } from "@/components/workspace-chrome";
import {
  useRememberView,
  useWorkspace,
} from "@/components/workspace-provider";

/**
 * Table chrome: title, the pipeline strip and filters. The strip keeps its
 * legend here, where it is the only place stages can be picked off by name.
 */
export default function TableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRememberView("table");
  const { filtered } = useWorkspace();
  return (
    <>
      <WorkspaceHeader title="Applications" />
      <PipelineStrip applications={filtered} showLegend />
      <FilterBar />
      <main className="pb-12">{children}</main>
    </>
  );
}
