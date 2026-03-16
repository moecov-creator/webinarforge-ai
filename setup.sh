#!/usr/bin/env bash
# =============================================================================
# WebinarForge AI — Local Setup Script
# Run this from the project root: bash setup.sh
# =============================================================================

set -e  # Exit on any error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

step()  { echo -e "\n${BLUE}${BOLD}▶ $1${NC}"; }
ok()    { echo -e "${GREEN}✓ $1${NC}"; }
warn()  { echo -e "${YELLOW}⚠ $1${NC}"; }
error() { echo -e "${RED}✗ $1${NC}"; exit 1; }
info()  { echo -e "  ${1}"; }

echo ""
echo -e "${BOLD}============================================${NC}"
echo -e "${BOLD}  WebinarForge AI — Local Setup${NC}"
echo -e "${BOLD}============================================${NC}"

# =============================================================================
# STEP 1 — Check prerequisites
# =============================================================================
step "Checking prerequisites"

# Node.js
if ! command -v node &>/dev/null; then
  error "Node.js not found. Install from https://nodejs.org (v20+ required)"
fi
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  error "Node.js v20+ required. Current: $(node -v)"
fi
ok "Node.js $(node -v)"

# npm
if ! command -v npm &>/dev/null; then
  error "npm not found"
fi
ok "npm $(npm -v)"

# PostgreSQL
if ! command -v psql &>/dev/null; then
  warn "psql not found in PATH."
  info "Options:"
  info "  • Mac:    brew install postgresql@16 && brew services start postgresql@16"
  info "  • Linux:  sudo apt install postgresql postgresql-contrib"
  info "  • Cloud:  Use Neon (neon.tech), Supabase, or Railway (free tier)"
  info ""
  info "If using a cloud DB, skip the database creation step below."
  info "Press Enter to continue anyway, or Ctrl+C to install Postgres first."
  read -r
else
  ok "PostgreSQL $(psql --version | awk '{print $3}')"
fi

# =============================================================================
# STEP 2 — Install dependencies
# =============================================================================
step "Installing dependencies"

if [ -d "node_modules" ]; then
  warn "node_modules already exists — running npm install to ensure everything is up to date"
fi

npm install
ok "Dependencies installed"

# =============================================================================
# STEP 3 — Create .env.local
# =============================================================================
step "Setting up environment variables"

if [ -f ".env.local" ]; then
  warn ".env.local already exists — skipping creation"
  info "Edit it manually if you need to update any values."
else
  cp .env.example .env.local
  ok "Created .env.local from .env.example"
  echo ""
  warn "You MUST fill in these values in .env.local before continuing:"
  info ""
  info "  ${BOLD}DATABASE_URL${NC}          — your PostgreSQL connection string"
  info "  ${BOLD}NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY${NC} — from clerk.com dashboard"
  info "  ${BOLD}CLERK_SECRET_KEY${NC}      — from clerk.com dashboard"
  info "  ${BOLD}OPENAI_API_KEY${NC}        — from platform.openai.com"
  info "  ${BOLD}STRIPE_SECRET_KEY${NC}     — from stripe.com (can use test key)"
  info "  ${BOLD}STRIPE_WEBHOOK_SECRET${NC} — from stripe.com (set up below)"
  info ""
  info "Stripe and OpenAI are optional for the initial boot — the app will"
  info "start without them but generation and billing won't work."
  echo ""
  echo -e "${YELLOW}Open .env.local in your editor and fill in the required values.${NC}"
  echo "Press Enter once done, or Ctrl+C to stop and fill them in first."
  read -r
fi

# =============================================================================
# STEP 4 — Create local database (skip if using cloud DB)
# =============================================================================
step "Database setup"

