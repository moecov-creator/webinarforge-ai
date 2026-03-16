// app/(dashboard)/dashboard/presenters/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Bot, Plus, Star, Zap, Mic, CheckCircle } from "lucide-react";

const MOCK_PRESENTERS = [
  {
    id: "1",
    name: "Jordan Blake",
    speakingStyle: "conversational",
    tone: "motivational",
    nicheSpecialty: "Coach / Consultant",
    isDefault: true,
    avatarInitials: "JB",
    avatarColor: "#8B5CF6",
  },
];

const SPEAKING_STYLES = ["conversational", "authoritative", "energetic", "calm", "educational"];
const TONES = ["professional", "casual", "motivational", "empathetic", "direct"];

export default function PresentersPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    speakingStyle: "conversational",
    tone: "motivational",
    brandVoice: "",
    nicheSpecialty: "",
  });

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">AI Presenters</h1>
          <p className="text-sm text-white/40 mt-1">Create AI presenter profiles with defined voice, tone, and style.</p>
        </div>
        <Button
          className="gradient-brand border-0 hover:opacity-90"
          onClick={() => setShowCreate((s) => !s)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Presenter
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="p-6 rounded-xl bg-white/3 border border-white/10 mb-6">
          <h2 className="font-display font-semibold text-base text-white mb-5">Create AI Presenter</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs text-white/40 mb-1.5 block">Presenter Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g., Jordan Blake"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div>
              <Label className="text-xs text-white/40 mb-1.5 block">Niche Specialty</Label>
              <Input
                value={form.nicheSpecialty}
                onChange={(e) => setForm((p) => ({ ...p, nicheSpecialty: e.target.value }))}
                placeholder="e.g., Business coaching"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div>
              <Label className="text-xs text-white/40 mb-1.5 block">Speaking Style</Label>
              <Select value={form.speakingStyle} onValueChange={(v) => setForm((p) => ({ ...p, speakingStyle: v }))}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-white/10">
                  {SPEAKING_STYLES.map((s) => (
                    <SelectItem key={s} value={s} className="text-white capitalize hover:bg-white/5">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-white/40 mb-1.5 block">Tone</Label>
              <Select value={form.tone} onValueChange={(v) => setForm((p) => ({ ...p, tone: v }))}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-white/10">
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t} className="text-white capitalize hover:bg-white/5">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mb-5">
            <Label className="text-xs text-white/40 mb-1.5 block">Brand Voice Description</Label>
            <Textarea
              value={form.brandVoice}
              onChange={(e) => setForm((p) => ({ ...p, brandVoice: e.target.value }))}
              placeholder="Describe how this presenter speaks. e.g., Direct, warm, and results-focused. Speaks with authority but remains approachable. Uses real-world analogies."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none text-sm"
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button size="sm" className="gradient-brand border-0 text-xs" disabled={!form.name}>
              Create Presenter
            </Button>
            <Button size="sm" variant="ghost" className="text-xs text-white/35 hover:text-white" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Presenter cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_PRESENTERS.map((presenter) => (
          <div key={presenter.id} className="p-5 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-lg font-bold text-white"
                  style={{ backgroundColor: presenter.avatarColor + "30", border: `1px solid ${presenter.avatarColor}40` }}
                >
                  <span style={{ color: presenter.avatarColor }}>{presenter.avatarInitials}</span>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{presenter.name}</p>
                  <p className="text-xs text-white/35">{presenter.nicheSpecialty}</p>
                </div>
              </div>
              {presenter.isDefault && (
                <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/20 text-xs">
                  <Star className="w-2.5 h-2.5 mr-1" />Default
                </Badge>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-white/30">Style</span>
                <span className="text-white/60 capitalize">{presenter.speakingStyle}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/30">Tone</span>
                <span className="text-white/60 capitalize">{presenter.tone}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs border-white/10 text-white/45 hover:text-white bg-white/3">
                <Zap className="w-3 h-3 mr-1.5" />
                Generate Narration
              </Button>
              <Button size="sm" variant="ghost" className="text-xs text-white/25 hover:text-white h-8 w-8 p-0">
                <Mic className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <button
          onClick={() => setShowCreate(true)}
          className="p-5 rounded-xl bg-white/2 border border-dashed border-white/10 hover:border-purple-500/30 hover:bg-white/3 transition-all flex flex-col items-center justify-center gap-3 min-h-40"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white/30" />
          </div>
          <div className="text-center">
            <p className="text-sm text-white/40">Add Presenter</p>
            <p className="text-xs text-white/20 mt-0.5">Create a new AI voice</p>
          </div>
        </button>
      </div>

      {/* Voice placeholder notice */}
      <div className="mt-8 p-4 rounded-xl bg-white/2 border border-white/6 flex items-start gap-3">
        <Bot className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-white/60">AI Voice Synthesis</p>
          <p className="text-xs text-white/30 mt-0.5">
            Live voice synthesis via ElevenLabs or Azure is available on Pro and Scale plans.
            Connect a voice provider in{" "}
            <a href="/dashboard/integrations" className="text-purple-400 hover:text-purple-300">Integrations</a>{" "}
            to enable spoken narration for your webinars.
          </p>
        </div>
      </div>
    </div>
  );
}
