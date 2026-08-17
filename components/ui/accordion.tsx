"use client";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = (props: AccordionPrimitive.AccordionItemProps) => (
  <AccordionPrimitive.Item className="border-b" {...props} />
);
export function AccordionTrigger({
  children,
  ...props
}: AccordionPrimitive.AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        className="group flex w-full items-center justify-between py-4 text-left text-sm font-semibold hover:text-primary"
        {...props}
      >
        {children}
        <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
export const AccordionContent = (
  props: AccordionPrimitive.AccordionContentProps,
) => (
  <AccordionPrimitive.Content
    className="overflow-hidden pb-4 text-sm text-muted-foreground"
    {...props}
  />
);
