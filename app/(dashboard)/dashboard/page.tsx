import Link from "next/link"

const stats = [
  { label: "Active Webinars", value: "4", subtext: "+2 this week" },
  { label: "Registrations", value: "312", subtext: "+18% vs last week" },
  { label: "CTA Clicks", value: "47", subtext: "+12% vs last week" },
  { label: "Conversion Rate", value: "18.4%", subtext: "Healthy performance" },
]

const webinars = [
  { name: "3-Step High-Ticket Coaching System", status: "Live", registrations: 128, clicks: 19 },
  { name: "Real Estate Lead Machine", status: "Live", registrations: 94, clicks: 14 },
  { name: "SaaS Demo-to-Trial Converter", status: "Draft", registrations: 0, clicks: 0 },
]

const automations = [
  "Reminder email scheduled for tomorrow at 9:00 AM",
  "Replay link follow-up goes out 2 hours after webinar ends",
  "CTA boost sequence triggers after 60% watch time",
  "Lead scoring updates nightly",
]

const quickActions = [
  { label: "➕ Create Webinar", href: "/dashboard/webinars/new" },
  { label: "🤖 AI Funnel Generator", href: "/funnel/generator" },
  { label: "📁 Funnel Templates", href: "/funnel/templates" },
  { label: "🚀 View Funnel Hub", href: "/funnel" },
  { label: "📊 View Analytics", href: "/dashboard/analytics" },
  { label: "📅 Content Calendar", href: "/content-calendar" },
  { label: "📋 Form Builder", href: "/forms" },
]

