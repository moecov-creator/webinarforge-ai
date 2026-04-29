"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"

// ─── Vimeo Video ──────────────────────────────────────────────────────────────
function VideoPlayer({ label }: { label: string }) {
  return (
    <div className="my-6">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">{label}</p>
      <div className="rounded-2xl overflow-hidden bg-black border border-gray-200 shadow-lg">
        <iframe
          src="https://player.vimeo.com/video/1187523420?h=79b67427cc&badge=0&autopause=0&player_id=0&app_id=58479"
          className="w-full aspect-video border-none block"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          loading="lazy"
          title="WebinarForge AI — Special Offer"
        />
      </div>
    </div>
  )
}

// ─── OTO2 Buy Button ──────────────────────────────────────────────────────────
function OTO2Button() {
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
          body: JSON.stringify({ planKey: "OTO2_497" }),
        })
        const data = await res.json()
        if (data.url) { window.location.href = data.url } else { setLoading(false) }
      } catch { setLoading(false) }
    } else {
      sessionStorage.setItem("checkout_intent", "OTO2_497")
      window.location.href = "/sign-up"
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-5 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-black text-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
    >
      {loading ? (
        <>
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </>
      ) : (
        "YES — Show Me How To Build It ($497) →"
      )}
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DownsellPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 border border-purple-300 uppercase tracking-wide">
            Special offer — available this session only
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-black text-center leading-tight mb-3 text-gray-900">
          Not Ready For Full Setup?<br />
          <span className="text-purple-600">Let's Do It Together</span>
        </h1>
        <p className="text-center text-gray-500 text-base leading-relaxed mb-2 max-w-lg mx-auto">
          You don't need us to do everything — but you shouldn't figure it out
          completely alone. This is the fastest path to launch without handing us the wheel.
        </p>

        {/* Video */}
        <VideoPlayer label="A personal message about this offer" />

        {/* Price comparison */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-400 font-semibold mb-1">What you passed on</div>
            <div className="text-2xl font-black text-gray-400">$997</div>
            <div className="text-xs text-gray-400 mt-1 leading-relaxed">
              Done-for-you — we build everything hands off.
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="text-xs text-purple-600 font-semibold mb-1">Today's offer</div>
            <div className="text-2xl font-black text-purple-600">$497</div>
            <div className="text-xs text-purple-500 mt-1 leading-relaxed">
              Guided setup — you build it, we show you how.
            </div>
          </div>
        </div>

        {/* Offer box */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <p className="text-sm text-gray-500 font-semibold mb-4">What's included in Guided Setup:</p>
          <ul className="space-y-3 mb-6">
            {[
              "Step-by-step setup training — follow along and build as you watch",
              "10+ proven webinar script templates — plug your niche in and go",
              "Funnel blueprint — the exact page structure that converts",
              "Script frameworks — hooks, stories, offers, CTAs all mapped out",
              "Private community access — get unstuck fast with real support",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 stroke-green-600 fill-none" strokeWidth="2.5">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-baseline gap-3 pt-4 border-t border-gray-200">
            <span className="text-gray-400 line-through text-base">$997</span>
            <span className="text-4xl font-black text-gray-900">$497</span>
            <span className="text-gray-400 text-sm">one-time</span>
          </div>
        </div>

        {/* CTA */}
        <OTO2Button />

        {/* Guarantee */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 my-5">
          <span className="text-2xl flex-shrink-0">🛡</span>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-green-600">30-day money-back guarantee.</strong>{" "}
            If this doesn't help you launch, email us within 30 days for a full refund.
          </p>
        </div>

        {/* No link */}
        <div className="text-center">
          <a href="/funnel/thankyou" className="text-sm text-gray-400 hover:text-gray-600 transition underline underline-offset-2">
            No. I can build my webinar by myself!
          </a>
        </div>

      </div>
    </main>
  )
}
