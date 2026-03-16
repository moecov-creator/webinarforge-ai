// components/dashboard/empty-state.tsx
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      "py-16 px-8 text-center",
      className
    )}>
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white/20" />
      </div>
      <h3 className="font-display font-semibold text-base text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-white/35 max-w-xs leading-relaxed mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}
