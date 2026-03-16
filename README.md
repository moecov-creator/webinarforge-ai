# WebinarForge AI

**The AI Operating System for Automated Evergreen Webinars**

Generate scripts, slide outlines, evergreen rooms, timed comments, affiliate funnels, and AI presenter delivery — in one platform.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Auth | Clerk |
| Billing | Stripe |
| AI | OpenAI GPT-4o |
| Storage | UploadThing |
| Queue | Redis / BullMQ |
| Email | Resend |
| Validation | Zod |

---

## Project Structure

```
webinarforge/
├── app/
│   ├── (marketing)/          # Public pages: /, /pricing, /affiliates
│   ├── (auth)/               # /sign-in, /sign-up, /onboarding
│   ├── (dashboard)/          # All /dashboard/* routes
│   └── api/
│       ├── webhooks/stripe/  # Stripe event handler
│       ├── webinars/generate/ # AI generation endpoint
│       └── user/onboarding/  # Onboarding completion
│
├── components/
│   ├── ui/                   # shadcn/ui base components
│   ├── dashboard/            # Dashboard-specific components
│   ├── webinars/             # Webinar editor components
│   └── evergreen/            # Evergreen room components
│
├── lib/
│   ├── config/
│   │   ├── plans.ts          # Plan limits + feature flags
│   │   └── webhooks.ts       # Webhook event type definitions
│   ├── db/
│   │   └── prisma.ts         # Prisma client singleton
│   ├── services/
│   │   └── interfaces.ts     # Core service contracts
│   └── adapters/
│       ├── stripe/           # Stripe billing adapter
│       └── webhooks/         # Outbound webhook dispatcher
│
├── prisma/
│   ├── schema.prisma         # Complete data model
│   └── seed.ts               # Demo data seeder
│
├── types/
│   └── webinar.ts            # Webinar DTOs and input types
│
├── .env.example              # All required environment variables
└── README.md
```

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd webinarforge
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

**Required services to configure:**
- [Clerk](https://clerk.com) — authentication
- [Stripe](https://stripe.com) — billing
- [OpenAI](https://openai.com) — AI generation
- PostgreSQL database (local or Supabase/Railway/Neon)

### 3. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (dev)
npm run db:push

# Seed demo data
npm run db:seed
```

### 4. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Stripe Setup

### Create Products + Prices in Stripe Dashboard

Create three recurring subscription products:

| Product | Monthly Price | Price ID env var |
|---------|--------------|-----------------|
| Starter | $97/mo | `STRIPE_PRICE_STARTER_MONTHLY` |
| Pro | $297/mo | `STRIPE_PRICE_PRO_MONTHLY` |
| Scale | $997/mo | `STRIPE_PRICE_SCALE_MONTHLY` |

### Stripe Webhook

Point your Stripe webhook to:
```
https://your-domain.com/api/webhooks/stripe
```

Required events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

For local development:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Copy publishable and secret keys to `.env.local`
3. Set redirect URLs in Clerk dashboard:
   - Sign-in redirect: `/dashboard`
   - Sign-up redirect: `/onboarding`

---

## Architecture Decisions

### Plan Enforcement
All plan limits are defined in `lib/config/plans.ts`. Use `canUseFeature()` and `isWithinLimit()` throughout server actions and API routes. Never hardcode plan names.

### AI Generation
All AI prompts are isolated in `prisma/seed.ts` (PromptTemplate table) and `app/api/webinars/generate/route.ts`. To iterate on prompts, update the PromptTemplate records — no code changes required.

### Webhooks
Outbound webhooks use HMAC-SHA256 signing. The `WebhookDispatcher` in `lib/adapters/webhooks/dispatcher.ts` handles signing and retry logic. In production, replace direct `fetch()` with a BullMQ/Redis job queue.

### Integrations
Each external provider implements `IIntegrationAdapter`. Current adapters:
- Stripe (billing) — connected
- Webhook dispatcher — connected
- Zapier, GoHighLevel, ClickFunnels — scaffolded, awaiting OAuth tokens

### Multi-tenancy
Everything scopes to `workspaceId`. Users can belong to multiple workspaces via `WorkspaceMember`. The Scale plan supports 5 workspaces.

---

## Feature Flags

Future modules are behind env flags:

```bash
NEXT_PUBLIC_ENABLE_AI_CLOSER=false    # Post-webinar sales chat
NEXT_PUBLIC_ENABLE_CLONER=false       # Webinar transcript cloner
NEXT_PUBLIC_ENABLE_MARKETPLACE=false  # Template marketplace
```

Set to `true` to show UI for these modules once built.

---

## Seed Data

Running `npm run db:seed` creates:
- Demo user: `demo@webinarforge.ai`
- Demo workspace with Pro subscription
- 5 niche packs (Real Estate, Coaching, Travel, SaaS, Local)
- 5 webinar templates
- 1 sample published webinar with full sections, CTAs, timed comments
- 1 active affiliate with sample commissions
- Integration connections (Stripe active, Zapier/Webhook scaffolded)
- Prompt templates for AI generation

---

## Deployment

### Environment Requirements
- Node.js 20+
- PostgreSQL 15+
- Redis (optional for MVP, required for job queuing at scale)

### Vercel (recommended)
```bash
vercel deploy
# Set all env vars in Vercel dashboard
# Run: vercel env pull .env.local
```

### Database migrations in production
```bash
npx prisma migrate deploy
```

---

## Roadmap

| Module | Status |
|--------|--------|
| Core platform | ✅ MVP |
| AI Webinar Generator | ✅ MVP |
| Evergreen Room | ✅ MVP |
| Timed Comments Engine | ✅ MVP |
| CTA Engine | ✅ MVP |
| AI Presenter Profiles | ✅ MVP |
| Affiliate System | ✅ MVP |
| Stripe Billing | ✅ MVP |
| Webhook System | ✅ MVP |
| Template Library | ✅ MVP |
| AI Closer | 🔜 Planned |
| Webinar Cloner | 🔜 Planned |
| Marketplace | 🔜 Planned |
| Mobile app | 🔜 Planned |

---

## License

Proprietary. All rights reserved.
