// components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional left-side icon or adornment */
  startAdornment?: React.ReactNode;
  /** Optional right-side icon or adornment */
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startAdornment, endAdornment, ...props }, ref) => {
    // When adornments are present, wrap in a relative container
    if (startAdornment || endAdornment) {
      return (
        <div className="relative flex items-center">
          {startAdornment && (
            <div className="absolute left-3 flex items-center pointer-events-none text-white/30">
              {startAdornment}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              // Base
              "flex h-9 w-full rounded-lg",
              "border border-input bg-transparent",
              "text-sm text-foreground",
              "shadow-sm",
              // Placeholder
              "placeholder:text-muted-foreground",
              // Padding — adjust for adornments
              startAdornment ? "pl-9" : "px-3",
              endAdornment ? "pr-9" : "px-3",
              "py-2",
              // States
              "transition-colors duration-150",
              "focus-visible:outline-none",
              "focus-visible:ring-1 focus-visible:ring-ring",
              "focus-visible:border-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              // File input
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              className
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute right-3 flex items-center pointer-events-none text-white/30">
              {endAdornment}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-lg",
          "border border-input bg-transparent",
          "px-3 py-2",
          "text-sm text-foreground",
          "shadow-sm",
          "placeholder:text-muted-foreground",
          "transition-colors duration-150",
          "focus-visible:outline-none",
          "focus-visible:ring-1 focus-visible:ring-ring",
          "focus-visible:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
