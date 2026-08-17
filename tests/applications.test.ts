import { describe, expect, it } from "vitest";
import {
  applicationFormSchema,
  daysUntilDeadline,
  deadlineLabel,
  filterApplications,
  normaliseApplication,
  normaliseApplications,
  normaliseFilters,
  sortApplications,
} from "@/lib/applications";
import { DEFAULT_FILTERS } from "@/lib/constants";
import type { Application } from "@/lib/types";

const base = normaliseApplication({
  id: "legacy-1",
  company: "Atlassian",
  role: "Designer",
  stage: "Interview",
  priority: "High",
  nextStepDeadline: "2026-08-20",
  tags: ["Remote"],
}) as Application;

describe("application normalisation", () => {
  it("preserves identifiers and unknown valid fields", () => {
    const app = normaliseApplication({ ...base, customField: "keep me" });
    expect(app).toMatchObject({
      id: "legacy-1",
      customField: "keep me",
      company: "Atlassian",
    });
  });

  it("repairs invalid enums and nested records", () => {
    const app = normaliseApplication({
      company: "Canva",
      industry: "Unknown",
      stage: "Maybe",
      confidence: 99,
      links: [{ url: "https://example.com" }],
      timeline: [{ date: "2026-08-17", description: "Applied" }],
    });
    expect(app).toMatchObject({
      industry: "Other",
      stage: "Applied",
      confidence: 5,
    });
    expect(app?.links[0].id).toBeTruthy();
    expect(app?.timeline[0].id).toBeTruthy();
  });

  it("drops malformed records without company or role", () => {
    expect(
      normaliseApplications([null, {}, { company: "Valid" }]),
    ).toHaveLength(1);
  });
});

describe("form validation", () => {
  it("requires company or role", () => {
    const result = applicationFormSchema.safeParse({
      ...base,
      company: "",
      role: "",
    });
    expect(result.success).toBe(false);
  });

  it("requires a referrer name and valid URL", () => {
    const result = applicationFormSchema.safeParse({
      ...base,
      referral: true,
      referrerName: "",
      jobUrl: "jobs.example.com",
    });
    expect(result.success).toBe(false);
  });
});

describe("dates, filtering and sorting", () => {
  const now = new Date(2026, 7, 17, 16);
  it("calculates local calendar-day deadlines", () => {
    expect(daysUntilDeadline("2026-08-20", now)).toBe(3);
    expect(deadlineLabel("2026-08-16", now)).toBe("1 day overdue");
  });

  it("combines categories with AND and values within categories with OR", () => {
    const second = normaliseApplication({
      company: "Seek",
      role: "Engineer",
      stage: "Applied",
      priority: "Low",
      industry: "Software Engineering",
    }) as Application;
    const filters = normaliseFilters({
      ...DEFAULT_FILTERS,
      stages: ["Applied", "Interview"],
      priorities: ["High"],
      search: "remote",
    });
    expect(filterApplications([base, second], filters, now)).toEqual([base]);
  });

  it("sorts missing deadlines last", () => {
    const later = normaliseApplication({
      company: "B",
      nextStepDeadline: "",
    }) as Application;
    expect(
      sortApplications([later, base], "deadline").map((app) => app.id),
    ).toEqual(["legacy-1", later.id]);
  });
});
