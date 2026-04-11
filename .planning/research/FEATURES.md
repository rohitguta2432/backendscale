# Feature Landscape: Quality & Polish for NexusAI Portfolio

**Domain:** Next.js portfolio site quality improvements (brownfield)
**Researched:** 2026-04-11
**Confidence:** HIGH (well-established patterns, official docs verified)

## Table Stakes

Features users and peers expect from a professional portfolio site. Missing any of these creates an impression of incomplete or amateur work.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Dark mode that works** | OS-level dark mode is universal; light-text-on-light-bg is immediately noticed as broken | Medium | Current site has CSS variables but NO dark overrides for core vars (--bg, --text-primary, etc.). Only project images and carousel have dark media queries. This is the single most visible quality issue. |
| **Consistent spacing** | Inconsistent padding/margins create a "thrown together" feel that visitors notice subconsciously | Medium | 272 inline style objects with 13 distinct padding values and 11 distinct margin values. Migrating to Tailwind utility classes enforces a spacing scale. |
| **Error boundaries (error.tsx, not-found.tsx)** | Visitors who hit a bad URL or encounter a server error see generic Next.js error pages or blank screens | Low | Next.js App Router expects these files. Missing them is a gap in basic framework usage. Add error.tsx (client component), not-found.tsx, global-error.tsx (with html/body tags), and loading.tsx for route segments. |
| **Form validation with inline feedback** | Users expect immediate feedback on email/contact forms before submission | Low-Medium | SubscribeForm currently has no client-side validation. Add Zod schema (reusable on client and server) with inline error messages and disabled-while-submitting button state. |
| **next/image for all images** | Raw img tags produce unoptimized images (no lazy loading, no responsive sizing, no format conversion) | Low | Two locations use raw img: AIProjects.tsx and notes/[slug]/page.tsx. Simple swap to next/image with width/height/alt. |
| **Accessible keyboard navigation** | Tab navigation must work for all interactive elements; focus indicators must be visible | Low | Check that Header mobile menu, LanguageSwitcher, SubscribeForm, and all links have visible focus states. Tailwind's focus-visible utilities make this straightforward. |
| **Skip-to-content link** | Screen reader and keyboard users need to bypass repetitive navigation | Low | A hidden-until-focused link at the top of the page. Standard accessibility pattern. |
| **Semantic HTML and ARIA basics** | Portfolio sites are judged by peers who inspect source; poor semantics signal low attention to craft | Low | Verify landmark roles (nav, main, footer), heading hierarchy (no skipped levels), and alt text on all images. |
| **Environment variable validation** | Hardcoded Supabase credentials with fallback values is a security and reliability risk | Low | Fail fast at startup if NEXT_PUBLIC_SUPABASE_URL or key is missing. Remove hardcoded fallback JWT tokens from source code. |

## Differentiators

