"use client";

import { BriefcaseBusiness, Plus } from "lucide-react";
import { useWorkspace } from "@/components/workspace-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/display";
import { SidebarTrigger } from "@/components/ui/sidebar";

/** Sticky bar at the top of a view. Each view names itself. */
export function WorkspaceHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b bg-card px-4 py-3 lg:px-8">
      <SidebarTrigger />
      <h1 className="font-display text-lg font-semibold">{title}</h1>
    </header>
  );
}

/** Shown by either view when the current filters match nothing. */
export function WorkspaceEmptyState() {
  const { applications, clearFilters, openNewApplication } = useWorkspace();
  const hasApplications = applications.length > 0;
  return (
    <div className="mx-4 grid min-h-72 place-items-center rounded-lg border border-dashed bg-card px-6 text-center lg:mx-8">
      <div>
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
          <BriefcaseBusiness className="size-5" />
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold">
          {hasApplications ? "No applications match" : "Your workspace is ready"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {hasApplications
            ? "Try clearing or adjusting the active filters."
            : "Add your first opportunity. Everything stays private in this browser."}
        </p>
        {hasApplications ? (
          <Button className="mt-5" variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button className="mt-5" onClick={openNewApplication}>
            <Plus className="size-4" />
            Add first application
          </Button>
        )}
      </div>
    </div>
  );
}

/** Placeholder while applications are read back out of localStorage. */
export function ViewSkeleton({ variant }: { variant: "kanban" | "table" }) {
  if (variant === "table")
    return (
      <div className="mx-4 space-y-2 lg:mx-8">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-12 w-full" key={index} />
        ))}
      </div>
    );
  return (
    <div className="mx-4 flex gap-4 overflow-hidden lg:mx-8">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton className="h-96 w-[315px] shrink-0" key={index} />
      ))}
    </div>
  );
}

/** Full-page placeholder used before we know which view to show. */
export function WorkspaceSkeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-64 shrink-0 border-r bg-card p-3 md:block">
        <Skeleton className="h-7 w-28" />
        <div className="mt-6 space-y-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-9 w-full" key={index} />
          ))}
        </div>
      </div>
      <main className="flex-1 p-6 lg:p-8">
        <Skeleton className="h-11 w-full" />
        <div className="mt-6 flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-96 w-80 shrink-0" key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
