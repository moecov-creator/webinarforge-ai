// app/(dashboard)/dashboard/affiliates/page.tsx
"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Copy, Users, DollarSign, TrendingUp, Gift,
  CheckCircle, ExternalLink, Mail, ChevronDown, ChevronUp, Check,
} from "lucide-react"

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
}

const PROMO_ASSETS = [
  { name: "Email Swipe Copy", desc: "Ready-to-send email sequences", type: "copy" },
  { name: "Social Media Graphics", desc: "Branded images for posts", type: "image" },
  { name: "Banner Ads", desc: "Multiple sizes for display ads", type: "banner" },
  { name: "Video Script", desc: "YouTube/TikTok promo script", type: "video" },
]

// ─── Email swipe data ─────────────────────────────────────────────────────────
const EMAIL_SWIPES = [
  {
    number: 1,
    subjects: [
      "If building webinars stresses you out, read this",
      "Webinarforge AI makes the hardest part easier",
    ],
    body: `Hi [First Name],

If you've ever sat down to build a webinar and felt stuck before you even started, you're not alone.

The hardest part isn't presenting.
It's structuring the flow.

What do I say first?
How do I transition?
How do I make the offer naturally?

Webinarforge AI helps by generating a structured webinar framework based on proven models.

Right now, the Starter plan is $39/month.

It's a practical way to move from idea to structured presentation without overcomplicating things.

See how Webinarforge works here:
[Affiliate Link]

To your next webinar,
[Your Name]`,
  },
  {
    number: 2,
    subjects: [
      "Planning a webinar soon? This will help",
      "Build the structure before you build the slides",
    ],
    body: `Hey [First Name],

A strong webinar isn't just good content. It's sequence.

Hook.
Story.
Belief shifts.
Offer transition.

Most people try to figure that out while also designing slides.

Webinarforge AI separates those problems. It builds the framework first so you're not guessing.

Starter is $39/month right now.

You can build your webinar, refine it, and turn it into a repeatable asset.

Start here:
[Affiliate Link]

Show up prepared,
[Your Name]`,
  },
  {
    number: 3,
    subjects: [
      "Your next webinar should feel clearer",
      "Stop winging your webinar flow",
    ],
    body: `Hi [First Name],

When a webinar feels scattered, conversions suffer.

Not because the offer is bad.
But because the structure isn't tight.

Webinarforge AI generates a clear presentation structure so your message builds logically toward your offer.

Starter is $39/month.

If webinars are part of your strategy for courses, coaching, SaaS, or services, this simplifies the hardest step.

Grab access here:
[Affiliate Link]

In your corner,
[Your Name]`,
  },
  {
    number: 4,
    subjects: [
      "Build a repeatable webinar system",
      "Stop starting from scratch every time",
    ],
    body: `Hey [First Name],

The real leverage of webinars isn't one event.

It's building a repeatable system.

One structured presentation you can refine, improve, and eventually automate.

Webinarforge AI helps you create that foundation quickly.

Starter is $39/month.

That's enough runway to build your presentation framework and start refining it.

Get started here:
[Affiliate Link]

Build it once, improve it often,
[Your Name]`,
  },
  {
    number: 5,
    subjects: [
      "A simple 90-day challenge",
      "If you want momentum, start here",
    ],
    body: `Hi [First Name],

If you want a simple plan for the next 90 days, here it is:

Build one webinar.

One focused topic.
One structured flow.
One clear offer.

Webinarforge AI helps you create the structure so you're not guessing.

Starter is $39/month.

That's a practical way to move from idea to presentation without overthinking it.

Start here:
[Affiliate Link]

You might be surprised what one webinar unlocks,
[Your Name]`,
  },
  {
    number: 6,
    subjects: [
      "Webinar confidence starts with clarity",
      "The structure makes the difference",
    ],
    body: `Hey [First Name],

A lot of people avoid webinars because they're unsure about the flow.

When the structure is clear, delivery becomes easier.

Webinarforge AI generates that structure for you.

Starter is $39/month.

If webinars are on your roadmap this year, this is a smart place to begin.

See the details here:
[Affiliate Link]

Rooting for you,
[Your Name]`,
  },
  {
    number: 7,
    subjects: [
      "Quick reminder before this ends",
      "Last chance: Webinarforge Starter",
    ],
    body: `Hi [First Name],

Quick reminder in case you meant to circle back.

If you want to build webinars with clearer structure and less friction, this is a good time to try Webinarforge AI.

Starter is $39/month for a limited time.

That gives you room to build, refine, and turn your presentation into an asset.

Claim access here:
[Affiliate Link]

Keep it simple. Build one. Improve it.
[Your Name]`,
  },
]

