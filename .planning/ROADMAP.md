# Roadmap: NexusAI

## Overview

This milestone takes the existing NexusAI portfolio site from functional-but-rough to production-ready. The work moves from critical visibility fixes (dark mode, credentials) through code restructuring and style consolidation, then hardens security, optimizes performance, and adds testing. Every phase preserves existing UI sections and design language -- this is polish, not redesign.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Dark Mode & Credential Security** - Fix text invisibility in dark mode and move hardcoded Supabase credentials to env vars
- [ ] **Phase 2: Data Restructuring & Types** - Extract monolithic data files and add TypeScript types
- [ ] **Phase 3: Inline Style Migration** - Migrate 272 inline style objects to Tailwind utility classes
- [ ] **Phase 4: Visual Consistency & Images** - Normalize spacing, alignment, and image optimization across landing page
- [ ] **Phase 5: Security Hardening** - Add HTML sanitization, error boundaries, and form validation
- [ ] **Phase 6: Performance Optimization** - Optimize i18n dictionary loading and middleware regex
- [ ] **Phase 7: Error Logging & Testing** - Add error logging and Jest test infrastructure with key component tests

## Phase Details

### Phase 1: Dark Mode & Credential Security
**Goal**: Users can read all text on the site in dark mode, and credentials are no longer exposed in source code
**Depends on**: Nothing (first phase)
**Requirements**: VISL-01, SECR-01
**Success Criteria** (what must be TRUE):
  1. User visiting the site with OS dark mode enabled can read all headings, body text, and labels without squinting or highlighting
  2. All CSS custom properties (--bg, --text-primary, --text-secondary, --text-muted, --card-bg, --border) have dark mode overrides via prefers-color-scheme
  3. Supabase URL and anon key are loaded from environment variables, not present in any committed source file
  4. Site functions identically in light mode after dark mode changes (no regressions)
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 01-01: TBD

### Phase 2: Data Restructuring & Types
**Goal**: Component files contain rendering logic only, with data and types extracted into dedicated modules
**Depends on**: Phase 1
**Requirements**: QUAL-01, QUAL-02, QUAL-03
**Success Criteria** (what must be TRUE):
  1. Blog data lives in individual post files (not a single 3K-line file) and all existing blog routes still resolve correctly
  2. Large hardcoded data arrays (projects, services, reliability cards) are imported from dedicated data files, not defined inline in components
  3. All extracted data structures have TypeScript interfaces/types and runtime validation prevents malformed data from rendering
  4. No component file contains more than ~50 lines of raw data
**Plans**: TBD

Plans:
- [ ] 02-01: TBD

### Phase 3: Inline Style Migration
**Goal**: All inline style objects are replaced with Tailwind utility classes for consistent, maintainable styling
**Depends on**: Phase 2
**Requirements**: VISL-02
**Success Criteria** (what must be TRUE):
  1. Zero (or near-zero) inline style={{ }} objects remain in component files
  2. All previously inline-styled elements use Tailwind utility classes that produce identical visual output
  3. No visual regressions on the landing page when comparing before/after screenshots in both light and dark mode
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 03-01: TBD

### Phase 4: Visual Consistency & Images
**Goal**: Landing page sections have uniform spacing, aligned text, and optimized images
**Depends on**: Phase 3
**Requirements**: VISL-03, VISL-04, VISL-05
**Success Criteria** (what must be TRUE):
  1. All landing page sections use a consistent spacing scale (no more than 3-4 distinct section padding values)
  2. Text alignment follows a predictable pattern across Hero, AIProjects, ReliabilitySection, Testimonials, and Footer
  3. Every img tag is replaced with Next.js Image component with explicit width/height or fill, and images load without layout shift
  4. All existing sections and placeholder testimonials remain visually intact
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 04-01: TBD

### Phase 5: Security Hardening
**Goal**: The site defends against XSS, handles errors gracefully, and validates user input before submission
**Depends on**: Phase 1
**Requirements**: SECR-02, SECR-03, SECR-04
**Success Criteria** (what must be TRUE):
  1. All unvalidated HTML rendering is sanitized through DOMPurify or equivalent library, preventing script injection via content
  2. Every route segment has error.tsx, loading.tsx, and not-found.tsx boundaries -- navigating to a broken route shows a friendly error page, not a white screen
  3. SubscribeForm and Contact forms show validation errors for invalid input (empty fields, malformed email) and do not submit until corrected
  4. Existing page functionality is unchanged for valid inputs and normal navigation
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 05-01: TBD

### Phase 6: Performance Optimization
**Goal**: Dictionary loading and middleware execution are optimized to reduce redundant work
**Depends on**: Phase 2
**Requirements**: PERF-01, PERF-02
**Success Criteria** (what must be TRUE):
  1. Repeated navigation between pages in the same locale does not re-import i18n dictionaries (memoization verified via logging or profiling)
  2. Middleware regex patterns are compiled once and reused, not re-created per request
  3. No regressions in i18n routing -- all locale paths (en, hi, fr, de, ar) still resolve correctly
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

### Phase 7: Error Logging & Testing
**Goal**: Errors are captured with useful context, and key components have automated test coverage
**Depends on**: Phase 5
**Requirements**: QUAL-04, TEST-01
**Success Criteria** (what must be TRUE):
  1. Client-side errors and server-side errors are logged with timestamp, error message, and stack trace (console or file-based, not a third-party service)
  2. Jest and React Testing Library are configured and runnable via a single npm/yarn command
  3. At least one test exists for each key landing page component (Hero, AIProjects, ReliabilitySection, Footer) verifying it renders without crashing
  4. Tests pass in CI-compatible mode (no browser required)
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Dark Mode & Credential Security | 0/? | Not started | - |
| 2. Data Restructuring & Types | 0/? | Not started | - |
| 3. Inline Style Migration | 0/? | Not started | - |
| 4. Visual Consistency & Images | 0/? | Not started | - |
| 5. Security Hardening | 0/? | Not started | - |
| 6. Performance Optimization | 0/? | Not started | - |
| 7. Error Logging & Testing | 0/? | Not started | - |
