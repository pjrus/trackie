import { describe, expect, it } from "vitest";
import { normaliseApplication } from "@/lib/applications";
import {
  createCSV,
  createICS,
  createJSON,
  parseCSVImport,
  parseJSONImport,
} from "@/lib/import-export";
import type { Application } from "@/lib/types";

const application = normaliseApplication({
  id: "original",
  company: "Comma, Pty Ltd",
  role: "Engineer",
  notes: "One, two\nthree",
  tags: ["remote", "typescript"],
  nextStepDeadline: "2026-08-20",
  priority: "High",
}) as Application;

describe("import and export", () => {
  it("round-trips CSV with quoted multiline values", () => {
    const preview = parseCSVImport(createCSV([application]));
    expect(preview.errors).toEqual([]);
    expect(preview.accepted[0]).toMatchObject({
      company: "Comma, Pty Ltd",
      notes: "One, two\nthree",
      tags: ["remote", "typescript"],
    });
    expect(preview.accepted[0].id).not.toBe("original");
  });

  it("preserves the complete JSON shape while regenerating imported ids", () => {
    expect(JSON.parse(createJSON([application]))[0].id).toBe("original");
    const preview = parseJSONImport(createJSON([application]));
    expect(preview.accepted[0].id).not.toBe("original");
  });

  it("reports bad records while accepting good ones in the same batch", () => {
    const preview = parseJSONImport(
      JSON.stringify([{ company: "Good" }, { notes: "Missing identity" }]),
    );
    expect(preview.accepted).toHaveLength(1);
    expect(preview.errors).toEqual([
      { row: 2, message: "Enter a company or role" },
    ]);
  });

  it("rejects malformed import fields with useful row errors", () => {
    const preview = parseJSONImport(
      JSON.stringify([
        {
          company: "Broken",
          nextStepDeadline: "tomorrow",
          jobUrl: "example.com/job",
          confidence: 8,
          referral: true,
        },
      ]),
    );
    expect(preview.accepted).toHaveLength(0);
    expect(preview.errors[0].message).toContain("YYYY-MM-DD");
    expect(preview.errors[0].message).toContain("http://");
    expect(preview.errors[0].message).toContain("referrer");
  });

  it("creates valid all-day ICS events with an exclusive end date", () => {
    const ics = createICS([application], new Date("2026-08-17T00:00:00.000Z"));
    expect(ics).toContain("DTSTART;VALUE=DATE:20260820");
    expect(ics).toContain("DTEND;VALUE=DATE:20260821");
    expect(ics).toContain("SUMMARY:Comma\\, Pty Ltd - Engineer");
  });
});
