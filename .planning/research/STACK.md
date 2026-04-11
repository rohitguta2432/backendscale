# Technology Stack

**Project:** NexusAI Quality & Polish Milestone
**Researched:** 2026-04-11

## Recommended Stack

This stack is additive -- these are libraries to ADD to the existing Next.js 16.1.6 + React 19.2.3 + Tailwind CSS 4 + TypeScript foundation. No framework changes.

### Dark Mode Theming

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| next-themes | ^0.4.6 | Theme switching (dark/light/system) | De facto standard for Next.js dark mode. Zero dependencies, <1KB, handles SSR flash-of-wrong-theme. 6000+ stars, used by shadcn/ui and most Next.js dark mode implementations. Works with App Router via a client component wrapper. | HIGH |

**No alternatives needed.** next-themes is the only serious option for Next.js theme switching. Rolling your own theme provider is wasted effort when next-themes handles all edge cases (SSR hydration, system preference detection, localStorage persistence, flash prevention).

**Tailwind CSS 4 dark mode configuration** (no package needed -- CSS-only):

```css
/* In your main CSS file (e.g., globals.css) */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

This replaces the old `darkMode: 'class'` from tailwind.config.js. Tailwind v4 is CSS-first -- all configuration lives in CSS via `@custom-variant`. The `next-themes` library adds/removes the `.dark` class on `<html>`, which this variant selector picks up.

**CSS variable overrides for dark mode** (extend existing architecture):

```css
@layer base {
  :root {
    --bg: #ffffff;
    --text-primary: #1a1a1a;
    --text-secondary: #4a4a4a;
    --text-muted: #888888;
    --card-bg: #f5f5f5;
    --border: #e0e0e0;
  }
  .dark {
    --bg: #0a0a0a;
    --text-primary: #f0f0f0;
    --text-secondary: #b0b0b0;
    --text-muted: #777777;
    --card-bg: #1a1a1a;
    --border: #2a2a2a;
  }
}
```

This extends the site's existing CSS custom property architecture rather than replacing it. The PROJECT.md confirms the site already uses CSS variables for theming but lacks dark mode definitions.

### Form Validation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| zod | ^3.24 | Schema validation (forms + API inputs + runtime types) | Industry standard for TypeScript runtime validation. Used in Next.js official docs examples. Schemas are shareable between client and server. Pairs with Server Actions via `useActionState`. | HIGH |

**Use Zod 3.x, NOT Zod 4.x** for this project. Rationale:
- Zod 4 (released mid-2025) is stable but the ecosystem is still catching up. React Hook Form's Zod resolver, for example, had incremental Zod 4 support added later.
- This is a portfolio site polish milestone, not a greenfield project. Zod 3 has universal compatibility and extensive documentation.
- Zod 3 is battle-tested and sufficient for subscribe/contact form validation.
- Migration path exists if Zod 4 is desired later (`zod/v4` subpath import).

**Do NOT add React Hook Form.** For two simple forms (SubscribeForm, Contact), React Hook Form adds unnecessary complexity. Use Zod schemas directly with React 19's `useActionState` and Server Actions -- this is the modern Next.js pattern and avoids a client-side form library dependency entirely.

### Testing

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| jest | ^29.7 | Test runner | Next.js official docs recommend Jest. `next/jest` wrapper auto-handles CSS/image mocking, env vars, and TS transformation. | HIGH |
| jest-environment-jsdom | ^29.7 | Browser-like test environment | Required for DOM testing with Jest. | HIGH |
| @testing-library/react | ^16.3 | Component rendering/querying | Standard React component testing. v16.x supports React 19. | HIGH |
| @testing-library/dom | ^10.4 | DOM utilities | Peer dependency of @testing-library/react. | HIGH |
| @testing-library/jest-dom | ^6.6 | Custom Jest matchers (toBeVisible, toHaveTextContent, etc.) | Dramatically improves test readability with DOM-specific assertions. | HIGH |
| @types/jest | ^29 | Jest TypeScript types | Required for TS test files. | HIGH |
| ts-node | ^10 | TypeScript execution for Jest config | Needed if jest.config.ts is used (recommended for TS projects). | MEDIUM |

**Limitation:** Jest does NOT support async Server Components. The official Next.js docs state this clearly. Test strategy should be:
- Unit test client components and shared utilities with Jest + RTL
- Test server components only if they are synchronous
- For async server components, defer to E2E testing (out of scope for this milestone)

**Do NOT add Playwright/Cypress for this milestone.** The PROJECT.md scopes this to "basic" testing setup. Jest + RTL covers component-level tests which is the right starting point for a project with zero test coverage.

### Error Handling (No Additional Packages)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js App Router conventions | (built-in) | error.tsx, loading.tsx, not-found.tsx, global-error.tsx | No library needed. Next.js file conventions provide React error boundaries automatically. | HIGH |

Error boundary files are built into Next.js App Router:
- `error.tsx` -- catches rendering errors in route segments (MUST be a client component with `'use client'`)
- `global-error.tsx` -- catches errors in root layout (must include `<html>` and `<body>` tags)
- `not-found.tsx` -- custom 404 UI
- `loading.tsx` -- Suspense fallback for route segments

Key gotcha: `error.tsx` does NOT catch errors in `layout.tsx` of the same segment. To catch layout errors, place `error.tsx` in the parent segment.

### Error Logging (No Additional Packages)

The PROJECT.md explicitly puts Sentry out of scope. Use `console.error` with structured logging for now. No package needed.

## Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| @next/bundle-analyzer | ^16 | Bundle size analysis | During optimization phase to identify large bundles | MEDIUM |

**Not recommending** any additional supporting libraries. This is a polish milestone -- minimize new dependencies.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Dark mode | next-themes | Custom ThemeProvider | next-themes solves SSR flash, localStorage sync, system preference -- reimplementing is wasted effort |
| Dark mode | next-themes | CSS-only prefers-color-scheme | Site needs manual toggle (light/dark/system), not just system detection. PROJECT.md implies user control. |
| Validation | Zod 3 | Zod 4 | Ecosystem compatibility still maturing. Zod 3 is battle-tested and sufficient for this scope. |
| Validation | Zod + useActionState | React Hook Form + Zod | Two simple forms don't justify RHF's complexity. useActionState is the modern Next.js pattern. |
| Validation | Zod | Yup | Zod has better TypeScript inference, is faster, and is the community standard for Next.js. Yup is legacy. |
| Validation | Zod | Valibot | Smaller bundle but much smaller ecosystem. Zod is the default choice unless bundle size is critical. |
| Testing | Jest + RTL | Vitest + RTL | Next.js official docs and `next/jest` wrapper are Jest-first. Vitest works but requires more manual config with Next.js. |
| Testing | Jest + RTL | Playwright | E2E testing is out of scope for this milestone. Jest + RTL is the right starting point. |
| Error handling | Built-in App Router | react-error-boundary | Next.js error.tsx IS a React error boundary. Using react-error-boundary adds nothing for route-level errors. For component-level boundaries within a page, react-error-boundary could help, but it's not needed for this milestone's scope. |

## Installation

```bash
# Dark mode
npm install next-themes

