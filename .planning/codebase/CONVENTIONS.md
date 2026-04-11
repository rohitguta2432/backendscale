# Coding Conventions

**Analysis Date:** 2026-04-11

## Naming Patterns

**Files:**
- **Components:** PascalCase (e.g., `Hero.tsx`, `SubscribeForm.tsx`, `AIProjects.tsx`)
- **Pages:** lowercase with hyphens for dynamic segments (e.g., `page.tsx`, `[locale]/`, `[slug]/`)
- **Utilities/Libraries:** camelCase (e.g., `supabase.ts`, `i18n.ts`, `seo-config.ts`)
- **Data files:** camelCase with descriptive names (e.g., `blog-posts.ts`, `projects.ts`)

**Functions:**
- **React Components:** PascalCase (export default or named exports)
  - Example: `export default function Hero({ dict, locale }: HeroProps) { }`
  - Nested component functions: also PascalCase (e.g., `function AIProjectCard(...)`)
- **Utility/helper functions:** camelCase
  - Example: `export function subscribeEmail(email: string, locale: string)` in `src/lib/supabase.ts`
  - Example: `export async function getDictionary(locale: Locale)` in `src/lib/i18n.ts`
- **Private functions:** camelCase with no export
  - Example: `function getLocaleFromHeaders(request: NextRequest)` in `src/middleware.ts`

**Variables:**
- **State variables:** camelCase (e.g., `email`, `status`, `isOpen`, `message`)
- **Constants:** SCREAMING_SNAKE_CASE or camelCase depending on scope
  - Example: `const LOCALE_COOKIE = 'NEXT_LOCALE'` (exported constant)
  - Example: `const locales = ['en', 'hi', 'fr', 'de', 'ar'] as const` (config constant)
- **Type/Interface instances:** camelCase
  - Example: `const dict = await getDictionary(locale as Locale)`

**Types:**
- **Interfaces:** PascalCase with suffix (e.g., `HeroProps`, `SubscribeFormProps`, `LanguageSwitcherProps`)
- **Type aliases:** PascalCase (e.g., `Locale`, `Dictionary`, `Project`, `Subscriber`)
- **Generic parameters:** PascalCase single letters (e.g., `T`, `K`, `V`)

## Code Style

**Formatting:**
- **Indentation:** 2 spaces (consistent across tsx, ts, mjs files)
- **Line length:** No strict limit, but favor readability
- **Semicolons:** Always included (implicit from eslint-config-next)
- **Quotes:** Double quotes for strings in most files (observed pattern)
  - Exception: `'use client'` directive uses single quotes
- **Trailing commas:** Used in multiline arrays/objects

