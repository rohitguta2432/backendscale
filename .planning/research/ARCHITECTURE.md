# Architecture Patterns

**Domain:** Next.js Portfolio Site Quality & Polish
**Researched:** 2026-04-11

## Recommended Architecture

No architectural overhaul needed. This milestone extends the existing architecture with well-defined patterns.

### Component Boundaries for New Code

| Component | Responsibility | Type | Notes |
|-----------|---------------|------|-------|
| ThemeProvider | Wraps app with next-themes, manages dark/light/system | Client Component | Goes in app/[locale]/layout.tsx body wrapper |
| ThemeToggle | UI button for switching themes | Client Component | Uses `useTheme()` from next-themes |
| error.tsx (per route) | Catches rendering errors, shows fallback | Client Component | MUST use `'use client'` directive |
| global-error.tsx | Catches root layout errors | Client Component | Must include `<html>` and `<body>` |
| not-found.tsx | Custom 404 page | Server Component | Can be async |
| loading.tsx (per route) | Suspense fallback skeleton | Server Component | Rendered during route transitions |
| Zod schemas (lib/schemas/) | Validation schemas shared between client/server | Shared module | NOT a component -- plain TypeScript |

### Data Flow for Dark Mode

```
User clicks ThemeToggle
  --> next-themes updates localStorage + <html> class
  --> Tailwind @custom-variant dark selector activates
  --> CSS variables in .dark {} scope apply
  --> All components re-render with new variable values
  (No React state needed -- pure CSS cascade)
```

### Data Flow for Form Validation

```
User submits form
  --> Client: Zod schema validates input (instant feedback)
  --> Server Action: Zod schema validates again (security)
  --> If valid: write to Supabase
  --> If invalid: return errors via useActionState
  --> Client: display field-level error messages
```

## Patterns to Follow

### Pattern 1: CSS Variable Theming (extend existing)
**What:** Define all color tokens as CSS custom properties, override in .dark scope
**When:** Any color that needs to change between light/dark
**Why:** Site already uses this pattern but only for a few properties. Extend, don't replace.

```css
/* globals.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  :root {
    --bg: #ffffff;
    --text-primary: #111827;
  }
  .dark {
    --bg: #0f172a;
    --text-primary: #f1f5f9;
  }
}
```

```tsx
// Use in Tailwind classes:
<div className="bg-[var(--bg)] text-[var(--text-primary)]">
```

### Pattern 2: Colocated Error Boundaries
**What:** Place error.tsx alongside page.tsx in each route segment
**When:** Every route segment that could fail (data fetching, dynamic content)

```
app/[locale]/
  error.tsx          <-- catches errors in page.tsx
  page.tsx
  blog/
    error.tsx        <-- catches errors in blog pages
    page.tsx
    [slug]/
      error.tsx      <-- catches errors in individual blog posts
      page.tsx
```

### Pattern 3: Shared Validation Schemas
**What:** Define Zod schemas in a shared location, import from both client and server
**When:** Any form that submits data

```typescript
// lib/schemas/subscribe.ts
import { z } from 'zod';

export const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
```

### Pattern 4: Inline Style to Tailwind Migration
**What:** Replace `style={{ padding: '20px', margin: '10px' }}` with Tailwind classes
**When:** Every component with inline style objects (272 instances)

```tsx
// Before:
<div style={{ padding: '24px', margin: '16px 0', backgroundColor: '#f5f5f5' }}>

// After:
<div className="p-6 my-4 bg-[var(--card-bg)]">
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Mixing Theme Strategies
**What:** Using `prefers-color-scheme` media queries AND class-based dark mode simultaneously
**Why bad:** Creates conflicts where system preference overrides user choice or vice versa
**Instead:** Use class-based dark mode exclusively via next-themes. next-themes handles system preference detection internally.

### Anti-Pattern 2: Theme-Aware Components via Props
**What:** Passing `isDark` prop through component trees
**Why bad:** Creates prop drilling, couples components to theme state
**Instead:** Use CSS variables. Components are theme-agnostic -- they reference `var(--text-primary)` and CSS handles the rest.

### Anti-Pattern 3: Testing Implementation Details
**What:** Testing that a component renders a specific HTML structure or CSS class
**Why bad:** Brittle tests that break on refactors
**Instead:** Test behavior -- "form shows error when email is invalid", "button triggers submission"

### Anti-Pattern 4: Wrapping Layout in Error Boundary
**What:** Trying to catch layout.tsx errors with error.tsx in the same segment
**Why bad:** Does not work -- Next.js error boundaries don't catch errors in same-segment layouts
**Instead:** Place error.tsx in the PARENT segment, or use global-error.tsx for root layout

## Scalability Considerations

Not applicable for this milestone -- this is a personal portfolio site. No scaling concerns.

## Sources

- [Tailwind CSS v4 dark mode docs](https://tailwindcss.com/docs/dark-mode)
- [Next.js error handling](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js forms guide](https://nextjs.org/docs/pages/guides/forms)
