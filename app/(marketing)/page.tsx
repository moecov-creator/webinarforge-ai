"use client"

import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useState } from "react"
import { useRouter } from "next/navigation"

function EarlyBirdButton({ fullWidth = false }: { fullWidth?: boolean }) {
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
      router.push("/sign-up")
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${
        fullWidth ? "w-full" : "px-10 py-5 text-xl"
      } bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl text-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
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

export default function MarketingPage() {
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
          <EarlyBirdButton />
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
          <EarlyBirdButton />
          <Link href="/pricing">
            <button className="border border-white/20 hover:border-white/50 px-10 py-5 rounded-xl font-semibold text-xl transition">
              See All Plans
            </button>
          </Link>
        </div>
      </section>

    </main>
  )
}