const sidebarLinks = [
  { label: "🏠 Dashboard", href: "/dashboard", group: "" },
  { label: "🎬 Webinars", href: "/dashboard/webinars", group: "" },
  { label: "🎭 AI Presenters", href: "/dashboard/presenters", group: "" },
  { label: "🚀 Funnel Hub", href: "/funnel", group: "FUNNELS" },
  { label: "🤖 AI Generator", href: "/funnel/generator", group: "FUNNELS" },
  { label: "📁 Templates", href: "/funnel/templates", group: "FUNNELS" },
  { label: "📋 Forms", href: "/forms", group: "TOOLS" },
  { label: "📅 Content Calendar", href: "/content-calendar", group: "TOOLS" },
  { label: "📤 Bulk Scheduler", href: "/content-calendar/bulk", group: "TOOLS" },
  { label: "⚡ Automation", href: "/dashboard/evergreen", group: "" },
  { label: "📊 Analytics", href: "/dashboard/analytics", group: "" },
  { label: "🤝 Affiliates", href: "/dashboard/affiliates", group: "" },
  { label: "💳 Billing", href: "/dashboard/billing", group: "" },
  { label: "⚙️ Settings", href: "/dashboard/settings", group: "" },
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-[#050505] p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 font-bold">
                ⚡
              </div>
              <div>
                <p className="text-lg font-bold">WebinarForge AI</p>
                <p className="text-sm text-gray-400">Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {sidebarLinks.map((link, i) => {
              const prevGroup = i > 0 ? sidebarLinks[i - 1].group : ""
              const showHeader = link.group && link.group !== prevGroup
              return (
                <div key={link.href}>
                  {showHeader && (
                    <p className="text-xs text-gray-600 font-bold uppercase px-4 pt-4 pb-1">
                      {link.group}
                    </p>
                  )}
                  <Link
                    href={link.href}
                    className={`block rounded-xl py-2.5 text-gray-300 hover:bg-white/5 hover:text-white transition text-sm font-medium ${
                      link.group ? "px-6" : "px-4"
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              )
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-1 text-xs text-gray-500 uppercase font-semibold">Current Plan</p>
            <p className="text-xl font-bold text-purple-400">Early Bird</p>
            <p className="mt-2 text-xs text-gray-400">
              Lifetime access locked in at $49. You are all set!
            </p>
            <Link href="/pricing" className="mt-3 inline-block text-sm font-semibold text-purple-400">
              View Plans →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-auto">

          {/* Top bar */}
          <header className="border-b border-white/10 bg-black/80 px-6 py-5 backdrop-blur sticky top-0 z-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Welcome back 👋</h1>
                <p className="text-sm text-gray-400">
                  Manage your webinars, funnels, and automations from one place.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/funnel/generator">
                  <button className="rounded-xl border border-purple-500/50 hover:border-purple-500 text-purple-400 px-4 py-2.5 text-sm font-semibold transition">
                    🤖 AI Generator
                  </button>
                </Link>
                <Link href="/funnel">
                  <button className="rounded-xl border border-white/20 hover:border-white/50 px-4 py-2.5 text-sm font-semibold transition">
                    🚀 View Funnel
                  </button>
                </Link>
                <Link href="/dashboard/webinars/new">
                  <button className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold hover:bg-purple-700 transition">
                    + Create Webinar
                  </button>
                </Link>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 py-8">

            {/* Stats */}
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  <p className="mt-2 text-sm text-purple-400">{stat.subtext}</p>
                </div>
              ))}
            </section>

            {/* Tool Cards */}
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: "🤖", title: "AI Funnel Generator", desc: "Generate a complete funnel for any niche in minutes", href: "/funnel/generator" },
                { icon: "📁", title: "Funnel Templates", desc: "17+ proven templates across 10 niches", href: "/funnel/templates" },
                { icon: "📋", title: "Form Builder", desc: "Create A2P compliant lead capture forms", href: "/forms" },
                { icon: "📅", title: "Content Calendar", desc: "Schedule posts across all platforms", href: "/content-calendar" },
              ].map(({ icon, title, desc, href }) => (
                <Link key={href} href={href}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 p-5 cursor-pointer transition h-full">
                    <div className="text-3xl mb-3">{icon}</div>
                    <h3 className="font-bold mb-1 text-sm">{title}</h3>
                    <p className="text-gray-400 text-xs">{desc}</p>
                  </div>
                </Link>
              ))}
            </section>

            {/* Main grid */}
            <section className="grid gap-8 xl:grid-cols-3">

              {/* Left column */}
              <div className="space-y-8 xl:col-span-2">

                {/* Recent webinars */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Recent Webinars</h2>
                      <p className="text-sm text-gray-400">Your latest webinar funnels and their performance.</p>
                    </div>
                    <Link href="/dashboard/webinars" className="text-sm font-semibold text-purple-400">
                      View all →
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="border-b border-white/10 text-sm text-gray-400">
                        <tr>
                          <th className="pb-3">Webinar</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Registrations</th>
                          <th className="pb-3">CTA Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {webinars.map((webinar) => (
                          <tr key={webinar.name} className="border-b border-white/5 last:border-b-0">
                            <td className="py-4 font-medium text-sm">{webinar.name}</td>
                            <td className="py-4">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                webinar.status === "Live"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}>
                                {webinar.status}
                              </span>
                            </td>
                            <td className="py-4 text-gray-300 text-sm">{webinar.registrations}</td>
                            <td className="py-4 text-gray-300 text-sm">{webinar.clicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Funnel performance chart */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Funnel Performance</h2>
                      <p className="text-sm text-gray-400">Registrations over the last 7 days.</p>
                    </div>
                    <Link href="/dashboard/analytics" className="text-sm font-semibold text-purple-400">
                      Full analytics →
                    </Link>
                  </div>
                  <div className="flex h-48 items-end gap-3 rounded-2xl border border-white/10 bg-black/30 p-6">
                    {[45, 60, 38, 72, 58, 86, 52].map((height, index) => (
                      <div key={index} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-purple-600 to-blue-400"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-500">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right column */}
              <div className="space-y-6">

                {/* Quick actions */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
                  <div className="grid gap-2">
                    {quickActions.map((action) => (
                      <Link key={action.label} href={action.href}>
                        <button className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-medium hover:bg-white/5 hover:border-purple-500/50 transition">
                          {action.label}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* AI assistant */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="mb-2 text-xl font-bold">AI Assistant</h2>
                  <p className="mb-4 text-sm text-gray-400">
                    Generate a complete funnel for any niche in minutes.
                  </p>
                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 mb-4">
                    <p className="text-sm text-gray-300">
                      "Want me to generate a webinar funnel for coaches selling a high-ticket offer?"
                    </p>
                  </div>
                  <Link href="/funnel/generator">
                    <button className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold hover:bg-purple-700 transition">
                      🤖 Open AI Funnel Generator →
                    </button>
                  </Link>
                </div>

                {/* Upcoming automations */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="mb-4 text-xl font-bold">Upcoming Automations</h2>
                  <div className="space-y-2">
                    {automations.map((item) => (
                      <div key={item} className="rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-gray-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
