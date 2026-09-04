import { z } from "zod";
import { DEFAULT_FILTERS } from "./constants";
import {
  EMPLOYMENT_TYPES,
  INDUSTRIES,
  PRIORITIES,
  STAGES,
  type Application,
  type ApplicationFilters,
  type SortKey,
} from "./types";
import { newId } from "./utils";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const optionalDate = z
  .string()
  .refine(
    (value) =>
      !value ||
      (datePattern.test(value) &&
        !Number.isNaN(Date.parse(`${value}T00:00:00`))),
    "Use a valid date (YYYY-MM-DD)",
  );
const optionalUrl = z
  .string()
  .refine(
    (value) => !value || /^https?:\/\//i.test(value),
    "Use a full http:// or https:// URL",
  );

export const applicationFormSchema = z
  .object({
    company: z.string().trim(),
    role: z.string().trim(),
    industry: z.enum(INDUSTRIES),
    type: z.enum(EMPLOYMENT_TYPES),
    stage: z.enum(STAGES),
    priority: z.enum(PRIORITIES),
    confidence: z.number().int().min(1).max(5),
    applicationDeadline: optionalDate,
    nextStepDeadline: optionalDate,
    nextStepDescription: z.string(),
    location: z.string(),
    salary: z.string(),
    jobUrl: optionalUrl,
    notes: z.string(),
    whyApplied: z.string(),
    tags: z
      .array(z.string().trim().min(1))
      .refine(
        (tags) =>
          new Set(tags.map((tag) => tag.toLowerCase())).size === tags.length,
        "Tags must be unique",
      ),
    links: z.array(z.object({ id: z.string(), url: optionalUrl })),
    referral: z.boolean(),
    referrerName: z.string(),
    timeline: z.array(
      z.object({
        id: z.string(),
        date: optionalDate,
        description: z.string().trim().min(1),
      }),
    ),
  })
  .superRefine((value, context) => {
    if (!value.company && !value.role)
      context.addIssue({
        code: "custom",
        path: ["company"],
        message: "Enter a company or role",
      });
    if (value.referral && !value.referrerName.trim())
      context.addIssue({
        code: "custom",
        path: ["referrerName"],
        message: "Enter the referrer’s name",
      });
  });

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export const EMPTY_APPLICATION: ApplicationFormValues = {
  company: "",
  role: "",
  industry: "Other",
  type: "Full-time",
  stage: "Applied",
  priority: "Medium",
  confidence: 3,
  applicationDeadline: "",
  nextStepDeadline: "",
  nextStepDescription: "",
  location: "",
  salary: "",
  jobUrl: "",
  notes: "",
  whyApplied: "",
  tags: [],
  links: [],
  referral: false,
  referrerName: "",
  timeline: [],
};

const isOneOf = <T extends readonly string[]>(
  value: unknown,
  values: T,
): value is T[number] =>
  typeof value === "string" && values.includes(value as T[number]);
const stringValue = (value: unknown) =>
  typeof value === "string" ? value : "";
const validDate = (value: unknown) =>
  typeof value === "string" && (!value || datePattern.test(value)) ? value : "";

export function normaliseApplication(
  input: unknown,
  regenerateId = false,
): Application | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const source = input as Record<string, unknown>;
  const company = stringValue(source.company).trim();
  const role = stringValue(source.role).trim();
  if (!company && !role) return null;
  const tags = Array.isArray(source.tags)
    ? [
        ...new Set(
          source.tags
            .filter(
              (tag): tag is string => typeof tag === "string" && !!tag.trim(),
            )
            .map((tag) => tag.trim()),
        ),
      ]
    : [];
  const links = Array.isArray(source.links)
    ? source.links.flatMap((link) => {
        if (!link || typeof link !== "object") return [];
        const item = link as Record<string, unknown>;
        const url = stringValue(item.url);
        return url
          ? [{ ...item, id: stringValue(item.id) || newId(), url }]
          : [];
      })
    : [];
  const timeline = Array.isArray(source.timeline)
    ? source.timeline.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as Record<string, unknown>;
        const description = stringValue(item.description);
        return description
          ? [
              {
                ...item,
                id: stringValue(item.id) || newId(),
                date: validDate(item.date),
                description,
              },
            ]
          : [];
      })
    : [];
  const confidence =
    typeof source.confidence === "number"
      ? Math.min(5, Math.max(1, Math.round(source.confidence)))
      : 3;
  return {
    ...source,
    id: regenerateId ? newId() : stringValue(source.id) || newId(),
    dateAdded: stringValue(source.dateAdded) || new Date().toISOString(),
    company,
    role,
    industry: isOneOf(source.industry, INDUSTRIES) ? source.industry : "Other",
    type: isOneOf(source.type, EMPLOYMENT_TYPES) ? source.type : "Full-time",
    stage: isOneOf(source.stage, STAGES) ? source.stage : "Applied",
    priority: isOneOf(source.priority, PRIORITIES) ? source.priority : "Medium",
    confidence,
    applicationDeadline: validDate(source.applicationDeadline),
    nextStepDeadline: validDate(source.nextStepDeadline),
    nextStepDescription: stringValue(source.nextStepDescription),
    location: stringValue(source.location),
    salary: stringValue(source.salary),
    jobUrl: stringValue(source.jobUrl),
    notes: stringValue(source.notes),
    whyApplied: stringValue(source.whyApplied),
    tags,
    links,
    referral: source.referral === true || source.referral === "Yes",
    referrerName: stringValue(source.referrerName),
    timeline,
  } as Application;
}

