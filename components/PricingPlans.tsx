"use client"

import Link from "next/link"

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Launch your first funnel",
    price: 97,
    period: "month",
    accent: "border-white/15",
    badge: null,
    cta: "Start With Starter",
    ctaStyle: "border border-white/20 hover:border-white/40 text-white",
    features: [
      "3 webinar funnels",
      "AI webinar script generator",
      "1 AI presenter",
      "Basic email follow-up (5 emails)",
      "Registration + confirmation pages",
      "Standard analytics",
      "Community support",
    ],
    outcome: "Perfect for coaches and consultants launching their first webinar funnel and getting to their first $1k month.",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Scale with advanced automation",
    price: 297,
    period: "month",
    accent: "border-purple-500",
    badge: "Most Popular",
    cta: "Upgrade to Pro",
    ctaStyle: "bg-purple-600 hover:bg-purple-500 text-white",
    features: [
      "Unlimited webinar funnels",
      "Advanced AI script + copy generation",
      "5 AI presenters",
      "Full automation (email + SMS, 15+ steps)",
      "Funnel A/B testing",
      "Advanced analytics + AI insights",
      "Done-for-you template library",
      "Affiliate tracking",
      "Priority support + onboarding call",
    ],
    outcome: "Built for coaches, agencies, and SaaS founders ready to scale past $10k/month with automated webinar funnels.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Teams, agencies & white-label",
    price: null,
    period: null,
    accent: "border-amber-500/40",
    badge: null,
    cta: "Book a Strategy Call",
    ctaStyle: "border border-amber-500/40 text-amber-400 hover:bg-amber-500/10",
    features: [
      "Everything in Pro",
      "Unlimited team seats",
      "White-label / custom branding",
      "Custom AI presenter training",
      "Agency client management",
      "Custom workflow automation",
      "Dedicated account manager",
      "SLA + priority infrastructure",
    ],
    outcome: "For agencies managing multiple clients and enterprises running high-volume webinar programs.",
  },
]

const ADDONS = [
  {
    icon: "📋",
    name: "AI Webinar Templates Pack",
    desc: "10+ proven webinar scripts and frameworks across coach, SaaS, agency, and course creator niches.",
    price: "$47 one-time",
    cta: "Add to Plan",
  },
  {
    icon: "📞",
    name: "Funnel Strategy Session",
    desc: "60-minute 1-on-1 session with a conversion specialist to map your funnel and offer positioning.",
    price: "$297 one-time",
    cta: "Book Session",
  },
  {
    icon: "🏗️",
    name: "Done-For-You Funnel Build",
    desc: "We build your complete webinar funnel — script, slides, AI presenter, pages, and email sequence.",
    price: "From $997",
    cta: "Apply Now",
  },
]

interface PricingProps {
  currentPlan?: string
  showAddons?: boolean
  compact?: boolean
}

export default function PricingPlans({ currentPlan, showAddons = true, compact = false }: PricingProps) {
  return (
    <div className="space-y-10">

      {!compact && (
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4 leading-tight">
            Choose Your Growth Path
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every plan includes AI webinar generation, funnel builder, and analytics.
            Upgrade when you're ready to scale.
          </p>
        </div>
      )}

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-[#0d0d1a] border-2 ${plan.accent} rounded-2xl overflow-hidden flex flex-col transition-all`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute top-4 right-4">
                <span className="bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="p-6 flex-1">
              {/* Plan header */}
              <div className="mb-5">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-1">{plan.tagline}</div>
                <h3 className="text-2xl font-black text-white mb-3">{plan.name}</h3>
                {plan.price ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${plan.price}</span>
                    <span className="text-gray-500 text-sm">/{plan.period}</span>
                  </div>
                ) : (
                  <div className="text-3xl font-black text-amber-400">Custom</div>
                )}
              </div>

              {/* Outcome statement */}
              <div className="bg-white/4 border border-white/8 rounded-xl p-3 mb-5">
                <p className="text-xs text-gray-400 leading-relaxed">{plan.outcome}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className={`flex-shrink-0 mt-0.5 ${plan.id === "pro" ? "text-purple-400" : plan.id === "enterprise" ? "text-amber-400" : "text-green-400"}`}>✔</span>
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="p-6 pt-0">
              {currentPlan === plan.id ? (
                <div className="w-full py-3 rounded-xl border border-white/15 text-center text-sm text-gray-500 font-medium">
                  Current Plan
                </div>
              ) : (
                <Link href={plan.id === "enterprise" ? "/dashboard/billing/enterprise" : "/dashboard/billing"}>
                  <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${plan.ctaStyle}`}>
                    {plan.cta} →
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      {showAddons && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Accelerate Your Results</h3>
            <p className="text-gray-500 text-sm">One-time add-ons to launch faster and convert more.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {ADDONS.map((addon) => (
              <div key={addon.name} className="bg-[#0d0d1a] border border-white/10 hover:border-amber-500/40 rounded-2xl p-5 transition-all group">
                <div className="text-3xl mb-3">{addon.icon}</div>
                <h4 className="font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{addon.name}</h4>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">{addon.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-black text-sm">{addon.price}</span>
                  <Link href="/dashboard/billing">
                    <button className="text-xs border border-amber-500/40 text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-500/10 transition">
                      {addon.cta}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust footer */}
      <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-600 pt-4 border-t border-white/5">
        {["🔒 No contracts — cancel anytime", "💳 All major cards accepted", "🔄 30-day money-back guarantee", "⚡ Instant access after payment"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

    </div>
  )
}
