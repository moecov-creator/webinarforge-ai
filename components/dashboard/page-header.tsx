// components/dashboard/page-header.tsx
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // right-side actions
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-8", className)}>
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold text-white leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-white/40 mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
