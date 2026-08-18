"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export function TooltipContent(props: TooltipPrimitive.TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={5}
        className="z-50 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md"
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
