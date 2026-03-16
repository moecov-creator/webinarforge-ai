// components/ui/badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1",
    "rounded-full border",
    "px-2.5 py-0.5",
    "text-xs font-medium",
    "transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    // Ensure SVG icons inside badges scale properly
    "[&_svg]:w-3 [&_svg]:h-3",
  ],
  {
    variants: {
      variant: {
        // Default — subtle outline style on dark bg
        default: [
          "border-transparent",
          "bg-primary/15 text-primary",
        ],
        // Secondary — muted/neutral
        secondary: [
          "border-transparent",
          "bg-white/8 text-white/50",
        ],
        // Destructive — errors, warnings
        destructive: [
          "border-transparent",
          "bg-destructive/15 text-destructive",
        ],
        // Outline — just a border
        outline: [
          "border-current",
          "text-foreground/60",
        ],
        // Success — published, active, connected
        success: [
          "border-transparent",
          "bg-green-500/15 text-green-400",
        ],
        // Warning — trial, pending
        warning: [
          "border-transparent",
          "bg-yellow-500/15 text-yellow-400",
        ],
        // Purple accent — plan names, highlights
        purple: [
          "border-purple-500/20",
          "bg-purple-500/15 text-purple-300",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
