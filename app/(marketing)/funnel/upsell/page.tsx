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
          src="https://player.vimeo.com/video/1187522878?h=4438b2dcee&badge=0&autopause=0&player_id=0&app_id=58479"
          className="w-full aspect-video border-none block"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          loading="lazy"
          title="WebinarForge AI — Full System Upgrade"
        />
      </div>
    </div>
  )
}

// ─── OTO1 Buy Button ──────────────────────────────────────────────────────────
function OTO1Button() {
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
          body: JSON.stringify({ planKey: "OTO1_997" }),
        })
        const data = await res.json()
        if (data.url) { window.location.href = data.url } else { setLoading(false) }
      } catch { setLoading(false) }
    } else {
      sessionStorage.setItem("checkout_intent", "OTO1_997")
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
        "YES — Build My Entire Funnel For Me ($997) →"
      )}
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UpsellPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300 uppercase tracking-wide">
            ⚡ One-time offer — this page disappears when you leave
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-black text-center leading-tight mb-3 text-gray-900">
          Wait — Don't Try To{" "}
          <span className="text-purple-600">Build This Alone</span>
        </h1>
        <p className="text-center text-gray-500 text-base leading-relaxed mb-2 max-w-lg mx-auto">
          Most people get access to powerful tools and never launch. The difference
          between success and failure isn't the tool — it's implementation.
        </p>

        {/* Video */}
        <VideoPlayer label="Watch this before you decide" />

        {/* Offer box */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <p className="text-sm text-gray-500 font-semibold mb-4">Everything we build for you:</p>
          <ul className="space-y-3 mb-6">
            {[
              "Full conversion-optimized webinar script",
              "Slide deck designed and ready to present",
              "AI avatar configured and live",
              "All funnel pages connected and tested",
              "Lead capture + email sequences built",
              "Appointment booking calendar integrated",
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
            <span className="text-gray-400 line-through text-base">$2,000–$5,000</span>
            <span className="text-4xl font-black text-gray-900">$997</span>
            <span className="text-gray-400 text-sm">one-time</span>
          </div>
        </div>

        {/* CTA */}
        <OTO1Button />

        {/* Guarantee */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 my-5">
          <span className="text-2xl flex-shrink-0">🛡</span>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-green-600">30-day money-back guarantee.</strong>{" "}
            If we don't deliver, email us within 30 days for a full refund.
          </p>
        </div>

        {/* No link */}
        <div className="text-center">
          <a href="/funnel/downsell" className="text-sm text-gray-400 hover:text-gray-600 transition underline underline-offset-2">
            No. I'd rather handle the setup myself.
          </a>
        </div>

      </div>
    </main>
  )
}
