"use client";

import { Plus, SlidersHorizontal } from "lucide-react";
import { useWorkspace } from "@/components/workspace-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/display";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TrackieLogo } from "@/components/trackie-logo";

/**
 * Sticky bar at the top of a view. On desktop the sidebar carries the brand and
 * this names the view; on mobile the sidebar is hidden, so the heading takes the
 * brand and the view name moves to the line beneath it.
 */
export function WorkspaceHeader({ title }: { title: string }) {
  const { applications, filtered, openNewApplication } = useWorkspace();
  const filtering = filtered.length !== applications.length;
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur-md lg:px-8">
      <SidebarTrigger className="-ml-1 shrink-0" />
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-lg font-semibold leading-tight">
          <span className="md:hidden">Trackie</span>
          <span className="hidden md:inline">{title}</span>
        </h1>
        <p className="truncate font-mono text-[11px] leading-tight text-muted-foreground">
          <span className="md:hidden">{title} · </span>
          {filtering
            ? `${filtered.length} of ${applications.length} shown`
            : `${applications.length} tracked`}
        </p>
      </div>
      <Button onClick={openNewApplication} className="shrink-0">
        <Plus className="size-4" />
        <span className="max-sm:sr-only">New application</span>
      </Button>
    </header>
  );
}

/** Shown by either view when the current filters match nothing. */
export function WorkspaceEmptyState() {
  const { applications, clearFilters, openNewApplication } = useWorkspace();
  const hasApplications = applications.length > 0;
  return (
    <div className="mx-4 grid min-h-80 place-items-center rounded-xl border border-dashed px-6 text-center lg:mx-8">
      <div className="max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-xl border bg-card text-primary shadow-sm">
          {hasApplications ? (
            <SlidersHorizontal className="size-5" />
          ) : (
            <TrackieLogo />
          )}
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold">
          {hasApplications
            ? "No applications match these filters"
            : "Start your pipeline"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {hasApplications
            ? "Widen the search or clear the filters to see the rest of your pipeline."
            : "Add the first opportunity you are chasing. Everything you record stays in this browser."}
        </p>
        {hasApplications ? (
          <Button className="mt-6" variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button className="mt-6" onClick={openNewApplication}>
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
      <div className="mx-4 overflow-hidden rounded-xl border bg-card lg:mx-8">
        <Skeleton className="h-11 w-full rounded-none opacity-60" />
        {Array.from({ length: 6 }, (_, index) => (
          <div className="border-t px-4 py-4" key={index}>
            <Skeleton className="h-4 w-[38%]" />
          </div>
        ))}
      </div>
    );
  return (
    <div className="mx-4 flex gap-5 overflow-hidden lg:mx-8">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="w-[300px] shrink-0 space-y-3" key={index}>
          <Skeleton className="h-[3px] w-full rounded-none" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

/** Full-page placeholder used before we know which view to show. */
export function WorkspaceSkeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-64 shrink-0 border-r bg-sidebar p-3 md:block">
        <Skeleton className="h-7 w-28" />
        <div className="mt-8 space-y-2">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton className="h-9 w-full" key={index} />
          ))}
        </div>
      </div>
      <main className="min-w-0 flex-1 p-4 lg:p-8">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="mt-6 flex gap-5 overflow-hidden">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-96 w-[300px] shrink-0 rounded-xl" key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
