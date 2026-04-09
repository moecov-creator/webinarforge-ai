// lib/adapters/stripe/billing.ts
import Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";
import { PLANS, type PlanKey } from "@/lib/config/plans";
import type { IBillingService, SubscriptionDetails } from "@/lib/services/interfaces";

function stripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
  });
}

const PRICE_ID_MAP: Record<string, string | undefined> = {
  STARTER: process.env.STRIPE_PRICE_STARTER_MONTHLY,
  PRO: process.env.STRIPE_PRICE_PRO_MONTHLY,
  SCALE: process.env.STRIPE_PRICE_SCALE_MONTHLY,
  EARLY_BIRD: process.env.STRIPE_PRICE_EARLY_BIRD,
};

export class StripeBillingAdapter implements IBillingService {
  async createCheckoutSession(workspaceId: string, planKey: string): Promise<string> {
    const priceId = PRICE_ID_MAP[planKey];
    if (!priceId) throw new Error(`No Stripe price configured for plan: ${planKey}`);

    const subscription = await prisma.subscription.findUnique({ where: { workspaceId } });
    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const member = await prisma.workspaceMember.findFirst({
        where: { workspaceId, role: "owner" },
        include: { user: true },
      });
      const customer = await stripe().customers.create({
        email: member?.user.email,
        metadata: { workspaceId },
      });
      customerId = customer.id;

      await prisma.subscription.upsert({
        where: { workspaceId },
        update: { stripeCustomerId: customerId },
        create: {
          workspaceId,
          stripeCustomerId: customerId,
          plan: "FREE_TRIAL",
          status: "trialing",
        },
      });
    }

    // Early bird is a one-time payment, not a subscription
    const isEarlyBird = planKey === "EARLY_BIRD"

    const session = await stripe().checkout.sessions.create({
      customer: customerId,
      mode: isEarlyBird ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: isEarlyBird
        ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?earlybird=true`
        : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { workspaceId, planKey },
      ...(isEarlyBird
        ? {
            payment_intent_data: {
              metadata: { workspaceId, planKey },
            },
          }
        : {
            subscription_data: {
              metadata: { workspaceId, planKey },
            },
          }),
    });

    return session.url!;
  }

  async createPortalSession(workspaceId: string): Promise<string> {
    const subscription = await prisma.subscription.findUnique({ where: { workspaceId } });
    if (!subscription?.stripeCustomerId) throw new Error("No Stripe customer found");

    const session = await stripe().billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    return session.url;
  }

  async getSubscription(workspaceId: string): Promise<SubscriptionDetails | null> {
    const sub = await prisma.subscription.findUnique({ where: { workspaceId } });
    if (!sub) return null;
    return {
      plan: sub.plan,
      status: sub.status,
      trialEndsAt: sub.trialEndsAt ?? undefined,
      currentPeriodEnd: sub.currentPeriodEnd ?? undefined,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    };
  }

  async handleWebhook(rawBody: string, signature: string): Promise<void> {
    const event = stripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {

      // ── Subscription checkout (STARTER, PRO, SCALE) ──
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const workspaceId = session.metadata?.workspaceId;
        const planKey = session.metadata?.planKey as PlanKey;
        if (!workspaceId || !planKey) break;

        if (planKey === "EARLY_BIRD") {
          // One-time payment — set as lifetime active, no subscription ID
          await prisma.subscription.update({
            where: { workspaceId },
            data: {
              plan: "EARLY_BIRD",
              status: "active",
              cancelAtPeriodEnd: false,
            },
          });
        } else {
          await prisma.subscription.update({
            where: { workspaceId },
            data: {
              plan: planKey,
              status: "active",
              stripeSubscriptionId: session.subscription as string,
            },
          });
        }
        break;
      }

      // ── Subscription updated ──
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const workspaceId = sub.metadata?.workspaceId;
        if (!workspaceId) break;

        await prisma.subscription.update({
          where: { workspaceId },
          data: {
            status: sub.status,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }

      // ── Subscription cancelled ──
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const workspaceId = sub.metadata?.workspaceId;
        if (!workspaceId) break;

        await prisma.subscription.update({
          where: { workspaceId },
          data: { status: "cancelled", plan: "FREE_TRIAL" },
        });
        break;
      }
    }
  }
}

export const billingAdapter = new StripeBillingAdapter();
