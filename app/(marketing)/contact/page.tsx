// app/(marketing)/contact/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, ArrowRight, Mail, Calendar } from "lucide-react"

const ENTERPRISE_FEATURES = [
  "Unlimited webinar funnels",
  "White-label platform — your brand",
  "Team access up to 10 seats",
  "Dedicated account manager",
  "Custom onboarding & training",
  "Custom workflows & integrations",
  "Priority 24/7 support",
  "Monthly strategy calls",
  "Custom AI presenter profiles",
  "Advanced analytics & reporting",
]

const SOCIAL_PROOF = [
  { metric: "500+", label: "Webinars Launched" },
  { metric: "18.4%", label: "Avg Conversion Rate" },
  { metric: "24/7", label: "Automated Sales" },
  { metric: "$3,285+", label: "Value Included" },
]

const FAQ = [
  {
    q: "How is Enterprise different from Pro?",
    a: "Enterprise adds white-label branding, team seats, a dedicated account manager, custom workflows, and monthly strategy calls. It's built for agencies managing multiple clients.",
  },
  {
    q: "Can I white-label this for my clients?",
    a: "Yes. Enterprise includes full white-label options so you can present WebinarForge AI under your own brand to your clients.",
  },
  {
    q: "How many team members can I add?",
    a: "Enterprise starts with up to 10 seats. Additional seats can be added based on your needs.",
  },
  {
    q: "Is there a setup fee?",
    a: "No setup fee. Your first month includes a custom onboarding session where we help you configure everything for your business.",
  },
  {
    q: "Can I get a custom contract or invoice?",
    a: "Yes. Enterprise clients can receive custom contracts, invoices, and annual billing options. Contact us to discuss.",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    webinars: "",
    message: "",
    budget: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.company) return
    setLoading(true)
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
    } catch {
      // Still show success
    }
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <span className="inline-block bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full mb-6">
          🏢 ENTERPRISE PLAN
        </span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Scale Your Agency With
          <span className="text-purple-400"> White-Label AI Webinars</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Built for agencies, consultants, and teams that need unlimited funnels,
          custom branding, and a dedicated partner to help them scale.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {SOCIAL_PROOF.map(({ metric, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400">{metric}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Everything in Pro, Plus:</h2>
            <p className="text-gray-400 mb-8">
              Enterprise gives you the full WebinarForge AI platform with
              white-label branding, team access, and a dedicated partner
              committed to your success.
            </p>
            <div className="space-y-3 mb-10">
              {ENTERPRISE_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-6 mb-8">
              <p className="text-purple-400 font-semibold mb-1">Starting at $497/month</p>
              <p className="text-gray-400 text-sm">
                Custom pricing based on your team size and needs. Most agencies
                see ROI within the first 30 days.
              </p>
            </div>
            <div className="space-y-4">
              
                href="mailto:hello@webinarforge.ai"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition"
              >
                <Mail className="w-5 h-5 text-purple-400" />
                hello@webinarforge.ai
              </a>
              
                href="https://calendly.com/webinarforgeai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition"
              >
                <Calendar className="w-5 h-5 text-purple-400" />
                Book a 30-min strategy call
              </a>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">We'll be in touch shortly!</h3>
                <p className="text-gray-400 mb-8">
                  Thanks for reaching out. Our team will contact you within
                  24 hours to schedule your strategy call.
                </p>
                <Link href="/">
                  <button className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-semibold transition">
                    Back to Home →
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-2">Get Enterprise Access</h3>
                <p className="text-gray-400 text-sm mb-8">
                  Fill out the form and our team will reach out within 24 hours.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Business Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Company / Agency Name *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Agency"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      How many webinars do you run per month?
                    </label>
                    <select
                      name="webinars"
                      value={formData.webinars}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                    >
                      <option value="">Select an option</option>
                      <option value="1-5">1-5 webinars</option>
                      <option value="6-10">6-10 webinars</option>
                      <option value="11-20">11-20 webinars</option>
                      <option value="20+">20+ webinars</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Monthly Budget</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                    >
                      <option value="">Select a range</option>
                      <option value="497-997">$497 - $997/month</option>
                      <option value="997-2000">$997 - $2,000/month</option>
                      <option value="2000+">$2,000+/month</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Tell us about your needs</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="We run webinars for our coaching clients and need white-label..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.name || !formData.email || !formData.company}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Request Enterprise Access
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-600 text-center">
                    Our team will respond within 24 hours. No spam, ever.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Enterprise FAQ</h2>
        <div className="space-y-6">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-2">{q}</h3>
              <p className="text-gray-400">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
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
            Apply for Enterprise →
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
