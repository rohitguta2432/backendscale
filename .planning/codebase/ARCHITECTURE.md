# Architecture

**Analysis Date:** 2026-04-11

## Pattern Overview

**Overall:** Server-Driven Content Site with i18n Routing

**Key Characteristics:**
- Multi-locale routing via URL segments (`/[locale]/...`)
- Server Components for static content generation and metadata
- Minimal client interactivity (mostly header/nav state)
- Content-driven via TypeScript data structures (`projects`, `services`, `notes`)
- Database integration via Supabase for email subscriptions only
- JSON-based i18n with 5 languages (en, hi, fr, de, ar)
- Static generation with dynamic locale parameters (`generateStaticParams`)

## Layers

**Routing Layer:**
- Purpose: Localized URL structure and middleware-based locale detection
- Location: `src/middleware.ts`, `src/app/[locale]/...`
- Contains: Locale routing middleware, route handlers, page components
- Depends on: Next.js routing, Accept-Language header parsing
- Used by: All pages inherit locale context

**Page Layer (Server Components):**
- Purpose: Render layout, fetch locale dictionary, apply metadata
- Location: `src/app/[locale]/*.tsx` (home, projects, notes, about, contact, etc.)
- Contains: `page.tsx` (routes), `layout.tsx` (nesting), `*-image.tsx` (OG images)
- Depends on: i18n library, SEO config, data layer
- Used by: Browser request → Next.js renders page

**Component Layer:**
- Purpose: Reusable UI elements for rendering content
- Location: `src/components/*.tsx`
- Contains: Header, Footer, ProjectCard, Hero, Testimonials, etc.
- Depends on: Next.js Image, Link components; locale context passed via props
- Used by: Page components compose sections

**Data Layer:**
- Purpose: Static content (projects, services, notes) as TypeScript constants
- Location: `src/data/*.ts` (projects.ts, services.ts, blog-posts.ts, github.ts)
- Contains: Project interfaces, arrays of project objects with full details
- Depends on: TypeScript type definitions
- Used by: Page components filter/render data

**Internationalization (i18n) Layer:**
- Purpose: Load and cache translated dictionaries per locale
- Location: `src/lib/i18n.ts`
- Contains: Locale validation, dictionary loading, RTL detection, type definitions
- Depends on: JSON content files (`content/[locale]/*.json`)
- Used by: All pages and components receive dictionary via props

**SEO/Metadata Layer:**
- Purpose: Centralized SEO config, schema generation, page metadata
- Location: `src/lib/seo-config.ts`
- Contains: JSON-LD schemas (Person, Service, BlogPosting), metadata builders
- Depends on: Next.js Metadata type
- Used by: Page `generateMetadata()` functions

**Database Layer:**
- Purpose: Email subscription management (only external DB interaction)
- Location: `src/lib/supabase.ts`
- Contains: Supabase client, `subscribeEmail()` function, Subscriber type
- Depends on: @supabase/supabase-js, environment variables
- Used by: Server actions/components for newsletter signup

## Data Flow

**Static Page Generation:**

1. User requests `https://rohitraj.tech/en/projects`
2. Middleware (`src/middleware.ts`) detects locale in URL, sets cookie
3. Next.js routes to `src/app/[locale]/projects/page.tsx`
4. `generateStaticParams()` returns all `[locale, slug]` combinations for pre-rendering
5. Server component calls `getDictionary(locale)` to load `content/en/*.json`
6. Component imports `projects` from `src/data/projects.ts`
7. Filters projects (active/iterating/paused) and maps to `<ProjectCard>` components
8. `generateMetadata()` creates page metadata with canonical URLs and hreflang alternates
9. Responds with static HTML

**Dynamic Project Detail Page:**

1. User requests `https://rohitraj.tech/en/projects/clinicai`
2. `generateStaticParams()` pre-generates all locale + slug combinations at build time
3. Server component finds project by slug in `projects` array
4. Renders project details with images, tech stack, roadmap
5. OG image generated dynamically via `opengraph-image.tsx`
6. Returns pre-generated static HTML

