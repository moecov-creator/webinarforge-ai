"use client"

import { useState } from "react"
import Link from "next/link"

export default function ContactPage() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [webinars, setWebinars] = useState("")
  const [budget, setBudget] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!name || !email || !company) return
    setLoading(true)
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          phone,
          webinars,
          budget,
          message,
        }),
      })
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">
            We will be in touch shortly!
          </h3>
          <p className="text-gray-400 mb-8">
            Thanks for reaching out. Our team will contact you within 24 hours.
          </p>
          <Link href="/">
            <button className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-semibold transition">
              Back to Home
            </button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <span className="inline-block bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full mb-6">
          ENTERPRISE PLAN
        </span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Scale Your Agency With
          <span className="text-purple-400"> White-Label AI Webinars</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
          Built for agencies, consultants, and teams that need unlimited funnels,
          custom branding, and a dedicated partner to help them scale.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">500+</div>
            <div className="text-xs text-gray-400 mt-1">Webinars Launched</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">18.4%</div>
            <div className="text-xs text-gray-400 mt-1">Avg Conversion Rate</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-xs text-gray-400 mt-1">Automated Sales</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">$3,285+</div>
            <div className="text-xs text-gray-400 mt-1">Value Included</div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <div>
            <h2 className="text-3xl font-bold mb-4">
              Everything in Pro, Plus:
            </h2>
            <p className="text-gray-400 mb-8">
              Enterprise gives you the full WebinarForge AI platform with
              white-label branding, team access, and a dedicated partner.
            </p>
            <div className="space-y-3 mb-10">
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✅</span>
                <span className="text-gray-300">Unlimited webinar funnels</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✅</span>
                <span className="text-gray-300">White-label platform your brand</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✅</span>
                <span className="text-gray-300">Team access up to 10 seats</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✅</span>
                <span className="text-gray-300">Dedicated account manager</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✅</span>
                <span className="text-gray-300">Custom onboarding and training</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✅</span>
                <span className="text-gray-300">Custom workflows and integrations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✅</span>
                <span className="text-gray-300">Priority 24/7 support</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✅</span>
                <span className="text-gray-300">Monthly strategy calls</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✅</span>
                <span className="text-gray-300">Custom AI presenter profiles</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">✅</span>
                <span className="text-gray-300">Advanced analytics and reporting</span>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-6 mb-8">
              <p className="text-purple-400 font-semibold mb-1">
                Starting at $497/month
              </p>
              <p className="text-gray-400 text-sm">
                Custom pricing based on your team size.
                Most agencies see ROI within 30 days.
              </p>
            </div>
            <div className="space-y-4">
              
                href="mailto:hello@webinarforge.ai"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition"
              >
                <span className="text-purple-400">✉️</span>
                hello@webinarforge.ai
              </a>
              
                href="https://calendly.com/webinarforgeai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition"
              >
                <span className="text-purple-400">📅</span>
                Book a 30-min strategy call
              </a>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-2">Get Enterprise Access</h3>
            <p className="text-gray-400 text-sm mb-6">
              Fill out the form and our team will reach out within 24 hours.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Business Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Company / Agency Name *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Agency"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Webinars per month?
                </label>
                <select
                  value={webinars}
                  onChange={(e) => setWebinars(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                >
                  <option value="">Select an option</option>
                  <option value="1-5">1-5 webinars</option>
                  <option value="6-10">6-10 webinars</option>
                  <option value="11-20">11-20 webinars</option>
                  <option value="20+">20+ webinars</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Monthly Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                >
                  <option value="">Select a range</option>
                  <option value="497-997">$497 - $997/month</option>
                  <option value="997-2000">$997 - $2,000/month</option>
                  <option value="2000+">$2,000+/month</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Tell us about your needs
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="We run webinars for our coaching clients..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || !name || !email || !company}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Request Enterprise Access"
                )}
              </button>
              <p className="text-xs text-gray-600 text-center">
                Our team will respond within 24 hours. No spam, ever.
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Enterprise FAQ
        </h2>
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">
              How is Enterprise different from Pro?
            </h3>
            <p className="text-gray-400">
              Enterprise adds white-label branding, team seats, a dedicated
              account manager, custom workflows, and monthly strategy calls.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">
              Can I white-label this for my clients?
            </h3>
            <p className="text-gray-400">
              Yes. Enterprise includes full white-label options so you can
              present WebinarForge AI under your own brand.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">
              How many team members can I add?
            </h3>
            <p className="text-gray-400">
              Enterprise starts with up to 10 seats. Additional seats can be
              added based on your needs.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">
              Is there a setup fee?
            </h3>
            <p className="text-gray-400">
              No setup fee. Your first month includes a custom onboarding
              session where we help you configure everything.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">
              Can I get a custom contract or invoice?
            </h3>
            <p className="text-gray-400">
              Yes. Enterprise clients can receive custom contracts, invoices,
              and annual billing options.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Scale With
          <span className="text-purple-400"> Enterprise?</span>
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Join agencies and teams already using WebinarForge AI to run
          automated webinar funnels for their clients.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-purple-600 hover:bg-purple-700 px-10 py-5 rounded-xl font-bold text-xl transition"
          >
            Apply for Enterprise
          </button>
          <Link href="/pricing">
            <button className="border border-white/20 hover:border-white/50 px-10 py-5 rounded-xl font-semibold text-xl transition">
              View All Plans
            </button>
          </Link>
        </div>
      </section>

    </main>
  )
}