if command -v psql &>/dev/null; then
  DB_NAME="webinarforge_dev"

  # Check if DB already exists
  if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    warn "Database '$DB_NAME' already exists — skipping creation"
  else
    echo -e "  Creating local database: ${BOLD}$DB_NAME${NC}"
    createdb "$DB_NAME" 2>/dev/null && ok "Database '$DB_NAME' created" || warn "Could not create database — you may need to run: createdb $DB_NAME"
  fi

  # Check DATABASE_URL is set in .env.local
  if grep -q 'DATABASE_URL=""' .env.local 2>/dev/null; then
    warn "DATABASE_URL is empty in .env.local"
    info "Setting it to: postgresql://localhost:5432/$DB_NAME"
    # Replace empty DATABASE_URL with local default
    sed -i.bak 's|DATABASE_URL=""|DATABASE_URL="postgresql://localhost:5432/webinarforge_dev"|' .env.local
    rm -f .env.local.bak
    ok "DATABASE_URL set to postgresql://localhost:5432/webinarforge_dev"
  fi
else
  info "Skipping local DB creation (psql not available)"
  info "Make sure DATABASE_URL in .env.local points to your cloud database"
fi

# =============================================================================
# STEP 5 — Generate Prisma client
# =============================================================================
step "Generating Prisma client"

npx prisma generate
ok "Prisma client generated"

# =============================================================================
# STEP 6 — Push schema to database
# =============================================================================
step "Pushing schema to database"

echo -e "  Running: ${BOLD}prisma db push${NC}"
echo ""

# Load DATABASE_URL from .env.local for this step
export $(grep -v '^#' .env.local | grep DATABASE_URL | xargs) 2>/dev/null || true

npx prisma db push && ok "Schema pushed to database" || {
  error "Schema push failed. Check your DATABASE_URL in .env.local and ensure the database is accessible."
}

# =============================================================================
# STEP 7 — Seed demo data
# =============================================================================
step "Seeding demo data"

npm run db:seed && ok "Demo data seeded" || {
  warn "Seeding failed — this is non-fatal. You can run 'npm run db:seed' manually later."
  warn "The app will still start without seed data."
}

# =============================================================================
# STEP 8 — Stripe webhook (local dev)
# =============================================================================
step "Stripe webhook setup (optional)"

if command -v stripe &>/dev/null; then
  ok "Stripe CLI found"
  info "Run this in a separate terminal to forward webhooks locally:"
  info ""
  info "  ${BOLD}stripe listen --forward-to localhost:3000/api/webhooks/stripe${NC}"
  info ""
  info "Copy the webhook signing secret it prints and add it to .env.local:"
  info "  STRIPE_WEBHOOK_SECRET=\"whsec_...\""
else
  info "Stripe CLI not installed — webhooks won't work in local dev."
  info "Install from: https://stripe.com/docs/stripe-cli"
  info "Or skip for now — the app runs fine without Stripe in dev mode."
fi

# =============================================================================
# STEP 9 — Final verification
# =============================================================================
step "Running TypeScript check"

npx tsc --noEmit 2>&1 | head -30 && ok "TypeScript check passed" || {
  warn "TypeScript errors found (see above). The app may still run — Next.js"
  warn "compiles at request time. Fix errors before deploying to production."
}

# =============================================================================
# DONE
# =============================================================================
echo ""
echo -e "${BOLD}============================================${NC}"
echo -e "${GREEN}${BOLD}  Setup complete!${NC}"
echo -e "${BOLD}============================================${NC}"
echo ""
echo -e "  Start the dev server:  ${BOLD}npm run dev${NC}"
echo -e "  Open in browser:       ${BOLD}http://localhost:3000${NC}"
echo ""
echo -e "  Demo credentials:"
echo -e "    Email:  ${BOLD}demo@webinarforge.ai${NC}"
echo -e "    (Sign in via Clerk — demo user is pre-seeded in the DB)"
echo ""
echo -e "  Useful commands:"
echo -e "    ${BOLD}npm run db:studio${NC}   — Prisma Studio (visual DB browser)"
echo -e "    ${BOLD}npm run db:seed${NC}     — Re-seed demo data"
echo -e "    ${BOLD}npm run db:reset${NC}    — Wipe + reseed (destructive)"
echo -e "    ${BOLD}npm run typecheck${NC}   — TypeScript check"
echo ""
