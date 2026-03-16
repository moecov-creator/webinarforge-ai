// lib/services/interfaces.ts
// Core service contracts — all services implement these interfaces

import type { Webinar, AIPresenter, Affiliate } from "@prisma/client";
import type { WebinarGeneratorInput } from "@/types/webinar";

// ─── Webinar Service ───────────────────────────────────

export interface IWebinarService {
  generate(input: WebinarGeneratorInput): Promise<GeneratedWebinarDraft>;
  create(workspaceId: string, input: CreateWebinarInput): Promise<Webinar>;
  publish(webinarId: string): Promise<Webinar>;
  unpublish(webinarId: string): Promise<Webinar>;
  getById(webinarId: string): Promise<Webinar | null>;
  listByWorkspace(workspaceId: string): Promise<Webinar[]>;
  delete(webinarId: string): Promise<void>;
  checkUsageLimit(workspaceId: string): Promise<UsageLimitResult>;
}

export interface GeneratedWebinarDraft {
  titleOptions: string[];
  openingHooks: string[];
  promiseStatement: string;
  credibilityAngle: string;
  beliefShifts: BeliefShift[];
  teachingPoints: TeachingPoint[];
  offerTransition: string;
  offerStack: GeneratedOffer;
  bonuses: GeneratedBonus[];
  urgencySection: string;
  ctaCopy: CTACopy;
  faqItems: FAQItem[];
  followUpEmails: FollowUpEmail[];
}

export interface BeliefShift {
  oldBelief: string;
  newBelief: string;
  bridgeStatement: string;
}

export interface TeachingPoint {
  title: string;
  content: string;
  takeaway: string;
}

export interface GeneratedOffer {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  valueItems: string[];
}

export interface GeneratedBonus {
  name: string;
  description: string;
  value: number;
}

export interface CTACopy {
  headline: string;
  body: string;
  buttonText: string;
  urgencyLine?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FollowUpEmail {
  subject: string;
  body: string;
  sendAtHours: number; // hours after registration
}

export interface CreateWebinarInput {
  title: string;
  niche: string;
  templateId?: string;
  generatorInputs?: WebinarGeneratorInput;
}

export interface UsageLimitResult {
  allowed: boolean;
  current: number;
  limit: number | null;
  reason?: string;
}

// ─── AI Presenter Service ──────────────────────────────

export interface IAIPresenterService {
  create(workspaceId: string, input: CreatePresenterInput): Promise<AIPresenter>;
  generateNarration(presenterId: string, context: NarrationContext): Promise<string>;
  list(workspaceId: string): Promise<AIPresenter[]>;
}

export interface CreatePresenterInput {
  name: string;
  speakingStyle?: string;
  tone?: string;
  brandVoice?: string;
  nicheSpecialty?: string;
  avatarUrl?: string;
}

export interface NarrationContext {
  sectionType: string;
  content: string;
  webinarTitle?: string;
  offerName?: string;
}

// ─── Billing Service ───────────────────────────────────

export interface IBillingService {
  createCheckoutSession(workspaceId: string, planKey: string): Promise<string>; // returns URL
  createPortalSession(workspaceId: string): Promise<string>;
  getSubscription(workspaceId: string): Promise<SubscriptionDetails | null>;
  handleWebhook(rawBody: string, signature: string): Promise<void>;
}

export interface SubscriptionDetails {
  plan: string;
  status: string;
  trialEndsAt?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
}

// ─── Analytics Service ─────────────────────────────────

export interface IAnalyticsService {
  track(event: TrackEventInput): Promise<void>;
  getSummary(workspaceId: string, dateRange?: DateRange): Promise<AnalyticsSummary>;
  getWebinarStats(webinarId: string): Promise<WebinarStats>;
}

export interface TrackEventInput {
  workspaceId: string;
  event: string;
  webinarId?: string;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, unknown>;
  ipAddress?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface AnalyticsSummary {
  totalRegistrations: number;
  totalRoomVisits: number;
  totalCompletions: number;
  totalCTAClicks: number;
  replayViews: number;
  affiliateReferrals: number;
  trialConversions: number;
  planUpgrades: number;
}

export interface WebinarStats {
  webinarId: string;
  registrations: number;
  roomVisits: number;
  completionRate: number;
  ctaClickRate: number;
  avgWatchTime: number;
  dropOffPoints: DropOffPoint[];
}

export interface DropOffPoint {
  atSeconds: number;
  dropOffCount: number;
}

// ─── Affiliate Service ─────────────────────────────────

export interface IAffiliateService {
  apply(userId: string, workspaceId: string): Promise<Affiliate>;
  getByCode(code: string): Promise<Affiliate | null>;
  trackReferral(affiliateCode: string, referredUserId: string): Promise<void>;
  getDashboard(affiliateId: string): Promise<AffiliateDashboard>;
}

export interface AffiliateDashboard {
  affiliate: Affiliate;
  totalReferrals: number;
  conversions: number;
  pendingCommissions: number;
  paidCommissions: number;
  totalEarnings: number;
  recentActivity: AffiliateActivity[];
}

export interface AffiliateActivity {
  type: "referral" | "commission" | "payout";
  description: string;
  amount?: number;
  createdAt: Date;
}

// ─── Integration Adapter Contract ─────────────────────

export interface IIntegrationAdapter {
  provider: string;
  syncLead(data: LeadSyncData): Promise<void>;
  syncWebinarEvent(data: WebinarEventSyncData): Promise<void>;
  syncCTAEvent(data: CTAEventSyncData): Promise<void>;
  syncPurchase(data: PurchaseSyncData): Promise<void>;
  isConnected(workspaceId: string): Promise<boolean>;
}

export interface LeadSyncData {
  workspaceId: string;
  email: string;
  name?: string;
  source?: string;
  webinarId?: string;
  tags?: string[];
}

export interface WebinarEventSyncData {
  workspaceId: string;
  webinarId: string;
  event: string;
  email?: string;
  timestamp: Date;
}

export interface CTAEventSyncData {
  workspaceId: string;
  webinarId: string;
  ctaType: string;
  email?: string;
}

export interface PurchaseSyncData {
  workspaceId: string;
  email: string;
  amount: number;
  currency: string;
  plan?: string;
}

// ─── Webhook Service ───────────────────────────────────

export interface IWebhookService {
  dispatch(workspaceId: string, type: string, payload: unknown): Promise<void>;
  subscribe(workspaceId: string, input: CreateWebhookInput): Promise<void>;
  listSubscriptions(workspaceId: string): Promise<WebhookSubscriptionSummary[]>;
}

export interface CreateWebhookInput {
  url: string;
  events: string[];
  description?: string;
}

export interface WebhookSubscriptionSummary {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: Date;
}
