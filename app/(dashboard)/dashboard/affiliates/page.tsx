// app/(dashboard)/dashboard/affiliates/page.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Copy, Users, DollarSign, TrendingUp, Gift,
  ArrowRight, CheckCircle, ExternalLink,
} from "lucide-react";

// Mock data — replace with DB queries via server action
const MOCK_AFFILIATE = {
  status: "ACTIVE",
  referralCode: "DEMO30",
  commissionRate: 0.30,
  stats: {
    totalReferrals: 12,
    conversions: 4,
    pendingCommissions: 178.20,
    paidCommissions: 356.40,
    totalEarnings: 534.60,
  },
  recentCommissions: [
    { description: "Starter plan — Casey J. (month 3)", amount: 29.10, status: "APPROVED", date: "Mar 12" },
    { description: "Pro plan — Riley M. (month 1)", amount: 89.10, status: "PENDING", date: "Mar 8" },
    { description: "Starter plan — Casey J. (month 2)", amount: 29.10, status: "PAID", date: "Feb 12" },
    { description: "Starter plan — Casey J. (month 1)", amount: 29.10, status: "PAID", date: "Jan 12" },
  ],
};

const PROMO_ASSETS = [
  { name: "Email Swipe Copy", desc: "Ready-to-send email sequences", type: "copy" },
  { name: "Social Media Graphics", desc: "Branded images for posts", type: "image" },
  { name: "Banner Ads", desc: "Multiple sizes for display ads", type: "banner" },
  { name: "Video Script", desc: "YouTube/TikTok promo script", type: "video" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    PAID: "bg-green-500/15 text-green-400 border-green-500/20",
  };
  return (
    <Badge className={`text-xs border ${styles[status] ?? "bg-white/10 text-white/40"}`}>
      {status}
    </Badge>
  );
}

export default function AffiliatesPage() {
  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://webinarforge.ai"}?ref=${MOCK_AFFILIATE.referralCode}`;

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Affiliates</h1>
          <p className="text-sm text-white/40 mt-1">Earn 30% recurring commission on every referral.</p>
        </div>
        <Badge className="bg-green-500/15 text-green-400 border-green-500/20 px-3 py-1.5">
          <CheckCircle className="w-3.5 h-3.5 mr-1.5 inline" />
          Active Affiliate
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Referrals", value: MOCK_AFFILIATE.stats.totalReferrals, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Conversions", value: MOCK_AFFILIATE.stats.conversions, icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Pending Earnings", value: `$${MOCK_AFFILIATE.stats.pendingCommissions.toFixed(2)}`, icon: DollarSign, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Total Earned", value: `$${MOCK_AFFILIATE.stats.totalEarnings.toFixed(2)}`, icon: Gift, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-white/3 border border-white/8">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="font-display text-2xl font-bold text-white mb-0.5">{stat.value}</div>
            <div className="text-xs text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Referral link */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white/3 border border-white/8">
          <h2 className="font-display font-semibold text-sm text-white mb-1">Your Referral Link</h2>
          <p className="text-xs text-white/35 mb-4">Share this link to earn 30% recurring commission on every paid plan.</p>

          <div className="flex gap-2 mb-4">
            <Input
              value={referralUrl}
              readOnly
              className="bg-white/5 border-white/10 text-white/60 text-sm font-mono"
            />
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-white/60 hover:text-white bg-white/5 flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg bg-purple-500/8 border border-purple-500/15">
            <div className="text-center px-3 border-r border-purple-500/15">
              <div className="font-display text-xl font-bold text-purple-300">30%</div>
              <div className="text-xs text-purple-400/60">Commission</div>
            </div>
            <div className="text-center px-3 border-r border-purple-500/15">
              <div className="font-display text-xl font-bold text-purple-300">Recurring</div>
              <div className="text-xs text-purple-400/60">Every month</div>
            </div>
            <div className="text-center px-3">
              <div className="font-display text-xl font-bold text-purple-300">60 days</div>
              <div className="text-xs text-purple-400/60">Cookie window</div>
            </div>
          </div>
        </div>

        {/* Commission rates */}
        <div className="p-6 rounded-xl bg-white/3 border border-white/8">
          <h2 className="font-display font-semibold text-sm text-white mb-4">Commission by Plan</h2>
          <div className="space-y-3">
            {[
              { plan: "Starter", price: "$97/mo", commission: "$29.10" },
              { plan: "Pro", price: "$297/mo", commission: "$89.10" },
              { plan: "Scale", price: "$997/mo", commission: "$299.10" },
            ].map((row) => (
              <div key={row.plan} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{row.plan}</p>
                  <p className="text-xs text-white/30">{row.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">{row.commission}</p>
                  <p className="text-xs text-white/30">per month</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden mb-6">
        <div className="p-5 border-b border-white/5">
          <h2 className="font-display font-semibold text-sm text-white">Recent Commissions</h2>
        </div>
        <div className="divide-y divide-white/5">
          {MOCK_AFFILIATE.recentCommissions.map((commission, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-white/70">{commission.description}</p>
                <p className="text-xs text-white/30 mt-0.5">{commission.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">
                  +${commission.amount.toFixed(2)}
                </span>
                <StatusBadge status={commission.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Assets */}
      <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h2 className="font-display font-semibold text-sm text-white">Promo Resources</h2>
        </div>
        <div className="grid sm:grid-cols-2 divide-white/5 divide-y sm:divide-x">
          {PROMO_ASSETS.map((asset) => (
            <div key={asset.name} className="p-4 flex items-center justify-between hover:bg-white/2 transition-colors">
              <div>
                <p className="text-sm font-medium text-white">{asset.name}</p>
                <p className="text-xs text-white/35">{asset.desc}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-white/30 hover:text-white h-8 w-8 p-0">
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
