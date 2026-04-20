"use client"

import { useState } from "react"
import type {
  AnalyticsInsight,
  InsightSeverity,
  OptimizationResult,
  OptimizationActionType,
  FunnelOptimizationReport,
  MetricEvaluation,
} from "@/lib/orchestrator/types"
import { OPTIMIZATION_ACTIONS } from "@/lib/orchestrator/optimizationEngine"

// ─── Severity styles ──────────────────────────────────────────────────────────
const SEVERITY_STYLES: Record<InsightSeverity, {
  bg: string; border: string; icon: string; label: string; titleColor: string;
  btnBorder: string; btnText: string; btnHover: string;
}> = {
  positive: { bg: "bg-green-500/8", border: "border-green-500/25", icon: "✅", label: "Performing well", titleColor: "text-green-400", btnBorder: "border-green-500/40", btnText: "text-green-400", btnHover: "hover:bg-green-500/15" },
  warning:  { bg: "bg-amber-500/8", border: "border-amber-500/25", icon: "⚠️", label: "Needs attention", titleColor: "text-amber-400", btnBorder: "border-amber-500/40", btnText: "text-amber-400", btnHover: "hover:bg-amber-500/15" },
  critical: { bg: "bg-red-500/8",   border: "border-red-500/25",   icon: "🔴", label: "Action required", titleColor: "text-red-400",   btnBorder: "border-red-500/40",   btnText: "text-red-400",   btnHover: "hover:bg-red-500/15"   },
  info:     { bg: "bg-blue-500/8",  border: "border-blue-500/25",  icon: "💡", label: "Insight",         titleColor: "text-blue-400",  btnBorder: "border-blue-500/40",  btnText: "text-blue-400",  btnHover: "hover:bg-blue-500/15"  },
}

