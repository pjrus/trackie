"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { FilterBar } from "@/components/filter-bar";
import { PipelineStrip } from "@/components/pipeline-strip";
import { WorkspaceHeader } from "@/components/workspace-chrome";
import {
  WorkspaceProvider,
  useRememberView,
  useWorkspace,
} from "@/components/workspace-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * View chrome: title, pipeline strip and filters. Kanban and table differ
 * only in header title and whether the strip shows its legend — table keeps
 * the legend since it's the only place stages are named there; kanban's
 * columns already name every stage.
 */
function WorkspaceChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const view = pathname?.startsWith("/table") ? "table" : "kanban";
  useRememberView(view);
  const { filtered } = useWorkspace();
  return (
    <>
      <WorkspaceHeader title={view === "table" ? "Applications" : "Kanban board"} />
      <PipelineStrip applications={filtered} showLegend={view === "table"} />
      <FilterBar />
      <main className="pb-12">{children}</main>
    </>
  );
}

/**
 * Shell shared by every workspace view: the sidebar and the stored
 * applications, filters and sort order, plus the view chrome derived from
 * the current route.
 */
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={350}>
      <WorkspaceProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="min-w-0">
            <WorkspaceChrome>{children}</WorkspaceChrome>
          </SidebarInset>
        </SidebarProvider>
      </WorkspaceProvider>
    </TooltipProvider>
  );
}
