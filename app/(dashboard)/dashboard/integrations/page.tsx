// app/(dashboard)/dashboard/integrations/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Link2, Plus, Trash2, Copy, CheckCircle, AlertCircle,
  ExternalLink, Webhook, Zap,
} from "lucide-react";

const INTEGRATION_PROVIDERS = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing and subscription billing.",
    status: "connected",
    logo: "💳",
    category: "Billing",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect WebinarForge to 6,000+ apps without code.",
    status: "available",
    logo: "⚡",
    category: "Automation",
    docsUrl: "#",
  },
  {
    id: "gohighlevel",
    name: "GoHighLevel",
    description: "Sync leads and webinar events with your GHL CRM.",
    status: "available",
    logo: "🎯",
    category: "CRM",
    docsUrl: "#",
  },
  {
    id: "clickfunnels",
    name: "ClickFunnels",
    description: "Push webinar registrations into your CF funnels.",
    status: "coming_soon",
    logo: "🔥",
    category: "Funnels",
  },
  {
    id: "calendly",
    name: "Calendly",
    description: "Auto-book discovery calls after CTA clicks.",
    status: "coming_soon",
    logo: "📅",
    category: "Scheduling",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Sync registrants and trigger email automations.",
    status: "available",
    logo: "📧",
    category: "Email",
    docsUrl: "#",
  },
];

const WEBHOOK_EVENTS = [
  "webinar.created",
  "webinar.published",
  "webinar.registration.created",
  "webinar.room.joined",
  "webinar.completed",
  "cta.clicked",
  "plan.upgraded",
  "affiliate.referral.created",
  "purchase.completed",
];

const MOCK_WEBHOOKS = [
  {
    id: "1",
    url: "https://hooks.zapier.com/hooks/catch/xxx",
    events: ["webinar.completed", "cta.clicked"],
    isActive: true,
    description: "Zapier catch webhook",
  },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "connected") {
    return (
      <Badge className="bg-green-500/15 text-green-400 border-green-500/20 text-xs">
        <CheckCircle className="w-3 h-3 mr-1" />Connected
      </Badge>
    );
  }
  if (status === "coming_soon") {
    return <Badge className="bg-white/8 text-white/30 border-white/10 text-xs">Coming Soon</Badge>;
  }
  return <Badge className="bg-white/8 text-white/40 border-white/10 text-xs">Available</Badge>;
}

export default function IntegrationsPage() {
  const [webhooks, setWebhooks] = useState(MOCK_WEBHOOKS);
  const [showNewWebhook, setShowNewWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  function toggleEvent(event: string) {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  }

  function addWebhook() {
    if (!newWebhookUrl || selectedEvents.length === 0) return;
    setWebhooks((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        url: newWebhookUrl,
        events: selectedEvents,
        isActive: true,
        description: "New webhook",
      },
    ]);
    setNewWebhookUrl("");
    setSelectedEvents([]);
    setShowNewWebhook(false);
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white">Integrations</h1>
        <p className="text-sm text-white/40 mt-1">
          Connect WebinarForge to your stack via native integrations and webhooks.
        </p>
      </div>

      {/* Native Integrations */}
      <section className="mb-10">
        <h2 className="font-display font-semibold text-base text-white mb-4">Connected Apps</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTEGRATION_PROVIDERS.map((provider) => (
            <div
              key={provider.id}
              className={`p-5 rounded-xl bg-white/3 border transition-all ${
                provider.status === "connected"
                  ? "border-green-500/20"
                  : "border-white/8 hover:border-white/15"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.logo}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{provider.name}</p>
                    <p className="text-xs text-white/30">{provider.category}</p>
                  </div>
                </div>
                <StatusBadge status={provider.status} />
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-4">{provider.description}</p>
              <div className="flex gap-2">
                {provider.status === "connected" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/20 bg-transparent"
                  >
                    Disconnect
                  </Button>
                ) : provider.status === "available" ? (
                  <Button
                    size="sm"
                    className="text-xs gradient-brand border-0 hover:opacity-90"
                  >
                    Connect
                    <ExternalLink className="w-3 h-3 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-white/10 text-white/20 bg-transparent"
                    disabled
                  >
                    Notify me
                  </Button>
                )}
                {provider.docsUrl && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-white/30 hover:text-white"
                    asChild
                  >
                    <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer">
                      Docs
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Webhooks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-base text-white">Webhooks</h2>
            <p className="text-xs text-white/35 mt-0.5">
              Receive real-time event payloads at any HTTPS endpoint.
            </p>
          </div>
          <Button
            size="sm"
            className="gradient-brand border-0 text-xs hover:opacity-90"
            onClick={() => setShowNewWebhook((s) => !s)}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Endpoint
          </Button>
        </div>

        {/* New webhook form */}
        {showNewWebhook && (
          <div className="p-5 rounded-xl bg-white/3 border border-white/10 mb-4">
            <h3 className="text-sm font-medium text-white mb-4">New Webhook Endpoint</h3>

            <div className="mb-4">
              <label className="text-xs text-white/40 block mb-1.5">Endpoint URL</label>
              <Input
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="https://your-endpoint.com/webhooks"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 text-sm"
              />
            </div>

            <div className="mb-5">
              <label className="text-xs text-white/40 block mb-2">Events to Subscribe</label>
              <div className="flex flex-wrap gap-2">
                {WEBHOOK_EVENTS.map((event) => (
                  <button
                    key={event}
                    onClick={() => toggleEvent(event)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                      selectedEvents.includes(event)
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-white/5 text-white/40 border border-white/8 hover:border-white/20"
                    }`}
                  >
                    {event}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="gradient-brand border-0 text-xs"
                onClick={addWebhook}
                disabled={!newWebhookUrl || selectedEvents.length === 0}
              >
                Save Endpoint
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-white/40 hover:text-white"
                onClick={() => setShowNewWebhook(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Existing webhooks */}
        <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden">
          {webhooks.length === 0 ? (
            <div className="p-8 text-center">
              <Webhook className="w-8 h-8 text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/30">No webhook endpoints configured</p>
              <p className="text-xs text-white/20 mt-1">Add an endpoint to receive real-time event payloads</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {webhooks.map((hook) => (
                <div key={hook.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm text-white/70 truncate">{hook.url}</code>
                      {hook.isActive ? (
                        <Badge className="bg-green-500/15 text-green-400 border-green-500/20 text-xs flex-shrink-0">Active</Badge>
                      ) : (
                        <Badge className="bg-white/8 text-white/30 border-white/10 text-xs flex-shrink-0">Inactive</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hook.events.map((event) => (
                        <span
                          key={event}
                          className="px-2 py-0.5 rounded text-xs font-mono bg-white/5 text-white/40 border border-white/8"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="ghost" className="text-white/30 hover:text-white h-7 w-7 p-0">
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/30 hover:text-red-400 h-7 w-7 p-0"
                      onClick={() => setWebhooks((prev) => prev.filter((w) => w.id !== hook.id))}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event reference */}
        <div className="mt-6 p-4 rounded-xl bg-white/2 border border-white/6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-medium text-white">Webhook Payload Format</h3>
          </div>
          <pre className="text-xs text-white/40 font-mono overflow-x-auto">
{`{
  "id": "evt_xyz",
  "type": "webinar.completed",
  "timestamp": "2025-03-15T12:00:00Z",
  "version": "1.0",
  "workspaceId": "ws_abc",
  "data": { ... }
}`}
          </pre>
        </div>
      </section>
    </div>
  );
}
