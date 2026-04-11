"use client"

import { useState } from "react"
import Link from "next/link"

const CATEGORIES = [
  "All",
  "Coaching",
  "Real Estate",
  "SaaS",
  "Consulting",
  "Agency",
  "Health & Wellness",
  "Finance",
  "E-Commerce",
  "Local Business",
]

const TEMPLATES = [
  // COACHING
  {
    id: "high-ticket-coaching",
    category: "Coaching",
    name: "High Ticket Coaching Funnel",
    description: "Close $3k-$10k coaching clients on autopilot with a proven webinar funnel.",
    conversion: "18.4%",
    leads: "312 avg leads/week",
    color: "purple",
    badge: "Most Popular",
    pages: ["VSL Page", "Application Page", "Thank You Page", "Follow-up Sequence"],
    headline: "How To Land High-Ticket Clients Without Cold Calling, Posting Every Day, or Discounting Your Prices",
    subheadline: "The exact AI-powered webinar system 7-figure coaches use to close $3k-$10k clients on autopilot",
    cta: "Watch Free Training →",
  },
  {
    id: "group-coaching",
    category: "Coaching",
    name: "Group Coaching Program",
    description: "Fill your group coaching program with qualified leads using automated webinars.",
    conversion: "14.2%",
    leads: "245 avg leads/week",
    color: "blue",
    badge: "Best for Beginners",
    pages: ["Registration Page", "Webinar Room", "Offer Page", "Email Sequence"],
    headline: "Join 500+ Coaches Who Filled Their Group Program in 30 Days Using This Free Training",
    subheadline: "No ads budget required. No cold DMs. No burnout. Just a simple AI webinar that does the selling for you.",
    cta: "Reserve My Free Spot →",
  },
  {
    id: "course-launch",
    category: "Coaching",
    name: "Online Course Launch",
    description: "Launch your online course to thousands using an evergreen webinar funnel.",
    conversion: "11.8%",
    leads: "189 avg leads/week",
    color: "green",
    badge: "High Volume",
    pages: ["Opt-in Page", "VSL Page", "Sales Page", "Upsell Page"],
    headline: "How To Launch An Online Course That Sells Every Day — Even When You Are Not Working",
    subheadline: "The step-by-step AI webinar system that generated $127k in course sales last year on complete autopilot",
    cta: "Get Instant Access →",
  },

  // REAL ESTATE
  {
    id: "real-estate-investor",
    category: "Real Estate",
    name: "Real Estate Investor Webinar",
    description: "Attract motivated sellers and serious buyers with automated real estate webinars.",
    conversion: "16.7%",
    leads: "278 avg leads/week",
    color: "orange",
    badge: "Top Converter",
    pages: ["Lead Capture", "Webinar Page", "Consultation Booking", "Follow-up Series"],
    headline: "How To Find Off-Market Properties and Close 3-5 Deals Per Month Using AI",
    subheadline: "The exact system real estate investors use to find motivated sellers and close deals on autopilot",
    cta: "Watch Free Strategy →",
  },
  {
    id: "real-estate-agent",
    category: "Real Estate",
    name: "Real Estate Agent Lead Gen",
    description: "Generate qualified buyer and seller leads with an AI-powered webinar funnel.",
    conversion: "13.4%",
    leads: "201 avg leads/week",
    color: "red",
    badge: "Lead Machine",
    pages: ["Local SEO Page", "Webinar Room", "Calendar Booking", "CRM Integration"],
    headline: "Free Training: How To Get 20+ Qualified Leads Per Month Without Buying Zillow Leads",
    subheadline: "The AI webinar system top agents in your area use to dominate their local market",
    cta: "Join Free Training →",
  },

  // SAAS
  {
    id: "saas-demo-funnel",
    category: "SaaS",
    name: "SaaS Demo Funnel",
    description: "Convert cold traffic into trial signups and paid users with automated demo webinars.",
    conversion: "22.1%",
    leads: "394 avg leads/week",
    color: "cyan",
    badge: "Highest ROI",
    pages: ["Demo Registration", "Live Demo Room", "Trial Signup", "Onboarding Sequence"],
    headline: "See How [Your SaaS] Can 10x Your Results in Under 30 Minutes — Live Demo",
    subheadline: "Join thousands of companies already using [Your SaaS] to automate their workflow and grow faster",
    cta: "Watch Live Demo →",
  },
  {
    id: "saas-trial-conversion",
    category: "SaaS",
    name: "SaaS Trial Conversion",
    description: "Turn free trial users into paying customers with educational webinar sequences.",
    conversion: "19.3%",
    leads: "340 avg leads/week",
    color: "indigo",
    badge: "Retention Booster",
    pages: ["Feature Showcase", "Case Study Webinar", "Upgrade Page", "Retention Emails"],
    headline: "The Advanced [SaaS Name] Training That Turns Users Into Power Users in 7 Days",
    subheadline: "Join this free advanced training and discover the 3 features most users never find — that 10x their results",
    cta: "Unlock Advanced Training →",
  },

  // CONSULTING
  {
    id: "business-consulting",
    category: "Consulting",
    name: "Business Consulting Funnel",
    description: "Position yourself as the expert and close consulting contracts with webinar authority.",
    conversion: "15.9%",
    leads: "267 avg leads/week",
    color: "yellow",
    badge: "Authority Builder",
    pages: ["Authority Page", "Strategy Webinar", "Proposal Page", "Contract Follow-up"],
    headline: "The 90-Day Business Transformation System Fortune 500 Consultants Use to Scale SMBs",
    subheadline: "Free training reveals the exact framework we used to generate $2.3M in consulting revenue last year",
    cta: "Access Free Training →",
  },
  {
    id: "marketing-consulting",
    category: "Consulting",
    name: "Marketing Consulting Funnel",
    description: "Attract marketing consulting clients who pay premium fees for your expertise.",
    conversion: "17.2%",
    leads: "289 avg leads/week",
    color: "pink",
    badge: "Premium Clients",
    pages: ["Case Study Page", "ROI Webinar", "Discovery Call Booking", "Proposal Templates"],
    headline: "How We Generated 847% ROI for a Local Business in 60 Days Using This Marketing System",
    subheadline: "Free case study training reveals the exact strategy you can replicate in your market starting today",
    cta: "See The Case Study →",
  },

  // AGENCY
  {
    id: "digital-agency",
    category: "Agency",
    name: "Digital Agency Client Funnel",
    description: "Land high-value agency clients using a done-for-you webinar funnel system.",
    conversion: "20.4%",
    leads: "356 avg leads/week",
    color: "emerald",
    badge: "Agency Favorite",
    pages: ["Agency VSL", "Service Showcase", "Case Studies", "Onboarding Funnel"],
    headline: "How Our Agency Generates $50k-$100k/Month Retainers Using One Simple Webinar Funnel",
    subheadline: "The exact client acquisition system top digital agencies use to close $2k-$10k/month retainer clients",
    cta: "Steal Our System →",
  },
  {
    id: "white-label-agency",
    category: "Agency",
    name: "White Label Agency Funnel",
    description: "Resell WebinarForge AI to clients with a professional white-label funnel.",
    conversion: "18.8%",
    leads: "324 avg leads/week",
    color: "violet",
    badge: "White Label Ready",
    pages: ["Agency Pitch Page", "Demo Webinar", "Proposal Builder", "Client Portal"],
    headline: "Finally — A Done-For-You AI Webinar System You Can Resell to Clients for $500-$2,000/Month",
    subheadline: "White-label WebinarForge AI and build a recurring revenue stream without creating anything from scratch",
    cta: "See The Opportunity →",
  },

  // HEALTH & WELLNESS
  {
    id: "health-coaching",
    category: "Health & Wellness",
    name: "Health Coaching Funnel",
    description: "Attract health-conscious clients and fill your wellness programs with this funnel.",
    conversion: "13.7%",
    leads: "218 avg leads/week",
    color: "lime",
    badge: "Wellness Leader",
    pages: ["Health Quiz", "Transformation Webinar", "Program Offer", "Community Access"],
    headline: "The 30-Day Natural Energy Reset That Helped 2,000+ Busy Professionals Finally Feel Amazing",
    subheadline: "Free training reveals the 3 root causes of fatigue most doctors miss — and how to fix them naturally",
    cta: "Watch Free Training →",
  },
  {
    id: "fitness-funnel",
    category: "Health & Wellness",
    name: "Fitness Program Funnel",
    description: "Fill your online fitness program or gym with qualified leads using webinar automation.",
    conversion: "12.4%",
    leads: "196 avg leads/week",
    color: "orange",
    badge: "Body Transformation",
    pages: ["Body Type Quiz", "Training Webinar", "Program Sales Page", "App Download"],
    headline: "How Busy Moms Over 35 Are Losing 20+ Pounds in 90 Days Without Restrictive Diets or Hours at the Gym",
    subheadline: "Free training reveals the exact metabolic reset protocol that has transformed 5,000+ bodies",
    cta: "Start My Transformation →",
  },

  // FINANCE
  {
    id: "financial-advisor",
    category: "Finance",
    name: "Financial Advisor Funnel",
    description: "Attract high-net-worth clients and grow your AUM with an automated webinar system.",
    conversion: "14.8%",
    leads: "234 avg leads/week",
    color: "green",
    badge: "Wealth Builder",
    pages: ["Retirement Quiz", "Investment Webinar", "Strategy Call Booking", "Compliance Pages"],
    headline: "The Tax-Efficient Retirement Strategy Most Financial Advisors Are Too Afraid to Show You",
    subheadline: "Free training reveals how to grow your retirement 3x faster while paying significantly less in taxes",
    cta: "Watch Free Strategy →",
  },
  {
    id: "crypto-investing",
    category: "Finance",
    name: "Investment Education Funnel",
    description: "Educate and convert investors with a high-trust webinar funnel.",
    conversion: "16.1%",
    leads: "271 avg leads/week",
    color: "yellow",
    badge: "High Trust",
    pages: ["Education Page", "Investment Webinar", "Community Access", "Mentorship Offer"],
    headline: "How Ordinary People Are Building Wealth in the New Economy — Without Being an Expert",
    subheadline: "Free investing training reveals the 5-asset portfolio strategy self-made millionaires actually use",
    cta: "Get Free Training →",
  },

  // E-COMMERCE
  {
    id: "ecommerce-brand",
    category: "E-Commerce",
    name: "E-Commerce Brand Funnel",
    description: "Drive product sales and build brand loyalty using educational webinar marketing.",
    conversion: "11.2%",
    leads: "178 avg leads/week",
    color: "rose",
    badge: "Brand Builder",
    pages: ["Product Education", "Demo Webinar", "Shop Integration", "Loyalty Program"],
    headline: "Why 50,000 Customers Switched to [Your Product] — And How It Changed Their Lives",
    subheadline: "Free product masterclass reveals everything you need to know to get the most out of [Your Product]",
    cta: "Watch Product Masterclass →",
  },

  // LOCAL BUSINESS
  {
    id: "local-service-business",
    category: "Local Business",
    name: "Local Service Business Funnel",
    description: "Dominate your local market and generate consistent leads with automated webinars.",
    conversion: "15.3%",
    leads: "247 avg leads/week",
    color: "teal",
    badge: "Local Dominator",
    pages: ["Local Landing Page", "Educational Webinar", "Quote Request", "Review Generation"],
    headline: "How [Your City] Homeowners Are Saving $3,000+ Per Year Using This Little-Known Service",
    subheadline: "Free local workshop reveals how to protect your home and save money — register for the next session",
    cta: "Reserve My Local Spot →",
  },
]

