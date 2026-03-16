// components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles — shared by all variants
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium text-sm",
    "rounded-lg",
    "ring-offset-background",
    "transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "select-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // Solid primary — used for main CTAs
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "active:scale-[0.98]",
        ],
        // Destructive — deletes, cancels
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
          "active:scale-[0.98]",
        ],
        // Outlined — secondary actions
        outline: [
          "border border-input bg-background text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "active:scale-[0.98]",
        ],
        // Secondary — filled but muted
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
          "active:scale-[0.98]",
        ],
        // Ghost — minimal, blends into dark bg
        ghost: [
          "text-foreground/60",
          "hover:bg-white/5 hover:text-foreground",
          "active:scale-[0.98]",
        ],
        // Link — looks like an anchor
        link: [
          "text-primary underline-offset-4",
          "hover:underline",
          "p-0 h-auto",
        ],
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-8 px-3 py-1.5 text-xs rounded-md",
        lg:      "h-11 px-6 py-2.5 text-base",
        xl:      "h-13 px-8 py-3 text-base",
        icon:    "h-9 w-9 p-0",
        "icon-sm": "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element (e.g. Link) using Radix Slot */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
