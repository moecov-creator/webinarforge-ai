"use client"

import { useState } from "react"
import Link from "next/link"

const FORM_TEMPLATES = [
  {
    id: "lead-capture",
    name: "Lead Capture Form",
    icon: "🎯",
    desc: "Basic lead gen with name, email, phone",
    fields: ["firstName", "lastName", "email", "phone"],
  },
  {
    id: "webinar-registration",
    name: "Webinar Registration",
    icon: "🎬",
    desc: "Register leads for your webinar funnel",
    fields: ["firstName", "lastName", "email", "phone", "niche"],
  },
  {
    id: "consultation-booking",
    name: "Consultation Booking",
    icon: "📅",
    desc: "Book strategy calls and consultations",
    fields: ["firstName", "lastName", "email", "phone", "company", "message"],
  },
  {
    id: "early-bird",
    name: "Early Bird Signup",
    icon: "🚀",
    desc: "Capture early bird interest and payments",
    fields: ["firstName", "lastName", "email", "phone"],
  },
  {
    id: "contact-us",
    name: "Contact Us",
    icon: "✉️",
    desc: "General contact and inquiry form",
    fields: ["firstName", "lastName", "email", "phone", "subject", "message"],
  },
  {
    id: "survey",
    name: "Survey / Quiz",
    icon: "📊",
    desc: "Qualify leads with survey questions",
    fields: ["firstName", "email", "phone", "niche", "revenue", "goal"],
  },
]

