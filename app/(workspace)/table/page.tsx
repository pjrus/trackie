"use client";

import { TableView } from "@/components/table-view";
import {
  ViewSkeleton,
  WorkspaceEmptyState,
} from "@/components/workspace-chrome";
import { useWorkspace } from "@/components/workspace-provider";

export default function TablePage() {
  const { isLoaded, sorted, sortBy, setSortBy, openApplication } =
    useWorkspace();
  if (!isLoaded) return <ViewSkeleton variant="table" />;
  if (!sorted.length) return <WorkspaceEmptyState />;
  return (
    <TableView
      applications={sorted}
      sortBy={sortBy}
      onSort={setSortBy}
      onOpen={openApplication}
    />
  );
}
