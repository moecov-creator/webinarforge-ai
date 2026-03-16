// app/(dashboard)/dashboard/webinars/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, PlayCircle, Globe, Edit2, BarChart2, MoreHorizontal, Zap } from "lucide-react";

const MOCK_WEBINARS = [
  {
    id: "1",
    title: "The 3-Step System to Land High-Ticket Coaching Clients Without Cold Outreach",
    niche: "Coach / Consultant",
    status: "PUBLISHED",
    mode: "EVERGREEN",
    registrations: 189,
    completionRate: 43,
    slug: "demo-coaching-abc123",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Real Estate Lead Machine: 10 Qualified Appointments Every Month",
    niche: "Real Estate",
    status: "PUBLISHED",
    mode: "EVERGREEN",
    registrations: 78,
    completionRate: 38,
    slug: "real-estate-leads-xyz",
    updatedAt: "1 day ago",
  },
  {
    id: "3",
    title: "SaaS Demo-to-Trial: Convert Cold Traffic Into Paying Users",
    niche: "SaaS",
    status: "DRAFT",
    mode: "EVERGREEN",
    registrations: 0,
    completionRate: 0,
    slug: "saas-demo-def456",
    updatedAt: "3 days ago",
  },
  {
    id: "4",
    title: "The Local Service Authority Blueprint",
    niche: "Local Services",
    status: "DRAFT",
    mode: "EVERGREEN",
    registrations: 0,
    completionRate: 0,
    slug: "local-service-ghi789",
    updatedAt: "5 days ago",
  },
];

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={`text-xs border ${status === "PUBLISHED" ? "bg-green-500/15 text-green-400 border-green-500/20" : "bg-white/8 text-white/35 border-white/10"}`}>
      {status === "PUBLISHED" ? "Live" : "Draft"}
    </Badge>
  );
}

export default function WebinarsPage() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Webinars</h1>
          <p className="text-sm text-white/40 mt-1">{MOCK_WEBINARS.length} webinars in your workspace.</p>
        </div>
        <Link href="/dashboard/webinars/new">
          <Button className="gradient-brand border-0 hover:opacity-90 glow-on-hover">
            <Plus className="w-4 h-4 mr-2" />
            New Webinar
          </Button>
        </Link>
      </div>

      {/* Webinar cards */}
      <div className="space-y-3">
        {MOCK_WEBINARS.map((webinar) => (
          <div
            key={webinar.id}
            className="p-5 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <StatusBadge status={webinar.status} />
                  <Badge className="bg-white/5 text-white/30 border-white/8 text-xs">{webinar.niche}</Badge>
                  <Badge className="bg-white/5 text-white/30 border-white/8 text-xs">
                    <Globe className="w-2.5 h-2.5 mr-1 inline" />
                    {webinar.mode}
                  </Badge>
                </div>
                <h3 className="font-semibold text-white group-hover:text-purple-200 transition-colors mb-2 leading-snug">
                  {webinar.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-white/30">
                  <span>{webinar.registrations} registrations</span>
                  {webinar.completionRate > 0 && <span>{webinar.completionRate}% completion rate</span>}
                  <span>Updated {webinar.updatedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {webinar.status === "PUBLISHED" && (
                  <Link href={`/dashboard/evergreen/${webinar.slug}`}>
                    <Button size="sm" variant="ghost" className="text-xs text-white/35 hover:text-white h-8">
                      <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                      Room
                    </Button>
                  </Link>
                )}
                <Link href={`/dashboard/analytics?webinar=${webinar.id}`}>
                  <Button size="sm" variant="ghost" className="text-xs text-white/35 hover:text-white h-8">
                    <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
                    Stats
                  </Button>
                </Link>
                <Link href={`/dashboard/webinars/${webinar.id}`}>
                  <Button size="sm" variant="outline" className="text-xs border-white/10 text-white/50 hover:text-white bg-white/3 h-8">
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state prompt */}
      {MOCK_WEBINARS.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-5 opacity-40">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white mb-2">No webinars yet</h3>
          <p className="text-sm text-white/35 mb-6">Generate your first evergreen webinar with AI in under 10 minutes.</p>
          <Link href="/dashboard/webinars/new">
            <Button className="gradient-brand border-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Webinar
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
