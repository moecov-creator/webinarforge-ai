// lib/services/analytics/analytics.service.ts
import { prisma } from "@/lib/db/prisma";
import type {
  IAnalyticsService,
  TrackEventInput,
  DateRange,
  AnalyticsSummary,
  WebinarStats,
} from "@/lib/services/interfaces";

export class AnalyticsService implements IAnalyticsService {
  async track(event: TrackEventInput): Promise<void> {
    await prisma.analyticsEvent.create({
      data: {
        workspaceId: event.workspaceId,
        webinarId: event.webinarId,
        userId: event.userId,
        sessionId: event.sessionId,
        event: event.event,
        properties: (event.properties as any) ?? undefined,
        ipAddress: event.ipAddress,
      },
    });
  }

  async getSummary(
    workspaceId: string,
    dateRange?: DateRange
  ): Promise<AnalyticsSummary> {
    const where = {
      workspaceId,
      ...(dateRange
        ? { createdAt: { gte: dateRange.from, lte: dateRange.to } }
        : {}),
    };

    const [
      registrations,
      roomVisits,
      completions,
      ctaClicks,
      replayViews,
      affiliateReferrals,
      trialConversions,
      planUpgrades,
    ] = await Promise.all([
      prisma.analyticsEvent.count({ where: { ...where, event: "registration.created" } }),
      prisma.analyticsEvent.count({ where: { ...where, event: "webinar.room.joined" } }),
      prisma.analyticsEvent.count({ where: { ...where, event: "webinar.completed" } }),
      prisma.analyticsEvent.count({ where: { ...where, event: "cta.clicked" } }),
      prisma.analyticsEvent.count({ where: { ...where, event: "webinar.replay.viewed" } }),
      prisma.analyticsEvent.count({ where: { ...where, event: "affiliate.referral.created" } }),
      prisma.analyticsEvent.count({ where: { ...where, event: "trial.converted" } }),
      prisma.analyticsEvent.count({ where: { ...where, event: "plan.upgraded" } }),
    ]);

    return {
      totalRegistrations: registrations,
      totalRoomVisits: roomVisits,
      totalCompletions: completions,
      totalCTAClicks: ctaClicks,
      replayViews,
      affiliateReferrals,
      trialConversions,
      planUpgrades,
    };
  }

  async getWebinarStats(webinarId: string): Promise<WebinarStats> {
    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId },
      include: { registrations: true },
    });

    if (!webinar) throw new Error("Webinar not found");

    const [visits, completions, ctaClicks] = await Promise.all([
      prisma.analyticsEvent.count({ where: { webinarId, event: "webinar.room.joined" } }),
      prisma.analyticsEvent.count({ where: { webinarId, event: "webinar.completed" } }),
      prisma.analyticsEvent.count({ where: { webinarId, event: "cta.clicked" } }),
    ]);

    const completionRate = visits > 0 ? completions / visits : 0;
    const ctaClickRate = completions > 0 ? ctaClicks / completions : 0;

    // Drop-off analysis — placeholder (requires richer event data)
    const dropOffPoints = [
      { atSeconds: 300, dropOffCount: Math.round(visits * 0.05) },
      { atSeconds: 900, dropOffCount: Math.round(visits * 0.12) },
      { atSeconds: 1800, dropOffCount: Math.round(visits * 0.18) },
      { atSeconds: 2700, dropOffCount: Math.round(visits * 0.08) },
    ];

    return {
      webinarId,
      registrations: webinar.registrations.length,
      roomVisits: visits,
      completionRate,
      ctaClickRate,
      avgWatchTime: 0, // requires session duration tracking
      dropOffPoints,
    };
  }
}

export const analyticsService = new AnalyticsService();
