# Domain Pitfalls

**Domain:** Next.js 16 portfolio site quality improvements (dark mode, style migration, error boundaries, testing)
**Researched:** 2026-04-11

## Critical Pitfalls

Mistakes that cause rewrites, broken UIs, or major user-visible regressions.

### Pitfall 1: Hardcoded Colors Bypass the CSS Variable System, Breaking Dark Mode

**What goes wrong:** The site defines CSS custom properties in `:root` (--bg, --text-primary, --text-secondary, etc.) but many elements use hardcoded colors that bypass this system entirely. When dark mode variable overrides are added via `@media (prefers-color-scheme: dark)`, these hardcoded values remain unchanged, creating a patchwork where some elements respond to dark mode and others stay light.

**Why it happens:** The codebase has three sources of hardcoded colors:
1. **globals.css hardcoded values:** `.header` uses `rgba(250, 250, 250, 0.9)` instead of a CSS variable (line 117). `.btn-primary:hover` uses `#262626` (line 179). These survive dark mode variable overrides.
2. **Inline style objects:** 277 `style={{}}` objects across 19 files. Some reference CSS variables (`'var(--text-muted)'`) but others likely contain hardcoded hex/rgb values.
3. **Partial dark mode coverage:** Only `.project-hero-image` and `.carousel-nav` have `@media (prefers-color-scheme: dark)` overrides. The other ~400 lines of globals.css have zero dark mode rules.

**Consequences:** Dark mode looks half-broken. Header stays light. Some buttons stay light. Inline-styled text becomes invisible (dark text on dark background). Portfolio looks unprofessional.

**Prevention:**
1. Before writing ANY dark mode CSS, audit every color value in globals.css and inline styles. Create an inventory of hardcoded colors.
2. Replace hardcoded colors in globals.css with CSS variable references (e.g., `.header { background: rgba(var(--bg-rgb), 0.9); }`).
3. Define an `--bg-rgb` variable pattern for rgba usage: `:root { --bg-rgb: 250, 250, 250; }` and `@media (prefers-color-scheme: dark) { :root { --bg-rgb: 23, 23, 23; } }`.
4. For inline styles with hardcoded colors, replace with CSS variable references BEFORE or DURING the dark mode phase. Do not defer to the style migration phase.

**Detection:** Enable OS dark mode, hard refresh. Any element that remains bright or has invisible text = hardcoded color.

**Phase relevance:** Dark mode CSS variable phase. This is the FIRST thing to address.

**Confidence:** HIGH (directly observed in globals.css lines 117, 179 and 277 inline style objects)

---

### Pitfall 2: Inline Style Migration Creates Dual Color Palette

**What goes wrong:** When migrating 277 inline `style={{}}` objects to Tailwind classes, developers replace `color: 'var(--text-primary)'` with Tailwind built-in utilities like `text-gray-900` instead of mapping to the CSS variable system. This creates two independent color systems: Tailwind's default palette and the CSS custom property palette. Dark mode only affects one.

**Why it happens:** Tailwind's autocomplete and documentation suggest `text-gray-900`, `bg-white`, etc. These are the path of least resistance. The project's CSS variables (`--text-primary`, `--surface`, `--border`) need to be registered as Tailwind theme values first, which requires explicit `@theme` configuration in Tailwind v4.

**Consequences:** Half the site responds to dark mode, half doesn't. Colors become inconsistent. Debugging whether a color comes from Tailwind defaults or CSS variables becomes extremely difficult.

**Prevention:**
1. Before migrating any inline styles, register CSS variables as Tailwind theme colors using the v4 `@theme` directive in globals.css:
   ```css
   @theme {
     --color-text-primary: var(--text-primary);
     --color-text-secondary: var(--text-secondary);
     --color-text-muted: var(--text-muted);
     --color-surface: var(--surface);
     --color-bg: var(--bg);
     --color-border: var(--border);
     --color-accent: var(--accent);
   }
   ```
2. Use `text-text-primary`, `bg-surface`, `border-border` as Tailwind utilities throughout the migration.
3. NEVER use Tailwind's default color palette (`gray-900`, `blue-500`) for themed elements. Reserve built-in colors for one-off decorative uses only.
4. Categorize the 277 inline styles into **layout** (padding, margin, display, flex -- safe to convert directly) and **theming** (colors, backgrounds, borders -- must go through CSS variable system).

**Detection:** After migration, toggle dark mode. If some elements change and others don't, the dual-palette problem exists.

