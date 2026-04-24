import Link from "next/link"

export const metadata = {
  title: "Terms of Service | WebinarForge AI",
  description: "Terms of Service for WebinarForge AI LLC",
}

const SECTIONS = [
  {
    number: "1",
    title: "Acceptance of Terms",
    content: (
      <p>
        By accessing or using WebinarForge AI ("Service"), you agree to be bound by these Terms of
        Service. If you do not agree, you may not use the Service.
      </p>
    ),
  },
  {
    number: "2",
    title: "Description of Service",
    content: (
      <>
        <p className="mb-3">
          WebinarForge AI provides AI-powered software tools, including but not limited to:
        </p>
        <ul className="space-y-1.5 mb-3">
          {[
            "Webinar creation and automation",
            "Funnel generation",
            "Marketing automation systems",
            "AI-generated content and business tools",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5 flex-shrink-0">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>We reserve the right to modify or discontinue any part of the Service at any time.</p>
      </>
    ),
  },
  {
    number: "3",
    title: "Eligibility",
    content: <p>You must be at least 18 years old to use this Service.</p>,
  },
  {
    number: "4",
    title: "User Accounts",
    content: (
      <>
        <p className="mb-3">You are responsible for:</p>
        <ul className="space-y-1.5 mb-3">
          {["Maintaining account security", "All activities under your account"].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5 flex-shrink-0">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>We reserve the right to suspend or terminate accounts for violations.</p>
      </>
    ),
  },
  {
    number: "5",
    title: "Payments and Billing",
    content: (
      <ul className="space-y-1.5">
        {[
          "All payments are processed securely through third-party providers (e.g., Stripe)",
          "Pricing may change at any time",
          "Subscription services will renew automatically unless canceled",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5 flex-shrink-0">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    number: "6",
    title: "Refund Policy",
    content: (
      <>
        <p className="mb-2">All sales are final unless otherwise stated.</p>
        <p>
          Due to the digital nature of our services, we do not guarantee refunds once access has
          been granted.
        </p>
      </>
    ),
  },
  {
    number: "7",
    title: "Acceptable Use",
    content: (
      <>
        <p className="mb-3">You agree NOT to:</p>
        <ul className="space-y-1.5">
          {[
            "Use the platform for illegal activities",
            "Violate intellectual property rights",
            "Attempt to hack, disrupt, or exploit the system",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: "8",
    title: "Intellectual Property",
    content: (
      <>
        <p className="mb-2">
          All content, software, and materials are owned by WebinarForge AI LLC.
        </p>
        <p>You are granted a limited, non-transferable license to use the Service.</p>
      </>
    ),
  },
  {
    number: "9",
    title: "Disclaimer of Warranties",
    content: (
      <>
        <p className="mb-3">The Service is provided "as is" without warranties of any kind.</p>
        <p className="mb-2">We do not guarantee:</p>
        <ul className="space-y-1.5">
          {["Specific financial results", "Lead generation outcomes", "Business success"].map(
            (item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5 flex-shrink-0">▸</span>
                <span>{item}</span>
              </li>
            )
          )}
        </ul>
      </>
    ),
  },
  {
    number: "10",
    title: "Limitation of Liability",
    content: (
      <>
        <p className="mb-3">WebinarForge AI LLC shall not be liable for:</p>
        <ul className="space-y-1.5">
          {[
            "Indirect or consequential damages",
            "Loss of revenue or data",
            "Business interruption",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5 flex-shrink-0">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: "11",
    title: "Termination",
    content: (
      <p>
        We may suspend or terminate access at any time for violations of these Terms.
      </p>
    ),
  },
  {
    number: "12",
    title: "Governing Law",
    content: (
      <p>These Terms are governed by the laws of the State of Texas.</p>
    ),
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#09090f] text-white">

      {/* Header */}
      <div className="border-b border-white/5 bg-[#09090f]">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            📄 Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-lg">WebinarForge AI, LLC</p>
          <p className="text-gray-600 text-sm mt-2">Last updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <div
              key={section.number}
              className="bg-white/3 border border-white/8 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 font-black text-sm flex-shrink-0">
                  {section.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white mb-3">{section.title}</h2>
                  <div className="text-gray-400 leading-relaxed text-sm">
                    {section.content}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Contact section */}
          <div className="bg-purple-500/8 border border-purple-500/25 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 font-black text-sm flex-shrink-0">
                13
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white mb-3">Contact Information</h2>
                <div className="text-gray-400 text-sm space-y-1 leading-relaxed">
                  <p className="font-semibold text-white">WebinarForge AI, LLC</p>
                  <p>19179 Blanco Rd Ste 105 PMB 1036</p>
                  <p>San Antonio, TX 78258</p>
                  <p className="mt-2">
                    Email:{" "}
                    <a
                      href="mailto:support@webinarforge.ai"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      support@webinarforge.ai
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>© 2026 WebinarForge AI, LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-gray-400 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

    </main>
  )
}
