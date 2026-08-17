"use client";

import { KanbanSquare, Laptop, List, Monitor, Moon, Plus, Sun } from "lucide-react";
import type { Application, ViewMode } from "@/lib/types";
import { TrackieLogo } from "@/components/trackie-logo";
import { ImportExport } from "@/components/import-export";
import { HelpDialog } from "@/components/help-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ThemeMenu({
  theme,
  setTheme,
}: {
  theme?: string;
  setTheme: (theme: string) => void;
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Choose theme">
              {theme === "system" ? (
                <Monitor className="size-4" />
              ) : theme === "dark" ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Theme</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setTheme("light")}>
          <Sun className="size-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme("dark")}>
          <Moon className="size-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme("system")}>
          <Laptop className="size-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Topbar({
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
    <header className="sticky top-0 z-20 border-b bg-card">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:px-8">
        <TrackieLogo showWordmark />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <Tabs
          value={view}
          onValueChange={(value) => {
            if (value === "kanban" || value === "table") onViewChange(value);
          }}
        >
          <TabsList aria-label="Choose workspace view">
            <TabsTrigger value="kanban">
              <KanbanSquare className="size-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="table">
              <List className="size-4" />
              Table
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={onNewApplication}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">New application</span>
          </Button>
          <ImportExport
            applications={applications}
            onImport={onImport}
            notify={notify}
          />
          <HelpDialog />
          <ThemeMenu theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
}
