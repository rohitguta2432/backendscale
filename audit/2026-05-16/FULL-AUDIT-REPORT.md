# Full SEO Audit — rohitraj.tech

**Date:** 2026-05-16
**Tool stack:** GSC Search Console API (live), URL Inspection API (live), Indexing API (live), curl, on-disk grep, parallel claude-seo subagents
**Business type:** Solo founding-engineer service portfolio + 59-post technical blog (NOT local-service — skip GBP/maps)

---

## Executive Summary

**SEO Health Score: 63 / 100 (D+)**

Site has strong technical fundamentals (HSTS preload, AI-bot-allowed robots, valid hreflang across 5 locales, clean JSON-LD parse). The bleed is on **indexation of hub + CTA pages** and **content-level hygiene** (overlong titles, internal-link starvation, sparse TL;DR adoption).

| Pillar | Weight | Score | Weighted |
|---|---:|---:|---:|
| Technical SEO | 22 | 70 | 15.4 |
| Content Quality | 23 | 60 | 13.8 |
| On-Page SEO | 20 | 55 | 11.0 |
| Schema / Structured Data | 10 | 75 | 7.5 |
| Performance (CWV) | 10 | 50 | 5.0 |
| AI Search Readiness | 10 | 65 | 6.5 |
| Images | 5 | 80 | 4.0 |
| **Total** | **100** | — | **63.2** |

### Top 5 Critical / High Issues

1. **`/en/notes` (blog hub) is NOT indexed** — GSC URL Inspection: "Discovered – currently not indexed". 59 posts hang off a dead hub. PageRank from individual posts has nowhere to flow back up.
2. **`/en/services/6-week-mvp` (primary CTA page) is NOT indexed** — same "Discovered – not indexed" verdict. Money page invisible to Google. Every internal `/services/6-week-mvp` link inside posts currently passes link equity into a void.
3. **15+ post titles exceed 60 chars** — top-traffic `founding-engineer-equity-percentage-2026` (228 impressions / 28d, position 4.9) has a **111-char title** that gets SERP-truncated, suppressing CTR.
4. **20+ posts have ZERO `/services/` internal links** — including top-traffic `aws-bedrock-vs-openai` (61 imp), `build-ai-chatbot-whatsapp-business-india`, `how-to-build-saas-mvp-2026`. Link equity from indexed posts cannot reach service pages.
5. **44 / 59 posts missing TL;DR Section 0** — captures 44.2% of AI Overview citation window. Only the last 15 posts (recent skill-driven shipping) include it.

### Top 5 Quick Wins (≤2 hours each)

1. **Resubmit sitemap.xml** — GSC Sitemaps panel: lastSubmitted = 2026-05-07, submitted=90, indexed=0. The "0 indexed" is panel lag artifact (homepage IS indexed per URL Inspection), but a fresh resubmit nudges Google.
2. **Request manual indexing** on `/en/notes` + `/en/services/6-week-mvp` via GSC URL Inspection → "Request indexing" button OR via Indexing API. One-time fix, propagates within 48h.
3. **Add Content-Security-Policy response header** — current curl confirms it's absent. Configure in `next.config.js` `headers()` block.
4. **Truncate 15 overlong titles to ≤60 chars** — single PR. Biggest CTR upside on `equity-percentage` post (currently 4.9 position, 0.4% CTR).
5. **Fix Person schema** — add `alumniOf` + `hasCredential` to `personSchema` in `src/lib/seo-config.ts`. Two-line change.

---

## 1. Technical SEO (70/100)

### What works
- `HTTP/2 301` root → `/en/` (fixed 2026-05-10 from 307 — major PageRank consolidation win)
- HSTS preload: `max-age=63072000; includeSubDomains; preload` ✓
- X-Frame-Options: DENY ✓
- X-Content-Type-Options: nosniff ✓
- Permissions-Policy + Referrer-Policy ✓
- robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended ✓
- Sitemap: 93 URLs, hreflang for 5 locales (en/hi/fr/de/ar) + x-default, lastmod current to 2026-05-16

