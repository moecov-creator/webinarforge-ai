// components/ui/toast.tsx
"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;

// ── Viewport (where toasts render) ──────────────────────────
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100]",
      "flex max-h-screen w-full flex-col-reverse gap-2",
      "p-4 sm:max-w-[380px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

// ── Toast variants ───────────────────────────────────────────
const toastVariants = cva(
  [
    "group pointer-events-auto relative",
    "flex w-full items-start justify-between gap-3",
    "overflow-hidden rounded-xl",
    "border",
    "p-4",
    "shadow-xl shadow-black/40",
    "transition-all duration-300",
    // Radix state animations
    "data-[swipe=cancel]:translate-x-0",
    "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=move]:transition-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
    "data-[state=open]:slide-in-from-bottom-full",
  ],
  {
    variants: {
      variant: {
        default: "bg-[#13131f] border-white/10 text-white",
        success: "bg-green-500/10 border-green-500/20 text-white",
        destructive: "bg-red-500/10 border-red-500/20 text-white",
        warning: "bg-yellow-500/10 border-yellow-500/20 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ── Toast root ───────────────────────────────────────────────
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
));
Toast.displayName = ToastPrimitive.Root.displayName;

// ── Action button ────────────────────────────────────────────
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-lg",
      "border border-white/15 bg-white/5",
      "px-3 py-1.5 text-xs font-medium text-white",
      "transition-colors hover:bg-white/10",
      "focus:outline-none focus:ring-1 focus:ring-ring",
      "disabled:pointer-events-none disabled:opacity-40",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

// ── Close button ─────────────────────────────────────────────
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    toast-close=""
    className={cn(
      "shrink-0 rounded-md p-1",
      "text-white/30 hover:text-white",
      "transition-colors",
      "focus:outline-none focus:ring-1 focus:ring-ring",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

// ── Title ────────────────────────────────────────────────────
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold text-white leading-tight", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

// ── Description ──────────────────────────────────────────────
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-xs text-white/50 leading-relaxed", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
