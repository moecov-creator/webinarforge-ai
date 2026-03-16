// app/(marketing)/pricing/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";
import { PLANS, type PlanKey } from "@/lib/config/plans";

const PLAN_ORDER: PlanKey[] = ["FREE_TRIAL", "STARTER", "PRO", "SCALE", "ENTERPRISE"];

const FEATURE_ROWS = [
  { label: "Webinars per month", key: "webinarsPerMonth", isLimit: true },
  { label: "AI generations", key: "aiGenerationsPerMonth", isLimit: true },
  { label: "Niche templates", key: "nicheTemplates", isLimit: true },
  { label: "AI presenters", key: "aiPresenters", isLimit: true },
  { label: "Team seats", key: "teamSeats", isLimit: true },
  { label: "Evergreen room", key: "evergreenRoom", isFeature: true },
  { label: "Timed comments (lite)", key: "timedCommentsLite", isFeature: true },
  { label: "Timed comments (full)", key: "timedCommentsFull", isFeature: true },
  { label: "CTA engine", key: "ctaEngine", isFeature: true },
  { label: "Offer stack generator", key: "offerStackGenerator", isFeature: true },
  { label: "AI presenter narration", key: "aiPresenterNarration", isFeature: true },
  { label: "Advanced analytics", key: "advancedAnalytics", isFeature: true },
  { label: "Affiliate tracking", key: "affiliateTracking", isFeature: true },
  { label: "Webhooks + integrations", key: "webhooks", isFeature: true },
  { label: "White-label ready", key: "whiteLabelReady", isFeature: true },
  { label: "Multi-brand / workspaces", key: "multiBrand", isFeature: true },
  { label: "Custom branding", key: "customBranding", isFeature: true },
  { label: "Priority support", key: "prioritySupport", isFeature: true },
];

function formatLimit(val: number | null | boolean): string {
  if (val === null) return "Unlimited";
  if (val === false) return "—";
  if (val === true) return "✓";
  return String(val);
}

export default function PricingPage() {
  const displayPlans = PLAN_ORDER.filter((k) => k !== "FREE_TRIAL");

  return (
    <div className="min-h-screen bg-[#080812] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#080812] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded gradient-brand flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-base">WebinarForge <span className="text-purple-400">AI</span></span>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="gradient-brand border-0">Start Free Trial</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-white/40 max-w-lg mx-auto">
            Start free for 14 days. No credit card required. Upgrade when you're ready to scale.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {displayPlans.map((planKey) => {
            const plan = PLANS[planKey];
            const isPro = planKey === "PRO";
            const isEnterprise = planKey === "ENTERPRISE";

            return (
              <div
                key={planKey}
                className={`relative rounded-2xl p-6 border ${
                  isPro
                    ? "bg-gradient-to-b from-purple-500/10 to-purple-500/5 border-purple-500/40"
                    : "bg-white/3 border-white/8"
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white border-0 text-xs px-3">
                    {plan.badge}
                  </Badge>
                )}

                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-xs text-white/40 mb-4">{plan.tagline}</p>
                  <div className="flex items-end gap-1">
                    {plan.price === null ? (
                      <span className="font-display text-3xl font-bold">Contact</span>
                    ) : (
                      <>
                        <span className="font-display text-4xl font-bold">${plan.price}</span>
                        <span className="text-white/40 text-sm mb-1">/month</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {[
                    plan.limits.webinarsPerMonth !== null
                      ? `${plan.limits.webinarsPerMonth ?? "Unlimited"} webinars/mo`
                      : "Unlimited webinars",
                    `${plan.limits.aiPresenters} AI presenter${plan.limits.aiPresenters > 1 ? "s" : ""}`,
                    `${plan.limits.teamSeats} team seat${plan.limits.teamSeats > 1 ? "s" : ""}`,
                    plan.features.offerStackGenerator ? "Offer stack generator" : null,
                    plan.features.advancedAnalytics ? "Advanced analytics" : null,
                    plan.features.whiteLabelReady ? "White-label ready" : null,
                  ]
                    .filter(Boolean)
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-white/60">
                        <CheckCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                </div>

                <Link href={isEnterprise ? "mailto:sales@webinarforge.ai" : "/sign-up"}>
                  <Button
                    className={`w-full ${
                      isPro
                        ? "gradient-brand border-0 hover:opacity-90"
                        : "border-white/15 bg-white/5 hover:bg-white/10 text-white"
                    }`}
                    variant={isPro ? "default" : "outline"}
                  >
                    {isEnterprise ? "Contact Sales" : "Get Started"}
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Free Trial Banner */}
        <div className="text-center p-8 rounded-2xl bg-white/3 border border-white/8 mb-20">
          <h3 className="font-display text-2xl font-bold mb-2">Start with a free 14-day trial</h3>
          <p className="text-white/40 mb-6">2 webinar builds, 1 AI presenter, 3 templates. No credit card.</p>
          <Link href="/sign-up">
            <Button className="gradient-brand border-0 glow-primary hover:opacity-90 h-12 px-8">
              Start Free Trial — No Credit Card
            </Button>
          </Link>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Common questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Do I need a credit card to start the free trial?",
                a: "No. You get full access to trial features for 14 days with no payment information required.",
              },
              {
                q: "Can I upgrade or downgrade at any time?",
                a: "Yes. You can change your plan at any time from your billing dashboard. Upgrades take effect immediately. Downgrades apply at the next billing cycle.",
              },
              {
                q: "What happens to my webinars if I cancel?",
                a: "Your data is retained for 30 days after cancellation. You can export your content at any time while your account is active.",
              },
              {
                q: "Is there an annual discount?",
                a: "Yes — paying annually saves you the equivalent of 2 months on Starter, Pro, and Scale plans.",
              },
            ].map((faq) => (
              <div key={faq.q} className="p-5 rounded-xl bg-white/3 border border-white/8">
                <h4 className="font-semibold text-sm mb-2">{faq.q}</h4>
                <p className="text-sm text-white/45">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
