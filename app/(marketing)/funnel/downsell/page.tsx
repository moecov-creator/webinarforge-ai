"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer({ label }: { label: string }) {
  const [url, setUrl] = useState("")
  const [embedSrc, setEmbedSrc] = useState("")

  const handleUrl = (val: string) => {
    setUrl(val)
    const yt = val.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    const vm = val.match(/vimeo\.com\/(\d+)/)
    const lm = val.match(/loom\.com\/share\/([a-z0-9]+)/i)
    if (yt) setEmbedSrc(`https://www.youtube.com/embed/${yt[1]}?rel=0`)
    else if (vm) setEmbedSrc(`https://player.vimeo.com/video/${vm[1]}`)
    else if (lm) setEmbedSrc(`https://www.loom.com/embed/${lm[1]}`)
    else if (val.startsWith("http")) setEmbedSrc(val)
  }

  return (
    <div className="my-6">
      <p className="text-xs text-purple-500 font-semibold uppercase tracking-widest mb-2">{label}</p>
      <div className="rounded-2xl overflow-hidden bg-[#08081a] border border-white/10">
        {embedSrc ? (
          <iframe
            src={embedSrc}
            className="w-full aspect-video border-none block"
            allowFullScreen
            allow="autoplay"
          />
        ) : (
          <div className="w-full aspect-video flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-purple-600/60 flex items-center justify-center bg-purple-900/20">
              <div className="w-14 h-14 rounded-full bg-purple-700 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white ml-1">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-purple-800">Your AI Twin video goes here</p>
          </div>
        )}
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-white/5 bg-purple-950/30">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-700" />
          <span className="text-xs text-purple-900">AI Twin video — paste your URL below to activate</span>
        </div>
      </div>
      <input
        value={url}
        onChange={(e) => handleUrl(e.target.value)}
        placeholder="Paste your AI Twin video URL (YouTube, Vimeo, Loom, HeyGen...)"
        className="w-full mt-2 bg-[#12122a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-purple-300 placeholder:text-purple-900 focus:outline-none focus:border-purple-600 transition"
      />
    </div>
  )
}

// ─── OTO2 Buy Button — wired to Stripe ───────────────────────────────────────
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
        if (data.url) {
          window.location.href = data.url
        } else {
          setLoading(false)
        }
      } catch {
        setLoading(false)
      }
    } else {
      sessionStorage.setItem("checkout_intent", "OTO2_497")
      window.location.href = "/sign-up"
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      style={{ boxShadow: "0 0 30px rgba(124,58,237,0.35)" }}
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
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/35">
            Special offer — available this session only
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-medium text-center leading-tight mb-3">
          Not Ready For Full Setup?<br />
          <span className="text-purple-400">Let's Do It Together</span>
        </h1>
        <p className="text-center text-gray-500 text-base leading-relaxed mb-2 max-w-lg mx-auto">
          You don't need us to do everything — but you shouldn't figure it out
          completely alone. This is the fastest path to launch without handing us
          the wheel.
        </p>

        {/* AI Twin Video */}
        <VideoPlayer label="A personal message about this offer" />

        {/* Price comparison */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/4 border border-white/8 rounded-xl p-4">
            <div className="text-xs text-gray-600 font-medium mb-1">What you passed on</div>
            <div className="text-2xl font-medium text-gray-600">$997</div>
            <div className="text-xs text-gray-700 mt-1 leading-relaxed">
              Done-for-you — we build everything hands off.
            </div>
          </div>
          <div className="bg-purple-500/8 border border-purple-500/35 rounded-xl p-4">
            <div className="text-xs text-purple-400 font-medium mb-1">Today's offer</div>
            <div className="text-2xl font-medium text-purple-400">$497</div>
            <div className="text-xs text-purple-700 mt-1 leading-relaxed">
              Guided setup — you build it, we show you how.
            </div>
          </div>
        </div>

        {/* Offer box */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-500 font-medium mb-4">
            What's included in Guided Setup:
          </p>
          <ul className="space-y-3 mb-5">
            {[
              "Step-by-step setup training — follow along and build as you watch",
              "10+ proven webinar script templates — plug your niche in and go",
              "Funnel blueprint — the exact page structure that converts",
              "Script frameworks — hooks, stories, offers, CTAs all mapped out",
              "Private community access — get unstuck fast with real support",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 stroke-emerald-400 fill-none" strokeWidth="2.5">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-baseline gap-3 pt-4 border-t border-white/10">
            <span className="text-gray-600 line-through text-base">$997</span>
            <span className="text-4xl font-medium text-white">$497</span>
            <span className="text-gray-600 text-sm">one-time</span>
          </div>
        </div>

        {/* YES CTA — Stripe wired */}
        <OTO2Button />

        {/* Guarantee */}
        <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 my-5">
          <span className="text-2xl flex-shrink-0">🛡</span>
          <p className="text-sm text-emerald-800 leading-relaxed">
            <strong className="text-emerald-500">30-day money-back guarantee.</strong>{" "}
            If this doesn't help you launch, email us within 30 days for a full refund.
          </p>
        </div>

        {/* NO — goes to thank you anyway */}
        <div className="text-center">
          <a
            href="/funnel/thankyou"
            className="text-sm text-gray-700 hover:text-gray-500 transition underline underline-offset-2 decoration-gray-800"
          >
            No. I can build my webinar by myself!
          </a>
        </div>

      </div>
    </main>
  )
}
