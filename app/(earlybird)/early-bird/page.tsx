"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

// ─── Spots config — update CLAIMED_SPOTS as real purchases come in ────────────
const TOTAL_SPOTS = 500
const CLAIMED_SPOTS = 387  // ← update this number as spots fill up

// ─── Spots countdown bar ──────────────────────────────────────────────────────
function SpotsBar() {
  const remaining = TOTAL_SPOTS - CLAIMED_SPOTS
  const pct = Math.round((CLAIMED_SPOTS / TOTAL_SPOTS) * 100)
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
      <p className="text-red-700 font-black text-sm uppercase tracking-widest mb-3">
        ⚠️ Spots Remaining
      </p>
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="text-center">
          <div className="text-4xl font-black text-red-600">{remaining}</div>
          <div className="text-xs text-red-400 font-semibold uppercase tracking-wider">Left</div>
        </div>
        <div className="text-gray-300 text-2xl font-thin">|</div>
        <div className="text-center">
          <div className="text-4xl font-black text-gray-800">{TOTAL_SPOTS}</div>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total</div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
        <div
          className="h-3 bg-red-600 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">
        <span className="text-red-600 font-bold">{CLAIMED_SPOTS} people</span> have already claimed their spot
      </p>
    </div>
  )
}

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer() {
  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-gray-800 bg-black">
      <iframe
        src="https://player.vimeo.com/video/1187522463?h=b04750c25a&badge=0&autopause=0&player_id=0&app_id=58479"
        className="w-full aspect-video border-none block"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        loading="lazy"
        title="WebinarForge AI — Early Bird Offer"
      />
    </div>
  )
}
// ─── Order Bump ───────────────────────────────────────────────────────────────
function OrderBump({
  checked,
  onToggle,
}: {
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      className={`w-full max-w-xl mx-auto cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-5 ${
        checked
          ? "border-amber-500 bg-amber-50"
          : "border-gray-300 bg-gray-50 hover:border-amber-400 hover:bg-amber-50/50"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div
          className={`w-6 h-6 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
            checked
              ? "bg-amber-500 border-amber-500"
              : "border-gray-300 bg-white"
          }`}
        >
          {checked && (
            <svg className="w-3.5 h-3.5 text-white fill-none stroke-white" strokeWidth="3" viewBox="0 0 12 12">
              <polyline points="1.5,6 4.5,9 10.5,3" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
              ⚡ Special One-Time Offer
            </span>
          </div>
          <h4 className="text-base font-black text-gray-900 mb-1">
            Add AI Webinar Templates Pack{" "}
            <span className="text-amber-600">+$47</span>
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            Get 10+ proven webinar scripts and frameworks — coach, SaaS, agency,
            and course creator niches — so you can launch faster with copy that
            already converts.
          </p>
          <ul className="space-y-1">
            {[
              "10+ done-for-you webinar scripts",
              "High-converting hook frameworks",
              "Proven close sequences",
              "Instant download — use immediately",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="text-green-500 font-black flex-shrink-0">✔</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-gray-400 line-through">$97</div>
          <div className="text-xl font-black text-amber-600">$47</div>
        </div>
      </div>

      {checked && (
        <div className="mt-3 pt-3 border-t border-amber-200 text-center">
          <p className="text-xs font-semibold text-amber-700">
            ✔ Added to your order — you're getting the Templates Pack!
          </p>
        </div>
      )}
    </div>
  )
}

// ─── CTA Button — bump-aware ──────────────────────────────────────────────────
function CTAButton({
  size = "lg",
  bumpChecked = false,
}: {
  size?: "lg" | "md"
  bumpChecked?: boolean
}) {
  const { isSignedIn, isLoaded } = useAuth()
  const [loading, setLoading] = useState(false)
  const total = bumpChecked ? 96 : 49

  const handleClick = async () => {
    if (!isLoaded) return
    setLoading(true)

    if (isSignedIn) {
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planKey: "EARLY_BIRD",
            includeBump: bumpChecked, // ← separate flag, not a different planKey
          }),
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
      sessionStorage.setItem("checkout_bump", bumpChecked ? "true" : "false")
      window.location.href = "/sign-up"
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`relative w-full max-w-xl flex items-center justify-center gap-3 font-black rounded-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden bg-green-500 hover:bg-green-400 text-white group ${
          size === "lg" ? "py-5 px-8 text-xl md:text-2xl" : "py-4 px-6 text-lg"
        }`}
        style={{ boxShadow: "0 4px 20px rgba(34,197,94,0.4)" }}
      >
        <span className="absolute inset-0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : (
          `YES! GET INSTANT ACCESS FOR $${total} →`
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
      className="w-full text-left bg-white hover:bg-gray-50 border border-gray-200 hover:border-green-400 rounded-2xl px-6 py-5 transition-all text-left"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-black text-base text-gray-900 leading-snug">{q}</h3>
        <span className={`text-green-500 text-xl flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      {open && (
        <p className="text-gray-600 text-sm leading-relaxed mt-3 border-t border-gray-100 pt-3">{a}</p>
      )}
    </button>
  )
}

