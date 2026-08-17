import { cn } from "@/lib/utils";

/**
 * Ascending, connected-point progress path — distinct from a generic
 * checkmark-in-a-circle. Renders in `currentColor` so it inherits the
 * primary accent by default and stays legible on white or transparent.
 */
export function TrackieLogo({
  className,
  showWordmark = false,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 28 28"
        className="size-6 shrink-0 text-primary"
        role="img"
        aria-label="Trackie"
      >
        <title>Trackie</title>
        <path
          d="M3 19.5 9.5 13l4 4L23 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 8h6v6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="3" cy="19.5" r="1.8" fill="currentColor" />
        <circle cx="9.5" cy="13" r="1.8" fill="currentColor" />
        <circle cx="13.5" cy="17" r="1.8" fill="currentColor" />
        <circle cx="23" cy="8" r="1.8" fill="currentColor" />
      </svg>
      {showWordmark ? (
        <span className="font-display text-lg font-semibold leading-none text-foreground">
          Trackie
        </span>
      ) : null}
    </span>
  );
}
