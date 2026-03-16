// lib/adapters/webhooks/dispatcher.ts
// Outbound webhook dispatcher — signs, queues, and delivers webhook payloads

import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import type { IWebhookService, CreateWebhookInput, WebhookSubscriptionSummary } from "@/lib/services/interfaces";
import { nanoid } from "nanoid";

export class WebhookDispatcher implements IWebhookService {
  async dispatch(workspaceId: string, type: string, payload: unknown): Promise<void> {
    // Log the event
    await prisma.webhookEvent.create({
      data: {
        workspaceId,
        type: type as any,
        payload: payload as any,
        source: "internal",
      },
    });

    // Find active subscriptions for this event type
    const subscriptions = await prisma.webhookSubscription.findMany({
      where: {
        workspaceId,
        isActive: true,
        events: { has: type },
      },
    });

    // Queue delivery for each subscription
    for (const sub of subscriptions) {
      const envelope = {
        id: `evt_${nanoid(16)}`,
        type,
        timestamp: new Date().toISOString(),
        version: "1.0",
        workspaceId,
        data: payload,
      };

      const signature = this.sign(JSON.stringify(envelope), sub.secret);

      // In production: push to Redis queue / BullMQ job instead of direct fetch
      this.deliverWithRetry(sub.url, envelope, signature).catch((err) => {
        console.error(`Webhook delivery failed for ${sub.url}:`, err);
      });
    }
  }

  private async deliverWithRetry(
    url: string,
    payload: unknown,
    signature: string,
    attempt = 1
  ): Promise<void> {
    const maxAttempts = 3;
    const body = JSON.stringify(payload);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WebinarForge-Signature": signature,
          "X-WebinarForge-Version": "1.0",
        },
        body,
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok && attempt < maxAttempts) {
        await this.delay(attempt * 2000);
        return this.deliverWithRetry(url, payload, signature, attempt + 1);
      }
    } catch (err) {
      if (attempt < maxAttempts) {
        await this.delay(attempt * 2000);
        return this.deliverWithRetry(url, payload, signature, attempt + 1);
      }
      throw err;
    }
  }

  private sign(payload: string, secret: string): string {
    return "sha256=" + crypto
      .createHmac("sha256", secret)
      .update(payload, "utf8")
      .digest("hex");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async subscribe(workspaceId: string, input: CreateWebhookInput): Promise<void> {
    await prisma.webhookSubscription.create({
      data: {
        workspaceId,
        url: input.url,
        events: input.events,
        description: input.description,
        secret: nanoid(32),
        isActive: true,
      },
    });
  }

  async listSubscriptions(workspaceId: string): Promise<WebhookSubscriptionSummary[]> {
    const subs = await prisma.webhookSubscription.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return subs.map((s) => ({
      id: s.id,
      url: s.url,
      events: s.events,
      isActive: s.isActive,
      createdAt: s.createdAt,
    }));
  }
}

export const webhookDispatcher = new WebhookDispatcher();
