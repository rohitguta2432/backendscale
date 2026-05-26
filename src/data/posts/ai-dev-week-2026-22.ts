import type { BlogPost } from '@/types/blog';

export const aiDevWeek2026W22: BlogPost = {
  slug: 'ai-dev-week-2026-22',
  title: "This Week in AI Dev: DeepSeek's Permanent 75% Cut, GitHub Auto-Routing, Gemini Managed Agents (Week 22 of 2026)",
  date: '2026-05-26',
  excerpt: 'Six ships from Week 22 of 2026 that change how you build with AI: DeepSeek V4 Pro locks in a 75% price cut, Copilot auto-routes models, Google ships Managed Agents, NuExtract3 opens up structured extraction, Cursor 3 goes multi-agent, and DeepSeek Reasonix lands as an open coding agent.',
  readingTime: '6 min read',
  keywords: [
    'ai dev tools this week',
    'deepseek v4 pro price cut',
    'github copilot auto model selection',
    'gemini managed agents',
    'cursor 3 parallel agents',
    'nuextract3',
    'ai coding agents 2026',
  ],
  relatedProject: 'clinicai',
  coverImage: {
    src: '/images/notes/ai-dev-week-2026-22-cover.jpg',
    alt: 'Abstract editorial cover illustrating AI dev tools weekly roundup week 22 of 2026',
  },
  sections: [
    {
      heading: 'TL;DR',
      content: `Six ships from Week 22 of 2026 that actually move work for AI developers: (1) **DeepSeek V4 Pro's 75% price cut is now permanent** — output tokens at \`$0.87 / 1M\`, ~34x cheaper than GPT-5.5; (2) **GitHub Copilot's "Auto" model picker shipped in VS Code (May 20)** — routes between models per task automatically; (3) **Google announced Managed Agents in the Gemini API** at I/O 2026 plus Gemini 3.5 Flash; (4) **NuExtract3** lands as a 4B open-weight VLM for OCR + structured extraction, self-hostable; (5) **Cursor 3 ships parallel AI agents** with multi-agent worktrees; (6) **DeepSeek Reasonix** drops as a native open coding agent (710 HN points in 48h). Skip the over-hyped Microsoft Copilot Cowork vuln headlines until PromptArmor's mitigation guidance lands.`,
    },
    {
      heading: 'Why This Week Matters Together',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

This isn't six unrelated drops — there's a thread. Three of the six this week (DeepSeek's permanent cut, Reasonix's open coding agent, NuExtract3's open VLM) push the **cost-of-AI floor toward zero for routine dev workloads**. The other three (Copilot Auto, Gemini Managed Agents, Cursor 3 parallel) push the **interface up the stack** — you stop picking models and start describing tasks.

The combined signal: by end of 2026, the median MVP I ship will be running on a router-style routing layer that picks DeepSeek V4 Flash for cheap reasoning, GPT-5.5 only where it earns the 34x premium, and a self-hosted NuExtract3 for any PDF/scan ingestion. That's not a 2027 prediction — that wiring is buildable on this week's drops.

If you're shipping AI features into a product right now, the actionable read is: **don't lock pricing assumptions today**. The DeepSeek announcement alone justifies revisiting your cost-per-call model. Below: what each drop is, where to read the primary source, and one opinionated take per item.`,
    },
    {
      heading: 'DeepSeek V4 Pro: 75% Price Cut Made Permanent (May 23, 2026)',
      content: `**What:** DeepSeek made permanent the 75% discount that was supposed to expire May 31. V4 Pro input drops from \`$0.0145\` to \`$0.003625 / 1M tokens\`; output from \`$3.48\` to \`$0.87 / 1M tokens\`. The-decoder puts that at **~34x cheaper than GPT-5.5 output** at the same context length.

**Why it matters:** This is the single biggest 2026 cost-event for anyone running LLM inference at scale. For a chatbot at 100K queries/day averaging 2K input + 500 output tokens, your monthly token bill goes from roughly $13,000 (GPT-5.5) toward $400 (DeepSeek V4 Pro) — without sacrificing the 1M-context capability DeepSeek shipped in April.

**Source:** [Bloomberg](https://www.bloomberg.com/news/articles/2026-05-23/deepseek-to-make-permanent-75-discount-on-flagship-ai-model) · [the-decoder breakdown](https://the-decoder.com/deepseek-makes-its-75-percent-discount-permanent-pricing-output-tokens-at-least-34x-below-gpt-5-5/)

**Quick take:** Migrate non-critical workloads today. Keep GPT-5.5 / Claude Opus 4.7 for tasks where the model quality earns the premium (creative reasoning, customer-facing copy). I covered the deeper India-MVP cost math in [DeepSeek vs Claude vs GPT for India MVP](/en/notes/deepseek-vs-claude-vs-gpt-india-mvp-cost-2026).`,
    },
    {
      heading: 'GitHub Copilot Auto Model Selection in VS Code (May 20, 2026)',
      content: `**What:** GitHub Copilot's VS Code extension now ships an "Auto" model picker that routes individual tasks to the right model — small-fast for completions, larger reasoning models for chat — without you switching manually.

**Why it matters:** This is the routing-layer-as-a-feature pattern. Until now, every Copilot user picked GPT-5.5 or Claude or Gemini once and stuck with it. Auto changes the default behavior for ~40% of the enterprise AI-IDE market (per LogRocket's Q1 ranking). For dev productivity tracking, it also means your "Copilot cost per developer" line item is going to drift — sometimes down, sometimes up, depending on what you're doing.

**Source:** [GitHub changelog — auto model selection](https://github.blog/changelog/2026-05-20-auto-model-selection-now-routes-based-on-your-task-in-vs-code)

**Quick take:** Worth turning on. Watch your invoice for the first two weeks — if your team does a lot of multi-file refactors, expect routing to favor more expensive models more often than you'd hand-pick.`,
    },
    {
      heading: 'Google Managed Agents in the Gemini API (I/O 2026)',
      content: `**What:** Google announced Managed Agents in the Gemini API and shipped **Gemini 3.5 Flash** — a frontier-intelligence model at Flash-tier speed. Managed Agents removes the orchestration glue: you describe the agent + tools + memory, Google runs it.

**Why it matters:** This is Google's answer to OpenAI's Assistants API and Anthropic's MCP server pattern. The trade you're making: less control over the loop, less observability into intermediate steps, but zero infrastructure to maintain. For internal tools where you'd otherwise stand up LangGraph + a Postgres-backed memory store, Managed Agents is a real shortcut.

**Source:** [Google I/O 2026 — 100 announcements](https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/) · [Managed Agents announcement](https://blog.google/innovation-and-ai/technology/developers-tools/managed-agents-gemini-api/)

**Quick take:** Good for prototypes. For production with auditability requirements (any fintech, healthcare, or compliance-bound product), keep your agent loop in-process where you can log every tool call — managed = black box.`,
    },
    {
      heading: 'NuExtract3: 4B Open-Weight VLM for Structured Extraction',
      content: `**What:** A 4B parameter open-weight vision-language model released this week purpose-built for **OCR, Markdown rendering, and structured JSON extraction** from documents. Self-hostable, runs comfortably on a single 24GB GPU (or quantized on an M-series Mac).

**Why it matters:** Every RAG pipeline that needs to ingest PDFs/invoices/receipts currently pays GPT-4 Vision or Claude prices per page. A 4B open model that's purpose-trained for extraction shifts that to your own hardware. For an Indian MVP processing 10K documents/month, that's the difference between a $300 OCR bill and a one-time \`g4dn.xlarge\` on a spot price.

**Source:** [r/LocalLLaMA NuExtract3 thread](https://reddit.com/r/LocalLLaMA/comments/1tn8utn/nuextract3_released_openweight_4b_vlm_for/)

**Quick take:** This is the model I'd reach for first if I were rebuilding a healthcare-document pipeline today. Pair it with [pgvector](/en/notes/pinecone-vs-qdrant-vs-pgvector-india-rag-mvp-2026) for the embedding store and you have a fully self-hosted document RAG stack under $50/month infrastructure.`,
    },
    {
      heading: 'Cursor 3 Ships Parallel AI Agents',
      content: `**What:** Cursor 3 introduces native multi-agent sessions backed by Git worktrees — you can spin up two or three agents working in parallel on different feature branches inside the same IDE session.

**Why it matters:** Cursor crossed $2B ARR in Q1 2026 (LogRocket) and is the dominant AI IDE. Parallel agents is the same pattern that Claude Code shipped earlier this year — the IDE folks are catching up. The killer use case: one agent writing the feature while a second writes tests against the agent's output, both visible in split panes.

**Source:** [Cursor 3 dev.to writeup](https://dev.to/thegdsks/cursor-3-ships-parallel-ai-agents-here-is-the-multi-agent-workflow-that-actually-works-2bk8)

**Quick take:** If you're already on Cursor, upgrade and try one feature-agent + one test-agent workflow. If you're on Claude Code, you already have this — Cursor 3 is parity, not leapfrog.`,
    },
    {
      heading: 'DeepSeek Reasonix: Open Native Coding Agent (710 HN Points in 48h)',
      content: `**What:** DeepSeek dropped an open-source native coding agent called **Reasonix** with aggressive output caching and a price profile far below proprietary agents like Devin. Hit the HN front page at **710 points / 274 comments** within 48 hours.

**Why it matters:** Combined with the V4 Pro price cut above, the per-task cost of an autonomous coding agent run drops by a large multiple. This is the first credible open competitor to the Devin / Cursor-Agent / Claude-Code-Agent category — and the first one that ships as open weights + open agent loop.

**Source:** [DeepSeek Reasonix on HN](https://news.ycombinator.com/from?site=esengine.github.io)

**Quick take:** Spin it up on a side branch this weekend. The interesting question isn't "is it as good as Devin" — it's "is it good enough at one-tenth the cost." Early signal from HN comments: yes for boilerplate refactors, no for greenfield architecture decisions.`,
    },
    {
      heading: "What I'm Shipping With This Week",
      content: `Concretely: I'm wiring DeepSeek V4 Pro behind a fallback router on the next [MyFinancial](/en/projects) feature — a one-screen flow that summarizes a user's last 90 days of transactions into an English newsletter. The previous prototype ran on Claude Sonnet 4.6 and cost about ₹4 per generated newsletter. Same prompt on DeepSeek V4 Pro at the new pricing comes out near ₹0.12. If the quality holds in user testing, that's the difference between "premium-only" and "free-tier scalable."

The wiring is straightforward — a thin router in front of the OpenAI-compatible SDK that picks DeepSeek for the summary call and falls back to Claude only if the response fails a JSON schema check. Three days of work, including evals. If you've been postponing the same cost-cutover for your own product, this week's pricing news is the nudge.

The one thing I'd worry about that the README won't tell you: DeepSeek's rate limits at the new permanent pricing have already been hit by power users (see the apidog post). Budget retry-with-exponential-backoff into your router from day one, not as a post-launch fix.`,
    },
    {
      heading: 'Skip These',
      content: `**Microsoft Copilot Cowork file-exfiltration headlines.** PromptArmor's [writeup](https://www.promptarmor.com/resources/microsoft-copilot-cowork-exfiltrates-files) is real research, but the practical exposure for most teams is narrow (specific Cowork permissions + specific file types). Read it for awareness; don't rip out Copilot over it. Wait for Microsoft's mitigation guidance — it's likely landing within two weeks.

**The "Claude is not your architect" think-piece** (267 HN points). Well-written, but it's commentary on a known limitation — Claude (or any LLM) shouldn't be your sole architect. Not a release, not an action item. Save the read for the weekend.

**Tencent Hy-MT2 translation models** trending on Hugging Face. Strong models, but unless you're specifically shipping a translation pipeline, not your week.`,
    },
    {
      heading: "Need Help Wiring This Week's Drops Into Your Product?",
      content: `If you're trying to migrate AI cost down (DeepSeek), stand up a Managed Agent for an internal workflow (Gemini API), or self-host structured extraction for compliance reasons (NuExtract3), the gap is usually not the tutorial — it's the production wiring: auth, rate-limit retries, schema validation, observability, fallback routing, and the integration tests that nobody writes.

That's the [6-week MVP](/en/services/6-week-mvp) playbook — pick the right model + the right host, wire it into a shipping product, and hand over a tested codebase. If you'd rather embed a founding engineer for a longer engagement, [Hire Founding Engineer (India)](/en/services/hire-founding-engineer-india) is the right page.

Next week's roundup drops next Tuesday. If you want the per-item deep-dives, the [DeepSeek vs Claude vs GPT MVP cost post](/en/notes/deepseek-vs-claude-vs-gpt-india-mvp-cost-2026) covers the math, and [Claude Code plugins + context engineering](/en/notes/claude-code-plugins-context-engineering-2026) covers the agent-loop side.`,
    },
  ],
  cta: {
    text: 'Ship This Week’s Drops Into Your MVP — 6-Week Plan',
    href: '/en/services/6-week-mvp',
  },
};
