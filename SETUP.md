# WebinarForge AI — Local Setup Guide

Everything you need to get from a fresh clone to a running app.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| npm | 10+ | comes with Node |
| PostgreSQL | 14+ | [postgresql.org](https://postgresql.org) or use a cloud DB |
| Git | any | [git-scm.com](https://git-scm.com) |

**Quick check:**
```bash
node -v    # should be v20+
npm -v     # should be 10+
psql --version
```

---

## Option A — Automated (recommended)

```bash
cd webinarforge
bash setup.sh
```

The script handles everything. Skip to **Step 5 — Clerk** once it completes.

---

## Option B — Manual step by step

### Step 1 — Install dependencies

```bash
cd webinarforge
npm install
```

---

### Step 2 — Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the **required** values:

#### Required to boot

```bash
DATABASE_URL="postgresql://localhost:5432/webinarforge_dev"
```

#### Required for auth (get from clerk.com)

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

#### Required for AI generation (get from platform.openai.com)

```bash
OPENAI_API_KEY="sk-..."
```

#### Required for billing (get from stripe.com — use test keys in dev)

```bash
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."   # see Stripe setup below
```

> **Tip for first boot:** You can start with just `DATABASE_URL` + Clerk keys.
> The app will load and you can explore the dashboard. Add OpenAI and Stripe
> when you're ready to test generation and billing.

---

### Step 3 — Create the database

**If using local PostgreSQL:**
```bash
createdb webinarforge_dev
```

**If using a cloud database** (Neon, Supabase, Railway — all have free tiers):
- Create a new project
- Copy the connection string into `DATABASE_URL` in `.env.local`
- Skip this step

**Neon (fastest free option):**
```
1. Go to neon.tech → New Project
2. Copy the connection string
3. Paste into DATABASE_URL in .env.local
```

---

### Step 4 — Set up the database schema

```bash
# Generate the Prisma client
npm run db:generate

# Push the schema to your database (creates all tables)
npm run db:push

# Seed demo data
npm run db:seed
```

Expected seed output:
```
🌱 Seeding WebinarForge AI...
✅ Niche packs created
✅ Demo user + workspace created
✅ AI Presenter created
✅ Templates created
✅ Sample webinar + analytics created
✅ Affiliate + commissions seeded
✅ Integrations seeded
✅ Prompt templates seeded

🎉 Seeding complete! WebinarForge AI is ready.
   Demo user: demo@webinarforge.ai
   Demo workspace: demo-workspace
```

---

### Step 5 — Set up Clerk (auth)

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application — choose **Email** and **Google** as sign-in methods
3. From the Clerk dashboard, copy:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`
4. In Clerk dashboard → **Redirects**, set:
   - Sign-in redirect URL: `http://localhost:3000/dashboard`
   - Sign-up redirect URL: `http://localhost:3000/onboarding`
   - After sign-out URL: `http://localhost:3000`

---

### Step 6 — Set up Stripe (billing)

1. Go to [stripe.com](https://stripe.com) → create a free account
2. Make sure you're in **Test mode** (toggle in top left)
3. Copy your test keys into `.env.local`:
   - **Secret key**: `sk_test_...` → `STRIPE_SECRET_KEY`
   - **Publishable key**: `pk_test_...` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Create subscription products:**

In Stripe Dashboard → Products → Add product:

| Name | Price | Billing | Copy Price ID to |
|------|-------|---------|-----------------|
| Starter | $97 | Monthly recurring | `STRIPE_PRICE_STARTER_MONTHLY` |
| Pro | $297 | Monthly recurring | `STRIPE_PRICE_PRO_MONTHLY` |
| Scale | $997 | Monthly recurring | `STRIPE_PRICE_SCALE_MONTHLY` |

**Set up local webhook forwarding:**

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then in a **separate terminal**:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` signing secret it prints into `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET="whsec_..."
```

> **Can skip Stripe for now** — the app runs fine without it. Add it when
> you're ready to test the billing flow.

---

### Step 7 — Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What you'll see

### Marketing site — `localhost:3000`
The homepage, pricing page, and affiliates page — no auth required.

### Sign up flow — `localhost:3000/sign-up`
Clerk-hosted sign-up. After signing up, you'll be redirected to `/onboarding`.

### Onboarding — `localhost:3000/onboarding`
3-step wizard that creates your workspace, free trial subscription, and default AI presenter.

### Dashboard — `localhost:3000/dashboard`
Loads the main dashboard with seed data (4 webinars, analytics, affiliate stats).

---

## Exploring with seed data

The seed creates a demo workspace you can explore without signing up:

```
Demo user:  demo@webinarforge.ai
Workspace:  demo-workspace
Plan:       PRO (active)
```

To log in as the demo user, you'd need to create a Clerk account with that email, or just sign up fresh — the onboarding creates a new workspace automatically.

---

## Common issues

### `DATABASE_URL` connection refused
```
Error: Can't reach database server at localhost:5432
```
PostgreSQL isn't running. Start it:
- **Mac:** `brew services start postgresql@16`
- **Linux:** `sudo service postgresql start`
- **Or:** use a cloud database (Neon free tier)

---

### Prisma client not generated
```
Error: @prisma/client did not initialize yet
```
Run: `npm run db:generate`

---

### Clerk redirect loop
If you get stuck in a login loop, check:
1. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly in `.env.local`
2. Clerk redirect URLs are set to `http://localhost:3000/...`
3. You're not in incognito mode with cookies blocked

---

### TypeScript errors on first boot
Next.js compiles per-request in dev mode, so TypeScript errors don't block the server from starting. Run `npm run typecheck` to see the full list. Most are type assertion issues that don't affect runtime behavior.

---

### Seed fails with unique constraint
```
Unique constraint failed on the fields: (`email`)
```
The demo user already exists. Either reset the database or the seed already ran. Safe to ignore.

To reset and reseed:
```bash
npm run db:reset
```

---

## Useful commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Push schema changes to DB (dev)
npm run db:migrate   # Create a migration file (before prod deploy)
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio (visual DB browser at localhost:5555)
npm run db:reset     # Wipe database and reseed (destructive)
```

---

## Environment variables reference

```bash
# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://localhost:5432/webinarforge_dev"

# Clerk (auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_STARTER_MONTHLY="price_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."
STRIPE_PRICE_SCALE_MONTHLY="price_..."

# Feature flags (all false until modules are built)
NEXT_PUBLIC_ENABLE_AI_CLOSER="false"
NEXT_PUBLIC_ENABLE_CLONER="false"
NEXT_PUBLIC_ENABLE_MARKETPLACE="false"
```

---

## First deployment (Vercel)

When you're ready to deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables (copy from .env.local)
vercel env add DATABASE_URL
# ... repeat for each variable

# Run migrations on production DB
DATABASE_URL="your-prod-url" npx prisma migrate deploy
```

Use a production PostgreSQL database — Neon, Supabase, or Railway all work.
Update Clerk redirect URLs to your production domain.
Update `NEXT_PUBLIC_APP_URL` to your production URL.
Point your Stripe webhook to `https://your-domain.com/api/webhooks/stripe`.
