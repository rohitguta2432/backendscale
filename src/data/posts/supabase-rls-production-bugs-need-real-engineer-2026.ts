import type { BlogPost } from '@/types/blog';

export const supabaseRlsProductionBugsNeedRealEngineer2026: BlogPost = {
  slug: 'supabase-rls-production-bugs-need-real-engineer-2026',
  title: 'Your Supabase RLS Just Leaked Production Data — The 5 Bugs Every Vibe-Coded App Hits in 2026',
  date: '2026-04-26',
  excerpt: 'Supabase row-level security is opt-in, silent when wrong, and tested with a superuser token that bypasses everything. In January 2025, 170+ Lovable apps leaked their production databases because nobody enabled RLS. Here are the 5 RLS bugs every vibe-coded app ships, and the audit pattern a senior engineer runs to catch them before user 500.',
  readingTime: '10 min read',
  keywords: [
    'supabase rls production bugs',
    'supabase row level security',
    'supabase rls leak',
    'lovable supabase security',
    'multi-tenant rls policies',
    'supabase rls audit',
    'vibe coding security 2026',
  ],
  relatedProject: 'myFinancial',
  sections: [
    {
      heading: 'Your Supabase RLS Just Leaked Production Data — The 5 Bugs Every Vibe-Coded App Hits in 2026',
      content: `If your Supabase project was scaffolded by [Lovable](/en/notes/lovable-app-production-bugs-need-real-engineer-2026), Bolt, or Cursor, your row-level security is almost certainly broken in at least one of five predictable ways. The fix is not another prompt. The fix is a senior engineer who reads the SQL and tests the policies against a real anon-key client.

The cost of getting RLS wrong is not theoretical. In January 2025, security researchers found **170+ Lovable-generated apps with fully exposed production databases** — names, emails, phone numbers, payment data — because RLS was either disabled or scoped to a permissive default policy. The apps shipped to real users. The leak was silent. Nobody noticed until the dump appeared in a Telegram channel.

The structural reason this keeps happening: Supabase RLS is opt-in, the SQL Editor bypasses it entirely, and the dev environment usually runs with a service-role key that ignores every policy. So every test passes locally. Every demo works. The leak only opens once a real client hits the database with a real anon JWT — which is also when you ship.

I have audited 9 Supabase-backed Lovable / Bolt rescue projects in the last 4 months. The same five RLS bugs show up in 8 of them. This post is the audit pattern, the failure modes, and what the rescue work costs.`
    },
    {
      heading: 'Bug 1: RLS Is Disabled by Default — And Nothing Tells You',
      content: `When you create a table in Supabase, RLS is **off**. The dashboard shows a small yellow "RLS disabled" badge that nobody reads. Your queries work. Your IDE compiles. Your Lovable preview deploys. And every authenticated user can read every row in that table — including rows belonging to other tenants, other users, other companies.

The vibe-coding pipeline makes this worse. Lovable's prompt-to-app flow generates the table, generates the API call, generates the React form. It does not generate a "now enable RLS and write a policy" step. The default state is wide-open access via the public anon key.

The fix pattern a senior engineer runs:

1. Run \`SELECT relname, relrowsecurity FROM pg_class WHERE relkind = 'r' AND relnamespace = 'public'::regnamespace;\` to list every public table and whether RLS is on.
2. For every table where \`relrowsecurity\` is \`false\`, ask: should the anon key be able to read this? In 95% of cases the answer is no.
3. Enable RLS with \`ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;\` and write at least one policy per CRUD verb you actually use.
4. Tables that genuinely need to be public (a marketing-side blog index, a public catalog) get an explicit \`policy: USING (true)\` for SELECT only — never for INSERT, UPDATE, or DELETE.

Total work for a 12-table Supabase project: 4-6 hours. Cost in a [rescue engagement](/en/services/hire-founding-engineer-india): $600-$1,200. The discovery query alone is 30 seconds. The hard part is reasoning through what each table should expose.`
    },
    {
      heading: 'Bug 2: Cross-Tenant Leak Through Joined Tables',
      content: `You enabled RLS on the \`organizations\` table. You wrote a policy: \`USING (id = auth.jwt() ->> 'org_id')\`. You felt safe. Then a query joins \`organizations\` to \`projects\` and somehow returns rows from another org's projects. How?

Each table's RLS policy is checked **independently**. If \`organizations\` has a strict tenant policy but \`projects\` has a permissive policy (or no policy after RLS was enabled), the join silently leaks. The Postgres planner walks the join graph and applies each table's policy in isolation. Worse, the failure mode is often the **opposite**: rows that should appear vanish from results because both policies must allow access. So you debug a "missing data" bug, loosen the wrong policy, and accidentally open a leak in the other direction.

The classic Lovable-multi-tenant bug looks like this:

\`\`\`sql
-- organizations: tight policy
CREATE POLICY "tenant_isolation" ON organizations
  FOR SELECT USING (id = (auth.jwt() ->> 'org_id')::uuid);

-- projects: forgot to add a tenant policy
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- (no SELECT policy added — RLS now denies all reads)

-- "Fix" applied by a non-engineer who saw zero rows:
CREATE POLICY "allow_read" ON projects FOR SELECT USING (true);
-- Boom. Cross-tenant project list now leaks via SELECT * FROM projects.
\`\`\`

The fix pattern: every table that participates in a tenant-scoped JOIN must carry the **same** tenant filter. Treat tenant_id as a foreign key invariant — if it appears in any join in your codebase, it must appear in the RLS policy of both tables. A senior engineer writes the policy once as a SQL function (\`current_org_id()\`) and reuses it across every tenant-scoped table to prevent drift.

Rescue work: 1 day for a 10-table multi-tenant schema. Cost: $1,500-$2,000.`
    },
    {
      heading: 'Bug 3: Trusting auth.jwt() ->> user_metadata in a Policy',
      content: `Supabase JWTs carry two metadata bags: \`app_metadata\` and \`user_metadata\`. They look identical in the JWT payload. They are not.

\`app_metadata\` is server-controlled — it can only be set via the service role key from your backend. \`user_metadata\` is **client-controlled** — any authenticated user can update their own user_metadata via \`supabase.auth.updateUser({ data: { ... } })\` from the browser console. If your RLS policy reads \`auth.jwt() ->> 'user_metadata' ->> 'role'\`, you have just shipped a privilege-escalation vulnerability that any logged-in user can exploit in 30 seconds.

Spotted in the wild on 4 of my last 9 rescue projects. The Lovable prompt was something like "let admins see all rows." The generated policy was:

\`\`\`sql
CREATE POLICY "admins_see_all" ON invoices FOR SELECT
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
\`\`\`

Any user runs \`updateUser({ data: { role: 'admin' } })\` from devtools. Their next request carries a JWT with \`user_metadata.role = 'admin'\`. They see every invoice in the system.

The fix pattern: never read \`user_metadata\` in a policy. Use \`app_metadata\` (set server-side after a permission check) or a roles table joined via \`auth.uid()\`. A senior engineer adds a \`user_roles(user_id uuid, role text)\` table, populates it from a server function with a permission check, and rewrites every policy that referenced \`user_metadata\`.

Rescue work: 4-6 hours including writing the migration and re-deploying with backfill. Cost: $700-$1,200. This is the single highest-severity bug in the list — it is an active exploit, not a passive leak.`
    },
    {
      heading: 'Bug 4: Missing Indexes on Columns Referenced in RLS Policies',
      content: `RLS policies are SQL predicates that get \`AND\`-ed onto every query. If your policy says \`USING (org_id = current_org_id())\`, every \`SELECT\` against that table now filters by \`org_id\`. Without an index on \`org_id\`, every query is a sequential scan.

In dev with 50 rows, you do not notice. At user 500 with 50,000 invoices, the dashboard takes 4 seconds. At user 5,000 with 500,000 rows, the dashboard times out, the front end shows a spinner forever, and Vercel's edge function hits the 10-second cap and 504s. The Lovable-generated frontend has no graceful timeout handling, so the user sees a blank screen.

The fix pattern is mechanical but the discovery is not — most founders blame "Supabase is slow" when the real bug is "RLS is enforced but the predicate column is unindexed." A senior engineer:

1. Lists every RLS policy: \`SELECT tablename, policyname, qual FROM pg_policies WHERE schemaname = 'public';\`
2. Extracts every column referenced in a \`USING\` or \`WITH CHECK\` clause.
3. Confirms each column has a btree index, ideally one that matches the most common filter combination (\`(org_id, created_at)\` for time-windowed dashboards).
4. Adds missing indexes via \`CREATE INDEX CONCURRENTLY\` so production stays online during the migration.
5. Re-runs \`EXPLAIN ANALYZE\` on the slow page's query to confirm sequential scans turn into index scans.

Rescue work: 4-8 hours for a 15-table schema. Cost: $700-$1,400. Often pays for itself in a single month of saved Postgres compute.`
    },
    {
      heading: 'Bug 5: Tested in the SQL Editor (Which Bypasses RLS Entirely)',
      content: `This is the bug that makes the other four bugs ship. The Supabase dashboard SQL Editor runs every query as the **service_role** by default. Service role bypasses every RLS policy. So when a vibe-coder runs \`SELECT * FROM invoices WHERE org_id = 'foo'\` in the dashboard and sees the right rows, they conclude RLS works. It does not. The query never went through RLS in the first place.

Real verification has to happen with the **anon** key, from a real client, with a real user JWT. The fastest way is a 30-line Node script:

\`\`\`typescript
import { createClient } from '@supabase/supabase-js';

const anon = createClient(URL, ANON_KEY);
await anon.auth.signInWithPassword({ email: 'usera@test.com', password });

// Try to read user B's data — should fail.
const { data, error } = await anon.from('invoices')
  .select('*').eq('user_id', USER_B_ID);

if (data && data.length > 0) {
  throw new Error('RLS LEAK — user A read user B rows');
}
\`\`\`

Run this for every table, for every CRUD verb, for at least two test users. A senior engineer turns it into a test suite that runs in CI and blocks deploys when an RLS regression slips in. The pattern is the same one used to verify [auth edge cases on Lovable rescues](/en/notes/lovable-app-production-bugs-need-real-engineer-2026) — assume the happy path lies, test the negative paths.

Rescue work: 1-2 days to write the suite for a 10-table schema, plus integration into the existing CI. Cost: $1,500-$3,000. The suite catches every RLS regression for the rest of the project's life, which is why this is the highest-leverage line item in the audit.`
    },
    {
      heading: 'Vibe-Coded vs Senior-Engineered RLS — Side-by-Side',
      content: `This is the audit table I hand founders after a Supabase project review. Each row is a real bug from the last six months of rescue work.

| Failure | Vibe-coded default | Senior-engineered fix |
|---|---|---|
| RLS state on new table | Disabled, no warning | Enabled at migration time, default-deny |
| Multi-tenant join | Per-table policy, drifts | Shared \`current_org_id()\` SQL function reused everywhere |
| Role checks | Reads \`user_metadata.role\` | Reads \`user_roles\` table populated server-side |
| Filter columns | Unindexed, full scan | btree index on every \`USING\` column |
| Verification | SQL Editor with service role | Anon-key client tests in CI, deploys block on failure |
| Tenant key in JWT | Mutable via \`updateUser()\` | Immutable, set in \`app_metadata\` after auth |
| Service-role usage | Sprinkled across edge functions | Confined to one server module, audited |

If you cannot answer "yes, we do the right column" for every row of this table, your Supabase project has at least one of the five bugs in this post live in production right now.

The audit itself takes 2-4 hours for a small project, 1-2 days for a 15-table multi-tenant schema. It is the cheapest line item in the [6-Week MVP Sprint](/en/services/6-week-mvp) and the first thing I run on any [founding-engineer rescue](/en/services/hire-founding-engineer-india) where Supabase is in the stack.`
    },
    {
      heading: 'When the Lovable Default Is Actually Fine',
      content: `Honest counter-position, because the production-bugs framing is not universal. Three cases where shipping with the Lovable / Bolt RLS default is genuinely OK:

**1. Single-user internal tools.** A founder building an admin dashboard for their own use, behind a fixed login, with no multi-tenant model and no public anon key in the bundle. The blast radius is one user. RLS is not load-bearing.

**2. Pre-launch prototypes with no real data.** A demo for an investor meeting where the database is seeded with fake data and the launch is a week away. Fix RLS before the first real user. Do not delay the demo to fix it.

**3. Apps where Postgres is not the tenant boundary.** Some Lovable templates put the tenant boundary at a different layer — a Stripe Connected Account, a Clerk org, a per-user database file. If the tenant_id never appears in your tables because each tenant has a separate database, RLS is not the right control point.

If you are in case 1 or 3, this post does not apply to you. If you are in case 2, run the audit before your first paying customer. If you are in any other case — multi-tenant SaaS, marketplace, social product, B2B tool — you are in the failure mode this post describes, and the audit pays for itself the first time it catches a real leak.

The pattern is the same one I keep seeing in [vibe-coded MVPs that hit production](/en/notes/vibe-coding-vs-hiring-developer-when-lovable-breaks): the AI builder ships the happy path. The senior engineer ships the threat model.`
    },
    {
      heading: 'The 5-Step Pre-Launch RLS Checklist',
      content: `Run this before your first paying user. If any step fails, do not ship until it is fixed.

1. **List every public table.** \`SELECT relname, relrowsecurity FROM pg_class WHERE relkind = 'r' AND relnamespace = 'public'::regnamespace;\` Confirm RLS is enabled on every table that holds user or tenant data.
2. **Audit every policy.** \`SELECT tablename, policyname, cmd, qual FROM pg_policies WHERE schemaname = 'public';\` Confirm every CRUD verb your code uses has a policy. Confirm no policy reads \`user_metadata\`. Confirm tenant-scoped tables share the same predicate.
3. **Index every RLS column.** For every column that appears in a \`USING\` clause, run \`\\d <table>\` and confirm a btree index exists.
4. **Run the anon-key test suite.** Sign in as user A, attempt to read / update / delete user B's rows. Every attempt must fail. Wire this into CI.
5. **Audit service-role usage.** Grep your codebase for \`SUPABASE_SERVICE_ROLE_KEY\`. Every use should be in a server function, never in the React bundle. Each call site should have a comment explaining why service role is required.

If you want a senior engineer to run this audit on your Supabase project — 4-8 hours of work, deliverable a written audit report plus a passing CI suite — that is exactly the scope of a [Founding Engineer rescue engagement](/en/services/hire-founding-engineer-india). If your stack is broader and you need an MVP rebuilt with security baked in from day one, that is the [6-Week MVP Sprint](/en/services/6-week-mvp).

The five bugs in this post will fire on every vibe-coded Supabase project at some point in its lifecycle. The only question is whether you fix them on a Wednesday afternoon during an audit, or on a Saturday night during an incident.`
    }
  ],
  cta: {
    text: 'Audit my Supabase RLS before launch',
    href: '/en/services/hire-founding-engineer-india',
  },
};
