// components/dashboard/usage-meter.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface UsageMeterProps {
  label: string;
  current: number;
  limit: number | null; // null = unlimited
  plan: string;
  className?: string;
  linkHref?: string;
  linkLabel?: string;
}

export function UsageMeter({
  label,
  current,
  limit,
  plan,
  className,
  linkHref = "/dashboard/billing",
  linkLabel = "Manage →",
}: UsageMeterProps) {
  const isUnlimited = limit === null;
  const pct = isUnlimited ? 30 : Math.min(100, (current / limit) * 100);
  const isNearLimit = !isUnlimited && pct >= 80;
  const isAtLimit = !isUnlimited && current >= limit;

  return (
    <div className={cn("p-4 rounded-xl bg-white/3 border border-white/8", className)}>
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/40">{label}</span>
        <span className={cn(
          "text-xs font-medium",
          isAtLimit ? "text-red-400" : isNearLimit ? "text-yellow-400" : "text-white/60"
        )}>
          {current} / {isUnlimited ? "∞" : limit}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden mb-2">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isAtLimit
              ? "bg-red-500"
              : isNearLimit
              ? "bg-yellow-500"
              : "bg-gradient-to-r from-purple-500 to-blue-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Plan badge + action link */}
      <div className="flex items-center justify-between">
        <Badge className="text-[10px] bg-purple-500/10 text-purple-300 border-purple-500/20 px-2 py-0.5">
          {plan}
        </Badge>
        {linkHref && (
          <Link href={linkHref} className="text-xs text-white/25 hover:text-white/60 transition-colors">
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
