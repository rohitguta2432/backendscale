# NexusAI -- UI Review

**Audited:** 2026-04-11
**Baseline:** Abstract 6-pillar standards (no UI-SPEC exists)
**Screenshots:** Not captured (dev server returns 302 redirect; CLI screenshot not attempted)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | Placeholder testimonials with "Client Name" shipped to production; 20+ hardcoded English strings bypass i18n |
| 2. Visuals | 3/4 | Good hierarchy and component structure; heavy inline style usage (272 instances) hurts maintainability |
| 3. Color | 3/4 | Clean CSS custom property system; hardcoded hex colors in opengraph files are acceptable but ReliabilitySection uses hardcoded accent colors |
| 4. Typography | 3/4 | Well-defined type scale in globals.css; Tailwind utility classes used inconsistently across reliability pages (7 distinct sizes) |
| 5. Spacing | 2/4 | 272 inline style objects with ad-hoc spacing values; no consistent spacing scale enforced across components |
| 6. Experience Design | 2/4 | Only SubscribeForm has loading/error states; no error boundaries, no loading.tsx files, no skeleton states |

**Overall: 15/24**

---

## Top 3 Priority Fixes

1. **Placeholder testimonials with "Client Name" are live** -- Users see fake social proof which damages credibility -- Replace with real testimonials or remove the Testimonials component from the home page and service pages until real data is available (`src/components/Testimonials.tsx:7-23`)

2. **No error boundaries or loading states across the app** -- Users see raw errors or blank screens on failures -- Add `error.tsx` and `loading.tsx` files to `src/app/[locale]/` and key nested routes (`projects/`, `notes/`, `reliability/`); wrap async data fetches with Suspense boundaries

3. **272 inline style objects create unmaintainable spacing/layout** -- Inconsistent spacing and difficulty making global design changes -- Migrate inline styles in Hero, AIProjects, Testimonials, NotesPageClient, and service/[slug]/page.tsx to CSS classes in globals.css or a component-level CSS module, using the existing spacing patterns (1rem, 1.5rem, 2rem, 3rem)

---

## Detailed Findings

### Pillar 1: Copywriting (2/4)

**Critical: Placeholder content shipped to production**
- `src/components/Testimonials.tsx:7-8` -- "Client Name" appears 6 times as placeholder names
- `src/components/Testimonials.tsx:8` -- "Founder, Startup Name" and "CTO, Company Name" are placeholder roles
- The TODO comment on line 3 (`// TODO: Replace with real client testimonials`) confirms these are placeholders

**Hardcoded English strings bypassing i18n system:**
- `src/components/Hero.tsx:61` -- "Engineering Notes" is hardcoded, not from `dict`
- `src/components/Testimonials.tsx:52` -- "Testimonials" and "What Clients Say" hardcoded
- `src/app/[locale]/services/page.tsx:36` -- "Services" page title hardcoded
- `src/app/[locale]/services/[slug]/page.tsx:127,137,165` -- "The Problem", "What You Get", "Tech Stack" hardcoded
- `src/app/[locale]/notes/[slug]/page.tsx:230,337,397` -- "Back to Notes", "RELATED PROJECT", "Read Next" hardcoded
- `src/app/[locale]/notes/NotesPageClient.tsx:318` -- "Blog Articles" hardcoded
- `src/app/[locale]/reliability/page.tsx:64` -- "See Also" hardcoded
- `src/components/Header.tsx:21` -- "Services" nav label is hardcoded while other nav items use `dict.nav.*`

**Positive:** SubscribeForm error/success messages use translations with sensible fallbacks. CTA labels like "Let's Talk" and "Learn more" are specific and action-oriented.

### Pillar 2: Visuals (3/4)

**Strengths:**
- Clear visual hierarchy: hero section uses `clamp(2.25rem, 5vw, 3.5rem)` for responsive sizing
- Status badges with color-coded dots (active/iterating/paused) provide good at-a-glance information
- Skip-link for accessibility (`src/app/[locale]/layout.tsx:100`)
- Aria attributes present: 11 instances including `aria-label` on mobile menu, language switcher, carousel navigation, and zoom controls
- ImageCarousel has keyboard navigation (Escape, ArrowLeft, ArrowRight) and lightbox zoom

