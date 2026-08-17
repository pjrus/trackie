"use client";
import * as Alert from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
export const AlertDialog = Alert.Root;
export const AlertDialogTrigger = Alert.Trigger;
export const AlertDialogCancel = Alert.Cancel;
export const AlertDialogAction = Alert.Action;
export function AlertDialogContent({
  className,
  ...props
}: Alert.AlertDialogContentProps) {
  return (
    <Alert.Portal>
      <Alert.Overlay className="fixed inset-0 z-[60] bg-black/45" />
      <Alert.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg",
          className,
        )}
        {...props}
      />
    </Alert.Portal>
  );
}
export const AlertDialogTitle = ({
  className,
  ...props
}: Alert.AlertDialogTitleProps) => (
  <Alert.Title
    className={cn("font-display text-xl font-semibold", className)}
    {...props}
  />
);
export const AlertDialogDescription = ({
  className,
  ...props
}: Alert.AlertDialogDescriptionProps) => (
  <Alert.Description
    className={cn("mt-2 text-sm text-muted-foreground", className)}
    {...props}
  />
);
