import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useEffect } from "react";
import { usePersistedState } from "@/hooks/use-persisted-state";

describe("usePersistedState", () => {
  beforeEach(() => localStorage.clear());

  it("reads a stored value back", async () => {
    localStorage.setItem("filters", JSON.stringify({ search: "canva" }));
    const { result } = renderHook(() =>
      usePersistedState<{ search: string }>("filters", { search: "" }),
    );
    await waitFor(() => expect(result.current[2]).toBe(true));
    expect(result.current[0]).toEqual({ search: "canva" });
  });

  it("keeps legacy raw strings that are not JSON", async () => {
    localStorage.setItem("viewMode", "table");
    const { result } = renderHook(() =>
      usePersistedState<string>("viewMode", "kanban"),
    );
    await waitFor(() => expect(result.current[2]).toBe(true));
    expect(result.current[0]).toBe("table");
  });

  // The bug this guards: the stored read lands a microtask after mount, so a
  // caller writing on mount (useRememberView records the current route) had
  // its value clobbered by the older one on disk.
  it("lets a write during mount win over the stored value", async () => {
    localStorage.setItem("viewMode", "kanban");
    const { result } = renderHook(() => {
      const [view, setView, loaded] = usePersistedState<string>(
        "viewMode",
        "kanban",
      );
      useEffect(() => setView("table"), [setView]);
      return [view, setView, loaded] as const;
    });
    await waitFor(() => expect(result.current[2]).toBe(true));
    expect(result.current[0]).toBe("table");
    await waitFor(() => expect(localStorage.getItem("viewMode")).toBe("table"));
  });

  it("persists later writes", async () => {
    const { result } = renderHook(() =>
      usePersistedState<string>("sortBy", "deadline"),
    );
    await waitFor(() => expect(result.current[2]).toBe(true));
    act(() => result.current[1]("company"));
    await waitFor(() => expect(localStorage.getItem("sortBy")).toBe("company"));
  });
});
