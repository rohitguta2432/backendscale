# Design System — Backend Consultancy Website

## Design Goals

Build a **minimal, high-conversion** landing page that:
- Establishes **technical credibility** immediately
- Speaks directly to **startup founders and CTOs**
- Prioritizes **clarity over creativity**
- Loads **fast** (sub-2s) on any network

---

## Target Audience

| Segment | Pain Points | What They Value |
|---------|-------------|-----------------|
| Early-stage founders | Backend scaling anxiety | Direct, no-BS advice |
| CTOs / Tech Leads | Fire-fighting production issues | Proven experience, fast results |
| Companies at inflection | Architecture tech debt | Strategic expertise |

---

## Visual Style Principles

1. **Professional calm** — No flashy gradients or animations
2. **High signal, low noise** — Every element earns its space
3. **Technical aesthetic** — Monospace for code references, structured layouts
4. **Trust through restraint** — Confidence without hype

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#0a0a0a` | Page background (near-black) |
| `--surface` | `#141414` | Card backgrounds |
| `--surface-hover` | `#1a1a1a` | Hover states |
| `--border` | `#262626` | Subtle borders |
| `--text-primary` | `#fafafa` | Headlines, primary text |
| `--text-secondary` | `#a1a1aa` | Body, descriptions |
| `--text-muted` | `#71717a` | Labels, metadata |
| `--accent` | `#3b82f6` | Primary CTAs, links |
| `--accent-hover` | `#2563eb` | Button hover |
| `--success` | `#22c55e` | Positive indicators |

> **Rationale:** Dark mode by default — preferred by technical audiences. Zinc/slate neutrals provide depth without distraction.

---

## Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 | Inter | 48px / 3rem | 700 | 1.1 |
| H2 | Inter | 32px / 2rem | 600 | 1.2 |
| H3 | Inter | 24px / 1.5rem | 600 | 1.3 |
| Body | Inter | 18px / 1.125rem | 400 | 1.6 |
| Small | Inter | 14px / 0.875rem | 400 | 1.5 |
| Code | JetBrains Mono | 14px / 0.875rem | 400 | 1.5 |

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
```

---

## Spacing Scale

Based on 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps |
| `--space-2` | 8px | Inline spacing |
| `--space-3` | 12px | Small padding |
| `--space-4` | 16px | Default padding |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section gaps |
| `--space-12` | 48px | Section padding |
| `--space-16` | 64px | Major sections |
| `--space-24` | 96px | Hero padding |

---

## Layout Rules

- **Max content width:** 1200px
- **Container padding:** 24px (mobile), 48px (desktop)
- **Section spacing:** 96px vertical rhythm
- **Card grid:** CSS Grid, 1 → 2 → 4 columns responsive

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

@media (min-width: 768px) {
  .container { padding: 0 var(--space-12); }
}
```

---

## Component Guidelines

### Buttons

| Variant | Background | Border | Text |
|---------|------------|--------|------|
| Primary | `--accent` | none | white |
| Secondary | transparent | `--border` | `--text-primary` |
| Ghost | transparent | none | `--text-secondary` |

```css
.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 150ms ease;
}
```

### Cards

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-6);
}

.card:hover {
  border-color: var(--accent);
  background: var(--surface-hover);
}
```

### Section Headers

```jsx
<section>
  <span className="section-label">Services</span>
  <h2>How I Can Help</h2>
  <p className="section-description">...</p>
</section>
```

---

## Accessibility Considerations

- **Contrast ratios:** All text meets WCAG 2.1 AA (4.5:1 minimum)
- **Focus states:** Visible `:focus-visible` outlines on all interactive elements
- **Semantic HTML:** Proper heading hierarchy (single H1, structured H2/H3)
- **Skip links:** Hidden "Skip to main content" link for keyboard users
- **Alt text:** Not applicable (no images by design)

---

## Performance Considerations

- **Static export:** `output: 'export'` for pure static hosting
- **Font loading:** `display: swap` to prevent FOIT
- **Zero JavaScript:** Minimal client-side JS (Next.js hydration only)
- **No images:** Typography and borders only
- **Critical CSS:** Inline above-the-fold styles

**Target metrics:**
- First Contentful Paint: < 1.0s
- Largest Contentful Paint: < 1.5s
- Total Blocking Time: < 100ms
- Bundle size: < 100KB gzipped

---

## SEO Considerations

```tsx
export const metadata = {
  title: 'Backend Systems Consulting | Spring Boot, Kafka, Redis Expert',
  description: 'Senior backend consultant helping startups fix slow APIs, eliminate Kafka bottlenecks, and design scalable event-driven architectures.',
  keywords: ['backend consulting', 'Spring Boot', 'Kafka', 'Redis', 'event-driven architecture'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
  },
};
```

- Semantic HTML structure
- Single H1 per page
- Descriptive link text
- JSON-LD structured data (optional enhancement)

---

## Non-Goals

> **What we intentionally avoid:**

- ❌ Complex animations or transitions
- ❌ Stock photos, illustrations, or icons beyond minimal inline SVG
- ❌ Blog, authentication, or dynamic features
- ❌ Generic freelancer/agency wording
- ❌ Marketing buzzwords ("synergy", "leverage", "disrupt")
- ❌ Light mode (dark mode only for technical audience)
- ❌ Third-party tracking or analytics scripts

---

## Stitch MCP UI Guidance

### Layout Description

```
┌─────────────────────────────────────────────────────┐
│  HERO                                               │
│  - Full viewport height on desktop                  │
│  - Centered text, max-width 800px                   │
│  - Two CTAs side-by-side (primary + secondary)      │
├─────────────────────────────────────────────────────┤
│  PROBLEMS                                           │
│  - Section label + H2                               │
│  - 5 problem cards in responsive grid               │
│  - Cards: icon + title + short description          │
├─────────────────────────────────────────────────────┤
│  SERVICES                                           │
│  - 4 service cards with pricing hints               │
│  - 2x2 grid on desktop, stack on mobile             │
│  - Highlight primary offering (Audit)               │
├─────────────────────────────────────────────────────┤
│  CREDIBILITY                                        │
│  - Stats row (3-4 key metrics)                      │
│  - Case-style bullet points                         │
│  - No company names, generic descriptions           │
├─────────────────────────────────────────────────────┤
│  CONTACT                                            │
│  - Simple centered layout                           │
│  - Email (primary), phone, Calendly button          │
│  - Minimal footer with copyright                    │
└─────────────────────────────────────────────────────┘
```

### Visual Hierarchy

1. **Hero headline** — Largest, boldest, immediately visible
2. **Section headers** — Clear separation between sections
3. **Card titles** — Scannable, emphasize key offerings
4. **Body text** — Readable but secondary
5. **CTAs** — High contrast, clearly actionable

### Mobile Responsiveness

| Breakpoint | Layout Changes |
|------------|----------------|
| < 640px | Single column, reduced padding, smaller type scale |
| 640-1024px | 2-column grids, tablet spacing |
| > 1024px | Full desktop layout, max visual hierarchy |
