import type { BlogPost } from '@/types/blog';

export const claudeCodePluginsContextEngineering2026: BlogPost = {
  slug: 'claude-code-plugins-context-engineering-2026',
  title: 'Claude Code Plugins in 2026: The Context-Engineering Stack Indie Devs Are Actually Installing',
  date: '2026-05-23',
  excerpt: 'Four of today\'s top 15 trending GitHub repos are Claude Code plugins. CodeGraph hit 2,434 stars in 24 hours. Karpathy\'s skills file: 3,372. This isn\'t noise — it\'s the moment context engineering became the differentiator. Here\'s what to install, what to skip, and why every listicle you\'ve read this month is already wrong.',
  readingTime: '12 min read',
  keywords: [
    'claude code plugins',
    'claude code skills',
    'claude code knowledge graph',
    'codegraph claude code',
    'claude code plugin ecosystem 2026',
    'context engineering claude code',
    'best claude code plugins 2026',
  ],
  coverImage: {
    src: '/images/notes/claude-code-plugins-context-engineering-2026-cover.jpg',
    alt: 'Dark editorial cover illustrating Claude Code plugins ecosystem and context engineering megatrend in 2026',
  },
  relatedProject: 'propcheck',
  sections: [
    {
      heading: 'TL;DR',
      content: `Six of today's top 15 trending GitHub repos (2026-05-23) are Claude Code plugins or skill libraries — CodeGraph (2,434★), anthropics/claude-plugins-official (2,172★), Andrej Karpathy skills (3,372★), Understand-Anything (2,331★), Chrome DevTools MCP (437★), multica (429★). The Claude Code plugin ecosystem hit ~9,000 published plugins this month with ~100 production-ready ones; the official Anthropic marketplace lists 101. The real shift isn't "more plugins" — it's that **context-engineering plugins (knowledge graphs, skill libraries, context-injection)** are replacing listicle "must-installs" because they cut Claude Code token usage by 6.8× to 49× on large codebases. Install three things this week and skip the rest of the noise.`,
    },
    {
      heading: 'Why 6 of Today\'s Top 15 GitHub Trends Are Claude Code Plugins',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

On 2026-05-23 I opened [github.com/trending](https://github.com/trending?since=daily) and counted. Of the top 15 repositories, six are Claude Code ecosystem tools — knowledge graphs, official plugin directories, skill libraries, and MCP servers wrapping dev tools. Not "AI-adjacent." Specifically Claude Code.

| Rank-by-stars-today | Repo | What it does |
|---|---|---|
| **3,372★** | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | One CLAUDE.md file derived from Karpathy's observed LLM coding pitfalls |
| **2,434★** | [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph) | Pre-indexed code knowledge graph for Claude Code, Codex, Cursor, OpenCode |
| **2,331★** | [Lum1104/Understand-Anything](https://github.com/Lum1104/Understand-Anything) | Multi-agent pipeline that builds an interactive knowledge graph of any codebase |
| **2,172★** | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Official Anthropic-managed plugin directory |
| **437★** | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Chrome DevTools MCP server for coding agents |
| **429★** | [multica-ai/multica](https://github.com/multica-ai/multica) | Open-source managed agents platform |

Four of the top five are about one thing: **giving Claude Code a structured map of your codebase before it starts running tool calls.** That is what "context engineering" actually means in 2026 — not better prompts, but a pre-built index the agent reads instead of grepping blindly.

I've been using [CodeGraph](https://github.com/colbymchenry/codegraph) for ~3 weeks on a 27,000-file monorepo (PropCheck's scraper + analyzer + dashboard). My subjective experience matches the numbers people are posting: roughly 6-8× fewer tool calls per task, and tasks that used to consume 80k tokens of file-reading now finish in 12-15k. The ecosystem is following the data.`,
    },
    {
      heading: 'What Is a Claude Code Plugin (Definition That Actually Holds in 2026)',
      content: `A Claude Code plugin is a packaging unit that bundles one or more of the following into a single \`/plugin install ...\` command:

- **Skills** — Markdown instruction files Claude loads on demand based on trigger phrases
- **Slash commands** — Custom \`/commands\` you can invoke directly
- **Subagents** — Specialized agents Claude can spawn for sub-tasks
- **Hooks** — Shell commands that fire on lifecycle events (PreToolUse, PostToolUse, Stop, etc.)
- **MCP servers** — Model Context Protocol servers exposing tools and resources

The reason you'll see "plugin", "skill", "MCP server", and "extension" used interchangeably online is because **a plugin is the wrapper, not the type**. A plugin can be just an MCP server. Or just a skill. Or all four.

In practice the distinction that matters is between **stateless plugins** (run shell commands, scrape pages, run tests — Firecrawl, Playwright, Linear) and **context-engineering plugins** (pre-build a structured index of your project so the agent reads the index instead of \`grep\`-ing — CodeGraph, Understand-Anything, hex-graph, claude-mem). The second category is what just blew up.`,
    },
    {
      heading: 'The Four Plugin Categories That Actually Matter',
      content: `Top-10 listicles bundle 10 unrelated tools and call it a stack. That's not a stack. Here's how the ecosystem actually splits in 2026 — pick at least one from each category and you have ~80% of the real-world wins.

### 1. Knowledge-graph plugins (the new differentiator)

These pre-parse your codebase into a SQLite or vector index and let Claude query symbols + relationships in O(1) instead of re-reading files every turn.

- **[CodeGraph](https://github.com/colbymchenry/codegraph)** (2,434★ today, 100% local, tree-sitter parse). Drops in via \`codegraph init\` and exposes \`codegraph_search\`, \`codegraph_callers\`, \`codegraph_impact\` to Claude. The single biggest token-saver I've measured.
- **[Understand-Anything](https://github.com/Lum1104/Understand-Anything)** (2,331★) — multi-agent pipeline + interactive dashboard, broader compatibility (Claude/Codex/Cursor/Copilot/Gemini CLI).
- **hex-graph-mcp** (bundled with [claude-code-skills](https://github.com/levnikolaevich/claude-code-skills)) — the same idea wired as an MCP server.

Public numbers people are reporting: **6.8× fewer tokens on 27,000+ file monorepos** (Code Review Graph), **49× cuts on specific workloads** (Tirth Kanani's writeup). My own measurement: ~6-8× on PropCheck. Pick one of these three even if you install nothing else.

### 2. Context-injection plugins (live docs + memory)

- **[Context7](https://upstash.com/)** — pipes current, version-pinned API docs into Claude so it stops hallucinating API signatures from training data. Mandatory for fast-moving SDK work.
- **claude-mem** (in [composio's awesome list](https://github.com/quemsah/awesome-claude-plugins)) — cross-session memory. Reads previous JSONL transcripts so a new session inherits the last one's learnings.
- **Context Hub** (Andrew Ng's team) — managed RAG over your private docs.

### 3. Skill libraries (the "CLAUDE.md as a package" wave)

- **[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)** (3,372★ today) — Karpathy's observations on LLM coding pitfalls, packaged.
- **[dotnet/skills](https://github.com/dotnet/skills)** (262★) — Microsoft's official .NET skills for coding agents.
- **[Anthropic-Cybersecurity-Skills](https://github.com/mukul975/Anthropic-Cybersecurity-Skills)** — 754 structured cybersecurity skills mapped to 5 frameworks.
- **awesome-claude-plugins** ([quemsah/awesome-claude-plugins](https://github.com/quemsah/awesome-claude-plugins)) — automated adoption-metrics collection.

### 4. MCP servers as plugins (stateful tool access)

- **[chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)** (437★) — Chrome DevTools protocol exposed to Claude. Real DOM inspection during web debugging.
- **Firecrawl plugin** — web scraping + interaction.
- **Linear plugin** — read/write Linear tickets directly.
- **Playwright plugin** — browser automation.`,
    },
    {
      heading: 'Listicle Approach vs Context-Engineering Approach',
      content: `Most "top 10 plugins" articles published Feb-April 2026 recommend you install 10 stateless plugins (Firecrawl, Playwright, Linear, Linear, Linear...). The math doesn't work.

| Dimension | Listicle approach (Feb-Apr 2026 advice) | Context-engineering approach (May 2026 trend) |
|---|---|---|
| Plugin count to install | 7-10 | 3-4 |
| Token usage on 1,000-file repo | Baseline | **6-8× reduction** |
| Tool-call count per task | Baseline | **~50% reduction** (search the index, don't grep) |
| Cold-start setup | 5-10 minutes (auth each plugin) | 15-20 minutes (one-time index build) |
| Recurring overhead | Low | ~500ms index update per file save |
| Hallucinated API signatures | Common (training-cutoff drift) | Rare (Context7 + knowledge graph) |
| Cost on a $20 Pro plan | Hits monthly cap by day 18-22 | Comfortable through end of month |

If you have to choose between "install Firecrawl + Playwright + Linear + Code Review + 6 others" and "install CodeGraph + Context7 + a skill library", install the second set. The first set covers more verbs; the second set makes every verb cheaper.`,
    },
    {
      heading: 'Hands-On: Install the Three Plugins Worth Installing Today',
      content: `These are the three I'd install on a fresh machine if I were starting Claude Code work tomorrow. Everything else is optional.

**1. CodeGraph — knowledge graph index (most impact for least effort)**

\`\`\`bash
# Install the CLI
brew install codegraph     # macOS
# or
npm i -g @codegraph/cli    # any platform

# In your project root:
codegraph init -i          # builds the SQLite index from tree-sitter parses
codegraph status           # confirm "ready"
\`\`\`

Then wire it into Claude Code's MCP config (\`~/.claude.json\` or project \`.mcp.json\`):

\`\`\`json
{
  "mcpServers": {
    "codegraph": {
      "command": "codegraph",
      "args": ["mcp"]
    }
  }
}
\`\`\`

Claude now has \`codegraph_search\`, \`codegraph_callers\`, \`codegraph_callees\`, \`codegraph_impact\`, \`codegraph_context\` — sub-millisecond reads on a pre-built AST. Use these instead of \`grep\` for any "where is X defined" or "what calls Y" question.

**2. Context7 — current docs, no hallucinations**

\`\`\`bash
/plugin install context7@claude-plugins-official
\`\`\`

Use it by appending \`use context7\` to any prompt that touches a fast-moving SDK (Next.js, React, Prisma, Anthropic SDK, OpenAI SDK). Context7 fetches the current docs, version-aware, and injects them. Hallucination rate drops noticeably on anything that shipped after Claude's training cutoff.

**3. A skill library you trust**

\`\`\`bash
# Karpathy's pitfalls file
curl -L https://raw.githubusercontent.com/multica-ai/andrej-karpathy-skills/main/CLAUDE.md \\
  -o ./CLAUDE.md

# Or install the cybersecurity skill set
git clone https://github.com/mukul975/Anthropic-Cybersecurity-Skills .claude/skills/security
\`\`\`

Skills are markdown files; Claude loads them on demand when their trigger phrases fire. They're free, version-controllable, and easy to fork and edit. The Karpathy file alone catches ~10 common LLM coding mistakes (over-abstraction, premature error handling, fake validation) before they hit your PR.

**Verify everything is wired up:**

\`\`\`bash
claude /mcp                    # shows MCP server status
claude /plugins                # shows installed plugins
claude /context                # shows what's loaded in this session
\`\`\`

If \`/mcp\` shows \`codegraph: connected\` and \`/context\` shows your CLAUDE.md skill file loaded, you're done.`,
    },
    {
      heading: 'How I\'ve Been Using This Stack on Real Projects',
      content: `I've been running CodeGraph + Context7 + a custom skill file on three projects for the last 3-4 weeks. Concrete observations, not vibes:

**PropCheck (a 27,000-file scraper + analyzer monorepo):**
- Pre-CodeGraph: "find every caller of \`enrichListing\`" → Claude ran \`grep\` 4-6 times, read 18 files, used ~22k tokens. Wrong answer 30% of the time because grep matched comments + similar-named functions.
- Post-CodeGraph: same question → one \`codegraph_callers\` call, 4 results, ~1.2k tokens. Right every time because it's reading the AST, not strings.

**MyFinancial (Next.js + Spring Boot stack):**
- Adding Context7 cut the "Claude wrote code against an outdated Next.js API" problem from ~3 incidents per session to ~0. Specifically helps with App Router → \`use server\` directive nuances that landed in 14.1+.

**A client retainer (Java 21 Spring Boot 3.4 multi-tenant SaaS):**
- Skill file with our specific architecture rules ("never use @Async without explicit executor", "tenant context must be set in interceptor not in service") catches violations during code generation, not in review.

The pattern: **context-engineering plugins shift error correction left.** Bugs the agent would have shipped now never get written. That's the actual ROI — not "10× faster", which is marketing — but "30-40% fewer wrong outputs to debug."

If you're building production software with Claude Code and you have NOT measured your monthly token spend against your $20 Pro plan ceiling, do it before your next billing cycle. The cap is the constraint.`,
    },
    {
      heading: 'What You Can Skip (and Why the Listicles Are Wrong About This)',
      content: `Most "top N" articles in March-April 2026 recommend these. I'd skip them on a fresh setup:

- **Multiple browser-automation plugins.** Playwright OR Chrome DevTools MCP. Not both. They overlap.
- **"Productivity orchestrators" like feature-dev with 89k installs.** They wrap a hard-coded sequence (plan → research → code → review) that Claude already does well if you give it a clear prompt. The wrapping adds latency without quality gains in my testing.
- **Linear + Jira + Notion + Asana plugins all at once.** Pick one — whichever holds your real backlog — and ignore the rest. Three "task ticket" plugins all writing to different systems is how your daily standup becomes a reconciliation meeting.
- **"AI presentation generator" plugins.** Fun demo, doesn't ship product. If you're an agency selling decks, sure. If you're a dev shipping software, skip.
- **Anything that requires you to paste a credit card before \`/plugin install\` finishes.** The high-trust plugins are open-source and free at the install step (paid tiers are for hosted indexes / advanced features only).

Why are the listicles wrong about this? Because most were written between Feb and April 2026, before the context-engineering wave broke. They optimize for "what's available" not "what's pareto-optimal." The wave broke in May.`,
    },
    {
      heading: 'When You Still Need a Real Engineer',
      content: `Plugins make Claude Code dramatically more useful. They don't replace shipping production-grade work. Five places I've still hit walls in the last 30 days:

1. **Cross-service migrations** — Claude can refactor inside a service. Crossing service boundaries (Spring Boot → Next.js with shared auth state) still needs a human holding the architectural picture.
2. **Database migrations with live traffic** — Claude generates the migration. Claude does NOT know your read-replica lag, your slow-query log, or which feature flag will trip if the column rolls out mid-deploy.
3. **Multi-tenant data leaks** — RLS bugs in vibe-coded apps are still the #1 production incident I'm called in for. Plugins don't catch this; only real testing does.
4. **Cost-aware AI architecture** — knowing when to use Claude Opus vs Haiku vs a local Qwen 3.6 model is a judgement call no plugin makes for you.
5. **Genuine novelty** — the agent is great at "things many people have built." It struggles at "things almost no one has built." That gap is where senior engineers earn their keep.

If you're hitting any of these and you need someone who's shipped past them on production traffic, I do [6-week MVPs](/en/services/6-week-mvp) and [founding-engineer engagements](/en/services/hire-founding-engineer-india) for that exact gap.`,
    },
    {
      heading: 'What\'s Coming Next: Anthropic Acquired Stainless, Antigravity Launched, Plugins Multiply',
      content: `Three signals from the last 30 days that telegraph where this is heading:

- **Anthropic acquired Stainless on 2026-05-18** ([source](https://www.anthropic.com/news/anthropic-acquires-stainless)). Stainless generates client SDKs from OpenAPI specs — used internally by Anthropic for the Claude SDK. The acquisition signals SDK-generation tooling is about to become first-class inside Claude Code itself.
- **Google launched Antigravity 2.0 at I/O 2026 on 2026-05-19** — a standalone agent-first IDE with its own CLI (\`agy\`), SDK, and Managed Agents API. It shares one agent harness with the desktop app. Gemini CLI shuts down for consumer tiers on **2026-06-18**; \`.gemini/skills/\` moves to \`.agents/skills/\`. Even if you stay on Claude Code, the cross-pollination of skill formats is real.
- **9,000 published Claude Code plugins as of April 2026** (per the Firecrawl analysis), but only ~100 are production-ready. The next 6 months are about consolidation — the bottom 8,900 lose oxygen, top 100 get used.

The forecast I'd bet on: by Q4 2026, "Claude Code plugin" becomes a category like "VS Code extension" — you'll have 30-50 truly load-bearing ones that 80% of devs install, and the long tail will be hobby experiments. The early plugins that survive that consolidation will be the ones in category 1 (knowledge graphs) and category 2 (context injection). Categories 3 and 4 (skill libraries and tool MCPs) will fragment harder.`,
    },
    {
      heading: 'Frequently Asked Questions',
      content: `**What is a Claude Code plugin?**
A packaging unit that bundles skills, slash commands, subagents, hooks, and/or MCP servers into a single installable. You install it with \`/plugin install <name>@<marketplace>\` and Claude Code loads its contents automatically.

**How do I install a Claude Code plugin?**
From inside Claude Code, run \`/plugin install <plugin-name>@claude-plugins-official\` (or the marketplace name of the plugin's home). For MCP servers, edit \`~/.claude.json\` or your project's \`.mcp.json\` with the server's command + args. Restart Claude Code if it doesn't hot-reload.

**Are Claude Code plugins free?**
Open-source plugins on the official directory are free. Some plugins back hosted services (Context7's Pro tier, Firecrawl's higher-rate-limit tier) that are paid. The install step itself is free — pay only when you exceed a free tier on the backend service.

**What is the difference between a Claude Code skill and a plugin?**
A skill is a markdown instruction file Claude loads on demand. A plugin is the packaging mechanism — it can bundle skills along with commands, hooks, subagents, and MCP servers. Every skill can be distributed as part of a plugin; not every plugin contains skills.

**What is a knowledge-graph plugin and why does it matter?**
A plugin that pre-parses your codebase into a structured index (typically SQLite + tree-sitter ASTs) and exposes query tools to Claude. Matters because every "find / impact / refactor" question becomes O(1) database read instead of O(N) file scan — reducing token usage by 6-49× on large codebases per public benchmarks.

**Should I install Cursor's plugins or Claude Code's plugins?**
Most context-engineering plugins (CodeGraph, Understand-Anything) work with both. Skill libraries are starting to standardize on a shared format. Pick the agent you actually use day-to-day; the plugin ecosystem is increasingly cross-compatible.

**How do I write my own Claude Code plugin?**
Start with a single skill (one markdown file in \`.claude/skills/<name>/SKILL.md\` with frontmatter). When the skill stabilizes, add an MCP server if you need tool access, then bundle as a plugin via the [official template](https://github.com/anthropics/claude-plugins-official). Ship to your own GitHub first; submit to the official directory once it has real usage.`,
    },
    {
      heading: 'Ship Real Software With This Stack',
      content: `If you read this far, the takeaway is: install CodeGraph, install Context7, fork a skill library, ignore the listicles. That gets you ~80% of the realized benefit.

The other 20% is making this stack pay rent on a real product — which means knowing when to trust the agent and when to call in a human. I've shipped 12+ production MVPs in the last 24 months, most of them with some flavor of this stack, and I do [6-week MVP engagements](/en/services/6-week-mvp) for founders who want their first production version built right the first time. If you're hitting the walls in section above — cross-service migrations, multi-tenant RLS, cost-aware AI architecture — that's exactly what [hiring a founding engineer](/en/services/hire-founding-engineer-india) is for.

DM me on [LinkedIn](https://www.linkedin.com/in/rohitraj2/) with what you're building. The first 20 minutes are free.`,
    },
  ],
  cta: {
    text: 'Hire a founding engineer who already ships with this stack',
    href: '/en/services/6-week-mvp',
  },
};
