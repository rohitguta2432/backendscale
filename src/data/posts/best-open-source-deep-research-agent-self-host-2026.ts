import type { BlogPost } from '@/types/blog';

export const bestOpenSourceDeepResearchAgentSelfHost2026: BlogPost = {
    slug: 'best-open-source-deep-research-agent-self-host-2026',
    title: 'Best Open-Source Deep Research Agent to Self-Host in 2026 (Onyx vs DeerFlow vs Perplexica)',
    date: '2026-06-29',
    excerpt:
        'An open-source deep research agent now sits at #1 on DeepResearch Bench — ahead of OpenAI, Gemini, and Perplexity. So you no longer have to rent deep research from a frontier lab. This is the builder\'s read on the four worth self-hosting in 2026 — Onyx, DeerFlow 2.0, Perplexica/Vane, and Khoj — with live star counts, a runnable Docker self-host, an honest comparison table, when to skip self-hosting entirely, and the production wiring the READMEs leave out.',
    readingTime: '11 min read',
    keywords: [
        'best open source deep research agent',
        'self-host deep research agent 2026',
        'open source perplexity alternative',
        'onyx deep research',
        'deerflow 2.0 self-host',
        'perplexica self-host',
        'open source deep research tool',
        'self-hosted ai research assistant',
    ],
    relatedProject: 'myFinancial',
    coverImage: {
        src: '/images/notes/best-open-source-deep-research-agent-self-host-2026-cover.jpg',
        alt: 'Glowing pink particle swarm converging into a luminous core illustrating self-hosted open-source deep research agents in 2026',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `As of mid-2026, the best open-source **deep research agent** is good enough to top a frontier benchmark: [Onyx](https://github.com/onyx-dot-app/onyx) ranks **#1 on DeepResearch Bench** — ahead of OpenAI Deep Research, Gemini 2.5 Pro, and Perplexity Deep Research — across **100 PhD-level tasks in 22 fields**, on a 100% self-hostable stack. If you want to own the pipeline, self-host one of four: **Onyx** (team/enterprise RAG over your data), **DeerFlow 2.0** (75K-star autonomous SuperAgent), **Perplexica/Vane** (lightweight self-hosted Perplexity), or **Khoj** (personal second brain). Skip self-hosting if you research occasionally — a $20/mo Perplexity seat is cheaper than the GPU bill and the indexing maintenance.`,
        },
        {
            heading: 'Best Open-Source Deep Research Agent to Self-Host in 2026 (Onyx vs DeerFlow vs Perplexica)',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

For most of 2024 and 2025, "deep research" meant renting it. You paid OpenAI, Gemini, or Perplexity, sent them your query, and got back a cited report — along with whatever they logged about what you were researching. Self-hosting an equivalent meant accepting a big quality gap.

That gap closed in 2026. An open-source agent — [Onyx](https://github.com/onyx-dot-app/onyx) — now sits at the top of [DeepResearch Bench](https://github.com/onyx-dot-app/onyx_deep_research_bench), an independent academic benchmark, *above* every proprietary deep-research product. Read that twice: the open, self-hostable option is not "almost as good." On this benchmark it is, by report quality, first.

So the real question stopped being "is open-source good enough?" and became "which one do I run, and how do I wire it without it becoming a maintenance tax?" This is the builder's read on the four worth self-hosting — with live numbers, a runnable Docker example, an honest comparison, and the production plumbing the READMEs skip.`,
        },
        {
            heading: 'What actually changed in 2026',
            content: `The concrete shift is a benchmark result plus a maturity wave. [DeepResearch Bench](https://github.com/onyx-dot-app/onyx_deep_research_bench) scores agents on 100 PhD-level research tasks across 22 fields, judged on report quality. Onyx's submission took the **#1 slot, ahead of OpenAI Deep Research, Gemini 2.5 Pro, and Perplexity Deep Research** — the first time a fully open, self-hostable stack beat the hosted incumbents at their own task.

Around that headline, the whole category levelled up. ByteDance's [DeerFlow](https://github.com/bytedance/deer-flow) crossed **75,000 GitHub stars** after its 2.0 ground-up rewrite (it shares no code with v1). Perplexica — the self-hosted Perplexity clone — passed **33K stars** and rebranded to **Vane**, per the [OSSAlt self-host guide](https://ossalt.com/guides/self-host-perplexica-open-source-perplexity-2026). [Khoj](https://github.com/khoj-ai/khoj), the self-hostable "AI second brain," sits at **35K stars**. These are not weekend toys; they are projects with real contributor bases and Docker images that work.

There's a standards tailwind too. All four plug into tools and data through **MCP**, the protocol [Anthropic donated to the Linux Foundation's new Agentic AI Foundation in June 2026](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation). A vendor-neutral tool protocol is exactly what makes a self-hosted agent portable — you wire a connector once and it works regardless of which model you point at it. If you've followed my [MCP server auth deep-dive](/en/notes/mcp-server-authentication-oauth-guide-2026), this is the same plumbing, one layer up.`,
        },
        {
            heading: 'Is there an open-source alternative to Perplexity?',
            content: `Yes — several, and they aim at different jobs. The one-line mental model for each:

- **[Onyx](https://github.com/onyx-dot-app/onyx) — 30.6K stars.** An open-source AI platform: chat over *any* LLM with RAG, web search, code execution, custom agents, and deep research built in. Its edge is **connectors** — it pre-indexes 40+ sources (Slack, Confluence, Jira, GitHub, Salesforce, Google Drive, Notion) on your own infra, permissions included. This is the one that won DeepResearch Bench. Deploy via Docker, Kubernetes, or Terraform.
- **[DeerFlow 2.0](https://github.com/bytedance/deer-flow) — 75.3K stars (MIT).** Not a research tool anymore — a **long-horizon SuperAgent harness**. It ships a filesystem, memory, skills, sandbox-aware code execution, and the ability to plan and spawn sub-agents for tasks that run minutes to hours. Built on LangGraph and LangChain. People use it for research, but also data pipelines, slide decks, and dashboards.
- **Perplexica / Vane — ~33K stars (MIT).** The **lightweight self-hosted Perplexity**. A single Docker image bundles the frontend, API, and a private [SearxNG](https://ossalt.com/guides/self-host-perplexica-open-source-perplexity-2026) metasearch engine, so your searches never touch a third party. Runs 100% local with [Ollama](/en/notes/best-local-llm-for-coding-replace-cloud-2026), or against OpenAI/Anthropic/Groq for speed.
- **[Khoj](https://github.com/khoj-ai/khoj) — 35.4K stars (AGPL-3.0).** A self-hostable **second brain**: it connects to your documents and the web, builds agents, schedules automations, and returns research with **verifiable citations**. Best when the corpus you care about is *your own notes and files*, not the open web.

The dividing line: Onyx and DeerFlow are platforms you build *on*; Perplexica/Vane and Khoj are products you mostly use *as-is*.`,
        },
        {
            heading: 'How do you self-host a deep research agent?',
            content: `All four are Docker-first, which is the whole point — you get a private deep-research stack with a few commands. The smallest useful example is Perplexica/Vane, because it's a single compose file and runs fully local:

\`\`\`bash
# 1. Clone and configure
git clone https://github.com/ItzCrazyKns/Perplexica.git
cd Perplexica
cp sample.config.toml config.toml   # set your model + SearxNG URL

# 2. Point it at a local model (no API keys, data stays home)
#    config.toml -> [MODELS.OLLAMA] API_URL = "http://host.docker.internal:11434"

# 3. Bring up frontend + API + private SearxNG in one shot
docker compose up -d
# open http://localhost:3000 — you now have a self-hosted Perplexity
\`\`\`

Onyx is the same idea at team scale — \`docker compose\` brings up the web app, the model server, and the indexing workers; you then connect data sources from the admin UI and they sync continuously. The thing to budget for is **not** the agent container, it's everything around it: a vector store, a metasearch or web-search tool, and (if you run models locally) a GPU. A 7–13B local model on a single 24GB card is enough for the routing and summarizing steps; you only need a bigger model for the final synthesis pass, which is exactly where you can fall back to an API call.

**What it actually costs to run.** The honest minimum for a fully-local stack is a single **24GB GPU** (a used RTX 3090 or a 4090), **32GB** of system RAM, and roughly **50GB** of disk for the model plus indexes. That runs the routing, sub-question, and summarizing calls locally at zero marginal cost. Don't want to own hardware? A 24GB cloud GPU runs about **$0.40–$0.80/hour on spot** — fine for bursty research, expensive if you leave it idling overnight. The cheapest setup I've actually shipped is hybrid: a local model for the cheap high-volume steps and one API call to a frontier model for the final synthesis. That keeps the GPU small and the monthly bill predictable, which matters more than raw quality once a tool is in daily use.

One honest setup gotcha: the first index is slow. Onyx pre-indexing 40+ connectors, or Khoj ingesting a large document set, can take hours on first run and will hammer your disk. Run it once, overnight, before you judge the thing.`,
        },
        {
            heading: 'Where each one actually shines',
            content: `Generic "it does research" descriptions are useless for picking one. Here's the concrete scenario each one wins:

- **Onyx — "research across my company's scattered knowledge."** You have answers buried in Slack threads, Jira tickets, Confluence pages, and a Google Drive nobody has read since 2024. Onyx indexes all of it *with permissions intact*, then runs deep research that cites your internal sources alongside the web. The DeepResearch Bench win plus 40+ permission-aware connectors makes this the default for any team that wants private RAG + deep research in one box.
- **DeerFlow 2.0 — "do a multi-hour task end to end."** Not "answer a question" but "research this market, then write the analysis, then generate the slides." The sandbox + sub-agent + memory design is built for tasks that need to plan, execute code, and run long. Overkill for a quick lookup; the right tool when the output is a deliverable, not a paragraph.
- **Perplexica / Vane — "a private Perplexity for me and my team."** You just want the Perplexity experience — ask, get a cited synthesis — without sending queries to a third party. Lightweight, fast to stand up, 100% local if you want it. This is the lowest-effort win on the list.
- **Khoj — "research over my own files, with citations I can trust."** A lawyer, analyst, or researcher whose corpus is their own documents. Khoj's verifiable-citation focus and second-brain model fit personal-knowledge work better than the web-first tools.`,
        },
        {
            heading: 'Comparison table: Onyx vs DeerFlow 2.0 vs Perplexica vs Khoj',
            content: `| Tool | Best for | GitHub stars | License | Self-host | LLM flexibility | Killer feature |
|------|----------|--------------|---------|-----------|-----------------|----------------|
| **Onyx** | Team/enterprise RAG + deep research over your data | 30.6K | Open-source | Docker · K8s · Terraform | Any LLM, local or API | #1 on DeepResearch Bench; 40+ permission-aware connectors |
| **DeerFlow 2.0** | Long-horizon autonomous tasks (research → code → create) | 75.3K | MIT | Docker | Any (LangGraph/LangChain) | SuperAgent harness: sandbox, memory, sub-agents |
| **Perplexica / Vane** | Lightweight private Perplexity | ~33K | MIT | Single Docker image | Ollama · OpenAI · Anthropic · Groq | Bundled private SearxNG; 100% local option |
| **Khoj** | Personal knowledge + web research with citations | 35.4K | AGPL-3.0 | Docker | Local or API | Verifiable citations over your own docs |

If you read one row: pick **Onyx** for a team that wants private RAG and the benchmark-topping deep research, **Perplexica/Vane** for a solo private Perplexity, **DeerFlow** when the job is a multi-step deliverable, and **Khoj** when the data is your own files. Note Khoj's **AGPL-3.0** license — fine for internal use, but read it before you embed Khoj in a commercial product, because AGPL's network-use clause is stricter than MIT.`,
        },
        {
            heading: 'When should you skip self-hosting?',
            content: `An honest counter-position, because "self-host everything" is a trap as often as it's a win:

- **You research occasionally.** If you run a handful of deep research queries a week, a **$20/mo** Perplexity or ChatGPT seat is far cheaper than a GPU that idles 23 hours a day plus the time you'll spend maintaining indexes. Self-hosting pays off on *volume* and *privacy*, not convenience.
- **You don't have the infra muscle.** These are Docker stacks, but a real deployment means a vector DB, a search tool, secrets, backups, and upgrades. If nobody on the team wants to own that, the hosted option is the rational choice — the cheapest system is the one you don't have to operate.
- **You only want a chat UI for local models.** Then you don't need a research agent at all. [Open WebUI](https://github.com/open-webui/open-webui) (143K stars) is the better fit — it's a polished interface over Ollama/vLLM, not a research pipeline you have to feed.
- **Your data isn't sensitive and your volume is low.** The two strongest reasons to self-host are privacy and cost-at-scale. Remove both and the maintenance rarely justifies itself.

The pattern I keep seeing: teams self-host for a *real* reason (sensitive data, high volume, or a need to wire research into their own product) — and the ones who do it "because open-source" quietly drift back to the hosted tool within a month.`,
        },
        {
            heading: 'How I\'d ship a deep-research agent in production',
            content: `Here's the wiring the READMEs leave out. A self-hosted research agent that works in a demo and one that survives production are different systems.

**Route models by step, don't pick one.** A deep-research run is many LLM calls: query planning, sub-question generation, per-source summarizing, and a final synthesis. The first three are cheap, high-volume, and fine on a [local 7–13B model](/en/notes/best-local-llm-for-coding-replace-cloud-2026); only the synthesis needs a frontier model. Wire the agent so the model is a swappable seam per step — most cost overruns I see come from sending every trivial summarize call to an expensive API.

**Cap the loop, hard.** An autonomous agent that can spawn sub-agents (DeerFlow) or chase web links (any of them) can also burn your whole token budget on one runaway query. Put a hard step cap, a wall-clock timeout, and a per-query token ceiling on it. None of these tools ships aggressive-enough defaults; treat the limits as something you set, not inherit.

**The integration that won't be in the README:** the web-search tool is your rate-limit and cost liability, not the LLM. A research agent fans out to many searches per query; without a cache and a per-tool rate limit you'll either get throttled by your search provider or run up a surprising bill. Cache aggressively, and for connector-based tools like Onyx's, **honor source permissions on the way out** — it's easy to index a private Slack and then let the agent cite it to someone who shouldn't see it.

**The failure mode I'd worry about** is silent staleness: a self-hosted agent answers confidently from an index that stopped syncing three weeks ago. Monitor index freshness and surface "last synced" in the UI. Most of my client builds ship this kind of AI feature inside a [6-week MVP window](/en/services/6-week-mvp), and the freshness check is always in scope — a research tool that's quietly out of date is worse than none. If you want a second pair of hands wiring a self-hosted research stack into a product without learning these the hard way, [that's the kind of build I do](/en/services/hire-founding-engineer-india).`,
        },
    ],
    cta: {
        text: 'Want a self-hosted AI research stack wired into your product in 6 weeks?',
        href: '/en/services/6-week-mvp',
    },
};
