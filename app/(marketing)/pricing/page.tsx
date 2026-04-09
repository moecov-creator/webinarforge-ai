"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const EARLY_BIRD_END = new Date("2026-04-16T23:59:59")
const TOTAL_SPOTS = 500
const SPOTS_STORAGE_KEY = "wf_spots_remaining"

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = EARLY_BIRD_END.getTime() - new Date().getTime()
      if (distance <= 0) {
        setExpired(true)
        clearInterval(timer)
        return
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return { timeLeft, expired }
}

function useSpotCounter() {
  const [spotsLeft, setSpotsLeft] = useState(TOTAL_SPOTS)

  useEffect(() => {
    const stored = localStorage.getItem(SPOTS_STORAGE_KEY)
    if (stored) {
      setSpotsLeft(parseInt(stored))
    } else {
      localStorage.setItem(SPOTS_STORAGE_KEY, TOTAL_SPOTS.toString())
    }

    const interval = setInterval(() => {
      setSpotsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 1
        }
        const next = prev - 1
        localStorage.setItem(SPOTS_STORAGE_KEY, next.toString())
        return next
      })
    }, Math.floor(Math.random() * (900000 - 480000) + 480000))

    return () => clearInterval(interval)
  }, [])

  return spotsLeft
}

function EarlyBirdButton({ fullWidth = true }: { fullWidth?: boolean }) {
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
          router.push("/pricing")
        }
      } catch {
        setLoading(false)
        router.push("/pricing")
      }
    } else {
      router.push("/sign-up?plan=earlybird")
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${fullWidth ? "w-full" : "px-10 py-5 text-xl"} bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl text-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          Preparing checkout...
        </>
      ) : (
        "Claim My $49 Early Bird Spot →"
      )}
    </button>
  )
}

const plans = [
  {
    name: "Starter",
    price: "$97",
    period: "/month",
    description: "Best for solo business owners launching their first automated webinar funnel.",
    features: ["1 webinar funnel", "AI webinar script generator", "Basic evergreen automation", "Core analytics", "Email support"],
    cta: "Start Starter Plan",
    href: "/sign-up",
    featured: false,
  },
  {
    name: "Pro",
    price: "$297",
    period: "/month",
    description: "Best for serious marketers, coaches, consultants, and agencies ready to scale.",
    features: ["Unlimited webinar funnels", "AI presenter tools", "Advanced evergreen automation", "Email + SMS follow-up", "Conversion analytics dashboard", "Affiliate tools", "Priority support"],
    cta: "Start Pro Trial",
    href: "/sign-up",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Best for teams, agencies, and white-label partners that need advanced scale.",
    features: ["White-label options", "Team access", "Advanced integrations", "Custom onboarding", "Dedicated support", "Custom workflows"],
    cta: "Contact Sales",
    href: "/contact",
    featured: false,
  },
]

const upsells = [
  {
    name: "🚀 Done-For-You Templates",
    price: "$97",
    description: "Get 10 proven webinar funnel templates built for coaches, SaaS, and real estate. Plug in your offer and launch in minutes.",
    cta: "Add Templates →",
    href: "/sign-up?upsell=templates",
  },
  {
    name: "🎯 1:1 Onboarding Call",
    price: "$197",
    description: "30-minute strategy session with our team. We'll review your funnel, optimize your offer, and get you converting faster.",
    cta: "Book My Call →",
    href: "/sign-up?upsell=onboarding",
  },
  {
    name: "⚡ Full Funnel Build",
    price: "$497",
    description: "We build your entire webinar funnel for you — script, slides, automation, and follow-up sequences. Done in 5 business days.",
    cta: "Get It Built →",
    href: "/sign-up?upsell=fullfunnel",
  },
]

