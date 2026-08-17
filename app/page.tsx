"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS } from "@/lib/constants";
import type { ViewMode } from "@/lib/types";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { WorkspaceSkeleton } from "@/components/workspace-chrome";
import { normaliseView } from "@/components/workspace-provider";

/** Sends the visitor to whichever view they used last. */
export default function Page() {
  const router = useRouter();
  const [view, , loaded] = usePersistedState<ViewMode>(
    STORAGE_KEYS.view,
    "kanban",
    normaliseView,
  );
  useEffect(() => {
    if (loaded) router.replace(view === "table" ? "/table" : "/kanban");
  }, [loaded, router, view]);
  return <WorkspaceSkeleton />;
}
