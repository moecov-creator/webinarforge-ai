"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

// ─── CONFIGURATION — update these URLs ───────────────────────────────────────
const COMMUNITY_URL = "https://community.webinarforge.ai"   // ← your community link
const CALENDAR_URL  = "https://calendly.com/webinarforgeai" // ← your booking link

// ─── Vimeo Video ──────────────────────────────────────────────────────────────
function VideoPlayer() {
  return (
    <div className="rounded-2xl overflow-hidden bg-black border border-gray-200 shadow-xl mb-8">
      <iframe
        src="https://player.vimeo.com/video/1187523719?h=02e9c470ea&badge=0&autopause=0&player_id=0&app_id=58479"
        className="w-full aspect-video border-none block"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        loading="lazy"
        title="Welcome to WebinarForge AI — Next Steps"
      />
    </div>
  )
}

// ─── Upgrade button (for users who haven't purchased yet) ────────────────────
function UpgradeButton() {
  const { isSignedIn, isLoaded } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
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
        if (data.url) { window.location.href = data.url } else { setLoading(false) }
      } catch { setLoading(false) }
    } else {
      sessionStorage.setItem("checkout_intent", "EARLY_BIRD")
      window.location.href = "/sign-up"
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-5 rounded-xl text-xl transition disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(250,204,21,0.3)]"
    >
      {loading ? (
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      ) : (
        "YES! ADD THIS TO MY ORDER FOR $49 →"
      )}
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ThankYouPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">🎉</div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase text-gray-900">
            You Are In!
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Check your email for access details. Watch the video below for your next steps.
          </p>
        </div>

        {/* Video — above the offer */}
        <VideoPlayer />

        {/* Next Steps — community + calendar */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">

          {/* Join Community */}
          <a href={COMMUNITY_URL} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-2xl p-6 text-center transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center text-3xl transition-colors">
              👥
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg">Join the Community</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Connect with other WebinarForge members, get support, and share wins.
              </p>
            </div>
            <span className="text-sm font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
              Join Now →
            </span>
          </a>

          {/* Book Onboarding Call */}
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 bg-green-50 border-2 border-green-200 hover:border-green-400 rounded-2xl p-6 text-center transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center text-3xl transition-colors">
              📅
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg">Book Onboarding Call</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Schedule your free 1-on-1 onboarding call and get set up fast.
              </p>
            </div>
            <span className="text-sm font-bold text-green-600 group-hover:text-green-700 transition-colors">
              Book Now →
            </span>
          </a>

        </div>

        {/* ONE TIME OFFER */}
        <div className="bg-yellow-50 border-4 border-yellow-400 rounded-2xl p-8 mb-8">
          <div className="text-center mb-6">
            <div className="inline-block bg-red-600 text-white font-black px-4 py-1 rounded-full text-sm mb-4 uppercase animate-pulse">
              Special One-Time Offer — This Page Only
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase text-gray-900">
              Wait — Get Full Access To
              <span className="text-yellow-500"> WebinarForge AI</span>
              <br />For Just $49 Right Now
            </h2>
            <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
              Since you just registered for our free training you qualify for our
              exclusive early bird offer. Get the full platform — AI builder, avatar presenter,
              funnel templates, email automation and more — for a one-time payment of just $49.
              This offer will NOT be available after you leave this page.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6 border border-yellow-200">
            <div className="space-y-3 text-left mb-6">
              {[
                "AI Webinar Builder ($997 value)",
                "AI Avatar Presenter ($497 value)",
                "Funnel Templates ($297 value)",
                "Email + SMS Automation ($497 value)",
                "Evergreen Replay Engine ($997 value)",
                "Lifetime Early Bird Access (PRICELESS)",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-yellow-500">✅</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-400 line-through text-xl">Total Value: $3,285+</p>
              <p className="text-gray-400 line-through text-xl">Regular Price: $97/month</p>
              <p className="text-5xl font-black text-yellow-500 mt-2">$49 ONE-TIME</p>
              <p className="text-gray-400 text-sm">No monthly fees. Ever.</p>
            </div>

            <UpgradeButton />

            <p className="text-gray-400 text-xs text-center mt-3">
              🔒 Secure checkout · 30-day money back guarantee
            </p>
          </div>
        </div>

        {/* Go to dashboard */}
        <div className="text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 text-sm underline hover:text-gray-600 transition"
          >
            No thanks — take me to the dashboard
          </button>
        </div>

      </div>
    </main>
  )
}
