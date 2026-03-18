// app/(marketing)/page.tsx
import Link from "next/link";
import {
  Zap, Play, BarChart2, Users, Globe, ArrowRight,
  Star, TrendingUp, Bot, Clock, CheckCircle, Layers, Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Webinar Generator",
    desc: "Input your offer, audience, and pain points. Get a complete webinar script, slides, offer stack, and CTAs in minutes.",
    color: "purple",
  },
  {
    icon: Globe,
    title: "Evergreen Webinar Rooms",
    desc: "Host 24/7 with simulated live viewers, timed social proof, dynamic CTAs, and replay mode — fully automated.",
    color: "blue",
  },
  {
    icon: Bot,
    title: "AI Presenter Profiles",
    desc: "Create an AI presenter with a defined speaking style and brand voice. Consistent delivery, every time.",
    color: "teal",
  },
  {
    icon: Clock,
    title: "Timed Comments Engine",
    desc: "Pre-load social proof, testimonials, FAQ responses, and urgency triggers that fire at precise timestamps.",
    color: "purple",
  },
  {
    icon: BarChart2,
    title: "Conversion Analytics",
    desc: "Track registrations, completions, CTA clicks, drop-off points, and affiliate referrals in one clean dashboard.",
    color: "blue",
  },
  {
    icon: Users,
    title: "Affiliate Tracking",
    desc: "Built-in affiliate program with referral codes, cookie tracking, 30% recurring commissions, and a partner portal.",
    color: "teal",
  },
];

const SOCIAL_PROOF = [
  {
    name: "Sarah M.",
    role: "Business Coach",
    avatar: "SM",
    quote: "WebinarForge generated my entire webinar structure in 8 minutes. I used to spend 3 weeks on this.",
  },
  {
    name: "Marcus T.",
    role: "Real Estate Investor",
    avatar: "MT",
    quote: "My evergreen room converts at 11.4%. I set it up once and it generates leads every day on autopilot.",
  },
  {
    name: "Jennifer K.",
    role: "SaaS Founder",
    avatar: "JK",
    quote: "We went from 2% trial-to-paid to 9% after switching to an evergreen webinar funnel built with WebinarForge.",
  },
];

const NICHES = ["Real Estate", "Coaching", "Travel", "SaaS", "Local Services"];

