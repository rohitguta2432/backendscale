# Schema.org JSON-LD Audit — rohitraj.tech
**Date:** 2026-05-16 | **Auditor:** Claude Code (schema specialist) | **Pages:** 3

---

## Parse Validation
All 15 JSON-LD blocks across three pages parsed without error (`json.loads` clean). No Critical parse failures.

---

## /en — Homepage (4 blocks)

**Types found:** Person, Service, ProfessionalService, WebSite

| Check | Result |
|---|---|
| BreadcrumbList | MISSING — expected on homepage, absent |
| WebSite present | PASS |
| Person.image | PASS (fix 2026-05-10 confirmed deployed) |
| Person.worksFor | PASS (fix 2026-05-10 confirmed deployed) |
| Person.alumniOf | FAIL — field absent |
| Person.hasCredential | FAIL — field absent |
| ProfessionalService.telephone | FAIL — absent; required for LocalBusiness rich result |
| Service.url | FAIL — no `url` property on homepage Service block |

**[High]** `Person.alumniOf` and `Person.hasCredential` absent. Wiki tracker flagged these historically; still not populated. Reduces E-E-A-T signal for author authority.

**[Medium]** `ProfessionalService` (extends `LocalBusiness`) is missing `telephone`. Google's LocalBusiness rich result requires at minimum one of `address`, `telephone`, or `geo` beyond just address.

**[Low]** `Service` block on homepage has no `url` — makes the block non-dereferenceable for crawlers.

---

## /en/notes/openai-vs-claude-vs-gemini-api-cost-india-mvp-2026 (6 blocks)

**Types found:** Person, Service, ProfessionalService, BreadcrumbList, BlogPosting, TechArticle

| Check | Result |
|---|---|
| BlogPosting.dateModified | PASS — populated (`2026-05-16`) |
| BlogPosting.wordCount | FAIL — field absent in live output |
| BlogPosting.articleSection | FAIL — field absent in live output |
| BlogPosting.mainEntityOfPage | PASS |
| BlogPosting.image | PASS (absolute URL) |
| BlogPosting.author → @id ref | PASS |
| TechArticle.image | FAIL — `image` absent from TechArticle block |
| BreadcrumbList | PASS |

**[High]** `BlogPosting.wordCount` is defined as an optional param in `generateBlogPostingSchema` (`post.wordCount?`) but emitted only when the caller passes it. Live output confirms it is never passed — the field is dead. Same for `articleSection`, which is not even a parameter in the generator signature. Both are Google-recommended for article rich results.

**[Medium]** `TechArticle` block is missing `image`. The `generateTechArticleSchema` function in `seo-config.ts` has no `image` parameter at all — structural omission. Google treats `image` as recommended for Article subtypes.

**[Low]** Duplicate `publisher` blocks: both BlogPosting and TechArticle inline a full `publisher` object with nested `ImageObject` rather than referencing `@id`. Not invalid, but inconsistent with the `author` pattern that uses `@id` refs.

---

## /en/services/6-week-mvp (5 blocks)

**Types found:** Person, Service (global), ProfessionalService, FAQPage, Service (page-specific)

| Check | Result |
|---|---|
| FAQPage present | PASS — 7 Q&A pairs, all valid |
| FAQPage — Google rich result eligibility | INFO — rohitraj.tech is a commercial site; Google restricted FAQPage rich results to gov/healthcare (Aug 2023). No Google SERP feature will fire. FAQPage retains value for AI/LLM citation (GEO). |
| Service (page-specific) has Offer | FAIL — no `Offer` with `price`/`priceCurrency` |
| Service.url | PASS |
| HowTo schema | NOT RECOMMENDED — HowTo rich results removed by Google Sept 2023; do not add |

**[Medium]** The page-specific `Service` block for 6-week-mvp has no `Offer`. The `hasOfferCatalog` pattern used in the global Service block could be mirrored here with pricing, enabling richer entity data.

**[Info]** FAQPage: no action needed for Google rich results. If GEO/AI citation is a priority, existing markup is already serving that purpose.

---

## Generator Hygiene — seo-config.ts

**Dead optional fields (passed signature but never populated by any caller):**

| Field | Generator | Status |
|---|---|---|
| `wordCount` | `generateBlogPostingSchema` | Parameter exists, never passed by any post — confirmed dead |
| `articleSection` | `generateBlogPostingSchema` | Not even a parameter; field never emitted |
| `updated` (`dateModified`) | `generateBlogPostingSchema` | Parameter exists; today's post has `dateModified = datePublished` (same date), meaning `updated` was not passed — functionally dead on new posts |
| `image` | `generateTechArticleSchema` | No parameter defined; field structurally absent from all TechArticle output |

**[High]** `generateTechArticleSchema` needs an `image` parameter added and wired through.
**[Medium]** `generateBlogPostingSchema` should accept `articleSection` and post callers should supply it from frontmatter.

---

## Summary Table

| Severity | Finding | Field Path |
|---|---|---|
| High | Person.alumniOf / hasCredential never populated | `Person.alumniOf`, `Person.hasCredential` |
| High | wordCount dead — generator param never called | `BlogPosting.wordCount` |
| High | TechArticle has no image parameter or output | `TechArticle.image` |
| Medium | articleSection absent — not even a generator param | `BlogPosting.articleSection` |
| Medium | ProfessionalService missing telephone | `ProfessionalService.telephone` |
| Medium | Service (6-week-mvp) has no Offer | `Service.offers` |
| Low | Service (homepage) missing url property | `Service.url` |
| Low | TechArticle publisher inlined vs @id ref | `TechArticle.publisher` |
| Info | FAQPage on commercial service page — no Google rich result; AI citation value retained | `FAQPage` on /services/6-week-mvp |
| Not recommended | HowTo — do not add to tutorial posts | — (deprecated Sept 2023) |
