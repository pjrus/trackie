"use client";

import { useDeferredValue, useEffect, useMemo } from "react";
import { BriefcaseBusiness, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  filterApplications,
  normaliseFilters,
  sortApplications,
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
import { AppSidebar } from "@/components/app-sidebar";
import { FilterBar } from "@/components/filter-bar";
import { KanbanBoard } from "@/components/kanban-board";
import { Summary } from "@/components/summary";
import { TableView } from "@/components/table-view";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/display";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
    <div className="flex min-h-screen">
      <div className="hidden w-64 shrink-0 border-r bg-card p-3 md:block">
        <Skeleton className="h-7 w-28" />
        <div className="mt-6 space-y-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-9 w-full" key={index} />
          ))}
        </div>
      </div>
      <main className="flex-1 p-6 lg:p-8">
        <Skeleton className="h-11 w-full" />
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
  const router = useRouter();
  const { applications, isLoaded, addApplications, moveApplication } =
    useApplications();
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
  const openNew = () => router.push("/applications/new");
  const openApplication = (app: Application) =>
    router.push(`/applications/${app.id}`);
  const move = (id: string, stage: Stage) => {
    moveApplication(id, stage);
    toast.success(`Moved to ${stage}`);
  };

  if (!isLoaded) return <LoadingWorkspace />;
  return (
    <TooltipProvider delayDuration={350}>
      <SidebarProvider>
        <AppSidebar
          view={view}
          onViewChange={setView}
          applications={applications}
          onImport={addApplications}
          notify={(message) => toast.success(message)}
          theme={theme}
          setTheme={setTheme}
          onNewApplication={openNew}
        />
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-20 flex items-center gap-2 border-b bg-card px-4 py-3 lg:px-8">
            <SidebarTrigger />
            <h1 className="font-display text-lg font-semibold">
              {view === "kanban" ? "Kanban board" : "Applications"}
            </h1>
          </header>
          {view === "table" ? <Summary applications={filtered} /> : null}
          <FilterBar filters={filters} onChange={setFilters} />
          <main className="pb-12">
            {filtered.length ? (
              view === "kanban" ? (
                <KanbanBoard
                  applications={sorted}
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
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
