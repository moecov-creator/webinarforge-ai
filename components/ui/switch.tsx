// components/ui/switch.tsx
"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      // Layout
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer",
      "items-center rounded-full",
      // Border
      "border-2 border-transparent",
      // Transition
      "transition-colors duration-200",
      // Focus
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      // Disabled
      "disabled:cursor-not-allowed disabled:opacity-40",
      // Off state
      "bg-white/10",
      // On state
      "data-[state=checked]:bg-purple-500",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full",
        "bg-white shadow-sm",
        "ring-0",
        "transition-transform duration-200",
        "data-[state=unchecked]:translate-x-0",
        "data-[state=checked]:translate-x-4"
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
