// app/(marketing)/checkout/page.tsx
"use client"

import { useEffect, Suspense } from "react"
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

  useEffect(() => {
    const planKey = plan === "earlybird"
      ? "EARLY_BIRD"
      : upsell
      ? UPSELL_MAP[upsell]
      : null

    if (!planKey) {
      router.push("/pricing")
      return
    }

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
          router.push("/pricing")
        }
      })
      .catch(() => router.push("/pricing"))
  }, [plan, upsell, router])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/60 text-lg">Preparing your secure checkout...</p>
      <p className="text-amber-400 font-bold text-xl">
        🔒 Locking in your $49 early bird price
      </p>
      <p className="text-white/30 text-sm">
        You will be redirected to Stripe shortly
      </p>
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
