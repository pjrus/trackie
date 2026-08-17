"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { WorkspaceProvider } from "@/components/workspace-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Shell shared by every workspace view: the sidebar and the stored
 * applications, filters and sort order. Each view supplies its own header and
 * body through its own nested layout.
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
          <SidebarInset className="min-w-0">{children}</SidebarInset>
        </SidebarProvider>
      </WorkspaceProvider>
    </TooltipProvider>
  );
}
