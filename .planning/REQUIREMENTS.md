# Requirements: NexusAI

**Defined:** 2026-04-12
**Core Value:** Fix dark mode text invisibility and consolidate inconsistent inline styles so the landing page looks polished and readable across all devices and OS themes.

## v1.0 Requirements

Requirements for Quality & Polish milestone. Each maps to roadmap phases.

### Visual Polish

- [ ] **VISL-01**: Site displays readable text with correct contrast in dark mode (prefers-color-scheme)
- [ ] **VISL-02**: All inline style objects migrated to Tailwind utility classes
- [ ] **VISL-03**: Consistent spacing scale across all landing page sections
- [ ] **VISL-04**: Text alignment consistent across all landing page sections
- [ ] **VISL-05**: All images use Next.js Image component with proper sizing

### Security & Hardening

- [ ] **SECR-01**: Supabase credentials loaded from environment variables, not hardcoded
- [ ] **SECR-02**: All unvalidated HTML rendering sanitized with a library like DOMPurify
- [ ] **SECR-03**: Error boundaries (error.tsx, loading.tsx, not-found.tsx) for all route segments
- [ ] **SECR-04**: Form inputs validated before submission (SubscribeForm, Contact)

### Code Quality

- [ ] **QUAL-01**: Blog data split from monolithic file into individual post files
- [ ] **QUAL-02**: Large hardcoded data structures extracted from component files
- [ ] **QUAL-03**: Proper TypeScript types and runtime validation for data structures
- [ ] **QUAL-04**: Basic error logging for client and server errors

### Performance

- [ ] **PERF-01**: i18n dictionary loading memoized to prevent redundant imports
- [ ] **PERF-02**: Middleware regex patterns optimized

### Testing

- [ ] **TEST-01**: Jest + React Testing Library configured with key component tests

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Observability

- **OBSV-01**: Integration with error tracking service (e.g., Sentry)
- **OBSV-02**: Performance monitoring and Core Web Vitals tracking

### Content

- **CONT-01**: Replace placeholder testimonials with real client data
- **CONT-02**: CMS integration for blog posts

## Out of Scope

| Feature | Reason |
|---------|--------|
| Visual redesign | This milestone is polish only — preserve existing design language |
| Removing UI sections | User explicitly requested keeping all sections intact |
| New features or pages | Quality-only milestone — no new functionality |
| Sentry/error service integration | Basic logging only for v1.0 |
| Real testimonials | User wants to keep placeholder data for now |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| VISL-01 | — | Pending |
| VISL-02 | — | Pending |
| VISL-03 | — | Pending |
| VISL-04 | — | Pending |
| VISL-05 | — | Pending |
| SECR-01 | — | Pending |
| SECR-02 | — | Pending |
| SECR-03 | — | Pending |
| SECR-04 | — | Pending |
| QUAL-01 | — | Pending |
| QUAL-02 | — | Pending |
| QUAL-03 | — | Pending |
| QUAL-04 | — | Pending |
| PERF-01 | — | Pending |
| PERF-02 | — | Pending |
| TEST-01 | — | Pending |

**Coverage:**
- v1.0 requirements: 16 total
- Mapped to phases: 0
- Unmapped: 16

---
*Requirements defined: 2026-04-12*
*Last updated: 2026-04-12 after initial definition*
