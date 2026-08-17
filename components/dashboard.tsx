"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  KanbanSquare,
  Laptop,
  List,
  Monitor,
  Moon,
  Plus,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  filterApplications,
  normaliseFilters,
  sortApplications,
  type ApplicationFormValues,
} from "@/lib/applications";
import { DEFAULT_FILTERS, STORAGE_KEYS } from "@/lib/constants";
import type {
  Application,
  ApplicationFilters,
  SortKey,
  Stage,
  ViewMode,
} from "@/lib/types";
import { useApplications } from "@/hooks/use-applications";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { ApplicationEditor } from "@/components/application-editor";
import { FilterBar } from "@/components/filter-bar";
import { HelpDialog } from "@/components/help-dialog";
import { ImportExport } from "@/components/import-export";
import { KanbanBoard } from "@/components/kanban-board";
import { Summary } from "@/components/summary";
import { TableView } from "@/components/table-view";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/controls";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const normaliseView = (value: unknown): ViewMode =>
  value === "table" ? "table" : "kanban";
const normaliseSort = (value: unknown): SortKey =>
  [
    "deadline",
    "company",
    "role",
    "stage",
    "priority",
    "industry",
    "type",
  ].includes(String(value))
    ? (value as SortKey)
    : "deadline";

function LoadingWorkspace() {
  return (
    <main className="min-h-screen p-5 lg:p-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-52" />
        <Skeleton className="h-10 w-72" />
      </div>
      <div className="mt-8 grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-24" key={index} />
        ))}
      </div>
      <Skeleton className="mt-6 h-12 w-full" />
      <div className="mt-6 flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-96 w-80 shrink-0" key={index} />
        ))}
      </div>
    </main>
  );
}

export function Dashboard() {
  const {
    applications,
    isLoaded,
    addApplications,
    updateApplication,
    deleteApplication,
    moveApplication,
  } = useApplications();
  const [view, setView] = usePersistedState<ViewMode>(
    STORAGE_KEYS.view,
    "kanban",
    normaliseView,
  );
  const [filters, setFilters] = usePersistedState<ApplicationFilters>(
    STORAGE_KEYS.filters,
    DEFAULT_FILTERS,
    normaliseFilters,
  );
  const [sortBy, setSortBy] = usePersistedState<SortKey>(
    STORAGE_KEYS.sort,
    "deadline",
    normaliseSort,
  );
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(filters.search);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (localStorage.getItem("trackie-theme")) return;
    const legacy = localStorage.getItem(STORAGE_KEYS.theme);
    if (legacy === "true") setTheme("dark");
    else if (legacy === "false") setTheme("light");
  }, [setTheme]);
  useEffect(() => {
    if (resolvedTheme)
      localStorage.setItem(
        STORAGE_KEYS.theme,
        JSON.stringify(resolvedTheme === "dark"),
      );
  }, [resolvedTheme]);

  const filtered = useMemo(
    () =>
      filterApplications(applications, { ...filters, search: deferredSearch }),
    [applications, deferredSearch, filters],
  );
  const sorted = useMemo(
    () => sortApplications(filtered, sortBy),
    [filtered, sortBy],
  );
  const selected = selectedId
    ? (applications.find((app) => app.id === selectedId) ?? null)
    : null;
  const openNew = () => {
    setSelectedId(null);
    setEditorOpen(true);
  };
  const openApplication = (app: Application) => {
    setSelectedId(app.id);
    setEditorOpen(true);
  };
  const save = (values: ApplicationFormValues) => {
    if (selectedId) {
      updateApplication(selectedId, values);
      toast.success("Application updated");
    } else {
      addApplications([values]);
      toast.success("Application added");
    }
    setEditorOpen(false);
  };
  const remove = () => {
    if (!selectedId) return;
    deleteApplication(selectedId);
    setSelectedId(null);
    setEditorOpen(false);
    toast.success("Application deleted");
  };
  const move = (id: string, stage: Stage) => {
    moveApplication(id, stage);
    toast.success(`Moved to ${stage}`);
  };

  if (!isLoaded) return <LoadingWorkspace />;
  return (
    <TooltipProvider delayDuration={350}>
      <div className="min-h-screen">
        <header className="px-4 pb-5 pt-6 lg:px-8 lg:pb-7 lg:pt-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <BriefcaseBusiness className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.24em] text-primary">
                  Private workspace
                </p>
                <h1 className="font-display text-3xl font-semibold leading-none sm:text-4xl">
                  Trackie
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ImportExport
                applications={applications}
                onImport={addApplications}
                notify={(message) => toast.success(message)}
              />
              <Button onClick={openNew}>
                <Plus className="size-4" />
                <span>New application</span>
              </Button>
              <HelpDialog />
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Choose theme"
                      >
                        {theme === "system" ? (
                          <Monitor className="size-5" />
                        ) : theme === "dark" ? (
                          <Moon className="size-5" />
                        ) : (
                          <Sun className="size-5" />
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
            </div>
          </div>
          <div className="mt-7 flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
            <div>
              <p className="max-w-2xl text-sm text-muted-foreground">
                A calm, local-first view of every opportunity, next step, and
                conversation.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {filtered.length} of {applications.length} application
                {applications.length === 1 ? "" : "s"} shown
              </p>
            </div>
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(value) => {
                if (value === "kanban" || value === "table") setView(value);
              }}
              aria-label="Choose workspace view"
              className="w-fit rounded-md bg-muted p-1"
            >
              <ToggleGroupItem value="kanban" aria-label="Kanban view">
                <KanbanSquare className="size-4" />
                Kanban
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label="Table view">
                <List className="size-4" />
                Table
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </header>
        <Summary applications={filtered} />
        <FilterBar filters={filters} onChange={setFilters} />
        <main className="pb-12">
          {filtered.length ? (
            view === "kanban" ? (
              <KanbanBoard
                applications={filtered}
                onOpen={openApplication}
                onMove={move}
              />
            ) : (
              <TableView
                applications={sorted}
                sortBy={sortBy}
                onSort={setSortBy}
                onOpen={openApplication}
              />
            )
          ) : (
            <div className="mx-4 grid min-h-72 place-items-center rounded-xl border border-dashed bg-card px-6 text-center lg:mx-8">
              <div>
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
                  <BriefcaseBusiness className="size-5" />
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold">
                  {applications.length
                    ? "No applications match"
                    : "Your workspace is ready"}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  {applications.length
                    ? "Try clearing or adjusting the active filters."
                    : "Add your first opportunity. Everything stays private in this browser."}
                </p>
                {applications.length ? (
                  <Button
                    className="mt-5"
                    variant="secondary"
                    onClick={() => setFilters({ ...DEFAULT_FILTERS })}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Button className="mt-5" onClick={openNew}>
                    <Plus className="size-4" />
                    Add first application
                  </Button>
                )}
              </div>
            </div>
          )}
        </main>
        <ApplicationEditor
          open={editorOpen}
          application={selected}
          onOpenChange={setEditorOpen}
          onSave={save}
          onDelete={selected ? remove : undefined}
        />
      </div>
    </TooltipProvider>
  );
}
