// app/(dashboard)/dashboard/templates/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { Lock, Star, ArrowRight, Zap } from "lucide-react";

const NICHE_FILTERS = [
  { value: "ALL", label: "All Templates" },
  { value: "COACH_CONSULTANT", label: "Coaching" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "SAAS", label: "SaaS" },
  { value: "TRAVEL", label: "Travel" },
  { value: "LOCAL_SERVICES", label: "Local Services" },
];

const TEMPLATES = [
  {
    id: "t1",
    name: "High-Ticket Coaching Funnel",
    niche: "COACH_CONSULTANT",
    nicheLabel: "Coaching",
    description: "Convert cold traffic into $3k–$10k coaching clients using a proven evergreen structure.",
    isPremium: false,
    tags: ["coaching", "high-ticket", "evergreen"],
    sectionCount: 15,
    durationMin: 60,
    color: "#8B5CF6",
    emoji: "🎯",
  },
  {
    id: "t2",
    name: "Real Estate Lead Machine",
    niche: "REAL_ESTATE",
    nicheLabel: "Real Estate",
    description: "Turn motivated sellers and buyers into booked appointments — 24/7, no cold calling.",
    isPremium: false,
    tags: ["real estate", "leads", "agents"],
    sectionCount: 15,
    durationMin: 60,
    color: "#3B82F6",
    emoji: "🏠",
  },
  {
    id: "t3",
    name: "SaaS Demo-to-Trial Converter",
    niche: "SAAS",
    nicheLabel: "SaaS",
    description: "Move prospects from curious to activated in one automated session.",
    isPremium: true,
    tags: ["saas", "demo", "activation"],
    sectionCount: 14,
    durationMin: 45,
    color: "#10B981",
    emoji: "💻",
  },
  {
    id: "t4",
    name: "Premium Travel Package Seller",
    niche: "TRAVEL",
    nicheLabel: "Travel",
    description: "Sell $5k+ travel packages to dream-destination travelers using educational selling.",
    isPremium: false,
    tags: ["travel", "luxury", "packages"],
    sectionCount: 15,
    durationMin: 60,
    color: "#06B6D4",
    emoji: "✈️",
  },
  {
    id: "t5",
    name: "Local Service Authority Builder",
    niche: "LOCAL_SERVICES",
    nicheLabel: "Local Services",
    description: "Position yourself as the go-to expert in your area and fill your calendar with premium clients.",
    isPremium: false,
    tags: ["local", "authority", "referrals"],
    sectionCount: 13,
    durationMin: 50,
    color: "#F59E0B",
    emoji: "📍",
  },
  {
    id: "t6",
    name: "Consulting Retainer Closer",
    niche: "COACH_CONSULTANT",
    nicheLabel: "Consulting",
    description: "Land long-term consulting retainers from a single evergreen webinar funnel.",
    isPremium: true,
    tags: ["consulting", "retainer", "b2b"],
    sectionCount: 16,
    durationMin: 75,
    color: "#8B5CF6",
    emoji: "📊",
  },
];

export default function TemplatesPage() {
  return (
    <div className="p-8 max-w-6xl">
      <PageHeader
        title="Template Library"
        description="Pre-built webinar structures for every niche. Use as-is or customize with AI."
      >
        <Link href="/dashboard/webinars/new">
          <Button className="gradient-brand border-0 hover:opacity-90">
            <Zap className="w-4 h-4 mr-2" />
            Generate Custom
          </Button>
        </Link>
      </PageHeader>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {NICHE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filter.value === "ALL"
                ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                : "bg-white/3 border-white/8 text-white/40 hover:border-white/20 hover:text-white/70"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="group relative rounded-2xl bg-white/3 border border-white/8 hover:border-white/15 transition-all overflow-hidden"
          >
            {/* Color accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: `linear-gradient(90deg, ${template.color}, ${template.color}80)` }}
            />

            {/* Premium lock overlay */}
            {template.isPremium && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20 text-xs">
                  <Star className="w-2.5 h-2.5 mr-1" />
                  Pro
                </Badge>
              </div>
            )}

            <div className="p-5">
              {/* Icon + niche */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{template.emoji}</span>
                <Badge className="bg-white/5 text-white/30 border-white/8 text-xs">
                  {template.nicheLabel}
                </Badge>
              </div>

              {/* Title + description */}
              <h3 className="font-display font-semibold text-base text-white mb-2 leading-snug">
                {template.name}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                {template.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-white/25 mb-4">
                <span>{template.sectionCount} sections</span>
                <span>·</span>
                <span>{template.durationMin} min</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-5">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] bg-white/4 text-white/25 border border-white/6"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex gap-2">
                {template.isPremium ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs border-yellow-500/20 text-yellow-400/70 hover:text-yellow-300 bg-yellow-500/5"
                  >
                    <Lock className="w-3 h-3 mr-1.5" />
                    Upgrade to Use
                  </Button>
                ) : (
                  <Link href={`/dashboard/webinars/new?template=${template.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full text-xs gradient-brand border-0 hover:opacity-90 group-hover:shadow-md transition-shadow"
                    >
                      Use Template
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Button>
                  </Link>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-white/25 hover:text-white/60 px-2.5"
                >
                  Preview
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade CTA for premium templates */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-yellow-500/8 to-orange-500/8 border border-yellow-500/15">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-semibold text-base text-white mb-1">
              Unlock all premium templates
            </h3>
            <p className="text-sm text-white/40">
              Pro plan includes the full template library plus unlimited AI generation.
            </p>
          </div>
          <Link href="/dashboard/billing">
            <Button className="flex-shrink-0 gradient-brand border-0 hover:opacity-90">
              Upgrade to Pro
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
