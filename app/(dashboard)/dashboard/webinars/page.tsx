import Link from "next/link"

const webinars = [
  {
    name: "3-Step AI Client Acquisition System",
    status: "Live",
    registrations: 128,
    clicks: 19,
  },
  {
    name: "Real Estate Lead Machine",
    status: "Draft",
    registrations: 0,
    clicks: 0,
  },
]

export default function WebinarsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold">Your Webinars</h1>
            <p className="text-gray-400 mt-2">
              Manage and track all your webinar funnels.
            </p>
          </div>

          <Link href="/dashboard/webinars/new">
            <button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold">
              + Create Webinar
            </button>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 text-gray-400 text-sm">
              <tr>
                <th className="pb-3">Webinar</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Registrations</th>
                <th className="pb-3">CTA Clicks</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {webinars.map((webinar) => (
                <tr key={webinar.name} className="border-b border-white/5">
                  <td className="py-4 font-medium">{webinar.name}</td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
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

                  <td className="py-4">
                    <Link href="/dashboard/webinars/new">
                      <button className="text-purple-400 hover:underline text-sm">
                        Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 text-center">
          <Link href="/dashboard/webinars/new">
            <button className="bg-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-700">
              Create Your First Webinar →
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