# Validation
npm install zod

# Testing (dev dependencies)
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @types/jest ts-node

# Optional: bundle analysis
npm install -D @next/bundle-analyzer
```

## Configuration Files Needed

### jest.config.ts
```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

### jest.setup.ts
```typescript
import '@testing-library/jest-dom'
```

### package.json script addition
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Sources

- [next-themes on npm](https://www.npmjs.com/package/next-themes) - v0.4.6, last published ~1 year ago
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) - 6000+ stars
- [Tailwind CSS v4 dark mode docs](https://tailwindcss.com/docs/dark-mode) - @custom-variant syntax
- [Next.js Jest testing guide](https://nextjs.org/docs/app/guides/testing/jest) - official setup
- [@testing-library/react on npm](https://www.npmjs.com/package/@testing-library/react) - v16.3.2, React 19 compatible
- [Zod on npm](https://www.npmjs.com/package/zod) - v3.24.x (Zod 3 latest) / v4.3.6 (Zod 4)
- [Zod v4 release notes](https://zod.dev/v4) - migration guide and versioning
- [Next.js error handling docs](https://nextjs.org/docs/app/getting-started/error-handling) - error.tsx, global-error.tsx patterns
- [shadcn/ui dark mode with Next.js](https://ui.shadcn.com/docs/dark-mode/next) - next-themes + Tailwind pattern
