"use client";
import { ArrowUpDown, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/applications";
import { type Application, type SortKey } from "@/lib/types";
import { Badge, Table } from "@/components/ui/display";
import { Button } from "@/components/ui/button";

const columns: Array<{ key: SortKey; label: string }> = [
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
    <div className="mx-4 overflow-hidden rounded-lg border bg-card lg:mx-8">
      <Table>
        <thead className="bg-secondary/55">
          <tr>
            {columns.map((column) => (
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left"
                key={column.key}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="-ml-3 text-xs uppercase tracking-wider"
                  onClick={() => onSort(column.key)}
                >
                  {column.label}
                  <ArrowUpDown
                    className={`size-3.5 ${sortBy === column.key ? "text-primary" : "text-muted-foreground"}`}
                  />
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
              onClick={() => onOpen(app)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onOpen(app);
              }}
              tabIndex={0}
              className="border-t outline-none hover:bg-muted/45 focus-visible:bg-accent"
            >
              <td className="whitespace-nowrap px-4 py-4 font-semibold">
                {app.company || "—"}
              </td>
              <td className="min-w-48 px-4 py-4 font-display text-base">
                {app.role || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-4">
                <Badge>{app.stage}</Badge>
              </td>
              <td className="px-4 py-4">{app.priority}</td>
              <td className="min-w-48 px-4 py-4 text-muted-foreground">
                {app.industry}
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  {formatDate(app.nextStepDeadline)}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                {app.type}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
