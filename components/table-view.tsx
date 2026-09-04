"use client";
import { ArrowDown, ChevronsUpDown } from "lucide-react";
import { deadlineLabel, formatDate } from "@/lib/applications";
import { type Application, type SortKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Table } from "@/components/ui/display";
import {
  PRIORITY_DOT,
  StageTrack,
  deadlineTone,
  deadlineToneClass,
  shortStage,
} from "@/components/stage-ladder";

const columns: Array<{ key: SortKey; label: string; className?: string }> = [
  { key: "company", label: "Company" },
  { key: "role", label: "Role" },
  { key: "stage", label: "Stage" },
  { key: "priority", label: "Priority" },
  { key: "industry", label: "Industry" },
  { key: "deadline", label: "Next deadline" },
  { key: "type", label: "Type" },
];

export function TableView({
  applications,
  sortBy,
  onSort,
  onOpen,
}: {
  applications: Application[];
  sortBy: SortKey;
  onSort: (key: SortKey) => void;
  onOpen: (app: Application) => void;
}) {
  return (
    <div className="mx-4 overflow-hidden rounded-xl border bg-card lg:mx-8">
      <Table>
        <thead>
          <tr className="border-b bg-muted/45">
            {columns.map((column) => {
              const active = sortBy === column.key;
              return (
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-0 text-left"
                  key={column.key}
                  aria-sort={active ? "ascending" : "none"}
                >
                  <button
                    type="button"
                    onClick={() => onSort(column.key)}
                    className={cn(
                      "eyebrow group -mx-2 flex h-11 items-center gap-1.5 px-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {column.label}
                    {active ? (
                      <ArrowDown className="size-3" />
                    ) : (
                      <ChevronsUpDown className="size-3 opacity-0 transition-opacity group-hover:opacity-60" />
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const tone = deadlineTone(app.nextStepDeadline);
            return (
              <tr
                key={app.id}
                onClick={() => onOpen(app)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onOpen(app);
                }}
                tabIndex={0}
                className="cursor-pointer border-t outline-none transition-colors hover:bg-muted/45 focus-visible:bg-accent"
              >
                <td className="whitespace-nowrap px-4 py-3.5 font-semibold">
                  {app.company || "—"}
                </td>
                <td className="min-w-40 px-4 py-3.5">{app.role || "—"}</td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <span className="flex items-center gap-2">
                    <StageTrack stage={app.stage} />
                    {shortStage(app.stage)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      aria-hidden
                      className={cn(
                        "size-2",
                        PRIORITY_DOT[app.priority],
                      )}
                    />
                    {app.priority}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                  {app.industry}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <span className="flex items-baseline gap-2 font-mono text-xs">
                    <span className="text-muted-foreground">
                      {formatDate(app.nextStepDeadline)}
                    </span>
                    {app.nextStepDeadline ? (
                      <span
                        className={cn(
                          deadlineToneClass[tone],
                          tone === "overdue" && "font-semibold",
                        )}
                      >
                        {deadlineLabel(app.nextStepDeadline)}
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                  {app.type}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
