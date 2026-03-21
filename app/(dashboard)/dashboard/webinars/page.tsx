import Link from "next/link";

export const dynamic = "force-dynamic";

export default function WebinarsPage() {
  const webinars = [
    {
      id: "1",
      title: "High-Ticket Coaching Funnel",
      status: "Live",
      registrations: 128,
      clicks: 19,
    },
    {
      id: "2",
      title: "Real Estate Lead Machine",
      status: "Live",
      registrations: 94,
      clicks: 14,
    },
    {
      id: "3",
      title: "SaaS Demo Webinar",
      status: "Draft",
      registrations: 0,
      clicks: 0,
    },
  ];

  return (
    <main className="p-10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Webinars</h1>

        <Link href="/dashboard/webinars/new">
          <button className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg font-semibold">
            + Create Webinar
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="grid grid-cols-4 text-sm text-gray-400 mb-4">
          <span>Webinar</span>
          <span>Status</span>
          <span>Registrations</span>
          <span>CTA Clicks</span>
        </div>

        <div className="space-y-4">
          {webinars.map((webinar) => (
            <div
              key={webinar.id}
              className="grid grid-cols-4 items-center border-t border-white/5 pt-4"
            >
              <span className="font-medium">{webinar.title}</span>

              <span
                className={`text-xs px-2 py-1 rounded-full w-fit ${
                  webinar.status === "Live"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {webinar.status}
              </span>

              <span>{webinar.registrations}</span>
              <span>{webinar.clicks}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
