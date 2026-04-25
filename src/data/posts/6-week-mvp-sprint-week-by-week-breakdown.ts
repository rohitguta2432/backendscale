import type { BlogPost } from '@/types/blog';

export const sixWeekMvpSprintWeekByWeekBreakdown: BlogPost = {
  slug: '6-week-mvp-sprint-week-by-week-breakdown',
  title: '6-Week MVP Sprint — Week-by-Week Breakdown of What Actually Ships',
  date: '2026-04-25',
  excerpt: 'Most "6-week MVP" promises are 12-week projects with marketing copy. This is what a real 6-week sprint looks like — week one through week six, what gets built, what gets cut, and what production-ready means at day 42.',
  readingTime: '11 min read',
  keywords: [
    '6 week mvp',
    '6 week mvp sprint',
    'mvp sprint timeline',
    'mvp week by week',
    'fixed scope mvp',
    'mvp production ready 6 weeks',
    'mvp sprint plan',
  ],
  relatedProject: 'myFinancial',
  sections: [
    {
      heading: '6-Week MVP Sprint — Week-by-Week Breakdown of What Actually Ships',
      content: `A 6-week MVP sprint is not a 6-week project with marketing copy on top. It is a fixed-scope, fixed-price contract where the scope doc is locked on day one, the deploy happens on day 42, and the founder gets a production app with auth, billing, and a working core feature set. Every week has a single output. If the output is wrong, we cut scope — never extend the timeline.

Most agencies sell "6-week MVPs" that take 12-16 weeks because they let scope creep in week 3 and the founder is too deep to push back. The 6-week sprint model only works if you treat the scope doc like a contract, not a wish list. This post is the actual week-by-week breakdown of how a sprint runs — what gets done, what gets cut, and what production-ready looks like on day 42.

I have run this exact sprint structure on 10+ MVP builds. The same pattern keeps working because it forces decisions early. Founders who have spent months arguing with co-founders about features make their final calls in 90 minutes once the day-one scope doc is on the table.`
    },
    {
      heading: 'Week 0 — The Scope Doc That Decides Whether the Sprint Will Work',
      content: `Before week one starts, we spend 3-5 days writing a 1-page scope doc. This is the most important artifact in the entire engagement. The doc lists the core value proposition (one sentence), the user-facing features that ship in v1 (3-5 max), the integrations included (max 3), the pages and screens, and the explicit "not in v1" list.

The "not in v1" list is what makes the sprint work. If a founder says "we also need an admin dashboard, multi-tenant support, and a referral system," all three go into v1.5 or v2. The scope doc is what we both sign. Anything outside the doc requires a swap (drop one feature, add another of equal effort) or a v2 sprint at the same day rate.

Founders sometimes resist this. They want flexibility. Flexibility is what kills MVPs — every "small addition" is two days of work, three days of testing, and a week of design changes. By week 4 the project has 12 features instead of 5, none of them polished, none ready to demo. The scope doc is brutal because it has to be.

By the end of Week 0, we have: the 1-page scope, the chosen tech stack (Next.js + Postgres + Vercel covers 95% of cases), the fixed price, the day-1 to day-42 timeline, signed NDA, and the GitHub repo created with founder access from commit one. The only thing left is to start building.`
    },
    {
      heading: 'Week 1 — Foundations (Auth, Database, Deployment, Skeleton UI)',
      content: `Week 1 is the most boring week and the most important. By Friday of week 1, the app is deployed to a staging URL, the founder can log in, and the database has the core schema. Nothing user-facing is done. That is the goal.

Concrete week-1 outputs:
- Next.js or Spring Boot project initialized, GitHub repo public to founder
- Postgres database provisioned (Supabase or RDS), schema for core entities, migrations in version control
- Auth integrated (Supabase Auth, Clerk, or NextAuth) — signup, login, password reset, email verify all working
- Vercel or AWS deploy hooked to main branch, every commit auto-deploys to staging
- Basic CI/CD pipeline: typecheck, lint, build on every PR
- Sentry or equivalent error tracking installed
- Skeleton UI: nav bar, login page, dashboard placeholder, settings page

Founders sometimes get nervous in week 1 because nothing demoable exists. This is a feature, not a bug. Every hour spent on auth and deployment in week 1 is an hour saved in week 4. The riskiest projects are the ones that demo great in week 2 but fail to deploy on day 38 because nobody set up the production environment.

The week-1 demo is intentionally boring: founder signs up, logs in, sees an empty dashboard. That is success. The infrastructure is ready, and weeks 2-4 are pure feature work.`
    },
    {
      heading: 'Weeks 2-4 — Core Features (The 3-5 Things Your Users Actually Do)',
      content: `Weeks 2, 3, and 4 are where the actual product gets built. The 3-5 core features from the scope doc each get a week or split across two. By end of week 4, the app does the thing it exists to do — the core user flow works end-to-end on staging.

Concrete weeks 2-4 outputs:
- Feature 1 (most important): full UI, backend, database integration, tested manually
- Feature 2 (second most important): full UI, backend, integration, tested
- Feature 3-5 (smaller): smaller versions, may be polished in week 5
- API endpoints for everything user-facing (REST or GraphQL, your call)
- One domain integration (e.g., a search API, an LLM, a maps API)
- Admin actions: ability for the founder to view users, reset passwords, see basic analytics
- Mobile-responsive UI (works on iPhone Safari without zooming)

The big rule in weeks 2-4: ship to staging every day. Founder logs in to staging every Friday, walks through the new feature, gives feedback in the GitHub repo as issues. Feedback that is "this is broken" gets fixed. Feedback that is "we should also add..." gets pushed to v2. This is the contract working.

Most weeks 2-4 sprints fail because founders introduce a "small new idea" mid-week and the timeline slips. The scope doc is the answer: every new idea goes into a v2 backlog, which gets reviewed at the start of week 5.`
    },
    {
      heading: 'Week 5 — Billing, Integrations, Polish, and the First Production Push',
      content: `Week 5 is integration and polish week. The third-party integrations from the scope doc (Stripe, Razorpay, SendGrid, Resend, Twilio) get plugged in and tested. The UI gets cleaned up, the rough edges get smoothed, and the app gets pushed to production for the first time.

Concrete week-5 outputs:
- Billing live: Stripe or Razorpay integrated, subscription plans configured, webhooks tested with the real provider sandbox
- Transactional email: SendGrid or Resend hooked up, all key flows (signup, password reset, billing receipts) sending real emails
- Production deploy: app live on the founder's domain (rohitraj.tech or yourdomain.com), DNS configured, SSL working
- Analytics: Plausible, Posthog, or Google Analytics installed, key events tracked
- SEO basics: titles, meta descriptions, sitemap, robots.txt, OG images
- Error monitoring: Sentry alerts configured to ping the founder via email or Slack
- Backup strategy: daily Postgres dumps to S3 or Supabase storage

This week is where most "6-week MVPs" turn into 10-week projects. Billing is the hardest integration in any SaaS — webhook handling, subscription state machines, refunds, dunning. We do not invent it from scratch. We use Stripe Checkout or Razorpay Standard, both of which handle 90% of edge cases. The remaining 10% goes into v2.

By Friday of week 5, the founder can hit the production URL, sign up, pay for a real subscription with their real credit card, and use the product. That is the milestone — production-ready does not mean "marketing site live", it means "a stranger can pay you money".`
    },
    {
      heading: 'Week 6 — Bug Bash, Documentation, Handoff, and Launch',
      content: `Week 6 is the ship-week. Three founders, three friendly users, and the engineer hammer the production app for 5 days. Every bug gets logged, prioritized, and fixed. Documentation gets written. The handoff happens on Friday.

Concrete week-6 outputs:
- Bug bash: 20-30 bugs logged from real-user testing, 90% fixed, 10% deferred to v2 with clear acceptance
- Performance pass: page-load under 2 seconds, lighthouse score 85+, image optimization, lazy loading
- Security pass: auth checked for common holes (RLS, IDOR, mass assignment), secrets rotated, environment variables locked down
- Documentation: README with setup instructions, ENV vars documented, Postgres schema diagram, API endpoint list
- Knowledge transfer: 1-hour Zoom call where I walk the founder (or their next engineer) through the codebase
- Launch prep: ProductHunt assets if relevant, basic landing page copy, share-link OG images
- Two weeks of post-launch bug-fix support included in the contract

The handoff is intentional. The codebase is documented, conventional, and clean enough that any senior engineer can take it over in two weeks. That is the design choice. If the founder wants me on a retainer afterwards, great. If they want to bring it in-house, the codebase is portable. No lock-in is the contract.

By the end of week 6, the founder has a production product, a payment-ready customer flow, error monitoring, backup, deploy pipelines, and full GitHub access. The 6-week MVP sprint is done. The 12-month founding-engineer hire was never necessary.`
    },
    {
      heading: 'What Gets Cut — The Honest List',
      content: `A 6-week sprint cannot ship everything. The scope doc lists what is in. Here is what is almost always cut to v2:

- **Mobile native apps**: iOS / Android native is a separate React Native sprint. The MVP is web-first.
- **Complex admin panels**: simple table views included; full Retool-style admin is v2.
- **Multi-tenant architecture**: single-tenant ships in v1. Multi-tenant is a v2 sprint with its own scope doc.
- **AI features beyond one integration**: one LLM call for one feature is fine. RAG, vector search, fine-tuning is v2.
- **Custom design systems**: clean component libraries (shadcn, Mantine, Chakra) get used. Bespoke designs are v2.
- **i18n / localization**: ships in English by default. Multi-language is v2 if you need it.
- **Real-time / collaborative features**: WebSockets, presence, live cursors are v2 — they add 2-3 weeks.

Cutting these is not a compromise. It is the discipline that makes the sprint ship in 6 weeks. Every founder I have shipped with has come back for a v2 sprint within 8 weeks of v1 launch. By that point, they have real users telling them what to build — and the v2 scope is sharper, faster, and cheaper because the foundation is already there.

If your idea cannot fit in this scope, you have two options: split it into v1 + v2 sprints (12 weeks total, $30K-$50K), or hire a founding engineer for a 4-month build at $80K-$140K. Both are valid. The 6-week sprint is the right call when you need to validate before you invest.`
    },
    {
      heading: 'Ready to Run Your Own 6-Week Sprint?',
      content: `If you have a validated idea, a clear core value prop, and 6 weeks of focused availability to give a founder + engineer collaboration — the sprint is the fastest way from idea to paying customer in 2026.

[Scope your 6-week MVP](https://rohitraj.tech/en/services/6-week-mvp) — free 30-minute call, written scope doc, fixed price quote within 48 hours. NDA signed before the first call. Zero pressure.`
    },
  ],
  cta: {
    text: 'Scope Your 6-Week MVP',
    href: '/en/services/6-week-mvp',
  },
};
