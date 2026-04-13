---
phase: 01-dark-mode-credential-security
verified: 2026-04-13T15:00:00Z
status: gaps_found
score: 3/4 must-haves verified
overrides_applied: 0
gaps:
  - truth: "All CSS custom properties have dark mode overrides via prefers-color-scheme media query"
    status: failed
    reason: "ROADMAP Success Criterion 2 explicitly lists --card-bg as a variable requiring a dark mode override. --card-bg is used in 16 component and page files (AIProjects.tsx, Hero.tsx, Testimonials.tsx, NotesPageClient.tsx, notes/[slug]/page.tsx, services/*.tsx) but is never defined in :root and has no dark mode override anywhere in globals.css. Components using var(--card-bg) receive no value, falling back to browser default (transparent/inherit)."
    artifacts:
      - path: "src/app/globals.css"
        issue: "--card-bg is absent from :root and from the @media (prefers-color-scheme: dark) :root block"
    missing:
      - "Add --card-bg to the light-mode :root block (e.g. #ffffff, matching --surface)"
      - "Add --card-bg to the @media (prefers-color-scheme: dark) :root block (e.g. #1a1a1a, matching --surface)"
  - truth: "User visiting the site with OS dark mode enabled can read all headings, body text, and labels without squinting"
    status: partial
    reason: ".btn-primary uses background: var(--text-primary) with color: white. In dark mode --text-primary is #f5f5f5 (near-white), producing white text on a near-white background — effectively invisible. The skip link has the same defect. These are primary interactive elements on the landing page (CTA buttons)."
    artifacts:
      - path: "src/app/globals.css"
        issue: ".btn-primary (line 195-203) and .skip-link (line 1137-1148) use hardcoded color: white against var(--text-primary) which is #f5f5f5 in dark mode"
    missing:
      - "Override .btn-primary color to var(--bg) instead of white (or add a dark mode block for .btn-primary)"
      - "Override .skip-link color to var(--bg) instead of white in dark mode"
---

# Phase 01: Dark Mode & Credential Security Verification Report

