// components/ui/tabs.tsx
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

// ── List ─────────────────────────────────────────────────────
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1",
      "rounded-xl",
      "bg-white/5 border border-white/8",
      "p-1",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// ── Trigger ──────────────────────────────────────────────────
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
      "rounded-lg px-3 py-1.5",
      "text-xs font-medium",
      "transition-all duration-150",
      // Inactive state
      "text-white/40",
      "hover:text-white/70",
      // Active state — Radix adds data-[state=active]
      "data-[state=active]:bg-white/8",
      "data-[state=active]:text-white",
      "data-[state=active]:shadow-sm",
      // Focus
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      // Disabled
      "disabled:pointer-events-none disabled:opacity-40",
      // Icon sizing
      "[&_svg]:w-3.5 [&_svg]:h-3.5",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// ── Content ──────────────────────────────────────────────────
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      // Entry animation
      "data-[state=active]:animate-in data-[state=active]:fade-in-0",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