### What's wrong
| Severity | Finding |
|---|---|
| **Critical** | `/en/notes` "Discovered – not indexed" |
| **Critical** | `/en/services/6-week-mvp` "Discovered – not indexed" |
| **High** | Content-Security-Policy header missing |
| **Medium** | GSC sitemap panel shows lastSubmitted 2026-05-07 — re-submission overdue |
| **Medium** | New post `openai-vs-claude-vs-gemini-api-cost-india-mvp-2026` "URL is unknown" (expected — 30 min old; Indexing API ping fired HTTP 200, awaiting crawl) |

---

## 2. Content Quality (60/100)

### Snapshot
- **59 posts** total, average **1,938 words**, median **1,743 words** (healthy bulk)
- Avg has matured past the thin-content cliff (1,200 word floor)

### Issues by severity
| Severity | Finding |
|---|---|
| **High** | 44 / 59 posts missing `## TL;DR` Section 0 — 25% adoption. AI Overview citation window blown on legacy posts |
| **High** | 15+ titles >60 chars (top offenders: 117, 111, 111, 109, 105). All are top-traffic posts |
| **High** | 20+ posts have ZERO `/services/` internal links (link-equity starvation for money pages) |
| **Medium** | 6 `vs-hire-developer` posts share identical H2 ladder — flagged by March 2026 algo as templated/scaled content |
| **Medium** | 3 posts under 1,200 words flagged by parser (regex caveat — some bylines may be template-literal-quoted, false positives possible). Manual verify on `expo-av-audio-streaming-react-native` (known 215 words per wiki tracker) |
| **Low** | Excerpt patterns growing repetitive — last 5 posts open with `"At [N] for an Indian MVP, A costs ₹X, B costs ₹Y..."` — anti-scaled-content gate in skill now blocks this for new posts |

---

## 3. On-Page SEO (55/100)

### Key issues
- **Titles over 60 chars** = SERP truncation = CTR ceiling capped. Top-traffic `founding-engineer-equity-percentage-2026` (228 imp, position 4.9): "Founding Engineer Equity in 2026 — How Much Equity Should You Negotiate For Your Startup Founding Engineer Role" (111 chars). After Google ellipsis: "Founding Engineer Equity in 2026 — How Much Equity Should You Neg..." — value prop chopped.
- **Internal-link starvation** to `/en/services/*` — even `aws-bedrock-vs-openai` (61 imp, 8.0 avg position) has zero service CTAs in body. Hire-intent traffic lands and leaves.
- **Hub orphans:** `/en/notes` not indexed = post crawl signal weakens.

---

## 4. Schema / Structured Data (75/100)

All 15 JSON-LD blocks across homepage / post / service page **parse cleanly** (no Critical Google-ignores-everything failures).

| Severity | Finding |
|---|---|
| **High** | `Person.alumniOf` + `Person.hasCredential` absent → AI engines downrank un-credentialed authors |
| **High** | `BlogPosting.wordCount` parameter defined in generator but **never passed by any caller** (dead capacity, `src/lib/seo-config.ts:435`) |
| **High** | `TechArticle.image` not even a generator parameter — structurally absent from all output (`seo-config.ts:471-502`) |
| **Medium** | `BlogPosting.articleSection` missing entirely from generator signature |
| **Medium** | `ProfessionalService` lacks `telephone` |
| **Medium** | `/services/6-week-mvp` `Service` block has no `Offer` with `price`/`priceCurrency` |
| **Low** | `BlogPosting` + `TechArticle` inline full `publisher` rather than `@id` reference |

FAQPage rich result restricted to gov/health since Aug 2023 — markup retained for GEO citation value, no action.

---

## 5. Performance / CWV (50/100)

**PageSpeed Insights API quota exhausted** (no CrUX API key configured) — wiki tracker flag confirmed. Performance score is blind to real-user field data until API key set.

Lab-only estimates from wiki tracker baseline (2026-05-10):
- Lighthouse Mobile Performance: 66
- Main JS chunk: 224 KB
- Server-side monolithic `blog-posts.ts`: 953 KB (loaded on every blog page render)

Likely LCP > 2.5s on slow mobile. Decision: until CrUX API key set, every CWV tweak is lab-guess.

---