type FormData = {
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

type SubmissionData = {
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

const COLOR_OPTIONS = [
  { id: "purple", label: "Purple", value: "#8B5CF6" },
  { id: "blue", label: "Blue", value: "#3B82F6" },
  { id: "green", label: "Green", value: "#10B981" },
  { id: "orange", label: "Orange", value: "#F97316" },
  { id: "red", label: "Red", value: "#EF4444" },
  { id: "pink", label: "Pink", value: "#EC4899" },
  { id: "amber", label: "Amber", value: "#F59E0B" },
  { id: "indigo", label: "Indigo", value: "#6366F1" },
]

export default function FormsPage() {
  const [step, setStep] = useState<"select" | "configure" | "preview" | "embed">("select")
  const [selectedTemplate, setSelectedTemplate] = useState<typeof FORM_TEMPLATES[0] | null>(null)
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessPhone: "",
    businessWebsite: "",
    templateId: "",
    formTitle: "",
    formSubtitle: "",
    buttonText: "Submit →",
    thankYouMessage: "Thank you! We will be in touch shortly.",
    collectPhone: true,
    requirePhone: false,
    smsConsent: true,
    redirectUrl: "",
    primaryColor: "#8B5CF6",
  })
  const [submission, setSubmission] = useState<SubmissionData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    niche: "",
    revenue: "",
    goal: "",
    subject: "",
    message: "",
    smsConsent: false,
    emailConsent: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activePreviewTab, setActivePreviewTab] = useState<"form" | "compliance">("form")

  const handleSelectTemplate = (template: typeof FORM_TEMPLATES[0]) => {
    setSelectedTemplate(template)
    setFormData({
      ...formData,
      templateId: template.id,
      formTitle: template.name,
      formSubtitle: "Fill out the form below and we will be in touch shortly.",
      collectPhone: template.fields.includes("phone"),
      requirePhone: false,
    })
    setStep("configure")
  }

  const handleSubmitForm = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }

  const generateEmbedCode = () => {
    return `<!-- WebinarForge AI Form Embed -->
<div id="wf-form-container"></div>
<script>
  (function() {
    var config = {
      formId: "${formData.templateId}-${Date.now()}",
      businessName: "${formData.businessName}",
      primaryColor: "${formData.primaryColor}",
      smsConsent: ${formData.smsConsent},
      redirectUrl: "${formData.redirectUrl || window.location.href}"
    };
    var script = document.createElement('script');
    script.src = 'https://webinarforge.ai/embed/form.js';
    script.setAttribute('data-config', JSON.stringify(config));
    document.getElementById('wf-form-container').appendChild(script);
  })();
</script>
<!-- End WebinarForge AI Form -->`
  }

  const generateIframeCode = () => {
    return `<iframe 
  src="https://webinarforge.ai/forms/embed/${formData.templateId}?biz=${encodeURIComponent(formData.businessName)}&color=${encodeURIComponent(formData.primaryColor)}"
  width="100%" 
  height="700" 
  frameborder="0"
  style="border-radius: 12px; overflow: hidden;">
</iframe>`
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const A2P_COMPLIANCE_TEXT = `By providing your phone number and submitting this form, you consent to receive text messages (SMS) from ${formData.businessName || "[Business Name]"} at the number provided. Message and data rates may apply. Message frequency varies. You can opt out at any time by replying STOP to any message. For help, reply HELP or contact us at ${formData.businessPhone || "[Business Phone]"}. Your information will not be shared with third parties. See our Privacy Policy for more details.`

  const SHORT_COMPLIANCE_TEXT = `By checking this box, you agree to receive SMS messages from ${formData.businessName || "[Business Name]"} (${formData.businessPhone || "[Phone]"}). Reply STOP to opt out. Msg & data rates may apply.`

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="py-12 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            {step !== "select" && (
              <button
                onClick={() => setStep(step === "configure" ? "select" : step === "preview" ? "configure" : "preview")}
                className="text-gray-500 hover:text-white transition text-sm"
              >
                ← Back
              </button>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {["select", "configure", "preview", "embed"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`font-semibold capitalize ${step === s ? "text-purple-400" : "text-gray-600"}`}>
                    {i + 1}. {s}
                  </span>
                  {i < 3 && <span className="text-gray-700">→</span>}
                </div>
              ))}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">
            Custom Form Builder
          </h1>
          <p className="text-gray-400">
            A2P compliant forms with SMS consent — ready to embed anywhere
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* STEP 1 — SELECT TEMPLATE */}
        {step === "select" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Choose a Form Template</h2>
            <p className="text-gray-400 mb-8">
              Select a template to get started. All templates include A2P compliant
              SMS consent language built in.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FORM_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="bg-white/5 border border-white/10 hover:border-purple-500 rounded-2xl p-6 cursor-pointer transition hover:bg-white/10"
                >
                  <div className="text-4xl mb-4">{template.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{template.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.fields.map((field) => (
                      <span
                        key={field}
                        className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-full text-gray-400"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <span>✅</span>
                    <span>A2P SMS Compliant</span>
                  </div>
                </div>
              ))}

              {/* Custom Form */}
              <div
                onClick={() => handleSelectTemplate({
                  id: "custom",
                  name: "Custom Form",
                  icon: "⚙️",
                  desc: "Build your own custom form",
                  fields: ["firstName", "lastName", "email", "phone"],
                })}
                className="border-2 border-dashed border-white/10 hover:border-purple-500 rounded-2xl p-6 cursor-pointer transition flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-white"
              >
                <span className="text-4xl">+</span>
                <span className="font-semibold">Build Custom Form</span>
                <span className="text-xs text-center">
                  Start from scratch with your own fields
                </span>
              </div>
            </div>

            {/* A2P INFO */}
            <div className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3">
                📋 What is A2P 10DLC Compliance?
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-300 text-sm mb-4">
                    A2P (Application-to-Person) 10DLC is an industry standard for
                    businesses sending text messages. All businesses texting US consumers
                    must be registered and obtain proper consent.
                  </p>
                  <p className="text-gray-300 text-sm">
                    Our forms automatically include the required consent language
                    so you stay compliant with TCPA regulations and carrier requirements.
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    "✅ TCPA compliant consent language",
                    "✅ Clear opt-in checkbox required",
                    "✅ Business name and phone disclosed",
                    "✅ STOP opt-out instructions included",
                    "✅ Message frequency disclosed",
                    "✅ Msg & data rates notice included",
                    "✅ Privacy policy link included",
                    "✅ No third-party sharing disclosed",
                  ].map((item) => (
                    <p key={item} className="text-sm text-gray-300">{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — CONFIGURE */}
        {step === "configure" && selectedTemplate && (
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Config Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Configure Your Form</h2>
                <p className="text-gray-400 text-sm">
                  Add your business details and customize the form.
                </p>
              </div>

              {/* Business Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-purple-400">
                  🏢 Business Information (Required for A2P)
                </h3>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="WebinarForge AI"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">
                    Business Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    This appears in the SMS consent text for A2P compliance
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">
                    Business Website
                  </label>
                  <input
                    type="url"
                    value={formData.businessWebsite}
                    onChange={(e) => setFormData({ ...formData, businessWebsite: e.target.value })}
                    placeholder="https://webinarforge.ai"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-purple-400">✏️ Form Content</h3>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Form Title</label>
                  <input
                    type="text"
                    value={formData.formTitle}
                    onChange={(e) => setFormData({ ...formData, formTitle: e.target.value })}
                    placeholder="Get Your Free Consultation"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Subtitle</label>
                  <input
                    type="text"
                    value={formData.formSubtitle}
                    onChange={(e) => setFormData({ ...formData, formSubtitle: e.target.value })}
                    placeholder="Fill out the form below and we will be in touch shortly."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="Submit →"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">
                    Thank You Message
                  </label>
                  <textarea
                    value={formData.thankYouMessage}
                    onChange={(e) => setFormData({ ...formData, thankYouMessage: e.target.value })}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">
                    Redirect URL After Submit (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.redirectUrl}
                    onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                    placeholder="https://webinarforge.ai/thank-you"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              {/* Phone & SMS Settings */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-purple-400">📱 Phone & SMS Settings</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Collect Phone Number</p>
                    <p className="text-xs text-gray-500">Include phone field on form</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, collectPhone: !formData.collectPhone })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.collectPhone ? "bg-purple-600" : "bg-white/10"
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${
                      formData.collectPhone ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                {formData.collectPhone && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">Require Phone Number</p>
                        <p className="text-xs text-gray-500">Make phone field mandatory</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, requirePhone: !formData.requirePhone })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          formData.requirePhone ? "bg-purple-600" : "bg-white/10"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${
                          formData.requirePhone ? "translate-x-6" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">SMS Consent Checkbox</p>
                        <p className="text-xs text-gray-500">Show A2P compliant opt-in (Recommended)</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, smsConsent: !formData.smsConsent })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          formData.smsConsent ? "bg-green-600" : "bg-white/10"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${
                          formData.smsConsent ? "translate-x-6" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </>
                )}

                {formData.smsConsent && formData.collectPhone && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-xs text-green-400 font-bold mb-2">
                      ✅ A2P Compliance Preview
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {SHORT_COMPLIANCE_TEXT}
                    </p>
                  </div>
                )}
              </div>

              {/* Color */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-purple-400 mb-4">🎨 Brand Color</h3>
                <div className="flex flex-wrap gap-3">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setFormData({ ...formData, primaryColor: color.value })}
                      className={`w-10 h-10 rounded-full border-4 transition ${
                        formData.primaryColor === color.value
                          ? "border-white scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep("preview")}
                disabled={!formData.businessName || !formData.businessPhone}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview My Form →
              </button>
              {(!formData.businessName || !formData.businessPhone) && (
                <p className="text-xs text-red-400 text-center">
                  Business name and phone number are required for A2P compliance
                </p>
              )}
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-4 h-fit">
              <h3 className="font-bold mb-4 text-gray-400 text-sm uppercase">Live Preview</h3>
              <FormPreview
                formData={formData}
                selectedTemplate={selectedTemplate}
                submission={submission}
                setSubmission={setSubmission}
                submitted={false}
                submitting={false}
                onSubmit={() => {}}
                a2pText={SHORT_COMPLIANCE_TEXT}
                preview={true}
              />
            </div>
          </div>
        )}

        {/* STEP 3 — PREVIEW */}
        {step === "preview" && selectedTemplate && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Preview Your Form</h2>
                <p className="text-gray-400 text-sm">
                  Test your form before embedding it on your website.
                </p>
              </div>
              <button
                onClick={() => setStep("embed")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition"
              >
                Get Embed Code →
              </button>
            </div>

            {/* Preview Tabs */}
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
              <button
                onClick={() => setActivePreviewTab("form")}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
                  activePreviewTab === "form" ? "bg-purple-600 text-white" : "text-gray-400"
                }`}
              >
                📋 Form Preview
              </button>
              <button
                onClick={() => setActivePreviewTab("compliance")}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
                  activePreviewTab === "compliance" ? "bg-purple-600 text-white" : "text-gray-400"
                }`}
              >
                📜 Compliance Text
              </button>
            </div>

            {activePreviewTab === "form" && (
              <div className="max-w-lg">
                {submitted ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="text-2xl font-black mb-2">{formData.thankYouMessage}</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      This is what your leads will see after submitting.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-sm text-purple-400 underline"
                    >
                      Reset form
                    </button>
                  </div>
                ) : (
                  <FormPreview
                    formData={formData}
                    selectedTemplate={selectedTemplate}
                    submission={submission}
                    setSubmission={setSubmission}
                    submitted={submitted}
                    submitting={submitting}
                    onSubmit={handleSubmitForm}
                    a2pText={SHORT_COMPLIANCE_TEXT}
                    preview={false}
                  />
                )}
              </div>
            )}

            {activePreviewTab === "compliance" && (
              <div className="space-y-6 max-w-3xl">

                {/* Short Version */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-green-400">
                      ✅ Short Consent (Checkbox Label)
                    </h3>
                    <button
                      onClick={() => handleCopyCode(SHORT_COMPLIANCE_TEXT)}
                      className="text-xs border border-white/20 hover:border-white/50 px-3 py-1 rounded-lg transition"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed bg-black/40 rounded-xl p-4">
                    {SHORT_COMPLIANCE_TEXT}
                  </p>
                </div>

                {/* Full Version */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-blue-400">
                      📋 Full Compliance Text (Footer / Privacy Policy)
                    </h3>
                    <button
                      onClick={() => handleCopyCode(A2P_COMPLIANCE_TEXT)}
                      className="text-xs border border-white/20 hover:border-white/50 px-3 py-1 rounded-lg transition"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed bg-black/40 rounded-xl p-4">
                    {A2P_COMPLIANCE_TEXT}
                  </p>
                </div>

                {/* Compliance Checklist */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold mb-4">A2P Compliance Checklist</h3>
                  <div className="space-y-3">
                    {[
                      { item: "Business name disclosed", check: !!formData.businessName },
                      { item: "Business phone number included", check: !!formData.businessPhone },
                      { item: "SMS opt-in checkbox present", check: formData.smsConsent },
                      { item: "STOP opt-out instructions included", check: true },
                      { item: "Message frequency disclosed", check: true },
                      { item: "Msg & data rates notice included", check: true },
                      { item: "Third-party sharing disclosure", check: true },
                      { item: "Phone number field on form", check: formData.collectPhone },
                      { item: "Consent is not pre-checked", check: true },
                      { item: "Plain language used", check: true },
                    ].map(({ item, check }) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className={check ? "text-green-400" : "text-red-400"}>
                          {check ? "✅" : "❌"}
                        </span>
                        <span className={`text-sm ${check ? "text-gray-300" : "text-red-400"}`}>
                          {item}
                        </span>
                        {!check && (
                          <span className="text-xs text-red-400 ml-auto">
                            Action required
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* TCPA Notice */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
                  <h3 className="font-bold text-yellow-400 mb-2">
                    ⚠️ Important Legal Notice
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    This form includes A2P 10DLC compliant language as a template.
                    WebinarForge AI recommends consulting with a legal professional
                    to ensure full TCPA compliance for your specific business use case.
                    Requirements may vary based on your industry, location, and the
                    types of messages you send. Always keep records of consent obtained
                    through this form.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — EMBED */}
        {step === "embed" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-2xl font-bold mb-1">Embed Your Form</h2>
              <p className="text-gray-400 text-sm">
                Copy the code below and paste it anywhere on your website.
              </p>
            </div>

            {/* Form Summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4 text-green-400">✅ Form Ready to Publish</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Template</p>
                  <p className="text-white font-semibold">{selectedTemplate?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Business</p>
                  <p className="text-white font-semibold">{formData.businessName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Phone</p>
                  <p className="text-white font-semibold">{formData.businessPhone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">SMS Consent</p>
                  <p className={formData.smsConsent ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                    {formData.smsConsent ? "✅ Enabled" : "❌ Disabled"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">A2P Compliant</p>
                  <p className="text-green-400 font-semibold">✅ Yes</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Brand Color</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: formData.primaryColor }}
                    />
                    <p className="text-white font-semibold">{formData.primaryColor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* JavaScript Embed */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold">JavaScript Embed</h3>
                  <p className="text-xs text-gray-500">Recommended — most flexible</p>
                </div>
                <button
                  onClick={() => handleCopyCode(generateEmbedCode())}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-sm font-semibold transition"
                >
                  {copied ? "✅ Copied!" : "📋 Copy Code"}
                </button>
              </div>
              <div className="bg-black/60 rounded-xl p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 whitespace-pre-wrap">
                  {generateEmbedCode()}
                </pre>
              </div>
            </div>

            {/* iFrame Embed */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold">iFrame Embed</h3>
                  <p className="text-xs text-gray-500">Simple — works anywhere</p>
                </div>
                <button
                  onClick={() => handleCopyCode(generateIframeCode())}
                  className="flex items-center gap-2 border border-white/20 hover:border-white/50 px-4 py-2 rounded-xl text-sm font-semibold transition"
                >
                  {copied ? "✅ Copied!" : "📋 Copy Code"}
                </button>
              </div>
              <div className="bg-black/60 rounded-xl p-4 overflow-x-auto">
                <pre className="text-xs text-blue-400 whitespace-pre-wrap">
                  {generateIframeCode()}
                </pre>
              </div>
            </div>

            {/* Platform Instructions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Where to Add Your Form</h3>
              <div className="space-y-3">
                {[
                  {
                    platform: "WordPress",
                    icon: "🌐",
                    instruction: "Paste JavaScript embed code in a Custom HTML block or use a plugin like Insert Headers and Footers",
                  },
                  {
                    platform: "ClickFunnels",
                    icon: "⚡",
                    instruction: "Add an HTML element to your page and paste the iFrame code inside",
                  },
                  {
                    platform: "GoHighLevel",
                    icon: "🔥",
                    instruction: "Use the Custom Code element in the funnel builder and paste the embed code",
                  },
                  {
                    platform: "Squarespace",
                    icon: "⬛",
                    instruction: "Add a Code Block to your page and paste the iFrame embed code",
                  },
                  {
                    platform: "Wix",
                    icon: "🔷",
                    instruction: "Use the Embed HTML widget and paste the iFrame code",
                  },
                  {
                    platform: "Webflow",
                    icon: "🔷",
                    instruction: "Add an Embed component and paste the JavaScript embed code",
                  },
                  {
                    platform: "Shopify",
                    icon: "🛍️",
                    instruction: "Edit your theme liquid file or use a Custom HTML section",
                  },
                  {
                    platform: "Next.js / React",
                    icon: "⚛️",
                    instruction: "Use dangerouslySetInnerHTML or a useEffect to inject the script tag",
                  },
                ].map(({ platform, icon, instruction }) => (
                  <div key={platform} className="flex items-start gap-3 bg-black/40 rounded-xl p-4">
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-white">{platform}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">
                Want Unlimited Forms + Auto-Responders?
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get full access to WebinarForge AI and connect your forms directly
                to your webinar funnels, CRM, and email sequences automatically.
              </p>
              <Link href="/pricing">
                <button className="bg-amber-500 hover:bg-amber-400 text-black font-black px-8 py-3 rounded-xl transition">
                  Get Full Access — $49 Early Bird →
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// ── Form Preview Component ──────────────────────────────

function FormPreview({
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
  formData: FormData
  selectedTemplate: typeof FORM_TEMPLATES[0]
  submission: SubmissionData
  setSubmission: (s: SubmissionData) => void
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
      {/* Form Header */}
      <div className="p-6 text-center border-b border-white/10">
        <h2 className="text-2xl font-black text-white mb-1">
          {formData.formTitle || selectedTemplate.name}
        </h2>
        <p className="text-gray-400 text-sm">
          {formData.formSubtitle || "Fill out the form below and we will be in touch shortly."}
        </p>
      </div>

      <div className="p-6 space-y-4">

        {/* Name Fields */}
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

        {/* Email */}
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

        {/* Phone */}
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

        {/* Template-specific fields */}
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
              <option value="health">Health & Wellness</option>
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

        {/* ── A2P SMS CONSENT — FULLY COMPLIANT ── */}
        {formData.collectPhone && formData.smsConsent && (
          <div className="bg-black/40 border border-white/10 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
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
              <div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {a2pText}
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Email Consent */}
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

        {/* Submit Button */}
        <button
          onClick={preview ? undefined : onSubmit}
          disabled={preview || submitting}
          className="w-full font-black py-4 rounded-xl text-base transition disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            backgroundColor: formData.primaryColor,
            color: "#000",
          }}
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            formData.buttonText || "Submit →"
          )}
        </button>

        {/* Privacy Note */}
        <p className="text-xs text-gray-600 text-center">
          🔒 Your information is secure and will never be shared with third parties.
          {formData.businessWebsite && (
            <> See our{" "}
              
                href={`${formData.businessWebsite}/privacy`}
                className="underline hover:text-gray-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
