// app/(dashboard)/dashboard/webinars/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import type { WebinarGeneratorInput } from "@/types/webinar";

const NICHES = [
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "COACH_CONSULTANT", label: "Coach / Consultant" },
  { value: "TRAVEL", label: "Travel" },
  { value: "SAAS", label: "SaaS" },
  { value: "LOCAL_SERVICES", label: "Local Services" },
  { value: "OTHER", label: "Other" },
];

const TONES = [
  { value: "conversational", label: "Conversational" },
  { value: "professional", label: "Professional" },
  { value: "motivational", label: "Motivational" },
  { value: "educational", label: "Educational" },
  { value: "casual", label: "Casual" },
];

const OFFER_TYPES = [
  { value: "COURSE", label: "Online Course" },
  { value: "COACHING", label: "Coaching / Consulting" },
  { value: "SAAS", label: "Software / SaaS" },
  { value: "SERVICE", label: "Service / Agency" },
  { value: "PRODUCT", label: "Physical Product" },
  { value: "MEMBERSHIP", label: "Membership" },
  { value: "OTHER", label: "Other" },
];

const STEPS = [
  { id: 1, label: "Audience" },
  { id: 2, label: "Offer" },
  { id: 3, label: "Messaging" },
  { id: 4, label: "Generate" },
];

const defaultInputs: WebinarGeneratorInput = {
  niche: "",
  idealAudience: "",
  painPoint: "",
  desiredOutcome: "",
  offerName: "",
  offerType: "COACHING",
  pricePoint: 997,
  tone: "conversational",
  trafficSource: "",
  objections: "",
  guarantee: "",
  ctaGoal: "Book a call",
};