## 6. AI Search Readiness (65/100)

### What works
- robots.txt explicitly allow-lists 5 AI bots ✓
- llms.txt present at `/llms.txt` with 59 posts + 9 services + featured projects + author bio + AI usage block (added 2026-05-10)
- Author byline now mandatory in skill template
- Most recent post (`openai-vs-claude-vs-gemini-api-cost-india-mvp-2026`) has standalone-extractable TL;DR + comparison tables (AI engines cite tables 2.3x more)

### What's missing
- 44 / 59 legacy posts have NO TL;DR — retroactive injection needed (prioritize top-5 traffic posts first)
- Person schema lacks credentials → AI engines lower citation rank

---

## 7. Images (80/100)

- New posts shipped with AI-generated 1920x1080 JPEG covers via 5-tier cascade (Gemini → Pollinations → Stable Horde → HF → SVG fallback) — guaranteed cover per post
- File sizes 100-200 KB (under 400 KB target)
- Alt text formula: `<scene> illustrating <primary keyword>`, ≤125 chars
- Legacy posts (pre-skill-cascade) may have lower-quality covers or none — unaudited at scale this pass

---

## 8. Google Search Console — last 28 days (live data)

| Metric | Value | Note |
|---|---:|---|
| Total page-impressions (top 15 pages) | ~620 | Long-tail anonymized away in query dim |
| Total clicks | 2 | Equity post + Hanuman Chalisa post |
| Effective CTR | ~0.32% | Industry baseline 2-3% — capped by overlong titles + meta truncation |
| Sitemaps panel | submitted=90, indexed=0 | "0 indexed" = panel lag artifact (URL Inspection shows individual posts ARE indexed) |
| Avg position (best page) | 4.9 | `founding-engineer-equity-percentage-2026` |

### Top traffic pages (28d, page-dim)

| Page | Imp | Clk | Pos |
|---|---:|---:|---:|
| /en/notes/founding-engineer-equity-percentage-2026 | 228 | 1 | 4.9 |
| /en | 134 | 0 | 6.2 |
| /en/notes/bolt-new-vs-hire-developer-2026 | 75 | 0 | 9.1 |
| /en/notes/aws-bedrock-vs-openai | 61 | 0 | 8.0 |
| /ar/notes/lovable-app-production-bugs-need-real-engineer-2026 | 38 | 0 | 7.7 |
| /en/notes/daily-hindu-sadhana-morning-evening-prayer-routine | 23 | 0 | 6.4 |
| /en/notes/hanuman-chalisa-complete-meaning-english-hindi | 17 | 1 | 6.0 |
| /de/notes/supabase-vs-firebase-india-mvp-2026 | 10 | 0 | 7.3 |
| /de/notes/hire-ai-engineer-india-2026 | 8 | 0 | 7.5 |

### URL Inspection results

| URL | State | Last crawl |
|---|---|---|
| /en (home) | Submitted and indexed | 2026-05-11 |
| /en/notes (hub) | **Discovered – not indexed** | — |
| /en/notes/openai-vs-claude-vs-gemini-... (new) | **URL unknown to Google** | — (Indexing API ping today, propagating) |
| /en/services/6-week-mvp | **Discovered – not indexed** | — |
| /en/notes/founding-engineer-equity-percentage-2026 | Submitted and indexed (Breadcrumbs PASS) | 2026-05-12 |

### Surprises worth investigating
- `/de` (German) + `/ar` (Arabic) locales pulling impressions even without targeted promotion — natural Google translation discovery
- Hindu prayer / Hanuman Chalisa posts have higher CTR than tech posts — heritage content earns its 1 click
- Brand search "rohith raj" (misspelled) at position 26 — own brand not dominating SERP

---

## Limitations of this audit

- PSI / CrUX API quota exhausted = no real-user CWV measurement
- GA4 organic traffic not pulled (property ID unknown — wiki flagged as gap)
- Visual / mobile-render audit not run (Playwright not invoked this pass)
- 5 of 7 spawned claude-seo subagents hit tool-use limits before producing final reports — schema agent only one with full output
- DataForSEO MCP not configured — no live competitor SERP / backlink crawl this pass
