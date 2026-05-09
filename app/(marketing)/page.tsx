"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

function EarlyBirdButton({ fullWidth = false, onClick }: { fullWidth?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${
        fullWidth ? "w-full" : "px-10 py-5 text-xl"
      } bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl text-lg transition flex items-center justify-center gap-2`}
    >
      Claim My $49 Early Bird Spot →
    </button>
  )
}

export default function MarketingPage() {
  const [showPopup, setShowPopup] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone) {
      setError("Please fill in all fields.")
      return
    }
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/hl/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = "/early-bird"
        }, 1500)
      } else {
        setError(data.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="py-24 px-6 text-center max-w-6xl mx-auto">
        <div className="inline-block bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-full mb-6">
          🎉 EARLY BIRD — Only $49 Limited Time
        </div>

        <p className="text-purple-400 mb-4">
          The AI Operating System for Evergreen Webinars
        </p>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Turn Cold Traffic Into High-Ticket Clients…
          <span className="text-purple-400"> Automatically With AI Webinars</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          No more Zoom calls. No more chasing leads. WebinarForge AI builds,
          presents, and helps convert your webinars 24/7.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <EarlyBirdButton onClick={() => setShowPopup(true)} />
          <Link href="/demo">
            <button className="border border-gray-500 hover:border-white px-8 py-4 rounded-xl font-semibold text-lg transition">
              Watch Demo
            </button>
          </Link>
        </div>

        <p className="text-sm text-gray-400">
          🔒 Secure checkout • Price locks in immediately
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-gray-400">
          <span>Real Estate</span>
          <span>Coaches</span>
          <span>SaaS</span>
          <span>Consultants</span>
          <span>Local Businesses</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-[#0a0a0a] text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-xl font-semibold mb-2">1. Pick Your Offer</h3>
            <p className="text-gray-400">
              Tell the AI what you're selling and who your audience is.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-xl font-semibold mb-2">2. AI Builds Webinar</h3>
            <p className="text-gray-400">
              Slides, script, funnel, and CTAs are generated in minutes.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-xl font-semibold mb-2">3. It Converts 24/7</h3>
            <p className="text-gray-400">
              Your webinar runs automatically and helps turn leads into clients.
            </p>
          </div>
        </div>
      </section>

      {/* VALUE STACK */}
      <section className="py-20 px-6 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          Everything You Need To Scale
        </h2>
        <div className="max-w-3xl mx-auto text-left space-y-4 text-lg bg-white/5 border border-white/10 rounded-2xl p-8">
          <p>✅ AI Webinar Builder ($997 value)</p>
          <p>✅ AI Avatar Presenter ($497 value)</p>
          <p>✅ Funnel Templates ($297 value)</p>
          <p>✅ Email + SMS Automation ($497 value)</p>
          <p>✅ Evergreen Replay Engine ($997 value)</p>
        </div>
        <p className="mt-8 text-xl font-semibold text-purple-400">
          Total Value: $3,285+
        </p>
        <div className="mt-6">
          <p className="text-gray-500 line-through text-xl">$97/month</p>
          <p className="text-4xl font-bold text-amber-400">$49 one-time</p>
          <p className="text-gray-400 text-sm mt-1">Early bird price — limited spots</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Your Webinar Funnel Should Be Closing Deals…
          <span className="text-purple-400"> Even When You Sleep</span>
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Start building your automated webinar system today.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <EarlyBirdButton onClick={() => setShowPopup(true)} />
          <Link href="/pricing">
            <button className="border border-white/20 hover:border-white/50 px-10 py-5 rounded-xl font-semibold text-xl transition">
              See All Plans
            </button>
          </Link>
        </div>
      </section>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !success && setShowPopup(false)}
          />

          {/* Modal */}
          <div className="relative bg-[#0f0f1a] border border-purple-500/30 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-purple-500/20">

            {/* Close */}
            {!success && (
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            )}

            {success ? (
              <div className="text-center py-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-black mb-2 text-green-400">You're In!</h3>
                <p className="text-gray-400">Redirecting you to the early bird page...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                    ⚡ Limited — Only 113 Spots Remaining
                  </div>
                </div>

                <h2 className="text-2xl font-black text-center mb-2 leading-tight">
                  Get The Early Bird Access To<br />
                  <span className="text-purple-400">WebinarForge AI</span>
                </h2>
                <p className="text-gray-400 text-sm text-center mb-6">
                  Join 387+ coaches getting lifetime access for just $49 — no monthly fees ever.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors text-sm"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors text-sm"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors text-sm"
                    required
                  />

                  {error && (
                    <p className="text-red-400 text-xs text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black py-4 rounded-xl transition-all text-base mt-2"
                  >
                    {loading ? "Submitting..." : "🚀 Claim My Early Bird Access →"}
                  </button>
                </form>

                <p className="text-gray-600 text-xs text-center mt-4">
                  🔒 No spam ever · Unsubscribe anytime
                </p>
              </>
            )}
          </div>
        </div>
      )}

    </main>
  )
}
