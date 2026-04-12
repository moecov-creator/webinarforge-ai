"use client"

import { useState } from "react"
import Link from "next/link"

const TEMPLATES = [
  { id: "lead-capture", name: "Lead Capture Form", icon: "🎯", desc: "Basic lead gen with name, email, phone", fields: [] as string[] },
  { id: "webinar-registration", name: "Webinar Registration", icon: "🎬", desc: "Register leads for your webinar funnel", fields: ["niche"] },
  { id: "consultation-booking", name: "Consultation Booking", icon: "📅", desc: "Book strategy calls and consultations", fields: ["company", "message"] },
  { id: "early-bird", name: "Early Bird Signup", icon: "🚀", desc: "Capture early bird interest and payments", fields: [] as string[] },
  { id: "contact-us", name: "Contact Us", icon: "✉️", desc: "General contact and inquiry form", fields: ["subject", "message"] },
  { id: "survey", name: "Survey / Quiz", icon: "📊", desc: "Qualify leads with survey questions", fields: ["niche", "revenue", "goal"] },
]

const COLORS = [
  { label: "Purple", value: "#8B5CF6" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Green", value: "#10B981" },
  { label: "Orange", value: "#F97316" },
  { label: "Red", value: "#EF4444" },
  { label: "Pink", value: "#EC4899" },
  { label: "Amber", value: "#F59E0B" },
  { label: "Indigo", value: "#6366F1" },
]

export default function FormsPage() {
  const [step, setStep] = useState(1)
  const [template, setTemplate] = useState(TEMPLATES[0])
  const [bizName, setBizName] = useState("")
  const [bizPhone, setBizPhone] = useState("")
  const [bizWeb, setBizWeb] = useState("")
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [btnText, setBtnText] = useState("Submit")
  const [tyMsg, setTyMsg] = useState("Thank you! We will be in touch shortly.")
  const [collectPhone, setCollectPhone] = useState(true)
  const [requirePhone, setRequirePhone] = useState(false)
  const [smsConsent, setSmsConsent] = useState(true)
  const [redirectUrl, setRedirectUrl] = useState("")
  const [color, setColor] = useState("#8B5CF6")
  const [previewTab, setPreviewTab] = useState("form")
  const [copied, setCopied] = useState(false)
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [niche, setNiche] = useState("")
  const [revenue, setRevenue] = useState("")
  const [goal, setGoal] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [smsCheck, setSmsCheck] = useState(false)
  const [emailCheck, setEmailCheck] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const shortConsent = `By checking this box, you agree to receive SMS messages from ${bizName || "[Business Name]"} (${bizPhone || "[Phone]"}). Reply STOP to opt out. Msg and data rates may apply.`
  const fullConsent = `By providing your phone number and submitting this form, you consent to receive text messages (SMS) from ${bizName || "[Business Name]"} at the number provided. Message and data rates may apply. Message frequency varies. You can opt out at any time by replying STOP to any message. For help, reply HELP or contact us at ${bizPhone || "[Business Phone]"}. Your information will not be shared with third parties. See our Privacy Policy for more details.`

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }

  const embedCode = `<!-- WebinarForge AI Form -->\n<div id="wf-form"></div>\n<script>\n  (function() {\n    var s = document.createElement('script');\n    s.src = 'https://webinarforge.ai/embed/form.js';\n    s.setAttribute('data-form', '${template.id}');\n    s.setAttribute('data-biz', '${bizName}');\n    s.setAttribute('data-color', '${color}');\n    document.getElementById('wf-form').appendChild(s);\n  })();\n</script>`

  const iframeCode = `<iframe src="https://webinarforge.ai/forms/embed/${template.id}?biz=${encodeURIComponent(bizName)}&color=${encodeURIComponent(color)}" width="100%" height="700" frameborder="0" style="border-radius:12px"></iframe>`

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const goBack = () => {
    if (step === 2) setStep(1)
    else if (step === 3) setStep(2)
    else if (step === 4) setStep(3)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-12 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3 text-sm">
            {step > 1 && (
              <button onClick={goBack} className="text-gray-500 hover:text-white transition">Back</button>
            )}
            <div className="flex items-center gap-2 text-gray-500">
              {["Select", "Configure", "Preview", "Embed"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={step === i + 1 ? "text-purple-400 font-bold" : "text-gray-600"}>{i + 1}. {s}</span>
                  {i < 3 && <span className="text-gray-700">{">"}</span>}
                </div>
              ))}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">Custom Form Builder</h1>
          <p className="text-gray-400">A2P compliant forms with SMS consent — ready to embed anywhere</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
            <p className="text-gray-400 mb-8">All templates include A2P compliant SMS consent language built in.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {TEMPLATES.map((t) => (
                <div key={t.id} onClick={() => { setTemplate(t); setTitle(t.name); setStep(2) }}
                  className="bg-white/5 border border-white/10 hover:border-purple-500 rounded-2xl p-6 cursor-pointer transition hover:bg-white/10">
                  <div className="text-4xl mb-3">{t.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{t.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{t.desc}</p>
                  <p className="text-xs text-green-400">✅ A2P SMS Compliant</p>
                </div>
              ))}
              <div onClick={() => { setTemplate({ id: "custom", name: "Custom Form", icon: "⚙️", desc: "Build your own", fields: [] }); setTitle("Custom Form"); setStep(2) }}
                className="border-2 border-dashed border-white/10 hover:border-purple-500 rounded-2xl p-6 cursor-pointer transition flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-white">
                <span className="text-4xl">+</span>
                <span className="font-semibold">Build Custom Form</span>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3">What is A2P 10DLC Compliance?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <p className="text-gray-300 text-sm">
                  A2P (Application-to-Person) 10DLC is the industry standard for businesses sending text messages.
                  All businesses texting US consumers must obtain proper consent. Our forms include all required
                  TCPA compliant language automatically.
                </p>
                <div className="space-y-1">
                  {["TCPA compliant consent language", "Clear opt-in checkbox required", "Business name and phone disclosed", "STOP opt-out instructions included", "Msg and data rates notice included", "No third-party sharing disclosed", "Consent is never pre-checked", "Privacy policy link included"].map((item) => (
                    <p key={item} className="text-sm text-gray-300">✅ {item}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h2 className="text-2xl font-bold">Configure Your Form</h2>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-purple-400">Business Info (Required for A2P)</h3>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Business Name *</label>
                  <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="WebinarForge AI"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Business Phone *</label>
                  <input type="tel" value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} placeholder="+1 (555) 000-0000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition" />
                  <p className="text-xs text-gray-600 mt-1">Appears in SMS consent text for A2P compliance</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Website</label>
                  <input type="url" value={bizWeb} onChange={(e) => setBizWeb(e.target.value)} placeholder="https://webinarforge.ai"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-purple-400">Form Content</h3>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Form Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Get Your Free Consultation"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Subtitle</label>
                  <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Fill out the form below and we will be in touch."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Button Text</label>
                  <input type="text" value={btnText} onChange={(e) => setBtnText(e.target.value)} placeholder="Submit"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Thank You Message</label>
                  <textarea value={tyMsg} onChange={(e) => setTyMsg(e.target.value)} rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition resize-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Redirect URL (optional)</label>
                  <input type="url" value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} placeholder="https://webinarforge.ai/thank-you"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-purple-400">Phone and SMS Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Collect Phone Number</p>
                    <p className="text-xs text-gray-500">Include phone field on form</p>
                  </div>
                  <button onClick={() => setCollectPhone(!collectPhone)}
                    className={`w-12 h-6 rounded-full transition-colors ${collectPhone ? "bg-purple-600" : "bg-white/10"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${collectPhone ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
                {collectPhone && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">Require Phone</p>
                        <p className="text-xs text-gray-500">Make it mandatory</p>
                      </div>
                      <button onClick={() => setRequirePhone(!requirePhone)}
                        className={`w-12 h-6 rounded-full transition-colors ${requirePhone ? "bg-purple-600" : "bg-white/10"}`}>
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${requirePhone ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">SMS Consent Checkbox</p>
                        <p className="text-xs text-gray-500">A2P compliant opt-in (Recommended)</p>
                      </div>
                      <button onClick={() => setSmsConsent(!smsConsent)}
                        className={`w-12 h-6 rounded-full transition-colors ${smsConsent ? "bg-green-600" : "bg-white/10"}`}>
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${smsConsent ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
                    </div>
                    {smsConsent && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                        <p className="text-xs text-green-400 font-bold mb-1">A2P Compliance Preview</p>
                        <p className="text-xs text-gray-400">{shortConsent}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-purple-400 mb-3">Brand Color</h3>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button key={c.value} onClick={() => setColor(c.value)} title={c.label}
                      className={`w-10 h-10 rounded-full border-4 transition ${color === c.value ? "border-white scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c.value }} />
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(3)} disabled={!bizName || !bizPhone}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed">
                Preview My Form
              </button>
              {(!bizName || !bizPhone) && (
                <p className="text-xs text-red-400 text-center">Business name and phone are required for A2P compliance</p>
              )}
            </div>

            <div className="lg:sticky lg:top-4 h-fit">
              <p className="text-xs text-gray-500 uppercase font-bold mb-3">Live Preview</p>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden" style={{ borderTopColor: color, borderTopWidth: 4 }}>
                <div className="p-5 text-center border-b border-white/10">
                  <h2 className="text-xl font-black text-white mb-1">{title || template.name}</h2>
                  <p className="text-gray-400 text-sm">{subtitle || "Fill out the form below."}</p>
                </div>
                <div className="p-5 space-y-3 opacity-50">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-white/5 border border-white/10 rounded-xl" />
                    <div className="h-10 bg-white/5 border border-white/10 rounded-xl" />
                  </div>
                  <div className="h-10 bg-white/5 border border-white/10 rounded-xl" />
                  {collectPhone && <div className="h-10 bg-white/5 border border-white/10 rounded-xl" />}
                  {smsConsent && collectPhone && <div className="h-16 bg-white/5 border border-white/10 rounded-xl" />}
                  <div className="h-12 rounded-xl" style={{ backgroundColor: color }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Preview Your Form</h2>
                <p className="text-gray-400 text-sm">Test your form before embedding.</p>
              </div>
              <button onClick={() => setStep(4)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition">
                Get Embed Code
              </button>
            </div>

            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
              <button onClick={() => setPreviewTab("form")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${previewTab === "form" ? "bg-purple-600 text-white" : "text-gray-400"}`}>
                Form
              </button>
              <button onClick={() => setPreviewTab("compliance")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${previewTab === "compliance" ? "bg-purple-600 text-white" : "text-gray-400"}`}>
                Compliance Text
              </button>
            </div>

            {previewTab === "form" && (
              <div className="max-w-lg">
                {submitted ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="text-2xl font-black mb-2">{tyMsg}</h3>
                    <p className="text-gray-400 text-sm mb-4">This is what your leads see after submitting.</p>
                    <button onClick={() => setSubmitted(false)} className="text-sm text-purple-400 underline">Reset form</button>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden" style={{ borderTopColor: color, borderTopWidth: 4 }}>
                    <div className="p-6 text-center border-b border-white/10">
                      <h2 className="text-2xl font-black text-white mb-1">{title || template.name}</h2>
                      <p className="text-gray-400 text-sm">{subtitle || "Fill out the form below and we will be in touch."}</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">First Name *</label>
                          <input type="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="John"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Last Name *</label>
                          <input type="text" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Smith"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Email Address *</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition" />
                      </div>
                      {collectPhone && (
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">
                            Phone Number {requirePhone ? "*" : "(optional)"}
                          </label>
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition" />
                        </div>
                      )}
                      {template.fields.includes("company") && (
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Company Name</label>
                          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your Company LLC"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition" />
                        </div>
                      )}
                      {template.fields.includes("niche") && (
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Your Niche</label>
                          <select value={niche} onChange={(e) => setNiche(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition">
                            <option value="">Select your niche...</option>
                            <option value="coaching">Coaching</option>
                            <option value="consulting">Consulting</option>
                            <option value="saas">SaaS</option>
                            <option value="real-estate">Real Estate</option>
                            <option value="agency">Agency</option>
                            <option value="health">Health and Wellness</option>
                            <option value="finance">Finance</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      )}
                      {template.fields.includes("revenue") && (
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Monthly Revenue</label>
                          <select value={revenue} onChange={(e) => setRevenue(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition">
                            <option value="">Select range...</option>
                            <option value="0-1k">$0 - $1,000</option>
                            <option value="1k-5k">$1,000 - $5,000</option>
                            <option value="5k-10k">$5,000 - $10,000</option>
                            <option value="10k-50k">$10,000 - $50,000</option>
                            <option value="50k+">$50,000+</option>
                          </select>
                        </div>
                      )}
                      {template.fields.includes("goal") && (
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Primary Goal</label>
                          <select value={goal} onChange={(e) => setGoal(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition">
                            <option value="">Select your goal...</option>
                            <option value="more-leads">Generate more leads</option>
                            <option value="close-clients">Close more clients</option>
                            <option value="automate-sales">Automate my sales</option>
                            <option value="scale-revenue">Scale my revenue</option>
                            <option value="launch-product">Launch a product</option>
                          </select>
                        </div>
                      )}
                      {template.fields.includes("subject") && (
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Subject</label>
                          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help?"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition" />
                        </div>
                      )}
                      {template.fields.includes("message") && (
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Message</label>
                          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your goals..." rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition resize-none" />
                        </div>
                      )}
                      {collectPhone && smsConsent && (
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <input type="checkbox" checked={smsCheck} onChange={(e) => setSmsCheck(e.target.checked)}
                              className="w-4 h-4 mt-0.5 flex-shrink-0 cursor-pointer" style={{ accentColor: color }} />
                            <p className="text-xs text-gray-300 leading-relaxed">{shortConsent}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={emailCheck} onChange={(e) => setEmailCheck(e.target.checked)}
                          className="w-4 h-4 mt-0.5 flex-shrink-0 cursor-pointer" style={{ accentColor: color }} />
                        <label className="text-xs text-gray-400 cursor-pointer">
                          I agree to receive emails from {bizName || "[Business Name]"}. I can unsubscribe at any time.
                        </label>
                      </div>
                      <button onClick={handleSubmit} disabled={submitting}
                        className="w-full font-black py-4 rounded-xl text-base transition disabled:opacity-50 flex items-center justify-center gap-2 text-black"
                        style={{ backgroundColor: color }}>
                        {submitting ? (
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          btnText || "Submit"
                        )}
                      </button>
                      <p className="text-xs text-gray-600 text-center">
                        Your information is secure and will never be shared with third parties.
                        {bizWeb && (
                          <span> See our <a href={bizWeb + "/privacy"} className="underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {previewTab === "compliance" && (
              <div className="space-y-5 max-w-3xl">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-green-400">Short Consent (Checkbox Label)</h3>
                    <button onClick={() => copy(shortConsent)} className="text-xs border border-white/20 px-3 py-1 rounded-lg hover:border-white/50 transition">
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 bg-black/40 rounded-xl p-4 leading-relaxed">{shortConsent}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-blue-400">Full Compliance Text</h3>
                    <button onClick={() => copy(fullConsent)} className="text-xs border border-white/20 px-3 py-1 rounded-lg hover:border-white/50 transition">
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 bg-black/40 rounded-xl p-4 leading-relaxed">{fullConsent}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold mb-4">A2P Compliance Checklist</h3>
                  <div className="space-y-2">
                    {[
                      { item: "Business name disclosed", check: !!bizName },
                      { item: "Business phone included", check: !!bizPhone },
                      { item: "SMS opt-in checkbox present", check: smsConsent },
                      { item: "STOP opt-out instructions included", check: true },
                      { item: "Message frequency disclosed", check: true },
                      { item: "Msg and data rates notice included", check: true },
                      { item: "Third-party sharing disclosure", check: true },
                      { item: "Phone field on form", check: collectPhone },
                      { item: "Consent is not pre-checked", check: true },
                    ].map(({ item, check }) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className={check ? "text-green-400" : "text-red-400"}>{check ? "✅" : "❌"}</span>
                        <span className={`text-sm ${check ? "text-gray-300" : "text-red-400"}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5">
                  <h3 className="font-bold text-yellow-400 mb-2">Important Legal Notice</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    This form includes A2P 10DLC compliant language as a template. WebinarForge AI recommends
                    consulting with a legal professional to ensure full TCPA compliance for your specific use case.
                    Always keep records of consent obtained through this form.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-2xl font-bold">Embed Your Form</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-green-400 mb-4">Form Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-gray-500 text-xs">Template</p><p className="text-white font-semibold">{template.name}</p></div>
                <div><p className="text-gray-500 text-xs">Business</p><p className="text-white font-semibold">{bizName}</p></div>
                <div><p className="text-gray-500 text-xs">Phone</p><p className="text-white font-semibold">{bizPhone}</p></div>
                <div><p className="text-gray-500 text-xs">SMS Consent</p><p className={smsConsent ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>{smsConsent ? "Enabled" : "Disabled"}</p></div>
                <div><p className="text-gray-500 text-xs">A2P Compliant</p><p className="text-green-400 font-semibold">Yes</p></div>
                <div><p className="text-gray-500 text-xs">Brand Color</p><div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} /><p className="text-white font-semibold">{color}</p></div></div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div><h3 className="font-bold">JavaScript Embed</h3><p className="text-xs text-gray-500">Recommended</p></div>
                <button onClick={() => copy(embedCode)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-sm font-semibold transition">
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <div className="bg-black/60 rounded-xl p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 whitespace-pre-wrap">{embedCode}</pre>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div><h3 className="font-bold">iFrame Embed</h3><p className="text-xs text-gray-500">Simple — works anywhere</p></div>
                <button onClick={() => copy(iframeCode)} className="flex items-center gap-2 border border-white/20 hover:border-white/50 px-4 py-2 rounded-xl text-sm font-semibold transition">
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <div className="bg-black/60 rounded-xl p-4 overflow-x-auto">
                <pre className="text-xs text-blue-400 whitespace-pre-wrap">{iframeCode}</pre>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold mb-4">Where to Add Your Form</h3>
              <div className="space-y-3">
                {[
                  { p: "WordPress", i: "🌐", t: "Paste JS embed in a Custom HTML block" },
                  { p: "ClickFunnels", i: "⚡", t: "Add HTML element and paste iFrame code" },
                  { p: "GoHighLevel", i: "🔥", t: "Use Custom Code element in funnel builder" },
                  { p: "Squarespace", i: "⬛", t: "Add a Code Block and paste iFrame code" },
                  { p: "Wix", i: "🔷", t: "Use the Embed HTML widget" },
                  { p: "Webflow", i: "🌊", t: "Add an Embed component and paste JS code" },
                  { p: "Shopify", i: "🛍️", t: "Edit theme liquid or use Custom HTML section" },
                  { p: "Next.js / React", i: "⚛️", t: "Use dangerouslySetInnerHTML or useEffect" },
                ].map(({ p, i, t }) => (
                  <div key={p} className="flex items-start gap-3 bg-black/40 rounded-xl p-3">
                    <span className="text-xl">{i}</span>
                    <div><p className="font-semibold text-sm">{p}</p><p className="text-xs text-gray-400">{t}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Want Unlimited Forms and Auto-Responders?</h3>
              <p className="text-gray-400 text-sm mb-4">Connect forms to your webinar funnels, CRM, and email sequences automatically.</p>
              <Link href="/pricing">
                <button className="bg-amber-500 hover:bg-amber-400 text-black font-black px-8 py-3 rounded-xl transition">
                  Get Full Access — $49 Early Bird
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
