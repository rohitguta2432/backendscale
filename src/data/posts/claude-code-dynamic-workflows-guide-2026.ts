import type { BlogPost } from '@/types/blog';

export const claudeCodeDynamicWorkflowsGuide2026: BlogPost = {
  slug: 'claude-code-dynamic-workflows-guide-2026',
  title: 'Claude Code Dynamic Workflows: A Hands-On Guide for Developers (2026)',
  date: '2026-06-01',
  excerpt:
    "Anthropic shipped dynamic workflows in Claude Code on May 28, 2026 — a JavaScript script Claude writes to orchestrate up to 1,000 subagents on one task, in the background, while your session stays free. Here's what they actually are, how they differ from subagents and skills, the three ways to trigger one, where they earn their (heavy) token cost, when to skip them, and how I wire them into real client builds.",
  readingTime: '12 min read',
  keywords: [
    'claude code dynamic workflows',
    'claude code dynamic workflows guide',
    'claude code ultracode',
    'claude code multi-agent orchestration',
    'claude code dynamic workflows vs subagents',
    'how to use claude code workflows',
    'claude code 1000 subagents',
  ],
  coverImage: {
    src: '/images/notes/claude-code-dynamic-workflows-guide-2026-cover.jpg',
    alt: 'Constellation of glowing cyan nodes illustrating Claude Code dynamic workflows orchestrating parallel AI subagents',
  },
  relatedProject: 'myFinancial',
  sections: [
    {
      heading: 'TL;DR',
      content: `Dynamic workflows let Claude Code orchestrate up to **1,000 subagents** from a JavaScript script it writes for your task — the kind of work one agent pass cannot finish, like a codebase-wide bug sweep, a 500-file migration, or research cross-checked across sources. Anthropic shipped them in **research preview on May 28, 2026** (Claude Code **v2.1.154+**), running in the background while your session stays free, with up to **16 agents concurrent**. The catch: a single run can burn far more tokens than a normal session. Reach for them on big, parallel, verify-twice work; skip them for routine edits.`,
    },
    {
      heading: 'Claude Code Dynamic Workflows: What They Are and Why They Matter',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

On May 28, 2026, Anthropic [introduced dynamic workflows in Claude Code](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code), shipping the feature alongside Claude Opus 4.8. A dynamic workflow is a JavaScript script that Claude Code writes for the task you describe, and a runtime executes it in the background while your session stays responsive. [TechCrunch covered it](https://techcrunch.com/2026/05/28/anthropic-releases-opus-4-8-with-new-dynamic-workflow-tool/) as the headline tool of the release, and the [official docs](https://code.claude.com/docs/en/workflows) cap a single run at 1,000 subagents with up to 16 running at once.

The change that actually matters is *where the plan lives*. With subagents and skills, Claude is the orchestrator: it decides turn by turn what to spawn next, and every intermediate result lands back in its context window — so a hundred-agent task drowns in its own memory long before it finishes. A workflow moves the loop, the branching, and the intermediate results into **script variables**. Claude's context only ever sees the final answer. That single shift is what turns "hundreds of agents on one task" from a context-ceiling problem into a scheduling one.

It is not a demo toy, either. Bun's founder used dynamic workflows to port roughly **750,000 lines of Zig to Rust at 99.8% test-suite pass**, with hundreds of agents writing files in parallel and two reviewers on each one ([The Register](https://www.theregister.com/devops/2026/05/14/anthropics-bun-rust-rewrite-merged-at-speed-of-ai/)). If you build real software, this is the first agent feature aimed squarely at the work that is simply too big for one conversation — the same jump in ambition I flagged when [Opus 4.8 landed](/en/notes/claude-opus-4-8-vs-4-7-developers-2026).`,
    },
    {
      heading: 'What actually shipped on May 28, 2026?',
      content: `Strip the launch noise and here is the concrete surface area, all from the [official documentation](https://code.claude.com/docs/en/workflows):

- **Status:** research preview, requires **Claude Code v2.1.154 or later**. It is not GA, so expect behavior to move.
- **Where it runs:** the CLI, the Desktop app, the IDE extensions, non-interactive \`claude -p\`, and the Agent SDK. Same feature on every surface.
- **Plans:** all paid plans. On Pro you switch it on from the *Dynamic workflows* row in \`/config\`; Max, Team, and Enterprise have it available (Enterprise admins can disable it org-wide).
- **Providers:** Anthropic API, Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry.
- **Hard limits:** **up to 16 concurrent agents** (fewer on low-core machines) and **1,000 agents total per run** as a runaway-loop backstop.
- **Execution model:** the runtime runs the script in an isolated environment, separate from your conversation, and tracks each agent's result so a run is **resumable within the same session** — completed agents return cached results, the rest run live.

That resumability detail is easy to skim past and matters a lot in practice: if you stop a 200-agent run halfway, you do not pay to redo the 120 agents that already finished. One caveat — resume only works inside the same Claude Code session. Exit and relaunch, and the next session starts the workflow fresh.`,
    },
    {
      heading: 'Workflows vs subagents vs skills: which should you reach for?',
      content: `Subagents, skills, and workflows can all run a multi-step task. The honest way to choose between them is to ask *who holds the plan*. The docs put it in one table, and it is worth internalizing:

| | Subagents | Skills | Workflows |
|---|---|---|---|
| What it is | A worker Claude spawns | Instructions Claude follows | A script the runtime executes |
| Who decides what runs next | Claude, turn by turn | Claude, following the prompt | The script |
| Where intermediate results live | Claude's context | Claude's context | Script variables |
| What's repeatable | The worker definition | The instructions | The orchestration itself |
| Scale | A few per turn | Same as subagents | Dozens to hundreds per run |
| Interruption | Restarts the turn | Restarts the turn | Resumable in the session |

The practical reading: **subagents and skills keep Claude in the driver's seat**, which is exactly what you want for open-ended work where the next step depends on what the last one found. The cost is that everything funnels through one context window, so they top out at a handful of delegated tasks per turn. **Workflows codify the plan as code**, which buys you three things at once — scale past the context ceiling to hundreds of agents in a single run (the cap is 1,000), a script you can read and rerun, and a place to bolt on a repeatable quality pattern (more on that below). If you have been hand-rolling orchestration with [Claude Code plugins and context engineering](/en/notes/claude-code-plugins-context-engineering-2026), a workflow is the layer that finally holds the loop for you instead of you nursing it turn by turn.`,
    },
    {
      heading: 'How do you run a dynamic workflow?',
      content: `There are three ways to start one, and you do **not** write the script yourself — Claude does. Reading it is the point; authoring it is not.

\`\`\`text
# 1. Trigger a single run by putting the word "workflow" in your prompt:
Run a workflow to audit every API route under src/routes/ for missing auth checks

# 2. Or flip the whole session to auto-orchestrate:
/effort ultracode      # xhigh reasoning + Claude plans a workflow per substantive task
/effort high           # drop back to routine work (ultracode resets each new session)

# 3. Or run the bundled research workflow:
/deep-research What changed in the Node.js permission model between v20 and v22?

# Watch and control any run from its progress view:
/workflows             # list runs; Enter opens phases with agent counts + token totals
#   p pause/resume  ·  x stop  ·  r restart an agent  ·  s save the run as a /command
\`\`\`

**\`ultracode\`** is the setting worth understanding: it combines \`xhigh\` reasoning effort with automatic orchestration, so Claude decides on its own when a task warrants a workflow — one request can spawn several in a row (understand the code, make the change, verify it). It lasts the session and resets when you start a new one, which is a deliberate guardrail against leaving the most expensive mode on by accident.

The script Claude generates is plain JavaScript, and the shape is readable even if you never touch it:

\`\`\`ts
// Illustrative — the kind of script the runtime writes and runs for you.
phase("Find");
const findings = await parallel(
  routes.map(r => () => agent(\`Audit \${r} for missing auth checks\`))
);

phase("Verify");                          // an independent second pass
const confirmed = await parallel(
  findings.flat().map(f => () =>
    agent(\`Try to refute this finding: \${f}. Default to "not a bug" if unsure.\`))
);
// Only findings that survive refutation are folded back into your session.
\`\`\`

Once a run does what you wanted, press \`s\` in \`/workflows\` to save its script to \`.claude/workflows/\` (shared with your repo) or \`~/.claude/workflows/\` (just you). It then runs as \`/<name>\` forever — a one-off becomes a reusable command.`,
    },
    {
      heading: 'Where dynamic workflows earn their token cost',
      content: `A workflow is overkill for most tasks. It pays for itself in three shapes of work, and each leans on the fact that the script can apply a *quality pattern*, not just spawn more agents.

**1. Codebase-wide sweeps — bug hunts and security audits.** Fan a separate agent across every route, module, or service, then run a second, independent set of agents whose only job is to *refute* each finding before it is reported. That adversarial pass is what kills the plausible-but-wrong findings a single agent confidently emits. This is the exact failure mode I wrote about in [AI-generated code anti-patterns](/en/notes/ai-generated-code-anti-patterns-fixes-2026) — a verification layer is the difference between a review you trust and a wall of false positives.

**2. Large migrations and modernization.** The Bun port is the flagship: ~**750,000 lines of Zig to Rust at 99.8% test-suite pass**, structured as staged workflows — one mapped Rust lifetimes for every struct field, the next wrote each \`.rs\` file in parallel with **two reviewers per file**, and a fix loop drove the build and tests until both ran clean ([The Register](https://www.theregister.com/devops/2026/05/14/anthropics-bun-rust-rewrite-merged-at-speed-of-ai/)). A 500-file framework swap or an API-deprecation sweep is the same shape at a smaller scale.

**3. Cross-checked research.** The bundled \`/deep-research\` workflow fans out web searches across several angles, fetches the sources, **votes on each claim**, and returns a cited report with the claims that did not survive cross-checking already filtered out. It is the difference between "an agent told me" and "five agents agreed, and here are the sources."

The common thread: pick a workflow when the task is big enough that one context cannot hold it *and* important enough that you want it checked twice.`,
    },
    {
      heading: 'Dynamic workflows vs CrewAI, LangGraph, and AutoGen',
      content: `If you already build agent systems, the obvious question is how this compares to the Python frameworks. The short answer: they solve different problems. Dynamic workflows orchestrate agents **inside your coding tool, against your repo**; CrewAI, LangGraph, and AutoGen are libraries you wire into **your own application**.

| Factor | Claude Code Dynamic Workflows | CrewAI | LangGraph | AutoGen |
|---|---|---|---|---|
| What it is | Orchestration inside your coding agent | Role-based multi-agent framework | Graph-based stateful runtime | Conversational multi-agent framework |
| Where it runs | In Claude Code, on your codebase | In your app | In your app | In your app |
| Who writes the orchestration | Claude, on the fly (JS) | You, in Python | You, as a graph | You, in Python |
| Scale per run | 1,000 agents / 16 concurrent | You manage | You manage | You manage |
| Verification built in | Yes (adversarial pattern) | DIY | DIY | DIY |
| Setup | None (v2.1.154+) | pip + code | pip + code | pip + code |
| Best for | Repo-scale engineering tasks | Production agent products | Stateful agent apps | Agent experiments |

So it is not an either/or. You would still build a customer-facing agent product on LangGraph or CrewAI — I broke down that choice in [LangGraph vs CrewAI vs AutoGen](/en/notes/langgraph-vs-crewai-vs-autogen-india-mvp-2026). Dynamic workflows are the thing you use to *build and maintain* that product faster: the migration, the audit, the dependency upgrade across 300 files. Different layer, different job.`,
    },
    {
      heading: 'When should you skip dynamic workflows?',
      content: `The feature is genuinely useful, which is exactly why it is worth being honest about when not to reach for it.

**The token bill is real.** A workflow spawns many agents, so a single run can use meaningfully more tokens than doing the same task in conversation — and it counts toward your plan's usage and rate limits like any other session. For an India-based founder watching cost, an \`ultracode\` session that turns every request into three workflows is the fastest way to surprise yourself. Mitigations the docs spell out: check \`/model\` before a large run, and ask Claude to route cheaper stages to a smaller model. Treat a big run like a cloud job, not a free chat.

**It is a research preview.** v2.1.154 is the floor, not a stable contract. Behavior, limits, and the \`/config\` surface can change. Do not build a load-bearing CI process on it yet.

**No mid-run human input.** Once a run starts, only agent permission prompts can pause it — there is no "approve this before continuing" step between stages. If your task genuinely needs sign-off in the middle, you have to split it into separate workflows. That is a real constraint for anything compliance-sensitive.

**Single-pass tasks gain nothing.** If one agent can finish the job in a turn, paying for fifty is pure waste. Renaming a function, fixing one failing test, writing a component — keep those in normal conversation or a single subagent.

**Effort gating.** \`ultracode\` only appears on models that support \`xhigh\` effort; on others the \`/effort\` menu does not offer it.`,
    },
    {
      heading: 'How I drive workflows on real client builds',
      content: `Here is the concrete way I actually use this, not the theory.

My trigger rule is three conditions, all true: the task is **bigger than one context**, it is **parallelizable**, and it is **worth verifying twice**. An auth audit across every route before a fintech launch hits all three; renaming a variable hits none. When I am unsure, I default to a single subagent first and only escalate to a workflow when the task visibly overflows one pass — the same discipline I bring to picking models and gateways, where [over-engineering on day one](/en/notes/openrouter-vs-litellm-vs-portkey-india-mvp-2026) quietly costs more than it saves.

The failure mode I watch hardest is **silent truncation**. A workflow that quietly caps at "top 20 findings" reads in the report as "we covered everything" when it did not. So I tell Claude to log what it dropped, and for audits I lean on the refutation pass so the survivors are trustworthy rather than merely numerous. The second thing I watch is **runaway spend** — I scope the task tightly, set \`/model\` deliberately, and remember that 1,000-agent cap is a backstop, not a target.

The integration the README will not push on you: **save the good runs.** Once a branch-review or auth-audit workflow does what I want, \`s\` saves it as a \`/command\`, and now the same orchestration runs on every branch — a one-off becomes a repeatable quality gate, which is most of the value. It is the same instinct behind a hardened [MCP server you can trust in production](/en/notes/secure-mcp-server-typescript-2026): codify the thing once, run it the same way every time.

If you want this kind of agent-assisted engineering wired into a build correctly — the orchestration, the cost controls, the verification that actually catches bugs — that is the work I do. I run [fixed-scope 6-week MVP builds](/en/services/6-week-mvp), or you can [hire a founding engineer in India](/en/services/hire-founding-engineer-india) to own the whole pipeline end to end, the same way I built the AI features on [myFinancial](/en/projects) to be both cheap to run and trustworthy.`,
    },
  ],
  cta: {
    text: 'Ship Your AI MVP — Book a Build',
    href: '/en/services/6-week-mvp',
  },
};
