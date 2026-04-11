# Codebase Structure

**Analysis Date:** 2026-04-11

## Directory Layout

```
nexusai/
├── src/                        # Source code (alias: @)
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout (fonts, schemas, metadata)
│   │   ├── globals.css        # Global styles
│   │   ├── robots.ts          # robots.txt generator
│   │   ├── sitemap.ts         # sitemap.xml generator
│   │   ├── manifest.ts        # PWA manifest
│   │   ├── [locale]/          # Locale-scoped routes
│   │   │   ├── layout.tsx     # Locale layout (i18n, hreflang, RTL)
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── about/         # About page
│   │   │   ├── contact/       # Contact page
│   │   │   ├── projects/      # Projects listing & detail routes
│   │   │   ├── notes/         # Notes listing & detail routes
│   │   │   ├── repos/         # GitHub repos page
│   │   │   ├── services/      # Services listing & detail routes
│   │   │   └── reliability/   # Reliability/observability pages
│   │   └── feed.xml/          # RSS feed endpoint
│   │
│   ├── components/            # Reusable React components
│   │   ├── Header.tsx         # Navigation header (use client)
│   │   ├── Footer.tsx         # Page footer
│   │   ├── Hero.tsx           # Landing hero section
│   │   ├── ProjectCard.tsx    # Project display card
│   │   ├── AIProjects.tsx     # AI projects section
│   │   ├── LanguageSwitcher.tsx # Locale switcher (use client)
│   │   ├── ImageCarousel.tsx  # Image carousel component
│   │   ├── Testimonials.tsx   # Testimonials section
│   │   ├── ReliabilitySection.tsx # Reliability/observability section
│   │   ├── ReliabilityDashboard.tsx # Metrics dashboard
│   │   ├── K6Results.tsx      # Load testing results display
│   │   ├── PrometheusMetrics.tsx # Prometheus metrics visualization
│   │   ├── StatusBadge.tsx    # Project status badge
│   │   ├── CurrentWork.tsx    # Current work component
│   │   └── SubscribeForm.tsx  # Email subscription form
│   │
│   ├── lib/                   # Utility functions & configuration
│   │   ├── i18n.ts           # i18n logic, locale validation, dictionary loading
│   │   ├── supabase.ts        # Supabase client & subscription functions
│   │   └── seo-config.ts      # SEO metadata, JSON-LD schemas, helpers
│   │
│   ├── data/                  # Static content as data
│   │   ├── projects.ts        # Project definitions & metadata
│   │   ├── services.ts        # Services/expertise listing
│   │   ├── blog-posts.ts      # Blog post metadata (for notes)
│   │   └── github.ts          # GitHub repository data
│   │
│   └── middleware.ts          # Locale routing middleware
│
├── content/                   # i18n translation files (JSON)
│   ├── en/                    # English translations
│   │   ├── common.json        # Header, footer, nav labels
│   │   ├── home.json          # Home page text
│   │   ├── pages.json         # Page-specific text
│   │   └── meta.json          # Page title/description metadata
│   ├── hi/                    # Hindi translations
│   ├── fr/                    # French translations
│   ├── de/                    # German translations
│   └── ar/                    # Arabic translations
│
├── public/                    # Static assets
│   ├── images/                # Project screenshots & graphics
│   │   ├── projects/          # Project preview images
│   │   └── notes/             # Note preview images
│   ├── hero-graphic.png       # Landing page graphic
│   ├── favicon.ico            # Browser favicon
│   ├── icon.png               # App icon
│   └── robots.txt             # Generated at build time
│
├── .planning/                 # GSD planning documents
│   └── codebase/              # Architecture & structure docs
│
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration (if present)
└── .env.local                 # Environment variables (dev only)
```

## Directory Purposes

**`src/app`:**
- Purpose: Next.js App Router structure; defines routes via directory hierarchy
- Contains: Page components (`page.tsx`), layouts, metadata generators, OG image generators
- Key files: `[locale]/page.tsx`, `[locale]/layout.tsx`, `[locale]/projects/[slug]/page.tsx`

**`src/components`:**
- Purpose: Reusable UI components for page composition
- Contains: Layout components (Header, Footer), section components (Hero, Testimonials), utility components (LanguageSwitcher)
- Key files: `Header.tsx`, `ProjectCard.tsx`, `ImageCarousel.tsx`

**`src/lib`:**
- Purpose: Shared utilities and configuration
- Contains: i18n system, Supabase client, SEO/metadata helpers
- Key files: `i18n.ts` (locale logic), `supabase.ts` (database), `seo-config.ts` (schemas)

**`src/data`:**
- Purpose: Static content source-of-truth; defines all domain data
- Contains: Project arrays, service definitions, blog post metadata
- Key files: `projects.ts` (6 projects with full details), `services.ts`, `blog-posts.ts`

**`content`:**
- Purpose: Locale-specific translations as JSON; loaded lazily at runtime
- Contains: 5 languages × 4 JSON files each (common, home, pages, meta)
- Structure: `content/{locale}/{file}.json` imported dynamically in `i18n.ts`

