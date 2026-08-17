"use client";

import { FilterBar } from "@/components/filter-bar";
import { WorkspaceHeader } from "@/components/workspace-chrome";
import { useRememberView } from "@/components/workspace-provider";

/** Board chrome: title and filters, no summary strip. */
export default function KanbanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRememberView("kanban");
  return (
    <>
      <WorkspaceHeader title="Kanban board" />
      <FilterBar />
      <main className="pb-12">{children}</main>
    </>
  );
}
