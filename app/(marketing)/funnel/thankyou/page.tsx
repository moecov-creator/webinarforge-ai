"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function ThankYouPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
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
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">

        <div className="text-7xl mb-6">🎉</div>

        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase">
          You Are In!
        </h1>

        <p className="text-xl text-gray-300 mb-12">
          Check your email for access details. While you wait —
          do not miss this ONE-TIME offer below.
        </p>

        {/* ONE TIME OFFER */}
        <div className="bg-yellow-400/10 border-4 border-yellow-400 rounded-2xl p-8 mb-10">
          <div className="inline-block bg-red-600 text-white font-black px-4 py-1 rounded-full text-sm mb-4 uppercase animate-pulse">
            Special One-Time Offer — This Page Only
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase">
            Wait — Get Full Access To
            <span className="text-yellow-400"> WebinarForge AI</span>
            <br />For Just $49 Right Now
          </h2>

          <p className="text-gray-300 text-lg mb-8">
            Since you just registered for our free training you qualify for our
            exclusive early bird offer. Get the full platform — AI builder, avatar presenter,
            funnel templates, email automation and more — for a one-time payment of just $49.
            This offer will NOT be available after you leave this page.
          </p>

          <div className="bg-black/40 rounded-xl p-6 mb-8">
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
                  <span className="text-yellow-400">✅</span>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-500 line-through text-xl">Total Value: $3,285+</p>
              <p className="text-gray-500 line-through text-xl">Regular Price: $97/month</p>
              <p className="text-5xl font-black text-yellow-400 mt-2">$49 ONE-TIME</p>
              <p className="text-gray-500 text-sm">No monthly fees. Ever.</p>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-5 rounded-xl text-xl transition disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(250,204,21,0.4)]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "YES! ADD THIS TO MY ORDER FOR $49 →"
              )}
            </button>

            <p className="text-gray-600 text-xs text-center mt-3">
              🔒 Secure checkout · 30-day money back guarantee
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-600 text-sm underline hover:text-gray-400 transition"
        >
          No thanks, I do not want full access at this price. Take me to the free training.
        </button>

      </div>
    </main>
  )
}
