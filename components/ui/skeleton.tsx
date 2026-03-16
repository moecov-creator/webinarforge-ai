// components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rounded variant for avatar/icon placeholders */
  circle?: boolean;
}

function Skeleton({ className, circle, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse",
        "bg-white/6",
        circle ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    />
  );
}

// ── Preset skeletons for common patterns ─────────────────────

/** Skeleton for a single stat card */
function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-white/3 border border-white/8 space-y-3">
      <Skeleton className="h-9 w-9" />
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

/** Skeleton for a webinar list row */
function WebinarRowSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-white/3 border border-white/8 flex gap-4">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="flex gap-2 items-center">
        <Skeleton className="h-7 w-14" />
        <Skeleton className="h-7 w-14" />
      </div>
    </div>
  );
}

/** Skeleton for a presenter card */
function PresenterCardSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-white/3 border border-white/8 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

/** Skeleton for a dashboard page (stats + list) */
function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => <WebinarRowSkeleton key={i} />)}
      </div>
    </div>
  );
}

export { Skeleton, StatCardSkeleton, WebinarRowSkeleton, PresenterCardSkeleton, DashboardSkeleton };
