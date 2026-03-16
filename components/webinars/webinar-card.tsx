// components/webinars/webinar-card.tsx
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit2, BarChart2, PlayCircle, Globe } from "lucide-react";

interface WebinarCardProps {
  id: string;
  title: string;
  niche: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED" | "PAUSED";
  mode: string;
  registrations: number;
  completionRate?: number;
  slug: string;
  updatedAt: string;
  hasWatermark?: boolean;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-500/15 text-green-400 border-green-500/20",
  DRAFT:     "bg-white/8 text-white/35 border-white/10",
  ARCHIVED:  "bg-white/5 text-white/20 border-white/8",
  PAUSED:    "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "Live",
  DRAFT:     "Draft",
  ARCHIVED:  "Archived",
  PAUSED:    "Paused",
};

export function WebinarCard({
  id,
  title,
  niche,
  status,
  mode,
  registrations,
  completionRate,
  slug,
  updatedAt,
  hasWatermark,
  className,
}: WebinarCardProps) {
  return (
    <div className={cn(
      "p-5 rounded-xl",
      "bg-white/3 border border-white/8",
      "hover:border-white/15 transition-all",
      "group",
      className
    )}>
      <div className="flex items-start justify-between gap-4">
        {/* Left — title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge className={cn("text-xs border", STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT)}>
              {STATUS_LABELS[status] ?? status}
            </Badge>
            <Badge className="text-xs bg-white/5 text-white/30 border-white/8">
              {niche}
            </Badge>
            <Badge className="text-xs bg-white/5 text-white/30 border-white/8">
              <Globe className="w-2.5 h-2.5 mr-1 inline" />
              {mode}
            </Badge>
            {hasWatermark && (
              <Badge className="text-xs bg-white/5 text-white/20 border-white/8">
                Watermark
              </Badge>
            )}
          </div>

          <Link href={`/dashboard/webinars/${id}`}>
            <h3 className="font-semibold text-white/85 group-hover:text-white transition-colors leading-snug mb-2 cursor-pointer">
              {title}
            </h3>
          </Link>

          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>{registrations} registrations</span>
            {completionRate !== undefined && completionRate > 0 && (
              <span>{completionRate}% completion</span>
            )}
            <span>Updated {updatedAt}</span>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {status === "PUBLISHED" && (
            <Link href={`/dashboard/evergreen/${slug}`}>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-white/35 hover:text-white h-8 px-2.5"
              >
                <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                Room
              </Button>
            </Link>
          )}
          <Link href={`/dashboard/analytics?webinar=${id}`}>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-white/35 hover:text-white h-8 px-2.5"
            >
              <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
              Stats
            </Button>
          </Link>
          <Link href={`/dashboard/webinars/${id}`}>
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-white/10 text-white/50 hover:text-white bg-white/3 h-8 px-2.5"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
