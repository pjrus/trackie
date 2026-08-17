"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Plus } from "lucide-react";
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
import { KanbanBoard } from "@/components/kanban-board";
import { Summary } from "@/components/summary";
import { TableView } from "@/components/table-view";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/display";
import { TooltipProvider } from "@/components/ui/tooltip";

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
    <div className="min-h-screen">
      <div className="flex items-center justify-between gap-4 border-b bg-card px-4 py-3 lg:px-8">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-9 w-64" />
      </div>
      <main className="p-6 lg:p-8">
        <div className="grid grid-cols-4 gap-px overflow-hidden rounded-lg border">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-20 rounded-none" key={index} />
          ))}
        </div>
        <Skeleton className="mt-6 h-11 w-full" />
        <div className="mt-6 flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-96 w-80 shrink-0" key={index} />
          ))}
        </div>
      </main>
    </div>
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
        <Topbar
          view={view}
          onViewChange={setView}
          applications={applications}
          onImport={addApplications}
          notify={(message) => toast.success(message)}
          theme={theme}
          setTheme={setTheme}
          onNewApplication={openNew}
        />
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
            <div className="mx-4 grid min-h-72 place-items-center rounded-lg border border-dashed bg-card px-6 text-center lg:mx-8">
              <div>
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
                  <BriefcaseBusiness className="size-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold">
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
