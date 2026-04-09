// app/(marketing)/checkout/page.tsx
"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const PLAN_MAP: Record<string, string> = {
  earlybird: "EARLY_BIRD",
  templates: "EARLY_BIRD",
  onboarding: "EARLY_BIRD",
  fullfunnel: "EARLY_BIRD",
}

const UPSELL_MAP: Record<string, string> = {
  templates: "UPSELL_TEMPLATES",
  onboarding: "UPSELL_ONBOARDING",
  fullfunnel: "UPSELL_FULLFUNNEL",
}

function CheckoutRedirect() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan")
  const upsell = searchParams.get("upsell")

  useEffect(() => {
    const planKey = plan === "earlybird"
      ? "EARLY_BIRD"
      : upsell
      ? UPSELL_MAP[upsell]
      : null

    if (!planKey) {
      window.location.href = "/pricing"
      return
    }

    // Call the billing checkout API
    fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planKey }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url
        } else {
          window.location.href = "/pricing"
        }
      })
      .catch(() => {
        window.location.href = "/pricing"
      })
  }, [plan, upsell])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/60 text-lg">Preparing your secure checkout...</p>
      <p className="text-amber-400 font-semibold">🔒 Locking in your $49 early bird price</p>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutRedirect />
    </Suspense>
  )
}