const colorMap: Record<string, string> = {
  purple: "border-purple-500 bg-purple-500/10",
  blue: "border-blue-500 bg-blue-500/10",
  green: "border-green-500 bg-green-500/10",
  orange: "border-orange-500 bg-orange-500/10",
  red: "border-red-500 bg-red-500/10",
  cyan: "border-cyan-500 bg-cyan-500/10",
  indigo: "border-indigo-500 bg-indigo-500/10",
  yellow: "border-yellow-500 bg-yellow-500/10",
  pink: "border-pink-500 bg-pink-500/10",
  emerald: "border-emerald-500 bg-emerald-500/10",
  violet: "border-violet-500 bg-violet-500/10",
  lime: "border-lime-500 bg-lime-500/10",
  rose: "border-rose-500 bg-rose-500/10",
  teal: "border-teal-500 bg-teal-500/10",
}

const badgeColorMap: Record<string, string> = {
  purple: "bg-purple-600",
  blue: "bg-blue-600",
  green: "bg-green-600",
  orange: "bg-orange-600",
  red: "bg-red-600",
  cyan: "bg-cyan-600",
  indigo: "bg-indigo-600",
  yellow: "bg-yellow-500 text-black",
  pink: "bg-pink-600",
  emerald: "bg-emerald-600",
  violet: "bg-violet-600",
  lime: "bg-lime-600 text-black",
  rose: "bg-rose-600",
  teal: "bg-teal-600",
}