**Issues:**
- 53 inline style objects in components + 219 in app pages = 272 total inline styles. This makes visual consistency hard to verify and maintain
- `src/components/AIProjects.tsx:52` -- Uses raw `<img>` tag instead of `next/image` (the component also uses `Image` from next/image elsewhere, inconsistent)
- `src/app/[locale]/notes/[slug]/page.tsx:299` -- Uses raw `<img>` for blog cover images instead of `next/image`
- Mobile menu uses hardcoded `#ffffff` background (`globals.css:1146`) instead of CSS variable, breaks if dark mode is added

### Pillar 3: Color (3/4)

**Strengths:**
- Well-organized CSS custom property system in `:root` with semantic naming (`--bg`, `--surface`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent`, `--success`, `--warning`)
- Accent color (`#3b82f6`) used consistently via `var(--accent)` -- 12 references in CSS, 6 in components
- Status colors use CSS variables (`var(--status-active)`, `var(--status-iterating)`)
- Focus states use `var(--accent)` for outline color

**Issues:**
- `src/components/ReliabilitySection.tsx:24-37` -- Hardcoded accent colors (`#22c55e`, `#f97316`, `#3b82f6`, `#8b5cf6`) passed as inline CSS custom properties; these should be defined in globals.css
- `src/app/[locale]/notes/[slug]/page.tsx:77-78` -- Hardcoded dark theme colors (`#1e1e1e`, `#252526`, `#333`) for code blocks instead of using CSS variables
- `src/app/[locale]/reliability/page.tsx:67-79` -- Uses Tailwind color classes (`text-blue-600 dark:text-blue-400`) while rest of site uses CSS variables, creating two color systems
- Opengraph image files use hardcoded colors extensively -- acceptable since these are server-rendered images, not user-facing UI
- No dark mode support declared despite `prefers-color-scheme: dark` media queries in globals.css for some components (carousel, project hero). The `:root` only defines light theme variables

### Pillar 4: Typography (3/4)

**Strengths:**
- Three font families properly loaded via `next/font/google` with CSS variables: Inter (sans), JetBrains Mono (mono), Noto Sans Arabic (RTL)
- globals.css defines a clear type scale: h1 (2.5rem/700), h2 (1.875rem/600), h3 (1.25rem/600), h4 (1rem/500)
- Hero title uses `clamp()` for fluid typography
- Mono font consistently used for technical content (tags, code, status labels)

**Issues:**
- Reliability dashboard pages (K6Results, PrometheusMetrics, ReliabilityDashboard) use Tailwind text utilities (`text-xs` through `text-5xl`) creating a parallel type scale with 7+ distinct sizes alongside the CSS-variable-based scale
- Many components override the global type scale with inline `fontSize` values: `0.7rem`, `0.75rem`, `0.8rem`, `0.85rem`, `0.9rem`, `0.95rem`, `1.05rem`, `1.1rem`, `1.15rem`, `1.25rem`, `1.5rem`, `2rem`, `2.25rem` -- at least 13 distinct inline font sizes
- Font weight distribution in Tailwind classes: `font-bold` dominates (50+ uses), `font-semibold` (8 uses), `font-medium` (2 uses). Bold is overused -- consider using semibold for secondary headings

### Pillar 5: Spacing (2/4)

**Strengths:**
- globals.css establishes consistent spacing for structural elements: `.container` padding (1.5rem mobile, 2rem desktop), `section` padding (4rem/5rem), `.project-card` padding (1.5rem)
- Grid gaps are consistent at 1rem and 1.5rem in CSS classes

**Issues:**
- 272 inline style objects use ad-hoc spacing values without a consistent scale:
  - Margins: `0.25rem`, `0.375rem`, `0.5rem`, `0.75rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem`, `2.5rem`, `3rem`, `4rem` -- 11 distinct margin values
  - Padding: `0.125rem`, `0.2rem`, `0.25rem`, `0.375rem`, `0.5rem`, `0.625rem`, `0.75rem`, `1rem`, `1.25rem`, `1.5rem`, `1.75rem`, `2rem`, `3rem` -- 13 distinct padding values
  - Gaps: `0.4rem`, `0.5rem`, `0.75rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem`, `3rem` -- 8 distinct gap values
- No arbitrary Tailwind values found (good), but spacing is split between CSS classes and inline styles with no enforced scale
- `src/components/Testimonials.tsx:150-156` -- Responsive grid uses inline `<style>` tag with `!important`, fighting against its own inline styles
- Reliability section in globals.css uses px values (`80px`, `48px`, `24px`, `16px`) while rest of site uses rem, creating an inconsistent spacing unit system

### Pillar 6: Experience Design (2/4)

**Strengths:**
- SubscribeForm has proper state machine: `idle -> loading -> success/error -> idle` with auto-reset after 3 seconds (`src/components/SubscribeForm.tsx:18`)
- SubscribeForm disables input and button during loading (`src/components/SubscribeForm.tsx:55,61`)
- ImageCarousel handles empty state gracefully with early return (`src/components/ImageCarousel.tsx:18`)
- NotesPageClient handles empty filtered results with i18n-aware messages (`NotesPageClient.tsx:419,479`)
- Keyboard navigation in ImageCarousel (Escape to close, arrows to navigate)
- Body scroll lock during zoom modal

**Issues:**
- No `loading.tsx` files exist in any route segment -- Next.js App Router streaming/Suspense not utilized
- No `error.tsx` or `global-error.tsx` files -- unhandled errors show raw error screens
- No `not-found.tsx` custom page for 404s
- Dashboard components (ReliabilityDashboard, K6Results, PrometheusMetrics) simulate live data with `setInterval` but have no connection error or offline state handling
- Pages that fetch dictionary data (`getDictionary`) have no loading or error UI -- if dictionary fetch fails, the entire page crashes
- No confirmation dialogs for any actions
- No skeleton/placeholder states while page content loads
- Testimonials section has no empty state -- if the hardcoded array were empty, it would render an empty grid

---

## Files Audited

### Components (src/components/)
- `AIProjects.tsx` -- AI project cards with status badges
- `CurrentWork.tsx` -- Project grid wrapper
- `Footer.tsx` -- Site footer with subscribe form
- `Header.tsx` -- Navigation with mobile menu and language switcher
- `Hero.tsx` -- Homepage hero section
- `ImageCarousel.tsx` -- Project screenshot carousel with lightbox
- `K6Results.tsx` -- Load testing results dashboard
- `LanguageSwitcher.tsx` -- Locale dropdown
- `ProjectCard.tsx` -- Individual project card
- `PrometheusMetrics.tsx` -- Observability metrics dashboard
- `ReliabilityDashboard.tsx` -- System metrics dashboard
- `ReliabilitySection.tsx` -- Reliability overview cards
- `StatusBadge.tsx` -- Status indicator component
- `SubscribeForm.tsx` -- Email subscription form
- `Testimonials.tsx` -- Client testimonials (placeholder data)

### Pages (src/app/)
- `layout.tsx` -- Root layout with fonts and SEO
- `globals.css` -- Global styles (1695 lines)
- `[locale]/layout.tsx` -- Locale layout with i18n and RTL
- `[locale]/page.tsx` -- Homepage
- `[locale]/about/page.tsx` -- About page
- `[locale]/contact/page.tsx` -- Contact page
- `[locale]/notes/page.tsx` -- Notes list server component
- `[locale]/notes/NotesPageClient.tsx` -- Notes client component with filtering
- `[locale]/notes/[slug]/page.tsx` -- Blog post detail with markdown renderer
- `[locale]/projects/page.tsx` -- Projects listing by status
- `[locale]/reliability/page.tsx` -- Reliability overview
- `[locale]/repos/page.tsx` -- Repository listing
- `[locale]/services/page.tsx` -- Services listing
- `[locale]/services/[slug]/page.tsx` -- Service detail with FAQ and CTA
