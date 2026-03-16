// app/(dashboard)/dashboard/analytics/page.tsx
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, Users, PlayCircle, MousePointerClick,
  BarChart2, Eye, RefreshCw, ArrowUpRight,
} from "lucide-react";

// Mock analytics — in production, fetch from AnalyticsEvent via aggregation queries
const MOCK_OVERVIEW = {
  registrations: { value: 312, change: +18, label: "Total Registrations" },
  roomVisits: { value: 289, change: +12, label: "Room Visits" },
  completions: { value: 121, change: +8, label: "Completions" },
  ctaClicks: { value: 47, change: +23, label: "CTA Clicks" },
  replayViews: { value: 88, change: +5, label: "Replay Views" },
  affiliateReferrals: { value: 12, change: +2, label: "Affiliate Referrals" },
  trialConversions: { value: 4, change: +1, label: "Trial Conversions" },
  planUpgrades: { value: 2, change: 0, label: "Plan Upgrades" },
};

const WEBINAR_STATS = [
  { title: "3-Step System: High-Ticket Coaching Clients", registrations: 189, completionRate: 0.43, ctaClickRate: 0.18, status: "PUBLISHED" },
  { title: "Real Estate Lead Machine", registrations: 78, completionRate: 0.38, ctaClickRate: 0.12, status: "PUBLISHED" },
  { title: "SaaS Demo-to-Trial Converter", registrations: 45, completionRate: 0.51, ctaClickRate: 0.22, status: "DRAFT" },
];

const DROP_OFF_DATA = [
  { label: "0:00", pct: 100 },
  { label: "5:00", pct: 82 },
  { label: "15:00", pct: 71 },
  { label: "30:00", pct: 58 },
  { label: "45:00", pct: 44 },
  { label: "60:00", pct: 38 },
  { label: "75:00", pct: 34 },
];

function StatCard({ label, value, change, icon: Icon }: { label: string; value: number; change: number; icon: React.ElementType }) {
  const isPositive = change >= 0;
  return (
    <div className="p-5 rounded-xl bg-white/3 border border-white/8">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-4 h-4 text-white/30" />
        <span className={`text-xs font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? "+" : ""}{change}%
        </span>
      </div>
      <div className="font-display text-2xl font-bold text-white mb-0.5">{value.toLocaleString()}</div>
      <div className="text-xs text-white/35">{label}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-white/40 mt-1">Last 30 days performance across all webinars.</p>
        </div>
        <Badge className="bg-white/5 text-white/40 border-white/8 text-xs">Last 30 days</Badge>
      </div>

      {/* Overview grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Registrations" value={MOCK_OVERVIEW.registrations.value} change={MOCK_OVERVIEW.registrations.change} icon={Users} />
        <StatCard label="Room Visits" value={MOCK_OVERVIEW.roomVisits.value} change={MOCK_OVERVIEW.roomVisits.change} icon={Eye} />
        <StatCard label="Completions" value={MOCK_OVERVIEW.completions.value} change={MOCK_OVERVIEW.completions.change} icon={PlayCircle} />
        <StatCard label="CTA Clicks" value={MOCK_OVERVIEW.ctaClicks.value} change={MOCK_OVERVIEW.ctaClicks.change} icon={MousePointerClick} />
        <StatCard label="Replay Views" value={MOCK_OVERVIEW.replayViews.value} change={MOCK_OVERVIEW.replayViews.change} icon={RefreshCw} />
        <StatCard label="Affiliate Referrals" value={MOCK_OVERVIEW.affiliateReferrals.value} change={MOCK_OVERVIEW.affiliateReferrals.change} icon={Users} />
        <StatCard label="Trial Conversions" value={MOCK_OVERVIEW.trialConversions.value} change={MOCK_OVERVIEW.trialConversions.change} icon={TrendingUp} />
        <StatCard label="Plan Upgrades" value={MOCK_OVERVIEW.planUpgrades.value} change={MOCK_OVERVIEW.planUpgrades.change} icon={ArrowUpRight} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Webinar breakdown */}
        <div className="lg:col-span-2 rounded-xl bg-white/3 border border-white/8 overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h2 className="font-display font-semibold text-sm text-white">Webinar Performance</h2>
          </div>
          <div className="divide-y divide-white/5">
            {WEBINAR_STATS.map((webinar) => (
              <div key={webinar.title} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm text-white/70 leading-snug flex-1 mr-3">{webinar.title}</p>
                  <Badge className={`text-xs flex-shrink-0 ${webinar.status === "PUBLISHED" ? "bg-green-500/15 text-green-400 border-green-500/20" : "bg-white/8 text-white/30 border-white/10"}`}>
                    {webinar.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-white/3">
                    <p className="font-display text-base font-bold text-white">{webinar.registrations}</p>
                    <p className="text-xs text-white/30">Registrations</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/3">
                    <p className="font-display text-base font-bold text-white">{Math.round(webinar.completionRate * 100)}%</p>
                    <p className="text-xs text-white/30">Completion</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/3">
                    <p className="font-display text-base font-bold text-white">{Math.round(webinar.ctaClickRate * 100)}%</p>
                    <p className="text-xs text-white/30">CTA Click</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drop-off chart */}
        <div className="rounded-xl bg-white/3 border border-white/8 p-5">
          <h2 className="font-display font-semibold text-sm text-white mb-4">Audience Retention</h2>
          <p className="text-xs text-white/35 mb-5">% of viewers still watching at each timestamp (avg across all webinars)</p>
          <div className="space-y-2">
            {DROP_OFF_DATA.map((point) => (
              <div key={point.label} className="flex items-center gap-3">
                <span className="text-xs text-white/30 font-mono w-10 flex-shrink-0">{point.label}</span>
                <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${point.pct}%`,
                      background: `linear-gradient(90deg, hsl(262, 83%, 58%) 0%, hsl(220, 90%, 56%) 100%)`,
                      opacity: 0.4 + (point.pct / 100) * 0.6,
                    }}
                  />
                </div>
                <span className="text-xs text-white/40 w-8 text-right flex-shrink-0">{point.pct}%</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/20 mt-4 leading-relaxed">
            Pro tip: A sharp drop at 15 min suggests your hook isn't holding. Try adding a timed comment or stronger promise restatement at that point.
          </p>
        </div>
      </div>
    </div>
  );
}
