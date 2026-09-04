"use client";

import { useCallback } from "react";
import {
  normaliseApplication,
  normaliseApplications,
  type ApplicationFormValues,
} from "@/lib/applications";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Application, Stage } from "@/lib/types";
import { newId } from "@/lib/utils";
import { usePersistedState } from "@/hooks/use-persisted-state";

export function useApplications() {
  const [applications, setApplications, isLoaded] = usePersistedState<
    Application[]
  >(STORAGE_KEYS.applications, [], normaliseApplications);

  const addApplications = useCallback(
    (values: Array<ApplicationFormValues | Application>) => {
      const created = values.flatMap((value) => {
        const dateAdded =
          "dateAdded" in value && typeof value.dateAdded === "string"
            ? value.dateAdded
            : new Date().toISOString();
        const app = normaliseApplication({
          ...value,
          id: newId(),
          dateAdded,
        });
        return app ? [app] : [];
      });
      setApplications((current) => [...current, ...created]);
      return created;
    },
    [setApplications],
  );

  const updateApplication = useCallback(
    (id: string, updates: Partial<Application>) => {
      setApplications((current) =>
        current.map((app) => (app.id === id ? { ...app, ...updates } : app)),
      );
    },
    [setApplications],
  );
  const deleteApplication = useCallback(
    (id: string) =>
      setApplications((current) => current.filter((app) => app.id !== id)),
    [setApplications],
  );
  const moveApplication = useCallback(
    (id: string, stage: Stage) => updateApplication(id, { stage }),
    [updateApplication],
  );
  return {
    applications,
    isLoaded,
    addApplications,
    updateApplication,
    deleteApplication,
    moveApplication,
  };
}
