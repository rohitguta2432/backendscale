# Codebase Concerns

**Analysis Date:** 2026-04-11

## Security Issues

### Hardcoded Supabase Credentials

**Risk:** Public Supabase credentials exposed in source code
- **Files:** `src/lib/supabase.ts` (lines 3-4)
- **Problem:** Supabase URL and anonymous key are hardcoded with fallback values containing actual JWT tokens. While these are marked as `NEXT_PUBLIC_*` environment variables, the fallback values in code expose real credentials even when environment variables are unset.
- **Current mitigation:** Keys are anonymous-level access only (not full admin)
- **Impact:** If environment variables fail to load, the app falls back to hardcoded credentials, creating a production risk
- **Recommendations:**
  1. Remove all hardcoded fallback values for secrets
  2. Use proper environment variable validation that fails fast at startup
  3. Never commit actual credential values to any branch, even in comments
  4. Rotate the exposed Supabase key immediately in production

### Hardcoded Markdown Rendering Without Sanitization

**Risk:** Potential XSS through blog post content
- **Files:** `src/app/[locale]/notes/[slug]/page.tsx` (line 212), `src/app/[locale]/projects/[slug]/page.tsx` (line 56), `src/app/[locale]/services/[slug]/page.tsx` (lines 93, 99), `src/app/[locale]/contact/page.tsx` (line 33)
- **Problem:** Multiple instances of dangerouslySetInnerHTML rendering structured data. While the blog posts and schema data are currently hardcoded/static, if this pattern is extended to user-generated content or external data sources, it becomes a vector for injection attacks.
- **Current mitigation:** Data is static in hardcoded data files; no external input currently rendered
- **Impact:** Future refactoring to pull content from external sources could introduce XSS vulnerabilities
- **Recommendations:**
  1. For JSON-LD schema tags: continue using dangerouslySetInnerHTML (safe when JSON.stringify is used)
  2. For blog content rendering: add proper HTML sanitization if content ever comes from user input or external sources
  3. Consider using a library like sanitize-html or DOMPurify for any dynamic content
  4. Add TypeScript validation for structured data types

### Plain HTML Images Without Optimization

**Risk:** Performance degradation and potential security exposure
- **Files:** 
  - `src/app/[locale]/notes/[slug]/page.tsx` (line 296)
  - `src/components/AIProjects.tsx` (line 52)
- **Problem:** Two locations use raw `<img>` tags instead of Next.js Image component. These images are not optimized (no responsive sizing, no format conversion, no lazy loading)
- **Impact:** Larger page bundles, slower load times, poor performance on mobile, no responsive image support
- **Recommendations:**
  1. Import Image from next/image
  2. Replace `<img src={...} />` with `<Image src={...} alt={...} width={...} height={...} />`
  3. Add sizes attribute for responsive images
  4. Set priority={false} for below-fold images

## Tech Debt

### Monolithic Blog Post Data Structure

**Issue:** Blog post data is hardcoded in a single large TypeScript file
- **Files:** `src/data/blog-posts.ts` (3,184 lines)
- **Problem:** All blog content is inline in a single TypeScript array, making maintenance difficult. Adding, editing, or removing posts requires modifying a 3K+ line file. The file is difficult to version control and hard to diff.
- **Impact:**
  - Difficult to collaborate on content changes
  - No clear separation of content from code
  - Harder to implement features like drafts, scheduled publishing, or dynamic content
  - Bundle size bloat (all content shipped with every build)
- **Scaling limit:** Adding 50+ more detailed posts makes this unmaintainable
- **Fix approach:** 
  1. Move content to JSON files in `/content/posts/` directory
  2. Create a content loader that parses markdown or JSON
  3. Keep hardcoded format if needed, but split across multiple files by locale/category
  4. Consider future migration to CMS or database-backed content

### Large Hardcoded Data Files

**Issue:** Multiple large data files with hardcoded content
- **Files:** 
  - `src/data/blog-posts.ts` (3,184 lines)
  - `src/data/github.ts` (246 lines)
  - `src/data/services.ts` (333 lines)
  - `src/data/projects.ts` (323 lines)
- **Problem:** All portfolio/services data is hardcoded. This works for a static portfolio but doesn't scale if:
  - Projects, services, or testimonials need frequent updates
  - External data sources (GitHub repos, project metadata) need to be fetched dynamically
- **Impact:** Every content update requires a code change and rebuild/deploy
- **Recommendations:**
  1. For GitHub data: consider fetching from GitHub API at build time
  2. For services/projects: evaluate CMS or database integration
  3. At minimum, split large files by logical sections

### Unhandled Error Cases

**Issue:** Missing global and page-level error boundaries
- **Files:** No error.tsx or global-error.tsx found in app directory
- **Problem:** If any Server Component throws an error, there's no custom error page. Users see generic Next.js error UI or blank pages.
- **Impact:** Poor user experience when things break; no error recovery UI
- **Recommendations:**
  1. Create `src/app/error.tsx` for page-level errors
  2. Create `src/app/global-error.tsx` for layout-level errors
  3. Create `src/app/not-found.tsx` for 404 handling (currently using notFound() but no fallback page)

### Loose Locale Validation

**Issue:** Multiple type casts without complete validation
- **Files:** 
  - `src/app/[locale]/layout.tsx` (line 77)
  - `src/app/[locale]/notes/[slug]/page.tsx` (line 178)
  - Various page components
- **Problem:** Type coercion `as Locale` is used after isValidLocale checks, but the pattern relies on correct check ordering. If validation is skipped or misused, invalid locales can reach components.
- **Impact:** Potential type safety gaps; could render incorrect content in wrong language
- **Safe approach:** Validation is currently correct, but pattern could be fragile
- **Recommendations:**
  1. Create a helper function that validates and returns typed locale or throws
  2. Avoid raw `as Locale` casts; always use the validation function

