"use client";

import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  filterApplications,
  normaliseFilters,
  sortApplications,
  type ApplicationFormValues,
} from "@/lib/applications";
import { DEFAULT_FILTERS, STORAGE_KEYS } from "@/lib/constants";
import {
  SORT_KEYS,
  type Application,
  type ApplicationFilters,
  type SortKey,
  type Stage,
  type ViewMode,
} from "@/lib/types";
import { useApplications } from "@/hooks/use-applications";
import { usePersistedState } from "@/hooks/use-persisted-state";

export const normaliseView = (value: unknown): ViewMode =>
  value === "table" ? "table" : "kanban";
const normaliseSort = (value: unknown): SortKey =>
  SORT_KEYS.includes(value as SortKey) ? (value as SortKey) : "deadline";

interface Workspace {
  /** Every stored application, before filters. */
  applications: Application[];
  /** Filtered and ordered by the current sort key. */
  sorted: Application[];
  filtered: Application[];
  isLoaded: boolean;
  filters: ApplicationFilters;
  setFilters: (filters: ApplicationFilters) => void;
  clearFilters: () => void;
  sortBy: SortKey;
  setSortBy: (sortBy: SortKey) => void;
  addApplications: (
    values: Array<ApplicationFormValues | Application>,
  ) => Application[];
  moveApplication: (id: string, stage: Stage) => void;
  openApplication: (application: Application) => void;
  openNewApplication: () => void;
  rememberView: (view: ViewMode) => void;
}

const WorkspaceContext = createContext<Workspace | null>(null);

export function useWorkspace() {
  const workspace = useContext(WorkspaceContext);
  if (!workspace)
    throw new Error("useWorkspace must be used within a WorkspaceProvider.");
  return workspace;
}

/** Records which view the user is on so `/` can send them back to it. */
export function useRememberView(view: ViewMode) {
  const { rememberView } = useWorkspace();
  useEffect(() => rememberView(view), [rememberView, view]);
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { applications, isLoaded, addApplications, moveApplication } =
    useApplications();
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
  const [, setView] = usePersistedState<ViewMode>(
    STORAGE_KEYS.view,
    "kanban",
    normaliseView,
  );
  const deferredSearch = useDeferredValue(filters.search);
  const { resolvedTheme, setTheme } = useTheme();

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

  const move = useCallback(
    (id: string, stage: Stage) => {
      moveApplication(id, stage);
      toast.success(`Moved to ${stage}`);
    },
    [moveApplication],
  );
  const value = useMemo<Workspace>(
    () => ({
      applications,
      filtered,
      sorted,
      isLoaded,
      filters,
      setFilters,
      clearFilters: () => setFilters({ ...DEFAULT_FILTERS }),
      sortBy,
      setSortBy,
      addApplications,
      moveApplication: move,
      openApplication: (application) =>
        router.push(`/applications/edit?id=${encodeURIComponent(application.id)}`),
      openNewApplication: () => router.push("/applications/new"),
      rememberView: setView,
    }),
    [
      addApplications,
      applications,
      filtered,
      filters,
      isLoaded,
      move,
      router,
      setFilters,
      setSortBy,
      setView,
      sortBy,
      sorted,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
