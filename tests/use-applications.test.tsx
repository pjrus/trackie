import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useApplications } from "@/hooks/use-applications";
import { EMPTY_APPLICATION } from "@/lib/applications";

afterEach(() => localStorage.clear());

describe("useApplications", () => {
  it("hydrates a legacy fixture without losing unknown fields", async () => {
    localStorage.setItem(
      "jobApplications",
      JSON.stringify([
        {
          id: "old-id",
          company: "Legacy Co",
          role: "Analyst",
          customField: { source: "old-version" },
        },
      ]),
    );
    const { result } = renderHook(() => useApplications());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.applications[0]).toMatchObject({
      id: "old-id",
      customField: { source: "old-version" },
    });
  });

  it("adds an import batch in one action and preserves imported dates", async () => {
    const { result } = renderHook(() => useApplications());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    act(() => {
      result.current.addApplications([
        {
          ...EMPTY_APPLICATION,
          id: "import-one",
          dateAdded: "2025-01-01T00:00:00.000Z",
          company: "One",
        },
        {
          ...EMPTY_APPLICATION,
          id: "import-two",
          dateAdded: "2025-02-01T00:00:00.000Z",
          company: "Two",
        },
      ]);
    });
    expect(result.current.applications).toHaveLength(2);
    expect(result.current.applications.map((app) => app.dateAdded)).toEqual([
      "2025-01-01T00:00:00.000Z",
      "2025-02-01T00:00:00.000Z",
    ]);
    expect(result.current.applications[0].id).not.toBe("import-one");
  });
});