export default function NewWebinarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<WebinarGeneratorInput>(defaultInputs);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");

  function updateField<K extends keyof WebinarGeneratorInput>(
    key: K,
    value: WebinarGeneratorInput[K]
  ) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setGenerationProgress("Analyzing your audience and offer...");

    try {
      // Simulate progress messages
      const progressSteps = [
        "Analyzing your audience and offer...",
        "Crafting opening hooks...",
        "Generating belief shifts...",
        "Building teaching framework...",
        "Constructing offer stack...",
        "Writing CTA sequences...",
        "Generating FAQ responses...",
        "Finalizing your webinar...",
      ];

      for (let i = 1; i < progressSteps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setGenerationProgress(progressSteps[i]);
      }

      const response = await fetch("/api/webinars/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) throw new Error("Generation failed");
      const { webinarId } = await response.json();
      router.push(`/dashboard/webinars/${webinarId}`);
    } catch (error) {
      console.error("Generation error:", error);
      setIsGenerating(false);
      setGenerationProgress("");
    }
  }

  const canProceedStep1 = inputs.niche && inputs.idealAudience && inputs.painPoint && inputs.desiredOutcome;
  const canProceedStep2 = inputs.offerName && inputs.offerType && inputs.pricePoint > 0;
  const canProceedStep3 = inputs.tone && inputs.ctaGoal;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-white">AI Webinar Generator</h1>
            <p className="text-sm text-white/40">Build your complete webinar in minutes</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  step === s.id
                    ? "gradient-brand text-white"
                    : step > s.id
                    ? "bg-green-500/15 text-green-400"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {step > s.id ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <span className="w-4 text-center">{s.id}</span>
                )}
                {s.label}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`h-px w-6 ${step > s.id ? "bg-green-500/30" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-white/3 border border-white/8 p-6">

          {/* Step 1: Audience */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display font-semibold text-lg text-white mb-1">
                  Who is this webinar for?
                </h2>
                <p className="text-sm text-white/40">
                  The sharper your audience definition, the stronger your webinar.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">Your Niche</Label>
                  <Select value={inputs.niche} onValueChange={(v) => updateField("niche", v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select your niche" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10">
                      {NICHES.map((n) => (
                        <SelectItem key={n.value} value={n.value} className="text-white hover:bg-white/5">
                          {n.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">
                    Ideal Audience <span className="text-white/30">(be specific)</span>
                  </Label>
                  <Input
                    value={inputs.idealAudience}
                    onChange={(e) => updateField("idealAudience", e.target.value)}
                    placeholder="e.g., coaches stuck under $10k/month who want to scale"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">
                    Core Pain Point <span className="text-white/30">(what keeps them up at night?)</span>
                  </Label>
                  <Textarea
                    value={inputs.painPoint}
                    onChange={(e) => updateField("painPoint", e.target.value)}
                    placeholder="e.g., Trading time for money with no scalable client acquisition system"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">
                    Desired Outcome <span className="text-white/30">(what transformation do you deliver?)</span>
                  </Label>
                  <Textarea
                    value={inputs.desiredOutcome}
                    onChange={(e) => updateField("desiredOutcome", e.target.value)}
                    placeholder="e.g., Consistent high-ticket clients on autopilot without cold outreach"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Offer */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display font-semibold text-lg text-white mb-1">
                  What are you selling?
                </h2>
                <p className="text-sm text-white/40">
                  Your offer details power the entire webinar structure.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">Offer Name</Label>
                  <Input
                    value={inputs.offerName}
                    onChange={(e) => updateField("offerName", e.target.value)}
                    placeholder="e.g., Business Acceleration Mastermind"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">Offer Type</Label>
                  <Select value={inputs.offerType} onValueChange={(v) => updateField("offerType", v as any)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10">
                      {OFFER_TYPES.map((o) => (
                        <SelectItem key={o.value} value={o.value} className="text-white hover:bg-white/5">
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">Price Point ($)</Label>
                  <Input
                    type="number"
                    value={inputs.pricePoint}
                    onChange={(e) => updateField("pricePoint", Number(e.target.value))}
                    placeholder="997"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">
                    Guarantee <span className="text-white/30">(optional)</span>
                  </Label>
                  <Input
                    value={inputs.guarantee || ""}
                    onChange={(e) => updateField("guarantee", e.target.value)}
                    placeholder="e.g., 30-day money-back guarantee"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Messaging */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display font-semibold text-lg text-white mb-1">
                  Messaging & Style
                </h2>
                <p className="text-sm text-white/40">
                  Fine-tune the tone and objections your AI will address.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">Presentation Tone</Label>
                  <Select value={inputs.tone} onValueChange={(v) => updateField("tone", v as any)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10">
                      {TONES.map((t) => (
                        <SelectItem key={t.value} value={t.value} className="text-white hover:bg-white/5">
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">
                    Primary Traffic Source <span className="text-white/30">(optional)</span>
                  </Label>
                  <Input
                    value={inputs.trafficSource || ""}
                    onChange={(e) => updateField("trafficSource", e.target.value)}
                    placeholder="e.g., Facebook Ads, YouTube, organic social"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">
                    Top Objections to Handle
                  </Label>
                  <Textarea
                    value={inputs.objections || ""}
                    onChange={(e) => updateField("objections", e.target.value)}
                    placeholder="e.g., Too expensive, don't have time, tried other programs"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-white/60 text-xs mb-1.5 block">CTA Goal</Label>
                  <Input
                    value={inputs.ctaGoal || ""}
                    onChange={(e) => updateField("ctaGoal", e.target.value)}
                    placeholder="e.g., Book a discovery call, Buy now, Start free trial"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Generate */}
          {step === 4 && (
            <div className="space-y-5">
              {!isGenerating ? (
                <>
                  <div>
                    <h2 className="font-display font-semibold text-lg text-white mb-1">
                      Ready to generate
                    </h2>
                    <p className="text-sm text-white/40">
                      Review your inputs and launch the AI generation.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Niche", value: NICHES.find((n) => n.value === inputs.niche)?.label },
                      { label: "Audience", value: inputs.idealAudience },
                      { label: "Pain Point", value: inputs.painPoint },
                      { label: "Offer", value: `${inputs.offerName} (${inputs.offerType}) — $${inputs.pricePoint}` },
                      { label: "Tone", value: inputs.tone },
                      { label: "CTA Goal", value: inputs.ctaGoal },
                    ].map((row) => (
                      <div key={row.label} className="flex gap-3 p-3 rounded-lg bg-white/3">
                        <span className="text-xs text-white/30 w-20 flex-shrink-0 pt-0.5">{row.label}</span>
                        <span className="text-xs text-white/70">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-purple-300 mb-1">What you'll get:</p>
                        <ul className="text-xs text-purple-300/60 space-y-1">
                          <li>• 5 webinar title options</li>
                          <li>• Complete 15-section script structure</li>
                          <li>• Offer stack + bonus stack</li>
                          <li>• 4 CTA sequences with timing</li>
                          <li>• 5 FAQ/objection responses</li>
                          <li>• 3-email follow-up sequence</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">
                    Generating your webinar
                  </h3>
                  <p className="text-sm text-white/40 mb-6">{generationProgress}</p>
                  <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                    <div className="h-full gradient-brand rounded-full shimmer" style={{ width: "60%" }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        {!isGenerating && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              className="border-white/10 text-white/50 hover:text-white bg-white/3"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < 4 ? (
              <Button
                className="gradient-brand border-0 hover:opacity-90"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                disabled={
                  (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2) ||
                  (step === 3 && !canProceedStep3)
                }
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="gradient-brand border-0 hover:opacity-90 glow-primary"
                onClick={handleGenerate}
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Webinar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