// ─── Section helpers ──────────────────────────────────────────────────────────
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-16 md:py-20 px-5 ${className}`}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EarlyBirdPage() {
  const remaining = TOTAL_SPOTS - CLAIMED_SPOTS
  const [bumpChecked, setBumpChecked] = useState(false)

  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── URGENT TOP BAR ───────────────────────────────────────────────── */}
      <div className="bg-red-600 text-white text-center py-3 px-4 font-bold text-sm tracking-wide sticky top-0 z-50">
        ⚠️ WARNING: Only {remaining} of {TOTAL_SPOTS} spots remaining. This offer closes permanently when all spots are claimed!
      </div>

      {/* ── HERO — DotCom Secrets two-column layout ──────────────────────── */}
      <Section className="bg-white pt-10 pb-8">

        {/* Eyebrow */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white font-black px-5 py-2 rounded-full text-xs uppercase tracking-widest">
            Attention: Coaches, Consultants &amp; Agency Owners
          </div>
        </div>

        {/* Main headline */}
        <div className="text-center mb-8">
          <p className="text-base md:text-lg text-gray-600 mb-3">
            Want To Build an AI-Powered Webinar That Generates Leads On Autopilot?
          </p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-gray-900 mb-4">
            Get Lifetime Access to<br />
            <span className="text-green-500">WebinarForge AI</span><br />
            for Just{" "}
            <span className="relative inline-block">
              <span className="relative z-10">$49</span>
              <span className="absolute inset-0 bg-yellow-300 -rotate-1 rounded" />
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            <strong className="text-gray-900">WebinarForge AI Is The #1 AI Operating System</strong>{" "}
            For Building Evergreen Webinars That Generate Leads, Book Appointments,
            And Close Sales — Completely On Autopilot.
          </p>
        </div>

        {/* Two-column: VSL left, offer panel right */}
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">

          {/* LEFT — VSL */}
          <div>
            <VideoPlayer />
            <div className="flex items-center gap-2 mt-3 justify-center">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 14V8l6 4-6 4z"/></svg>
              </div>
              <p className="text-gray-500 text-xs font-semibold">Make Sure Your Sound Is ON! Watch This Short Video First</p>
            </div>

            {/* Below video — endorsement quotes */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { initials: "SM", name: "Sarah M.", role: "Business Coach", quote: '"I had 312 registrations by the next morning. This thing is insane."', color: "#7c3aed", result: "312 registrations · week 1" },
                { initials: "JK", name: "James K.", role: "SaaS Founder", quote: '"My conversion rate jumped from 3% to 18.4%. I wish I had this years ago."', color: "#059669", result: "18.4% conversion rate" },
              ].map(({ initials, name, role, quote, color, result }) => (
                <div key={name} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0" style={{ background: color }}>
                      {initials}
                    </div>
                    <div>
                      <div className="text-yellow-400 text-xs">★★★★★</div>
                      <div className="font-black text-green-600 text-[10px]">{result}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-xs leading-relaxed italic mb-2">{quote}</p>
                  <p className="text-gray-500 text-[10px] font-semibold">{name} — {role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Offer panel */}
          <div className="md:sticky md:top-20">

            {/* Product visual */}
            <div className="border-2 border-gray-900 rounded-2xl overflow-hidden mb-4 bg-white">
              {/* Product header */}
              <div className="bg-gray-900 p-5 text-center">
                <div className="w-full mx-auto mb-3">
                  <img
                    src="https://i.ibb.co/mFGHpzg0/Gemini-Generated-Image-avcc9oavcc9oavcc.png"
                    alt="AI Webinar Templates Pack"
                    className="w-full rounded-lg shadow-xl"
                  />
                </div>
                {/* Stars */}
                <div className="flex items-center justify-center gap-0.5 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-gray-400 text-xs">{CLAIMED_SPOTS}+ early users</p>
              </div>

              {/* CTA section */}
              <div className="p-5">
                <div className="text-center mb-4">
                  <p className="text-gray-500 text-sm line-through mb-0.5">Regular Price: $97/month</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black text-gray-900">${bumpChecked ? 96 : 49}</span>
                    <span className="text-gray-500 text-sm">one-time</span>
                  </div>
                  <p className="text-green-600 text-xs font-bold mt-1">No monthly fees. Ever.</p>
                </div>
                {/* Order bump */}
                <div className="mb-4">
                  <OrderBump checked={bumpChecked} onToggle={() => setBumpChecked(!bumpChecked)} />
                </div>
                <CTAButton size="md" bumpChecked={bumpChecked} />
              </div>
            </div>

            {/* Spots remaining */}
            <SpotsBar />

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {[
                ["🔒", "256-bit SSL", "Secure checkout"],
                ["⚡", "Instant Access", "Start in minutes"],
                ["🔄", "30-Day Guarantee", "Full refund policy"],
                ["💳", "All Cards", "Accepted worldwide"],
              ].map(([icon, title, sub]) => (
                <div key={title as string} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                  <div className="text-base mb-1">{icon}</div>
                  <div className="text-xs font-semibold text-gray-800">{title}</div>
                  <div className="text-[10px] text-gray-400">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── PAIN ─────────────────────────────────────────────────────────── */}
      <Section className="bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-12 leading-tight text-gray-900">
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
              <div key={pain} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                <span className="text-red-500 text-lg flex-shrink-0 mt-0.5">✕</span>
                <p className="text-gray-700 text-sm leading-relaxed">{pain}</p>
              </div>
            ))}
          </div>
          <p className="text-xl md:text-2xl font-black text-green-600">
            If you nodded yes to ANY of these — keep reading. This is for you.
          </p>
        </div>
      </Section>

      {/* ── SOLUTION ─────────────────────────────────────────────────────── */}
      <Section className="bg-white">
        <div className="text-center mb-12">
          <div className="inline-block bg-gray-900 text-white font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6">Introducing</div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-gray-900 mb-4">WebinarForge AI</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
            <div key={title} className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-green-400 rounded-2xl p-6 text-left transition-all">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-base font-black mb-2 text-gray-900">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <CTAButton size="lg" bumpChecked={bumpChecked} />
        </div>
      </Section>

      {/* ── VALUE STACK ──────────────────────────────────────────────────── */}
      <Section className="bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-4 leading-tight text-gray-900">
            Here's Everything You Get Today
          </h2>
          <p className="text-gray-500 mb-8">Total value: over $3,285 — yours for just $49 one-time</p>

          {/* Product image */}
          <div className="flex justify-center mb-10">
            <img
              src="https://i.ibb.co/Qjp7Cbzh/webinarforge-product-image.png"
              alt="WebinarForge AI — AI Webinar Templates Pack and Software"
              className="w-full max-w-2xl rounded-2xl shadow-2xl"
            />
          </div>

          <div className="space-y-3 mb-10">
            {[
              { item: "AI Webinar Builder", value: "$997" },
              { item: "AI Avatar Presenter", value: "$497" },
              { item: "Proven Funnel Templates", value: "$297" },
              { item: "Email + SMS Automation", value: "$497" },
              { item: "Evergreen Replay Engine", value: "$997" },
              { item: "Early Bird Lifetime Access", value: "PRICELESS" },
            ].map(({ item, value }) => (
              <div key={item} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-green-500 font-black">✔</span>
                  <span className="font-semibold text-sm md:text-base text-gray-800">{item}</span>
                </div>
                <span className="text-gray-400 line-through text-sm">{value}</span>
              </div>
            ))}
          </div>

          {/* Price box */}
          <div className="bg-white border-4 border-gray-900 rounded-3xl p-8 mb-6">
            <p className="text-gray-500 text-base mb-1">Total Value: <span className="line-through">$3,285+</span></p>
            <p className="text-gray-500 text-base mb-3">Regular Price: <span className="line-through">$97/month</span></p>
            <p className="text-5xl md:text-6xl font-black text-gray-900 mb-1">TODAY: $49</p>
            <p className="text-green-600 font-bold">One-time payment. No monthly fees. Ever.</p>
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 font-black text-sm">
                ⚠️ Only {remaining} of {TOTAL_SPOTS} spots remaining — offer closes permanently when all spots are claimed
              </p>
            </div>
          </div>

          {/* Spots bar in value section */}
          <div className="mb-8">
            <SpotsBar />
          </div>

          <div className="flex justify-center">
            <CTAButton size="lg" bumpChecked={bumpChecked} />
          </div>
        </div>
      </Section>

      {/* ── ALL TESTIMONIALS ─────────────────────────────────────────────── */}
      <Section className="bg-white">
        <h2 className="text-3xl md:text-5xl font-black uppercase text-center mb-12 leading-tight text-gray-900">
          Real Results From Real Users
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { initials: "SM", name: "Sarah M.", role: "Business Coach", result: "312 registrations in first week", quote: "I set up my webinar funnel in 8 minutes. By the next morning I had 312 registrations and 18 sales. This thing is insane.", color: "#7c3aed" },
            { initials: "JK", name: "James K.", role: "SaaS Founder", result: "18.4% conversion rate", quote: "My old webinars converted at 3%. WebinarForge AI got me to 18.4% in my first funnel. I wish I had this two years ago.", color: "#059669" },
            { initials: "ML", name: "Maria L.", role: "Marketing Consultant", result: "$14,700 in 30 days", quote: "I run webinars for my clients now using WebinarForge AI. Made $14,700 last month while the AI did all the presenting.", color: "#d97706" },
          ].map(({ initials, name, role, result, quote, color }) => (
            <div key={name} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0" style={{ background: color }}>
                  {initials}
                </div>
                <div>
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                  <div className="font-black text-green-600 text-xs mt-0.5">{result}</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic flex-1 mb-3">"{quote}"</p>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-gray-900 font-semibold text-sm">{name}</p>
                <p className="text-gray-400 text-xs">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── GUARANTEE ────────────────────────────────────────────────────── */}
      <Section className="bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-7xl mb-6">🛡️</div>
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 leading-tight text-gray-900">
            30-Day Money Back Guarantee
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            Try WebinarForge AI for a full 30 days. If you don't get results,
            if it's not the easiest webinar tool you've ever used, or if you're
            not completely blown away — email us and we'll refund every penny.
            No questions. No hassle. No hard feelings.
          </p>
          <p className="text-green-600 font-black text-xl">
            You either get results or you get your money back. Period.
          </p>
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-center mb-12 leading-tight text-gray-900">
            You're Probably Wondering...
          </h2>
          <div className="space-y-3">
            {[
              { q: "Do I need any tech skills?", a: "Zero. If you can fill out a form, you can launch a webinar funnel with WebinarForge AI. We built it for non-tech people from the ground up." },
              { q: "How fast can I launch my first webinar?", a: "Most users launch their first evergreen webinar funnel in under 10 minutes. The AI does 95% of the work — you just review and publish." },
              { q: "Is this really a one-time payment?", a: "Yes. $49 one-time. No monthly fees, no hidden charges, no surprises. Early bird members lock in lifetime access permanently." },
              { q: "What happens when all 500 spots are claimed?", a: "The early bird offer closes permanently and the price goes to $97/month. Once the 500 spots are gone, this offer is gone forever. There's no way to get it back at this price." },
              { q: "Does it work for my niche?", a: "WebinarForge AI works for coaches, consultants, SaaS, real estate, agencies, local businesses, and more. If you have an offer, it will work." },
              { q: "What if I already have a webinar tool?", a: "Most people who switch to WebinarForge AI never go back. It replaces 5–7 different tools and does everything automatically — often better." },
            ].map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-5 text-white">
            This Is Your Last Chance
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
            500 spots. $49 one-time. Lifetime access.{" "}
            <span className="text-yellow-400 font-black">
              When they're gone — they're GONE.
            </span>{" "}
            Don't be the person who waits and pays $97/month forever.
          </p>

          <div className="max-w-sm mx-auto mb-8">
            <SpotsBar />
          </div>

          <div className="mb-8">
            <CTAButton size="lg" bumpChecked={bumpChecked} />
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-400 mb-8">
            <span>🔒 256-bit SSL Secure</span>
            <span>💳 All Cards Accepted</span>
            <span>🔄 30-Day Guarantee</span>
            <span>⚡ Instant Access</span>
          </div>

          <p className="text-gray-600 text-xs">
            WebinarForge AI &nbsp;·&nbsp; hello@webinarforge.ai &nbsp;·&nbsp;
            <Link href="/privacy" className="underline hover:text-gray-400 transition-colors">Privacy</Link>
            &nbsp;·&nbsp;
            <Link href="/terms" className="underline hover:text-gray-400 transition-colors">Terms</Link>
          </p>
          <p className="text-gray-600 text-xs mt-1">
            WebinarForge AI, LLC &nbsp;■&nbsp; All Rights Reserved © 2026 &nbsp;■&nbsp; 19179 Blanco Rd Ste 105 PMB 1036, San Antonio, TX 78258
          </p>
          <p className="text-gray-600 text-xs mt-3 max-w-2xl mx-auto leading-relaxed">
            EARNINGS DISCLAIMER: Results mentioned are not typical. Individual results will vary based on effort, experience, and market conditions. WebinarForge AI is a software tool — your results depend on how you use it.
          </p>
        </div>
      </section>

    </main>
  )
}
