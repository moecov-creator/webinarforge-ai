"use client"

import type { AnalyticsInsight, InsightSeverity } from "@/lib/orchestrator/types"

const SEVERITY_STYLES: Record<InsightSeverity, {
  bg: string; border: string; icon: string; label: string; titleColor: string;
}> = {
  positive: {
    bg: "bg-green-500/8",
    border: "border-green-500/25",
    icon: "✅",
    label: "Performing well",
    titleColor: "text-green-400",
  },
  warning: {
    bg: "bg-amber-500/8",
    border: "border-amber-500/25",
    icon: "⚠️",
    label: "Needs attention",
    titleColor: "text-amber-400",
  },
  critical: {
    bg: "bg-red-500/8",
    border: "border-red-500/25",
    icon: "🔴",
    label: "Action required",
    titleColor: "text-red-400",
  },
  info: {
    bg: "bg-blue-500/8",
    border: "border-blue-500/25",
    icon: "💡",
    label: "Insight",
    titleColor: "text-blue-400",
  },
}

// ─── Single insight card ──────────────────────────────────────────────────────
export function InsightCard({ insight }: { insight: AnalyticsInsight }) {
  const s = SEVERITY_STYLES[insight.severity]
  return (
    <div className={`${s.bg} border ${s.border} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wider ${s.titleColor}`}>
              {s.label}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white mb-1 leading-tight">{insight.title}</h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-2">{insight.description}</p>
          <p className="text-xs text-gray-300 leading-relaxed">
            <strong className="text-white">Recommendation:</strong> {insight.recommendation}
          </p>
          {insight.actionLabel && insight.actionHref && (
            <a href={insight.actionHref}>
              <button className={`mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                insight.severity === "critical"
                  ? "border-red-500/40 text-red-400 hover:bg-red-500/15"
                  : insight.severity === "warning"
                  ? "border-amber-500/40 text-amber-400 hover:bg-amber-500/15"
                  : "border-purple-500/40 text-purple-400 hover:bg-purple-500/15"
              }`}>
                {insight.actionLabel} →
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Insight panel — full list ────────────────────────────────────────────────
export function InsightPanel({ insights, loading = false }: { insights: AnalyticsInsight[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-4 animate-pulse">
            <div className="h-3 bg-white/10 rounded w-1/3 mb-2" />
            <div className="h-2 bg-white/6 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="bg-white/4 border border-white/8 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">📊</div>
        <p className="text-sm text-gray-400">No insights yet. Run your webinar to start seeing performance data.</p>
      </div>
    )
  }

  const criticals = insights.filter(i => i.severity === "critical")
  const warnings = insights.filter(i => i.severity === "warning")
  const positives = insights.filter(i => i.severity === "positive")
  const infos = insights.filter(i => i.severity === "info")

  return (
    <div className="space-y-3">
      {criticals.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
            🔴 {criticals.length} critical issue{criticals.length > 1 ? "s" : ""} need your attention
          </span>
        </div>
      )}
      {[...criticals, ...warnings, ...positives, ...infos].map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  )
}

// ─── Health badge ─────────────────────────────────────────────────────────────
export function HealthBadge({ health }: { health: "excellent" | "good" | "needs_work" | "critical" }) {
  const config = {
    excellent: { label: "Excellent performance", color: "bg-green-500/15 text-green-400 border-green-500/30" },
    good: { label: "Healthy performance", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    needs_work: { label: "Needs optimization", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    critical: { label: "Action required", color: "bg-red-500/15 text-red-400 border-red-500/30" },
  }[health]

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${config.color}`}>
      {config.label}
    </span>
  )
}