// ─── Helper components ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    PENDING:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    PAID:     "bg-green-500/15 text-green-400 border-green-500/20",
  }
  return (
    <Badge className={`text-xs border ${styles[status] ?? "bg-white/10 text-white/40"}`}>
      {status}
    </Badge>
  )
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
        copied
          ? "border-green-500/40 bg-green-500/10 text-green-400"
          : "border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20"
      }`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : label}
    </button>
  )
}

function EmailSwipeCard({ email, affiliateLink }: {
  email: typeof EMAIL_SWIPES[0]
  affiliateLink: string
}) {
  const [open, setOpen] = useState(false)
  const fullBody = email.body.replace("[Affiliate Link]", affiliateLink)

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden bg-white/2">
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400 flex-shrink-0">
            {email.number}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {email.number === 7 ? "Email 7 — Closing / Urgency" : `Email ${email.number}`}
            </p>
            <p className="text-xs text-white/35 mt-0.5 truncate max-w-xs">{email.subjects[0]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <CopyButton text={fullBody} label="Copy Email" />
          {open
            ? <ChevronUp className="w-4 h-4 text-white/30" />
            : <ChevronDown className="w-4 h-4 text-white/30" />
          }
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-white/8 p-4 space-y-4">

          {/* Subject line options */}
          <div>
            <p className="text-xs text-white/40 uppercase font-semibold tracking-wider mb-2">Subject Line Options</p>
            <div className="space-y-2">
              {email.subjects.map((subject, i) => (
                <div key={i} className="flex items-center justify-between gap-3 bg-white/4 border border-white/8 rounded-lg px-3 py-2">
                  <p className="text-sm text-white/80 flex-1">{subject}</p>
                  <CopyButton text={subject} label="Copy" />
                </div>
              ))}
            </div>
          </div>

          {/* Email body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/40 uppercase font-semibold tracking-wider">Email Body</p>
              <CopyButton text={fullBody} label="Copy Full Email" />
            </div>
            <pre className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap bg-white/3 border border-white/8 rounded-xl p-4 font-sans">
              {fullBody}
            </pre>
          </div>

        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AffiliatesPage() {
  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://webinarforge.ai"}/early-bird?ref=${MOCK_AFFILIATE.referralCode}`
  const [linkCopied, setLinkCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(referralUrl)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

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
          { label: "Total Referrals",   value: MOCK_AFFILIATE.stats.totalReferrals,                        icon: Users,       color: "text-blue-400",   bg: "bg-blue-500/10"   },
          { label: "Conversions",       value: MOCK_AFFILIATE.stats.conversions,                           icon: TrendingUp,  color: "text-green-400",  bg: "bg-green-500/10"  },
          { label: "Pending Earnings",  value: `$${MOCK_AFFILIATE.stats.pendingCommissions.toFixed(2)}`,  icon: DollarSign,  color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Total Earned",      value: `$${MOCK_AFFILIATE.stats.totalEarnings.toFixed(2)}`,       icon: Gift,        color: "text-purple-400", bg: "bg-purple-500/10" },
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
            <Input value={referralUrl} readOnly className="bg-white/5 border-white/10 text-white/60 text-sm font-mono" />
            <Button
              size="sm"
              variant="outline"
              onClick={copyLink}
              className={`border-white/10 flex-shrink-0 transition-all ${linkCopied ? "bg-green-500/10 text-green-400 border-green-500/30" : "text-white/60 hover:text-white bg-white/5"}`}
            >
              {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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
              { plan: "Starter", price: "$97/mo",  commission: "$29.10"  },
              { plan: "Pro",     price: "$297/mo", commission: "$89.10"  },
              { plan: "Scale",   price: "$997/mo", commission: "$299.10" },
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
                <span className="text-sm font-semibold text-white">+${commission.amount.toFixed(2)}</span>
                <StatusBadge status={commission.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Email Swipe Series ─────────────────────────────────────────────── */}
      <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden mb-6">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-400" />
            <h2 className="font-display font-semibold text-sm text-white">Email Swipe Series</h2>
            <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/20 text-xs ml-1">7 Emails</Badge>
          </div>
          <p className="text-xs text-white/30">Replace [Affiliate Link] with your referral URL · Replace [Your Name] with your name</p>
        </div>

        <div className="p-4 space-y-3">
          {EMAIL_SWIPES.map((email) => (
            <EmailSwipeCard key={email.number} email={email} affiliateLink={referralUrl} />
          ))}
        </div>

        <div className="px-4 pb-4">
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
            <span className="text-base flex-shrink-0">💡</span>
            <p className="text-xs text-amber-400/80 leading-relaxed">
              Your referral link is automatically inserted into each email. Just copy, replace <strong className="text-amber-400">[First Name]</strong> with your merge tag and <strong className="text-amber-400">[Your Name]</strong> with your name, then paste into your email platform.
            </p>
          </div>
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
  )
}
