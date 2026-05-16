# Action Plan — rohitraj.tech SEO (2026-05-16)

**Driver question:** Where does the next hour of work generate the most Google-search-platform performance lift?

---

## Critical — fix this week

### C1. Get `/en/notes` indexed
**Why:** Hub page for 59 blog posts. Currently "Discovered – not indexed". PageRank from indexed posts (equity, bedrock-vs-openai, bolt-new) has no upstream parent. AI Overview crawl path broken.
**Steps:**
1. Open GSC URL Inspection → `https://rohitraj.tech/en/notes` → click "Request indexing"
2. Run `./scripts/submit-seo.sh https://rohitraj.tech/en/notes` (fires Indexing API + IndexNow)
3. Add `<link rel="canonical" href="https://rohitraj.tech/en/notes">` to confirm self-canonical
4. Verify `/en/notes` is linked from `/en` homepage AND from `/en/about`, `/en/services` footer (likely already, but confirm)
5. Add `sitemap.xml` entry for `/en/notes` if not present (likely is — confirm)

**Effort:** 30 min. **Expected impact:** all 59 posts gain crawl-frequency lift within 7d.

### C2. Get `/en/services/6-week-mvp` indexed
**Why:** Primary monetization page. Every blog CTA points here. Currently invisible to Google.
**Steps:** same as C1 — Request Indexing + Indexing API ping + confirm canonical + check sitemap inclusion.
**Effort:** 15 min. **Expected impact:** unlocks ranking for "6-week MVP India", "hire MVP developer India 6 weeks" queries.

### C3. Add Content-Security-Policy response header
**Why:** Security gap + trust signal (enterprise link targets check CSP).
**Steps:**
1. Edit `next.config.js` `async headers()`:
   ```js
   {
     key: 'Content-Security-Policy',
     value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://vercel.live https://vitals.vercel-insights.com; frame-ancestors 'none';"
   }
   ```
2. Deploy + verify with `curl -sI https://rohitraj.tech/ | grep -i csp`
3. Tighten over time (remove `unsafe-inline` once you nonce all inline styles).

**Effort:** 1h. **Expected impact:** clean security scorecard + better enterprise trust signal.

---

## High — fix within 1 week

### H1. Truncate 15 overlong titles to ≤60 chars
**Why:** SERP truncation kills CTR. Equity post at position 4.9 is leaving 100s of clicks/year on the table.
**Worst offenders:**
| Slug | Current length | Suggested |
|---|---:|---|
| hire-technical-cofounder-india-2026 | 117 | "Hire Technical Co-founder India 2026 — Equity, Cost, Where to Find" |
| founding-engineer-equity-percentage-2026 | 111 | "Founding Engineer Equity 2026 — How Much to Negotiate (India)" |
| bolt-new-vs-hire-developer-2026 | 111 | "Bolt.new vs Hire Developer 2026 — When AI Builder Breaks" |
| hire-ai-engineer-india-2026 | 109 | "Hire AI Engineer India 2026 — Cost, Stack, Where to Find" |
| cursor-ai-vs-hire-developer-2026 | 105 | "Cursor AI vs Hire Developer 2026 — Real-World Limits" |
| lovable-alternative-developer-when-ai-builder-breaks | 104 | "Lovable Alternative — When AI Builder Breaks (Hire Dev)" |

**Effort:** 1 PR, ~45 min. **Expected impact:** +1-2 percentage points on CTR for top-impression pages = ~5-10 extra clicks/month at current impression volume.

### H2. Add ≥2 `/en/services/` links per legacy post (20 posts have 0)
**Why:** PageRank flow + conversion path. Top-traffic posts (`aws-bedrock-vs-openai` = 61 imp/28d) currently have no service CTA in body.
**Approach:** semi-automated. Write a script (`scripts/inject-service-links.ts`) that:
1. Reads each post .ts file
2. Detects topic from `keywords[]` + `relatedProject`
3. Suggests 2-3 service slugs (`/services/6-week-mvp` always, plus `/services/ai-chatbot-development` if AI/LLM, `/services/mobile-app-development` if mobile, `/services/full-stack-development` default)
4. Prints diff for manual review
5. Apply via batch PR

**Effort:** 4-6h script + 1h review. **Expected impact:** every indexed post now passes equity into service pages → service-page crawl + rank.

### H3. Add `Person.alumniOf` + `Person.hasCredential` to schema
**Why:** AI engines (Perplexity, ChatGPT, Google AI Overviews) downrank uncredentialed authors. Two-field fix unlocks credential authority.
**Steps:** edit `src/lib/seo-config.ts`, find `personSchema` constant, add:
```js
alumniOf: { '@type': 'CollegeOrUniversity', name: 'Your University Name', sameAs: '...wikipedia/url' },
hasCredential: [
  { '@type': 'EducationalOccupationalCredential', credentialCategory: 'Professional Experience', name: '10+ years building production AI systems and MVPs' }
]
```
**Effort:** 15 min. **Expected impact:** raises AI citation eligibility on every blog post + service page.

