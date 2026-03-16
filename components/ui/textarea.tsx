// components/ui/textarea.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Layout
          "flex w-full",
          "min-h-[80px]",
          "rounded-lg",
          // Border + bg
          "border border-input bg-transparent",
          // Spacing
          "px-3 py-2",
          // Typography
          "text-sm text-foreground leading-relaxed",
          // Placeholder
          "placeholder:text-muted-foreground",
          // Shadow
          "shadow-sm",
          // Resize — allow vertical only by default
          "resize-y",
          // Transitions
          "transition-colors duration-150",
          // Focus
          "focus-visible:outline-none",
          "focus-visible:ring-1 focus-visible:ring-ring",
          "focus-visible:border-ring",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Scrollbar (thin on dark bg)
          "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
