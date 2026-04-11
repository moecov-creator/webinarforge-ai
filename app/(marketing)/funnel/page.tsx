"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

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
    <div className="flex gap-2 justify-center">
      {[
        { label: "HRS", value: time.hours },
        { label: "MIN", value: time.minutes },
        { label: "SEC", value: time.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="bg-red-600 rounded-lg px-3 py-2 min-w-[60px] text-center">
          <div className="text-2xl font-black text-white">
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-xs text-red-200">{label}</div>
        </div>
      ))}
    </div>
  )
}

function CTAButton() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
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
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full max-w-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black py-6 px-8 rounded-xl text-2xl transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(250,204,21,0.5)] animate-pulse"
    >
      {loading ? (
        <>
          <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        "YES! GIVE ME INSTANT ACCESS FOR $49 →"
      )}
    </button>
  )
}

export default function FunnelPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* URGENT TOP BAR */}
      <div className="bg-red-600 text-white text-center py-3 px-4 font-bold text-sm">
        ⚠️ WARNING: This page will come down when all 500 spots are claimed.
        Act NOW before it is too late!
      </div>

      {/* HERO */}
      <section className="py-16 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-block bg-yellow-400 text-black font-black px-6 py-2 rounded-full text-sm mb-8 uppercase tracking-wide">
          Attention: Coaches, Consultants & Agency Owners
        </div>

        <h1 className="text-4xl md:text-7xl font-black leading-tight mb-6 uppercase">
          Finally — A System That Runs Your
          <span className="text-yellow-400"> Webinars 24/7</span>
          <br />While You Sleep, Golf, Or Do Whatever You Want
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
          The same AI technology used by 7-figure coaches is now available to YOU
          for just <span className="text-yellow-400 font-black">$49 one-time</span> —
          but only for the next 500 people who act today.
        </p>

        {/* VIDEO PLACEHOLDER */}
        <div className="relative max-w-3xl mx-auto mb-10 rounded-2xl overflow-hidden border-4 border-yellow-400">
          <div className="bg-gray-900 aspect-video flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-yellow-300 transition">
              <svg className="w-8 h-8 text-black ml-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Watch This Short Video First</p>
            <p className="text-yellow-400 font-bold mt-1">
              (This changes everything — 3 mins)
            </p>
          </div>
        </div>

        {/* COUNTDOWN */}
        <div className="bg-red-600/20 border-2 border-red-500 rounded-2xl p-6 max-w-lg mx-auto mb-10">
          <p className="text-red-400 font-black text-lg mb-3 uppercase">
            This offer expires in:
          </p>
          <CountdownTimer />
          <p className="text-gray-400 text-sm mt-3">
            After this timer hits zero the price goes to $97/month — forever.
          </p>
        </div>

        <CTAButton />

        <p className="text-gray-500 text-sm mt-4">
          🔒 Secure 256-bit SSL Checkout · Instant Access · 30-Day Money Back Guarantee
        </p>
      </section>

      {/* PAIN SECTION */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-12 uppercase">
            Be Honest With Yourself For A Second...
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              "You are tired of showing up LIVE every week just to make sales",
              "Your webinars have low attendance and even lower conversions",
              "You spend hours creating content that nobody buys from",
              "You watch competitors crush it while you struggle to get leads",
              "You know webinars work — but the tech and time kill you every time",
              "You have tried other tools but they are too complicated or too expensive",
            ].map((pain) => (
              <div key={pain} className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <span className="text-red-400 text-xl flex-shrink-0">❌</span>
                <p className="text-gray-300">{pain}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl font-black text-yellow-400 mt-12">
            If you nodded yes to ANY of these — keep reading. This is for you.
          </p>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-block bg-yellow-400 text-black font-black px-4 py-1 rounded-full text-sm mb-6 uppercase">
          Introducing
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase">
          WebinarForge AI
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          The world is first AI Operating System for evergreen webinars that builds,
          presents, and converts for you — completely on autopilot.
        </p>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "🤖",
              title: "AI Builds Everything",
              desc: "Script, slides, funnel, CTAs — generated in minutes. Not hours. Not days. Minutes.",
            },
            {
              icon: "🎭",
              title: "AI Presents For You",
              desc: "Your AI avatar presenter delivers your webinar 24/7 while you do literally anything else.",
            },
            {
              icon: "💰",
              title: "AI Converts Leads",
              desc: "Automated follow-up, email sequences, and retargeting that turns viewers into buyers.",
            },
            {
              icon: "📊",
              title: "Real-Time Analytics",
              desc: "See exactly what is converting. Registrations, clicks, revenue — all in one dashboard.",
            },
            {
              icon: "🔄",
              title: "Evergreen Engine",
              desc: "Your webinar runs forever. Set it once and collect leads and sales indefinitely.",
            },
            {
              icon: "⚡",
              title: "Launch In Minutes",
              desc: "From zero to live webinar funnel in under 10 minutes. No tech skills required.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white/5 border border-yellow-400/30 rounded-2xl p-6 text-left">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="text-xl font-black mb-2 text-yellow-400">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <CTAButton />
      </section>

      {/* VALUE STACK */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase">
            Here is Everything You Get Today
          </h2>
          <p className="text-gray-400 mb-10">
            Total value: over $3,285 — yours for just $49 one-time
          </p>

          <div className="space-y-4 mb-10">
            {[
              { item: "AI Webinar Builder", value: "$997" },
              { item: "AI Avatar Presenter", value: "$497" },
              { item: "Proven Funnel Templates", value: "$297" },
              { item: "Email + SMS Automation", value: "$497" },
              { item: "Evergreen Replay Engine", value: "$997" },
              { item: "Early Bird Lifetime Access", value: "PRICELESS" },
            ].map(({ item, value }) => (
              <div key={item} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 text-xl">✅</span>
                  <span className="font-semibold">{item}</span>
                </div>
                <span className="text-gray-400 line-through">{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-yellow-400/10 border-2 border-yellow-400 rounded-2xl p-8 mb-8">
            <p className="text-gray-400 text-lg mb-2">Total Value: <span className="line-through">$3,285+</span></p>
            <p className="text-gray-400 text-lg mb-2">Regular Price: <span className="line-through">$97/month</span></p>
            <p className="text-5xl font-black text-yellow-400">TODAY: $49</p>
            <p className="text-gray-400 text-sm mt-2">One-time payment. No monthly fees. Ever.</p>
          </div>

          <CTAButton />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-center mb-12 uppercase">
          Real Results From Real Users
        </h2>
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
            <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-yellow-400 text-xl mb-3">
                {"★".repeat(stars)}
              </div>
              <p className="text-gray-300 text-sm mb-4 italic">"{quote}"</p>
              <div className="border-t border-white/10 pt-4">
                <p className="font-black text-yellow-400">{result}</p>
                <p className="text-white font-semibold">{name}</p>
                <p className="text-gray-500 text-sm">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-8xl mb-6">🛡️</div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase">
            30-Day Money Back Guarantee
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Try WebinarForge AI for a full 30 days. If you do not get results,
            if it is not the easiest webinar tool you have ever used, or if you
            are not completely blown away — email us and we will refund every penny.
            No questions. No hassle. No hard feelings.
          </p>
          <p className="text-yellow-400 font-black text-xl">
            You either get results or you get your money back. Period.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-center mb-12 uppercase">
          You Are Probably Wondering...
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Do I need any tech skills?",
              a: "Zero. If you can fill out a form you can launch a webinar funnel with WebinarForge AI. We built it for non-tech people.",
            },
            {
              q: "How fast can I launch my first webinar?",
              a: "Most users launch their first evergreen webinar funnel in under 10 minutes. The AI does 95% of the work.",
            },
            {
              q: "Is this really a one-time payment?",
              a: "Yes. $49 one-time. No monthly fees, no hidden charges, no surprises. Early bird members lock in lifetime access.",
            },
            {
              q: "What happens after the early bird closes?",
              a: "The price goes to $97/month — permanently. Once the 500 early bird spots are gone, this offer is gone forever.",
            },
            {
              q: "Does it work for my niche?",
              a: "WebinarForge AI works for coaches, consultants, SaaS, real estate, agencies, local businesses, and more. If you have an offer, it will work.",
            },
            {
              q: "What if I already have a webinar tool?",
              a: "Most people who switch to WebinarForge AI never go back. It replaces 5-7 different tools and does everything automatically.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-black text-lg text-yellow-400 mb-2">{q}</h3>
              <p className="text-gray-400">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 bg-yellow-400/5 border-t-4 border-yellow-400">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase">
            This Is Your Last Chance
          </h2>
          <p className="text-gray-300 text-xl mb-8">
            500 spots. $49 one-time. Lifetime access. When they are gone — they are GONE.
            Do not be the person who waits and pays $97/month forever.
          </p>

          <div className="mb-8">
            <CountdownTimer />
          </div>

          <CTAButton />

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-500">
            <span>🔒 256-bit SSL Secure</span>
            <span>💳 All Cards Accepted</span>
            <span>🔄 30-Day Guarantee</span>
            <span>⚡ Instant Access</span>
          </div>

          <p className="text-gray-600 text-xs mt-6">
            WebinarForge AI · hello@webinarforge.ai ·{" "}
            <Link href="/privacy" className="underline">Privacy</Link> ·{" "}
            <Link href="/terms" className="underline">Terms</Link>
          </p>
        </div>
      </section>

    </main>
  )
}
