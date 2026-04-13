# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, next/core-web-vitals + next/typescript)
npm start        # Serve production build
```

No test runner is configured yet.

## Architecture

This is a Next.js 16 App Router portfolio site for Rohit Raj (rohitraj.tech), using React 19, Tailwind CSS 4, and TypeScript.

### Routing & i18n

All pages live under `src/app/[locale]/`. The middleware (`src/middleware.ts`) redirects bare paths to a locale prefix using priority: cookie > Accept-Language header > default (`en`). Supported locales: `en`, `hi`, `fr`, `de`, `ar` (Arabic is RTL).

Translation dictionaries are JSON files in `content/{locale}/` with four namespaces: `common`, `home`, `pages`, `meta`. They're loaded via dynamic `import()` in `src/lib/i18n.ts`. The `getDictionary(locale)` function is called in server components and the resulting dict sections are passed as props to child components.

### Layout hierarchy

- `src/app/layout.tsx` — root layout, loads fonts (Inter, JetBrains Mono, Noto Sans Arabic), injects JSON-LD schemas
- `src/app/[locale]/layout.tsx` — locale layout, sets `lang`/`dir` attributes, generates per-locale metadata with alternates

### Data layer

All content data is hardcoded in `src/data/`:
- `projects.ts` — AI project definitions
- `blog-posts.ts` — engineering notes (~3K lines, monolithic)
- `services.ts` — freelance service offerings
- `github.ts` — GitHub repo metadata

### Key modules

- `src/lib/supabase.ts` — Supabase client for email subscriptions (has hardcoded fallback credentials)
- `src/lib/seo-config.ts` — centralized SEO metadata, JSON-LD schema generators (Person, Service, BlogPosting, FAQ, Breadcrumb, SoftwareApplication)
- `src/lib/i18n.ts` — locale definitions, dictionary types, dictionary loader, path helpers

### Styling

Tailwind CSS 4 via `@tailwindcss/postcss` plugin. CSS custom properties defined in `src/app/globals.css` (light theme only — no dark mode overrides exist for core variables). Many components use inline `style` objects instead of Tailwind classes.

### Path alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Security headers

Configured in `next.config.ts`: HSTS, X-Frame-Options DENY, CSP-adjacent headers applied to all routes.

## Landing page sections (in render order)

Header > Hero > AIProjects > ReliabilitySection > Testimonials > Footer — all in `src/components/`. Each receives dictionary props for i18n.