**Phase relevance:** Must complete dark mode CSS variables BEFORE migrating inline styles. The `@theme` bridge must exist first.

**Confidence:** HIGH (directly observed -- CSS variables in globals.css, 277 inline styles, Tailwind v4 `@theme` pattern verified in official docs)

---

### Pitfall 3: Removing Global CSS Base Styles Breaks All Pages Simultaneously

**What goes wrong:** globals.css defines base styles for `h1-h6`, `p`, `a`, `section`, and layout classes (`.container`, `.header`, `.nav-links`, etc.). During inline style migration, developers remove these global rules thinking they've been replaced by Tailwind utilities in individual components. But some components still rely on the cascading base styles without explicitly referencing them.

**Why it happens:** The codebase has a hybrid styling approach: globals.css defines base element styles (typography, section padding, link colors), components use inline styles, and some components (reliability pages) already use Tailwind `dark:` utilities (197 occurrences across 6 files). No single component is self-contained -- they all implicitly depend on the global base styles.

**Consequences:** Headings lose their sizes. Paragraphs lose their color (`color: var(--text-secondary)` on the `p` element). Links lose styling. Section padding disappears. Every page breaks at once.

**Prevention:**
1. Do NOT remove any base styles from globals.css until verified that NO component depends on them.
2. Migrate one component at a time. After migrating a component, check if removing its corresponding global CSS class breaks anything.
3. The reliability pages already use Tailwind `dark:` variants -- use those as the reference pattern for consistent styling.
4. Keep globals.css base styles as a safety net throughout the entire migration. Only remove a global rule as the very last step, after confirming zero dependencies via grep.

**Detection:** After any globals.css change, visually check all pages: home, notes, about, services, projects, contact, and all reliability sub-pages. A visual regression tool would catch this.

**Phase relevance:** Inline style migration phase. Never remove global styles speculatively.

**Confidence:** HIGH (directly observed -- globals.css has 600+ lines of base styles, components implicitly depend on them)

---

### Pitfall 4: error.tsx Cannot Catch Layout Errors -- global-error.tsx Required

**What goes wrong:** Developers add `error.tsx` to `src/app/[locale]/` and assume all errors are caught. But `error.tsx` does NOT catch errors thrown in `layout.tsx` of the same segment. The `[locale]/layout.tsx` does async param resolution and calls `getDictionary()` with 4 dynamic imports via `Promise.all`. If any import fails, the error boundary at the same level won't catch it.

**Why it happens:** Next.js error boundaries wrap page content, not the layout. This is an architectural constraint: layout renders ABOVE the error boundary in the component tree.

**Consequences:** Dictionary loading failures, invalid locale params, or other layout errors show the generic Next.js error page (or blank screen) instead of a branded error UI.

**Prevention:**
1. Add `src/app/global-error.tsx` to catch layout-level and root-level errors. This file MUST include `<html>` and `<body>` tags because it completely replaces the root layout.
2. Add `src/app/[locale]/error.tsx` for page-level errors within the locale segment.
3. Both files MUST start with `'use client'` directive.
4. `global-error.tsx` cannot access the `[locale]` param -- keep its content language-neutral or detect locale from `navigator.language` on the client.
5. Test by temporarily throwing in `[locale]/layout.tsx` to verify `global-error.tsx` activates.

**Detection:** Throw an error in layout.tsx. If the default Next.js error page appears instead of a custom one, `global-error.tsx` is missing.

**Phase relevance:** Error boundary phase. Independent of dark mode and style migration.

**Confidence:** HIGH (verified against Next.js official documentation)

---

### Pitfall 5: Jest Cannot Test Async Server Components

**What goes wrong:** Teams try to write Jest tests for async Server Components (`src/app/[locale]/page.tsx`, `notes/[slug]/page.tsx`, etc.) and spend days debugging why rendering fails. Jest's test renderer fundamentally does not support async React Server Components.

**Why it happens:** Async Server Components are a React 19 feature that runs on the server. Jest runs in jsdom, which cannot execute the server component protocol. The Next.js official docs explicitly state: "Jest currently does not support async Server Components."

**Consequences:** Wasted effort. Test suite that appears comprehensive but skips the most important code paths (pages with data fetching). False confidence.

**Prevention:**
1. Scope Jest tests to Client Components ONLY:
   - `Header.tsx`, `SubscribeForm.tsx`, `ImageCarousel.tsx`, `NotesPageClient.tsx` (the `'use client'` components)
