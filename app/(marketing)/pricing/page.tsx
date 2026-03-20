// app/(marketing)/pricing/page.tsx

import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$97",
    period: "/month",
    description: "Best for solo business owners launching their first automated webinar funnel.",
    features: [
      "1 webinar funnel",
      "AI webinar script generator",
      "Basic evergreen automation",
      "Core analytics",
      "Email support",
    ],
    cta: "Start Starter Plan",
    href: "/sign-up",
    featured: false,
  },
  {
    name: "Pro",
    price: "$297",
    period: "/month",
    description: "Best for serious marketers, coaches, consultants, and agencies ready to scale.",
    features: [
      "Unlimited webinar funnels",
      "AI presenter tools",
      "Advanced evergreen automation",
      "Email + SMS follow-up",
      "Conversion analytics dashboard",
      "Affiliate tools",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/sign-up",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Best for teams, agencies, and white-label partners that need advanced scale.",
    features: [
      "White-label options",
      "Team access",
      "Advanced integrations",
      "Custom onboarding",
      "Dedicated support",
      "Custom workflows",
    ],
    cta: "Contact Sales",
    href: "/contact",
    featured: false,
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-24 px-6 text-center max-w-6xl mx-auto">
        <p className="text-purple-400 mb-4">Simple Pricing. Powerful Growth.</p>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Choose The Plan That Helps You
          <span className="text-purple-400"> Convert More Clients</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
          Whether you’re launching your first webinar or scaling multiple evergreen funnels,
          WebinarForge AI gives you the tools to automate presentations, follow-up, and conversions.
        </p>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 text-left flex flex-col ${
                plan.featured
                  ? "border-purple-500 bg-white/10 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {plan.featured && (
                <div className="mb-4">
                  <span className="inline-block rounded-full bg-purple-600 px-3 py-1 text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>

              <ul className="space-y-3 text-gray-300 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature}>✅ {feature}</li>
                ))}
              </ul>

              <Link href={plan.href}>
                <button
                  className={`w-full rounded-xl px-6 py-4 font-semibold text-lg transition ${
                    plan.featured
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border border-white/20 hover:border-white/50"
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Compare What You Get
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="w-full text-left">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="p-6">Features</th>
                  <th className="p-6">Starter</th>
                  <th className="p-6">Pro</th>
                  <th className="p-6">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/10">
                  <td className="p-6">Webinar Funnels</td>
                  <td className="p-6">1</td>
                  <td className="p-6">Unlimited</td>
                  <td className="p-6">Unlimited</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6">AI Script Builder</td>
                  <td className="p-6">Yes</td>
                  <td className="p-6">Yes</td>
                  <td className="p-6">Yes</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6">AI Presenter Tools</td>
                  <td className="p-6">No</td>
                  <td className="p-6">Yes</td>
                  <td className="p-6">Yes</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6">Evergreen Automation</td>
                  <td className="p-6">Basic</td>
                  <td className="p-6">Advanced</td>
                  <td className="p-6">Advanced</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6">Analytics</td>
                  <td className="p-6">Core</td>
                  <td className="p-6">Advanced</td>
                  <td className="p-6">Custom</td>
                </tr>
                <tr>
                  <td className="p-6">Support</td>
                  <td className="p-6">Email</td>
                  <td className="p-6">Priority</td>
                  <td className="p-6">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6 text-left">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">Do I need to go live?</h3>
            <p className="text-gray-400">
              No. WebinarForge AI is designed to help you create automated evergreen webinars
              that can run without you going live every time.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">Can I use my own offer and niche?</h3>
            <p className="text-gray-400">
              Yes. You can build webinar funnels for your own niche, audience, and offer.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">Do you support AI presenters?</h3>
            <p className="text-gray-400">
              Yes. Pro and Enterprise plans are built for AI presenter workflows and advanced automation.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">Can agencies use this for clients?</h3>
            <p className="text-gray-400">
              Absolutely. Pro works well for many agencies, and Enterprise is ideal for teams,
              client management, and white-label use cases.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Start Building Your AI Webinar Funnel Today
        </h2>

        <p className="text-gray-400 mb-8 text-lg">
          Choose your plan, launch faster, and turn your webinar into an always-on sales machine.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/sign-up">
            <button className="bg-purple-600 hover:bg-purple-700 px-10 py-5 rounded-xl font-semibold text-xl transition">
              Start Free Trial →
            </button>
          </Link>

          <Link href="/contact">
            <button className="border border-white/20 hover:border-white/50 px-10 py-5 rounded-xl font-semibold text-xl transition">
              Contact Sales
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}