**`public`:**
- Purpose: Static files served as-is (images, fonts, icons)
- Contains: Project screenshots, hero graphics, app icons
- Note: Images not optimized here; use `next/image` with `width`/`height` in components

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx` - Root layout, global fonts, JSON-LD schemas
- `src/app/[locale]/layout.tsx` - Locale layout, i18n setup, hreflang alternate links
- `src/app/[locale]/page.tsx` - Home page, composes Hero + sections
- `src/middleware.ts` - Locale detection & redirection before routing

**Configuration:**
- `src/lib/seo-config.ts` - SEO metadata, keywords, JSON-LD schema generators
- `src/lib/i18n.ts` - Locale config (locales, type definitions, dictionary loading)
- `tsconfig.json` - TypeScript config with `@/*` alias for `src/*`

**Core Logic:**
- `src/data/projects.ts` - Project definitions (interface + 6 project objects with full details)
- `src/lib/supabase.ts` - Supabase client initialization, `subscribeEmail()` function
- `src/middleware.ts` - Locale routing logic (Accept-Language parsing, redirects, cookie handling)

**Testing:**
- No test files present (not detected)

## Naming Conventions

**Files:**
- Page components: `page.tsx` (Next.js convention)
- Layout wrappers: `layout.tsx` (Next.js convention)
- OG image generators: `*-image.tsx` or `opengraph-image.tsx` (Next.js convention)
- Reusable components: PascalCase (e.g., `Header.tsx`, `ProjectCard.tsx`)
- Utilities: camelCase (e.g., `seo-config.ts`, `supabase.ts`)
- Content files: kebab-case (e.g., `blog-posts.ts`, `seo-config.ts`)

**Directories:**
- Route segments: kebab-case for dynamic segments (e.g., `[locale]`, `[slug]`)
- Feature directories: kebab-case (e.g., `src/components`, `src/data`, `src/lib`)
- Content locales: lowercase language codes (e.g., `en`, `hi`, `fr`, `de`, `ar`)

**TypeScript Types:**
- Interfaces: PascalCase (e.g., `Project`, `Dictionary`, `Locale`)
- Type aliases: PascalCase (e.g., `type Locale = 'en' | 'hi' | ...`)
- Constants: UPPER_SNAKE_CASE for immutable configuration (e.g., `LOCALE_COOKIE`, `SEO_KEYWORDS`)

## Where to Add New Code

**New Page:**
- Create directory: `src/app/[locale]/new-feature/`
- Add: `page.tsx` (server component with `generateMetadata()`)
- Add: `layout.tsx` if needed (for nested structure)
- Receive locale via `params: Promise<{ locale: string }>`
- Call `getDictionary(locale)` for translations
- Example: `src/app/[locale]/projects/page.tsx` → renders all projects with filtering

**New Component:**
- Create file: `src/components/MyComponent.tsx`
- Export as default function
- If interactive: add `"use client"` at top
- If pure presentation: use default (Server Component)
- Accept `locale: Locale` and `dict: DictionarySection` as props for i18n
- Example: `ProjectCard` is reusable, receives `project` and `locale` props

**New Section on Home:**
- Create component: `src/components/NewSection.tsx`
- Import in: `src/app/[locale]/page.tsx`
- Add composition: `<NewSection dict={dict.home} locale={locale} />`
- Example: `AIProjects`, `ReliabilitySection` follow this pattern

**New Data Type:**
- Add to: `src/data/projects.ts` (or appropriate file)
- Define interface at top of file
- Export constant array
- Example: `projects: Project[]` exported for use in `src/app/[locale]/projects/page.tsx`

**New Locale (Language):**
- Add locale code to: `src/lib/i18n.ts` → `locales` array
- Add display name to: `localeNames` record
- Add flag emoji to: `localeFlags` record
- Create directory: `content/new-locale/`
- Add JSON files: `common.json`, `home.json`, `pages.json`, `meta.json`
- Update RTL handling in `isRTL()` if applicable

**New API Endpoint (if needed):**
- Create: `src/app/api/new-route/route.ts`
- Export handler: `export async function POST(request: Request) { ... }`
- Example: Email subscription could move here as route handler instead of direct Supabase call

## Special Directories

**`src/app/[locale]`:**
- Purpose: Dynamic route segment for localization
- Generated: No (defined in source)
- Committed: Yes
- Pattern: All routes nested under `[locale]` inherit locale parameter

**`.next`:**
- Purpose: Next.js build output (generated)
- Generated: Yes (at build time)
- Committed: No

**`content/{locale}`:**
- Purpose: Translation files
- Generated: No (hand-authored)
- Committed: Yes
- Add via: Create new JSON file for new locale or page type

**`public/images`:**
- Purpose: Static asset hosting
- Generated: No (uploaded manually)
- Committed: Yes (binary files)
- Note: Optimize before commit; use `next/image` for lazy loading in components

---

*Structure analysis: 2026-04-11*
