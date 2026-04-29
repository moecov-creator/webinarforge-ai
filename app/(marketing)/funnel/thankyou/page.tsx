"use client"

import { useState } from "react"
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
            Check your email for access details. Watch the video below and take your next steps.
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

        {/* Go to dashboard */}
        <div className="text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 text-sm underline hover:text-gray-600 transition"
          >
            No thanks — take me to the dashboard
          </button>
        </div>

        {/* Dashboard CTA */}
        <div className="text-center mt-4 pb-8">
          <a href="/dashboard"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg">
            🚀 Go to My Dashboard →
          </a>
        </div>

      </div>
    </main>
  )
}
