// lib/config/plans.ts
// Central plan configuration - single source of truth for all plan limits and features

export type PlanKey = "FREE_TRIAL" | "STARTER" | "PRO" | "SCALE" | "ENTERPRISE";

export interface PlanConfig {
  key: PlanKey;
  name: string;
  tagline: string;
  price: number | null; // null = contact sales
  priceAnnual?: number;
  stripePriceId?: string;
  stripePriceIdAnnual?: string;
  trialDays?: number;
  limits: PlanLimits;
  features: PlanFeatures;
  badge?: string;
}

export interface PlanLimits {
  webinarsPerMonth: number | null;      // null = unlimited
  aiGenerationsPerMonth: number | null;
  nicheTemplates: number | null;
  aiPresenters: number;
  teamSeats: number;
  workspaces: number;
  exports: number | null;
}

export interface PlanFeatures {
  evergreenRoom: boolean;
  timedCommentsLite: boolean;
  timedCommentsFull: boolean;
  ctaEngine: boolean;
  offerStackGenerator: boolean;
  advancedEvergreenLogic: boolean;
  aiPresenterNarration: boolean;
  basicAnalytics: boolean;
  advancedAnalytics: boolean;
  affiliateTracking: boolean;
  webhooks: boolean;
  integrations: boolean;
  whiteLabelReady: boolean;
  multiBrand: boolean;
  customBranding: boolean;
  watermark: boolean;       // true = watermark shown (free/trial)
  apiAccess: boolean;
  adminDashboard: boolean;
  prioritySupport: boolean;
}

export const PLANS: Record<PlanKey, PlanConfig> = {
  FREE_TRIAL: {
    key: "FREE_TRIAL",
    name: "Free Trial",
    tagline: "14 days. No credit card required.",
    price: 0,
    trialDays: 14,
    limits: {
      webinarsPerMonth: 2,
      aiGenerationsPerMonth: 10,
      nicheTemplates: 3,
      aiPresenters: 1,
      teamSeats: 1,
      workspaces: 1,
      exports: 1,
    },
    features: {
      evergreenRoom: true,
      timedCommentsLite: true,
      timedCommentsFull: false,
      ctaEngine: false,
      offerStackGenerator: false,
      advancedEvergreenLogic: false,
      aiPresenterNarration: false,
      basicAnalytics: true,
      advancedAnalytics: false,
      affiliateTracking: false,
      webhooks: false,
      integrations: false,
      whiteLabelReady: false,
      multiBrand: false,
      customBranding: false,
      watermark: true,
      apiAccess: false,
      adminDashboard: false,
      prioritySupport: false,
    },
  },

  STARTER: {
    key: "STARTER",
    name: "Starter",
    tagline: "For creators launching their first evergreen funnel.",
    price: 97,
    priceAnnual: 970,
    limits: {
      webinarsPerMonth: 3,
      aiGenerationsPerMonth: 30,
      nicheTemplates: 5,
      aiPresenters: 2,
      teamSeats: 1,
      workspaces: 1,
      exports: null,
    },
    features: {
      evergreenRoom: true,
      timedCommentsLite: true,
      timedCommentsFull: false,
      ctaEngine: true,
      offerStackGenerator: false,
      advancedEvergreenLogic: false,
      aiPresenterNarration: true,
      basicAnalytics: true,
      advancedAnalytics: false,
      affiliateTracking: false,
      webhooks: false,
      integrations: false,
      whiteLabelReady: false,
      multiBrand: false,
      customBranding: false,
      watermark: false,
      apiAccess: false,
      adminDashboard: false,
      prioritySupport: false,
    },
  },

  PRO: {
    key: "PRO",
    name: "Pro",
    tagline: "For serious operators scaling evergreen revenue.",
    price: 297,
    priceAnnual: 2970,
    badge: "Most Popular",
    limits: {
      webinarsPerMonth: null,
      aiGenerationsPerMonth: null,
      nicheTemplates: null,
      aiPresenters: 5,
      teamSeats: 3,
      workspaces: 1,
      exports: null,
    },
    features: {
      evergreenRoom: true,
      timedCommentsLite: true,
      timedCommentsFull: true,
      ctaEngine: true,
      offerStackGenerator: true,
      advancedEvergreenLogic: true,
      aiPresenterNarration: true,
      basicAnalytics: true,
      advancedAnalytics: false,
      affiliateTracking: true,
      webhooks: true,
      integrations: true,
      whiteLabelReady: false,
      multiBrand: false,
      customBranding: false,
      watermark: false,
      apiAccess: false,
      adminDashboard: false,
      prioritySupport: false,
    },
  },

  SCALE: {
    key: "SCALE",
    name: "Scale",
    tagline: "For agencies and multi-brand operators.",
    price: 997,
    priceAnnual: 9970,
    limits: {
      webinarsPerMonth: null,
      aiGenerationsPerMonth: null,
      nicheTemplates: null,
      aiPresenters: 20,
      teamSeats: 10,
      workspaces: 5,
      exports: null,
    },
    features: {
      evergreenRoom: true,
      timedCommentsLite: true,
      timedCommentsFull: true,
      ctaEngine: true,
      offerStackGenerator: true,
      advancedEvergreenLogic: true,
      aiPresenterNarration: true,
      basicAnalytics: true,
      advancedAnalytics: true,
      affiliateTracking: true,
      webhooks: true,
      integrations: true,
      whiteLabelReady: true,
      multiBrand: true,
      customBranding: false,
      watermark: false,
      apiAccess: false,
      adminDashboard: true,
      prioritySupport: true,
    },
  },

  ENTERPRISE: {
    key: "ENTERPRISE",
    name: "Enterprise",
    tagline: "Custom everything. Built around your operation.",
    price: null,
    limits: {
      webinarsPerMonth: null,
      aiGenerationsPerMonth: null,
      nicheTemplates: null,
      aiPresenters: null,
      teamSeats: null,
      workspaces: null,
      exports: null,
    },
    features: {
      evergreenRoom: true,
      timedCommentsLite: true,
      timedCommentsFull: true,
      ctaEngine: true,
      offerStackGenerator: true,
      advancedEvergreenLogic: true,
      aiPresenterNarration: true,
      basicAnalytics: true,
      advancedAnalytics: true,
      affiliateTracking: true,
      webhooks: true,
      integrations: true,
      whiteLabelReady: true,
      multiBrand: true,
      customBranding: true,
      watermark: false,
      apiAccess: true,
      adminDashboard: true,
      prioritySupport: true,
    },
  },
};

export function getPlan(key: PlanKey): PlanConfig {
  return PLANS[key];
}

export function canUseFeature(
  planKey: PlanKey,
  feature: keyof PlanFeatures
): boolean {
  return PLANS[planKey]?.features[feature] ?? false;
}

export function getLimit(
  planKey: PlanKey,
  limit: keyof PlanLimits
): number | null {
  return PLANS[planKey]?.limits[limit] ?? 0;
}

export function isWithinLimit(
  planKey: PlanKey,
  limit: keyof PlanLimits,
  current: number
): boolean {
  const max = getLimit(planKey, limit);
  if (max === null) return true; // unlimited
  return current < max;
}
