// app/(dashboard)/dashboard/evergreen/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Globe, Users, PlayCircle, Settings2,
  BarChart2, ExternalLink, Plus,
} from "lucide-react";

const MOCK_ROOMS = [
  {
    id: "1",
    webinarId: "1",
    title: "The 3-Step System to Land High-Ticket Coaching Clients",
    slug: "demo-coaching-abc123",
    isLive: true,
    isSimulatedLive: true,
    replayEnabled: true,
    currentViewers: 0,
    totalRegistrations: 189,
    totalCompletions: 81,
    lastActivity: "2 hours ago",
    viewerCountMin: 47,
    viewerCountMax: 312,
  },
  {
    id: "2",
    webinarId: "2",
    title: "Real Estate Lead Machine: 10 Qualified Appointments Every Month",
    slug: "real-estate-leads-xyz",
    isLive: true,
    isSimulatedLive: true,
    replayEnabled: true,
    currentViewers: 0,
    totalRegistrations: 78,
    totalCompletions: 30,
    lastActivity: "5 hours ago",
    viewerCountMin: 20,
    viewerCountMax: 150,
  },
];

export default function EvergreenPage() {
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Evergreen Rooms"
        description="Manage your always-on webinar rooms. Viewers register and watch on their schedule."
      >
        <Link href="/dashboard/webinars/new">
          <Button className="gradient-brand border-0 hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            New Webinar
          </Button>
        </Link>
      </PageHeader>

      {MOCK_ROOMS.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="No evergreen rooms yet"
          description="Publish a webinar to automatically create an evergreen room."
          action={
            <Link href="/dashboard/webinars/new">
              <Button className="gradient-brand border-0">
                Create Your First Webinar
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {MOCK_ROOMS.map((room) => (
            <div
              key={room.id}
              className="p-5 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Status badges */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <Badge className="bg-green-500/15 text-green-400 border-green-500/20 text-xs">
                        Active
                      </Badge>
                    </div>
                    {room.isSimulatedLive && (
                      <Badge className="bg-red-500/15 text-red-400 border-red-500/20 text-xs">
                        Simulated Live
                      </Badge>
                    )}
                    {room.replayEnabled && (
                      <Badge className="bg-white/5 text-white/30 border-white/8 text-xs">
                        Replay On
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-white text-sm mb-3 leading-snug">
                    {room.title}
                  </h3>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2.5 rounded-lg bg-white/3">
                      <p className="font-display text-base font-bold text-white">
                        {room.totalRegistrations}
                      </p>
                      <p className="text-[10px] text-white/30 mt-0.5">Registrations</p>
                    </div>
                    <div className="text-center p-2.5 rounded-lg bg-white/3">
                      <p className="font-display text-base font-bold text-white">
                        {room.totalCompletions}
                      </p>
                      <p className="text-[10px] text-white/30 mt-0.5">Completions</p>
                    </div>
                    <div className="text-center p-2.5 rounded-lg bg-white/3">
                      <p className="font-display text-base font-bold text-white">
                        {Math.round((room.totalCompletions / Math.max(room.totalRegistrations, 1)) * 100)}%
                      </p>
                      <p className="text-[10px] text-white/30 mt-0.5">Completion Rate</p>
                    </div>
                  </div>

                  {/* Viewer count range */}
                  <p className="text-xs text-white/25">
                    Simulated viewers: {room.viewerCountMin}–{room.viewerCountMax} ·
                    Last activity: {room.lastActivity}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link href={`/dashboard/evergreen/${room.slug}`}>
                    <Button
                      size="sm"
                      className="gradient-brand border-0 text-xs h-8 w-full hover:opacity-90"
                    >
                      <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                      Open Room
                    </Button>
                  </Link>
                  <div className="flex gap-1.5">
                    <Link href={`/dashboard/analytics?webinar=${room.webinarId}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-white/10 text-white/40 hover:text-white bg-white/3 h-8 flex-1"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/webinars/${room.webinarId}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-white/10 text-white/40 hover:text-white bg-white/3 h-8 flex-1"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <a
                      href={`/watch/${room.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-white/10 text-white/40 hover:text-white bg-white/3 h-8 flex-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info callout */}
      <div className="mt-8 p-4 rounded-xl bg-white/2 border border-white/6">
        <div className="flex items-start gap-3">
          <Globe className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-white/60 mb-1">How evergreen rooms work</p>
            <p className="text-xs text-white/30 leading-relaxed">
              Each published webinar gets a permanent room URL. Visitors register, then enter a
              simulated live session with timed comments and CTA popups. Replay mode lets registrants
              re-watch at any time. All events are tracked and synced to your integrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
