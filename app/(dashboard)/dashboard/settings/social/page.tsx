"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const PLATFORMS = [
  { id: "facebook", name: "Facebook", icon: "👤", color: "blue", desc: "Pages, Groups, Personal profiles" },
  { id: "instagram", name: "Instagram", icon: "📸", color: "pink", desc: "Business and Creator accounts" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "indigo", desc: "Personal profiles and Company pages" },
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "red", desc: "Business and Creator accounts" },
  { id: "twitter", name: "X (Twitter)", icon: "𝕏", color: "gray", desc: "Personal and Business accounts" },
  { id: "youtube", name: "YouTube", icon: "▶️", color: "red", desc: "Channel posting and Shorts" },
  { id: "pinterest", name: "Pinterest", icon: "📌", color: "red", desc: "Business accounts and boards" },
  { id: "threads", name: "Threads", icon: "🧵", color: "gray", desc: "Personal and Business accounts" },
  { id: "reddit", name: "Reddit", icon: "🤖", color: "orange", desc: "Subreddit posting" },
  { id: "bluesky", name: "Bluesky", icon: "🦋", color: "blue", desc: "Personal accounts" },
  { id: "googlebusiness", name: "Google Business", icon: "🗺️", color: "green", desc: "Business profile posts" },
  { id: "telegram", name: "Telegram", icon: "✈️", color: "blue", desc: "Channels and groups" },
]

const COLOR_MAP: Record<string, string> = {
  blue: "border-blue-500/50 bg-blue-500/10 text-blue-400",
  pink: "border-pink-500/50 bg-pink-500/10 text-pink-400",
  indigo: "border-indigo-500/50 bg-indigo-500/10 text-indigo-400",
  red: "border-red-500/50 bg-red-500/10 text-red-400",
  gray: "border-gray-500/50 bg-gray-500/10 text-gray-400",
  orange: "border-orange-500/50 bg-orange-500/10 text-orange-400",
  green: "border-green-500/50 bg-green-500/10 text-green-400",
}

export default function SocialSettingsPage() {
  const [connected, setConnected] = useState<string[]>([])
  const [profileExists, setProfileExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [creatingProfile, setCreatingProfile] = useState(false)
  const [connectUrl, setConnectUrl] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/social/status")
      const data = await res.json()
      setProfileExists(data.profileExists || false)
      setConnected(data.connected?.map((s: any) => s.platform) || [])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const createProfile = async () => {
    setCreatingProfile(true)
    try {
      const res = await fetch("/api/social/create-profile", { method: "POST" })
      const data = await res.json()
      if (data.success) {
        setProfileExists(true)
        setSuccessMsg("Social profile created! You can now connect your accounts.")
        setTimeout(() => setSuccessMsg(""), 3000)
      }
    } catch (err) {
      setErrorMsg("Failed to create profile. Please try again.")
      setTimeout(() => setErrorMsg(""), 3000)
    }
    setCreatingProfile(false)
  }

  const handleConnect = async (platformId: string) => {
    if (!profileExists) {
      await createProfile()
    }
    setConnecting(platformId)
    try {
      const res = await fetch("/api/social/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformId }),
      })
      const data = await res.json()
      if (data.connectUrl) {
        setConnectUrl(data.connectUrl)
        window.open(data.connectUrl, "_blank", "width=600,height=700")
        setTimeout(() => {
          fetchStatus()
          setConnecting(null)
        }, 5000)
      } else {
        setConnected([...connected, platformId])
        setSuccessMsg(`${platformId} connected successfully!`)
        setTimeout(() => setSuccessMsg(""), 3000)
        setConnecting(null)
      }
    } catch (err) {
      setErrorMsg("Failed to connect. Please try again.")
      setTimeout(() => setErrorMsg(""), 3000)
      setConnecting(null)
    }
  }

  const handleDisconnect = async (platformId: string) => {
    setDisconnecting(platformId)
    try {
      await fetch("/api/social/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformId }),
      })
      setConnected(connected.filter((p) => p !== platformId))
      setSuccessMsg(`${platformId} disconnected.`)
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err) {
      setErrorMsg("Failed to disconnect. Please try again.")
      setTimeout(() => setErrorMsg(""), 3000)
    }
    setDisconnecting(null)
  }

  const connectedCount = connected.length
  const totalPlatforms = PLATFORMS.length

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-10 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/settings" className="text-gray-500 hover:text-white transition text-sm">
              ← Settings
            </Link>
            <span className="text-gray-700">/</span>
            <span className="text-purple-400 text-sm font-semibold">Social Accounts</span>
          </div>
          <Link href="/content-calendar">
            <button className="border border-purple-500/50 hover:border-purple-500 text-purple-400 px-4 py-2 rounded-xl text-sm font-semibold transition">
              📅 Go to Content Calendar
            </button>
          </Link>
        </div>
        <div className="max-w-5xl mx-auto mt-6">
          <h1 className="text-3xl font-bold mb-1">Social Media Accounts</h1>
          <p className="text-gray-400">Connect your social accounts to schedule and publish posts directly from WebinarForge AI.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Alerts */}
        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm font-semibold">
            ✅ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-semibold">
            ❌ {errorMsg}
          </div>
        )}

        {/* Status Bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Connection Status</h2>
              <p className="text-gray-400 text-sm">
                {loading ? "Loading..." : `${connectedCount} of ${totalPlatforms} platforms connected`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!profileExists && !loading && (
                <button
                  onClick={createProfile}
                  disabled={creatingProfile}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition disabled:opacity-50"
                >
                  {creatingProfile ? "Setting up..." : "🚀 Set Up Social Profile"}
                </button>
              )}
              {profileExists && (
                <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full font-semibold">
                  ✅ Profile Active
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(connectedCount / totalPlatforms) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{connectedCount} connected</span>
            <span>{totalPlatforms - connectedCount} remaining</span>
          </div>
        </div>

        {/* Platform Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4">Connect Your Platforms</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {PLATFORMS.map((platform) => {
              const isConnected = connected.includes(platform.id)
              const isConnecting = connecting === platform.id
              const isDisconnecting = disconnecting === platform.id

              return (
                <div
                  key={platform.id}
                  className={`rounded-2xl border p-5 flex items-center justify-between gap-4 transition ${
                    isConnected
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl flex-shrink-0 ${COLOR_MAP[platform.color]}`}>
                      {platform.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{platform.name}</h3>
                        {isConnected && (
                          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{platform.desc}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isConnected ? (
                      <button
                        onClick={() => handleDisconnect(platform.id)}
                        disabled={!!isDisconnecting}
                        className="border border-red-500/30 hover:border-red-500 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                      >
                        {isDisconnecting ? "..." : "Disconnect"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(platform.id)}
                        disabled={!!isConnecting || loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {isConnecting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Connecting...
                          </>
                        ) : "Connect"}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="font-bold text-blue-400 mb-3">How Social Connections Work</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Connect", desc: "Click Connect and authorize WebinarForge AI to post on your behalf via secure OAuth" },
              { step: "2", title: "Schedule", desc: "Go to the Content Calendar and create posts — select which connected platforms to publish to" },
              { step: "3", title: "Auto-Publish", desc: "Posts go out automatically at your scheduled time across all selected platforms simultaneously" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">
                  {step}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{title}</p>
                  <p className="text-xs text-gray-400 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zernio Powered */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Powered by Zernio Social API</p>
            <p className="text-xs text-gray-500">Your credentials are encrypted and never stored on our servers</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-semibold">API Connected</span>
          </div>
        </div>

      </div>
    </main>
  )
}
