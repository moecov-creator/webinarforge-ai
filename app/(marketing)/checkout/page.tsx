// app/(marketing)/checkout/page.tsx
"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

const UPSELL_MAP: Record<string, string> = {
  templates: "UPSELL_TEMPLATES",
  onboarding: "UPSELL_ONBOARDING",
  fullfunnel: "UPSELL_FULLFUNNEL",
}

function CheckoutRedirect() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get("plan")
  const upsell = searchParams.get("upsell")
  const [status, setStatus] = useState("Starting checkout...")
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const planKey = plan === "earlybird"
      ? "EARLY_BIRD"
      : upsell
      ? UPSELL_MAP[upsell]
      : null

    if (!planKey) {
      setError("No plan selected — redirecting to pricing...")
      setTimeout(() => router.push("/pricing"), 2000)
      return
    }

    setStatus(`Plan: ${planKey} — Connecting to Stripe...`)

    let attemptCount = 0

    const tryCheckout = async () => {
      attemptCount++
      setAttempts(attemptCount)
      setStatus(`Attempt ${attemptCount}/5 — calling checkout API...`)

      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planKey }),
        })

        const data = await res.json()

        // Show exactly what came back
        setStatus(`API response: ${JSON.stringify(data)}`)

        if (data.url) {
          setStatus("✅ Got Stripe URL — redirecting now...")
          window.location.href = data.url
        } else if (data.error) {
          setError(`API Error: ${data.error}`)
          if (attemptCount < 5) {
            setStatus(`Retrying in 1s... (${attemptCount}/5)`)
            setTimeout(tryCheckout, 1000)
          } else {
            setError(`Failed after 5 attempts. Last error: ${data.error}`)
          }
        } else {
          setError(`Unexpected response: ${JSON.stringify(data)}`)
        }
      } catch (err: any) {
        setError(`Network error: ${err.message}`)
        if (attemptCount < 5) {
          setTimeout(tryCheckout, 1000)
        }
      }
    }

    setTimeout(tryCheckout, 800)
  }, [plan, upsell, router])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />

      <p className="text-white/60 text-lg text-center">
        Preparing your secure checkout...
      </p>

      {/* Debug info */}
      <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm space-y-2">
        <p className="text-gray-400">
          Plan param: <span className="text-amber-400">{plan || "none"}</span>
        </p>
        <p className="text-gray-400">
          Attempts: <span className="text-amber-400">{attempts}</span>
        </p>
        <p className="text-gray-400">
          Status: <span className="text-green-400">{status}</span>
        </p>
        {error && (
          <p className="text-red-400 font-semibold border border-red-500 rounded-lg p-2">
            ❌ {error}
          </p>
        )}
      </div>

      <p className="text-amber-400 font-bold text-xl">
        🔒 Locking in your $49 early bird price
      </p>

      {error && (
        <button
          onClick={() => router.push("/pricing")}
          className="mt-4 border border-white/20 hover:border-white/50 px-6 py-3 rounded-xl text-sm transition"
        >
          ← Back to pricing
        </button>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
          <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-lg">Loading checkout...</p>
        </div>
      }
    >
      <CheckoutRedirect />
    </Suspense>
  )
}