2. Test utility functions directly:
   - `src/lib/i18n.ts` -- locale validation, path generation, dictionary loading
   - `src/lib/supabase.ts` -- email subscription logic
3. For page-level testing (async components, routing, locale switching), plan Playwright E2E tests in a future milestone.
4. Do NOT attempt to render `page.tsx` files in Jest -- it will fail or produce meaningless results.

**Detection:** If test files import from `src/app/[locale]/*/page.tsx` and call `render()`, this pitfall is active.

**Phase relevance:** Testing setup phase. Establish test scope boundaries BEFORE writing any tests.

**Confidence:** HIGH (confirmed in Next.js official testing documentation)

## Moderate Pitfalls

### Pitfall 6: Tailwind v4 @theme Directive Misconfiguration

**What goes wrong:** When bridging `:root` CSS variables to Tailwind's theme system, developers use `@theme` incorrectly -- either duplicating variable definitions (creating conflicts), using wrong syntax, or failing to understand that Tailwind v4 is CSS-first (no `tailwind.config.js` extend pattern).

**Why it happens:** Tailwind v4's configuration model changed completely from v3. The `darkMode` config key no longer exists. Theme customization uses `@theme` in CSS, not JavaScript config. Many tutorials and AI suggestions still show v3 patterns.

**Prevention:**
1. Use `@theme` to register CSS variable references. Keep `:root` definitions separate.
2. For dark mode with `prefers-color-scheme`, Tailwind v4's `dark:` variant works automatically -- no configuration needed.
3. If manual theme toggling is ever needed, use `@custom-variant dark (&:where(.dark, .dark *))` in CSS (not a config file).
4. Reference Tailwind v4 docs exclusively, not v3 tutorials.

**Detection:** Custom Tailwind color utilities don't apply expected colors, or `dark:` variants of custom theme colors don't respond to theme changes.

**Phase relevance:** Dark mode phase. Must be resolved before inline style migration.

**Confidence:** MEDIUM (Tailwind v4 theme API verified in docs, but edge cases with CSS variable composition may require experimentation)

---

### Pitfall 7: NotesPageClient Component Too Large to Test or Migrate Safely

**What goes wrong:** `NotesPageClient.tsx` (504 lines, 74 inline style objects) is a monolithic client component handling filtering, card rendering, and layout. Testing it requires mocking too many things. Migrating its 74 inline styles in place is error-prone because changes to one section affect the entire component.

**Why it happens:** The component was built incrementally without test considerations. It's a "god component" that handles everything for the notes listing page.