## Performance Bottlenecks

### Inefficient Locale Dictionary Imports

**Issue:** Dynamic imports of locale dictionaries in a try-catch without caching
- **Files:** `src/lib/i18n.ts` (lines 204-221)
- **Problem:** Every call to getDictionary() triggers 4 dynamic imports with Promise.all, even though the same dictionary is requested repeatedly. No caching mechanism exists.
- **Impact:** 
  - Repeated dictionary loads across the same request (e.g., layout + multiple pages)
  - Unnecessary file I/O and module parsing
  - Fallback to English adds latency if locale files missing
- **Current behavior:** Each page/layout that calls getDictionary() loads fresh imports
- **Fix approach:**
  1. Add in-memory caching with a Map keyed by locale
  2. Cache at module level to persist across requests
  3. Consider using Next.js unstable_cache for better integration
  4. Add preloading of all locales at build time

### Middleware Regex Processing on Every Request

**Issue:** Accept-Language header parsing and regex operations on all requests
- **Files:** `src/middleware.ts` (lines 6-30, 106-110)
- **Problem:** 
  - Complex Accept-Language parsing with array operations and sorting happens on every request
  - Regex pattern for locale matching built dynamically in i18n.ts getLocalizedPath()
- **Impact:** Small but measurable latency on every non-static request
- **Optimization:** Middleware matcher is well-optimized (skips static files), but parser could be faster
- **Fix approach:**
  1. Simplify Accept-Language parsing (current implementation is correct but could use memoization)
  2. Pre-compile locale regex at module initialization
  3. Profile to measure actual impact

## Fragile Areas

### Client Component Dependency on Server Data

**Issue:** Header and language switching depend on locale from props
- **Files:** 
  - `src/components/Header.tsx` (marked "use client")
  - `src/app/[locale]/layout.tsx` passes locale to client components
- **Problem:** Client components receive locale prop that must stay in sync with actual URL. If locale changes without re-rendering parent, components show stale language.
- **Current safety:** Layout component awaits params and re-renders on locale change, which is correct
- **Safe modification:** If refactoring language switcher or navigation, ensure parent component always re-renders on locale changes
- **Test coverage:** No unit tests for locale switching; manual testing required

### NotesPageClient Heavy Client Component

**Issue:** Large client component with complex state management
- **Files:** `src/app/[locale]/notes/NotesPageClient.tsx` (504 lines)
- **Problem:** 
  - Single large client component handling filtering, rendering, and layout
  - 504 lines in one component makes testing and maintenance harder
  - Multiple renders of card components with inline styling
- **Impact:** Harder to debug state issues; potential unnecessary re-renders if not properly memoized
- **Safe modification:** Split into smaller sub-components, move styling to CSS
- **Test coverage:** Component has no unit tests

### Markdown Renderer Without Safety Checks

**Issue:** Custom markdown renderer in blog post page
- **Files:** `src/app/[locale]/notes/[slug]/page.tsx` (lines 44+, function renderMarkdown)
- **Problem:** 
  - Custom regex-based markdown parsing (no established library like marked or markdown-it)
  - If user-generated content ever replaces hardcoded posts, renderer could fail on edge cases
  - No handling of nested code blocks, special characters, or malformed input
- **Current safety:** Data is hardcoded, so no injection risk currently
- **Impact:** If content becomes dynamic, parsing errors could break pages
- **Recommendations:**
  1. Test renderer against various markdown formats
  2. Use a tested library (next-mdx-remote or marked) if content becomes dynamic
  3. Add error boundary around markdown rendering

## Missing Critical Features

### No Automatic Deployment Validation

**Issue:** No pre-deploy validation of environment variables and configuration
- **Problem:** If NEXT_PUBLIC_SUPABASE_URL or key is unset, the app falls back to hardcoded values silently
- **Impact:** Production could run with wrong credentials without alerting developers
- **Recommendations:**
  1. Add startup validation that fails if required env vars are missing
  2. Log warnings if using fallback values
  3. Add health check endpoint that verifies Supabase connectivity

### No Analytics or Error Tracking

**Problem:** No integration with Sentry, LogRocket, or similar error tracking
- **Impact:** Production errors go undetected; users experience broken pages silently
- **Recommendations:**
  1. Add Sentry SDK for error tracking
  2. Implement custom error boundary to log client-side errors
  3. Add server-side error logging to route handlers

### Missing Input Validation

**Issue:** Email subscription form has no client-side validation shown
- **Files:** `src/lib/supabase.ts` (subscribeEmail function)
- **Problem:** Email validation only happens on server; no client-side feedback before submit
- **Impact:** Poor UX if invalid email submitted; users don't know why form failed
- **Recommendations:**
  1. Add client-side email regex validation
  2. Show validation errors inline
  3. Disable submit button while request pending

## Test Coverage Gaps

### No Unit Tests

**Untested code:**
- `src/lib/i18n.ts` - Locale validation, dictionary loading, path generation
- `src/lib/supabase.ts` - Email subscription logic, error handling
- `src/middleware.ts` - Accept-Language parsing, locale detection
- `src/components/*` - All client components lack tests

**Why it matters:** 
- Locale switching behavior could break and not be caught
- Email subscription errors could fail silently
- Refactoring i18n logic is risky without tests

**Priority:** High - these are core features

### No Integration Tests

**What's not tested:**
- Full page rendering with different locales
- Middleware locale redirect flow
- Email subscription end-to-end
- Image carousel keyboard navigation

**Test coverage:** Not detected in codebase

### No E2E Tests

**Why it matters:** User flows like language switching, form submission, navigation aren't validated end-to-end

---

*Concerns audit: 2026-04-11*
