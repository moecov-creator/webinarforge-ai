// app/(dashboard)/dashboard/billing/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, CreditCard, Clock, Zap } from "lucide-react";
import { PLANS, type PlanKey } from "@/lib/config/plans";

// Mock current subscription — replace with DB fetch
const MOCK_SUB = {
  plan: "PRO" as PlanKey,
  status: "active",
  trialEndsAt: null,
  currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  cancelAtPeriodEnd: false,
};

const UPGRADE_PLANS: PlanKey[] = ["STARTER", "PRO", "SCALE"];

export default function BillingPage() {
  const currentPlan = PLANS[MOCK_SUB.plan];
  const isTrialing = MOCK_SUB.status === "trialing";

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Billing</h1>
        <p className="text-sm text-white/40 mt-1">Manage your subscription and payment details.</p>
      </div>

      {/* Trial Banner */}
      {isTrialing && MOCK_SUB.trialEndsAt && (
        <div className="mb-6 p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-300 text-sm mb-1">Your free trial ends soon</p>
              <p className="text-xs text-yellow-400/60 mb-3">
                Upgrade now to keep your webinars, analytics, and automation running.
              </p>
              <Button size="sm" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold border-0">
                Upgrade Now — No Interruption
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Current Plan */}
      <div className="p-6 rounded-xl bg-white/3 border border-white/8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-base text-white">Current Plan</h2>
          <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/20">
            {currentPlan.name}
          </Badge>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="text-center p-3 rounded-lg bg-white/3">
            <p className="font-display text-2xl font-bold text-white">
              {currentPlan.price === null ? "Custom" : `$${currentPlan.price}`}
            </p>
            <p className="text-xs text-white/35">per month</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/3">
            <p className="font-display text-sm font-bold text-white capitalize">{MOCK_SUB.status}</p>
            <p className="text-xs text-white/35">Status</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/3">
            <p className="font-display text-sm font-bold text-white">
              {MOCK_SUB.currentPeriodEnd
                ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(MOCK_SUB.currentPeriodEnd)
                : "—"}
            </p>
            <p className="text-xs text-white/35">Next renewal</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-white/10 text-white/50 hover:text-white bg-white/3"
          >
            <CreditCard className="w-3.5 h-3.5 mr-1.5" />
            Manage Payment
          </Button>
          {!MOCK_SUB.cancelAtPeriodEnd ? (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-white/30 hover:text-red-400"
            >
              Cancel Subscription
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-green-400 hover:text-green-300"
            >
              Reactivate
            </Button>
          )}
        </div>
      </div>

      {/* Upgrade Options */}
      {MOCK_SUB.plan !== "SCALE" && MOCK_SUB.plan !== "ENTERPRISE" && (
        <div>
          <h2 className="font-display font-semibold text-base text-white mb-4">Upgrade Your Plan</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {UPGRADE_PLANS.filter((p) => p !== MOCK_SUB.plan).map((planKey) => {
              const plan = PLANS[planKey];
              const isCurrent = planKey === MOCK_SUB.plan;

              return (
                <div
                  key={planKey}
                  className={`p-5 rounded-xl border transition-all ${
                    plan.badge
                      ? "bg-gradient-to-b from-purple-500/10 to-purple-500/5 border-purple-500/30"
                      : "bg-white/3 border-white/8 hover:border-white/15"
                  }`}
                >
                  {plan.badge && (
                    <Badge className="bg-purple-500 text-white border-0 text-xs mb-3">
                      {plan.badge}
                    </Badge>
                  )}
                  <h3 className="font-display font-bold text-lg text-white mb-1">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="font-display text-3xl font-bold text-white">${plan.price}</span>
                    <span className="text-white/35 text-sm mb-0.5">/mo</span>
                  </div>

                  <div className="space-y-2 mb-5">
                    {[
                      plan.limits.webinarsPerMonth === null ? "Unlimited webinars" : `${plan.limits.webinarsPerMonth} webinars/mo`,
                      plan.features.offerStackGenerator ? "Offer stack generator" : null,
                      plan.features.advancedAnalytics ? "Advanced analytics" : null,
                      plan.features.whiteLabelReady ? "White-label ready" : null,
                    ].filter(Boolean).map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-white/50">
                        <CheckCircle className="w-3 h-3 text-purple-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    className={`w-full text-xs ${
                      plan.badge
                        ? "gradient-brand border-0 hover:opacity-90"
                        : "border-white/15 bg-white/5 hover:bg-white/10 text-white"
                    }`}
                    variant={plan.badge ? "default" : "outline"}
                  >
                    Upgrade to {plan.name}
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invoice placeholder */}
      <div className="mt-8 p-5 rounded-xl bg-white/2 border border-white/6">
        <h3 className="text-sm font-medium text-white mb-3">Billing History</h3>
        <p className="text-xs text-white/30">
          Your invoices and receipts will appear here. Manage your payment methods and billing details via the{" "}
          <button className="text-purple-400 hover:text-purple-300 underline">Stripe billing portal</button>.
        </p>
      </div>
    </div>
  );
}
