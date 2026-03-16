// lib/services/affiliates/affiliate.service.ts
import { prisma } from "@/lib/db/prisma";
import { webhookDispatcher } from "@/lib/adapters/webhooks/dispatcher";
import type {
  IAffiliateService,
  AffiliateDashboard,
  AffiliateActivity,
} from "@/lib/services/interfaces";
import type { Affiliate } from "@prisma/client";
import { nanoid } from "nanoid";

export class AffiliateService implements IAffiliateService {
  async apply(userId: string, workspaceId: string): Promise<Affiliate> {
    const existing = await prisma.affiliate.findUnique({ where: { userId } });
    if (existing) return existing;

    const referralCode = this.generateCode();

    return prisma.affiliate.create({
      data: {
        workspaceId,
        userId,
        referralCode,
        status: "ACTIVE", // auto-approve; change to PENDING for manual review
        commissionRate: 0.30,
      },
    });
  }

  async getByCode(code: string): Promise<Affiliate | null> {
    return prisma.affiliate.findUnique({ where: { referralCode: code } });
  }

  async trackReferral(affiliateCode: string, referredUserId: string): Promise<void> {
    const affiliate = await this.getByCode(affiliateCode);
    if (!affiliate) return;

    const existing = await prisma.referral.findUnique({
      where: { referredUserId },
    });
    if (existing) return; // already tracked

    await prisma.referral.create({
      data: {
        affiliateId: affiliate.id,
        referredUserId,
        referralCode: affiliateCode,
      },
    });

    await webhookDispatcher.dispatch(affiliate.workspaceId, "affiliate.referral.created", {
      affiliateId: affiliate.id,
      referralCode: affiliateCode,
      referredUserId,
    });
  }

  async recordConversion(referredUserId: string): Promise<void> {
    const referral = await prisma.referral.findUnique({
      where: { referredUserId },
      include: { affiliate: true },
    });

    if (!referral || referral.convertedAt) return;

    await prisma.referral.update({
      where: { id: referral.id },
      data: { convertedAt: new Date() },
    });
  }

  async createCommission(
    affiliateId: string,
    amount: number,
    description: string
  ): Promise<void> {
    await prisma.commission.create({
      data: {
        affiliateId,
        amount,
        currency: "usd",
        status: "PENDING",
        description,
      },
    });
  }

  async getDashboard(affiliateId: string): Promise<AffiliateDashboard> {
    const affiliate = await prisma.affiliate.findUnique({
      where: { id: affiliateId },
      include: {
        referrals: true,
        commissions: true,
      },
    });

    if (!affiliate) throw new Error("Affiliate not found");

    const conversions = affiliate.referrals.filter((r) => r.convertedAt).length;
    const pendingCommissions = affiliate.commissions
      .filter((c) => c.status === "PENDING" || c.status === "APPROVED")
      .reduce((sum, c) => sum + c.amount, 0);
    const paidCommissions = affiliate.commissions
      .filter((c) => c.status === "PAID")
      .reduce((sum, c) => sum + c.amount, 0);

    const recentActivity: AffiliateActivity[] = [
      ...affiliate.referrals.slice(-5).map((r) => ({
        type: "referral" as const,
        description: `New referral signup`,
        createdAt: r.createdAt,
      })),
      ...affiliate.commissions.slice(-5).map((c) => ({
        type: "commission" as const,
        description: c.description ?? "Commission earned",
        amount: c.amount,
        createdAt: c.createdAt,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

    return {
      affiliate,
      totalReferrals: affiliate.referrals.length,
      conversions,
      pendingCommissions,
      paidCommissions,
      totalEarnings: pendingCommissions + paidCommissions,
      recentActivity,
    };
  }

  private generateCode(): string {
    // 6-char alphanumeric, uppercase
    return nanoid(6).toUpperCase().replace(/[^A-Z0-9]/g, "X");
  }
}

export const affiliateService = new AffiliateService();