Features that set a portfolio site apart. Not expected, but signal professionalism and engineering depth.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Smooth dark/light mode toggle** | A manual toggle (in addition to system preference) lets visitors choose. Demonstrates attention to UX. | Medium | Use next-themes library: 2-line setup, prevents flash of wrong theme via blocking script, integrates with Tailwind class strategy. Current site only respects prefers-color-scheme; adding a toggle is a step up. |
| **Unit test suite with meaningful coverage** | Shows engineering discipline. Zero tests currently. Even basic coverage of i18n utils, Supabase helpers, and key components demonstrates professionalism. | Medium | Vitest + React Testing Library. Prioritize: isValidLocale(), getDictionary(), subscribeEmail(), SubscribeForm component. Target 80% on utilities, 60% on components. |
| **Loading states with Suspense** | Skeleton UI during navigation prevents content flash and feels polished | Low | Add loading.tsx files for key route segments (notes, projects). Next.js wraps page content in Suspense boundary automatically. |
| **Proper TypeScript strictness** | Type safety catches bugs before they ship. Current codebase uses as-Locale type casts that could be fragile. | Medium | Create validated helper functions that return typed results or throw. Replace raw type casts with runtime-validated narrowing. Add strict TypeScript compiler options if not already enabled. |
| **Console-free error logging** | Basic structured logging instead of console.warn shows production-readiness | Low | Create a simple logger utility (log levels, structured output). Wrap existing console.warn calls. No need for Sentry yet (explicitly out of scope). |
| **HTML sanitization for rendered content** | Protects against future XSS if content sources change from hardcoded to dynamic | Low | Add DOMPurify or sanitize-html for any raw HTML rendering. Current data is static but the pattern is defensive. |
| **Contrast ratio compliance (WCAG AA)** | 4.5:1 for body text, 3:1 for large text. Especially important in dark mode where this commonly fails. | Low | Audit all CSS variable color pairs. Current light theme looks fine (#171717 on #fafafa is excellent). Dark mode variables need careful selection: avoid pure black backgrounds (#121212 or #1a1a1a preferred over #000000). |
| **Reduced motion support** | Users with vestibular disorders need the option to disable animations | Low | Add @media (prefers-reduced-motion: reduce) to disable transitions/animations. Tailwind provides motion-reduce variant. |

## Anti-Features

Features to explicitly NOT build in this milestone. These are scope creep traps.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **CMS integration or dynamic content backend** | Out of scope. Current hardcoded data works fine for a personal portfolio. Migration to CMS is a future milestone. | Split monolithic blog-posts.ts into per-post files for maintainability, but keep them as TypeScript/JSON files. |
| **Full E2E test suite (Playwright/Cypress)** | Diminishing returns for a personal portfolio. Unit + integration tests cover the critical paths. | Focus Vitest unit tests on utilities and key components. Manual smoke testing for visual flows. |
| **Sentry or third-party error tracking** | Explicitly out of scope per project constraints. Adds complexity and a third-party dependency for a personal site. | Basic structured logger utility that logs to console with levels. Can integrate Sentry in a future milestone. |
| **Theme customization beyond dark/light** | Multiple themes (solarized, high-contrast, etc.) adds complexity with no proportional value for a portfolio. | Dark + light + system preference is the right scope. |
| **Redesign or visual overhaul** | Project constraint: preserve existing design language. | Fix what is broken (dark mode, spacing), do not reimagine the design. |
| **React Hook Form** | Overkill for 2 simple forms (subscribe + contact). Adds bundle size and complexity. | Use native form handling with Zod validation. Next.js Server Actions + useActionState provide built-in pending state. For simple forms, Zod alone is sufficient without a form library. |
| **Animation library (Framer Motion, etc.)** | Adding animations is a design feature, not a quality fix. Not in scope for this polish milestone. | If animations exist, ensure they respect prefers-reduced-motion. Do not add new ones. |
| **Internationalized error pages** | Complex to implement correctly with the current i18n setup. Error pages (error.tsx, global-error.tsx) run outside the locale layout context. | Use English-only error pages. The next-intl docs describe workarounds, but it is not worth the complexity for this milestone. |
| **CSS-in-JS library (styled-components, etc.)** | Moving AWAY from inline styles, not toward a different styling system. | Tailwind utility classes are already in the project and underutilized. |

## Feature Dependencies

```
Dark mode CSS variables  -->  Dark mode toggle (toggle requires variables to exist)
Dark mode CSS variables  -->  Contrast ratio audit (cannot audit dark colors until defined)
Inline style migration   -->  Spacing consistency (Tailwind classes enforce scale)
Zod validation schemas   -->  Form validation UI (schemas define what to validate)
Vitest setup             -->  Unit tests (framework must exist first)
Environment validation   -->  Supabase credential cleanup (validate before removing fallbacks)
error.tsx / not-found.tsx -->  Loading states (loading.tsx wraps inside error.tsx boundary)
Skip-to-content link     -->  Semantic HTML audit (link needs a target landmark)
```

## MVP Recommendation

### Must complete (table stakes, in priority order):

1. **Environment variable validation** - Security fix. Lowest effort, highest urgency. Remove hardcoded Supabase credentials and add startup validation.
2. **Dark mode CSS variable overrides** - Core value of the milestone per PROJECT.md. Define dark values for all custom properties in globals.css.
3. **Error boundaries** - error.tsx, not-found.tsx, global-error.tsx, loading.tsx. Low effort, high impact on perceived quality.
4. **next/image migration** - Two files to fix. Performance improvement with minimal effort.
5. **Form validation** - Zod schema for email validation, inline error display, submit button disabled state.
6. **Inline style to Tailwind migration** - Largest effort item but critical for maintainability and consistent spacing.
7. **Keyboard focus indicators** - Verify and fix focus-visible styles across all interactive elements.

### Should complete (differentiators with good ROI):

8. **Vitest + React Testing Library setup** - Framework setup + 5-10 key tests for utilities and SubscribeForm.
9. **Dark/light mode toggle** - Use next-themes for a user-controlled switch. Small effort after CSS variables are defined.
10. **Reduced motion support** - Quick CSS media query additions.
11. **Skip-to-content link** - 10 minutes of work, meaningful accessibility improvement.

### Defer to later milestones:

12. **Full TypeScript strictness audit** - Valuable but time-intensive. Address the most fragile casts (Locale) now, defer comprehensive audit.
13. **HTML sanitization** - Low risk while content is static. Add when/if content becomes dynamic.
14. **Structured logger utility** - Nice to have, not blocking.
15. **Bundle analysis and i18n optimization** - Important but less visible to users.
16. **Blog data splitting** - Maintainability improvement, no user-facing impact.

## Implementation Notes

### Dark Mode: CSS Variables vs next-themes

The current site uses prefers-color-scheme media queries for two minor elements (project hero image, carousel nav). The core variables in :root have NO dark overrides.

**Option A (simpler, matches current architecture):** Add @media (prefers-color-scheme: dark) block in globals.css that overrides all CSS custom properties. No JavaScript needed. Respects system preference automatically.

**Option B (more complete, enables toggle):** Install next-themes, add ThemeProvider to layout, use [data-theme='dark'] selector instead of media query. Enables a manual toggle button. Prevents flash of wrong theme.

**Recommendation:** Option A first (define the variables), then Option B (add toggle) as a differentiator. The variables work the same way regardless of whether they are triggered by media query or data attribute. Dark color recommendations:
- --bg: #0a0a0a (near-black, not pure black)
- --bg-alt: #141414
- --surface: #1a1a1a
- --text-primary: #ededed (not pure white -- reduce eye strain)
- --text-secondary: #a3a3a3
- --text-muted: #737373
- --border: #2a2a2a
- --accent: #60a5fa (lighter blue for dark backgrounds)

### Form Validation: Zod Without React Hook Form

For two simple forms (SubscribeForm email field, Contact page), Zod alone is sufficient:

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
```

Use this schema on both client (inline validation) and server (Server Action validation). The useActionState hook from React 19 provides pending state for button disabling.

### Testing: What to Test First

Priority order for maximum coverage with minimum effort:
1. isValidLocale() - Pure function, easy to test exhaustively
2. getLocalizedPath() - Pure function with clear inputs/outputs
3. subscribeEmail() - Mock Supabase, test success/error/duplicate paths
4. SubscribeForm component - Render, type email, submit, verify states
5. getDictionary() - Mock imports, test fallback behavior

### Error Boundaries: File Hierarchy

```
src/app/
  global-error.tsx    -- Catches layout-level errors (must include <html><body>)
  not-found.tsx       -- Custom 404 page
  [locale]/
    error.tsx         -- Catches page-level errors within locale layout
    loading.tsx       -- Loading skeleton for locale pages
    notes/
      error.tsx       -- Optional: granular error handling for notes
      loading.tsx     -- Loading skeleton for notes listing
    projects/
      loading.tsx     -- Loading skeleton for projects listing
```

Key rules from Next.js docs:
- error.tsx MUST be a client component ('use client' directive)
- global-error.tsx MUST include html and body tags (replaces root layout)
- not-found.tsx takes precedence over error.tsx for 404s
- loading.tsx is wrapped by error.tsx in the component hierarchy

## Sources

- [Next.js Error Handling docs](https://nextjs.org/docs/app/getting-started/error-handling) - Official error boundary file conventions
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) - Dark mode library for Next.js
- [Next.js Forms Guide](https://nextjs.org/docs/app/guides/forms) - Official form handling with Server Actions
- [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist) - Accessibility requirements
- [Dark Mode Best Practices 2026](https://natebal.com/best-practices-for-dark-mode/) - Color selection and contrast guidance
- [Zod Validation Guide for Next.js](https://dev.to/whoffagents/zod-the-complete-validation-guide-for-nextjs-and-typescript-524k) - Schema validation patterns
- [Next.js Dark Mode with next-themes](https://eastondev.com/blog/en/posts/dev/20251220-nextjs-dark-mode-guide/) - Implementation guide
- [Focus Indicators for Accessibility](https://www.a11y-collective.com/blog/focus-indicator/) - WCAG 2.2 focus appearance requirements
- Codebase analysis: .planning/codebase/CONCERNS.md, CONVENTIONS.md, TESTING.md, ARCHITECTURE.md
