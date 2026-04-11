"use client"

export default function FormPreview({
  formData,
  selectedTemplate,
  submission,
  setSubmission,
  submitted,
  submitting,
  onSubmit,
  a2pText,
  preview,
}: {
  formData: {
    businessName: string
    businessPhone: string
    businessWebsite: string
    templateId: string
    formTitle: string
    formSubtitle: string
    buttonText: string
    thankYouMessage: string
    collectPhone: boolean
    requirePhone: boolean
    smsConsent: boolean
    redirectUrl: string
    primaryColor: string
  }
  selectedTemplate: {
    id: string
    name: string
    icon: string
    desc: string
    fields: string[]
  }
  submission: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
    niche: string
    revenue: string
    goal: string
    subject: string
    message: string
    smsConsent: boolean
    emailConsent: boolean
  }
  setSubmission: (s: any) => void
  submitted: boolean
  submitting: boolean
  onSubmit: () => void
  a2pText: string
  preview: boolean
}) {
  return (
    <div
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
      style={{ borderTopColor: formData.primaryColor, borderTopWidth: 4 }}
    >
      <div className="p-6 text-center border-b border-white/10">
        <h2 className="text-2xl font-black text-white mb-1">
          {formData.formTitle || selectedTemplate.name}
        </h2>
        <p className="text-gray-400 text-sm">
          {formData.formSubtitle || "Fill out the form below and we will be in touch shortly."}
        </p>
      </div>

      <div className="p-6 space-y-4">

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">First Name *</label>
            <input
              type="text"
              value={submission.firstName}
              onChange={(e) => setSubmission({ ...submission, firstName: e.target.value })}
              placeholder="John"
              disabled={preview}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Last Name *</label>
            <input
              type="text"
              value={submission.lastName}
              onChange={(e) => setSubmission({ ...submission, lastName: e.target.value })}
              placeholder="Smith"
              disabled={preview}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Email Address *</label>
          <input
            type="email"
            value={submission.email}
            onChange={(e) => setSubmission({ ...submission, email: e.target.value })}
            placeholder="john@example.com"
            disabled={preview}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition disabled:opacity-60"
          />
        </div>

        {formData.collectPhone && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Phone Number {formData.requirePhone ? "*" : "(optional)"}
            </label>
            <input
              type="tel"
              value={submission.phone}
              onChange={(e) => setSubmission({ ...submission, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              disabled={preview}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition disabled:opacity-60"
            />
          </div>
        )}

        {selectedTemplate.fields.includes("company") && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Company Name</label>
            <input
              type="text"
              value={submission.company}
              onChange={(e) => setSubmission({ ...submission, company: e.target.value })}
              placeholder="Your Company LLC"
              disabled={preview}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition disabled:opacity-60"
            />
          </div>
        )}

        {selectedTemplate.fields.includes("niche") && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Your Niche / Industry</label>
            <select
              value={submission.niche}
              onChange={(e) => setSubmission({ ...submission, niche: e.target.value })}
              disabled={preview}
              className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition disabled:opacity-60"
            >
              <option value="">Select your niche...</option>
              <option value="coaching">Coaching</option>
              <option value="consulting">Consulting</option>
              <option value="saas">SaaS</option>
              <option value="real-estate">Real Estate</option>
              <option value="agency">Agency</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="health">Health and Wellness</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {selectedTemplate.fields.includes("revenue") && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Current Monthly Revenue</label>
            <select
              value={submission.revenue}
              onChange={(e) => setSubmission({ ...submission, revenue: e.target.value })}
              disabled={preview}
              className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition disabled:opacity-60"
            >
              <option value="">Select range...</option>
              <option value="0-1k">$0 - $1,000</option>
              <option value="1k-5k">$1,000 - $5,000</option>
              <option value="5k-10k">$5,000 - $10,000</option>
              <option value="10k-50k">$10,000 - $50,000</option>
              <option value="50k+">$50,000+</option>
            </select>
          </div>
        )}

        {selectedTemplate.fields.includes("goal") && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Your Primary Goal</label>
            <select
              value={submission.goal}
              onChange={(e) => setSubmission({ ...submission, goal: e.target.value })}
              disabled={preview}
              className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition disabled:opacity-60"
            >
              <option value="">Select your goal...</option>
              <option value="more-leads">Generate more leads</option>
              <option value="close-clients">Close more clients</option>
              <option value="automate-sales">Automate my sales</option>
              <option value="scale-revenue">Scale my revenue</option>
              <option value="launch-product">Launch a product</option>
            </select>
          </div>
        )}

        {selectedTemplate.fields.includes("subject") && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Subject</label>
            <input
              type="text"
              value={submission.subject}
              onChange={(e) => setSubmission({ ...submission, subject: e.target.value })}
              placeholder="How can we help you?"
              disabled={preview}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition disabled:opacity-60"
            />
          </div>
        )}

        {selectedTemplate.fields.includes("message") && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Message</label>
            <textarea
              value={submission.message}
              onChange={(e) => setSubmission({ ...submission, message: e.target.value })}
              placeholder="Tell us more about your goals..."
              rows={3}
              disabled={preview}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition resize-none disabled:opacity-60"
            />
          </div>
        )}

        {formData.collectPhone && formData.smsConsent && (
          <div className="bg-black/40 border border-white/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={submission.smsConsent}
                  onChange={(e) => setSubmission({ ...submission, smsConsent: e.target.checked })}
                  disabled={preview}
                  className="w-4 h-4 rounded border-gray-600 cursor-pointer"
                  style={{ accentColor: formData.primaryColor }}
                />
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {a2pText}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={submission.emailConsent}
            onChange={(e) => setSubmission({ ...submission, emailConsent: e.target.checked })}
            disabled={preview}
            className="w-4 h-4 mt-0.5 rounded border-gray-600 cursor-pointer flex-shrink-0"
            style={{ accentColor: formData.primaryColor }}
          />
          <label className="text-xs text-gray-400 cursor-pointer">
            I agree to receive emails from {formData.businessName || "[Business Name]"}.
            I can unsubscribe at any time.
          </label>
        </div>

        <button
          onClick={preview ? undefined : onSubmit}
          disabled={preview || submitting}
          className="w-full font-black py-4 rounded-xl text-base transition disabled:opacity-50 flex items-center justify-center gap-2 text-black"
          style={{ backgroundColor: formData.primaryColor }}
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            formData.buttonText || "Submit"
          )}
        </button>

        <p className="text-xs text-gray-600 text-center">
          Your information is secure and will never be shared with third parties.
          {formData.businessWebsite && (
            <span>
              {" "}See our{" "}
              
                href={formData.businessWebsite + "/privacy"}
                className="underline hover:text-gray-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>.
            </span>
          )}
        </p>

      </div>
    </div>
  )
}
