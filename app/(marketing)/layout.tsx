"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const EARLY_BIRD_END = new Date("2026-04-16T23:59:59")

function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = EARLY_BIRD_END.getTime() - new Date().getTime()
      if (distance <= 0) {
        setExpired(true)
        clearInterval(timer)
        return
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (expired) return null

  return (
    <div className="w-full bg-amber-500 text-black text-center py-2 px-4 text-sm font-semibold z-50 sticky top-0">
      🚀 Early Bird Special —{" "}
      <span className="text-white font-bold">Only $49!</span>{" "}
      Price goes up soon. Limited spots only.{" "}
      <Link href="/pricing" className="underline font-bold text-black">
        Claim Your Spot →
      </Link>{" "}
      ⏳ {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  )
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CountdownBanner />
      {children}
    </>
  )
}
