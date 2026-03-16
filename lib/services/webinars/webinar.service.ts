// lib/services/webinars/webinar.service.ts
import { prisma } from "@/lib/db/prisma";
import { PLANS, isWithinLimit, type PlanKey } from "@/lib/config/plans";
import { webhookDispatcher } from "@/lib/adapters/webhooks/dispatcher";
import type {
  IWebinarService,
  CreateWebinarInput,
  UsageLimitResult,
} from "@/lib/services/interfaces";
import type { Webinar } from "@prisma/client";
import { nanoid } from "nanoid";

export class WebinarService implements IWebinarService {
  // generate() is handled by the API route (heavy OpenAI work)
  // This service owns CRUD + lifecycle operations

  async generate(_input: unknown): Promise<any> {
    throw new Error("Use /api/webinars/generate for AI generation");
  }

  async create(workspaceId: string, input: CreateWebinarInput): Promise<Webinar> {
    const slug = `webinar-${nanoid(10)}`;
    const webinar = await prisma.webinar.create({
      data: {
        workspaceId,
        title: input.title,
        niche: input.niche as any,
        status: "DRAFT",
        mode: "EVERGREEN",
        slug,
        templateId: input.templateId,
        generatorInputs: (input.generatorInputs as any) ?? undefined,
      },
    });

    await prisma.analyticsEvent.create({
      data: { workspaceId, webinarId: webinar.id, event: "webinar.created" },
    });

    return webinar;
  }

  async publish(webinarId: string): Promise<Webinar> {
    const webinar = await prisma.webinar.update({
      where: { id: webinarId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });

    await prisma.planUsage.update({
      where: { workspaceId: webinar.workspaceId },
      data: { webinarsPublished: { increment: 1 } },
    });

    await webhookDispatcher.dispatch(webinar.workspaceId, "webinar.published", {
      webinarId: webinar.id,
      title: webinar.title,
      slug: webinar.slug,
    });

    return webinar;
  }

  async unpublish(webinarId: string): Promise<Webinar> {
    return prisma.webinar.update({
      where: { id: webinarId },
      data: { status: "DRAFT" },
    });
  }

  async getById(webinarId: string): Promise<Webinar | null> {
    return prisma.webinar.findUnique({ where: { id: webinarId } });
  }

  async listByWorkspace(workspaceId: string): Promise<Webinar[]> {
    return prisma.webinar.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
    });
  }

  async delete(webinarId: string): Promise<void> {
    await prisma.webinar.delete({ where: { id: webinarId } });
  }

  async checkUsageLimit(workspaceId: string): Promise<UsageLimitResult> {
    const [usage, subscription] = await Promise.all([
      prisma.planUsage.findUnique({ where: { workspaceId } }),
      prisma.subscription.findUnique({ where: { workspaceId } }),
    ]);

    const planKey = (subscription?.plan ?? "FREE_TRIAL") as PlanKey;
    const current = usage?.webinarsBuilt ?? 0;
    const limit = PLANS[planKey].limits.webinarsPerMonth;

    const allowed = isWithinLimit(planKey, "webinarsPerMonth", current);

    return {
      allowed,
      current,
      limit,
      reason: allowed
        ? undefined
        : `Monthly limit of ${limit} webinars reached on ${PLANS[planKey].name} plan.`,
    };
  }
}

export const webinarService = new WebinarService();
