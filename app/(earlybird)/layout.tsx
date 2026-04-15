import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WebinarForge AI — The AI OS for Evergreen Webinars | Early Bird $49",
  description:
    "Finally — a system that runs your webinars 24/7 while you sleep. AI-generated scripts, automated funnels, and your AI avatar presenter. Lifetime access for $49.",
  openGraph: {
    title: "WebinarForge AI — Get Lifetime Access for $49",
    description: "AI-powered webinars that generate leads and book appointments automatically.",
  },
}

// No dashboard nav — completely standalone funnel layout
export default function EarlyBirdFunnelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  )
}
