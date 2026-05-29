import type { BlogPost } from '@/types/blog';

export const aiGeneratedCodeAntiPatternsFixes2026: BlogPost = {
  slug: 'ai-generated-code-anti-patterns-fixes-2026',
  title: 'AI-Generated Code Anti-Patterns: 9 Production Bugs Hiding in Vibe-Coded Apps (2026)',
  date: '2026-05-29',
  excerpt: 'AI coding agents produce roughly 1.7x more issues than human-written code (CodeRabbit, Dec 2025), and AI-generated code drove 35 new CVEs in March 2026 alone. Here are the 9 anti-patterns I catch reviewing vibe-coded MVPs — phantom validation, optimistic auth, IDOR, race conditions, retry storms, God components — with the before/after fix for each and a checklist to catch them before they ship.',
  readingTime: '12 min read',
  keywords: [
    'ai generated code anti-patterns',
    'common bugs in ai generated code',
    'vibe coding tech debt',
    'how to review ai generated code',
    'ai code review checklist 2026',
    'ai coding agent bugs',
    'vibe coded app production bugs',
  ],
  coverImage: {
    src: '/images/notes/ai-generated-code-anti-patterns-fixes-2026-cover.jpg',
    alt: 'Cracked circuit board trace with one glowing fault line illustrating AI-generated code anti-patterns',
  },
  relatedProject: 'myFinancial',
  sections: [
    {
      heading: 'TL;DR',
      content: `AI coding agents (Cursor, Claude Code, Lovable, Bolt, Copilot) ship code fast but optimize for the happy path, so the same anti-patterns recur in nearly every vibe-coded app. **CodeRabbit's December 2025 analysis found AI-generated code produces ~1.7x more issues than human-written code (2.74x for XSS), and Infosecurity Magazine traced 35 CVEs in March 2026 to AI-generated code — up from 6 in January.** The 9 worst: phantom validation, optimistic auth, IDOR, race conditions, connection-pool exhaustion, retry storms, God components, orphan migrations, console.log observability. Each is fixable in minutes once you know its shape — skip the full review only for throwaway prototypes and internal tools under ~100 users.`,
    },
    {
      heading: 'AI-Generated Code Anti-Patterns: The 9 Bugs Hiding in Vibe-Coded Apps',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

AI coding agents have changed what one founder can ship in a weekend. Cursor + Claude, Lovable, Bolt, v0, Replit Agent, GitHub Copilot — all of them now generate 70% of a working MVP from a prompt. That part is genuinely extraordinary, and this post is not "AI builders are bad." They are not.

The point is narrower and more useful: AI-generated code fails in *predictable* ways. The generation models are trained on public code that is heavy on tutorials, demos, and happy-path snippets, and light on the boring production scaffolding — input validation, authorization checks, idempotency, connection lifecycle, migrations. So the model reproduces that distribution. It writes the part that demos well and silently omits the part that survives 500 users.

I review and rescue vibe-coded MVPs as part of my work, and after enough of them you stop seeing unique bugs and start seeing the same nine shapes over and over. This post names all nine, shows the before/after fix for the worst of them, gives you a comparison of how to actually catch them, and ends with the exact checklist I run on a fresh AI-generated codebase. Read the [Lovable production-bugs playbook](/en/notes/lovable-app-production-bugs-need-real-engineer-2026) next if you want the rescue-cost breakdown.`,
    },
    {
      heading: 'Why does AI-generated code have more bugs than human-written code?',
      content: `It is not that the code "looks" worse. It usually looks *better* — clean naming, consistent formatting, plausible structure. The bugs are in what is missing, which is exactly what code review and static analysis are bad at spotting quickly.

The data backs this up. **CodeRabbit's December 2025 analysis put AI-generated code at ~1.7x the issue rate of human-written code overall, and 2.74x specifically for cross-site scripting.** On the security side, **Infosecurity Magazine reported 35 CVEs in March 2026 attributed directly to AI-generated code — up from 6 in January and 15 in February**, a tripling inside one quarter as agent adoption climbed.

The academic picture agrees. The 2026 survey [*A Survey of Bugs in AI-Generated Code*](https://arxiv.org/abs/2512.05239) (Gao, Tahir, Liang, Susnjak, Khomh — Massey University, Wuhan University, Polytechnique Montréal) reviewed **94 studies** and built an 8-category bug taxonomy spanning functional, reliability, security, and hallucination bugs. It notes that **around 40% of GitHub Copilot-generated code in prior research contained vulnerabilities**, and that 61% of the studies focused on Python — meaning the typed-language failure modes below are still under-studied and under-caught.

The meta-cause behind every pattern in this post is the same: **the model optimizes for the happy path because that is what the prompt asks for and what the training data rewards.** "Build me an auth flow" produces signup + login. It does not produce "an auth flow that survives six months of users abusing it." That gap is the whole job.`,
    },
    {
      heading: 'Anti-patterns 1-3: The security holes that get you breached',
      content: `**1. Phantom Validation.** The single most common anti-pattern in typed codebases: types and interfaces everywhere, zero runtime checks on the actual request. TypeScript types vanish at compile time, so a type cast on \`req.body\` validates nothing.

\`\`\`ts
// What the agent generates — types as if they were validation
interface CreateUserBody { email: string; age: number; }
app.post('/users', (req, res) => {
  const body = req.body as CreateUserBody; // cast = zero runtime guarantee
  db.users.insert(body);                   // age: "drop table", email: null — all accepted
});

// The fix — validate at the trust boundary with a schema
import { z } from 'zod';
const CreateUser = z.object({
  email: z.string().email(),
  age: z.number().int().min(13).max(120),
});
app.post('/users', (req, res) => {
  const parsed = CreateUser.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  db.users.insert(parsed.data); // now typed AND validated
});
\`\`\`

This is the exact pattern I enforce on [myFinancial](/en/projects) — every API boundary parses with Zod before anything touches the database. Catching one bad-input bug pays for the whole habit.

**2. Optimistic Auth.** The agent adds an auth middleware to the routes that existed when you wrote the prompt — then every *new* route you ask it to add later quietly ships without the guard. The login page is protected; the \`/admin/export\` endpoint you added three prompts later is wide open. Fix: default-deny at the router level, then explicitly allow public routes, so a forgotten guard fails closed instead of open.

**3. IDOR / Flat Auth.** The most dangerous because it passes every test. The handler authenticates the user, then trusts a user-supplied id for authorization:

\`\`\`ts
// Authenticated but not authorized — any logged-in user reads any invoice
app.get('/invoices/:id', requireLogin, (req, res) => {
  res.json(db.invoices.find(req.params.id)); // whose invoice? nobody checks
});
// Fix: scope every fetch to the verified identity, never the URL param
app.get('/invoices/:id', requireLogin, (req, res) => {
  const inv = db.invoices.findOne({ id: req.params.id, ownerId: req.user.id });
  if (!inv) return res.status(404).end(); // 404, not 403 — don't leak existence
  res.json(inv);
});
\`\`\`

This is the same class of hole that shows up as RLS misconfiguration on Supabase stacks — see [the Supabase RLS leak post](/en/notes/supabase-rls-production-bugs-need-real-engineer-2026) for the Postgres-policy version of the exact same bug.`,
    },
    {
      heading: 'Anti-patterns 4-6: The reliability time bombs that crash you at scale',
      content: `These never fire at user 10. They fire at user 500, usually on a Saturday night, because they only appear under concurrency and load — conditions that no single-user prompt test ever reproduces.

**4. The Race Condition.** The agent writes check-then-act logic that is correct single-threaded and broken under concurrent requests:

\`\`\`ts
// Two requests pass the check before either inserts — duplicate signups
const existing = await db.users.findOne({ email });
if (existing) throw new Error('exists');
await db.users.insert({ email }); // race window between read and write

// Fix: let the database enforce uniqueness; handle the conflict
// UNIQUE constraint on email, then:
await db.users.insert({ email }).onConflict('email').ignore();
\`\`\`

**5. Connection Pool Exhaustion.** The agent forgets to release connections on the error path. The happy path returns the connection to the pool; a thrown error leaks it. After enough errors the pool is empty and the whole app hangs waiting forever. Fix: acquire/release in a \`try/finally\`, or use a wrapper that guarantees release. This is the runtime cousin of the "Missing Middle" anti-pattern — errors that are caught but never categorized or cleaned up.

**6. The Retry Storm.** The agent adds retries with no backoff and no jitter. When a downstream service slows down, every client retries immediately and in sync, amplifying load on the already-struggling service until it falls over completely — and for payment calls, risking duplicate charges. Fix: exponential backoff with jitter, a retry cap, and idempotency keys on anything that mutates money. The closely related **Cache Stampede** (every request misses an expired cache key at once and hammers the database with identical queries) has the same fix shape: single-flight the recompute, stagger the TTLs.`,
    },
    {
      heading: 'Anti-patterns 7-9: The maintainability tax on every future change',
      content: `These do not crash anything. They quietly make every future change slower and riskier — which is worse, because they compound.

**7. God Components / Monolithic Functions.** Describe a feature in one prompt and the agent generates it in one function. The result is the 400-line React component or 300-line API handler that fetches data, transforms it, manages state, handles errors, and renders UI all in one place. It works. It is also impossible to test in isolation, impossible to reuse, and a merge-conflict magnet. Fix: split along the seams the agent ignored — data fetching into a hook, transformation into a pure function, rendering into presentational components.

**8. Orphan Migrations.** The agent changes the schema in code (a new column, a renamed field) but never generates the migration file — or worse, generates a destructive \`DROP + ADD\` instead of an \`ALTER\`. At user 10 you reseed and move on. At user 500 you lose a production column. Fix: schema changes go through a real migration framework (Prisma Migrate, Flyway, Supabase migrations), tested on a staging clone of production data, with a rollback script written before the migration runs.

**9. Console.log Observability.** The agent's idea of monitoring is \`console.log\` statements and weak test assertions (the "Assertion Mirage" — tests that assert \`expect(result).toBeDefined()\` and call it covered). When something breaks in production you have no structured logs, no traces, no alerts, and a test suite that is green but proves nothing. Fix: structured logging with request IDs, error tracking (Sentry), and at least one assertion per test that would actually fail if the logic regressed.`,
    },
    {
      heading: 'How do you actually catch these? Manual review vs AI linter vs review gate',
      content: `No single tool catches all nine. The static anti-patterns (1, 2, 3, 7, 9) are visible by reading the diff; the reliability bugs (4, 5, 6) only show up under load testing or careful concurrency reasoning. Here is how the realistic options compare:

| Approach | Catches static anti-patterns | Catches runtime bugs | Cost | Best for |
|---|---|---|---|---|
| Nothing ("accept-without-read") | No | No | $0 now, $9-17K rescue later | Throwaway prototypes only |
| ESLint + type-check + Zod at boundaries | Partial (validation, some style) | No | Free, ~1 day setup | Every project — table stakes |
| AI review gate (CodeRabbit-style / [VibeGuard](https://arxiv.org/abs/2604.01052)) | Most | Some (flags missing auth, secrets) | $15-50/dev/month | Teams shipping daily |
| Senior-engineer review | All (with effort) | Yes (concurrency reasoning) | Highest per-hour | Money, auth, data-loss paths |

The "accept-without-read" pattern — engineer requests a fix, agent produces a 50-line diff, engineer skims the summary and accepts, nobody reads it — is the highest-severity meta-pattern, because it disables every other layer. An AI review gate is the best dollar-for-dollar defense for solo founders: it is cheap, runs on every PR, and reliably flags missing validation, hardcoded secrets ("Secret Sprinkle"), and unguarded routes. It will *not* catch a race condition or a retry storm — those still need a human who can reason about concurrency.`,
    },
    {
      heading: 'How I review AI-generated code: the 9-point checklist',
      content: `This is the pass I run on a fresh vibe-coded codebase before it goes anywhere near paying users. It maps one-to-one to the nine anti-patterns and takes about half a day on a typical MVP:

1. **Validation** — grep every route handler for \`req.body\` / \`req.query\` used without a schema parse. Add Zod (or equivalent) at every trust boundary.
2. **Auth coverage** — list every route, confirm each is default-deny. Find the routes added "later" that skipped the middleware.
3. **Authorization** — every fetch-by-id must be scoped to the verified user, not the URL param. This is where the IDOR holes hide.
4. **Concurrency** — find every check-then-act block (read, branch, write). Replace with a DB constraint or a transaction.
5. **Resource lifecycle** — confirm connections, file handles, and listeners are released in \`finally\`, not just on success.
6. **Retries & idempotency** — backoff + jitter + caps on retries; idempotency keys on anything touching money.
7. **Function size** — flag any function or component over ~150 lines; split along data / logic / view seams.
8. **Migrations** — confirm every schema change has a non-destructive, tested, reversible migration file.
9. **Observability** — structured logs with request IDs, error tracking wired up, and at least one *meaningful* assertion per test.

If you are running a vibe-coded app in production and have not done this pass, points 1, 2, 3, and 8 are the highest priority — they are the ones that leak data or lose it. The rest cost you velocity; those four cost you customers. The [vibe-coding-vs-hiring decision post](/en/notes/vibe-coding-vs-hiring-developer-when-lovable-breaks) covers when this review work is worth doing in-house versus contracting out.`,
    },
    {
      heading: 'When is vibe-coded code actually safe to ship?',
      content: `Plenty of the time — and it would be dishonest to pretend otherwise. The nine anti-patterns matter in proportion to blast radius, not as absolute rules.

**Ship it without the full review when:** it is a throwaway prototype or demo; an internal tool used by people you trust; a landing page or marketing site with no auth and no user data; or an early product with under ~100 users where you can tolerate a bug and a quick fix. In these cases the speed of AI generation is pure upside, and a full security review is over-engineering. Use the free table-stakes layer (ESLint + types + Zod at boundaries) and move on.

**Do the full review — or hire someone who can — when:** real user data is involved (PII, anything regulated); money moves through the app (payments, payouts, credits); you have B2B customers with security questionnaires; or a data leak would end the company. The math is simple: a planned half-day review is cheap insurance; an emergency rescue after a Saturday-night IDOR leak runs $9-17K and a reputation hit, as I broke down in the [Lovable rescue-cost post](/en/notes/lovable-app-production-bugs-need-real-engineer-2026).

AI coding agents are the best leverage a solo founder has ever had. Treat their output the way you would treat a fast, brilliant, slightly careless junior engineer: ship the low-stakes work freely, and read every line that touches auth, money, or data.

Need a second set of eyes on an AI-generated codebase before it hits real users? [I run fixed-scope MVP builds and rescue audits in 6 weeks](/en/services/6-week-mvp), or you can [hire a founding engineer in India](/en/services/hire-founding-engineer-india) to own the review pass and the production hardening ongoing.`,
    },
  ],
  cta: {
    text: 'Book an AI-Code Review Audit',
    href: '/en/services/6-week-mvp',
  },
};
