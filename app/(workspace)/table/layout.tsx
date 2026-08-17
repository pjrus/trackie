"use client";

import { FilterBar } from "@/components/filter-bar";
import { Summary } from "@/components/summary";
import { WorkspaceHeader } from "@/components/workspace-chrome";
import {
  useRememberView,
  useWorkspace,
} from "@/components/workspace-provider";

/** Table chrome: title, the stage summary strip, then filters. */
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
      <Summary applications={filtered} />
      <FilterBar />
      <main className="pb-12">{children}</main>
    </>
  );
}