**Client-Side Interactions:**

1. Header component uses `"use client"` for mobile menu toggle
2. LanguageSwitcher handles locale switching via URL rewrite
3. SubscribeForm submits email to Supabase via Server Action
4. No state management library needed (minimal client state)

**State Management:**

- URL parameters (`[locale]`, `[slug]`) are the source of truth
- Route locale is passed down via props to all descendants
- Mobile menu state in Header component (React.useState)
- Email subscription status via Supabase insert

## Key Abstractions

**Locale System:**
- Purpose: Enable multi-language rendering while keeping codebase DRY
- Examples: `src/lib/i18n.ts`, `src/middleware.ts`
- Pattern: Centralized type `type Locale = 'en' | 'hi' | 'fr' | 'de' | 'ar'`; validation via `isValidLocale()`; lazy dictionary loading via `getDictionary()`

**Project Data Abstraction:**
- Purpose: Separate content from presentation; enable filtering/rendering
- Examples: `src/data/projects.ts` exports `projects` array with `Project` interface
- Pattern: Define interfaces in data file; import as read-only constants in pages

**Metadata Builders:**
- Purpose: DRY metadata generation across pages
- Examples: `createPageMetadata()`, `generateSoftwareApplicationSchema()`
- Pattern: Helper functions accept minimal params (title, description, path) and return full Metadata object

**Server vs. Client Boundary:**
- Purpose: Minimize JavaScript sent to client
- Pattern: All data fetching in Server Components; only Header/LanguageSwitcher marked `"use client"`

## Entry Points

**Root Layout (`src/app/layout.tsx`):**
- Location: `src/app/layout.tsx`
- Triggers: Every request (app root)
- Responsibilities: 
  - Setup global fonts (Inter, JetBrains Mono, Noto Sans Arabic)
  - Inject JSON-LD schemas for SEO
  - Define default metadata
  - Render `<html>` wrapper with CSS variables

**Middleware (`src/middleware.ts`):**
- Location: `src/middleware.ts`
- Triggers: Every request (except static assets and /_next)
- Responsibilities:
  - Parse Accept-Language header for browser language
  - Redirect requests without locale to `/{locale}{path}`
  - Set locale cookie for persistence
  - Handle nested locale redirects (e.g., `/en/ar` → `/ar`)

**Home Page (`src/app/[locale]/page.tsx`):**
- Location: `src/app/[locale]/page.tsx`
- Triggers: `/{locale}` requests
- Responsibilities:
  - Load locale dictionary
  - Compose Hero, AIProjects, ReliabilitySection, Testimonials
  - Return layout with Header and Footer

**Locale Layout (`src/app/[locale]/layout.tsx`):**
- Location: `src/app/[locale]/layout.tsx`
- Triggers: All locale-scoped requests
- Responsibilities:
  - Validate locale parameter
  - Set HTML `lang` and `dir` attributes (RTL for Arabic)
  - Add alternate language links (hreflang)
  - Inject breadcrumb schema

## Error Handling

**Strategy:** Server-side notFound() for invalid routes; error boundaries via Next.js error.tsx

**Patterns:**
- Invalid locale → `notFound()` in layout.tsx, returns 404 page
- Invalid project slug → check existence in page component, `notFound()` if missing
- Supabase subscription errors → caught in try/catch, return `{success: false, error: "..."}` to client
- Missing content/locale JSON files → fallback to English dictionary in `loadDictionary()`

## Cross-Cutting Concerns

**Logging:** Not implemented. Uses `console.warn()` for fallback conditions in i18n.ts.

**Validation:** 
- Locale validation: `isValidLocale(locale: string): locale is Locale` type guard
- Project slug validation: `projects.find(p => p.slug === slug)` check before rendering

**Authentication:** Not implemented. Email subscription is unprotected (public Supabase write).

**Caching:**
- Static generation at build time via `generateStaticParams()`
- Browser caching via Next.js automatic headers
- Locale cookie for persistence across sessions

---

*Architecture analysis: 2026-04-11*
