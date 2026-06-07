import type { BlogPost } from '@/types/blog';

export const openNotebookVsKhojVsSurfsenseNotebooklm2026: BlogPost = {
  slug: 'open-notebook-vs-khoj-vs-surfsense-notebooklm-2026',
  title:
    'Open Notebook vs Khoj vs SurfSense: Best Self-Hosted NotebookLM Alternative (2026)',
  date: '2026-06-07',
  excerpt:
    "Open Notebook just hit #1 on GitHub Trending — but is it the best self-hosted NotebookLM alternative? Here's how Open Notebook (MIT), Khoj (AGPL-3.0), and SurfSense (Apache-2.0) actually compare on Docker setup, RAG architecture, integrations, and the open-source license trap that can bite a commercial build.",
  readingTime: '12 min read',
  keywords: [
    'open source notebooklm alternative',
    'self-hosted notebooklm',
    'open notebook vs khoj',
    'khoj vs surfsense',
    'notebooklm alternative 2026',
    'self-hosted ai document research',
    'open notebook self-host',
  ],
  coverImage: {
    src: '/images/notes/open-notebook-vs-khoj-vs-surfsense-notebooklm-2026-cover.jpg',
    alt: 'Dark editorial cover illustrating self-hosted open-source NotebookLM alternatives Open Notebook, Khoj and SurfSense in 2026',
  },
  relatedProject: 'myFinancial',
  sections: [
    {
      heading: 'TL;DR',
      content: `Three open-source tools now stand in for Google's NotebookLM when you need **private, self-hosted document research**: **Open Notebook** (26.7k★, MIT, v1.9.0 — **June 2, 2026**), **Khoj** (34.9k★, AGPL-3.0), and **SurfSense** (14.4k★, Apache-2.0). Pick **Open Notebook** for the most model providers and podcast generation, **SurfSense** for team integrations (Slack, Jira, Notion) on a two-tier RAG pipeline, and **Khoj** for a personal "second brain" — but watch its **AGPL-3.0 license** if you're shipping a commercial SaaS. Skip all three if you need NotebookLM's polish and don't care about data residency.`,
    },
    {
      heading:
        'Self-Hosted NotebookLM Alternatives: Open Notebook vs Khoj vs SurfSense',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

On **June 7, 2026**, the top repository on GitHub Trending wasn't a new model or an agent framework — it was [Open Notebook](https://github.com/lfnovo/open-notebook), an open-source reimplementation of Google's NotebookLM that gained **+794 stars in a single day** to cross **26,684 total**. NotebookLM's pitch is simple and sticky: drop in your PDFs, papers, and web pages, then chat with them, summarize them, and even generate a podcast from them. The problem is equally simple — it's a Google cloud product, so your confidential documents leave your infrastructure.

What changed in 2026 is that the open-source clones finally got good enough to actually replace it for private data. Three projects lead the pack, and they are genuinely different tools rather than three forks of the same idea: Open Notebook optimizes for **model flexibility and audio**, [SurfSense](https://github.com/MODSetter/SurfSense) optimizes for **team knowledge and integrations**, and [Khoj](https://github.com/khoj-ai/khoj) optimizes for a **personal, always-on second brain**.

This is the comparison I wish existed when a client asked me to "build them a private NotebookLM" last quarter. The listicles that rank for *NotebookLM alternative* (one popular [ponder.ing roundup](https://ponder.ing/blog/notebooklm-alternatives) lists sixteen tools) treat self-hosting as a footnote and never mention the open-source **license** — which, as you'll see, is the single detail most likely to bite a commercial build. Below: what each tool actually is, how to self-host one in five minutes, how their RAG pipelines differ, the AGPL trap, a side-by-side table, and how I'd ship this to production.`,
    },
    {
      heading: 'Meet the Three Contenders',
      content: `All three are open-source, self-hostable, and built around the same loop — ingest documents, embed them, retrieve relevant chunks, and answer with citations. Their priorities diverge sharply.

**Open Notebook (lfnovo/open-notebook)** — **26,684★, MIT license, TypeScript + Python.** Latest release **v1.9.0 "Esperanto 2.22 & New Audio Providers" on June 2, 2026** (its 37th release, 739 commits — a mature project, not a weekend demo). It supports **18+ providers** out of the box — OpenAI, Anthropic, Groq, Google, Vertex AI, Ollama, Mistral, DeepSeek, xAI, OpenRouter, DashScope (Qwen), MiniMax, plus OpenAI-compatible endpoints like LM Studio — and generates **1–4 speaker podcasts** from your sources. Stack: FastAPI backend, Next.js/React frontend, and **SurrealDB** for storage.

**Khoj (khoj-ai/khoj)** — **34,943★, AGPL-3.0 license, Python.** The most-starred of the three and the most "personal." Khoj brands itself as an **AI second brain**: it indexes Markdown, PDFs, GitHub repos, web pages, YouTube, and note apps like Obsidian and Notion, then layers on **agents, scheduled automations, and deep research** ([repo](https://github.com/khoj-ai/khoj)). Its latest tagged build is **2.0.0-beta.28 (March 26, 2026)**. One honest caveat reviewers repeat: NotebookLM still edges it on raw retrieval accuracy because Google tuned its RAG for document understanding ([XDA](https://www.xda-developers.com/found-open-source-notebooklm-alternative-and-its-amazing/)).

**SurfSense (MODSetter/SurfSense)** — **14,412★, Apache-2.0 license, Python.** Latest release **v0.0.26 (June 1, 2026)**, with commits as recent as **June 5** — the most actively pushed of the three. SurfSense targets **teams**: it connects to Slack, Jira, Confluence, Linear, ClickUp, Discord, Notion, Gmail, Google Calendar, and Airtable, plus external search via Tavily and LinkUp. Under the hood it runs a **two-tier RAG architecture with hybrid search and rerankers**, and claims support for **100+ LLMs and 6,000+ embedding models** ([surfsense.com](https://www.surfsense.com/)).`,
    },
    {
      heading: 'How Do You Self-Host an Open-Source NotebookLM?',
      content: `The fastest of the three to stand up is Open Notebook, because it ships a single \`docker-compose.yml\`. From the [project README](https://github.com/lfnovo/open-notebook):

\`\`\`bash
# Pull the compose file and bring the stack up
curl -o docker-compose.yml \\
  https://raw.githubusercontent.com/lfnovo/open-notebook/main/docker-compose.yml
docker compose up -d

# UI is live ~15-20s later at http://localhost:8502
# (the API runs separately on port 5055)
\`\`\`

Before you expose it to anyone, change one line in \`docker-compose.yml\` — the default \`OPEN_NOTEBOOK_ENCRYPTION_KEY=change-me-to-a-secret-string\` encrypts your stored API keys, and shipping the default is the kind of mistake that turns a private notebook into a public one. Then drop your provider keys (OpenAI, Anthropic, Ollama for fully local, etc.) into the settings UI and you're ingesting documents.

The catch worth knowing up front: Open Notebook stores everything in **SurrealDB**, not Postgres. That's fine for a single-tenant private deploy, but it's an operational dependency most teams haven't run before — budget time for backups and upgrades. **SurfSense** and **Khoj** are both Docker-Compose installs too, but they lean on Postgres with a pgvector-style vector column, which is the stack most backend teams already know. If your org standardizes on Postgres, that alone can decide the pick — the same reasoning I walked through in [Pinecone vs Qdrant vs pgvector for a RAG MVP](/en/notes/pinecone-vs-qdrant-vs-pgvector-india-rag-mvp-2026).`,
    },
    {
      heading: 'Where Does Each Tool Actually Shine?',
      content: `These tools overlap on the basics, so the right question isn't "which is best" but "best for what." Three distinct sweet spots emerge.

**Open Notebook — maximum model flexibility and audio.** If you want to keep sensitive docs on **Ollama** locally but burst to Claude or GPT for hard questions, its 18+ provider matrix and per-task model selection (different models for chat, embeddings, speech-to-text, and text-to-speech) is the most configurable of the three. The **podcast generation** is the genuinely fun differentiator — it turns a folder of research into a multi-speaker audio brief, which NotebookLM popularized and Open Notebook matches without the cloud.

**SurfSense — team knowledge that lives across tools.** Most company knowledge isn't in a folder of PDFs; it's scattered across Slack threads, Jira tickets, and Notion pages. SurfSense's connector list is its moat, and its **two-tier RAG with hybrid search and rerankers** is the most serious retrieval pipeline here — retrieve broadly with semantic + keyword search, then rerank to keep only the best passages. That reranking step is exactly the lever I leaned on to cut token waste in [LLM context compression](/en/notes/llm-context-compression-cut-token-costs-2026): fewer, better chunks beat dumping twenty mediocre ones into the prompt.

**Khoj — a personal, always-on second brain.** Khoj wins for the individual researcher or developer who lives in Obsidian and wants **scheduled automations** (a daily digest, a recurring web search) rather than an app they open on demand. Its agent and automation layer is more built-out for personal workflows than the other two. If you're storing long-term context across many sessions, the design tradeoffs echo what I covered in [open-source AI agent memory](/en/notes/open-source-ai-agent-memory-mem0-vs-zep-letta-2026).`,
    },
    {
      heading: "The License Trap: Is Khoj's AGPL-3.0 a Problem?",
      content: `Here's the section the consumer listicles skip entirely, and it's the one that can cost you a rewrite. All three are "open source," but they sit under three very different licenses, and the difference matters the moment money is involved.

- **Open Notebook — MIT.** The most permissive option. Use it, modify it, wrap it inside a closed commercial product, charge for it — MIT asks only that you keep the copyright notice. Zero friction for a SaaS.
- **SurfSense — Apache-2.0.** Also permissive and commercial-safe, with an added explicit **patent grant** that MIT lacks. For most companies, Apache-2.0 is the "boring and safe" choice legal teams approve without a meeting.
- **Khoj — AGPL-3.0.** This is the trap. AGPL is **strong copyleft with a network clause**: if you modify Khoj and offer it to users **over a network** (i.e. as a hosted SaaS), you can be obligated to release your modified source under AGPL too. For an internal tool behind your VPN, that's usually fine. For a product you sell access to, it's a genuine constraint your legal team needs to sign off on — or you negotiate a commercial license with the Khoj maintainers.

To be clear, AGPL isn't "bad" — it's a deliberate, pro-user license, and Khoj's team chose it on purpose. But "it's open source" is not the same as "I can build a closed SaaS on it," and that conflation is where I've seen teams get surprised six months in. If your endgame is a commercial product, **Open Notebook (MIT) and SurfSense (Apache-2.0) are the low-risk picks**; reach for Khoj when it's internal or personal. This is the same license diligence I apply before adopting any dependency, including the [MCP servers I harden for production](/en/notes/secure-mcp-server-typescript-2026).`,
    },
    {
      heading: 'Open Notebook vs Khoj vs SurfSense: Full Comparison',
      content: `One table, the facts that actually drive a decision. Stars and releases are as of **June 7, 2026**.

| Feature | Open Notebook | Khoj | SurfSense |
|---|---|---|---|
| **GitHub stars** | 26,684 | 34,943 | 14,412 |
| **License** | **MIT** (permissive) | **AGPL-3.0** (copyleft) | **Apache-2.0** (permissive) |
| **Language** | TypeScript + Python | Python | Python |
| **Latest release** | v1.9.0 (Jun 2, 2026) | 2.0.0-beta.28 (Mar 26) | v0.0.26 (Jun 1, 2026) |
| **Storage** | SurrealDB | Postgres-based | Postgres-based |
| **Providers** | 18+ (incl. Ollama, OpenRouter) | gpt/claude/gemini/llama/qwen/mistral | 100+ LLMs, 6,000+ embeddings |
| **RAG depth** | Vector + full-text search | Semantic embeddings | **Two-tier + hybrid + rerankers** |
| **Integrations** | File/web/audio ingest | Obsidian, Notion, GitHub, YouTube | Slack, Jira, Notion, Gmail, +more |
| **Standout feature** | **1–4 speaker podcasts** | Agents + scheduled automations | Team connectors + reranking |
| **Best for** | Flexibility + audio, commercial-safe | Personal second brain | Teams, commercial-safe |

The pattern: **Khoj has the most stars but the most restrictive license**; **SurfSense has the deepest retrieval pipeline**; **Open Notebook has the broadest provider support and the friendliest license**.`,
    },
    {
      heading: 'Which Self-Hosted NotebookLM Alternative Should You Pick?',
      content: `Skip the feature-matrix paralysis. In practice the decision collapses to three questions.

**1. Is it personal or commercial?** If it's a personal knowledge base or an internal-only tool, **Khoj** is a strong default — most stars, best automations, and AGPL doesn't bite behind your firewall. The moment it becomes something you sell access to, drop Khoj unless legal clears the AGPL network clause, and choose between Open Notebook (MIT) or SurfSense (Apache-2.0).

**2. Is the knowledge in files, or scattered across tools?** If your sources are PDFs, papers, and web pages, **Open Notebook** is the cleanest fit and gives you podcasts on top. If the knowledge lives in Slack, Jira, Confluence, and Notion — which describes most companies — **SurfSense's** connectors and reranking pipeline save you from building ingestion glue yourself.

**3. How much does retrieval quality matter?** For high-stakes Q&A where a wrong answer is expensive, **SurfSense's** two-tier RAG with rerankers is the most defensible architecture out of the box. For lighter research and summarization, Open Notebook's vector + full-text search is plenty.

My default recommendation for a **client building a private doc-Q&A product**: start with **SurfSense** if it's team-facing (Apache-2.0 + reranking + integrations), or **Open Notebook** if it's document-centric and you want the audio feature and the most permissive license. I only reach for **Khoj** when it's a personal or strictly internal deployment.`,
    },
    {
      heading: 'How I\'d Deploy This for a Client in Production',
      content: `Standing up the Docker container is the easy 10%. Here's the other 90% that decides whether a self-hosted NotebookLM is a real product or a demo that falls over.

**Put auth and a tenant boundary in front on day one.** None of these tools ships with the multi-tenant access control a real product needs. I run them behind a reverse proxy with my own auth layer (OIDC or a session gateway), and I never expose the raw service port — the same posture I argued for when [securing MCP servers](/en/notes/secure-mcp-server-typescript-2026). A "private" tool reachable on \`0.0.0.0:8502\` is not private.

**Treat the vector store as the real operational cost.** Embeddings are cheap per call and expensive at scale. On a fintech build like [myFinancial](/en/projects), the bill that crept up wasn't the LLM — it was re-embedding the entire corpus on every ingest. I batch embeddings, cache aggressively, and pick the storage engine my team can actually operate (Postgres + pgvector over a database we've never run), per [my RAG vector-store comparison](/en/notes/pinecone-vs-qdrant-vs-pgvector-india-rag-mvp-2026).

**Wire an eval gate before you trust retrieval.** Self-hosted RAG quality is *your* problem now, not Google's. I keep a small golden set of question/answer pairs and fail CI if retrieval accuracy drops below a threshold after a config or model change. Without it, a "harmless" embedding-model swap can quietly tank answer quality — exactly the invisible-failure class I flagged in [AI-generated code anti-patterns](/en/notes/ai-generated-code-anti-patterns-fixes-2026).

**Pick the license before you write a line.** As covered above, this is a five-minute decision that's nearly free to get right and very expensive to get wrong after launch.

This is the unglamorous integration work that separates a shipped feature from a science project. If you want a private, self-hosted AI document system built and hardened for production — not just \`docker compose up\` — that's the work I do: [fixed-scope 6-week MVP builds](/en/services/6-week-mvp), or [hire a founding engineer in India](/en/services/hire-founding-engineer-india) to own the whole pipeline end to end.`,
    },
  ],
  cta: {
    text: 'Ship a Private, Self-Hosted AI Document System in 6 Weeks',
    href: '/en/services/6-week-mvp',
  },
};