const COMPARE = [
  { feature: "AI script generation", us: true, them: false },
  { feature: "AI slide builder", us: true, them: false },
  { feature: "AI offer stack", us: true, them: false },
  { feature: "Evergreen hosting", us: true, them: true },
  { feature: "Timed comments", us: true, them: true },
  { feature: "Affiliate program", us: true, them: false },
  { feature: "14-day free trial", us: true, them: false },
  { feature: "Tiered pricing from $97", us: true, them: false },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#06060f] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#06060f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              WebinarForge <span className="text-purple-400">AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/55">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/affiliates" className="hover:text-white transition-colors">Affiliates</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm text-white/55 hover:text-white transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link href="/sign-up">
              <button className="gradient-brand text-sm font-semibold text-white px-4 py-2 rounded-lg hover:opacity-90 hover:scale-[1.02] transition-all glow-on-hover">
                Start Free Trial
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-[10%] w-[700px] h-[500px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-[5%] w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Copy */}
            <div className="flex-1 min-w-0 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-purple-500/12 border border-purple-500/25 rounded-full px-4 py-1.5 text-sm text-purple-300 font-medium mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" style={{boxShadow: '0 0 6px rgba(168,85,247,1)'}} />
                The AI Operating System for Evergreen Webinars
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-[62px] font-bold leading-[1.06] mb-6 tracking-tight">
                Build High-Converting{" "}
                <span className="gradient-text">Evergreen Webinars</span>{" "}
                With AI
              </h1>

              <p className="text-lg text-white/46 max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed">
                Create, automate, and scale your webinars using AI presenters and smart funnels —
                no recording, no live calls, no guesswork.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <Link href="/sign-up">
                  <button className="gradient-brand px-8 py-3.5 rounded-xl text-base font-semibold text-white glow-primary hover:opacity-90 hover:scale-[1.02] transition-all group inline-flex items-center gap-2">
                    Start 14-Day Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <button className="px-8 py-3.5 rounded-xl text-base border border-white/10 text-white/62 hover:text-white hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.07] transition-all inline-flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/12 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-white/80 text-white/80" style={{marginLeft: '1px'}} />
                  </div>
                  Watch Demo
                </button>
              </div>

              <p className="text-sm text-white/26 mb-8">No credit card required · Cancel anytime</p>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="text-xs text-white/28 self-center mr-1">Works for:</span>
                {NICHES.map((niche) => (
                  <span key={niche} className="px-3 py-1 rounded-full text-xs bg-white/[0.04] border border-white/[0.08] text-white/42">
                    {niche}
                  </span>
                ))}
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="flex-shrink-0 w-full max-w-[380px] lg:w-[355px]">
              <div className="relative">
                <div className="absolute -inset-6 bg-purple-600/10 rounded-3xl blur-2xl pointer-events-none" />
                <div className="relative bg-[#0a0a1c]/95 border border-purple-500/22 rounded-2xl overflow-hidden" style={{boxShadow: '0 28px 72px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.08)'}}>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent" />

                  {/* Window chrome */}
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    <span className="ml-3 text-[11px] text-white/28 tracking-wide">WebinarForge AI — Dashboard</span>
                  </div>

                  <div className="p-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        {val: "4", label: "Webinars", color: "text-white"},
                        {val: "312", label: "Registrations", color: "text-emerald-400"},
                        {val: "47", label: "CTA Clicks", color: "text-purple-400"},
                      ].map((s) => (
                        <div key={s.label} className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-2.5">
                          <div className={`text-[15px] font-bold font-display ${s.color} mb-0.5`}>{s.val}</div>
                          <div className="text-[9px] text-white/26 tracking-wider uppercase">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Bar chart */}
                    <div className="bg-white/[0.025] border border-white/[0.05] rounded-lg p-3 mb-3">
                      <div className="text-[9px] text-white/26 mb-2 tracking-wider uppercase">Registrations — last 7 days</div>
                      <div className="flex items-end gap-1 h-[44px]">
                        {[55, 68, 42, 88, 62, 95, 72].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm"
                            style={{
                              height: `${h}%`,
                              background: i === 5 ? 'linear-gradient(180deg,#34d399,#059669)' : i === 3 ? 'linear-gradient(180deg,#a78bfa,#7c3aed)' : 'linear-gradient(180deg,#7c3aed,#4f46e5)',
                              opacity: i === 3 || i === 5 ? 1 : 0.62,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-1.5 mb-3">
                      {[
                        {name: "3-Step High-Ticket Coaching System", live: true, color: "#34d399"},
                        {name: "Real Estate Lead Machine", live: true, color: "#3b82f6"},
                        {name: "SaaS Demo-to-Trial Converter", live: false, color: "rgba(255,255,255,0.2)"},
                      ].map((w) => (
                        <div key={w.name} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] rounded-lg px-2.5 py-2">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background: w.color, boxShadow: w.live ? `0 0 5px ${w.color}` : 'none'}} />
                          <div className="flex-1 text-[10px] text-white/58 truncate">{w.name}</div>
                          <div className="text-[9px] px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={w.live ? {background:'rgba(52,211,153,.12)',color:'#34d399',border:'1px solid rgba(52,211,153,.2)'} : {background:'rgba(255,255,255,.05)',color:'rgba(255,255,255,.28)',border:'1px solid rgba(255,255,255,.08)'}}>
                            {w.live ? 'Live' : 'Draft'}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI badge */}
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{background:'linear-gradient(135deg,rgba(124,58,237,.14),rgba(79,70,229,.08))',border:'1px solid rgba(124,58,237,.22)'}}>
                      <div className="w-4 h-4 rounded flex items-center justify-center text-[9px] text-white flex-shrink-0" style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>✦</div>
                      <div className="text-[9.5px] text-purple-300 tracking-wide">AI generating your next webinar</div>
                      <div className="ml-auto flex gap-0.5 items-center">
                        {[0, 200, 400].map((d) => (
                          <div key={d} className="w-1 h-1 rounded-full bg-purple-500" style={{animation:`pulse ${1.2}s ease-in-out ${d}ms infinite`}} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-white/[0.02] py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            {value: "10,000+", label: "Webinars created"},
            {value: "94%", label: "User satisfaction"},
            {value: "8 min", label: "Avg. generation time"},
            {value: "30%", label: "Affiliate commission"},
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-white/36">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Everything you need to{" "}
              <span className="gradient-text">run webinars on autopilot</span>
            </h2>
            <p className="text-lg text-white/36 max-w-xl mx-auto">
              From generation to publication to optimization — one integrated platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => {
              const colorStyles: Record<string, React.CSSProperties> = {
                purple: {background:'rgba(139,92,246,.1)',border:'1px solid rgba(139,92,246,.2)',color:'#a78bfa'},
                blue: {background:'rgba(59,130,246,.1)',border:'1px solid rgba(59,130,246,.2)',color:'#60a5fa'},
                teal: {background:'rgba(20,184,166,.1)',border:'1px solid rgba(20,184,166,.2)',color:'#2dd4bf'},
              };
              return (
                <div key={feature.title} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all group cursor-default">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform" style={colorStyles[feature.color]}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-white">{feature.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-300 font-medium mb-5">
              <Layers className="w-3.5 h-3.5" />
              WebinarCore hosts it. WebinarForge AI builds it.
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              More than just a webinar host
            </h2>
            <p className="text-white/38 max-w-lg mx-auto text-[15px]">
              Other platforms make you bring your own content. WebinarForge AI creates it with you.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 overflow-hidden">
            <div className="grid grid-cols-3 bg-white/[0.04] border-b border-white/8 text-sm font-semibold">
              <div className="px-5 py-4 text-white/38">Feature</div>
              <div className="px-5 py-4 text-center text-purple-300">WebinarForge AI</div>
              <div className="px-5 py-4 text-center text-white/32">Others</div>
            </div>
            {COMPARE.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 text-sm border-b border-white/5 last:border-b-0 ${i % 2 === 0 ? 'bg-white/[0.015]' : ''}`}>
                <div className="px-5 py-3.5 text-white/52">{row.feature}</div>
                <div className="px-5 py-3.5 text-center">
                  {row.us ? <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-white/18 text-lg leading-none">–</span>}
                </div>
                <div className="px-5 py-3.5 text-center">
                  {row.them ? <CheckCircle className="w-4 h-4 text-white/28 mx-auto" /> : <span className="text-white/18 text-lg leading-none">–</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              Trusted by operators building on autopilot
            </h2>
            <p className="text-white/36 text-[15px]">Real results from real users.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {SOCIAL_PROOF.map((item) => (
              <div key={item.name} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-white/55 leading-relaxed mb-6 flex-1">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{item.name}</div>
                    <div className="text-xs text-white/36">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl border border-purple-500/22 overflow-hidden" style={{background:'linear-gradient(135deg,rgba(124,58,237,.1),rgba(59,130,246,.07))'}}>
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="relative">
              <TrendingUp className="w-10 h-10 text-purple-400 mx-auto mb-5" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Ready to build your webinar OS?
              </h2>
              <p className="text-white/42 mb-9 text-[15px] leading-relaxed">
                Start your free 14-day trial today. No credit card required. Cancel anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/sign-up">
                  <button className="gradient-brand px-8 py-3 rounded-xl font-semibold glow-primary hover:opacity-90 hover:scale-[1.02] transition-all inline-flex items-center gap-2 text-sm text-white">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="px-8 py-3 rounded-xl border border-white/10 text-white/62 hover:text-white bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/20 transition-all text-sm">
                    View Pricing
                  </button>
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
            <span className="font-display font-semibold text-sm text-white/52">WebinarForge AI</span>
          </div>
          <div className="flex gap-6 text-sm text-white/26">
            <Link href="/pricing" className="hover:text-white/55 transition-colors">Pricing</Link>
            <Link href="/affiliates" className="hover:text-white/55 transition-colors">Affiliates</Link>
            <Link href="/sign-in" className="hover:text-white/55 transition-colors">Sign In</Link>
          </div>
          <p className="text-xs text-white/16">© 2026 WebinarForge AI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
