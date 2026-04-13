---
phase: 01-dark-mode-credential-security
reviewed: 2026-04-13T14:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - src/app/globals.css
  - src/lib/supabase.ts
  - .env.example
findings:
  critical: 0
  warning: 2
  info: 2
  total: 4
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-04-13T14:00:00Z
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Reviewed the dark mode CSS overrides in `globals.css`, the Supabase client module, and the `.env.example` file. The previous hardcoded Supabase credentials have been properly moved to environment variables with a fail-fast guard -- good improvement. The dark mode CSS variable overrides are well-structured and use `color-mix()` and CSS custom properties correctly. Two warnings relate to contrast/accessibility issues in dark mode, and two informational items note minor quality concerns.

## Warnings

### WR-01: btn-primary has near-invisible text in dark mode

**File:** `src/app/globals.css:195-198`
**Issue:** `.btn-primary` uses `background: var(--text-primary)` with `color: white`. In dark mode, `--text-primary` is `#f5f5f5` (near-white), making white text on a near-white background effectively invisible. The hover state at line 200-203 has a similar issue: it keeps `background: var(--text-primary)` (same near-white) with `color: var(--bg)` (`#0a0a0a`), which works for hover but the default state is broken.
**Fix:** Swap foreground/background in dark mode so the button remains readable:
```css
.btn-primary {
  background: var(--text-primary);
  color: var(--bg);
}
```
This makes the button light-on-dark in light mode (`#171717` bg, `#fafafa` text) and dark-on-light in dark mode (`#f5f5f5` bg, `#0a0a0a` text), maintaining contrast in both modes.

### WR-02: skip-link has same contrast issue in dark mode

**File:** `src/app/globals.css:1137-1148`
**Issue:** `.skip-link` uses `background: var(--text-primary)` with `color: white`, the same pattern as `btn-primary`. In dark mode this produces white text on a near-white (`#f5f5f5`) background, making the accessibility skip link unreadable when focused.
**Fix:**
```css
.skip-link {
  background: var(--text-primary);
  color: var(--bg);
}

.skip-link:focus {
  top: 16px;
  color: var(--bg);
}
```

## Info

### IN-01: Hardcoded rgba values in carousel nav for mobile

**File:** `src/app/globals.css:719,758`
**Issue:** `.carousel-nav` uses `background: rgba(255, 255, 255, 0.95)` and `rgba(255, 255, 255, 0.9)` for its default (non-dark-mode) state. While the dark mode override exists at line 807, the mobile-specific override at line 758 (`background: rgba(255, 255, 255, 0.9)`) sits outside the dark media query, so on mobile in dark mode the nav buttons will briefly flash white before the dark override applies (specificity may also cause the mobile rule to win over the dark-mode rule depending on cascade order). Consider nesting the mobile dark-mode variant or using CSS custom properties for the carousel nav background.
**Fix:** Add a dark mode override inside the mobile media query, or restructure using custom properties.

### IN-02: ReliabilitySection uses hardcoded hex colors for accent-color

**File:** `src/app/globals.css:1599,1625,1657,1663`
**Issue:** The reliability section CSS references `var(--accent-color)` which is set via inline styles in `ReliabilitySection.tsx` using hardcoded hex values (`#22c55e`, `#f97316`, `#3b82f6`, `#8b5cf6`). These inline hex values will not adapt to dark mode. This is noted as informational since the component file is not in the review scope, but the pattern means reliability card accent colors may have insufficient contrast on dark backgrounds.
**Fix:** Consider defining dark-mode-aware accent color variants, or adjusting the component to use lighter tints in dark mode.

---

_Reviewed: 2026-04-13T14:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
