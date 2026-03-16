// app/(marketing)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap, Play, BarChart2, Users, Globe, ArrowRight,
  CheckCircle, Star, TrendingUp, Bot, Clock, Shield,
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "AI Webinar Generator",
    desc: "Input your offer, audience, and pain points. Get a complete webinar script, slides, offer stack, and CTAs in minutes.",
  },
  {
    icon: Globe,
    title: "Evergreen Webinar Rooms",
    desc: "Host your webinar 24/7 with simulated live viewers, timed social proof, dynamic CTAs, and replay mode — all automated.",
  },
  {
    icon: Bot,
    title: "AI Presenter Profiles",
    desc: "Create an AI presenter with a defined speaking style, brand voice, and narration tone. Consistent delivery, every time.",
  },
  {
    icon: Clock,
    title: "Timed Comments Engine",
    desc: "Pre-load social proof, testimonials, FAQ responses, and urgency triggers that fire at precise timestamps.",
  },
  {
    icon: BarChart2,
    title: "Conversion Analytics",
    desc: "Track registrations, completions, CTA clicks, drop-off points, and affiliate referrals in one clean dashboard.",
  },
  {
    icon: Users,
    title: "Affiliate Tracking",
    desc: "Built-in affiliate program with referral codes, cookie tracking, recurring commissions, and a dedicated partner portal.",
  },
];

const SOCIAL_PROOF = [
  { name: "Sarah M.", role: "Business Coach", quote: "WebinarForge generated my entire webinar structure in 8 minutes. I used to spend 3 weeks on this." },
  { name: "Marcus T.", role: "Real Estate Investor", quote: "My evergreen room converts at 11.4%. I set it up once and it generates leads every day on autopilot." },
  { name: "Jennifer K.", role: "SaaS Founder", quote: "We went from 2% trial-to-paid to 9% after switching to an evergreen webinar funnel built with WebinarForge." },
];

const NICHES = ["Real Estate", "Coaching", "Travel", "SaaS", "Local Services"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080812] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080812]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">WebinarForge <span className="text-purple-400">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/affiliates" className="hover:text-white transition-colors">Affiliates</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="gradient-brand border-0 hover:opacity-90 glow-on-hover">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/10 text-purple-300 border-purple-500/20 px-4 py-1.5 text-sm">
            <Zap className="w-3 h-3 mr-1.5 inline" />
            The AI Operating System for Evergreen Webinars
          </Badge>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6 tracking-tight">
            Build High-Converting{" "}
            <span className="gradient-text">Evergreen Webinars</span>{" "}
            With AI
          </h1>

          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate webinar scripts, slide outlines, evergreen rooms, timed comments,
            affiliate-ready funnels, and AI presenter delivery — in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/sign-up">
              <Button size="lg" className="gradient-brand border-0 h-14 px-8 text-base font-semibold glow-primary hover:opacity-90 group">
                Start 14-Day Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/10 text-white/70 hover:text-white hover:border-white/20 bg-white/5">
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>

          <p className="text-sm text-white/30">
            No credit card required · 14-day free trial · Cancel anytime
          </p>

          {/* Niche pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            <span className="text-sm text-white/30 mr-2 self-center">Works for:</span>
            {NICHES.map((niche) => (
              <span key={niche} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/50">
                {niche}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-white/2 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10,000+", label: "Webinars created" },
            { value: "94%", label: "User satisfaction" },
            { value: "8 min", label: "Avg. generation time" },
            { value: "30%", label: "Affiliate commission" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">run webinars on autopilot</span>
            </h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto">
              From generation to publication to optimization — one integrated platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-white/3 border border-white/8 hover:border-purple-500/30 hover:bg-white/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Trusted by operators building on autopilot
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SOCIAL_PROOF.map((item) => (
              <div key={item.name} className="p-6 rounded-2xl bg-white/3 border border-white/8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-5">"{item.quote}"</p>
                <div>
                  <div className="font-semibold text-sm text-white">{item.name}</div>
                  <div className="text-xs text-white/40">{item.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <TrendingUp className="w-10 h-10 text-purple-400 mx-auto mb-4" />
              <h2 className="font-display text-3xl font-bold mb-3">
                Ready to build your webinar OS?
              </h2>
              <p className="text-white/50 mb-8">
                Start your free 14-day trial today. No credit card required.
                Cancel anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="gradient-brand border-0 h-12 px-8 glow-primary hover:opacity-90">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="h-12 px-8 border-white/10 text-white/70 hover:text-white bg-white/5">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-brand flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-semibold text-sm text-white/60">WebinarForge AI</span>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="/pricing" className="hover:text-white/60 transition-colors">Pricing</Link>
            <Link href="/affiliates" className="hover:text-white/60 transition-colors">Affiliates</Link>
            <Link href="/sign-in" className="hover:text-white/60 transition-colors">Sign In</Link>
          </div>
          <p className="text-xs text-white/20">© 2025 WebinarForge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
