// components/dashboard/stat-card.tsx
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;       // percentage change, positive or negative
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  description?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  iconColor = "text-purple-400",
  iconBg = "bg-purple-500/10",
  className,
  description,
}: StatCardProps) {
  const hasChange = change !== undefined;
  const isPositive = hasChange && change > 0;
  const isNeutral = hasChange && change === 0;

  return (
    <div className={cn(
      "p-5 rounded-xl",
      "bg-white/3 border border-white/8",
      "hover:border-white/12 transition-colors",
      className
    )}>
      {/* Icon */}
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", iconBg)}>
        <Icon className={cn("w-4 h-4", iconColor)} />
      </div>

      {/* Value */}
      <div className="font-display text-2xl font-bold text-white mb-0.5 tabular-nums">
        {value}
      </div>

      {/* Label + trend */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/40 flex-1">{label}</span>
        {hasChange && (
          <span className={cn(
            "flex items-center gap-0.5 text-xs font-medium",
            isNeutral ? "text-white/25" : isPositive ? "text-green-400" : "text-red-400"
          )}>
            {isNeutral
              ? <Minus className="w-3 h-3" />
              : isPositive
              ? <TrendingUp className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />
            }
            {isPositive ? "+" : ""}{change}%
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-white/25 mt-1">{description}</p>
      )}
    </div>
  );
}
