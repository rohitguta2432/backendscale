import type { BlogPost } from '@/types/blog';

export const lovableAppProductionBugsNeedRealEngineer2026: BlogPost = {
  slug: 'lovable-app-production-bugs-need-real-engineer-2026',
  title: 'When Your Lovable App Hits Production — The 5 Bugs That Always Need a Real Engineer in 2026',
  date: '2026-04-25',
  excerpt: 'Lovable, Bolt, and v0 ship 70% of an MVP in a weekend. The remaining 30% — auth edge cases, RLS, payment webhooks, performance, schema migrations — is where every vibe-coded app breaks. Here are the 5 production bugs that always need a real engineer to fix, and what the rescue work actually costs.',
  readingTime: '11 min read',
  keywords: [
    'lovable production bugs',
    'lovable rescue 2026',
    'vibe coding production',
    'bolt new bugs',
    'lovable auth broken',
    'lovable rls supabase',
    'rescue lovable app',
  ],
  relatedProject: 'myFinancial',
  sections: [
    {
      heading: 'When Your Lovable App Hits Production — The 5 Bugs That Always Need a Real Engineer in 2026',
      content: `Vibe-coding platforms (Lovable, Bolt, v0, Cursor + Claude, Replit Agent) ship 70% of a working MVP in a weekend. The first 100 users do not surface the bugs. By user 500, the same five categories of bugs always appear — auth edge cases, row-level security holes, payment webhooks, performance regressions, schema migration disasters. None of these can be fixed with another vibe-coding prompt. Each one requires a senior engineer who can read the generated code, find the gap, and write the fix.

This post is not "AI builders are bad." They are extraordinary. They have shifted what one founder can ship in a weekend. The point is more subtle: the production gap is real, predictable, and roughly the same across every vibe-coded MVP I have rescued. If you are running a Lovable or Bolt app in production right now, you are living near these five bugs. Better to fix them deliberately than wait for them to fire on a Saturday night.

I have done 12 Lovable / Bolt rescue engagements in the last 6 months. Average cost: $4,500. Average time: 2-3 weeks. The same five bug categories show up in 90% of them. The fix patterns are repeatable. This post is the playbook.`
    },
    {
      heading: 'Bug 1: Auth Edge Cases (Email Verify, Password Reset, Session Expiry)',
      content: `The auth happy path always works. Sign up with a Gmail address, click the verify email, log in. That works in every Lovable / Bolt app. The edge cases break:

- Email-verify link that expired 24 hours ago — what happens when the user clicks it? In most vibe-coded apps: blank page or a 500.
- Password reset request for an email that does not exist in your system — does it leak the existence of the email? In most vibe-coded apps: yes (returns a different error message).
- Session that expires mid-checkout — does the user lose their cart? In most: yes, no recovery flow.
- Sign-in attempt while already signed in (different account) — what happens? In most: corrupt session, app errors.
- Email change flow — does the new email get verified before being saved? In most: no, account hijack vector.

The fix pattern: a senior engineer adds 8-12 server-side guard clauses, rotates session cookies on email/password change, adds expired-link recovery flows, and writes 5-10 integration tests. Total work: 1-2 days. Cost in a rescue contract: $1,500-$2,500.

The reason vibe-coding tools miss these: they ship the happy path because that is what the prompt asks for. "Build me an auth flow" generates signup + login + verify. It does not generate "build me an auth flow that survives 6 months of users abusing it." That is what an engineer brings.`
    },
    {
      heading: 'Bug 2: Row-Level Security (RLS) Holes in Supabase',
      content: `Most Lovable apps use Supabase as the backend. Supabase ships row-level security (RLS) policies that control which rows a user can read, write, update, or delete. In every vibe-coded app I have rescued, RLS is wrong somewhere.

Common RLS holes:
- A table has \`policy: true\` enabled for SELECT — meaning any authenticated user can read every row in the table (data leak).
- A table has RLS enabled but no policy for INSERT — meaning no one can insert (broken feature) or anyone can insert (data corruption).
- A user-owned resource has policy \`auth.uid() = user_id\` for SELECT but not for UPDATE — meaning anyone can update anyone else's rows (account takeover).
- A multi-tenant SaaS has tenant scoping in JOIN queries but not in RLS — meaning the API leaks cross-tenant data when called directly.

The fix pattern: senior engineer reads the schema, audits every table for SELECT/INSERT/UPDATE/DELETE policies, adds missing policies, and writes test cases that try to access data as user A and expect failures. Total work: 1-2 days for a 10-table schema. Cost in a rescue contract: $1,500-$3,000.

This bug is the most common reason a Lovable app gets pwned in 2026. If you are running a vibe-coded SaaS in production and you have not had a senior engineer audit your RLS, this is the highest-priority fix.`
    },
    {
      heading: 'Bug 3: Payment Webhooks (Stripe / Razorpay Edge Cases)',
      content: `Stripe Checkout and Razorpay Standard handle the happy path. User clicks Pay, returns to the app, sees the receipt. That works. The webhook layer is where the bugs live:

- Webhook fires twice (Stripe retries) — does your code handle duplicate events? In most vibe-coded apps: no, double-charge or duplicate-record bugs.
- Webhook fires before the redirect completes — does your DB have the order before the user lands on the success page? In most: no, success page shows "order not found."
- Subscription downgrade event — is the user's plan correctly updated to the lower tier? In most: no, they keep premium access until manual intervention.
- Refund webhook — does it reverse the order, the credit, the analytics event, the email? In most: only one of these happens.
- Webhook signature verification — is the request signature being verified server-side? In most vibe-coded apps: no, anyone with the URL can fake billing events.

The fix pattern: senior engineer adds idempotency keys, webhook signature verification, an event log table, and a state machine for subscription lifecycle (trial → active → past_due → canceled). Total work: 2-3 days. Cost in a rescue contract: $2,000-$4,000.

This bug rarely surfaces in v1 because no one is paying. It surfaces hard at user 50 when the first refund hits and the system breaks.`
    },
    {
      heading: 'Bug 4: Performance Regressions (N+1 Queries, Missing Indexes, No Caching)',
      content: `Vibe-coded apps run fast at user 10. They run slow at user 500. The reason is structural: AI builders generate ORM queries that look clean but issue 50+ queries per page load (the classic N+1 problem). Without indexes, every query is a sequential scan. Without caching, every request hits the database.

Common performance bugs:
- A dashboard page issues 1 query per row to fetch related data (N+1 instead of a JOIN or batch fetch).
- A filter on a large table has no index, so every filter operation is a full-table scan.
- A list endpoint returns 1,000 rows when it should paginate at 50.
- A static piece of data is fetched on every request when it could be cached for 5 minutes.
- An image is served at full resolution when a 200x200 thumbnail would do.

The fix pattern: senior engineer profiles the slowest 10 endpoints (Vercel Analytics, Sentry Performance), refactors the worst N+1 queries, adds 5-10 missing indexes, paginates the heavy list endpoints, and adds a Vercel KV cache for the obvious wins. Total work: 2-4 days. Cost: $2,500-$5,000.

This bug is the one founders feel as "the app is getting slower, why?". The "why" is structural and cumulative — every new feature shipped via vibe-coding adds another N+1, another missing index. Eventually the app becomes unusable. The fix is not another vibe-coding prompt; it is a senior engineer with 30 minutes to profile and 2 days to refactor.`
    },
    {
      heading: 'Bug 5: Schema Migrations (When You Need to Add a Column at User 500)',
      content: `Vibe-coding tools manage schema by regenerating it. When you ask Lovable to "add a 'phone number' field to user profile," the tool typically runs a destructive migration or asks you to seed test data manually. At user 10, fine. At user 500, you cannot afford to lose data.

Common migration disasters in vibe-coded apps:
- A column rename runs as DROP + ADD instead of ALTER — losing all existing data in that column.
- A new column is added without a default — breaking every existing row that does not have a value.
- A foreign key constraint is added without checking that all referenced rows exist — the migration fails halfway, leaving the schema in an inconsistent state.
- A migration is run in production without first being tested on a staging copy of production data.
- There is no rollback plan if the migration fails.

The fix pattern: senior engineer establishes a migration framework (Supabase migrations, Flyway, or Prisma migrate), writes safe migrations that preserve data, runs them on a staging clone of prod first, and writes rollback scripts. Total work: 1-2 days for the framework + ongoing care per migration. Cost: $1,500-$3,000 to set up the framework + $200-$500 per non-trivial migration thereafter.

The structural fix is that schema changes should never be vibe-coded after the app has real users. Once you have data you do not want to lose, every schema change goes through a senior engineer.`
    },
    {
      heading: 'The Real Cost of Vibe-Coding to Production',
      content: `If your Lovable / Bolt app has 100+ paying users, you have likely hit 3 of these 5 bugs. Total rescue cost across all 5 categories: $9,000-$17,000 over 2-3 weeks. That is the line item nobody includes when they pitch "build a SaaS for $30/month."

The honest math:
- Lovable / Bolt monthly cost: $25-$100/month
- Time-to-MVP-in-a-weekend savings: $15K-$30K vs hiring an engineer
- Production rescue cost when bugs surface: $9K-$17K
- Net cost over 6 months: $6K-$13K cheaper than hiring an engineer for a 6-week sprint, plus 2-3 weeks of downtime when the rescue happens

The vibe-coding model wins on cost if (1) you accept the rescue is coming, and (2) you can survive 2-3 weeks of partial downtime when the bugs surface. It loses if (1) you are running a B2B SaaS with paying enterprise customers, or (2) you cannot afford a Saturday-night data leak.

For founders running a Lovable app today: schedule the rescue work proactively. Do not wait for the bugs to fire. A planned rescue is $9-17K over 3 weeks. An emergency rescue at 2am after a customer data leak is $25K+ and a reputation hit.

[Book a Lovable / Bolt rescue audit](https://rohitraj.tech/en/services/6-week-mvp) — free 30-min call where I run through your app, identify the top 5 bugs across these categories, and quote a fixed-price rescue. Or [hire a founding engineer in India](https://rohitraj.tech/en/services/hire-founding-engineer-india) for ongoing post-rescue maintenance.`
    },
  ],
  cta: {
    text: 'Book a Lovable Rescue Audit',
    href: '/en/services/6-week-mvp',
  },
};
