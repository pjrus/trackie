"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Download, HelpCircle, KanbanSquare, List, Plus, Settings } from "lucide-react";
import { useWorkspace } from "@/components/workspace-provider";
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

const VIEWS = [
  { href: "/kanban", label: "Kanban", icon: KanbanSquare },
  { href: "/table", label: "Table", icon: List },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { applications, addApplications, openNewApplication } = useWorkspace();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <TrackieLogo showWordmark className="group-data-[collapsible=icon]:[&>span]:hidden" />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={openNewApplication}
              tooltip="New application"
            >
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
              {VIEWS.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    tooltip={label}
                  >
                    <Link href={href}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ImportExport
              applications={applications}
              onImport={addApplications}
              notify={(message) => toast.success(message)}
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