**Linting:**
- **Tool:** ESLint 9+ with Next.js config
- **Config file:** `eslint.config.mjs`
- **Extends:** `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- **Ignored paths:** `.next/`, `out/`, `build/`, `next-env.d.ts`
- **Command:** `npm run lint` (runs `eslint`)

## Import Organization

**Order:**
1. Built-in modules and Next.js imports (e.g., `import Link from "next/link"`, `import Image from "next/image"`)
2. External packages (e.g., `import { useState } from 'react'`)
3. Type imports (e.g., `import type { Locale }` from `"@/lib/i18n"`)
4. Local absolute imports with alias (e.g., `import Header from "@/components/Header"`)
5. Local relative imports (rarely used; most use `@/` alias)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- All local imports use `@/` prefix: `@/components/`, `@/lib/`, `@/data/`
- Pattern enforced across codebase (observed in all tsx/ts files)

**Example from `src/app/[locale]/page.tsx`:**
```typescript
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AIProjects from "@/components/AIProjects";
import ReliabilitySection from "@/components/ReliabilitySection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
```

## Error Handling

**Patterns:**
- **Try-Catch blocks:** Used for async operations, catch block is empty with comment
  - Example in `src/lib/supabase.ts`:
    ```typescript
    try {
        const { error } = await supabase.from('subscribers').insert([{ email, locale }]);
        if (error) {
            if (error.code === '23505') {
                return { success: false, error: 'Email already subscribed!' };
            }
            return { success: false, error: error.message };
        }
        return { success: true };
    } catch {
        return { success: false, error: 'Failed to subscribe. Please try again.' };
    }
    ```
- **Return-based error handling:** Prefer returning result objects with `{ success, error }` shape
- **Fallback mechanism:** Used in `getDictionary()` - falls back to English if locale files missing
  - Logs warning: `console.warn()` for non-critical failures
- **Next.js route errors:** Use `notFound()` from `next/navigation` for invalid routes
  - Example: `if (!isValidLocale(locale)) notFound();` in page components

**Error reporting:**
- Minimal use of console; only `console.warn()` for i18n fallbacks
- No error tracking libraries configured (Sentry not integrated)
- UI-level error messages passed to user components

## Logging

**Framework:** Native `console` (no dedicated logging library)

**Patterns:**
- **Warning level:** `console.warn()` used for non-critical issues
  - Example: `console.warn(`Dictionary for locale "${locale}" not found, falling back to English`)`
- **No info/debug logging** in production code
- **Conditional in UI:** Error/success messages managed via React state (see `SubscribeForm.tsx`)

## Comments

**When to Comment:**
- Explain *why*, not *what* (code should be self-documenting)
- Used extensively in middleware logic for clarity on parsing and redirects
- Comments above code blocks explain intent or complex logic

**JSDoc/TSDoc:**
- Not used in this codebase
- Comments are inline, not above function signatures
- Type definitions used instead (interfaces, type aliases)

**Example from `src/middleware.ts`:**
```typescript
// Parse Accept-Language header
const languages = acceptLanguage
    .split(',')
    .map((lang) => {
        const [code, q = 'q=1'] = lang.trim().split(';');
        return {
            code: code.split('-')[0].toLowerCase(), // Get primary language code
            quality: parseFloat(q.replace('q=', '')) || 1,
        };
    })
    .sort((a, b) => b.quality - a.quality);

// Find first matching locale
for (const lang of languages) {
    if (isValidLocale(lang.code)) {
        return lang.code;
    }
}
```

## Function Design

**Size:** No strict limit, but observed patterns show:
- Helper functions (1-15 lines): utility functions like `isValidLocale()`, `getLocaleFromHeaders()`
- Component functions (20-100 lines): main React components
- Complex pages (200-500+ lines): full-page components with nested JSX and data fetching

**Parameters:**
- **Destructured props:** Standard for React components
  - Pattern: `interface ComponentProps { prop1: Type; prop2: Type; }` then `export default function Component({ prop1, prop2 }: ComponentProps)`
- **Props pattern with Promise awaiting:** Pages use `type Props = { params: Promise<{ locale: string }> }`
  - Must await params: `const { locale } = await params;`
- **Middleware functions:** Accept single request parameter

**Return Values:**
- **React components:** JSX (tsx files)
- **Async functions:** Promises with explicit return types
  - Example: `export async function subscribeEmail(email: string, locale: string = 'en'): Promise<{ success: boolean; error?: string }>`
  - Example: `export async function getDictionary(locale: Locale): Promise<Dictionary>`
- **Type guards:** Return boolean predicates (e.g., `isValidLocale(locale: string): locale is Locale`)

## Module Design

**Exports:**
- **Default exports:** Used for React components exclusively
  - Example: `export default function Hero({ dict, locale }: HeroProps)`
- **Named exports:** Used for utilities, types, and constants
  - Example: `export async function getDictionary(locale: Locale): Promise<Dictionary>`
  - Example: `export const locales = ['en', 'hi', 'fr', 'de', 'ar'] as const;`
  - Example: `export type Locale = (typeof locales)[number];`

**Barrel Files:**
- Not used in this codebase
- Direct imports from source files (e.g., `import { getDictionary } from "@/lib/i18n"`)

**Module organization:**
- **`src/lib/`**: Utility functions and helpers (supabase, i18n, seo-config)
- **`src/components/`**: React components (reusable across pages)
- **`src/app/`**: Next.js App Router pages, layouts, and routes
- **`src/data/`**: Static data structures (projects, blog posts, etc.)
- **`src/middleware.ts`**: Locale routing middleware

---

*Convention analysis: 2026-04-11*
