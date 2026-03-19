// app/(marketing)/page.tsx

import Link from "next/link";

export default function MarketingPage() {
  return (
    <main className="bg-black text-white">

      {/* HERO SECTION */}
      <section className="py-24 px-6 text-center max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Turn Cold Traffic Into High-Ticket Clients…
          <span className="text-purple-400"> Automatically With AI Webinars</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          No more Zoom calls. No more chasing leads. Our AI builds, presents, and helps convert your webinars — 24/7.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <Link href="/sign-up">
            <button className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-semibold text-lg">
              Start My AI Webinar Funnel →
            </button>
          </Link>

          <Link href="#">
            <button className="border border-gray-500 px-8 py-4 rounded-xl font-semibold text-lg">
              Watch Demo
            </button>
          </Link>
        </div>

        <p className="text-sm text-gray-400">
          No credit card required • Cancel anytime
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-gray-400">
          <span>Real Estate</span>
          <span>Coaches</span>
          <span>SaaS</span>
          <span>Consultants</span>
          <span>Local Businesses</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-[#0a0a0a] text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Pick Your Offer</h3>
            <p className="text-gray-400">
              Tell the AI what you're selling and who your audience is.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">2. AI Builds Webinar</h3>
            <p className="text-gray-400">
              Slides, script, funnel, and CTAs — fully generated in minutes.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">3. It Closes Clients</h3>
            <p className="text-gray-400">
              Your webinar runs 24/7 and converts leads automatically.
            </p>
          </div>
        </div>
      </section>

      {/* VALUE STACK */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          Everything You Need To Scale
        </h2>

        <div className="max-w-3xl mx-auto text-left space-y-4 text-lg">
          <p>✅ AI Webinar Builder ($997 value)</p>
          <p>✅ AI Avatar Presenter ($497 value)</p>
          <p>✅ Funnel Templates ($297 value)</p>
          <p>✅ Email + SMS Automation ($497 value)</p>
          <p>✅ Evergreen Replay Engine ($997 value)</p>
        </div>

        <p className="mt-8 text-xl font-semibold text-purple-400">
          Total Value: $3,285+
        </p>

        <p className="text-2xl font-bold mt-2">
          Start Today For $0
        </p>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 px-6 bg-[#0a0a0a] text-center">
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div>
            <h3 className="text-3xl font-bold">10,000+</h3>
            <p className="text-gray-400">Webinars Created</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">94%</h3>
            <p className="text-gray-400">User Satisfaction</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">18–32%</h3>
            <p className="text-gray-400">Conversion Rate</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Your Webinar Funnel Should Be Closing Deals…
          <span className="text-purple-400"> Even When You Sleep</span>
        </h2>

        <p className="text-gray-400 mb-8 text-lg">
          Start building your automated webinar system today.
        </p>

        <Link href="/sign-up">
          <button className="bg-purple-600 hover:bg-purple-700 px-10 py-5 rounded-xl font-semibold text-xl">
            Start Free Trial →
          </button>
        </Link>
      </section>

    </main>
  );
}
