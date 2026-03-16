// lib/config/webhooks.ts

export type WebhookEventType =
  | "webinar.created"
  | "webinar.published"
  | "webinar.registration.created"
  | "webinar.room.joined"
  | "webinar.completed"
  | "cta.clicked"
  | "plan.upgraded"
  | "affiliate.referral.created"
  | "purchase.completed";

export const WEBHOOK_EVENTS: Record<string, WebhookEventType> = {
  WEBINAR_CREATED: "webinar.created",
  WEBINAR_PUBLISHED: "webinar.published",
  WEBINAR_REGISTRATION_CREATED: "webinar.registration.created",
  WEBINAR_ROOM_JOINED: "webinar.room.joined",
  WEBINAR_COMPLETED: "webinar.completed",
  CTA_CLICKED: "cta.clicked",
  PLAN_UPGRADED: "plan.upgraded",
  AFFILIATE_REFERRAL_CREATED: "affiliate.referral.created",
  PURCHASE_COMPLETED: "purchase.completed",
};

export interface WebhookPayload<T = Record<string, unknown>> {
  id: string;
  type: WebhookEventType;
  timestamp: string;
  version: "1.0";
  workspaceId: string;
  data: T;
}