**Prevention:**
1. Before writing tests for NotesPageClient, extract sub-components: FilterBar, NoteCard, NotesList.
2. Perform this decomposition DURING the inline style migration phase (you're touching every line anyway).
3. Write tests for extracted sub-components, not the monolith.
4. Each sub-component should be independently testable with clear props interfaces.

**Detection:** If a test file for NotesPageClient exceeds 200 lines or requires more than 5 mocks, the component needs decomposition first.

**Phase relevance:** Style migration phase (decompose) then testing phase (test the pieces).

**Confidence:** HIGH (directly observed -- 504 lines, 74 inline styles)

---

### Pitfall 8: next/navigation Mocking Failures in Tests

**What goes wrong:** Client components (Header, LanguageSwitcher) use `useRouter`, `usePathname`, and locale-based navigation. Tests crash with "invariant: expected app router" or "useRouter must be used within a RouterProvider."

**Why it happens:** Next.js App Router navigation hooks require router context that doesn't exist in Jest's jsdom environment. The i18n layer adds complexity because locale is derived from pathname.

**Prevention:**
1. Create a shared mock file (`src/__tests__/utils/navigation-mocks.ts`) with consistent mocks for `useRouter`, `usePathname`, `useSearchParams`, `useParams`.
2. Include locale in mock pathname (e.g., `/en/notes`).
3. Place `jest.mock('next/navigation')` at the TOP of every test file that tests navigation-dependent components. Jest hoisting rules require this.
4. Mock `useParams` to return `{ locale: 'en' }` for components that read locale from params.

**Detection:** "Cannot read properties of null (reading 'push')" or "useRouter only works in Client Components" in test output.

**Phase relevance:** Testing setup phase. Build mock utilities FIRST, before writing component tests.

**Confidence:** HIGH (standard well-documented pattern)

---

### Pitfall 9: Dark Mode Flash of Incorrect Theme (FART)

**What goes wrong:** Users on dark OS themes see a white flash on page load. The server renders light theme HTML, and the dark CSS variables only apply after the browser evaluates `@media (prefers-color-scheme: dark)`.

**Why it happens:** With a pure CSS `prefers-color-scheme` approach (which this project uses), the flash is actually minimal because browsers apply CSS media queries before first paint. The REAL flash risk comes from the hardcoded colors identified in Pitfall 1 -- `rgba(250, 250, 250, 0.9)` in the header is evaluated as a literal value and is NOT affected by CSS variable overrides.

**Consequences:** Brief white flash of the header on every page load for dark mode users. Less severe than class-based FOUC but still noticeable.

**Prevention:**
1. The `prefers-color-scheme` media query approach is actually the LEAST FOUC-prone strategy. Do NOT switch to class-based toggling unless manual theme switching is needed.
2. Eliminate the flash risk by ensuring zero hardcoded colors remain -- all colors must flow through CSS variables.
3. If a manual toggle is added in the future, adopt `next-themes` with its blocking `<script>` injection. Do NOT build a custom solution.
4. Test by recording page load with Chrome DevTools Performance panel and checking for white frames.

**Detection:** Hard refresh with OS dark mode enabled. Any white flash = hardcoded colors still present.

**Phase relevance:** Dark mode phase. Addressed by fixing Pitfall 1.

**Confidence:** HIGH (CSS specification behavior verified; `prefers-color-scheme` media queries are applied before first paint)

## Minor Pitfalls

### Pitfall 10: Jest Configuration Mismatch With Next.js 16

**What goes wrong:** Following older tutorials that use manual Jest configuration instead of `next/jest` leads to cryptic errors about module resolution, undefined `fetch`, or CSS import failures.

**Prevention:**
1. Use `next/jest` to create the Jest configuration. It auto-handles SWC transforms, `@/` path aliases, CSS module mocking, and `.env` loading.
2. Install: `jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom`.
3. Set `testEnvironment: 'jsdom'` in config.
4. Verify `@/` path alias works in test imports.

**Detection:** `SyntaxError: Cannot use import statement outside a module` or `ReferenceError: fetch is not defined` in test output.

**Phase relevance:** Testing setup phase.

**Confidence:** HIGH

---

### Pitfall 11: Loading and Error States Ignore Dark Mode

**What goes wrong:** New `loading.tsx` and `error.tsx` files use hardcoded light colors for skeletons and error UI. On dark mode, these appear as bright white rectangles, worse than no loading state at all.

**Prevention:**
1. All `loading.tsx` skeleton elements must use CSS variables or Tailwind dark mode utilities.
2. Use `bg-[var(--surface)]` or the registered Tailwind theme color, not `bg-gray-200`.
3. Error pages should also respect dark mode -- use CSS variables for all colors.
4. Test loading and error states in both light and dark modes.

**Detection:** Navigate between pages with dark mode enabled. Bright loading flashes = this pitfall.

**Phase relevance:** Error boundary phase. Build these after dark mode variables are complete.

**Confidence:** MEDIUM (common pattern, not yet in codebase since these files don't exist yet)

---

### Pitfall 12: i18n Not Considered in Error and Not-Found Pages

**What goes wrong:** Error boundaries and not-found pages show English-only content even when the user is on the Hindi locale. The `reset` button text is hardcoded in English.

**Prevention:**
1. `error.tsx` is a Client Component and cannot use `getDictionary()` (async/server-only). Options:
   - Keep error messages minimal and language-neutral (icons + simple text)
   - Inline a small bilingual string map directly in the component
2. For `not-found.tsx` within `[locale]/`, it CAN be a Server Component and access the locale param, so use `getDictionary()` there.
3. `global-error.tsx` is outside `[locale]` and cannot access locale from params -- keep it language-neutral.

**Detection:** Switch to Hindi locale, trigger an error. English-only error page = this pitfall.

**Phase relevance:** Error boundary phase.

**Confidence:** MEDIUM (architectural constraints verified, i18n patterns vary by approach)

---

### Pitfall 13: Existing Tailwind dark: Classes on Reliability Pages May Conflict

**What goes wrong:** The reliability section pages already have 197 `dark:` Tailwind class usages. These currently use Tailwind's default `prefers-color-scheme` behavior. If the project later switches to class-based dark mode (via `@custom-variant`), these existing classes will stop working until the `.dark` class is added to `<html>`.

**Prevention:**
1. Keep using `prefers-color-scheme` strategy (the default in Tailwind v4) -- this is compatible with the existing reliability page classes.
2. If class-based toggling is ever needed, audit all 197 existing `dark:` usages across the 6 reliability files to ensure they still work.
3. Document the dark mode strategy decision explicitly so future developers don't introduce conflicts.

**Detection:** After any dark mode configuration change, check all reliability sub-pages for correct dark styling.

**Phase relevance:** Dark mode phase. Verify early.

**Confidence:** HIGH (directly observed -- 197 dark: usages in 6 files)

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Dark mode CSS variables | Hardcoded colors bypass variable system (Pitfall 1) | Audit and replace ALL hardcoded colors before adding dark overrides |
| Dark mode CSS variables | Header hardcoded rgba background (Pitfall 1, 9) | Replace `rgba(250,250,250,0.9)` with `rgba(var(--bg-rgb), 0.9)` pattern |
| Dark mode CSS variables | Tailwind @theme bridge misconfiguration (Pitfall 6) | Use `@theme` to register CSS vars as Tailwind colors |
| Dark mode CSS variables | Existing dark: classes on reliability pages (Pitfall 13) | Keep `prefers-color-scheme` strategy, verify compatibility |
| Inline style migration | Dual color system from Tailwind defaults (Pitfall 2) | Map all colors through CSS variable system via @theme |
| Inline style migration | Global CSS removal breaks all pages (Pitfall 3) | Migrate component-by-component, keep globals.css as safety net |
| Inline style migration | NotesPageClient too large for safe migration (Pitfall 7) | Decompose into sub-components during migration |
| Error boundaries | error.tsx doesn't catch layout errors (Pitfall 4) | Add global-error.tsx with html/body tags |
| Error boundaries | Loading/error states ignore dark mode (Pitfall 11) | Use CSS variables in all new loading.tsx/error.tsx files |
| Error boundaries | i18n not considered (Pitfall 12) | Use language-neutral content or inline bilingual strings |
| Testing setup | Trying to test async Server Components (Pitfall 5) | Scope Jest to client components and utility functions only |
| Testing setup | next/navigation mock missing (Pitfall 8) | Create shared mock utility file, use at top of every test |
| Testing setup | Configuration mismatch (Pitfall 10) | Use next/jest, not manual config |

## Recommended Phase Ordering (Based on Pitfall Dependencies)

The pitfall analysis reveals a strict dependency chain:

1. **Dark mode CSS variables FIRST** -- Pitfalls 1, 2, 6, 9, and 13 all require the CSS variable system to be complete and the `@theme` bridge to exist before any other work.
2. **Inline style migration SECOND** -- Pitfalls 2 and 3 show that migration without a complete variable system creates a dual-palette problem. Pitfall 7 shows that large components should be decomposed during this phase.
3. **Error boundaries THIRD (or parallel to migration)** -- Pitfalls 4, 11, and 12 are independent of migration but should use the dark mode variables established in phase 1.
4. **Testing LAST** -- Pitfalls 5, 7, 8, and 10 show that testing is most effective after components are decomposed and the architecture is stable. Testing a moving target wastes effort.

## Sources

- [Next.js Official Error Handling Documentation](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js Official Testing Guide (Jest)](https://nextjs.org/docs/app/guides/testing/jest)
- [Tailwind CSS v4 Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode)
- [Tailwind CSS v4 Theme Configuration](https://github.com/tailwindlabs/tailwindcss/discussions/15083)
- [Fixing Dark Mode Flickering (FOUC) in React and Next.js](https://notanumber.in/blog/fixing-react-dark-mode-flickering)
- [Debugging Tailwind CSS 4 Common Mistakes (2025)](https://medium.com/@sureshdotariya/debugging-tailwind-css-4-in-2025-common-mistakes-and-how-to-fix-them-b022e6cb0a63)
- [How to Test App Router and RSC with Jest -- Next.js Discussion #49603](https://github.com/vercel/next.js/discussions/49603)
- [error.tsx vs global-error.tsx Confusion -- Next.js Discussion #68048](https://github.com/vercel/next.js/discussions/68048)
- [Implementing Dark Mode with Tailwind v4 and Next.js](https://www.thingsaboutweb.dev/en/posts/dark-mode-with-tailwind-v4-nextjs)
