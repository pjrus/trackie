"use client";
import { ListFilter, Search, X } from "lucide-react";
import { DEFAULT_FILTERS } from "@/lib/constants";
import {
  EMPLOYMENT_TYPES,
  INDUSTRIES,
  PRIORITIES,
  STAGES,
  type ApplicationFilters,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/controls";
import { Input, Label } from "@/components/ui/form-controls";
import { Separator } from "@/components/ui/display";

function Group<T extends string>({
  title,
  values,
  selected,
  toggle,
}: {
  title: string;
  values: readonly T[];
  selected: T[];
  toggle: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </legend>
      {values.map((value) => (
        <label className="flex items-center gap-2 text-sm" key={value}>
          <Checkbox
            checked={selected.includes(value)}
            onCheckedChange={() => toggle(value)}
          />
          {value}
        </label>
      ))}
    </fieldset>
  );
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: ApplicationFilters;
  onChange: (filters: ApplicationFilters) => void;
}) {
  const toggleArray = <
    K extends "stages" | "priorities" | "industries" | "types",
  >(
    key: K,
    value: ApplicationFilters[K][number],
  ) => {
    const selected = filters[key] as string[];
    onChange({
      ...filters,
      [key]: selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    });
  };
  const advancedCount =
    filters.stages.length +
    filters.priorities.length +
    filters.industries.length +
    filters.types.length +
    Number(!!filters.deadlineFrom) +
    Number(!!filters.deadlineTo);
  const active =
    !!filters.search ||
    filters.dueThisWeek ||
    filters.activeOnly ||
    advancedCount > 0;
  return (
    <div className="flex flex-col gap-3 px-4 py-5 lg:flex-row lg:items-center lg:px-8">
      <div className="relative min-w-0 max-w-xs flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-11 bg-card pl-10"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Search company, role, or tag…"
          aria-label="Search applications"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.dueThisWeek ? "default" : "secondary"}
          onClick={() =>
            onChange({ ...filters, dueThisWeek: !filters.dueThisWeek })
          }
        >
          Due this week
        </Button>
        <Button
          variant={filters.activeOnly ? "default" : "secondary"}
          onClick={() =>
            onChange({ ...filters, activeOnly: !filters.activeOnly })
          }
        >
          Active only
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">
              <ListFilter className="size-4" />
              Filters
              {advancedCount ? (
                <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  {advancedCount}
                </span>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="max-h-[75dvh] w-[min(600px,calc(100vw-2rem))] overflow-y-auto p-5"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Group
                title="Stage"
                values={STAGES}
                selected={filters.stages}
                toggle={(value) => toggleArray("stages", value)}
              />
              <Group
                title="Priority"
                values={PRIORITIES}
                selected={filters.priorities}
                toggle={(value) => toggleArray("priorities", value)}
              />
              <Group
                title="Industry"
                values={INDUSTRIES}
                selected={filters.industries}
                toggle={(value) => toggleArray("industries", value)}
              />
              <Group
                title="Employment type"
                values={EMPLOYMENT_TYPES}
                selected={filters.types}
                toggle={(value) => toggleArray("types", value)}
              />
            </div>
            <Separator className="my-5" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deadline-from">Deadline from</Label>
                <Input
                  id="deadline-from"
                  type="date"
                  value={filters.deadlineFrom}
                  onChange={(event) =>
                    onChange({ ...filters, deadlineFrom: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline-to">Deadline to</Label>
                <Input
                  id="deadline-to"
                  type="date"
                  value={filters.deadlineTo}
                  onChange={(event) =>
                    onChange({ ...filters, deadlineTo: event.target.value })
                  }
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {active ? (
          <Button
            variant="ghost"
            onClick={() => onChange({ ...DEFAULT_FILTERS })}
          >
            <X className="size-4" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
