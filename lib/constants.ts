import type { ApplicationFilters } from "./types";

export const STORAGE_KEYS = {
  applications: "jobApplications",
  theme: "darkMode",
  view: "viewMode",
  filters: "filters",
  sort: "sortBy",
} as const;

export const DEFAULT_FILTERS: ApplicationFilters = {
  search: "",
  stages: [],
  priorities: [],
  industries: [],
  types: [],
  deadlineFrom: "",
  deadlineTo: "",
  dueThisWeek: false,
  activeOnly: false,
};

export const ACTIVE_STAGES = new Set([
  "Applied",
  "Online Assessment",
  "Phone Screen",
  "Interview",
  "Offer",
]);
