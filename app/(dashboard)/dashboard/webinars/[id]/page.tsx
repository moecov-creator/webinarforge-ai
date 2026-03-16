// app/(dashboard)/dashboard/webinars/[id]/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Save, Globe, Eye, ChevronRight, Zap, MessageSquare,
  MousePointerClick, BarChart2, Settings, Copy, Check,
} from "lucide-react";

// Mock webinar data — in production, fetch by ID via server component
const MOCK_WEBINAR = {
  id: "demo-1",
  title: "The 3-Step System to Land High-Ticket Coaching Clients Without Cold Outreach",
  status: "PUBLISHED",
  niche: "COACH_CONSULTANT",
  slug: "demo-coaching-abc123",
  sections: [
    { id: "s1", type: "hook", title: "Opening Hook", content: "What if you could wake up tomorrow with three qualified discovery calls already booked — without sending a single cold message? In the next 75 minutes, I'm going to show you exactly how I did it, and how you can replicate it regardless of your niche." },
    { id: "s2", type: "promise", title: "The Promise", content: "By the end of this training, you'll have a complete blueprint for a client-acquisition system that works 24 hours a day. No more chasing. No more posting and hoping. A real, automated funnel that delivers ready-to-buy clients to your calendar." },
    { id: "s3", type: "credibility", title: "Who Am I", content: "I spent three years as a coach who was brilliant at transforming clients but terrible at finding them. I tried everything — cold DMs, networking events, even paid ads that burned $8,000 with nothing to show. Then I discovered evergreen webinar funnels and everything changed." },
    { id: "s4", type: "belief_shift", title: "Belief Shift 1", content: "You've probably been told you need a massive audience to sell high-ticket. That's false. The coaches I know who consistently close $5k–$20k clients have small, highly targeted audiences who trust them — not viral reach." },
    { id: "s5", type: "teaching", title: "Step 1: Nail Your Positioning", content: "Your first job isn't to sell. It's to be unmistakably clear about who you help and what result you deliver. Specificity is the currency of trust." },
    { id: "s6", type: "belief_shift", title: "Belief Shift 2", content: "Most coaches believe more content = more clients. Content creates awareness. Systems create clients. You need a conversion machine, not just a content calendar." },
    { id: "s7", type: "teaching", title: "Step 2: Build Your Conversion Machine", content: "The conversion machine has three moving parts: a traffic source, a qualification mechanism, and a sales conversation. The webinar funnel handles all three automatically." },
    { id: "s8", type: "offer_transition", title: "Offer Bridge", content: "Now I want to show you the fastest path to implementing everything we've covered — and how you can have your first evergreen webinar funnel live within the next 14 days." },
    { id: "s9", type: "cta", title: "Call to Action", content: "If you're ready to install a client-acquisition system that runs while you sleep, click the button below and let's talk about what that looks like for your specific situation." },
  ],
};

const SECTION_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  hook: { label: "Hook", color: "text-yellow-400" },
  promise: { label: "Promise", color: "text-blue-400" },
  credibility: { label: "Authority", color: "text-green-400" },
  belief_shift: { label: "Belief Shift", color: "text-purple-400" },
  teaching: { label: "Teaching", color: "text-cyan-400" },
  offer_transition: { label: "Transition", color: "text-orange-400" },
  stack: { label: "Offer Stack", color: "text-pink-400" },
  bonus: { label: "Bonuses", color: "text-emerald-400" },
  urgency: { label: "Urgency", color: "text-red-400" },
  cta: { label: "CTA", color: "text-white" },
  faq: { label: "FAQ", color: "text-slate-400" },
};

