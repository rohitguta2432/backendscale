# Technology Stack

**Analysis Date:** 2026-04-11

## Languages

**Primary:**
- TypeScript ^5 - Full codebase including App Router, layouts, components, and utilities
- JavaScript - Build and configuration files

**Secondary:**
- CSS - Global styles in `src/app/globals.css`, component-level styling via Tailwind
- XML - RSS feed generation in `src/app/feed.xml/route.ts`
- JSON - Content data structures, configuration

## Runtime

**Environment:**
- Node.js (inferred from Next.js 16.1.6 and package.json scripts)

**Package Manager:**
- npm (inferred from package.json presence)
- Lockfile: Not visible in exploration (likely package-lock.json or node_modules present)

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack framework with App Router, server components, dynamic routes `[locale]`
- React 19.2.3 - UI component library with server/client components
- React DOM 19.2.3 - DOM rendering

**Styling:**
- Tailwind CSS 4 - Utility-first CSS framework via `@tailwindcss/postcss`
- PostCSS 4 - CSS transformation pipeline via `postcss.config.mjs`

**Type Safety:**
- TypeScript ^5 - Strict type checking configured in `tsconfig.json` with:
  - Target: ES2017
  - Module: esnext
  - Path aliases: `@/*` → `./src/*`
  - JSX: react-jsx

**Development Tools:**
- ESLint ^9 - Code linting via `eslint` and `eslint-config-next`

## Key Dependencies

**Critical:**
- @supabase/supabase-js ^2.93.3 - Supabase client for database and authentication
- @types/node ^20 - Node.js type definitions
- @types/react ^19 - React type definitions
- @types/react-dom ^19 - React DOM type definitions

**UI & Fonts:**
- @tailwindcss/postcss ^4 - PostCSS plugin for Tailwind CSS
- Google Fonts imported via `next/font/google`:
  - Inter (Latin subset, display: swap)
  - JetBrains Mono (Latin subset, display: swap, for code)
  - Noto Sans Arabic (Arabic subset, display: swap, for RTL locales)

**Build & Development:**
- eslint-config-next 16.1.6 - Next.js ESLint configuration

## Configuration

**Environment:**
- Environment variables are public-facing only (prefixed with `NEXT_PUBLIC_`):
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase instance URL (optional, defaults to public instance)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (optional, defaults to public key)
- Sensitive keys can be provided via environment but have safe fallback values in `src/lib/supabase.ts`
- No `.env.local` found during exploration (development uses fallback values)

**TypeScript Configuration:**
- Path aliases: `@/*` resolves to `./src/*` for cleaner imports
- Strict mode enabled (`strict: true`)
- No emit mode (`noEmit: true`)
- Support for incremental compilation (`incremental: true`)

**Build Configuration:**
- `next.config.ts` - TypeScript configuration with security headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: camera=(), microphone=(), geolocation=()
  - Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  - X-XSS-Protection: 1; mode=block
- i18n handled via dynamic routing with `[locale]` segments (App Router approach)

**PostCSS:**
- Config: `postcss.config.mjs` - Single plugin: `@tailwindcss/postcss`

## Platform Requirements

**Development:**
- Node.js (version not explicitly specified, likely 18+ based on Next.js 16 requirements)
- npm or compatible package manager
- TypeScript 5+

**Production:**
- Vercel (inferred from `next.config.ts` structure and security headers typical of Vercel deployments)
- Static generation where possible (RSS feed at `src/app/feed.xml/route.ts`)
- Server-side rendering for dynamic localized routes `[locale]`

---

*Stack analysis: 2026-04-11*
