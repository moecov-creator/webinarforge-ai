"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function CountdownTimer() {
  const [time, setTime] = useState({ hours: 23, minutes: 59, seconds: 59 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex gap-3 justify-center">
      {[
        { label: "HRS", value: time.hours },
        { label: "MIN", value: time.minutes },
        { label: "SEC", value: time.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-red-600 border border-red-500 rounded-xl w-16 h-16 flex items-center justify-center shadow-lg shadow-red-900/40">
            <span className="text-2xl font-black text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-red-400 text-[10px] font-bold mt-1.5 tracking-widest uppercase">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Video Player with AI Twin embed support ──────────────────────────────────
function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState("")
  const [embedSrc, setEmbedSrc] = useState("")
  const [showInput, setShowInput] = useState(false)

  const handleUrl = (val: string) => {
    setVideoUrl(val)
    const yt = val.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    const vm = val.match(/vimeo\.com\/(\d+)/)
    const lm = val.match(/loom\.com\/share\/([a-z0-9]+)/i)
    if (yt) setEmbedSrc(`https://www.youtube.com/embed/${yt[1]}?rel=0&autoplay=0`)
    else if (vm) setEmbedSrc(`https://player.vimeo.com/video/${vm[1]}`)
    else if (lm) setEmbedSrc(`https://www.loom.com/embed/${lm[1]}`)
    else if (val.startsWith("http")) setEmbedSrc(val)
  }

  return (
    <div className="relative max-w-3xl mx-auto mb-10">
      <div className="absolute -inset-1 bg-yellow-400/30 rounded-2xl blur-lg" />
      <div className="relative rounded-2xl overflow-hidden border-2 border-yellow-400/70 bg-[#0a0a0a]">
        {embedSrc ? (
          <iframe
            src={embedSrc}
            className="w-full aspect-video border-none block"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        ) : (
          <div className="aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 gap-4">
            <button
              onClick={() => setShowInput(true)}
              className="w-20 h-20 bg-yellow-400 hover:bg-yellow-300 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-xl shadow-yellow-400/30"
            >
              <svg className="w-8 h-8 text-black ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Watch This Short Video First</p>
              <p className="text-yellow-400 font-bold mt-1 text-sm">(This changes everything — 3 mins)</p>
            </div>
            {showInput && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="bg-[#111] border border-white/20 rounded-xl p-5 w-full max-w-md">
                  <p className="text-xs text-yellow-400 font-semibold mb-2 uppercase tracking-widest">Add Your AI Twin Video</p>
                  <input
                    autoFocus
                    value={videoUrl}
                    onChange={(e) => handleUrl(e.target.value)}
                    placeholder="Paste YouTube, Vimeo, Loom, or HeyGen URL..."
                    className="w-full text-sm px-3 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 outline-none focus:border-yellow-400/60 mb-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowInput(false)} className="flex-1 py-2 text-xs rounded-lg border border-white/15 text-gray-400 hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={() => setShowInput(false)} className="flex-1 py-2 text-xs rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors">Apply</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {embedSrc && (
        <button
          onClick={() => { setEmbedSrc(""); setVideoUrl(""); setShowInput(true) }}
          className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded border border-white/20 hover:bg-black/80 transition-colors"
        >
          Replace video
        </button>
      )}
    </div>
  )
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
function CTAButton({ size = "lg" }: { size?: "lg" | "md" }) {
  const { isSignedIn, isLoaded } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!isLoaded) return
    setLoading(true)
    if (isSignedIn) {
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planKey: "EARLY_BIRD" }),
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          setLoading(false)
        }
      } catch {
        setLoading(false)
      }
    } else {
      sessionStorage.setItem("checkout_intent", "EARLY_BIRD")
      window.location.href = "/sign-up"
    }
  }

  const sizeClass = size === "lg" ? "py-6 px-8 text-xl md:text-2xl" : "py-4 px-6 text-lg"

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`relative w-full max-w-xl mx-auto flex items-center justify-center gap-3 font-black rounded-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden bg-yellow-400 hover:bg-yellow-300 text-black group ${sizeClass}`}
        style={{ boxShadow: "0 0 50px rgba(250,204,21,0.45), 0 4px 24px rgba(250,204,21,0.2)" }}
      >
        <span className="absolute inset-0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
        {loading ? (
          <>
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : (
          <>YES! GIVE ME INSTANT ACCESS FOR $49 →</>
        )}
      </button>
      <p className="text-gray-500 text-xs text-center">
        🔒 256-bit SSL Secured · Instant Access · 30-Day Money Back Guarantee
      </p>
    </div>
  )
}

// ─── Spot Counter ─────────────────────────────────────────────────────────────
function SpotCounter() {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
      <div className="flex -space-x-1">
        {["#7c3aed", "#059669", "#d97706", "#dc2626", "#2563eb"].map((c, i) => (
          <div key={i} className="w-6 h-6 rounded-full border-2 border-black" style={{ background: c }} />
        ))}
      </div>
      <span>
        <span className="text-yellow-400 font-bold">387</span> spots claimed ·{" "}
        <span className="text-red-400 font-semibold">113 remaining</span>
      </span>
    </div>
  )
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-white/4 hover:bg-white/6 border border-white/10 hover:border-yellow-400/30 rounded-2xl px-6 py-5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-black text-base text-yellow-400 leading-snug">{q}</h3>
        <span className={`text-yellow-400 text-xl flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      {open && (
        <p className="text-gray-400 text-sm leading-relaxed mt-3 border-t border-white/10 pt-3">{a}</p>
      )}
    </button>
  )
}

// ─── Section helpers ──────────────────────────────────────────────────────────
function Section({ children, dark = false, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <section className={`py-16 md:py-24 px-5 ${dark ? "bg-[#050505]" : "bg-black"} ${className}`}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  )
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-4">{children}</h2>
      {sub && <p className="text-gray-400 text-lg max-w-2xl mx-auto">{sub}</p>}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EarlyBirdPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* URGENT TOP BAR */}
      <div className="bg-red-600 text-white text-center py-3 px-4 font-bold text-sm tracking-wide sticky top-0 z-50 flex items-center justify-center gap-2">
        <span className="hidden sm:inline">⚠️</span>
        WARNING: This page comes down when all 500 spots are claimed. Act NOW before it's too late!
        <span className="hidden sm:inline">⚠️</span>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <Section>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black font-black px-5 py-2 rounded-full text-xs uppercase tracking-widest mb-8">
            Attention: Coaches, Consultants &amp; Agency Owners
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 uppercase tracking-tight">
            Finally — A System That Runs Your
            <span className="text-yellow-400"> Webinars 24/7</span>
            <br className="hidden md:block" />{" "}
            While You Sleep, Golf,{" "}
            <br className="hidden md:block" />
            Or Do Whatever You Want
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed">
            The same AI technology used by 7-figure coaches is now available to{" "}
            <span className="text-white font-bold">YOU</span> for just{" "}
            <span className="text-yellow-400 font-black">$49 one-time</span> —
            but only for the next 500 people who act today.
          </p>

          <SpotCounter />
        </div>

        <div className="mt-10">
          <VideoPlayer />
        </div>

        {/* COUNTDOWN */}
        <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-6 max-w-md mx-auto mb-10 text-center">
          <p className="text-red-400 font-black text-sm uppercase tracking-widest mb-4">This offer expires in:</p>
          <CountdownTimer />
          <p className="text-gray-500 text-xs mt-4">
            After this timer hits zero, the price jumps to $97/month — forever.
          </p>
        </div>

        <CTAButton size="lg" />
      </Section>

      {/* ── PAIN ─────────────────────────────────────────────────────────────── */}
      <Section dark>
        <SectionTitle>Be Honest With Yourself For A Second...</SectionTitle>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {[
            "You're tired of showing up LIVE every week just to make sales",
            "Your webinars have low attendance and even lower conversions",
            "You spend hours creating content that nobody actually buys from",
            "You watch competitors crush it while you struggle to get leads",
            "You know webinars work — but the tech and time kill you every time",
            "You've tried other tools but they're too complicated or too expensive",
          ].map((pain) => (
            <div key={pain} className="flex items-start gap-3 bg-red-500/8 border border-red-500/25 rounded-2xl p-4">
              <span className="text-red-400 text-lg flex-shrink-0 mt-0.5">✕</span>
              <p className="text-gray-300 text-sm leading-relaxed">{pain}</p>
            </div>
          ))}
        </div>
        <p className="text-xl md:text-2xl font-black text-yellow-400 text-center">
          If you nodded yes to ANY of these — keep reading. This is for you.
        </p>
      </Section>

      {/* ── SOLUTION ─────────────────────────────────────────────────────────── */}
      <Section>
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-400 text-black font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6">
            Introducing
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-4">
            WebinarForge AI
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            The world's first AI Operating System for evergreen webinars that builds,
            presents, and converts for you — completely on autopilot.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {[
            { icon: "🤖", title: "AI Builds Everything", desc: "Script, slides, funnel, CTAs — generated in minutes. Not hours. Not days. Minutes." },
            { icon: "🎭", title: "AI Presents For You", desc: "Your AI avatar delivers your webinar 24/7 while you do literally anything else." },
            { icon: "💰", title: "AI Converts Leads", desc: "Automated follow-up, email sequences, and retargeting that turns viewers into buyers." },
            { icon: "📊", title: "Real-Time Analytics", desc: "See exactly what's converting. Registrations, clicks, revenue — all in one dashboard." },
            { icon: "🔄", title: "Evergreen Engine", desc: "Your webinar runs forever. Set it once and collect leads and sales indefinitely." },
            { icon: "⚡", title: "Launch In Minutes", desc: "From zero to live webinar funnel in under 10 minutes. No tech skills required." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="group bg-white/3 hover:bg-white/6 border border-white/8 hover:border-yellow-400/40 rounded-2xl p-6 transition-all duration-200">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-base font-black mb-2 text-yellow-400">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <CTAButton size="lg" />
      </Section>

      {/* ── VALUE STACK ──────────────────────────────────────────────────────── */}
      <Section dark>
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle sub="Total value: over $3,285 — yours for just $49 one-time">
            Here's Everything You Get Today
          </SectionTitle>

          <div className="space-y-3 mb-10">
            {[
              { item: "AI Webinar Builder", value: "$997" },
              { item: "AI Avatar Presenter", value: "$497" },
              { item: "Proven Funnel Templates", value: "$297" },
              { item: "Email + SMS Automation", value: "$497" },
              { item: "Evergreen Replay Engine", value: "$997" },
              { item: "Early Bird Lifetime Access", value: "PRICELESS" },
            ].map(({ item, value }) => (
              <div key={item} className="flex items-center justify-between bg-white/4 border border-white/10 rounded-xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400">✔</span>
                  <span className="font-semibold text-sm md:text-base">{item}</span>
                </div>
                <span className="text-gray-500 line-through text-sm">{value}</span>
              </div>
            ))}
          </div>

          <div className="relative mb-10">
            <div className="absolute -inset-0.5 bg-yellow-400/20 rounded-3xl blur-md" />
            <div className="relative bg-yellow-400/8 border-2 border-yellow-400 rounded-3xl p-8">
              <p className="text-gray-400 text-base mb-1">Total Value: <span className="line-through">$3,285+</span></p>
              <p className="text-gray-400 text-base mb-3">Regular Price: <span className="line-through">$97/month</span></p>
              <p className="text-5xl md:text-6xl font-black text-yellow-400 mb-2">TODAY: $49</p>
              <p className="text-gray-400 text-sm">One-time payment. No monthly fees. Ever.</p>
            </div>
          </div>

          <CTAButton size="lg" />
        </div>
      </Section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>Real Results From Real Users</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah M.",
              role: "Business Coach",
              result: "312 registrations in my first week",
              quote: "I set up my webinar funnel in 8 minutes. By the next morning I had 312 registrations and 18 sales. This thing is insane.",
              stars: 5,
            },
            {
              name: "James K.",
              role: "SaaS Founder",
              result: "18.4% conversion rate",
              quote: "My old webinars converted at 3%. WebinarForge AI got me to 18.4% in my first funnel. I wish I had this two years ago.",
              stars: 5,
            },
            {
              name: "Maria L.",
              role: "Marketing Consultant",
              result: "$14,700 in 30 days",
              quote: "I run webinars for my clients now using WebinarForge AI. Made $14,700 last month while the AI did all the presenting.",
              stars: 5,
            },
          ].map(({ name, role, result, quote, stars }) => (
            <div key={name} className="bg-white/4 border border-white/10 rounded-2xl p-6 flex flex-col">
              <div className="text-yellow-400 text-lg mb-3 tracking-widest">{"★".repeat(stars)}</div>
              <p className="text-gray-300 text-sm leading-relaxed italic flex-1 mb-4">"{quote}"</p>
              <div className="border-t border-white/10 pt-4">
                <p className="font-black text-yellow-400 text-sm">{result}</p>
                <p className="text-white font-semibold text-sm mt-0.5">{name}</p>
                <p className="text-gray-500 text-xs">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── GUARANTEE ────────────────────────────────────────────────────────── */}
      <Section dark>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-7xl mb-6">🛡️</div>
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 leading-tight">
            30-Day Money Back Guarantee
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            Try WebinarForge AI for a full 30 days. If you don't get results,
            if it's not the easiest webinar tool you've ever used, or if you're
            not completely blown away — email us and we'll refund every penny.
            No questions. No hassle. No hard feelings.
          </p>
          <p className="text-yellow-400 font-black text-xl">
            You either get results or you get your money back. Period.
          </p>
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle>You're Probably Wondering...</SectionTitle>
        <div className="max-w-3xl mx-auto space-y-3">
          {[
            { q: "Do I need any tech skills?", a: "Zero. If you can fill out a form, you can launch a webinar funnel with WebinarForge AI. We built it for non-tech people from the ground up." },
            { q: "How fast can I launch my first webinar?", a: "Most users launch their first evergreen webinar funnel in under 10 minutes. The AI does 95% of the work — you just review and publish." },
            { q: "Is this really a one-time payment?", a: "Yes. $49 one-time. No monthly fees, no hidden charges, no surprises. Early bird members lock in lifetime access permanently." },
            { q: "What happens after the early bird closes?", a: "The price goes to $97/month — permanently. Once the 500 early bird spots are gone, this offer is gone forever. There's no way to get it back at this price." },
            { q: "Does it work for my niche?", a: "WebinarForge AI works for coaches, consultants, SaaS, real estate, agencies, local businesses, and more. If you have an offer, it will work." },
            { q: "What if I already have a webinar tool?", a: "Most people who switch to WebinarForge AI never go back. It replaces 5–7 different tools and does everything automatically — often better." },
          ].map(({ q, a }) => (
            <FAQ key={q} q={q} a={a} />
          ))}
        </div>
      </Section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 bg-yellow-400/5 border-t-4 border-yellow-400">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-5">
            This Is Your Last Chance
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
            500 spots. $49 one-time. Lifetime access. When they're gone — they're{" "}
            <span className="text-yellow-400 font-black">GONE.</span> Don't be the person
            who waits and pays $97/month forever.
          </p>

          <div className="mb-10">
            <CountdownTimer />
          </div>

          <div className="mb-10">
            <CTAButton size="lg" />
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-500 mb-8">
            <span>🔒 256-bit SSL Secure</span>
            <span>💳 All Cards Accepted</span>
            <span>🔄 30-Day Guarantee</span>
            <span>⚡ Instant Access</span>
          </div>

          <p className="text-gray-700 text-xs">
            WebinarForge AI &nbsp;·&nbsp; hello@webinarforge.ai &nbsp;·&nbsp;
            <Link href="/privacy" className="underline hover:text-gray-500 transition-colors">Privacy</Link>
            &nbsp;·&nbsp;
            <Link href="/terms" className="underline hover:text-gray-500 transition-colors">Terms</Link>
          </p>
        </div>
      </section>

    </main>
  )
}
