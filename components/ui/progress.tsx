// components/ui/progress.tsx
"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Visual style of the indicator bar */
  variant?: "default" | "gradient" | "success" | "warning" | "danger";
  /** Show the percentage label */
  showLabel?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = "gradient", showLabel = false, ...props }, ref) => {
  const pct = Math.min(100, Math.max(0, value ?? 0));

  const indicatorStyles: Record<string, string> = {
    default:   "bg-primary",
    gradient:  "bg-gradient-to-r from-purple-500 to-blue-500",
    success:   "bg-green-500",
    warning:   "bg-yellow-500",
    danger:    "bg-red-500",
  };

  return (
    <div className={cn("flex items-center gap-2", showLabel && "w-full")}>
      <ProgressPrimitive.Root
        ref={ref}
        value={value}
        className={cn(
          "relative h-1.5 w-full overflow-hidden rounded-full",
          "bg-white/8",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            indicatorStyles[variant] ?? indicatorStyles.gradient
          )}
          style={{ width: `${pct}%` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <span className="text-xs text-white/30 tabular-nums w-8 text-right flex-shrink-0">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
