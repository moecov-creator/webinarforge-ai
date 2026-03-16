// app/(dashboard)/dashboard/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus, PlayCircle, TrendingUp, Users, BarChart2,
  ArrowRight, Zap, Globe, Clock, Star,
} from "lucide-react";

// In production, fetch from DB via server action / service
const MOCK_STATS = {
  totalWebinars: 4,
  publishedEvergreen: 2,
  plan: "PRO",
  trialDaysLeft: null,
  webinarsBuilt: 4,
  webinarLimit: null,
  registrationsThisMonth: 147,
  ctaClicksThisMonth: 31,
  completionRate: 0.42,
};

const RECENT_WEBINARS = [
  {
    id: "1",
    title: "The 3-Step System to Land High-Ticket Coaching Clients",
    niche: "Coaching",
    status: "PUBLISHED",
    registrations: 89,
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Real Estate Lead Machine: 10 Qualified Appointments/Month",
    niche: "Real Estate",
    status: "DRAFT",
    registrations: 0,
    updatedAt: "1 day ago",
  },
];

const QUICK_ACTIONS = [
  { label: "New Webinar", href: "/dashboard/webinars/new", icon: Plus, desc: "Generate with AI" },
  { label: "Browse Templates", href: "/dashboard/templates", icon: Star, desc: "Ready-to-use structures" },
  { label: "View Analytics", href: "/dashboard/analytics", icon: BarChart2, desc: "Track performance" },
  { label: "Invite Affiliates", href: "/dashboard/affiliates", icon: Users, desc: "30% recurring commission" },
];

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">Welcome back. Here's what's happening.</p>
        </div>
        <Link href="/dashboard/webinars/new">
          <Button className="gradient-brand border-0 hover:opacity-90 glow-on-hover">
            <Plus className="w-4 h-4 mr-2" />
            New Webinar
          </Button>
        </Link>
      </div>

      {/* Plan badge */}
      {MOCK_STATS.trialDaysLeft !== null && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-yellow-300">
                {MOCK_STATS.trialDaysLeft} days left in your free trial
              </p>
              <p className="text-xs text-yellow-400/60">Upgrade to keep your webinars and data</p>
            </div>
          </div>
          <Link href="/dashboard/billing">
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-400 text-black border-0 font-semibold">
              Upgrade Now
            </Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Webinars",
            value: MOCK_STATS.totalWebinars,
            icon: PlayCircle,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
          {
            label: "Published Evergreen",
            value: MOCK_STATS.publishedEvergreen,
            icon: Globe,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Registrations (30d)",
            value: MOCK_STATS.registrationsThisMonth,
            icon: Users,
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
          {
            label: "CTA Clicks (30d)",
            value: MOCK_STATS.ctaClicksThisMonth,
            icon: TrendingUp,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
          },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-white/3 border border-white/8">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <div className="font-display text-2xl font-bold text-white mb-0.5">
              {stat.value}
            </div>
            <div className="text-xs text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Webinars */}
        <div className="lg:col-span-2 rounded-xl bg-white/3 border border-white/8 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-display font-semibold text-sm text-white">Recent Webinars</h2>
            <Link href="/dashboard/webinars">
              <Button variant="ghost" size="sm" className="text-xs text-white/40 hover:text-white h-7">
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {RECENT_WEBINARS.map((webinar) => (
              <Link
                key={webinar.id}
                href={`/dashboard/webinars/${webinar.id}`}
                className="flex items-center justify-between p-5 hover:bg-white/3 transition-colors group"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                    {webinar.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/30">{webinar.niche}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-xs text-white/30">{webinar.updatedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {webinar.registrations > 0 && (
                    <span className="text-xs text-white/40">{webinar.registrations} regs</span>
                  )}
                  <Badge
                    className={`text-xs border-0 ${
                      webinar.status === "PUBLISHED"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-white/8 text-white/40"
                    }`}
                  >
                    {webinar.status}
                  </Badge>
                </div>
              </Link>
            ))}
            {RECENT_WEBINARS.length === 0 && (
              <div className="p-8 text-center">
                <PlayCircle className="w-8 h-8 text-white/15 mx-auto mb-3" />
                <p className="text-sm text-white/30">No webinars yet</p>
                <Link href="/dashboard/webinars/new">
                  <Button size="sm" className="mt-3 gradient-brand border-0 text-xs">
                    Create your first webinar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="font-display font-semibold text-sm text-white px-1">Quick Actions</h2>
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="p-4 rounded-xl bg-white/3 border border-white/8 hover:border-purple-500/30 hover:bg-white/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <action.icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{action.label}</p>
                    <p className="text-xs text-white/35">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}

          {/* Usage meter */}
          <div className="p-4 rounded-xl bg-white/3 border border-white/8 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Webinars this month</span>
              <span className="text-xs text-white/60">
                {MOCK_STATS.webinarsBuilt} / {MOCK_STATS.webinarLimit ?? "∞"}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/8">
              <div
                className="h-full rounded-full gradient-brand"
                style={{
                  width: MOCK_STATS.webinarLimit
                    ? `${(MOCK_STATS.webinarsBuilt / MOCK_STATS.webinarLimit) * 100}%`
                    : "30%",
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <Badge className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/20">
                {MOCK_STATS.plan} Plan
              </Badge>
              <Link href="/dashboard/billing">
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors">
                  Manage →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
