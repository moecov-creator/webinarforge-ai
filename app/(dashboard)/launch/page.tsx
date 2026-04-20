"use client"

import LaunchWizard from "@/components/LaunchWizard"
import type { LaunchSummary } from "@/lib/orchestrator/types"
import { useRouter } from "next/navigation"

export default function LaunchPage() {
  const router = useRouter()

  const handleComplete = (summary: LaunchSummary) => {
    router.push(`/dashboard/launch/${summary.id}`)
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white">
      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            🚀 Launch My Webinar Funnel
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Get Your First Sale in
            <span className="text-purple-400"> 10 Minutes</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Answer 5 quick questions and our AI will build your complete webinar funnel —
            script, slides, registration page, and follow-up sequence — ready to launch.
          </p>
        </div>

        {/* What you'll get */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { icon: "📝", label: "Full webinar script" },
            { icon: "🖥️", label: "Landing page copy" },
            { icon: "📧", label: "Email follow-up" },
            { icon: "📊", label: "Conversion strategy" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-xs text-gray-400 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Wizard */}
        <LaunchWizard onComplete={handleComplete} />

      </div>
    </main>
  )
}
