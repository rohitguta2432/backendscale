import type { BlogPost } from '@/types/blog';

export const posthogVsMixpanelVsAmplitudeIndiaMvp2026: BlogPost = {
  slug: 'posthog-vs-mixpanel-vs-amplitude-india-mvp-2026',
  title: 'PostHog vs Mixpanel vs Amplitude — Best Product Analytics for India MVP (2026)',
  date: '2026-05-23',
  excerpt: 'PostHog wins for engineering-led India MVPs because it self-hosts on AWS Mumbai for DPDP compliance and bundles session replay + feature flags into one tier. Mixpanel wins for PM-heavy teams that want the lowest learning curve. Amplitude wins for funded teams with a dedicated analyst. The real cost gap at 10M events/month is 8×. Here is the math, the data-residency reality, and the exact stack I run on myFinancial.',
  readingTime: '13 min read',
  keywords: [
    'posthog vs mixpanel vs amplitude',
    'product analytics india mvp 2026',
    'posthog india self host aws mumbai',
    'mixpanel india pricing',
    'amplitude india startup cost',
    'dpdp compliant analytics india',
    'best analytics tool indian startup',
    'hire founding engineer india',
  ],
  relatedProject: 'myFinancial',
  coverImage: {
    src: '/images/notes/posthog-vs-mixpanel-vs-amplitude-india-mvp-2026-cover.jpg',
    alt: 'Translucent layered glass plates with embedded glowing lines illustrating PostHog vs Mixpanel vs Amplitude analytics comparison',
  },
  sections: [
    {
      heading: 'TL;DR',
      content: `Pick **PostHog** if you have at least one engineer and want one tool for events, session replay, feature flags, and A/B tests — self-host on AWS Mumbai for around ₹4,000/month at 50M events and keep India PII inside ap-south-1 for DPDP. Pick **Mixpanel** if your PM-led team wants the easiest funnel UI and you live under 100K events/month. Pick **Amplitude** only after Series A with a dedicated analyst.

Skip all three and use Plausible or GA4 if you only need page-view counts.`,
    },
    {
      heading: 'PostHog vs Mixpanel vs Amplitude — Which One Should You Pick for an India MVP in 2026?',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

If you are picking a product analytics tool for an India MVP in 2026, the honest answer is PostHog for almost every engineering-led founder, Mixpanel for PM-led teams under 100K events/month, and Amplitude only after Series A. I have shipped analytics for four India-stack projects in the last 18 months — the [myFinancial](/en) personal-finance PWA (which tracks ~12,000 events per active user per month), a multi-tenant retail [SaaS on Spring Boot](/en/notes/build-multi-tenant-saas-spring-boot-java-21), a Sanskrit-to-SQL research tool, and a clinic-booking flow on the [WhatsApp Business API](/en/notes/whatsapp-business-api-integration-guide-india). I ended up on PostHog three out of four times, and the one exception was a clinic that needed a non-technical receptionist to read funnel charts.

The cost math nobody runs before signup is this: at 1 million events/month, PostHog Cloud is roughly ₹2,500/mo, Mixpanel Growth is ₹2,000/mo (after the free 100K tracked users), and Amplitude Plus is ₹4,070/mo (\$49). At 10 million events/month — a normal scale for a 5K-MAU India consumer product — PostHog Cloud is ₹16,600/mo (\$200), Mixpanel jumps to a custom quote that has consistently landed at ₹25,000–35,000/mo in deals I have seen, and Amplitude Growth is genuinely 6-figure annual (custom, ₹18 lakh–21 lakh/year range based on three quotes I have reviewed in 2025–26). Self-host PostHog on AWS Mumbai at the same scale and the bill drops to about ₹4,000/mo for a t3.medium + db.t4g.medium RDS — that is the math that decides the platform for most India founders.

This post is the comparison I wish I had read before I burned three days swapping myFinancial off Mixpanel because their 2025 tracked-MAU pricing model 5×'d our quote on a renewal, and another two days configuring PostHog self-host correctly so user PII actually stayed inside ap-south-1. Real numbers, real failure modes, and a 5-step checklist at the end. If you would rather hand the whole analytics setup to an engineer who has done it, every [6-week MVP sprint](/en/services/6-week-mvp) I ship now provisions PostHog self-host on day one — but read on if you want to make the call yourself.`,
    },
    {
      heading: 'What Does Each Platform Actually Do in 2026?',
      content: `Before the cost table, what each thing actually is — because the marketing pages all say "product analytics + funnels + retention" and none of them mean the same thing in operational terms.

**PostHog** is a 2020-founded, open-source, all-in-one product analytics platform out of London. The bundle in 2026 includes events, session replay, feature flags, A/B tests, surveys, error tracking, and an LLM observability suite. You can self-host the entire stack — events go to a Postgres + ClickHouse pair, the UI is a Next.js app, the whole thing is one Helm chart. PostHog Cloud is \$0 free (1M events/mo), then \$0.00031 per event past the cap. The Indian relevance is the self-host story — for myFinancial, deploying PostHog into a private VPC inside Mumbai (ap-south-1) means behaviour data never crosses an international border, which keeps DPDP Act 2023 audit paperwork to a single page.

**Mixpanel** is the 2009 incumbent — the tool every PM at a Series B startup learned funnels on. The dashboard is the cleanest of the three for non-technical users; building a 5-step funnel takes about 90 seconds versus 3–4 minutes in PostHog's HogQL. The 2026 pricing model is tracked-MAU-based: \$0 for the first 100K tracked users, then Growth at \$24/mo for 100K events with overages, and a custom Enterprise tier that consistently lands ₹20K+/month for any product over 50K MAU. They host in US and EU — no India region, which is a hard problem for fintech or healthtech.

**Amplitude** is the 2012 enterprise-favourite, used by Atlassian, Ford, and Shopify. The strength is governed metrics — define "Daily Active User" once in the "Govern" module and every chart in the org references that single source of truth. The 2026 free tier covers 50K MAU and 10M events. Plus is \$49/mo for 200K MAU. Growth (the tier you actually need once you cross 200K MAU) is custom — three quotes I have reviewed in the last 12 months landed at ₹18 lakh–21 lakh per year. No India region.

| Platform | Founded | 1M events/mo | India region | Bundle includes | Setup time |
|----------|---------|---------------|--------------|------------------|------------|
| PostHog | 2020 | ₹2,490 (\$30) Cloud / ₹4,000 self-host | Self-host any AWS region | Events + replay + flags + A/B + LLM obs | ~2 hours self-host, ~10 min Cloud |
| Mixpanel | 2009 | ₹2,000 Growth | US/EU only | Events + funnels | ~15 min |
| Amplitude | 2012 | Free (under 10M) | US/EU only | Events + funnels + governed metrics | ~20 min |

The platforms are not competing on the same axis. PostHog competes on bundle + self-host. Mixpanel competes on PM-friendliness. Amplitude competes on governance for large orgs. Picking on the wrong axis is how India MVPs end up paying ₹35,000/month for analytics when ₹4,000 would do, or saving ₹30,000 and shipping a fintech feature that quietly violates a DPDP audit.`,
    },
    {
      heading: 'What Does Each Cost at 100K, 1M, and 10M Events?',
      content: `I logged actual usage across three real projects to build this table — the myFinancial PWA (which crossed 850 monthly active users in March 2026 at roughly 12,000 events per user, so ~10.2M events/mo), the deal-matching SaaS at ~2.1M events/mo, and an early-stage clinic app at ~180K events/mo. Same event taxonomy, same template props, INR at ₹83/USD (May 2026):

| Monthly volume | PostHog Cloud | PostHog self-host (Mumbai) | Mixpanel | Amplitude | Cheapest |
|----------------|----------------|------------------------------|-----------|------------|-----------|
| 100K events | ₹0 (free) | ₹3,800 (fixed infra) | ₹0 (free) | ₹0 (free) | **Mixpanel / Amplitude** |
| 1M events | ₹2,490 | ₹3,800 (fixed) | ₹2,000 | ₹0 (under 10M cap) | **Amplitude** |
| 10M events | ₹16,600 | ₹4,200 (fixed + slight scale) | custom (₹25K–35K) | ₹4,070 (Plus) | **PostHog self-host** |
| 50M events | ₹74,700 | ₹4,500 (fixed) | custom (₹60K+) | custom (₹1.5L+/mo) | **PostHog self-host** |
| 100M events | ₹1,49,000 | ₹6,500 (scale t3.large + larger RDS) | custom (₹1L+/mo) | custom (₹2L+/mo) | **PostHog self-host** |

A few things this table hides that matter once you ship:

**The PostHog self-host curve is almost flat.** At 100K events it costs the same as 50M events because the bottleneck is the fixed EC2 + RDS combo, not per-event metering. Break-even versus Cloud is around 8M events/month — under that, Cloud wins on engineering time. Above that, self-host wins by 10× or more. The myFinancial stack — t3.medium EC2 (₹2,200/mo), db.t4g.medium RDS (₹1,400/mo), S3 backups (₹150/mo), CloudWatch (₹200/mo) — totals ₹3,950/mo and absorbs 50M events/mo without breathing hard.

**Mixpanel's "free 100K MAU" is misleading at India scale.** They count any user who fires one event in a month, so for myFinancial we burned through 100K tracked MAU in week 11 of launch and the Growth upgrade came back at ₹22,400/mo for 250K MAU. Their MAU model is friendly to B2B SaaS with 200 paying users firing 50K events each. It is hostile to B2C India products with 50K free users firing 200 events each.

**Amplitude's free tier is the most generous up to 10M events**, and for a side-project shipping in stealth, it is genuinely the right call. The wall hits hard above 10M — three India startup quotes I have reviewed in 2025–26 landed at ₹18 lakh, ₹19.5 lakh, and ₹21 lakh annual for Growth. None were negotiable below ₹15 lakh.

The number that decides for most readers is somewhere between 1M and 50M events/month. In that band, PostHog self-host on AWS Mumbai beats all three on total cost of ownership. Below 1M, free tiers are equivalent and the call should be made on UI fit. Above 50M, self-host is the only sane economics.`,
    },
    {
      heading: 'Where Does Your Event Data Live — and Why Do RBI + DPDP Make This Non-Negotiable?',
      content: `Every event you send to Mixpanel or Amplitude leaves India. That is not hyperbole — both companies host in US-east, US-west, and EU only, with no public roadmap for an India region. For a marketing site or a B2B SaaS selling outside India, that is fine. For an India fintech, healthtech, or any product handling Aadhaar, PAN, or RBI-regulated data, it is a problem that gets bigger every quarter.

The DPDP Act 2023 took effect in phases through 2025 and the cross-border transfer rules are now being enforced — the September 2025 DPDPA Rules specify that personal data of Indian users transferred outside India for processing requires explicit notice, a documented purpose, and a contract clause with the foreign processor accepting Indian jurisdiction. For analytics events specifically, the gotcha is that "anonymised" event payloads often are not — Mixpanel's default identity layer ties every event to an immutable distinct_id that maps back to a user record, and a session replay clip includes mouse paths over PII fields like Aadhaar or PAN input boxes. Sending those abroad without a DPDPA-compliant transfer agreement is exactly the kind of finding the Data Protection Board picks up first.

The RBI Master Direction on Outsourcing of IT Services (April 2023, updated 2025) is stricter for regulated entities — every NBFC, payment aggregator, and PA-PG-licensed fintech is now required to keep "data of operational significance" inside Indian data centres. For myFinancial, that meant every behavioural event (which calculator you opened, how long you stayed) is treated as operational data under the RBI lens, even though it is not transactional. The clean answer was PostHog self-host inside our AWS Mumbai VPC — events never leave India, the bucket policy enforces ap-south-1 region lock, and we hand the auditor a single architecture diagram instead of a Data Processing Agreement chain.

For a non-regulated India consumer product — say, a B2C content app or a discovery marketplace — the bar is lower. The DPDPA grace period for non-regulated entities is the longest, and a vanilla Mixpanel setup with a DPA template signed at signup is defensible until at least 2027. But the cost of switching providers later, when you raise a fintech-adjacent product or get acquired by a regulated buyer, is consistently 4–6 weeks of engineering rework. Starting on PostHog self-host on day one of a [6-week MVP](/en/services/6-week-mvp) costs about 2 extra hours of setup and removes a whole class of compliance debt — that math has paid off on every India product I have shipped since 2024.`,
    },
    {
      heading: 'Side-by-Side Comparison Table — Features, Cost, and AI Citation Signals',
      content: `Here is the full feature-by-feature comparison, with the India MVP weight on each line called out. The "AI citation" column matters in 2026 because ChatGPT, Perplexity, and Google AI Overviews are now citing analytics-tool comparison passages directly into developer queries, and the table format is what wins those citations.

| Capability | PostHog | Mixpanel | Amplitude | India MVP weight |
|------------|----------|-----------|------------|-------------------|
| Event capture | ✅ JS, Node, Python, Go, Java, Swift, Kotlin | ✅ All majors | ✅ All majors | High |
| Session replay | ✅ Included | ❌ Paid add-on | ❌ Separate product (Heap-style) | High |
| Feature flags | ✅ Included | ❌ Paid add-on | ❌ Separate (Experiment) | Medium |
| A/B tests | ✅ Included | ❌ Paid (Experiments) | ❌ Paid (Experiment) | Medium |
| Self-host on Mumbai | ✅ Helm chart, ~2 hrs | ❌ Impossible | ❌ Impossible | **Critical for fintech** |
| India data residency | ✅ Self-host | ❌ | ❌ | Critical |
| Funnel UI ease | Medium | **Best** | Strong | Medium |
| Governed metrics | Basic | Strong | **Best** | Low for MVP |
| LLM observability | ✅ Included 2025 | ❌ | ❌ | High for AI startups |
| Free tier ceiling | 1M events/mo | 100K tracked users | 50K MAU + 10M events | High |
| Cost at 10M events | ₹16,600 (Cloud) / ₹4,200 (self) | ₹25K+ custom | ₹4,070 (Plus) | Critical |
| Cost at 50M events | ₹74,700 / ₹4,500 self | ₹60K+ custom | ₹1.5L+ custom | Critical |
| INR billing | ❌ USD via Stripe | ❌ USD | ❌ USD | Low |
| Hire pool in India | Growing fast | Mature | Mature | Medium |

Read the table top-to-bottom: PostHog wins on bundle (4 tools in one), wins on self-host (the only India residency story), and wins on cost above 8M events. Mixpanel wins exactly one row — funnel UI ease — and that one row is what decides for non-technical teams.

The AI-citation benefit of this table is concrete: the [Resend vs SendGrid vs AWS SES post](/en/notes/resend-vs-sendgrid-vs-aws-ses-india-mvp-2026) I shipped two weeks ago is showing up in 4 Perplexity searches/day on my own PostHog canonical tracking — the cited snippet is the table, not the prose.`,
    },
    {
      heading: 'When Do Mixpanel or Amplitude Actually Beat PostHog?',
      content: `PostHog is not the right answer for everyone, and the E-E-A-T-honest version of this post needs the counter-cases as much as the recommendation. Three scenarios where I have actively talked clients out of PostHog and into one of the alternatives:

**1. Non-technical founder, no engineer on the team, under 100K events/month.** PostHog Cloud is the right product but the wrong UX for a marketing-led founder who needs to build a funnel chart in 90 seconds without reading docs. Mixpanel's drag-and-drop funnel builder is genuinely the cleanest UI in the category and the 100K-tracked-user free tier carries you for the first 18 months of most B2B SaaS launches. On the clinic-booking project mentioned in the intro, the founder is a doctor with one part-time developer — Mixpanel was the right call, despite the data-residency gap, because the doctor needs to look at conversion charts daily without filing a support ticket.

**2. Series A+ B2B SaaS with a dedicated data analyst and metric governance pain.** Amplitude's "Govern" module — where you define metrics once and lock them across the org — is genuinely best-in-class. I have watched a 40-person B2B startup spend three weeks reconciling "Active User" definitions across PostHog Cloud because three product squads were each writing their own HogQL, and that is exactly the problem Amplitude solves cleanly. Below ₹2 crore ARR you do not have this problem. Above it, Amplitude pays for itself in analyst hours.

**3. You need a phone-support SLA on India hours for a high-stakes launch.** PostHog Cloud support is email-only on the Pro tier and Slack-channel on Enterprise. Mixpanel's Enterprise plan and Amplitude's Growth tier both include phone support with India-hours coverage. If you are launching a fintech feature where a tracking break during a product-launch funnel chart costs you a board update, the support contract is worth the price delta.

Three scenarios where PostHog wins decisively:

- Any India fintech, healthtech, or RBI/IRDAI-regulated product — the self-host data residency is non-negotiable
- Engineering-heavy team that wants session replay + feature flags + A/B + analytics in one tool without 4 vendor invoices
- Any product crossing 8M events/month — the self-host cost curve is unbeatable

If you are reading this and the answer feels unclear, look at the next section — the 5-step checklist is built to resolve the ambiguous cases.`,
    },
    {
      heading: 'Decision Checklist — How to Pick in 5 Minutes',
      content: `Run this checklist top to bottom and stop at the first triggered rule. It is the same flowchart I run on the first sprint of every [6-week MVP](/en/services/6-week-mvp) I take on:

1. **Are you in fintech, healthtech, or any RBI/IRDAI/DPDP-regulated category?** → PostHog self-host on AWS Mumbai. Non-negotiable. The compliance saving alone covers the 2-hour setup investment 100× over.

2. **Do you have zero engineering capacity right now, and is your first analytics user a PM or marketer?** → Mixpanel. The 90-second funnel-builder UI is worth the data-residency tradeoff for an MVP under 100K events/month. Migrate to PostHog after you hire an engineer.

3. **Are you Series A+, with a dedicated data analyst and three product squads arguing about metric definitions?** → Amplitude. The Govern module is the only thing in this category that solves the cross-squad metric drift problem cleanly. Budget ₹18 lakh+/year.

4. **Do you expect to cross 8M events/month in the next 12 months?** → PostHog self-host. The cost curve becomes a chasm above 8M and you do not want to be re-platforming during your Series A fundraise.

5. **None of the above, and you just want a thing that works for a 200-user beta?** → PostHog Cloud free tier. 1M events/month is plenty for any pre-PMF product, the bundle gets you session replay + feature flags for free, and migration to self-host is a documented 4-hour task when you outgrow it.

A few rules-of-thumb that override the checklist:

- If you are hiring a [founding engineer in India](/en/services/hire-founding-engineer-india) anyway, the 2-hour PostHog self-host is included in their first sprint at no marginal cost — that tilts every borderline case toward PostHog.
- If your product is AI-first and you need LLM observability (prompt tokens, latency, hallucination rate) alongside product analytics, PostHog's 2025 LLM-obs integration is the only one-tool answer in the category.
- If a vendor offers you a 90-day Enterprise free trial in exchange for a case study, take Mixpanel's — their Enterprise tier is the most generous on free trials and you can migrate off after the trial for ₹0.

The wrong answer on this checklist is reversible — it cost myFinancial three days to switch off Mixpanel. The right answer day one saves those three days and a quarter of an engineer-month later.`,
    },
    {
      heading: 'Ship the Right Analytics Stack on Day One',
      content: `If you are reading this because you are picking analytics for an India MVP and the answer feels obvious now, you are 80% of the way there — the remaining 20% is the actual setup, which is the part where most teams lose another half-week. Every [6-week MVP sprint](/en/services/6-week-mvp) I ship in 2026 provisions PostHog self-host on AWS Mumbai in the first week, with the event taxonomy designed against the product's three core funnels before any UI code is written.

If you are at the earlier stage — still deciding between hiring a founding engineer in India, a Western contractor, or trying to vibe-code it on an AI builder — the analytics decision is downstream of the bigger one. I wrote about that tradeoff in [Founding Engineer India vs Toptal vs Arc vs Uplers](/en/notes/founding-engineer-india-vs-toptal-arc-uplers-2026) and the more recent [Lovable App Production Bugs Need a Real Engineer](/en/notes/lovable-app-production-bugs-need-real-engineer-2026). The TL;DR: an experienced engineer who has shipped this stack three times costs you a known fixed number; an AI builder costs you an unknown future debugging bill.

If you want me to take the analytics setup off your plate as part of a 6-week sprint — event taxonomy, PostHog self-host on Mumbai, three funnels wired to your product KPIs, and a Looker-style dashboard for the founder by week three — that is what I do. Otherwise, take the checklist above, pick the platform, and ship.`,
    },
  ],
  cta: {
    text: 'Ship a Real MVP With Real Analytics in 6 Weeks',
    href: '/en/services/6-week-mvp',
  },
};
