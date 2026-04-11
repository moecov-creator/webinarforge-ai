"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name || !email) return
    setLoading(true)

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: "Webinar Registration",
          message: "Registered for webinar funnel",
        }),
      })
    } catch (err) {
      console.error(err)
    }

    router.push("/funnel/thankyou")
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full text-center">

        <div className="inline-block bg-red-600 text-white font-black px-4 py-1 rounded-full text-sm mb-6 uppercase animate-pulse">
          FREE TRAINING — Limited Spots
        </div>

        <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase leading-tight">
          How To Get Your First
          <span className="text-yellow-400"> 100 Leads</span>
          <br />From An AI Webinar In 7 Days
        </h1>

        <p className="text-gray-400 mb-8">
          Register below for instant access to this free training.
          Discover the exact system top coaches use to sell on autopilot.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left">
          <h3 className="font-black text-xl mb-6 text-center">
            Yes! Reserve My Free Spot Now
          </h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Your First Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Your Best Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !name || !email}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-xl text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "RESERVE MY FREE SPOT NOW →"
            )}
          </button>

          <p className="text-xs text-gray-600 text-center mt-3">
            We respect your privacy. No spam, ever. Unsubscribe anytime.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "🎯", label: "100% Free" },
            { icon: "⚡", label: "Instant Access" },
            { icon: "🔒", label: "No Spam" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 rounded-xl p-3">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs text-gray-400">{label}</div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