const textColorMap: Record<string, string> = {
  purple: "text-purple-400",
  blue: "text-blue-400",
  green: "text-green-400",
  orange: "text-orange-400",
  red: "text-red-400",
  cyan: "text-cyan-400",
  indigo: "text-indigo-400",
  yellow: "text-yellow-400",
  pink: "text-pink-400",
  emerald: "text-emerald-400",
  violet: "text-violet-400",
  lime: "text-lime-400",
  rose: "text-rose-400",
  teal: "text-teal-400",
}

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<typeof TEMPLATES[0] | null>(null)

  const filtered = TEMPLATES.filter((t) => {
    const matchCategory = activeCategory === "All" || t.category === activeCategory
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="py-16 px-6 text-center max-w-5xl mx-auto">
        <span className="inline-block bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full mb-6">
          FUNNEL TEMPLATE LIBRARY
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Launch a{" "}
          <span className="text-purple-400">High-Converting Funnel</span>
          <br />in Any Niche — in Minutes
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
          Choose from {TEMPLATES.length}+ battle-tested funnel templates built for
          every niche. Customize with AI and launch in under 10 minutes.
        </p>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
          {[
            { value: `${TEMPLATES.length}+`, label: "Templates" },
            { value: "10", label: "Niches" },
            { value: "18.4%", label: "Avg Conversion" },
            { value: "< 10min", label: "Launch Time" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400">{value}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by niche or keyword..."
            className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition pl-12"
          />
          <span className="absolute left-4 top-4 text-gray-500">🔍</span>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeCategory === cat
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:border-purple-500 hover:text-white"
              }`}
            >
              {cat}
              {cat === "All" ? ` (${TEMPLATES.length})` : ` (${TEMPLATES.filter(t => t.category === cat).length})`}
            </button>
          ))}
        </div>
      </section>

      {/* TEMPLATE GRID */}
      <section className="px-6 max-w-6xl mx-auto pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl">No templates found for that search.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All") }}
              className="mt-4 text-purple-400 underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((template) => (
              <div
                key={template.id}
                className={`rounded-2xl border-2 p-6 flex flex-col transition hover:scale-[1.02] cursor-pointer ${colorMap[template.color]}`}
                onClick={() => setPreviewTemplate(template)}
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${badgeColorMap[template.color]}`}>
                    {template.badge}
                  </span>
                  <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-2 ${textColorMap[template.color]}`}>
                  {template.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 flex-1">
                  {template.description}
                </p>

                {/* Stats */}
                <div className="flex gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{template.conversion}</div>
                    <div className="text-xs text-gray-500">Conversion</div>
                  </div>
                  <div className="border-l border-white/10" />
                  <div>
                    <div className="text-sm font-bold text-white">{template.leads}</div>
                    <div className="text-xs text-gray-500">Average leads</div>
                  </div>
                </div>

                {/* Pages included */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.pages.map((page) => (
                    <span key={page} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-full text-gray-400">
                      {page}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template) }}
                    className="flex-1 border border-white/20 hover:border-white/50 py-2 rounded-xl text-sm font-semibold transition"
                  >
                    Preview
                  </button>
                  <Link
                    href="/sign-up?plan=earlybird"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1"
                  >
                    <button className={`w-full py-2 rounded-xl text-sm font-bold transition text-white bg-purple-600 hover:bg-purple-700`}>
                      Use Template
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PREVIEW MODAL */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-6 py-12"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-[#0a0a0a] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-6 border-b border-white/10 flex items-start justify-between`}>
              <div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${badgeColorMap[previewTemplate.color]} mb-3 inline-block`}>
                  {previewTemplate.badge}
                </span>
                <h2 className={`text-2xl font-bold ${textColorMap[previewTemplate.color]}`}>
                  {previewTemplate.name}
                </h2>
                <p className="text-gray-400 text-sm mt-1">{previewTemplate.category}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-500 hover:text-white text-2xl transition ml-4"
              >
                ✕
              </button>
            </div>

            {/* Mock Funnel Preview */}
            <div className="p-6">
              <p className="text-xs text-gray-500 uppercase font-bold mb-4">Funnel Preview</p>

              <div className={`rounded-xl border-2 p-6 mb-6 ${colorMap[previewTemplate.color]}`}>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase mb-2">Headline</p>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {previewTemplate.headline}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {previewTemplate.subheadline}
                  </p>
                  <button className={`px-6 py-3 rounded-xl font-bold text-sm bg-purple-600 text-white`}>
                    {previewTemplate.cta}
                  </button>
                </div>
              </div>

              {/* Pages */}
              <p className="text-xs text-gray-500 uppercase font-bold mb-3">Pages Included</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {previewTemplate.pages.map((page, i) => (
                  <div key={page} className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
                    <span className="text-purple-400 font-bold text-sm">{i + 1}</span>
                    <span className="text-gray-300 text-sm">{page}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className={`text-2xl font-bold ${textColorMap[previewTemplate.color]}`}>
                    {previewTemplate.conversion}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Avg Conversion Rate</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className={`text-lg font-bold ${textColorMap[previewTemplate.color]}`}>
                    {previewTemplate.leads}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Average Weekly Leads</div>
                </div>
              </div>

              {/* CTA */}
              <Link href="/sign-up?plan=earlybird">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl text-lg transition">
                  Use This Template — Get Early Bird Access for $49 →
                </button>
              </Link>
              <p className="text-xs text-gray-600 text-center mt-3">
                Includes all {previewTemplate.pages.length} pages · AI customization · Launch in minutes
              </p>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