### H4. Backfill TL;DR Section 0 on top-5 traffic posts
**Priority order (by 28d impressions):**
1. `founding-engineer-equity-percentage-2026` (228 imp) — biggest CTR lift potential
2. `bolt-new-vs-hire-developer-2026` (75)
3. `aws-bedrock-vs-openai` (61)
4. `lovable-app-production-bugs-need-real-engineer-2026` (38)
5. `daily-hindu-sadhana-morning-evening-prayer-routine` (23) — heritage content, surprise winner

Inject `## TL;DR` Section 0 with 60-100 word inverted-pyramid answer.
**Effort:** 5 posts × 10 min = 50 min. **Expected impact:** captures 44.2% AI Overview citation window for top traffic.

### H5. Resubmit sitemap.xml in GSC
**Steps:** GSC → Sitemaps → enter `sitemap.xml` → Submit. Forces fresh re-crawl signal.
**Effort:** 2 min. **Expected impact:** kicks Google to re-evaluate the 90 submitted URLs.

---

## Medium — fix within 1 month

### M1. Fix dead BlogPosting schema fields
Add `wordCount` + `articleSection` to all post callers of `generateBlogPostingSchema`. Wire `articleSection` as new frontmatter field. (Schema agent: dead capacity in `seo-config.ts:435`.)

### M2. Add `image` param to TechArticle schema
`generateTechArticleSchema` (`seo-config.ts:471-502`) has no `image` parameter. Add it + wire through callers. Article rich-result recommended property.

### M3. Add `Offer` to `/services/6-week-mvp` Service schema
Include `price`, `priceCurrency` (INR + USD), `availability`. Strengthens entity for the service page.

### M4. Add `telephone` to ProfessionalService schema
LocalBusiness rich-result side panel benefits. (Or remove if you prefer not to publish phone.)

### M5. Diversify H2 ladders across `vs-hire-developer` posts
6 posts (lovable, bolt, claude-code, cursor, devin, v0, replit-agent vs hire-developer) share identical H2 structure. Rewrite at least the H2 wording so each post has unique heading topology. Counters March 2026 scaled-content algo flag.

### M6. Get a PageSpeed Insights / CrUX API key
Unlock real-user CWV field data. Free tier 25k req/day. Without this every perf decision is blind. https://developers.google.com/speed/docs/insights/v5/get-started

### M7. Wire GA4 organic-traffic pull into wiki tracker
Wiki tracker has no GA4 property ID. Add it + a weekly cron that appends organic-sessions / top-landing-pages / bounce rate to `~/wiki/wiki/seo-performance-tracker.md`.

### M8. Retroactive TL;DR injection on remaining 39 legacy posts (after H4 top-5)
After top-5 quick win, schedule batch fill for the rest. Could automate via Claude-driven script reading each post + drafting TL;DR + opening PR for review.

---

## Low — backlog

### L1. Brand search dominance for "rohith raj" (misspelled brand)
Currently position 26 for misspelled brand query. Add an `/about` page H1 variant including the misspelling, or a redirect page.

### L2. Localize service pages (currently only `/en/services/*` getting impressions, `/de` + `/ar` locales serve only blog posts)
4 services pages × 4 non-en locales = 16 localized service pages. Not urgent — German+Arabic blog impressions are organic discovery, not active strategy.

### L3. Newsletter / subscribe widget for impression-to-engaged-conversion
Site has `/api/subscribe` endpoint per build output but no visible CTA above-the-fold on blog posts. Add an `Engineering Notes` subscribe pill after section 3 of each post.

### L4. Improve mobile bundle (Lighthouse 66 → 80+ target)
Code-split `blog-posts.ts` (953KB monolith) into per-slug dynamic imports. Pre-load LCP image. Defer Vercel Analytics until interactive.

---

## Roadmap summary

| Window | Items | Total effort | Expected lift |
|---|---|---|---|
| Today (≤30 min) | C1, C2, H5 | 50 min | Hub + CTA indexed within 48h |
| This week | C3, H1, H3 | ~3h | CTR lift on top pages + AI citation eligibility |
| Next 7 days | H2, H4 | ~10h | Conversion path repaired + AI Overview wins on top-5 posts |
| Next 30 days | M1–M8 | ~25h | Schema fully populated, perf measurable, retro TL;DR rolled out |
| Backlog | L1–L4 | open | Mobile perf gains, locale expansion, newsletter |

---

## How to track progress

Append a row to `~/wiki/wiki/seo-performance-tracker.md` under "Per-post audit log" weekly with:
- GSC impressions / clicks / CTR delta vs prior week
- New URLs indexed / removed
- Sitemap submitted vs indexed count
- Any algo update reaction observed

Repeat `/seo-audit` at month-end (2026-06-16) and compare score-by-pillar deltas.
