// lib/config/webhooks.ts
// Canonical webhook event definitions

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

export interface WebhookPayload<T = Record<string, unknown>> {
  id: string;
  type: WebhookEventType;
  timestamp: string; // ISO 8601
  version: "1.0";
  workspaceId: string;
  data: T;
}

// Typed payloads per event

export interface WebinarCreatedPayload {
  webinarId: string;
  title: string;
  niche: string;
  status: string;
}

export interface WebinarRegistrationPayload {
  webinarId: string;
  email: string;
  name?: string;
  source?: string;
  affiliateCode?: string;
}

export interface CTAClickedPayload {
  webinarId: string;
  ctaId: string;
  ctaType: string;
  sessionId?: string;
  email?: string;
}

export interface PlanUpgradedPayload {
  workspaceId: string;
  fromPlan: string;
  toPlan: string;
  userId: string;
}

export interface AffiliateReferralPayload {
  affiliateId: string;
  referralCode: string;
  referredEmail: string;
}

export interface PurchaseCompletedPayload {
  workspaceId: string;
  amount: number;
  currency: string;
  stripeSessionId?: string;
  plan?: string;
}