export default function PricingPage() {
  const { timeLeft, expired } = useCountdown()
  const spotsLeft = useSpotCounter()
  const spotsPercent = Math.round((spotsLeft / TOTAL_SPOTS) * 100)

  return (
    <main className="min-h-screen bg-black text-white">

      {!expired && (
        <section className="py-16 px-6 text-center bg-gradient-to-b from-purple-950/40 to-black">
          <div className="max-w-3xl mx-auto">

            <span className="inline-block bg-amber-500 text-black text-sm font-bold px-4 py-1 rounded-full mb-6">
              🎉 LIMITED TIME — EARLY BIRD OFFER
            </span>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Get WebinarForge AI{" "}
              <span className="text-amber-400">for Just $49</span>
            </h1>

            <p className="text-gray-300 text-lg mb-8">
              Lock in lifetime early bird access before the price goes up.{" "}
              <strong className="text-white">
                Only {spotsLeft} of {TOTAL_SPOTS} spots remaining.
              </strong>
            </p>

            <div className="flex justify-center gap-4 mb-8">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 min-w-[70px]">
                  <div className="text-3xl font-bold text-amber-400">
                    {String(value).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="max-w-md mx-auto mb-10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-red-400 font-semibold animate-pulse">
                  🔴 {spotsLeft} spots left
                </span>
                <span className="text-gray-400">{TOTAL_SPOTS - spotsLeft} claimed</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 rounded-full transition-all duration-1000"
                  style={{
                    width: `${100 - spotsPercent}%`,
                    background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {100 - spotsPercent}% claimed — filling up fast!
              </p>
            </div>

            <div className="rounded-2xl border-2 border-amber-500 bg-white/5 p-8 max-w-md mx-auto shadow-[0_0_40px_rgba(245,158,11,0.2)]">
              <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                ⚡ EARLY BIRD — {TOTAL_SPOTS} SPOTS ONLY
              </span>

              <h2 className="text-2xl font-bold mt-4 mb-1">WebinarForge AI</h2>
              <p className="text-gray-400 text-sm mb-4">
                Full platform access. Lock in the lowest price ever.
              </p>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-gray-500 line-through text-2xl">$97/mo</span>
                <span className="text-5xl font-bold text-amber-400">$49</span>
                <span className="text-gray-400 text-sm pb-1">one-time</span>
              </div>

              <ul className="space-y-2 text-gray-300 text-sm mb-8 text-left">
                {[
                  "✅ AI Webinar Builder ($997 value)",
                  "✅ AI Avatar Presenter ($497 value)",
                  "✅ Funnel Templates ($297 value)",
                  "✅ Email + SMS Automation ($497 value)",
                  "✅ Evergreen Replay Engine ($997 value)",
                  "✅ Early Bird Lifetime Access",
                ].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              {spotsLeft <= 100 && (
                <div className="bg-red-500/20 border border-red-500 rounded-xl px-4 py-2 mb-4 text-red-400 text-sm font-semibold animate-pulse">
                  ⚠️ Only {spotsLeft} spots left! Grab yours before it's gone.
                </div>
              )}

              <EarlyBirdButton fullWidth={true} />

              <p className="text-xs text-gray-500 mt-3">
                🔒 Secure checkout. Price locks in immediately.
              </p>
            </div>

            <div className="mt-6 text-sm text-gray-400 animate-pulse">
              👥 Someone just claimed a spot — {spotsLeft} remaining
            </div>

          </div>
        </section>
      )}

      <section className="py-20 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-purple-400 mb-3 font-semibold">POWER UP YOUR RESULTS</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upgrade Your Experience</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Add these to your order and get results faster. Each upgrade is designed to help you launch, convert, and scale quicker.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {upsells.map((item) => (
              <div key={item.name} className="rounded-2xl border border-purple-500/30 bg-white/5 p-6 text-left flex flex-col">
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-1">{item.description}</p>
                <div className="text-3xl font-bold text-purple-400 mb-4">{item.price}</div>
                <Link href={item.href}>
                  <button className="w-full border border-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition">
                    {item.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center max-w-6xl mx-auto">
        <p className="text-purple-400 mb-4">Simple Pricing. Powerful Growth.</p>
        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Or Choose A Monthly Plan
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-10">
          Whether you're launching your first webinar or scaling multiple evergreen funnels,
          WebinarForge AI gives you the tools to automate presentations, follow-up, and conversions.
        </p>
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 text-left flex flex-col ${
                plan.featured
                  ? "border-purple-500 bg-white/10 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {plan.featured && (
                <div className="mb-4">
                  <span className="inline-block rounded-full bg-purple-600 px-3 py-1 text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <p className="text-gray-400 mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <ul className="space-y-3 text-gray-300 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature}>✅ {feature}</li>
                ))}
              </ul>
              <Link href={plan.href}>
                <button
                  className={`w-full rounded-xl px-6 py-4 font-semibold text-lg transition ${
                    plan.featured
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border border-white/20 hover:border-white/50"
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Compare What You Get
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="w-full text-left">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="p-6">Features</th>
                  <th className="p-6">Starter</th>
                  <th className="p-6">Pro</th>
                  <th className="p-6">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  ["Webinar Funnels", "1", "Unlimited", "Unlimited"],
                  ["AI Script Builder", "Yes", "Yes", "Yes"],
                  ["AI Presenter Tools", "No", "Yes", "Yes"],
                  ["Evergreen Automation", "Basic", "Advanced", "Advanced"],
                  ["Analytics", "Core", "Advanced", "Custom"],
                  ["Support", "Email", "Priority", "Dedicated"],
                ].map(([feature, ...cols]) => (
                  <tr key={feature} className="border-b border-white/10 last:border-0">
                    <td className="p-6">{feature}</td>
                    {cols.map((col, i) => (
                      <td key={i} className="p-6">{col}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6 text-left">
          {[
            { q: "Do I need to go live?", a: "No. WebinarForge AI is designed to help you create automated evergreen webinars that run without you going live every time." },
            { q: "Can I use my own offer and niche?", a: "Yes. You can build webinar funnels for your own niche, audience, and offer." },
            { q: "Do you support AI presenters?", a: "Yes. Pro and Enterprise plans are built for AI presenter workflows and advanced automation." },
            { q: "Can agencies use this for clients?", a: "Absolutely. Pro works well for many agencies, and Enterprise is ideal for teams, client management, and white-label use cases." },
            { q: "What happens after the early bird ends?", a: "The $49 price goes away permanently. Early bird members lock in their rate and keep access at that price." },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-2">{q}</h3>
              <p className="text-gray-400">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Start Building Your AI Webinar Funnel Today
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Choose your plan, launch faster, and turn your webinar into an always-on sales machine.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <EarlyBirdButton fullWidth={false} />
          <Link href="/contact">
            <button className="border border-white/20 hover:border-white/50 px-10 py-5 rounded-xl font-semibold text-xl transition">
              Contact Sales
            </button>
          </Link>
        </div>
      </section>

    </main>
  )
}
