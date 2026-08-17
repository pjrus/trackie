"use client";

import { useCallback, useEffect, useState } from "react";
import {
  normaliseApplication,
  normaliseApplications,
  type ApplicationFormValues,
} from "@/lib/applications";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Application, Stage } from "@/lib/types";
import { newId } from "@/lib/utils";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        setApplications(
          normaliseApplications(
            JSON.parse(localStorage.getItem(STORAGE_KEYS.applications) ?? "[]"),
          ),
        );
      } catch {
        setApplications([]);
      }
      setIsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isLoaded)
      localStorage.setItem(
        STORAGE_KEYS.applications,
        JSON.stringify(applications),
      );
  }, [applications, isLoaded]);

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
    [],
  );

  const updateApplication = useCallback(
    (id: string, updates: Partial<Application>) => {
      setApplications((current) =>
        current.map((app) => (app.id === id ? { ...app, ...updates } : app)),
      );
    },
    [],
  );
  const deleteApplication = useCallback(
    (id: string) =>
      setApplications((current) => current.filter((app) => app.id !== id)),
    [],
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
