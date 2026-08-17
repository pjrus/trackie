"use client";

import { Download, HelpCircle, KanbanSquare, List, Plus, Settings } from "lucide-react";
import type { Application, ViewMode } from "@/lib/types";
import { TrackieLogo } from "@/components/trackie-logo";
import { ImportExport } from "@/components/import-export";
import { HelpDialog } from "@/components/help-dialog";
import { SettingsPanel } from "@/components/settings-panel";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({
  view,
  onViewChange,
  applications,
  onImport,
  notify,
  theme,
  setTheme,
  onNewApplication,
}: {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  applications: Application[];
  onImport: (apps: Application[]) => void;
  notify: (message: string) => void;
  theme?: string;
  setTheme: (theme: string) => void;
  onNewApplication: () => void;
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <TrackieLogo showWordmark className="group-data-[collapsible=icon]:[&>span]:hidden" />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onNewApplication} tooltip="New application">
              <Plus />
              <span>New application</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={view === "kanban"}
                  onClick={() => onViewChange("kanban")}
                  tooltip="Kanban"
                >
                  <KanbanSquare />
                  <span>Kanban</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={view === "table"}
                  onClick={() => onViewChange("table")}
                  tooltip="Table"
                >
                  <List />
                  <span>Table</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ImportExport
              applications={applications}
              onImport={onImport}
              notify={notify}
              trigger={
                <SidebarMenuButton tooltip="Import / Export">
                  <Download />
                  <span>Import / Export</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <HelpDialog
              trigger={
                <SidebarMenuButton tooltip="Guide & help">
                  <HelpCircle />
                  <span>Guide & help</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SettingsPanel
              theme={theme}
              setTheme={setTheme}
              trigger={
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
