import type { BlogPost } from '@/types/blog';

export const aiJobSearchAgentClaudeCodeGuide2026: BlogPost = {
  slug: 'ai-job-search-agent-claude-code-guide-2026',
  title:
    'AI Job-Search Agent on Claude Code: Inside the 15k-Star ai-job-search Framework (2026)',
  date: '2026-07-09',
  excerpt:
    "ai-job-search crossed 15,000 GitHub stars — 5,000+ in one day — as one of 2026's fastest-growing Claude Code workflows. It's not an app; it's a fork-and-fill framework that turns the Claude Code CLI into a job-hunting agent. Here's the architecture, the drafter-reviewer loop that makes it work, and the honest failure modes of auto-apply from someone who runs an outreach agent daily.",
  readingTime: '9 min read',
  keywords: [
    'ai job search agent claude code',
    'ai-job-search github',
    'build an agent on claude code',
    'claude code job application framework',
    'drafter reviewer agent pattern',
    'ai cover letter cv tailoring open source',
    'claude code as agent runtime 2026',
  ],
  coverImage: {
    src: '/images/notes/ai-job-search-agent-claude-code-guide-2026-cover.jpg',
    alt: 'A branching tree of light converging to one node illustrating an AI job-search agent built on Claude Code',
  },
  sections: [
    {
      heading: 'TL;DR',
      content: `**ai-job-search** (MIT) crossed **15,000 GitHub stars this week — over 5,000 of them in a single day** — making it one of the fastest-growing **Claude Code** workflows of 2026. It is not an app you install; it is a **fork-and-fill framework** that turns the Claude Code CLI into a job-hunting agent. Eleven slash commands self-profile you, scrape job portals, score each posting for fit, then run a **drafter-reviewer loop** to tailor a LaTeX CV and cover letter. Skip it if you want one-click mass-apply — this optimizes *quality per application*, not volume. The real value for developers is the blueprint: it is a clean worked example of using Claude Code as a runtime for a non-coding agent.`,
    },
    {
      heading: 'ai-job-search: The Viral Claude Code Job Agent, Explained',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

On July 8, 2026, a repository called [ai-job-search](https://github.com/MadsLorentzen/ai-job-search) by Mads Lorentzen picked up **more than 5,000 GitHub stars in twenty-four hours** — the single biggest one-day gain on GitHub's trending page that day — pushing it past **15,700 stars and 4,100 forks** in total. The pitch is disarmingly simple: fork it, fill in your profile, and let Claude "evaluate jobs, tailor CVs, write cover letters, and prepare you for interviews."

The interesting part is not that it writes cover letters. Plenty of tools do that badly. The interesting part is *how* it is built. There is no web app, no hosted backend, no separate agent runtime. The entire thing runs **inside [Claude Code](https://claude.com/claude-code)** — Anthropic's terminal coding tool — using nothing but slash commands, skill files, and a \`CLAUDE.md\` that holds your career profile. It is a job agent wearing a coding-tool's clothes.

That is why it matters to a developer even if you are not job hunting. ai-job-search is one of the cleanest public examples of a pattern that is quietly becoming the default in 2026: **Claude Code as a general-purpose agent runtime**. Read it as a teardown, not a product, and it teaches you how to build your own domain agent — legal intake, PR triage, invoice chasing — on the same rails. Below is what actually ships, how the architecture holds together, an honest comparison, and where auto-apply breaks in the real world.`,
    },
    {
      heading: "What's Actually New Here?",
      content: `Auto-apply tools are not new — mass-apply browser bots have existed for years. What is new is the **shape**. ai-job-search is licensed **MIT**, written in TypeScript, Python, and LaTeX, and ships **eleven slash commands** instead of a UI. Three form the core loop — \`/setup\`, \`/scrape\`, \`/apply <url>\` — and eight more extend it: \`/rank\`, \`/interview\`, \`/outcome\`, \`/expand\`, \`/upskill\`, \`/add-template\`, \`/add-portal\`, and \`/reset\`.

The genuinely new idea is treating **your own repository as the agent's memory**. When you run \`/setup\`, Claude reads a \`documents/\` folder (CV PDF, LinkedIn export, diplomas, past applications) or interviews you, then writes structured profile files — \`01-candidate-profile.md\`, \`02-behavioral-profile.md\`, \`03-writing-style.md\`, \`04-job-evaluation.md\`, and more — into \`.claude/skills/\`. The top-level \`CLAUDE.md\` becomes the always-loaded system state. There is no database; the git repo *is* the database, and every tailored CV is a diff you can review.

The second new idea is **honesty as a hard rule**. The framework instructs the agent to verify every claim in a generated CV or cover letter against your actual profile and to "never fabricate skills or experience." That constraint is written into the skill files, not bolted on — which, as anyone who has watched an LLM confidently invent a Kubernetes certification will tell you, is the difference between a usable draft and a liability. Source: the project [README](https://github.com/MadsLorentzen/ai-job-search) and its \`.claude/skills/job-application-assistant\` definition.`,
    },
    {
      heading: 'How Does It Work? The Claude Code Runtime Pattern',
      content: `The whole system is four moving parts: **slash commands** (the workflow), **skill files** (the knowledge and tools), **\`CLAUDE.md\`** (the state), and **subagents** (the quality gate). Here is the core loop:

\`\`\`bash
# 1. Fork, clone, install the portal CLIs (Bun-based)
gh repo fork MadsLorentzen/ai-job-search --clone && cd ai-job-search
cd .agents/skills/jobindex-search/cli && bun install && cd -

# 2. Inside Claude Code, build your profile once
claude
> /setup            # reads documents/ or interviews you -> writes profile skill files

# 3. Find and score jobs, then apply to one
> /scrape           # searches portals, dedupes, sorts by fit
> /rank             # batch-scores every hit on 5 fit dimensions -> shortlist
> /apply https://jobindex.dk/job/1234567
\`\`\`

The clever bit is inside \`/apply\`. It does not one-shot the letter. It runs a **drafter-reviewer separation**: one Claude agent drafts the CV and cover letter from your profile and the posting, then a **second agent with fresh context** researches the company, critiques the draft for missed keywords and generic phrasing, and hands back notes. The drafter revises. Two agents, two roles, one output — a pattern anyone building on Claude Code should steal, because a critic with a clean context window catches what the author is blind to. (For more on multi-agent orchestration trade-offs, see my note on [Microsoft Agent Framework vs LangGraph vs CrewAI](/en/notes/microsoft-agent-framework-vs-langgraph-crewai-2026).)

There is a small piece of real engineering worth calling out: when a tailored CV overflows the **2-page limit**, the agent does not just truncate. It **scores every line on three signals** — relevance to the target posting, uniqueness within the document, and whether the cover letter depends on it — then cuts the lowest-scoring line first. So an older-role bullet that hits the posting's keywords survives ahead of a recent-role bullet that does not. That is a genuine ranking heuristic, not a prompt hoping for the best.`,
    },
    {
      heading: 'Where It Actually Shines',
      content: `**1. Tailoring quality, not application volume.** The drafter-reviewer loop is the moat. A single-pass LLM cover letter reads like a single-pass LLM cover letter; a draft that has been critiqued by a second agent researching the specific company reads like you spent an hour on it. For a developer sending **five carefully-aimed applications a week** instead of five hundred blind ones, that quality delta is the entire game.

**2. LaTeX output that survives ATS.** CVs compile through \`lualatex\`/\`xelatex\` from templated \`.tex\` files, and an optional \`pdftotext\` (poppler) pass checks that the compiled PDF is still machine-parseable — degrading to a visual keyword review if poppler is missing. Most AI resume tools hand you a Word doc and hope; this one treats **ATS parseability as a test step**.

**3. It is a build-your-own-agent tutorial in disguise.** The portal search skills ship for the **Danish market** — Jobindex, Jobnet, Akademikernes Jobbank, Jobdanmark — but \`/add-portal\` *generates a new portal skill for your market*: it investigates the site's search URL pattern, scaffolds a CLI skill matching the shipped ones, and test-runs a live query before registering it. Watch \`/add-portal\` work and you have effectively watched a lesson in extending a Claude Code agent with new tools. That transfers to any domain — swap "job portal" for "CRM," "Jira," or "internal admin panel" and the mechanics are identical.

**4. It closes the loop — the agent learns your search.** Most resume tools forget you the moment the PDF downloads. ai-job-search does not. **Four commands turn each application into memory:** \`/outcome\` logs what happened (rejected, screened, interview, offer) back into the repo, \`/interview\` generates company-specific prep from the same profile files, \`/upskill\` diffs your skills against the roles you keep losing and names what to learn next, and \`/expand\` widens the search when a niche dries up. Because every result is committed alongside your profile, that history *is* context for the next \`/rank\` — the agent gets measurably sharper on your specific search the longer you run it. Application → outcome → adjusted targeting is a closed loop that mass-apply bots and stateless chat sessions structurally cannot copy, and it is the single strongest argument for the **repo-as-memory** design at the center of the whole framework.`,
    },
    {
      heading: 'ai-job-search vs the Alternatives',
      content: `AI engines and busy readers both want the one-glance comparison. Here is how the Claude Code approach stacks up against the three things people actually use instead:

| Feature | ai-job-search (Claude Code) | Mass auto-apply bots | SaaS copilots (Simplify/Teal-style) | ChatGPT + copy-paste |
|---|---|---|---|---|
| How it runs | Local CLI you own | Browser automation | Hosted extension + cloud | Manual, per-message |
| Optimizes for | Quality per application | Raw volume | Autofill speed | Nothing structured |
| Fabrication guard | Hard "never invent" rule | None | Weak | Depends on you |
| Review pass | 2nd agent critiques draft | None | None | You are the reviewer |
| CV output | Tailored LaTeX, ATS-checked | Reuses one CV | Keyword-matched | Whatever you paste |
| Data / privacy | Stays in your repo | Sends to vendor | Sends to vendor | Sent to model |
| Cost | Claude Code plan + tokens | Subscription | Subscription | Chat plan |
| Extensible | \`/add-portal\`, \`/add-template\` | No | No | No |

The honest read: mass-apply bots win on **volume**, SaaS copilots win on **zero setup**, and ChatGPT wins on **nothing to install**. ai-job-search wins on **control, tailoring depth, and privacy** — your career data and every draft stay on your machine as reviewable git diffs. Pick the axis that matches how you actually job-hunt.`,
    },
    {
      heading: 'When to Skip It (or Wait)',
      content: `This is not for everyone, and pretending otherwise would be the exact fabrication the tool warns against.

**Skip it if you want one-click volume.** The whole design fights against spray-and-pray. If your strategy is 200 applications a week, a mass-apply bot serves you better and ai-job-search will feel like friction.

**The setup tax is real.** You need the **Claude Code CLI**, **Python 3.10+**, **Bun**, and a **LaTeX distribution** with \`lualatex\` and \`xelatex\` — plus the README's own warning that \`pdflatex\` often fails on modern MiKTeX installs with \`fontawesome5\` errors. On a clean machine that is 30–60 minutes before your first application. Non-developers will bounce off the toolchain.

**The portals are Danish out of the box.** The core evaluation and drafting logic is country-agnostic, but if you are hunting in the US, India, or anywhere else, you will run \`/add-portal\` for your job boards before \`/scrape\` is useful. That is a feature, but it is also a first-day chore.

**It costs tokens.** A drafter-reviewer loop across a scrape, a rank, and several \`/apply\` runs burns real Claude usage. For a heavy week you are paying for a lot of agent turns — budget for it, or gate how many jobs you \`/rank\` at once.`,
    },
    {
      heading: 'How I Would Ship This in Production',
      content: `Here is the part the README will not tell you, because I learned it the hard way running my own outreach agent. I operate a **daily agent that hunts freelance leads and sends tailored cold pitches** — the same shape as auto-apply, just aimed at clients instead of jobs. Three failure modes bit me, and all three apply directly to ai-job-search if you scale it.

**Role-filter blind spots are the silent killer.** My pitch agent once cheerfully drafted outreach for a *mechanical* engineering lead and a non-English posting because the role filter had gaps. An LLM will confidently apply you to jobs you should never touch. Before you trust \`/rank\`, build a tiny labeled set — twenty postings you know are yes/no — and measure how the five fit-dimensions actually score them. The eval takes an hour; skipping it costs you a week of wasted, slightly-embarrassing applications.

**Deliverability, not drafting, is where volume dies.** When I widened my sources, one bad channel produced synthesized contact addresses that bounced at roughly **80%**. Job portals have the equivalent: postings that block automated fetches, expired listings, and forms that silently reject. ai-job-search already degrades gracefully — paste the description if the URL won't fetch — but if you automate it, log every submission outcome with \`/outcome\` and watch the failure rate, or you will "apply" to a wall.

**Keep a human in the loop, on purpose.** The strongest thing about this framework is also the easiest to throw away: the drafter-reviewer loop makes each application good *because a person still picks which jobs and reads the final draft*. The moment you wrap it in a cron job that applies to everything \`/scrape\` returns, you have rebuilt the mass-apply bot you were trying to beat — and reintroduced the fabrication and mis-targeting risks the design carefully removed. The right production wiring here is **spend caps, an eval set for the fit scorer, outcome logging, and a mandatory human approve step** — not full autonomy.

That is the tax on every "let the agent do it" tool: the artifact is easy, the guardrails are the work. Budget for the eval and the approval gate, not just the install.`,
    },
    {
      heading: 'Want an Agent Like This Wired Into Your Own Product?',
      content: `If ai-job-search convinced you that Claude Code is a viable agent runtime — and it should — the leap from "cool fork" to "reliable internal tool" is exactly the work I do. The pattern here (slash-command workflow, repo-as-state, skills-as-tools, a reviewer subagent, and honest guardrails) drops cleanly onto legal intake, support triage, sales outreach, or any repetitive knowledge task your team runs by hand.

The hard part is never the demo; it is the spend caps, the eval set that proves the scorer works, the outcome logging, and the human-approval gate that keeps it trustworthy. That is the [6-week MVP](/en/services/6-week-mvp) playbook — pick the right runtime, wire it into a shipping product, hand over a tested codebase. For a longer build with someone embedded in your team, [hire a founding engineer (India)](/en/services/hire-founding-engineer-india).

Further reading from my notes: [Microsoft Agent Framework vs LangGraph vs CrewAI](/en/notes/microsoft-agent-framework-vs-langgraph-crewai-2026) for choosing an orchestration layer, and [the best open-source deep-research agent to self-host](/en/notes/best-open-source-deep-research-agent-self-host-2026) for another repo-as-agent teardown.`,
    },
  ],
  cta: {
    text: 'Turn an Agent Prototype Into a Product — 6-Week MVP',
    href: '/en/services/6-week-mvp',
  },
};
