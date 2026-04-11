# External Integrations

**Analysis Date:** 2026-04-11

## APIs & External Services

**Database & Content:**
- Supabase - Backend-as-a-service for email subscriptions and user data
  - SDK/Client: `@supabase/supabase-js` ^2.93.3
  - Auth: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Table: `subscribers` table with schema defined in `src/lib/supabase.ts`

**Content Management:**
- Static data-driven content (no CMS integration)
  - Blog posts: `src/data/blog-posts.ts` (hardcoded BlogPost array)
  - Projects: `src/data/projects.ts` (hardcoded Project array with tech stacks, repositories, images)
  - GitHub repositories: `src/data/github.ts` (manually maintained repository metadata)
  - Services: `src/data/services.ts` (hardcoded service offerings)

**SEO & Metadata:**
- Google Search Console - Site verification via `google46f0e975ac6f7a81` in `src/lib/seo-config.ts`
- JSON-LD Schema generation for:
  - Person schema (author identity)
  - Service schema (freelance services catalog)
  - ProfessionalService schema (with geo location: Delhi, India at 28.6139°N 77.209°E)
  - Software application schema (for projects)
  - Blog posting schema (for notes/articles)
  - FAQ schema support
  - Breadcrumb navigation

## Data Storage

**Databases:**
- Supabase PostgreSQL (cloud)
  - Connection: Via `@supabase/supabase-js` client initialized in `src/lib/supabase.ts`
  - Client: `supabase` instance from `createClient()`
  - Table: `subscribers` (id, email, locale, subscribed_at, is_active, unsubscribed_at)

**File Storage:**
- Static assets: `/public` directory (images: og-image.png, twitter-image.png, project images at `/images/projects/`)
- Local filesystem only — no cloud object storage integration detected

**Caching:**
- HTTP caching via Next.js:
  - RSS feed: `Cache-Control: public, max-age=3600, s-maxage=3600` (1 hour)
  - No Redis or Memcached integration
  - Next.js automatic caching of static generated pages

## Authentication & Identity

**Auth Provider:**
- Custom: Email-based subscription (no user login required)
  - Implementation: Form submission to `subscribeEmail()` function in `src/lib/supabase.ts`
  - Method: Direct Supabase insert to `subscribers` table
  - Error handling: Unique constraint check for duplicate emails (error code 23505)

**No user authentication system** - Portfolio is public, read-only content with optional email subscription

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logging only (e.g., `console.warn()` for fallback locale in `src/lib/i18n.ts`)
- No external logging service integration

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred from security headers in `next.config.ts` and Next.js 16 conventions)
- Static generation with ISR support
- Deployment via git push to main branch (typical Vercel workflow)

**CI Pipeline:**
- None explicitly configured (likely Vercel's built-in CI/CD)

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Optional, defaults to `https://ivacwojpuhsssyfcfgjx.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Optional, defaults to embedded key (safe for public use)

**Secrets location:**
- Both Supabase credentials are hardcoded with fallback values in `src/lib/supabase.ts` (acceptable since they're public-facing anon keys)
- No `.env` file strategy currently in use

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected (no webhook dispatching to external services)

## Internationalization (i18n)

**Locales Supported:**
- en (English) - default
- hi (Hindi)
- fr (French)
- de (German)
- ar (Arabic) - RTL layout support

**Implementation:**
- Custom i18n solution via `src/lib/i18n.ts` with lazy-loaded JSON dictionaries
- Locale preference persistence: `NEXT_LOCALE` cookie (max-age: 1 year)
- Fallback strategy: Cookie > Browser Accept-Language header > Default locale
- Localized paths: `/{locale}/` route segment structure (e.g., `/en/about`, `/hi/projects`)
- Content dictionaries imported from `content/{locale}/*.json` files (common, home, pages, meta)

---

*Integration audit: 2026-04-11*
