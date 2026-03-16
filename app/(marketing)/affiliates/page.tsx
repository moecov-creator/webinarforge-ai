// app/(marketing)/affiliates/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Users, TrendingUp, RefreshCw, CheckCircle, Zap, Star } from "lucide-react";

const COMMISSION_EXAMPLES = [
  { plan: "Starter", price: 97, commission: 29.10, description: "1 referral → $29.10/month, every month" },
  { plan: "Pro", price: 297, commission: 89.10, description: "1 referral → $89.10/month, every month" },
  { plan: "Scale", price: 997, commission: 299.10, description: "1 referral → $299.10/month, every month" },
];

const FEATURES = [
  { icon: RefreshCw, title: "30% Recurring", desc: "Earn 30% of every payment your referral makes — for as long as they're subscribed." },
  { icon: Users, title: "60-Day Cookie", desc: "If someone clicks your link and upgrades within 60 days, you get credit." },
  { icon: DollarSign, title: "Monthly Payouts", desc: "Commissions are paid out monthly via PayPal or Stripe Connect." },
  { icon: TrendingUp, title: "Affiliate Dashboard", desc: "Track clicks, conversions, pending commissions, and payout history in real time." },
];

const TESTIMONIALS = [
  { name: "Carlos M.", earnings: "$1,847/mo", quote: "I recommend WebinarForge to every client who needs an automated funnel. The 30% recurring is genuinely passive income now." },
  { name: "Priya S.", earnings: "$892/mo", quote: "Added it to my tech stack review newsletter. Within 3 months it became my top affiliate income source." },
];

export default function AffiliatesPage() {
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
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="gradient-brand border-0">Become an Affiliate</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-green-600/8 blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <Badge className="mb-6 bg-green-500/10 text-green-300 border-green-500/20 px-4 py-1.5">
            <DollarSign className="w-3 h-3 mr-1.5 inline" />
            Affiliate Program
          </Badge>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5 tracking-tight">
            Earn 30% recurring<br />
            <span className="gradient-text">every single month</span>
          </h1>
          <p className="text-lg text-white/45 max-w-xl mx-auto mb-10">
            Refer one person to WebinarForge Pro and earn $89.10 every month they stay subscribed.
            Build a portfolio of referrals and earn while you sleep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="gradient-brand border-0 h-13 px-8 glow-primary hover:opacity-90 group">
                Apply Now — It's Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-white/25 mt-4">No minimum sales. No approval required. Instant activation.</p>
        </div>
      </section>

      {/* Commission calculator */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-10">What you can earn</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {COMMISSION_EXAMPLES.map((ex) => (
              <div key={ex.plan} className="p-6 rounded-2xl bg-white/3 border border-white/8 text-center">
                <p className="text-sm text-white/40 mb-2">{ex.plan} Plan referral</p>
                <div className="font-display text-4xl font-bold text-green-400 mb-1">
                  ${ex.commission.toFixed(2)}
                </div>
                <p className="text-sm text-white/25 mb-4">per month, recurring</p>
                <div className="p-3 rounded-lg bg-white/3 text-xs text-white/40">{ex.description}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-white/30 mt-6">
            10 Scale referrals = <span className="text-green-400 font-semibold">$2,991/month</span> in passive income.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-10">Built for serious affiliates</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-5 rounded-xl bg-white/3 border border-white/8">
                <f.icon className="w-5 h-5 text-green-400 mb-3" />
                <h3 className="font-semibold text-sm text-white mb-1">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-10">What affiliates are saying</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-white/3 border border-white/8">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-white/55 leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{t.name}</span>
                  <span className="text-sm font-bold text-green-400">{t.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-10">How it works</h2>
          <div className="space-y-4">
            {[
              { step: "01", title: "Sign up for free", desc: "Create your WebinarForge account and your affiliate dashboard is automatically activated." },
              { step: "02", title: "Get your referral link", desc: "Find your unique link and promo code in the Affiliates section of your dashboard." },
              { step: "03", title: "Share it anywhere", desc: "Email, YouTube, blog posts, social media, client recommendations — wherever your audience lives." },
              { step: "04", title: "Earn every month", desc: "Get paid 30% of every charge for as long as your referral keeps their subscription." },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 p-5 rounded-xl bg-white/2 border border-white/6">
                <span className="font-display text-2xl font-bold text-white/15 flex-shrink-0">{item.step}</span>
                <div>
                  <h3 className="font-semibold text-sm text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-white/40">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-green-500/8 to-purple-500/8 border border-green-500/15">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold mb-3">Start earning today</h2>
            <p className="text-white/40 mb-8 text-sm">Free to join. No cap on earnings. No approval gatekeeping.</p>
            <Link href="/sign-up">
              <Button size="lg" className="gradient-brand border-0 glow-primary hover:opacity-90 h-12 px-8">
                Create Your Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
