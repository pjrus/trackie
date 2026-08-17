"use client";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
export const DropdownMenu = Dropdown.Root;
export const DropdownMenuTrigger = Dropdown.Trigger;
export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: Dropdown.DropdownMenuContentProps) {
  return (
    <Dropdown.Portal>
      <Dropdown.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          className,
        )}
        {...props}
      />
    </Dropdown.Portal>
  );
}
export function DropdownMenuItem({
  className,
  ...props
}: Dropdown.DropdownMenuItemProps) {
  return (
    <Dropdown.Item
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none focus:bg-muted",
        className,
      )}
      {...props}
    />
  );
}
export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: Dropdown.DropdownMenuCheckboxItemProps) {
  return (
    <Dropdown.CheckboxItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm outline-none focus:bg-muted",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2">
        <Dropdown.ItemIndicator>
          <Check className="size-4" />
        </Dropdown.ItemIndicator>
      </span>
      {children}
    </Dropdown.CheckboxItem>
  );
}
export const DropdownMenuSeparator = (
  props: Dropdown.DropdownMenuSeparatorProps,
) => <Dropdown.Separator className="-mx-1 my-1 h-px bg-border" {...props} />;
export const DropdownMenuLabel = (props: Dropdown.DropdownMenuLabelProps) => (
  <Dropdown.Label
    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
    {...props}
  />
);