// ─── Upgrade modal ────────────────────────────────────────────────────────────
function UpgradePrompt({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d0d1a] border border-purple-500/40 rounded-2xl p-6 max-w-sm w-full">
        <div className="text-3xl mb-3 text-center">🔒</div>
        <h3 className="text-lg font-black text-white text-center mb-2">Pro Feature</h3>
        <p className="text-gray-400 text-sm text-center leading-relaxed mb-5">{message}</p>
        <div className="space-y-2">
          <a href="/dashboard/billing">
            <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-sm transition">
              Upgrade to Pro — $297/mo →
            </button>
          </a>
          <button onClick={onClose} className="w-full border border-white/15 text-gray-400 hover:text-white py-3 rounded-xl text-sm transition">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Optimization result panel ────────────────────────────────────────────────
function OptimizationResultPanel({ result, onClose }: { result: OptimizationResult; onClose: () => void }) {
  return (
    <div className="mt-3 bg-black/40 border border-green-500/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-green-400 uppercase tracking-wider">✅ Applied</span>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-xs transition">dismiss</button>
      </div>
      <p className="text-xs text-gray-300 leading-relaxed mb-3">{result.summary}</p>
      {Object.keys(result.after).length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">What changed:</p>
          {Object.entries(result.after).slice(0, 4).map(([key, value]) => (
            <div key={key} className="bg-white/4 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-500 mb-0.5 capitalize">{key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}</p>
              <p className="text-xs text-white leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
      )}
      {result.revertableUntil && (
        <p className="text-[10px] text-gray-600 mt-3">
          Revertable until {new Date(result.revertableUntil).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}

// ─── Metric evaluation bar ────────────────────────────────────────────────────
export function MetricEvaluationBar({ evaluation }: { evaluation: MetricEvaluation }) {
  const { metric, value, status, threshold } = evaluation
  const label = metric.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const pct = Math.min(100, Math.round((value / threshold.healthy) * 100))
  const barColor = status === "healthy" ? "bg-green-500" : status === "warning" ? "bg-amber-500" : "bg-red-500"
  const textColor = status === "healthy" ? "text-green-400" : status === "warning" ? "text-amber-400" : "text-red-400"

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold ${textColor}`}>{value}%</span>
          <span className="text-[10px] text-gray-600">/ {threshold.healthy}%</span>
        </div>
      </div>
      <div className="w-full bg-white/8 rounded-full h-1.5 overflow-hidden">
        <div className={`h-1.5 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─── Single insight card ──────────────────────────────────────────────────────
export function InsightCard({
  insight,
  userPlan = "starter",
  funnelId = "demo-funnel",
}: {
  insight: AnalyticsInsight
  userPlan?: "starter" | "pro" | "enterprise"
  funnelId?: string
}) {
  const s = SEVERITY_STYLES[insight.severity]
  const [fixing, setFixing] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [upgradeMessage, setUpgradeMessage] = useState("")
  const [error, setError] = useState("")

  const fixAction = insight.fixAction
  const actionDef = fixAction ? OPTIMIZATION_ACTIONS[fixAction] : null
  const isProOnly = actionDef?.proOnly ?? false
  const isAllowed = !isProOnly || userPlan === "pro" || userPlan === "enterprise"

  const handleFix = async () => {
    if (!fixAction) return
    if (!isAllowed) {
      setUpgradeMessage(
        `${actionDef?.label ?? "This fix"} requires a Pro plan. Upgrade to apply optimizations automatically.`
      )
      return
    }
    setFixing(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType: fixAction, funnelId }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === "upgrade_required") { setUpgradeMessage(data.message); return }
        setError(data.error || "Something went wrong")
        return
      }
      setResult(data)
    } catch {
      setError("Request failed. Please try again.")
    } finally {
      setFixing(false)
    }
  }

  return (
    <>
      {upgradeMessage && <UpgradePrompt message={upgradeMessage} onClose={() => setUpgradeMessage("")} />}
      <div className={`${s.bg} border ${s.border} rounded-xl p-4 transition-all`}>
        <div className="flex items-start gap-3">
          <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-semibold uppercase tracking-wider ${s.titleColor}`}>{s.label}</span>
              {isProOnly && userPlan === "starter" && (
                <span className="text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded-full uppercase">Pro</span>
              )}
            </div>
            <h4 className="text-sm font-semibold text-white mb-1 leading-tight">{insight.title}</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">{insight.description}</p>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Fix:</strong> {insight.recommendation}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Fix This For Me */}
              {actionDef && !result && (
                <button onClick={handleFix} disabled={fixing}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border transition-all disabled:opacity-60 ${
                    isAllowed ? `bg-white/6 ${s.btnBorder} ${s.btnText} ${s.btnHover}` : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10 bg-white/3"
                  }`}
                >
                  {fixing ? (
                    <><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Fixing...</>
                  ) : <>{isAllowed ? "⚡" : "🔒"} {actionDef.label}</>}
                </button>
              )}
              {result && <span className="text-xs font-semibold text-green-400">✅ Applied</span>}
              {insight.actionLabel && insight.actionHref && (
                <a href={insight.actionHref}>
                  <button className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${s.btnBorder} ${s.btnText} ${s.btnHover}`}>
                    {insight.actionLabel} →
                  </button>
                </a>
              )}
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            {result && <OptimizationResultPanel result={result} onClose={() => setResult(null)} />}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Optimization report panel ────────────────────────────────────────────────
// Shows the full FunnelOptimizationReport with metric bars + recommendations

export function OptimizationReportPanel({
  report,
  userPlan = "starter",
  funnelId,
}: {
  report: FunnelOptimizationReport
  userPlan?: "starter" | "pro" | "enterprise"
  funnelId: string
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "metrics">("overview")
  const criticalCount = report.evaluations.filter((e) => e.status === "critical").length
  const warningCount = report.evaluations.filter((e) => e.status === "warning").length

  return (
    <div className="bg-[#0d0d1a] border border-white/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base">Funnel Optimization Report</h3>
              <ReportStatusBadge status={report.status} />
            </div>
            <p className="text-xs text-gray-500">
              {criticalCount > 0 && <span className="text-red-400">{criticalCount} critical </span>}
              {warningCount > 0 && <span className="text-amber-400">{warningCount} warnings </span>}
              {criticalCount === 0 && warningCount === 0 && <span className="text-green-400">All metrics healthy </span>}
              · Evaluated {new Date(report.evaluatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-1 mt-3">
          {(["overview", "metrics"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${activeTab === tab ? "bg-purple-600 text-white" : "text-gray-500 hover:text-white"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {/* Top priority callout */}
        {report.topPriorityRecommendation && (
          <div className="bg-red-500/5 border border-red-500/25 rounded-xl px-4 py-3 mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Top Priority</p>
              <p className="text-sm font-semibold text-white">{report.topPriorityRecommendation.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{report.topPriorityRecommendation.recommendedAction}</p>
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-1">
            {report.evaluations.map((ev) => (
              <MetricEvaluationBar key={ev.metric} evaluation={ev} />
            ))}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="space-y-3">
            {report.recommendations.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-2xl mb-2">🎉</div>
                <p className="text-sm text-gray-400">All metrics are healthy — no optimizations needed right now.</p>
              </div>
            ) : (
              report.recommendations.slice(0, 4).map((rec) => (
                <div key={rec.id} className={`rounded-xl p-4 border ${
                  rec.severity === "critical" ? "bg-red-500/8 border-red-500/25" : "bg-amber-500/8 border-amber-500/25"
                }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0 mt-0.5">{rec.severity === "critical" ? "🔴" : "⚠️"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className={`text-sm font-semibold ${rec.severity === "critical" ? "text-red-400" : "text-amber-400"}`}>{rec.title}</h4>
                        {rec.requiresPro && userPlan === "starter" && (
                          <span className="text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded-full uppercase">Pro</span>
                        )}
                        {rec.autoApplicable && (
                          <span className="text-[9px] font-bold bg-green-500/15 text-green-400 border border-green-500/25 px-1.5 py-0.5 rounded-full">Auto-fix</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-2">{rec.reason}</p>
                      <p className="text-xs text-gray-300 leading-relaxed">{rec.recommendedAction}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {report.recommendations.length > 4 && (
              <p className="text-xs text-center text-gray-600">
                +{report.recommendations.length - 4} more recommendations in full analytics
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Auto Optimize toggle ─────────────────────────────────────────────────────
export function AutoOptimizeToggle({
  enabled, onToggle, userPlan = "starter", funnelId, metrics,
}: {
  enabled: boolean; onToggle: (val: boolean) => void;
  userPlan?: "starter" | "pro" | "enterprise";
  funnelId?: string; metrics?: Record<string, number>;
}) {
  const [upgradeMessage, setUpgradeMessage] = useState("")
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState<{ count: number; summary: string } | null>(null)
  const isAllowed = userPlan === "pro" || userPlan === "enterprise"

  const handleToggle = () => {
    if (!isAllowed) { setUpgradeMessage("Auto Optimize requires a Pro plan. Upgrade to monitor performance and apply improvements automatically."); return }
    onToggle(!enabled)
  }

  const handleRunNow = async () => {
    if (!isAllowed || !funnelId || !metrics) return
    setRunning(true)
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "auto", funnelId, metrics }),
      })
      const data = await res.json()
      setRunResult({ count: data.count ?? 0, summary: data.summary ?? "" })
    } finally { setRunning(false) }
  }

  return (
    <>
      {upgradeMessage && <UpgradePrompt message={upgradeMessage} onClose={() => setUpgradeMessage("")} />}
      <div className={`rounded-2xl border p-4 transition-all ${enabled && isAllowed ? "bg-purple-500/8 border-purple-500/40" : "bg-white/4 border-white/10"}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${enabled && isAllowed ? "bg-purple-500/20" : "bg-white/8"}`}>⚡</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-white">Auto Optimize My Funnel</span>
                {!isAllowed && <span className="text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded-full uppercase">Pro</span>}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                {enabled && isAllowed ? "Active — monitoring metrics and applying fixes automatically when thresholds drop" : "Monitor performance and auto-apply fixes when metrics fall below thresholds"}
              </p>
            </div>
          </div>
          <button onClick={handleToggle} className={`relative w-12 h-6 rounded-full flex-shrink-0 transition-all ${enabled && isAllowed ? "bg-purple-600" : "bg-white/15"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${enabled && isAllowed ? "left-6" : "left-0.5"}`} />
          </button>
        </div>
        {enabled && isAllowed && (
          <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
            <p className="text-xs text-gray-500">{runResult ? runResult.summary : "Monitoring active — checks run every 24 hours"}</p>
            <button onClick={handleRunNow} disabled={running}
              className="text-xs font-semibold text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 px-3 py-1.5 rounded-lg transition disabled:opacity-50 flex items-center gap-1.5">
              {running ? <><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Running...</> : "Run Now →"}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Insight panel ────────────────────────────────────────────────────────────
export function InsightPanel({
  insights, loading = false, userPlan = "starter", funnelId, metrics,
}: {
  insights: AnalyticsInsight[]; loading?: boolean;
  userPlan?: "starter" | "pro" | "enterprise";
  funnelId?: string; metrics?: Record<string, number>;
}) {
  const [autoOptimize, setAutoOptimize] = useState(false)
  const criticals = insights.filter(i => i.severity === "critical")

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-4 animate-pulse">
          <div className="h-3 bg-white/10 rounded w-1/3 mb-2" /><div className="h-2 bg-white/6 rounded w-2/3" />
        </div>
      ))}
    </div>
  )

  if (insights.length === 0) return (
    <div className="bg-white/4 border border-white/8 rounded-xl p-6 text-center">
      <div className="text-2xl mb-2">📊</div>
      <p className="text-sm text-gray-400">No insights yet. Run your webinar to start seeing performance data.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      <AutoOptimizeToggle enabled={autoOptimize} onToggle={setAutoOptimize} userPlan={userPlan} funnelId={funnelId} metrics={metrics} />
      {criticals.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
            🔴 {criticals.length} critical issue{criticals.length > 1 ? "s" : ""} — use Fix buttons below
          </span>
        </div>
      )}
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} userPlan={userPlan} funnelId={funnelId} />
      ))}
    </div>
  )
}

// ─── Health badge ─────────────────────────────────────────────────────────────
export function HealthBadge({ health }: { health: "excellent" | "good" | "needs_work" | "critical" }) {
  const config = {
    excellent: { label: "Excellent performance", color: "bg-green-500/15 text-green-400 border-green-500/30" },
    good:      { label: "Healthy performance",   color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    needs_work:{ label: "Needs optimization",    color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    critical:  { label: "Action required",       color: "bg-red-500/15 text-red-400 border-red-500/30" },
  }[health]
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${config.color}`}>{config.label}</span>
}

// ─── Report status badge ──────────────────────────────────────────────────────
export function ReportStatusBadge({ status }: { status: "healthy" | "needs_attention" | "critical" }) {
  const config = {
    healthy:         { label: "Healthy",          color: "bg-green-500/15 text-green-400 border-green-500/30" },
    needs_attention: { label: "Needs attention",  color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    critical:        { label: "Critical issues",  color: "bg-red-500/15 text-red-400 border-red-500/30" },
  }[status]
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${config.color}`}>{config.label}</span>
}