**Phase Goal:** Users can read all text on the site in dark mode, and credentials are no longer exposed in source code
**Verified:** 2026-04-13T15:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User visiting the site with OS dark mode enabled can read all headings, body text, and labels without squinting | PARTIAL | Dark mode :root variables exist and headings/body text use var(--text-primary)/var(--text-secondary) which do adapt. However .btn-primary and .skip-link use hardcoded `color: white` against var(--text-primary) = #f5f5f5 in dark mode — near-zero contrast on CTA buttons. |
| 2 | All CSS custom properties have dark mode overrides via prefers-color-scheme | FAILED | --card-bg is explicitly named in ROADMAP SC #2. It is used in 16 source files but never defined in :root and absent from the dark mode :root block. |
| 3 | Supabase URL and anon key are loaded from environment variables, not present in any committed source file | VERIFIED | src/lib/supabase.ts uses process.env.NEXT_PUBLIC_SUPABASE_URL and process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY with a throw on missing. grep for hardcoded URL and key in src/ returns zero matches. |
| 4 | Site functions identically in light mode after dark mode changes (no regressions) | VERIFIED | Light-mode :root block retains all original values (--bg: #fafafa, --text-primary: #171717, etc.). Dark mode additions are purely additive via a separate media query block. Build passes (confirmed in 01-01-SUMMARY.md). |

**Score:** 2/4 truths fully verified (3/4 at minimum counting partial)

Note: Truth #1 is marked PARTIAL rather than FAILED because the majority of text (headings, body, labels) is readable. The defect is scoped to interactive elements (buttons, skip link).

### Deferred Items

None. All gaps are within Phase 1 scope.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/globals.css` | Dark mode CSS variable overrides via @media (prefers-color-scheme: dark) | PARTIAL | Block exists at line 23 with 16 variables. --card-bg is absent. btn-primary contrast broken in dark mode. |
| `src/lib/supabase.ts` | Supabase client using env vars without hardcoded fallbacks | VERIFIED | Reads process.env.NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, throws if missing. |
| `.env.local` | Actual Supabase credentials for local development | VERIFIED | File exists, contains NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY with real values. Gitignored via .env* pattern in .gitignore. |
| `.env.example` | Template showing required env vars with placeholder values | VERIFIED | File exists. NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here, NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/globals.css` dark media query | All components using CSS custom properties | CSS custom property inheritance | PARTIAL | 16 of 16 defined vars cascade correctly. --card-bg missing: 16 files reference it with no definition to inherit. |
| `src/lib/supabase.ts` | `.env.local` | process.env.NEXT_PUBLIC_SUPABASE_URL / ANON_KEY | VERIFIED | Env vars present in .env.local, consumed correctly in supabase.ts. |

### Data-Flow Trace (Level 4)

Not applicable. This phase modifies CSS and environment variable loading — no dynamic data rendering artifacts to trace.

### Behavioral Spot-Checks

| Behavior | Check | Result | Status |
|----------|-------|--------|--------|
| Dark mode :root block exists | grep -c "prefers-color-scheme: dark" globals.css | 3 (one :root override + two component-specific blocks) | PASS |
| --text-primary dark override present | grep in dark :root block | --text-primary: #f5f5f5 found at line 31 | PASS |
| No hardcoded Supabase URL in source | grep -r "ivacwojpuhsssyfcfgjx" src/ | 0 matches | PASS |
| No hardcoded Supabase anon key in source | grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/ | 0 matches | PASS |
| --card-bg defined in :root | grep "card-bg" globals.css | 0 matches — UNDEFINED | FAIL |
| .env.local gitignored | .gitignore has .env* pattern, !.env.example exception | .env.local correctly excluded | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| VISL-01 | 01-01-PLAN.md | Site displays readable text with correct contrast in dark mode (prefers-color-scheme) | PARTIAL | Dark mode :root overrides implemented but --card-bg undefined and btn-primary has near-zero contrast |
| SECR-01 | 01-02-PLAN.md | Supabase credentials loaded from environment variables, not hardcoded | VERIFIED | supabase.ts uses process.env vars, no hardcoded fallbacks, build passes |

REQUIREMENTS.md lists VISL-01 and SECR-01 as Phase 1 requirements. Both are claimed by the plans. No orphaned requirements for this phase.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/globals.css` | 197 | `.btn-primary { color: white }` — hardcoded white against var(--text-primary) which is #f5f5f5 in dark mode | Blocker | Primary CTA buttons unreadable in dark mode (white text on near-white background) |
| `src/app/globals.css` | 1138 | `.skip-link { color: white }` — same pattern as btn-primary | Warning | Accessibility skip link invisible when focused in dark mode |
| `src/app/globals.css` | 719, 758 | `.carousel-nav { background: rgba(255,255,255,0.95) }` — hardcoded white background for mobile, mobile media query not nested inside dark override | Warning | Carousel nav buttons may flash white on mobile in dark mode (cascade order issue) |
| Multiple components | n/a | `var(--card-bg)` used in 16 files but never defined | Blocker | All card backgrounds receive browser default (transparent), defeating dark mode intent |

### Human Verification Required

#### 1. Dark Mode Visual Check — Button Contrast

**Test:** Enable OS dark mode. Navigate to the home page. Look at the primary CTA buttons (e.g., "View Projects", "Get in Touch" in the Hero section).
**Expected:** Button text should be clearly readable. With the defect, the button background is #f5f5f5 (near-white) with white text — effectively invisible.
**Why human:** Cannot verify rendered contrast ratios programmatically without running the browser.

#### 2. Dark Mode Visual Check — Card Backgrounds

**Test:** Enable OS dark mode. Observe the AI Projects cards, Testimonials cards, and Notes page cards.
**Expected:** Cards should have a distinct elevated background color (e.g., slightly lighter than the page background). With --card-bg undefined, cards may appear transparent or incorrect.
**Why human:** Cannot observe rendering without a browser in dark mode.

### Gaps Summary

Two gaps block full goal achievement:

**Gap 1 — Missing --card-bg variable (Blocker):** The ROADMAP explicitly listed `--card-bg` in Success Criterion #2. It is used in 16 component and page files across the landing page and subpages. It is never defined in `:root` and has no dark mode override. This was not caught by the implementation plan (01-01-PLAN.md did not enumerate --card-bg in its acceptance criteria) but is part of the phase contract per the ROADMAP.

**Gap 2 — btn-primary invisible in dark mode (Blocker for SC #1):** `.btn-primary` and `.skip-link` use `color: white` hardcoded, which produces near-zero contrast against the dark mode `--text-primary` value of #f5f5f5. This was identified in 01-REVIEW.md (WR-01, WR-02) but was not fixed before phase closure.

Both gaps are in `src/app/globals.css` and can be resolved with targeted additions:
- Add `--card-bg` to light and dark `:root` blocks
- Add a dark mode override block for `.btn-primary` and `.skip-link` setting `color: var(--bg)`

---

_Verified: 2026-04-13T15:00:00Z_
_Verifier: Claude (gsd-verifier)_
