import Link from "next/link"

const stats = [
  { label: "Active Webinars", value: "4", subtext: "+2 this week" },
  { label: "Registrations", value: "312", subtext: "+18% vs last week" },
  { label: "CTA Clicks", value: "47", subtext: "+12% vs last week" },
  { label: "Conversion Rate", value: "18.4%", subtext: "Healthy performance" },
]

const webinars = [
  {
    name: "3-Step High-Ticket Coaching System",
    status: "Live",
    registrations: 128,
    clicks: 19,
  },
  {
    name: "Real Estate Lead Machine",
    status: "Live",
    registrations: 94,
    clicks: 14,
  },
  {
    name: "SaaS Demo-to-Trial Converter",
    status: "Draft",
    registrations: 0,
    clicks: 0,
  },
]

const automations = [
  "Reminder email scheduled for tomorrow at 9:00 AM",
  "Replay link follow-up goes out 2 hours after webinar ends",
  "CTA boost sequence triggers after 60% watch time",
  "Lead scoring updates nightly",
]

const quickActions = [
  { label: "Create Webinar", href: "/dashboard/webinars/new" },
  { label: "Generate AI Script", href: "/dashboard/webinars/new" },
  { label: "Launch Funnel", href: "/dashboard/webinars" },
  { label: "View Analytics", href: "/dashboard/analytics" },
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-[#050505] p-6">
          <div className="mb-10">
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

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="block rounded-xl bg-white/10 px-4 py-3 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/webinars"
              className="block rounded-xl px-4 py-3 text-gray-300 hover:bg-white/5"
            >
              Webinars
            </Link>
            <Link
              href="/dashboard/presenters"
              className="block rounded-xl px-4 py-3 text-gray-300 hover:bg-white/5"
            >
              AI Presenters
            </Link>
            <Link
              href="/dashboard/funnels"
              className="block rounded-xl px-4 py-3 text-gray-300 hover:bg-white/5"
            >
              Funnels
            </Link>
            <Link
              href="/dashboard/automation"
              className="block rounded-xl px-4 py-3 text-gray-300 hover:bg-white/5"
            >
              Automation
            </Link>
            <Link
              href="/dashboard/analytics"
              className="block rounded-xl px-4 py-3 text-gray-300 hover:bg-white/5"
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/affiliates"
              className="block rounded-xl px-4 py-3 text-gray-300 hover:bg-white/5"
            >
              Affiliates
            </Link>
            <Link
              href="/dashboard/settings"
              className="block rounded-xl px-4 py-3 text-gray-300 hover:bg-white/5"
            >
              Settings
            </Link>
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-2 text-sm text-gray-400">Current Plan</p>
            <p className="text-xl font-bold text-purple-400">Pro</p>
            <p className="mt-2 text-sm text-gray-400">
              Unlimited webinar funnels, automation, and AI presenter tools.
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-block text-sm font-semibold text-purple-400"
            >
              Upgrade Plan →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Top bar */}
          <header className="border-b border-white/10 bg-black/80 px-6 py-5 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-sm text-gray-400">
                  Manage your webinars, funnels, and automations from one place.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/dashboard/webinars/new">
                  <button className="rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-700">
                    + Create Webinar
                  </button>
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-8">
            {/* Stats */}
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  <p className="mt-2 text-sm text-purple-400">{stat.subtext}</p>
                </div>
              ))}
            </section>

            {/* Main grid */}
            <section className="mt-8 grid gap-8 xl:grid-cols-3">
              {/* Left column */}
              <div className="space-y-8 xl:col-span-2">
                {/* Recent webinars */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Recent Webinars</h2>
                      <p className="text-sm text-gray-400">
                        Your latest webinar funnels and their performance.
                      </p>
                    </div>
                    <Link
                      href="/dashboard/webinars"
                      className="text-sm font-semibold text-purple-400"
                    >
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
                          <tr
                            key={webinar.name}
                            className="border-b border-white/5 last:border-b-0"
                          >
                            <td className="py-4 font-medium">{webinar.name}</td>
                            <td className="py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  webinar.status === "Live"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {webinar.status}
                              </span>
                            </td>
                            <td className="py-4 text-gray-300">
                              {webinar.registrations}
                            </td>
                            <td className="py-4 text-gray-300">
                              {webinar.clicks}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Funnel performance */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-5">
                    <h2 className="text-xl font-bold">Funnel Performance</h2>
                    <p className="text-sm text-gray-400">
                      Snapshot of registrations over the last 7 days.
                    </p>
                  </div>

                  <div className="flex h-64 items-end gap-4 rounded-2xl border border-white/10 bg-black/30 p-6">
                    {[45, 60, 38, 72, 58, 86, 52].map((height, index) => (
                      <div key={index} className="flex flex-1 flex-col items-center gap-3">
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
              <div className="space-y-8">
                {/* Quick actions */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="mb-5 text-xl font-bold">Quick Actions</h2>
                  <div className="grid gap-3">
                    {quickActions.map((action) => (
                      <Link key={action.label} href={action.href}>
                        <button className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-left font-medium hover:bg-white/5">
                          {action.label}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* AI assistant */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="mb-2 text-xl font-bold">AI Assistant</h2>
                  <p className="mb-5 text-sm text-gray-400">
                    Generate your next webinar script or funnel idea instantly.
                  </p>

                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
                    <p className="text-sm text-gray-300">
                      “Want me to generate a webinar for coaches selling a high-ticket offer?”
                    </p>
                  </div>

                  <button className="mt-4 w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold hover:bg-purple-700">
                    Generate With AI →
                  </button>
                </div>

                {/* Automation */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="mb-5 text-xl font-bold">Upcoming Automations</h2>
                  <div className="space-y-3">
                    {automations.map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300"
                      >
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
