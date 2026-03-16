// components/ui/card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

// ── Root card ────────────────────────────────────────────────
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl",
      "border border-white/8",
      "bg-white/3",
      "text-foreground",
      "shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// ── Header ───────────────────────────────────────────────────
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-1.5",
      "p-5",
      // If there's a CardContent after, show a bottom border
      "[&:not(:last-child)]:border-b [&:not(:last-child)]:border-white/5",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ── Title ────────────────────────────────────────────────────
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display font-semibold text-sm text-white leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ── Description ──────────────────────────────────────────────
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-white/40 leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ── Content ──────────────────────────────────────────────────
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-5 pt-0", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// ── Footer ───────────────────────────────────────────────────
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center",
      "p-5 pt-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
