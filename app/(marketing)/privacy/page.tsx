import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | WebinarForge AI",
  description: "Privacy Policy for WebinarForge AI LLC",
}

const SECTIONS = [
  {
    number: "1",
    title: "Information We Collect",
    content: (
      <>
        <p className="mb-3">We may collect:</p>
        <ul className="space-y-1.5">
          {["Name, email, phone number", "Billing and payment details", "Usage data and analytics"].map((item) => (
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
    number: "2",
    title: "How We Use Information",
    content: (
      <>
        <p className="mb-3">We use your data to:</p>
        <ul className="space-y-1.5">
          {[
            "Provide and improve our services",
            "Process payments",
            "Communicate with users",
            "Enhance user experience",
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
    number: "3",
    title: "Sharing of Information",
    content: (
      <>
        <p className="mb-3 font-semibold text-white">We do NOT sell your personal data.</p>
        <p className="mb-3">We may share information with:</p>
        <ul className="space-y-1.5">
          {["Payment processors (Stripe)", "Service providers (hosting, analytics)"].map((item) => (
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
    number: "4",
    title: "Data Security",
    content: (
      <p>We implement industry-standard measures to protect your information.</p>
    ),
  },
  {
    number: "5",
    title: "Cookies and Tracking",
    content: (
      <p>We use cookies and similar technologies to improve user experience.</p>
    ),
  },
  {
    number: "6",
    title: "User Rights",
    content: (
      <>
        <p className="mb-3">You may request:</p>
        <ul className="space-y-1.5">
          {["Access to your data", "Correction or deletion"].map((item) => (
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
    number: "7",
    title: "Third-Party Services",
    content: (
      <p>We are not responsible for third-party platforms connected to our Service.</p>
    ),
  },
  {
    number: "8",
    title: "Changes to Policy",
    content: (
      <p>We may update this Privacy Policy at any time. Continued use of the Service after changes constitutes acceptance of the updated policy.</p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#09090f] text-white">

      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            🔐 Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-lg">WebinarForge AI, LLC</p>
          <p className="text-gray-600 text-sm mt-2">Last updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-6">
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
                9
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white mb-3">Contact</h2>
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
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              Terms of Service
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
