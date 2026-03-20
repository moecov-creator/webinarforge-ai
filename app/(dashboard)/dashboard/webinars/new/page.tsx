import Link from "next/link"

export default function NewWebinarPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-purple-400">Webinars / New</p>
            <h1 className="text-3xl md:text-5xl font-bold">Create New Webinar</h1>
            <p className="mt-2 text-gray-400">
              Build your next AI-powered evergreen webinar funnel in minutes.
            </p>
          </div>

          <Link href="/dashboard">
            <button className="rounded-xl border border-white/20 px-5 py-3 font-medium hover:border-white/50">
              ← Back to Dashboard
            </button>
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-3">
          {/* Left/Main Form */}
          <div className="xl:col-span-2 space-y-8">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Webinar Details</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Webinar Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3-Step AI Client Acquisition System"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Niche / Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coaches, Real Estate Agents, SaaS Founders"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Offer Type
                  </label>
                  <select className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-purple-500 focus:outline-none">
                    <option>High-Ticket Offer</option>
                    <option>Course / Program</option>
                    <option>SaaS Trial / Demo</option>
                    <option>Local Service Offer</option>
                    <option>Consultation Funnel</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Core Promise / Main Outcome
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Help coaches generate premium clients without daily sales calls"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Main CTA
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Book a strategy call / Start free trial / Join program"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Messaging Inputs</h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Pain Points
                  </label>
                  <textarea
                    rows={4}
                    placeholder="What problems is your audience dealing with right now?"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    False Beliefs / Objections
                  </label>
                  <textarea
                    rows={4}
                    placeholder="What objections or limiting beliefs should the webinar address?"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Desired Transformation
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe what success looks like for the audience after using your offer."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-2xl font-bold">Webinar Settings</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Webinar Style
                  </label>
                  <select className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-purple-500 focus:outline-none">
                    <option>Perfect Webinar Style</option>
                    <option>Sales Presentation</option>
                    <option>Educational Demo</option>
                    <option>Case Study Webinar</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Presenter Type
                  </label>
                  <select className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-purple-500 focus:outline-none">
                    <option>AI Presenter</option>
                    <option>Human Presenter</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Webinar Length
                  </label>
                  <select className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-purple-500 focus:outline-none">
                    <option>30 Minutes</option>
                    <option>45 Minutes</option>
                    <option>60 Minutes</option>
                    <option>90 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Replay Mode
                  </label>
                  <select className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-purple-500 focus:outline-none">
                    <option>Evergreen Replay</option>
                    <option>Simulated Live</option>
                    <option>Manual Replay</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-2xl font-bold">AI Actions</h2>

              <div className="space-y-3">
                <button className="w-full rounded-xl bg-purple-600 px-4 py-4 font-semibold hover:bg-purple-700">
                  Generate Webinar Script →
                </button>

                <button className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 font-medium hover:bg-white/5">
                  Generate Offer Stack
                </button>

                <button className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 font-medium hover:bg-white/5">
                  Generate CTA Sequence
                </button>

                <button className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 font-medium hover:bg-white/5">
                  Create Funnel Outline
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-2xl font-bold">AI Preview</h2>

              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5 text-sm text-gray-300">
                Your generated webinar outline will appear here.
                <div className="mt-4 space-y-2 text-gray-400">
                  <p>• Hook</p>
                  <p>• Problem Agitation</p>
                  <p>• Belief Shift</p>
                  <p>• Offer Stack</p>
                  <p>• CTA</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-2xl font-bold">Quick Tips</h2>

              <div className="space-y-3 text-sm text-gray-400">
                <p>• Focus on one clear outcome for the webinar.</p>
                <p>• Use pain points your audience already feels daily.</p>
                <p>• Keep the CTA simple and direct.</p>
                <p>• Choose a webinar style that matches your offer.</p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-2xl font-bold">Publish</h2>

              <div className="space-y-3">
                <button className="w-full rounded-xl bg-green-600 px-4 py-4 font-semibold hover:bg-green-700">
                  Save Draft
                </button>

                <button className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 font-medium hover:bg-white/5">
                  Preview Webinar
                </button>

                <button className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 font-medium hover:bg-white/5">
                  Publish Funnel
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
