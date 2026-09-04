import Papa from "papaparse";
import { applicationFormSchema, normaliseApplication } from "./applications";
import type { Application, ImportIssue, ImportPreview } from "./types";

export const CSV_HEADERS = [
  "Company",
  "Role",
  "Industry",
  "Type",
  "Stage",
  "Application Deadline",
  "Next Step Deadline",
  "Next Step Description",
  "Priority",
  "Location",
  "Salary",
  "Job URL",
  "Notes",
  "Why Applied",
  "Tags",
  "Confidence",
  "Referral",
  "Referrer Name",
  "Date Added",
] as const;

const headerToField: Record<string, string> = {
  company: "company",
  role: "role",
  industry: "industry",
  type: "type",
  stage: "stage",
  "application deadline": "applicationDeadline",
  "next step deadline": "nextStepDeadline",
  "next step description": "nextStepDescription",
  priority: "priority",
  location: "location",
  salary: "salary",
  "job url": "jobUrl",
  notes: "notes",
  "why applied": "whyApplied",
  tags: "tags",
  confidence: "confidence",
  referral: "referral",
  "referrer name": "referrerName",
  "date added": "dateAdded",
};

export function createCSV(applications: Application[]) {
  const rows = applications.map((app) => ({
    Company: app.company,
    Role: app.role,
    Industry: app.industry,
    Type: app.type,
    Stage: app.stage,
    "Application Deadline": app.applicationDeadline,
    "Next Step Deadline": app.nextStepDeadline,
    "Next Step Description": app.nextStepDescription,
    Priority: app.priority,
    Location: app.location,
    Salary: app.salary,
    "Job URL": app.jobUrl,
    Notes: app.notes,
    "Why Applied": app.whyApplied,
    Tags: app.tags.join(";"),
    Confidence: app.confidence,
    Referral: app.referral ? "Yes" : "No",
    "Referrer Name": app.referrerName,
    "Date Added": app.dateAdded,
  }));
  return Papa.unparse({ fields: [...CSV_HEADERS], data: rows });
}

export function createJSON(applications: Application[]) {
  return JSON.stringify(applications, null, 2);
}

const escapeICS = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
export function createICS(applications: Application[], now = new Date()) {
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const events = applications
    .filter((app) => app.nextStepDeadline)
    .map((app) => {
      const date = app.nextStepDeadline.replace(/-/g, "");
      const nextDate = new Date(`${app.nextStepDeadline}T00:00:00`);
      nextDate.setDate(nextDate.getDate() + 1);
      const end = `${nextDate.getFullYear()}${String(nextDate.getMonth() + 1).padStart(2, "0")}${String(nextDate.getDate()).padStart(2, "0")}`;
      const priority =
        app.priority === "High" ? 1 : app.priority === "Low" ? 9 : 5;
      return [
        "BEGIN:VEVENT",
        `UID:${escapeICS(app.id)}@trackie`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${date}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:${escapeICS(`${app.company} - ${app.role}`)}`,
        `DESCRIPTION:${escapeICS(app.nextStepDescription || app.stage)}`,
        `PRIORITY:${priority}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
      ].join("\r\n");
    });
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Trackie//Job Application Tracker//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Job Application Deadlines",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

const str = (value: unknown) => (typeof value === "string" ? value : "");

// applicationFormSchema requires every field; fill in the ones missing from
// a partial import record with the same defaults normaliseApplication uses,
// so only genuinely-present-and-invalid values fail validation.
function toFormInput(value: Record<string, unknown>) {
  return {
    company: str(value.company),
    role: str(value.role),
    industry: value.industry ?? "Other",
    type: value.type ?? "Full-time",
    stage: value.stage ?? "Applied",
    priority: value.priority ?? "Medium",
    confidence: typeof value.confidence === "number" ? value.confidence : 3,
    applicationDeadline: str(value.applicationDeadline),
    nextStepDeadline: str(value.nextStepDeadline),
    nextStepDescription: str(value.nextStepDescription),
    location: str(value.location),
    salary: str(value.salary),
    jobUrl: str(value.jobUrl),
    notes: str(value.notes),
    whyApplied: str(value.whyApplied),
    tags: Array.isArray(value.tags)
      ? value.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    links: Array.isArray(value.links) ? value.links : [],
    referral: value.referral === true || value.referral === "Yes",
    referrerName: str(value.referrerName),
    timeline: Array.isArray(value.timeline) ? value.timeline : [],
  };
}

function validateImportRecord(record: unknown) {
  if (!record || typeof record !== "object" || Array.isArray(record))
    return ["Record must be an object."];
  const value = record as Record<string, unknown>;
  const result = applicationFormSchema.safeParse(toFormInput(value));
  const issues = result.success ? [] : result.error.issues.map((i) => i.message);
  // dateAdded isn't part of the form schema (it's set on create, not entered).
  if (
    typeof value.dateAdded === "string" &&
    value.dateAdded &&
    Number.isNaN(Date.parse(value.dateAdded))
  )
    issues.push("Date added is invalid.");
  return issues;
}

function previewRecords(records: unknown[], rowOffset = 1): ImportPreview {
  const accepted: Application[] = [];
  const errors: ImportIssue[] = [];
  records.forEach((record, index) => {
    const issues = validateImportRecord(record);
    if (issues.length) {
      errors.push({ row: index + rowOffset, message: issues.join(" ") });
      return;
    }
    const app = normaliseApplication(record, true);
    if (app) accepted.push(app);
    else
      errors.push({
        row: index + rowOffset,
        message: "Application could not be normalised.",
      });
  });
  return { accepted, errors };
}

export function parseJSONImport(content: string): ImportPreview {
  try {
    const parsed: unknown = JSON.parse(content);
    if (!Array.isArray(parsed))
      return {
        accepted: [],
        errors: [
          { row: 0, message: "JSON must contain an array of applications." },
        ],
      };
    return previewRecords(parsed);
  } catch (error) {
    return {
      accepted: [],
      errors: [
        {
          row: 0,
          message:
            error instanceof Error
              ? `Invalid JSON: ${error.message}`
              : "Invalid JSON.",
        },
      ],
    };
  }
}

export function parseCSVImport(content: string): ImportPreview {
  const parsed = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim().toLowerCase(),
  });
  const errors: ImportIssue[] = parsed.errors.map((error) => ({
    row: (error.row ?? 0) + 2,
    message: error.message,
  }));
  const records = parsed.data.map((row) => {
    const record: Record<string, unknown> = {};
    for (const [header, value] of Object.entries(row)) {
      const field = headerToField[header];
      if (field) record[field] = value;
    }
    if (typeof record.tags === "string")
      record.tags = record.tags
        .split(";")
        .map((tag) => tag.trim())
        .filter(Boolean);
    if (typeof record.confidence === "string") {
      if (record.confidence.trim())
        record.confidence = Number.parseInt(record.confidence, 10);
      else delete record.confidence;
    }
    record.links = [];
    record.timeline = [];
    return record;
  });
  const preview = previewRecords(records, 2);
  return { accepted: preview.accepted, errors: [...errors, ...preview.errors] };
}

export function downloadText(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export const SAMPLE_CSV = `${CSV_HEADERS.join(",")}\nAcme,Product Designer,Other,Full-time,Applied,2026-09-01,2026-08-24,Send portfolio,High,Melbourne VIC,$120k,https://example.com/jobs/1,Met at event,Strong product culture,design;local,4,Yes,Sam Lee,2026-08-17`;
