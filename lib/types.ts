export const STAGES = [
  "Applied",
  "Online Assessment",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;
export const PRIORITIES = ["High", "Medium", "Low"] as const;
export const INDUSTRIES = [
  "Software Engineering",
  "Quantitative Trading",
  "Consulting",
  "Banking & Finance",
  "Other",
] as const;
export const EMPLOYMENT_TYPES = [
  "Internship",
  "Graduate",
  "Full-time",
] as const;

export type Stage = (typeof STAGES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Industry = (typeof INDUSTRIES)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type ViewMode = "kanban" | "table";
export const SORT_KEYS = [
  "deadline",
  "company",
  "role",
  "stage",
  "priority",
  "industry",
  "type",
] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export interface TimelineEntry {
  id: string;
  date: string;
  description: string;
}
export interface ApplicationLink {
  id: string;
  url: string;
}
export interface Application {
  id: string;
  dateAdded: string;
  company: string;
  role: string;
  industry: Industry;
  type: EmploymentType;
  stage: Stage;
  priority: Priority;
  confidence: number;
  applicationDeadline: string;
  nextStepDeadline: string;
  nextStepDescription: string;
  location: string;
  salary: string;
  jobUrl: string;
  notes: string;
  whyApplied: string;
  tags: string[];
  links: ApplicationLink[];
  referral: boolean;
  referrerName: string;
  timeline: TimelineEntry[];
  [key: string]: unknown;
}

export interface ApplicationFilters {
  search: string;
  stages: Stage[];
  priorities: Priority[];
  industries: Industry[];
  types: EmploymentType[];
  deadlineFrom: string;
  deadlineTo: string;
  dueThisWeek: boolean;
  activeOnly: boolean;
}

export interface ImportIssue {
  row: number;
  message: string;
}
export interface ImportPreview {
  accepted: Application[];
  errors: ImportIssue[];
}
