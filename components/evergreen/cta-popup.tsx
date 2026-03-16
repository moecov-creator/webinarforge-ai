// components/evergreen/cta-popup.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, X } from "lucide-react";

type CTAType = "SOFT" | "MID" | "FINAL" | "URGENCY";

interface CTAPopupProps {
  type: CTAType;
  headline: string;
  body?: string | null;
  buttonText: string;
  buttonUrl?: string | null;
  onDismiss?: () => void;
  className?: string;
}

const CTA_STYLES: Record<CTAType, { border: string; bg: string; btn: string }> = {
  SOFT:    { border: "border-white/10",       bg: "bg-white/3",                          btn: "bg-white/8 hover:bg-white/12 text-white border-white/10 border" },
  MID:     { border: "border-blue-500/20",    bg: "bg-blue-500/8",                       btn: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/20 border" },
  FINAL:   { border: "border-purple-500/30",  bg: "bg-gradient-to-r from-purple-500/10 to-blue-500/10", btn: "gradient-brand border-0" },
  URGENCY: { border: "border-red-500/25",     bg: "bg-red-500/8",                        btn: "bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/20 border" },
};

export function CTAPopup({
  type,
  headline,
  body,
  buttonText,
  buttonUrl,
  onDismiss,
  className,
}: CTAPopupProps) {
  const styles = CTA_STYLES[type] ?? CTA_STYLES.MID;

  return (
    <div className={cn(
      "flex items-center gap-4 px-5 py-3.5 rounded-xl border",
      "animate-in slide-in-from-bottom-2 fade-in duration-300",
      styles.bg,
      styles.border,
      className
    )}>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight">{headline}</p>
        {body && (
          <p className="text-xs text-white/45 mt-0.5 truncate">{body}</p>
        )}
      </div>

      {/* Action button */}
      {buttonUrl && (
        <a href={buttonUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
          <Button
            size="sm"
            className={cn("text-xs h-8 px-4 flex-shrink-0", styles.btn)}
          >
            {buttonText}
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Button>
        </a>
      )}

      {/* Dismiss — only for SOFT cta */}
      {type === "SOFT" && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-white/20 hover:text-white/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
