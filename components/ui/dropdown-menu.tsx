"use client";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
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
          "z-50 min-w-48 rounded-lg border bg-popover p-1.5 text-popover-foreground shadow-lg",
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
        "flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none focus:bg-muted",
        className,
      )}
      {...props}
    />
  );
}
export const DropdownMenuSeparator = (
  props: Dropdown.DropdownMenuSeparatorProps,
) => <Dropdown.Separator className="-mx-1 my-1 h-px bg-border" {...props} />;
export const DropdownMenuLabel = (props: Dropdown.DropdownMenuLabelProps) => (
  <Dropdown.Label
    className="eyebrow px-2.5 pb-1 pt-2.5 text-muted-foreground"
    {...props}
  />
);
