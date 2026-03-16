// app/(auth)/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Zap, ArrowRight, CheckCircle } from "lucide-react";

const NICHES = [
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "COACH_CONSULTANT", label: "Coach / Consultant" },
  { value: "TRAVEL", label: "Travel" },
  { value: "SAAS", label: "SaaS" },
  { value: "LOCAL_SERVICES", label: "Local Services" },
  { value: "OTHER", label: "Other" },
];

const WEBINAR_GOALS = [
  "Sell a high-ticket offer",
  "Book discovery calls",
  "Grow my email list",
  "Launch a course",
  "Sell software",
  "Generate leads for my service",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    niche: "",
    primaryOffer: "",
    targetAudience: "",
    webinarGoal: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleComplete() {
    setIsSaving(true);
    try {
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.push("/dashboard");
    } catch {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080812] flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white">WebinarForge <span className="text-purple-400">AI</span></span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all ${
                s === step ? "w-8 gradient-brand" : s < step ? "w-4 bg-green-500/50" : "w-4 bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="rounded-2xl bg-white/3 border border-white/8 p-8">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="font-display text-2xl font-bold text-white mb-1">Welcome! Let's set you up.</h1>
                <p className="text-sm text-white/40">Tell us a bit about yourself so we can personalize your experience.</p>
              </div>
              <div>
                <Label className="text-white/50 text-xs mb-1.5 block">Your Name</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Alex Rivera" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
              </div>
              <div>
                <Label className="text-white/50 text-xs mb-1.5 block">Company / Brand Name</Label>
                <Input value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Your business name" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
              </div>
              <div>
                <Label className="text-white/50 text-xs mb-1.5 block">Your Niche</Label>
                <Select value={form.niche} onValueChange={(v) => update("niche", v)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select your niche" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10">
                    {NICHES.map((n) => (
                      <SelectItem key={n.value} value={n.value} className="text-white hover:bg-white/5">{n.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h1 className="font-display text-2xl font-bold text-white mb-1">About your offer</h1>
                <p className="text-sm text-white/40">This helps us generate more relevant webinar content for you.</p>
              </div>
              <div>
                <Label className="text-white/50 text-xs mb-1.5 block">What's your primary offer?</Label>
                <Input value={form.primaryOffer} onChange={(e) => update("primaryOffer", e.target.value)} placeholder="e.g., Business Acceleration Coaching Program" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
              </div>
              <div>
                <Label className="text-white/50 text-xs mb-1.5 block">Who is your target audience?</Label>
                <Textarea value={form.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} placeholder="e.g., Coaches and consultants stuck under $10k/month" className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none" rows={3} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h1 className="font-display text-2xl font-bold text-white mb-1">What's your webinar goal?</h1>
                <p className="text-sm text-white/40">We'll tailor your templates and AI prompts to this goal.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {WEBINAR_GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => update("webinarGoal", goal)}
                    className={`p-3 rounded-xl text-left text-sm transition-all border ${
                      form.webinarGoal === goal
                        ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
                        : "bg-white/3 border-white/8 text-white/50 hover:border-white/20 hover:text-white/70"
                    }`}
                  >
                    {form.webinarGoal === goal && <CheckCircle className="w-3 h-3 text-purple-400 mb-1" />}
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="ghost" className="text-white/40 hover:text-white" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          ) : <div />}
          {step < 3 ? (
            <Button
              className="gradient-brand border-0 hover:opacity-90"
              onClick={() => setStep((s) => s + 1)}
              disabled={(step === 1 && (!form.name || !form.niche)) || (step === 2 && !form.primaryOffer)}
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="gradient-brand border-0 hover:opacity-90 glow-primary"
              onClick={handleComplete}
              disabled={!form.webinarGoal || isSaving}
            >
              {isSaving ? "Setting up..." : "Enter Dashboard →"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