const NAV_TABS = [
  { id: "script", label: "Script", icon: MessageSquare },
  { id: "cta", label: "CTAs", icon: MousePointerClick },
  { id: "comments", label: "Comments", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function WebinarEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [activeSection, setActiveSection] = useState(MOCK_WEBINAR.sections[0].id);
  const [activeTab, setActiveTab] = useState("script");
  const [sections, setSections] = useState(MOCK_WEBINAR.sections);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPublished, setIsPublished] = useState(MOCK_WEBINAR.status === "PUBLISHED");

  const currentSection = sections.find((s) => s.id === activeSection);

  function updateSection(id: string, content: string) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, content } : s)));
  }

  async function handleSave() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#09090f]">
      {/* Top toolbar */}
      <div className="h-14 border-b border-white/5 px-5 flex items-center justify-between gap-4 flex-shrink-0 bg-black/20">
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-white truncate">{MOCK_WEBINAR.title}</h1>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge className={isPublished ? "bg-green-500/15 text-green-400 border-green-500/20 text-xs" : "bg-white/8 text-white/40 border-white/10 text-xs"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
          <Button size="sm" variant="ghost" className="text-white/40 hover:text-white h-8 text-xs">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-white/10 text-white/60 hover:text-white bg-white/3 h-8 text-xs"
            onClick={handleSave}
            disabled={isSaving}
          >
            {saved ? <Check className="w-3.5 h-3.5 mr-1.5 text-green-400" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
            {saved ? "Saved" : isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            size="sm"
            className={isPublished ? "bg-white/5 border-white/10 text-white/50 hover:text-white h-8 text-xs border" : "gradient-brand border-0 h-8 text-xs hover:opacity-90"}
            onClick={() => setIsPublished((p) => !p)}
          >
            <Globe className="w-3.5 h-3.5 mr-1.5" />
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-white/5 px-5 flex-shrink-0">
        <div className="flex gap-1">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "text-white border-purple-500"
                  : "text-white/35 border-transparent hover:text-white/60"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "script" && (
          <>
            {/* Section list */}
            <div className="w-52 border-r border-white/5 overflow-y-auto flex-shrink-0 bg-black/10">
              <div className="p-3 space-y-0.5">
                {sections.map((section) => {
                  const meta = SECTION_TYPE_LABELS[section.type];
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                        activeSection === section.id
                          ? "bg-white/8 border border-white/10"
                          : "hover:bg-white/3"
                      }`}
                    >
                      <p className={`text-xs font-medium mb-0.5 ${meta?.color ?? "text-white/50"}`}>
                        {meta?.label ?? section.type}
                      </p>
                      <p className="text-xs text-white/40 truncate">{section.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content editor */}
            <div className="flex-1 overflow-y-auto p-6">
              {currentSection && (
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${SECTION_TYPE_LABELS[currentSection.type]?.color ?? "text-white/40"}`}>
                      {SECTION_TYPE_LABELS[currentSection.type]?.label}
                    </span>
                    <ChevronRight className="w-3 h-3 text-white/20" />
                    <span className="text-xs text-white/40">{currentSection.title}</span>
                  </div>

                  <Input
                    value={currentSection.title ?? ""}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((s) => s.id === currentSection.id ? { ...s, title: e.target.value } : s)
                      )
                    }
                    placeholder="Section title"
                    className="bg-white/3 border-white/8 text-white placeholder:text-white/20 mb-4 font-display text-base font-semibold"
                  />

                  <Textarea
                    value={currentSection.content}
                    onChange={(e) => updateSection(currentSection.id, e.target.value)}
                    placeholder="Write your section content..."
                    className="bg-white/3 border-white/8 text-white/80 placeholder:text-white/15 resize-none text-sm leading-relaxed min-h-48"
                    rows={12}
                  />

                  <div className="flex items-center gap-3 mt-4">
                    <Button size="sm" variant="outline" className="text-xs border-white/10 text-white/40 hover:text-white bg-transparent">
                      <Zap className="w-3.5 h-3.5 mr-1.5" />
                      Regenerate with AI
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs text-white/25 hover:text-white/50">
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right preview panel */}
            <div className="w-64 border-l border-white/5 p-4 flex-shrink-0 bg-black/10 overflow-y-auto">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Section Guide</p>
              {currentSection && (
                <div className="text-xs text-white/30 leading-relaxed space-y-3">
                  {currentSection.type === "hook" && (
                    <>
                      <p>Your hook should interrupt a pattern. Start with a bold claim, a surprising question, or a specific result.</p>
                      <p>Aim to immediately make the viewer think "wait, what? Tell me more."</p>
                    </>
                  )}
                  {currentSection.type === "promise" && (
                    <>
                      <p>State exactly what will be revealed or possible by the end of the webinar.</p>
                      <p>Be specific. Vague promises lose people. Specific promises create leaning-in attention.</p>
                    </>
                  )}
                  {currentSection.type === "belief_shift" && (
                    <>
                      <p>Name the old belief your audience holds. Validate it — don't make them wrong for having it.</p>
                      <p>Then introduce the bridge: why that belief worked before, but doesn't now, or is incomplete.</p>
                    </>
                  )}
                  {currentSection.type === "teaching" && (
                    <>
                      <p>Give real, actionable insight. Not theory — something they can act on.</p>
                      <p>But stop just before the full implementation. That belongs in your offer.</p>
                    </>
                  )}
                  {currentSection.type === "cta" && (
                    <>
                      <p>Make one clear ask. Don't offer multiple options.</p>
                      <p>Reinforce the transformation waiting on the other side of the click. Then be quiet.</p>
                    </>
                  )}
                  {!["hook","promise","belief_shift","teaching","cta"].includes(currentSection.type) && (
                    <p>Edit this section to match your voice and offer positioning.</p>
                  )}
                  <div className="mt-4 pt-4 border-t border-white/8">
                    <p className="text-white/20">Word count: {currentSection.content.split(" ").filter(Boolean).length}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "cta" && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl">
              <h2 className="font-display font-semibold text-base text-white mb-1">CTA Sequences</h2>
              <p className="text-sm text-white/35 mb-6">Define when and how your calls-to-action appear during the webinar.</p>
              <div className="space-y-4">
                {[
                  { type: "SOFT", time: "10:00", label: "Soft CTA", color: "text-blue-400" },
                  { type: "MID", time: "45:00", label: "Mid CTA", color: "text-yellow-400" },
                  { type: "FINAL", time: "70:00", label: "Final CTA", color: "text-purple-400" },
                  { type: "URGENCY", time: "75:00", label: "Urgency CTA", color: "text-red-400" },
                ].map((cta) => (
                  <div key={cta.type} className="p-5 rounded-xl bg-white/3 border border-white/8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${cta.color}`}>{cta.label}</span>
                        <Badge className="bg-white/5 text-white/30 border-white/8 text-xs">{cta.time}</Badge>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-4 rounded-full bg-purple-500 relative">
                          <div className="w-3 h-3 rounded-full bg-white absolute right-0.5 top-0.5" />
                        </div>
                        <span className="text-xs text-white/30">Active</span>
                      </label>
                    </div>
                    <div className="grid gap-3">
                      <div>
                        <label className="text-xs text-white/30 block mb-1">Headline</label>
                        <Input defaultValue="This is your moment." className="bg-white/5 border-white/8 text-white/70 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-white/30 block mb-1">Button Text</label>
                        <Input defaultValue="Claim Your Spot →" className="bg-white/5 border-white/8 text-white/70 text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl">
              <h2 className="font-display font-semibold text-base text-white mb-1">Timed Comments</h2>
              <p className="text-sm text-white/35 mb-6">Comments that fire at specific timestamps to simulate engagement.</p>
              <div className="space-y-3">
                {[
                  { author: "Sarah M.", content: "This is exactly what I needed! Taking notes 📝", time: "5:00", type: "SOCIAL_PROOF" },
                  { author: "Marcus T.", content: "Question: Does this work if you're just starting out?", time: "15:00", type: "FAQ" },
                  { author: "Jordan Blake", content: "Great question Marcus — yes, we cover this in step 2!", time: "16:00", type: "MODERATOR" },
                  { author: "Jennifer K.", content: "I applied this and doubled my revenue in 60 days.", time: "30:00", type: "TESTIMONIAL" },
                ].map((comment, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/8">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/50 flex-shrink-0">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white/70">{comment.author}</span>
                        <Badge className="bg-white/5 text-white/25 border-white/8 text-xs">{comment.time}</Badge>
                        <Badge className={`text-xs border-0 ${
                          comment.type === "TESTIMONIAL" ? "bg-yellow-500/15 text-yellow-400" :
                          comment.type === "MODERATOR" ? "bg-blue-500/15 text-blue-400" :
                          comment.type === "FAQ" ? "bg-white/8 text-white/35" :
                          "bg-green-500/15 text-green-400"
                        }`}>
                          {comment.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/50">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="sm" className="mt-4 gradient-brand border-0 text-xs">
                + Add Comment
              </Button>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-lg space-y-6">
              <div>
                <h2 className="font-display font-semibold text-base text-white mb-4">Webinar Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/40 block mb-1.5">Webinar Title</label>
                    <Input defaultValue={MOCK_WEBINAR.title} className="bg-white/5 border-white/10 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1.5">Slug (URL)</label>
                    <Input defaultValue={MOCK_WEBINAR.slug} className="bg-white/5 border-white/10 text-white/60 text-sm font-mono" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Evergreen Settings</h3>
                <div className="space-y-3">
                  {[
                    { label: "Simulated Live Mode", desc: "Show a dynamic viewer count during playback" },
                    { label: "Replay Enabled", desc: "Allow registered users to replay on demand" },
                    { label: "Auto Email Follow-Up", desc: "Send follow-up emails after completion" },
                  ].map((setting) => (
                    <div key={setting.label} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/8">
                      <div>
                        <p className="text-sm text-white/70">{setting.label}</p>
                        <p className="text-xs text-white/30 mt-0.5">{setting.desc}</p>
                      </div>
                      <div className="w-10 h-5 rounded-full bg-purple-500 relative cursor-pointer flex-shrink-0">
                        <div className="w-4 h-4 rounded-full bg-white absolute right-0.5 top-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
