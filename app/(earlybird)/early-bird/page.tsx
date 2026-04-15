"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

// ─── Launch date: April 23, 2026 ─────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-04-23T00:00:00")

// ─── Countdown to launch date ─────────────────────────────────────────────────
function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, LAUNCH_DATE.getTime() - Date.now())
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex gap-3 justify-center">
      {[
        { label: "DAYS", value: time.days },
        { label: "HRS", value: time.hours },
        { label: "MIN", value: time.minutes },
        { label: "SEC", value: time.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-red-600 border border-red-500 rounded-xl w-16 h-16 flex items-center justify-center">
            <span className="text-2xl font-black text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-red-400 text-[10px] font-bold mt-1.5 tracking-widest uppercase">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Video Player ─────────────────────────────────────────────────────────────
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
    <div className="relative">
      <div className="absolute -inset-1 bg-yellow-400/20 rounded-xl blur-md" />
      <div className="relative rounded-xl overflow-hidden border-2 border-yellow-400/70 bg-black">
        {embedSrc ? (
          <iframe
            src={embedSrc}
            className="w-full aspect-video border-none block"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        ) : (
          <div className="aspect-video flex flex-col items-center justify-center bg-gray-950 gap-3">
            <button
              onClick={() => setShowInput(true)}
              className="w-16 h-16 bg-yellow-400 hover:bg-yellow-300 rounded-full flex items-center justify-center transition-all hover:scale-105"
            >
              <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-gray-400 text-xs">Watch This Short Video First</p>
              <p className="text-yellow-400 font-bold text-xs mt-1">(This changes everything — 3 mins)</p>
            </div>
            {showInput && (
              <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-6">
                <div className="bg-[#111] border border-white/20 rounded-xl p-5 w-full max-w-sm">
                  <p className="text-xs text-yellow-400 font-semibold mb-2 uppercase tracking-widest">
                    Add Your AI Twin Video
                  </p>
                  <input
                    autoFocus
                    value={videoUrl}
                    onChange={(e) => handleUrl(e.target.value)}
                    placeholder="Paste YouTube, Vimeo, Loom, or HeyGen URL..."
                    className="w-full text-sm px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 outline-none focus:border-yellow-400/60 mb-3"
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
          className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded border border-white/20 hover:bg-black/80 transition-colors"
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

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`relative w-full max-w-xl flex items-center justify-center gap-3 font-black rounded-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden bg-yellow-400 hover:bg-yellow-300 text-black group ${size === "lg" ? "py-5 px-8 text-xl md:text-2xl" : "py-4 px-6 text-lg"}`}
        style={{ boxShadow: "0 0 40px rgba(250,204,21,0.4)" }}
      >
        <span className="absolute inset-0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : (
          "YES! GIVE ME INSTANT ACCESS FOR $49 →"
        )}
      </button>
      <p className="text-gray-500 text-xs text-center">
        🔒 256-bit SSL · Instant Access · 30-Day Money Back Guarantee
      </p>
    </div>
  )
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-white/4 hover:bg-white/6 border border-white/10 hover:border-yellow-400/30 rounded-2xl px-6 py-5 transition-all"
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

// ─── Spot counter ─────────────────────────────────────────────────────────────
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EarlyBirdPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── URGENT TOP BAR ───────────────────────────────────────────────── */}
      <div className="bg-red-600 text-white text-center py-3 px-4 font-bold text-sm tracking-wide sticky top-0 z-50">
        ⚠️ Early Bird Closes April 23, 2026 — After This Date Price Goes To $97/Month Forever! ⚠️
      </div>

      {/* ── HERO — DotCom Secrets two-column layout ──────────────────────── */}
      <section className="py-12 px-5 max-w-6xl mx-auto">

        {/* Eyebrow */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black font-black px-5 py-2 rounded-full text-xs uppercase tracking-widest">
            Attention: Coaches, Consultants &amp; Agency Owners
          </div>
        </div>

        {/* Two-column: VSL left, offer panel right */}
        <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">

          {/* LEFT — VSL + headline */}
          <div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 uppercase tracking-tight">
              Finally — The AI System That Runs Your
              <span className="text-yellow-400"> Webinars 24/7</span>{" "}
              While You Sleep, Golf, Or Do Whatever You Want
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              <strong className="text-white">WebinarForge AI Is The #1 AI Operating System</strong>{" "}
              For Coaches, Consultants &amp; Agency Owners Who Want To Generate Leads
              And Book Appointments On Complete Autopilot — No Tech Skills Required.
            </p>

            {/* VSL */}
            <VideoPlayer />

            <p className="text-gray-500 text-xs mt-2 text-center">
              ↑ Make Sure Your Sound Is ON! Watch This Short Video First
            </p>
          </div>

          {/* RIGHT — Offer panel (DotCom Secrets book panel style) */}
          <div className="md:sticky md:top-20">
            {/* Product image */}
            <div className="bg-gradient-to-br from-yellow-400/20 via-black to-purple-900/30 border-2 border-yellow-400/50 rounded-2xl p-6 mb-5 text-center">
              <div className="w-full aspect-[3/4] max-w-[180px] mx-auto mb-4 bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-500 rounded-xl flex flex-col items-center justify-center p-4 shadow-2xl">
                <div className="text-black font-black text-xs uppercase tracking-widest mb-1">WebinarForge</div>
                <div className="text-black font-black text-2xl leading-tight mb-1">AI</div>
                <div className="w-full h-px bg-black/30 my-2" />
                <div className="text-black text-[9px] font-bold uppercase tracking-wider text-center leading-tight mb-2">The AI Operating System For Evergreen Webinars</div>
                <div className="text-black text-[8px] font-semibold">BY WEBINARFORGE</div>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-3">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
                <span className="text-gray-400 text-xs ml-1">2,340+ early users</span>
              </div>

              <CTAButton size="md" />

              <p className="text-gray-500 text-xs mt-3">
                You pay just <span className="text-yellow-400 font-bold">$49 one-time</span> — no monthly fees ever
              </p>
            </div>

            {/* Closes date box */}
            <div className="bg-red-950/50 border border-red-500/40 rounded-2xl p-4 mb-5 text-center">
              <p className="text-red-400 font-black text-xs uppercase tracking-widest mb-3">
                Early Bird Closes:
              </p>
              <p className="text-white font-black text-lg mb-3">April 23, 2026</p>
              <CountdownTimer />
              <p className="text-gray-500 text-xs mt-3">
                After this date → $97/month forever
              </p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                ["🔒", "256-bit SSL", "Secure checkout"],
                ["⚡", "Instant Access", "Start in minutes"],
                ["🔄", "30-Day Guarantee", "Full refund policy"],
                ["💳", "All Cards", "Accepted worldwide"],
              ].map(([icon, title, sub]) => (
                <div key={title} className="bg-white/3 border border-white/8 rounded-xl p-3 text-center">
                  <div className="text-base mb-1">{icon}</div>
                  <div className="text-xs font-semibold text-white">{title}</div>
                  <div className="text-[10px] text-gray-600">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spot counter */}
        <div className="mt-6 text-center">
          <SpotCounter />
        </div>
      </section>

      {/* ── ENDORSEMENTS — DotCom Secrets celebrity row ──────────────────── */}
      <section className="py-10 px-5 bg-[#050505]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-gray-600 uppercase tracking-widest font-semibold mb-6">
            What industry leaders are saying
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { initials: "SM", name: "Sarah M.", role: "Business Coach", quote: "I set up my webinar funnel in 8 minutes. By the next morning I had 312 registrations and 18 sales. This thing is insane.", result: "312 registrations in first week", color: "#7c3aed" },
              { initials: "JK", name: "James K.", role: "SaaS Founder", quote: "My old webinars converted at 3%. WebinarForge AI got me to 18.4% in my first funnel. I wish I had this two years ago.", result: "18.4% conversion rate", color: "#059669" },
              { initials: "ML", name: "Maria L.", role: "Marketing Consultant", quote: "I run webinars for my clients now using WebinarForge AI. Made $14,700 last month while the AI did all the presenting.", result: "$14,700 in 30 days", color: "#d97706" },
            ].map(({ initials, name, role, quote, result, color }) => (
              <div key={name} className="bg-white/4 border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0" style={{ background: color }}>
                    {initials}
                  </div>
                  <div>
                    <div className="text-yellow-400 text-sm tracking-widest">★★★★★</div>
                    <div className="font-black text-yellow-400 text-xs mt-0.5">{result}</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic flex-1 mb-3">"{quote}"</p>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-gray-500 text-xs">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAIN ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-5 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-12 leading-tight">
            Be Honest With Yourself For A Second...
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-12 text-left">
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
          <p className="text-xl md:text-2xl font-black text-yellow-400">
            If you nodded yes to ANY of these — keep reading. This is for you.
          </p>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-5 bg-[#050505]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-yellow-400 text-black font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6">Introducing</div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-4">WebinarForge AI</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
            The world's first AI Operating System for evergreen webinars that builds,
            presents, and converts for you — completely on autopilot.
          </p>
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              { icon: "🤖", title: "AI Builds Everything", desc: "Script, slides, funnel, CTAs — generated in minutes. Not hours. Not days. Minutes." },
              { icon: "🎭", title: "AI Presents For You", desc: "Your AI avatar delivers your webinar 24/7 while you do literally anything else." },
              { icon: "💰", title: "AI Converts Leads", desc: "Automated follow-up, email sequences, and retargeting that turns viewers into buyers." },
              { icon: "📊", title: "Real-Time Analytics", desc: "See exactly what's converting. Registrations, clicks, revenue — all in one dashboard." },
              { icon: "🔄", title: "Evergreen Engine", desc: "Your webinar runs forever. Set it once and collect leads and sales indefinitely." },
              { icon: "⚡", title: "Launch In Minutes", desc: "From zero to live webinar funnel in under 10 minutes. No tech skills required." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/3 hover:bg-white/6 border border-white/8 hover:border-yellow-400/40 rounded-2xl p-6 text-left transition-all">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-base font-black mb-2 text-yellow-400">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <CTAButton size="lg" />
        </div>
      </section>

      {/* ── VALUE STACK ──────────────────────────────────────────────────── */}
      <section className="py-16 px-5 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-4 leading-tight">
            Here's Everything You Get Today
          </h2>
          <p className="text-gray-400 mb-10">Total value: over $3,285 — yours for just $49 one-time</p>
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
              <p className="text-gray-400 mb-1">Total Value: <span className="line-through">$3,285+</span></p>
              <p className="text-gray-400 mb-3">Regular Price: <span className="line-through">$97/month</span></p>
              <p className="text-5xl md:text-6xl font-black text-yellow-400 mb-2">TODAY: $49</p>
              <p className="text-gray-400 text-sm">One-time payment. No monthly fees. Ever.</p>
              <p className="text-red-400 font-bold text-sm mt-2">
                ⚠️ Early Bird closes April 23, 2026
              </p>
            </div>
          </div>
          <CTAButton size="lg" />
        </div>
      </section>

      {/* ── GUARANTEE ────────────────────────────────────────────────────── */}
      <section className="py-16 px-5 bg-[#050505]">
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
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-5 bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-center mb-12 leading-tight">
            You're Probably Wondering...
          </h2>
          <div className="space-y-3">
            {[
              { q: "Do I need any tech skills?", a: "Zero. If you can fill out a form, you can launch a webinar funnel with WebinarForge AI. We built it for non-tech people from the ground up." },
              { q: "How fast can I launch my first webinar?", a: "Most users launch their first evergreen webinar funnel in under 10 minutes. The AI does 95% of the work — you just review and publish." },
              { q: "Is this really a one-time payment?", a: "Yes. $49 one-time. No monthly fees, no hidden charges, no surprises. Early bird members lock in lifetime access permanently." },
              { q: "What happens after April 23, 2026?", a: "The price goes to $97/month — permanently. Once the 500 early bird spots are gone, this offer is gone forever. There's no way to get it back at this price." },
              { q: "Does it work for my niche?", a: "WebinarForge AI works for coaches, consultants, SaaS, real estate, agencies, local businesses, and more. If you have an offer, it will work." },
              { q: "What if I already have a webinar tool?", a: "Most people who switch to WebinarForge AI never go back. It replaces 5–7 different tools and does everything automatically — often better." },
            ].map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 bg-yellow-400/5 border-t-4 border-yellow-400">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-5">
            This Is Your Last Chance
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-4 max-w-2xl mx-auto">
            500 spots. $49 one-time. Lifetime access.{" "}
            <strong className="text-white">Early Bird closes April 23, 2026.</strong>{" "}
            After that — <span className="text-yellow-400 font-black">$97/month forever.</span>
          </p>

          <div className="mb-8">
            <CountdownTimer />
          </div>

          <div className="mb-8">
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
          <p className="text-gray-700 text-xs mt-3 max-w-2xl mx-auto leading-relaxed">
            EARNINGS DISCLAIMER: Results mentioned are not typical. Individual results will vary based on effort, experience, and market conditions. WebinarForge AI is a software tool — your results depend on how you use it.
          </p>
        </div>
      </section>

    </main>
  )
}
