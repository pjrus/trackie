import { cn } from "@/lib/utils";

/**
 * The ladder, four rungs climbing to the right, each rung darker than the one
 * below it. It is the same shape as the pipeline bar in the workspace, drawn at
 * mark size — progress reads as intensity in both places.
 */
export function TrackieLogo({
  className,
  showWordmark = false,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 28 28"
        className="size-6 shrink-0 text-primary"
        aria-hidden
        focusable="false"
      >
        {[
          { x: 1.5, y: 20.4, opacity: 0.32 },
          { x: 5, y: 15, opacity: 0.52 },
          { x: 8.5, y: 9.6, opacity: 0.76 },
          { x: 12, y: 4.2, opacity: 1 },
        ].map((rung) => (
          <rect
            key={rung.y}
            x={rung.x}
            y={rung.y}
            width="13"
            height="3.6"
            fill="currentColor"
            opacity={rung.opacity}
          />
        ))}
      </svg>
      {showWordmark ? (
        <span className="font-display text-[17px] font-semibold leading-none text-foreground">
          Trackie
        </span>
      ) : null}
    </span>
  );
}