export function normaliseApplications(input: unknown): Application[] {
  if (!Array.isArray(input)) return [];
  return input.flatMap((item) => {
    const app = normaliseApplication(item);
    return app ? [app] : [];
  });
}

export function normaliseFilters(input: unknown): ApplicationFilters {
  if (!input || typeof input !== "object") return { ...DEFAULT_FILTERS };
  const source = input as Partial<ApplicationFilters>;
  return {
    ...DEFAULT_FILTERS,
    search: stringValue(source.search),
    deadlineFrom: validDate(source.deadlineFrom),
    deadlineTo: validDate(source.deadlineTo),
    stages: Array.isArray(source.stages)
      ? source.stages.filter((item) => isOneOf(item, STAGES))
      : [],
    priorities: Array.isArray(source.priorities)
      ? source.priorities.filter((item) => isOneOf(item, PRIORITIES))
      : [],
    industries: Array.isArray(source.industries)
      ? source.industries.filter((item) => isOneOf(item, INDUSTRIES))
      : [],
    types: Array.isArray(source.types)
      ? source.types.filter((item) => isOneOf(item, EMPLOYMENT_TYPES))
      : [],
    dueThisWeek: source.dueThisWeek === true,
    activeOnly: source.activeOnly === true,
  };
}

function dateAtMidnight(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}
export function daysUntilDeadline(value: string, now = new Date()) {
  if (!value) return null;
  const date = dateAtMidnight(value);
  if (!date) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((date.getTime() - today.getTime()) / 86_400_000);
}
export function deadlineLabel(value: string, now = new Date()) {
  const days = daysUntilDeadline(value, now);
  if (days === null) return "No deadline";
  if (days < 0) return `${Math.abs(days)} day${days === -1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `${days} days`;
}
export function formatDate(value: string) {
  const date = dateAtMidnight(value);
  return date
    ? new Intl.DateTimeFormat("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date)
    : "—";
}

export function filterApplications(
  applications: Application[],
  filters: ApplicationFilters,
  now = new Date(),
) {
  const search = filters.search.trim().toLowerCase();
  return applications.filter((app) => {
    if (
      search &&
      ![app.company, app.role, ...app.tags].some((value) =>
        value.toLowerCase().includes(search),
      )
    )
      return false;
    const days = daysUntilDeadline(app.nextStepDeadline, now);
    if (filters.dueThisWeek && !(days !== null && days >= 0 && days <= 7))
      return false;
    if (
      filters.activeOnly &&
      (app.stage === "Rejected" || app.stage === "Withdrawn")
    )
      return false;
    if (filters.stages.length && !filters.stages.includes(app.stage))
      return false;
    if (filters.priorities.length && !filters.priorities.includes(app.priority))
      return false;
    if (filters.industries.length && !filters.industries.includes(app.industry))
      return false;
    if (filters.types.length && !filters.types.includes(app.type)) return false;
    if ((filters.deadlineFrom || filters.deadlineTo) && !app.nextStepDeadline)
      return false;
    if (filters.deadlineFrom && app.nextStepDeadline < filters.deadlineFrom)
      return false;
    if (filters.deadlineTo && app.nextStepDeadline > filters.deadlineTo)
      return false;
    return true;
  });
}

const priorityRank = { High: 0, Medium: 1, Low: 2 } as const;
export function sortApplications(applications: Application[], key: SortKey) {
  return [...applications].sort((a, b) => {
    if (key === "deadline")
      return (a.nextStepDeadline || "9999-12-31").localeCompare(
        b.nextStepDeadline || "9999-12-31",
      );
    if (key === "priority")
      return priorityRank[a.priority] - priorityRank[b.priority];
    return String(a[key] ?? "").localeCompare(String(b[key] ?? ""), "en-AU", {
      sensitivity: "base",
    });
  });
}
