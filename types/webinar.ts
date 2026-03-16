// types/webinar.ts

export interface WebinarGeneratorInput {
  niche: string;
  idealAudience: string;
  painPoint: string;
  desiredOutcome: string;
  offerName: string;
  offerType: string;
  pricePoint: number;
  tone: "professional" | "conversational" | "motivational" | "educational" | "casual";
  trafficSource?: string;
  objections?: string;
  guarantee?: string;
  ctaGoal?: string;
}

export interface WebinarWithRelations {
  id: string;
  title: string;
  subtitle: string | null;
  niche: string;
  status: string;
  mode: string;
  slug: string;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
  hasWatermark: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;
  sections: WebinarSectionDTO[];
  slides: SlideDTO[];
  offers: OfferDTO[];
  bonuses: BonusDTO[];
  objections: ObjectionDTO[];
  ctaSequences: CTASequenceDTO[];
  timedComments: TimedCommentDTO[];
  evergreenConfig: EvergreenConfigDTO | null;
}

export interface WebinarSectionDTO {
  id: string;
  type: string;
  title: string | null;
  content: string;
  order: number;
  notes: string | null;
}

export interface SlideDTO {
  id: string;
  title: string | null;
  body: string | null;
  bulletPoints: string[] | null;
  imageUrl: string | null;
  speakerNotes: string | null;
  order: number;
}

export interface OfferDTO {
  id: string;
  name: string;
  type: string;
  price: number | null;
  originalPrice: number | null;
  description: string | null;
  valueItems: string[] | null;
  checkoutUrl: string | null;
  order: number;
}

export interface BonusDTO {
  id: string;
  name: string;
  description: string | null;
  value: number | null;
  order: number;
}

export interface ObjectionDTO {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface CTASequenceDTO {
  id: string;
  type: string;
  triggerAt: number;
  headline: string;
  body: string | null;
  buttonText: string;
  buttonUrl: string | null;
  isActive: boolean;
  order: number;
}

export interface TimedCommentDTO {
  id: string;
  type: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  triggerAt: number;
  isActive: boolean;
  order: number;
}

export interface EvergreenConfigDTO {
  id: string;
  isSimulatedLive: boolean;
  viewerCountMin: number;
  viewerCountMax: number;
  replayEnabled: boolean;
  scheduleConfig: unknown;
  autoEmailEnabled: boolean;
  autoSmsEnabled: boolean;
}
