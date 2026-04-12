# NexusAI — Portfolio & Engineering Site

## What This Is

Rohit Raj's personal portfolio and engineering site built with Next.js 16, React 19, and Tailwind CSS 4. Showcases AI projects, reliability engineering work, services, and engineering notes with i18n support (en/hi/fr/de/ar). Deployed at rohitraj.tech.

## Core Value

Fix dark mode text invisibility and consolidate inconsistent inline styles so the landing page looks polished and readable across all devices and OS themes.

## Current Milestone: v1.0 Quality & Polish

**Goal:** Fix dark mode visibility, consolidate styling, and harden security/error handling so the site is production-ready.

**Target features:**
- Dark mode CSS variable overrides for all core variables
- Migrate 272 inline styles to Tailwind utility classes
- Move hardcoded Supabase credentials to .env.local
- Sanitize unvalidated HTML rendering
- Next.js Image component for all images
- Error boundaries for route segments
- Spacing and text alignment consistency
- Split monolithic blog data file
- Extract hardcoded data from components
- TypeScript types and runtime validation
- i18n dictionary caching optimization
- Middleware regex optimization
- Jest + React Testing Library setup
- Form validation (Zod or native)
- Basic error tracking/logging

## Requirements

### Validated

- Existing landing page sections: Hero, AIProjects, ReliabilitySection, Testimonials, Footer
- i18n routing with [locale] parameter (en/hi)
- Supabase integration for subscriptions
- Project cards with status badges and tech stack tags
- Reliability dashboard cards linking to sub-pages

### Active

- [ ] Dark mode CSS variable overrides for all core variables (--bg, --text-primary, --text-secondary, --text-muted, --card-bg, --border, etc.)
- [ ] Consistent spacing scale — migrate 272 inline style objects to Tailwind utility classes
- [ ] Text alignment consistency across landing page sections
- [ ] Error boundaries (error.tsx, loading.tsx, not-found.tsx) for route segments
- [ ] Move hardcoded Supabase credentials to .env.local
- [ ] Sanitize unvalidated HTML rendering
- [ ] Use Next.js Image component for all unoptimized images (e.g., AIProjects img tag)
- [ ] Split monolithic 3K-line blog data file into individual files
- [ ] Extract large hardcoded data structures from components
- [ ] Add proper TypeScript types and runtime validation
- [ ] Optimize i18n dictionary caching (memoization)
- [ ] Optimize middleware regex patterns
- [ ] Add Jest + React Testing Library setup with key component tests
- [ ] Add form validation (SubscribeForm, Contact) with Zod or native validation
- [ ] Add basic error tracking/logging

### Out of Scope

- Removing any existing UI sections or cards — user explicitly requested keeping all sections as-is
- Replacing placeholder testimonials — user wants to keep current "Client Name" placeholders for now
- Adding new features or pages — this milestone is polish and fixes only
- Redesign or visual overhaul — preserve existing design language
- Adding error tracking services (Sentry) — basic logging only for now

## Context

- **UI Audit Score:** 15/24 (Copywriting 2, Visuals 3, Color 3, Typography 3, Spacing 2, Experience Design 2)
- **Stack:** Next.js 16.1.6 App Router, React 19.2.3, Tailwind CSS 4, TypeScript, Supabase
- **Dark mode:** Site uses `prefers-color-scheme` media queries but only overrides project image and carousel styles — core text/bg/border variables have NO dark mode definitions
- **Inline styles:** 272 inline style objects across components with 13 distinct padding values and 11 distinct margin values
- **Testing:** Zero tests exist — no unit, integration, or E2E coverage
- **Codebase map:** Available at .planning/codebase/ (7 documents)

## Constraints

- **No UI removal**: All existing sections, cards, and pages must remain intact
- **Tech stack**: Continue with Next.js 16 + Tailwind CSS 4 + React 19 (no framework changes)
- **Testimonials**: Keep placeholder data as-is until user provides real testimonials
- **Brownfield**: All changes must be backward-compatible with existing functionality

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep all UI sections intact | User explicitly requested no removals | -- Pending |
| Keep placeholder testimonials | User has no real testimonials yet | -- Pending |
| Dark mode via CSS variables | Existing architecture uses CSS custom properties — extend, don't replace | -- Pending |
| Migrate inline styles to Tailwind | Project already has Tailwind CSS 4 installed but underutilized | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-12 after milestone v1.0 initialization*
