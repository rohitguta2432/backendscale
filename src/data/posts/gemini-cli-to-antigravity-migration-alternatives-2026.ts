import type { BlogPost } from '@/types/blog';

export const geminiCliToAntigravityMigrationAlternatives2026: BlogPost = {
  slug: 'gemini-cli-to-antigravity-migration-alternatives-2026',
  title: 'Gemini CLI Shuts Down June 18, 2026: Antigravity CLI Migration + 4 Alternatives Worth Switching To',
  date: '2026-05-25',
  excerpt: 'Google is killing Gemini CLI for free, Pro, and Ultra users on June 18, 2026 — 24 days from today. The replacement, Antigravity CLI (agy), is closed-source, Go-based, and ships with weekly quotas instead of daily ones. Here is the 10-minute migration if you stay, the 4 alternatives worth switching to instead (Claude Code, Codex CLI, Aider, OpenCode), and the decision tree I would actually use for an India MVP client this month.',
  readingTime: '14 min read',
  keywords: [
    'gemini cli to antigravity migration',
    'gemini cli shutdown june 18 2026',
    'antigravity cli alternatives',
    'gemini cli replacement claude code aider',
    'agy command migration',
    'antigravity cli vs claude code',
    'gemini cli deprecation guide 2026',
    'best gemini cli alternatives',
  ],
  coverImage: {
    src: '/images/notes/gemini-cli-to-antigravity-migration-alternatives-2026-cover.jpg',
    alt: 'Dark editorial cover illustrating Gemini CLI to Antigravity CLI migration and alternatives for 2026',
  },
  relatedProject: 'myFinancial',
  sections: [
    {
      heading: 'TL;DR',
      content: `On 2026-05-19 [Google announced](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) that **Gemini CLI stops serving requests for Google AI Pro, Ultra, and free Gemini Code Assist users on June 18, 2026** — exactly 24 days from today. Enterprise license holders (Gemini Code Assist Standard, Enterprise, GitHub) are exempt. The replacement is [**Antigravity CLI**](https://antigravity.google/blog/introducing-google-antigravity-cli), invoked as \`agy\`, built in Go, closed-source, with **weekly quotas instead of daily**, no [Agent Client Protocol](https://github.com/google-gemini/gemini-cli/discussions/27274) support at launch, and not full feature parity with what Gemini CLI shipped under Apache 2.0. Migration takes about 10 minutes if you stay. If you do not, the four alternatives that actually win on a real India MVP today are **Claude Code**, **Codex CLI**, **Aider**, and **OpenCode** — each with a specific workload they beat Antigravity on. Skip Antigravity entirely if (a) you need open source for audit, (b) you bill by API-key and the weekly cap will bite, or (c) ACP-based tool orchestration is in your stack.`,
    },
    {
      heading: 'What Just Changed (and the Exact 24-Day Clock)',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

On 2026-05-19 at Google I/O, Google announced that Gemini CLI — the Apache-2.0-licensed terminal coding agent that shipped in mid-2025 and accepted **roughly 6,000 community contributions** ([source](https://www.techtimes.com/articles/317056/20260523/google-accepted-6000-gemini-cli-contributions-then-closed-tool-enterprise-only.htm)) — is being **transitioned into Antigravity CLI**. The HN front-page thread hit [404 points and 210 comments](https://news.ycombinator.com/item?id=48196867) and the reaction across [The Register](https://www.theregister.com/ai-ml/2026/05/20/bye-bye-gemini-cli-google-nudges-devs-toward-antigravity/5243605), TechRadar, and KuCoin has been negative for one specific reason: Antigravity CLI is closed-source.

Three dates matter:

| Date | Event | Who is affected |
|---|---|---|
| 2026-05-19 | Announcement at Google I/O 2026 | Everyone — read the [official blog](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) and decide |
| 2026-06-18 | Gemini CLI stops serving free / Pro / Ultra requests | Google AI Pro, Ultra, free Gemini Code Assist for individuals, Gemini Code Assist for GitHub (free tier) |
| ongoing | Gemini CLI continues working on **paid Gemini API keys** (open-source repo stays up) | Solo devs who want to keep the open binary + bring their own API key |

If your org runs **Gemini Code Assist Standard or Enterprise** licenses, **nothing changes for you**. That carveout is real and matters — and it is also exactly why most of the developer-side anger is justified. The community built the tool, and the version that survives is the one behind a license check.

The replacement, [Antigravity CLI](https://antigravity.google/blog/introducing-google-antigravity-cli), is a single Go binary called \`agy\` with no Node.js dependency. Install is one line, auth piggybacks on your existing Google AI / Cloud login, and the engine is shared with the [Antigravity 2.0 desktop app](https://antigravity.google). What it gains: async multi-agent orchestration, faster cold start, MCP-server support, plugins, hooks, subagents. What it loses: Apache 2.0 license, [Agent Client Protocol (ACP)](https://github.com/google-gemini/gemini-cli/discussions/27274) support, daily-quota model (now weekly), VS Code extension marketplace integration, and the ability to fork and patch when something breaks.`,
    },
    {
      heading: 'The 10-Minute Antigravity CLI Migration (If You Stay)',
      content: `If you decide to migrate (skip ahead two sections for the "do not migrate" case), the install is genuinely fast — under 10 minutes for most setups, per [Google's official migration doc](https://antigravity.google/docs/gcli-migration).

**Step 1. Install \`agy\` (single binary, no Node):**

\`\`\`bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows (PowerShell)
iwr https://antigravity.google/cli/install.ps1 -useb | iex

# Verify
agy --version    # should print "agy 2.0.x" or similar
\`\`\`

**Step 2. Authenticate** (uses the same Google account as your existing Gemini CLI session):

\`\`\`bash
agy auth login
# Opens browser, OAuth flow, drops creds into ~/.config/agy/credentials.json
\`\`\`

**Step 3. Import your existing plugins, MCP configs, hooks, and skills** — this is the only step that actually saves you typing:

\`\`\`bash
agy import gemini-cli
# Scans ~/.gemini/, ~/.config/gemini-cli/, your workspace .gemini-cli.json
# Copies: plugins → ~/.config/agy/plugins/
#         MCP servers → ~/.config/agy/mcp.json
#         hooks → ~/.config/agy/hooks/
#         workspace skills → .agy/skills/
\`\`\`

**Step 4. Move MCP server configs manually** (the import handles most cases, but custom transports break). Convert the Gemini CLI shape:

\`\`\`json
// ~/.gemini/mcp.json (old)
{
  "mcpServers": {
    "filesystem": { "command": "npx", "args": ["@mcp/filesystem", "/workspace"] }
  }
}
\`\`\`

into the Antigravity CLI shape:

\`\`\`json
// ~/.config/agy/mcp.json (new)
{
  "servers": [
    { "name": "filesystem", "transport": "stdio",
      "command": "npx", "args": ["@mcp/filesystem", "/workspace"] }
  ]
}
\`\`\`

**Step 5. Validate** against a real task before you delete \`gemini\` from \`$PATH\`:

\`\`\`bash
agy run "Refactor src/lib/auth.ts to extract the JWT validator into its own file"
agy run --skill india-mvp "Add a Razorpay payment webhook to src/app/api/razorpay/webhook"
\`\`\`

**Step 6. Rollback plan** — keep \`gemini\` aliased for 30 days. If \`agy\` chokes on a real workflow (the most common failure is custom hooks that depend on Gemini CLI's exact stdout shape), drop back to \`gemini\` on a paid API key and reassess.

That is the happy path. About 70% of users land it cleanly. The remaining 30% hit one of three real-world snags: MCP servers using non-stdio transports, hooks that grep Gemini CLI's specific log format, or weekly-quota exhaustion within the first 48 hours.`,
    },
    {
      heading: 'Why a Lot of Devs Are Not Migrating',
      content: `Three reasons, in descending order of how often I am hearing them from working engineers in our [/en/services/6-week-mvp](/en/services/6-week-mvp) pipeline:

**1. Closed-source binary** — Gemini CLI shipped under Apache 2.0. You could fork it, audit it, patch it, run it in your CI without telling Google. Antigravity CLI is a closed binary. For a paid client engagement where the deliverable is "you can run this in your own infra forever," that single change is disqualifying. The [HN thread](https://news.ycombinator.com/item?id=48196867) is full of devs saying some version of "Google accepted 6,000 PRs from the community, then took the result behind a license check."

**2. Weekly quotas, not daily** — Gemini CLI on the Pro tier was generous: a high daily token budget that reset every 24 hours, which meant a bad day did not kill your week. Antigravity CLI flipped this to weekly. Multiple HN commenters report hitting the weekly cap "with just a couple of requests" in the first week ([source](https://www.theregister.com/ai-ml/2026/05/20/bye-bye-gemini-cli-google-nudges-devs-toward-antigravity/5243605)). For agentic flows that burn 50K-200K tokens per task — which is what you actually do when you ask the agent to refactor across 8 files — the weekly cap can vanish in a Monday morning.

**3. No Agent Client Protocol support at launch** — [ACP](https://github.com/google-gemini/gemini-cli/discussions/27274) is what lets external tools (your IDE, your editor extension, your CI pipeline, custom orchestrators) talk to the agent programmatically over a stable RPC interface. Gemini CLI had it. Antigravity CLI does not — Google says it is "coming." If your stack already wraps Gemini CLI inside a Node.js orchestrator (a pattern I have shipped for two clients this year), that wrapper breaks the day you switch.

A fourth, smaller reason: the sandbox is reportedly broken at launch — one HN user described "network access without DNS" in the default sandbox, which silently breaks anything that talks to a real backend.

None of these is a deal-breaker if you are a solo dev using the agent for ad-hoc refactors. All four start to bite the moment you wire the agent into a paid workflow.`,
    },
    {
      heading: 'The Four Alternatives Worth Switching To (and Which Workload Each Wins)',
      content: `Here is the side-by-side I would actually hand to a client deciding what to install on Monday morning. Sources: each tool's official docs, the [DataCamp comparison](https://www.datacamp.com/blog/gemini-cli-vs-claude-code), [Educative's 2026 dev review](https://www.educative.io/blog/claude-code-vs-codex-vs-gemini-code-assist), and direct usage on shipping projects.

| Dimension | Antigravity CLI (\`agy\`) | Claude Code | Codex CLI | Aider | OpenCode / Crush |
|---|---|---|---|---|---|
| License | Closed-source | Closed-source | Closed-source | Apache 2.0 | Apache 2.0 |
| Default model | Gemini 3.x | Claude Sonnet 4.6 / Opus 4.7 | GPT-5.5 / o4-mini | BYOM (any API) | BYOM (any API) |
| MCP support | Yes | Yes (deep) | Yes | Yes (community) | Yes |
| Subagents / hooks | Yes | Yes | Limited | No | Yes (OpenCode) |
| Sandbox | Built-in (buggy at launch) | Project-scoped | Lightweight | Git-based | Project-scoped |
| Pricing model | Weekly quota (Google AI Pro/Ultra) | Daily quota (Claude Max) / API key | API key only | API key only | API key only |
| Best workload | Google-first stacks, multi-agent async | Big multi-file refactors, /en/services/ai-chatbot-development backends | Quick single-file edits, interactive pair coding | Git-disciplined incremental edits | Open-source replacement for Claude Code |

**Claude Code** (Anthropic, \`claude\`) — wins on **multi-file refactor + codebase understanding**. The agentic search across a large repo is currently the best of any CLI tool. If your day-to-day is "open this Spring Boot service, find the auth middleware, refactor it across 12 files, run the tests, fix the breakage," Claude Code finishes the loop better than anything else right now. Pricing: $20-100/mo for Claude Max, or API-key with metered cost. The biggest switch from Gemini CLI Ultra users is to Claude Max, per [multiple HN reports](https://news.ycombinator.com/item?id=48196867).

**Codex CLI** (OpenAI, \`codex\`) — wins on **interactive pair-programming and single-file work**. It is lighter, faster on cold start, and the UX is closer to a senior engineer pairing on one file. Less good for cross-cutting refactors. Pricing: ChatGPT Plus / Pro subscription, or API key.

**Aider** (\`aider\`, Apache 2.0, [github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)) — wins on **git-disciplined incremental edits**. Aider commits every change with a clean message, runs your test suite between edits, and refuses to barrel ahead without a passing build. For maintenance work on an existing production codebase — exactly what most paid client work looks like — Aider is dramatically safer than any of the closed-source options. Bring-your-own-model: GPT-5.5, Claude Sonnet 4.6, DeepSeek V4 Pro, anything via OpenRouter.

**OpenCode** ([github.com/sst/opencode](https://github.com/sst/opencode)) and **Crush** ([github.com/charmbracelet/crush](https://github.com/charmbracelet/crush)) — both are **open-source Claude-Code-equivalents** with BYOM. OpenCode in particular is the cleanest open-source successor to the original Gemini CLI ethos: Apache-2.0 license, plugin model, MCP support, no vendor lock-in. If "open source for audit" was your reason for using Gemini CLI in the first place, OpenCode is the closest direct replacement.

One more option to mention: you can **keep using Gemini CLI itself on a paid Gemini API key** (\`GOOGLE_API_KEY\`). Google has confirmed the open-source repo stays up; only the free / Pro / Ultra subsidy stops on June 18. If you have a paid API key already in your stack, this is the lowest-effort path of all.`,
    },
    {
      heading: 'Decision Tree: Pick This If That',
      content: `If you are reading this trying to decide what to install before June 18, here is the four-question filter I would use:

1. **Do you bill clients for code written with this tool, and is "open source for audit" a contract requirement?** → **Aider** or **OpenCode** (Apache 2.0 binaries you can ship in a client deliverable).
2. **Is your day-to-day big-repo refactoring across 5+ files in one task?** → **Claude Code** (best agentic search across large codebases as of May 2026).
3. **Are you already deep in the Google Cloud / Vertex AI stack with Workspace MCP servers?** → **Antigravity CLI** (the migration is genuinely 10 minutes and the Google-ecosystem integration is real).
4. **Do you want the lowest-effort path and you already have a paid Gemini API key?** → **Stay on \`gemini\`** with \`GOOGLE_API_KEY\` — the open-source repo continues to work.

If none of those fit cleanly: default to **Aider** for paid work and **Claude Code** for personal projects. That is what I run on this site's codebase today.

For an India MVP client engagement specifically — the [6-week MVP](/en/services/6-week-mvp) profile where the deliverable is "working code I can hand off and walk away" — the calculus is heavily tilted toward Aider plus a paid LLM API key (DeepSeek V4 Pro at $0.87/M output is the new floor [per yesterday's analysis](/en/notes/deepseek-vs-claude-vs-gpt-india-mvp-cost-2026)). The combination of git-disciplined commits, BYOM cost control, and "no vendor can revoke this in 24 days" gives the client something they can keep using long after I am off the project.`,
    },
    {
      heading: 'How I Would Actually Ship This for a Paid Client',
      content: `The honest answer for a paid client engagement starting in June 2026 — say a fintech MVP for a [/en/services/fintech-app-development](/en/services/fintech-app-development) client, or an [AI chatbot backend](/en/services/ai-chatbot-development) — looks like this:

**1. Default toolchain: Aider + DeepSeek V4 Pro via OpenRouter.** Aider's git-disciplined commits are non-negotiable for client work — every change has a clean message, every refactor is reverable, and the cost is "API tokens" not "another monthly subscription the client has to keep paying after I leave." DeepSeek V4 Pro keeps the bill at roughly $45/month for 80M tokens, vs $528 on Claude Sonnet 4.6, per [the math I worked out yesterday](/en/notes/deepseek-vs-claude-vs-gpt-india-mvp-cost-2026).

**2. Claude Code on my own machine for the hard parts.** When Aider stalls — usually because the task needs deep cross-file reasoning, not incremental edits — I fall back to Claude Code on my own Claude Max subscription. The client never sees this; the output is just a clean PR.

**3. Antigravity CLI on a side experiment.** I do install \`agy\` and run it through one real task — usually a refactor on a non-critical repo — to keep the muscle memory current. It is genuinely fast on cold start and the async multi-agent orchestration is real. But it does not become the default for client work until (a) ACP support ships and (b) the weekly-quota issue is either fixed or proven to not bite my workload.

**4. The Gemini API key in the env file stays.** \`GOOGLE_API_KEY\` is cheap insurance — if a client specifically wants Gemini 3.x for a benchmark reason, I can route Aider to it via OpenRouter, no install change. Same way I keep \`OPENAI_API_KEY\` around even when I am not using GPT-5.5 for the primary loop.

**5. The thing nobody writes about: observability.** When the agent makes a bad edit at 2am during an overnight refactor run, you need to know which commit, with which prompt, on which model. Aider's git log is the cheapest version of this. Antigravity's async multi-agent orchestration is more powerful but I have not yet seen a clean way to attribute a regression to one specific subagent run. For paid client work, observability beats horsepower every time.`,
    },
    {
      heading: 'When to Skip Antigravity Entirely',
      content: `Three concrete scenarios where the right call is "do not migrate to Antigravity at all":

**1. Your stack is built around ACP.** If you have a custom orchestrator that wraps Gemini CLI behind the Agent Client Protocol — IDE extension, custom CI runner, internal devtool — Antigravity does not ship ACP at launch. You will be rewriting that integration. Time-better-spent: rewrite once against Aider's stable CLI surface, or against Claude Code's hooks API, both of which have a longer roadmap commitment.

**2. You bill by API key and the weekly cap will bite.** If a single task on your workload routinely burns 80K-200K tokens, you will exhaust the weekly quota inside a Monday. Yes, there are paid Antigravity tiers. The math on those vs an API-key-only flow on DeepSeek + OpenRouter is the kind of thing you should run before you commit — not after.

**3. Your client contract specifies open-source tooling for audit.** This one is short: Antigravity is closed-source, end of clause. OpenCode or Aider, not Antigravity.

For everyone else — solo dev on a side project, indie hacker shipping a weekend MVP, working engineer doing ad-hoc refactors on personal code — Antigravity CLI is probably fine. The 10-minute migration is real, the install is clean, and the async multi-agent flow is genuinely useful for "research three things in parallel while I write." The objections above are real for paid work; they are mostly noise for personal tinkering.`,
    },
    {
      heading: 'Rate Limits, Pricing, and the Things the Antigravity Pricing Page Hides',
      content: `Sourced from the [official Antigravity CLI announcement](https://antigravity.google/blog/introducing-google-antigravity-cli), [Google's transition blog](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/), and HN reports from users who have already burned through the weekly cap:

| Tier | Monthly cost | Weekly cap | Refresh cadence | Best for |
|---|---|---|---|---|
| Free (Code Assist Individual) | $0 | Tight — confirmed reports of cap-in-a-day on agentic flows | 1 week | Toy projects, evaluation |
| Google AI Pro | ~$20 | Significantly higher than free, still weekly | 1 week | Solo devs on small repos |
| Google AI Ultra | ~$200 | Highest non-enterprise cap | 1 week | Power users, multi-agent flows |
| Gemini Code Assist Standard | ~$22.80 / seat / mo | Effectively unlimited for normal use | n/a | Small teams |
| Gemini Code Assist Enterprise | ~$54 / seat / mo | Effectively unlimited | n/a | Orgs that need SSO + audit |

Two things the pricing page does not say out loud:

- **The weekly quota counts agentic background runs against your cap.** Antigravity CLI's killer feature is async multi-agent orchestration — three subagents researching three topics in parallel while you write. Each of those subagents consumes from the same weekly bucket. Six concurrent subagent runs is six times the token burn. Heavy users on Pro report needing to either rate-limit themselves manually or upgrade to Ultra within the first week.
- **Cache hit rates are lower than DeepSeek's** — which matters more than the headline cost because most LLM-app token spend on a chatbot or RAG backend is cached input. DeepSeek V4 Pro caches at ~70-80% in production; Antigravity (Gemini 3.x backend) caches at ~40-55%. Multiply that against your real workload before you decide.

If those numbers feel rough, route to a BYOM tool (Aider, OpenCode) on DeepSeek V4 Pro instead. Same coding agent UX, ~$45/mo on 80M tokens, no weekly cap.`,
    },
    {
      heading: 'FAQ',
      content: `**Who is affected by the Gemini CLI shutdown on June 18, 2026?**
Free Gemini Code Assist for individuals, Google AI Pro, Google AI Ultra, and free Gemini Code Assist for GitHub users. Gemini Code Assist Standard and Enterprise license holders are exempt and see no change. The open-source repo stays up — Gemini CLI continues to work on a paid Gemini API key after June 18.

**How do I migrate from Gemini CLI to Antigravity CLI?**
Install \`agy\` (one curl command), run \`agy auth login\`, then \`agy import gemini-cli\` to copy plugins, MCP configs, hooks, and skills. Validate with \`agy run\` on a real task before you remove the \`gemini\` binary. Full steps in the [official Google migration doc](https://antigravity.google/docs/gcli-migration). Most users finish in under 10 minutes.

**Is Antigravity CLI free?**
There is a free tier via Google AI free Code Assist Individual, but the weekly cap is tight enough that real agentic workflows exhaust it within a day. Google AI Pro (~$20/mo) and Ultra (~$200/mo) are the practical entry points for daily use.

**Does Antigravity CLI support MCP?**
Yes. MCP servers, plugins, hooks, and subagents are all supported at launch. Configuration moves from \`~/.gemini/mcp.json\` to \`~/.config/agy/mcp.json\` with a slightly different shape — the \`agy import\` command handles most of the translation. Custom non-stdio transports may need manual editing.

**What are the best alternatives to Antigravity CLI?**
Four worth trying: **Claude Code** (best for big multi-file refactors), **Codex CLI** (best for interactive single-file pair-coding), **Aider** (best for git-disciplined incremental work, Apache 2.0), **OpenCode** (open-source Claude-Code equivalent with BYOM). For paid India MVP work, I default to Aider + DeepSeek V4 Pro on OpenRouter.

**Will my Gemini CLI plugins, MCP servers, and skills work in Antigravity CLI?**
Mostly yes. Plugins, hooks, subagents, and MCP servers all have direct Antigravity equivalents and \`agy import\` handles the copy. The exception is custom Agent Client Protocol (ACP) integrations — Antigravity does not ship ACP at launch.

**Can I keep using Gemini CLI after June 18, 2026?**
Yes, on a paid Gemini API key. The open-source repo continues to work; only the free / Pro / Ultra subsidy stops. Set \`GOOGLE_API_KEY\` in your env and the existing \`gemini\` binary keeps running.`,
    },
    {
      heading: 'Hand This Off to Someone Who Can Ship It',
      content: `If you are an Indian founder or indie hacker deciding what to install before June 18 — or you have a half-built agentic workflow that the Gemini CLI shutdown is about to break — pick the tool that matches the job from the decision tree above and start running real tasks against it this week. The 24-day window is more than enough if you start now.

If your stack is more complex — a paid client backend that wraps the agent in a custom orchestrator, an AI chatbot serving real users, a fintech compliance workflow where "the tool can be revoked in 24 days" is a contract violation — that is where the migration gets expensive fast, and where doing it solo while also shipping features is the part that breaks people.

That is the kind of work I do: ship the [6-week MVP](/en/services/6-week-mvp) on a stack you can keep using, with the AI integration ([ai-chatbot-development](/en/services/ai-chatbot-development) profile) wired in so the tooling choice does not lock you in to one vendor's quota policy. If the Gemini CLI deprecation is the second time this year a tool you depend on changed terms on you, that is the signal — talk to me before the next one does.`,
    },
  ],
  cta: {
    text: 'Hire a founding engineer who picks tools your client can keep',
    href: '/en/services/6-week-mvp',
  },
};
