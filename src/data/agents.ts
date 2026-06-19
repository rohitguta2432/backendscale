// Autonomous AI agents — each aimed at a billion-dollar market. Standalone data
// (English, in code) like @/data/ai-projects, kept separate so the landing-page
// teaser and the /agents host page render the same source of truth.
//
// `demo` mounts an interactive, on-site agent in the AgentLab. Each runs
// deterministically via /api/agents/<slug> — no API key, no cloud.

export interface AgentShowcase {
    slug: string;
    name: string;
    /** The billion-dollar market this agent goes after. */
    market: string;
    marketSize: string;
    problem: string;
    solution: string;
    /** What it does on its own — the "agent" part. */
    autonomy: string;
    techStack: string[];
    status: "live" | "development" | "production" | "active";
    repoUrl?: string;
    liveUrl?: string;
    demo?: "resolvr" | "dispatchr" | "mcpguard" | "clauseguard" | "finscope" | "cadence" | "prospectr" | "loopr";
    /** Optional screenshot of the standalone product, served from /public. */
    screenshot?: string;
    /** Optional dedicated landing page (without locale prefix), e.g. /agents/resolvr. */
    detailPath?: string;
    /** Keyword-rich anchor text for the internal link to the detail page. */
    detailLabel?: string;
    metrics?: { label: string; value: string }[];
}

export const agents: AgentShowcase[] = [
    {
        slug: "resolvr",
        name: "Resolvr — Autonomous Support Resolution Agent",
        market: "Autonomous customer-support resolution",
        marketSize: "$15.1B (2026) → $117.9B (2034), 25.8% CAGR · Gartner: 80% of routine support AI-handled in 2026",
        problem:
            "Support teams drown in repetitive tier-1 tickets — password resets, invoices, how-tos. Hiring to keep up is expensive, queues blow out, and naive auto-replies hallucinate policy or promise refunds no one approved.",
        solution:
            "A standalone full-stack product (FastAPI + React) that takes a raw support ticket to a finished outcome on its own: it classifies the request, retrieves the right knowledge-base articles by semantic search, decides whether it can safely resolve or must escalate, and drafts the reply grounded strictly in the KB — never inventing policy and never promising a refund.",
        autonomy:
            "A four-tool loop — classify_ticket → search_kb → decide_action → draft_resolution. Retrieval is real RAG (Ollama embeddings + cosine); the reply is written by a local Ollama model (qwen2.5:14b), falling back to a cloud API key, then to a template, so it self-hosts at zero per-token cost. A hard safety gate forces escalation on security, legal, abuse, and refund tickets — proven at 100% must-escalate recall by the pytest eval suite. Try the lite in-browser demo below; the full product runs separately.",
        techStack: ["FastAPI (Python)", "React + Vite", "Ollama + cloud-API fallback", "Semantic RAG (embeddings)", "SQLite", "pytest eval-gated"],
        status: "live",
        repoUrl: "https://github.com/rohitguta2432/resolvr",
        demo: "resolvr",
        screenshot: "/agents/resolvr.png",
        detailPath: "/agents/resolvr",
        detailLabel: "Self-hosted AI support agent — full guide",
        metrics: [
            { label: "Must-escalate recall", value: "100%" },
            { label: "LLM backend", value: "Ollama + API" },
            { label: "Stack", value: "FastAPI + React" },
        ],
    },
    {
        slug: "loopr",
        name: "Loopr — Self-Improving Prompt-Optimization Loop",
        market: "LLM evaluation & prompt optimization (LLMOps)",
        marketSize: "Fastest-growing dev-tool category of 2026 · GEPA-style reflective evolution beats RL by 20% with 35x fewer rollouts",
        problem:
            "Every LLM team tunes prompts by hand — change a word, eyeball a few outputs, repeat. There is no cheap, local way to answer \"which prompt actually works best for this task?\", and the eval incumbents (MLflow, Confident AI, Opik, LangWatch) are heavyweight hosted platforms you have to adopt.",
        solution:
            "A drop-in loop that takes a task prompt plus a handful of eval cases and evolves the prompt on its own: it runs the prompt, scores every output, reflects on the failures in plain language, rewrites the prompt, and repeats until it converges on the best-performing version — emitting a transparent trace of every iteration.",
        autonomy:
            "A run → score → reflect → rewrite loop (GEPA-lite reflective evolution). Scoring and the stop decision are deterministic and eval-gated — the LLM only runs the task and phrases the reflection — so a run is reproducible and a bad rewrite can never corrupt state. It stops on converged, plateau, or budget. Five scorers (exact, contains, regex, json_field, llm_judge); local-first on Ollama (qwen2.5) with OpenAI/Anthropic fallback at zero per-token cost. Proven 0% → 100% on a JSON-extraction task in one iteration; a 28-case pytest suite gates the deterministic core.",
        techStack: ["Python", "Ollama + cloud-API fallback", "GEPA-lite reflective loop", "Deterministic scorers", "pytest eval-gated", "stdlib-only HTTP"],
        status: "live",
        repoUrl: "https://github.com/rohitguta2432/loopr",
        demo: "loopr",
        metrics: [
            { label: "Prompt lift (demo)", value: "0% → 100%" },
            { label: "Tests passing", value: "28 / 28" },
            { label: "Cost / run", value: "$0 local" },
        ],
    },
    {
        slug: "dispatchr",
        name: "Dispatchr — Autonomous Home-Services Dispatcher",
        market: "AI front desk for home services",
        marketSize: "$600B+ US home services · AI receptionists a breakout 2026 category",
        problem:
            "Home-services businesses (HVAC, plumbing, electrical) bleed revenue from missed calls and slow replies. A round-the-clock human dispatcher is expensive, and after-hours leads simply go cold.",
        solution:
            "An agent that takes a customer from \"I have a problem\" to a booked appointment on its own — it classifies the job, quotes only from a real price book, offers genuine open slots, and books the technician. No human in the loop for the happy path.",
        autonomy:
            "A transparent tool-calling loop: classify → get_price_estimate → find_available_slots → book_job. A hard safety rule overrides everything — any hint of gas, fire, smoke, sparks, shock, or flooding triggers an immediate hand-off to a human. Decisions are deterministic and gated by a 26-case eval suite.",
        techStack: ["TypeScript", "Next.js API route", "Tool-calling loop", "Eval gate", "OpenAI-compatible (swappable)"],
        status: "live",
        repoUrl: "https://github.com/rohitguta2432/dispatchr",
        demo: "dispatchr",
        metrics: [
            { label: "Eval pass rate", value: "26 / 26" },
            { label: "Emergency recall", value: "100%" },
            { label: "Over-escalation", value: "0%" },
        ],
    },
    {
        slug: "clauseguard",
        name: "ClauseGuard — AI Contract Risk Review",
        market: "Contract review for freelancers & SMBs",
        marketSize: "$10B+ legaltech · every freelancer and small business signs contracts they never fully read",
        problem:
            "Freelancers and small businesses sign NDAs, MSAs, and SaaS terms they never fully read — then get caught by uncapped liability, IP over-assignment, non-competes, auto-renewals, and Net-90 payment traps.",
        solution:
            "A first-pass reviewer that reads a contract, flags each risky clause with the exact offending quote, explains in plain English why it matters, and proposes a concrete redline — and it also flags protective clauses that are missing entirely.",
        autonomy:
            "A deterministic 16-rule playbook plus absence checks runs offline with no API key, ranks every finding high / medium / low, and produces a stable risk grade. The same playbook anchors the eval suite.",
        techStack: ["TypeScript", "Next.js API route", "Rule playbook", "Offline-first", "Eval-gated"],
        status: "live",
        demo: "clauseguard",
        metrics: [
            { label: "Clause rules", value: "16 +" },
            { label: "Categories", value: "9" },
            { label: "Runs", value: "offline" },
        ],
    },
    {
        slug: "finscope",
        name: "FinScope — Portfolio X-Ray (educational)",
        market: "Personal-finance diagnostics for India",
        marketSize: "Crores of Indian mutual-fund investors · almost none audit overlap, cost, or tax drag",
        problem:
            "Retail investors hold overlapping funds, pay above-median expense ratios, trip short-term capital-gains taxes, and run concentrated or under-cushioned portfolios — with no easy way to see any of it.",
        solution:
            "An X-ray that scores a portfolio across six dimensions — allocation drift, fund overlap, expense drag, tax efficiency, concentration, and emergency fund — and turns every issue into a specific question to take to a SEBI-registered advisor.",
        autonomy:
            "Deterministic analysers crunch the numbers while a hard compliance gate guarantees the output never says buy, sell, or switch. It flags and explains — every flag ends with a question for a SEBI-registered RIA, never a recommendation.",
        techStack: ["TypeScript", "Next.js API route", "Deterministic analysers", "Compliance gate", "Eval-gated"],
        status: "live",
        repoUrl: "https://github.com/rohitguta2432/finscope",
        demo: "finscope",
        metrics: [
            { label: "Health checks", value: "6 dims" },
            { label: "Compliance", value: "0 violations" },
            { label: "Advice given", value: "never" },
        ],
    },
    {
        slug: "mcpguard",
        name: "MCPGuard — MCP Manifest Security Scanner",
        market: "Security for the agentic / MCP supply chain",
        marketSize: "AI-agent security a breakout 2026 category · every third-party MCP tool is new attack surface",
        problem:
            "AI agents now load third-party MCP tools whose manifests can carry hidden prompt injections, exfiltration directives, embedded secrets, or shell access — and almost nobody scans them before wiring them into an agent.",
        solution:
            "A scanner that statically inspects an MCP manifest and flags the dangerous patterns — prompt injection in descriptions, tool poisoning / cross-tool hijacks, over-permissioned shell commands, leaked credentials, wildcard scopes, and unauthenticated dangerous tools — each with a concrete fix.",
        autonomy:
            "Six deterministic check families run with zero network and no LLM, grade the manifest A–F, and return the exact evidence that tripped each rule. A faithful port of a Python core that scores 100% recall on its eval suite.",
        techStack: ["TypeScript", "Next.js API route", "Static analysis", "Zero-network", "Eval-gated"],
        status: "live",
        repoUrl: "https://github.com/rohitguta2432/mcpguard",
        demo: "mcpguard",
        metrics: [
            { label: "Threat classes", value: "6" },
            { label: "Eval recall", value: "100%" },
            { label: "Runs", value: "no API key" },
        ],
    },
    {
        slug: "cadence",
        name: "Cadence — Autonomous SEO Content Agent",
        market: "Programmatic content marketing",
        marketSize: "$400B+ content marketing · AI is rewriting how brands win organic traffic",
        problem:
            "Content marketing stalls on the boring middle: drafting publish-ready posts, hitting SEO structure, and keeping quality consistent at volume. Hand-written posts don't scale; AI drafts are inconsistent and often skip the on-page SEO that actually ranks.",
        solution:
            "An agent that takes a topic to a publish-ready SEO post on its own — title, meta, slug, body, FAQ, and JSON-LD schema — then runs a structural linter that grades it pass/fail before it ever ships. The same topic always produces the same audited draft.",
        autonomy:
            "A four-tool pipeline: pick_topic → draft_post → validate_seo → save_post. The linter runs a 10-point structural check and the agent auto-revises once on failure. Fully deterministic, no API key — gated by a quality suite covering SEO validity, keyword placement, and schema.",
        techStack: ["TypeScript", "Next.js API route", "Content pipeline", "Structural linter", "Eval-gated"],
        status: "live",
        repoUrl: "https://github.com/rohitguta2432/cadence",
        demo: "cadence",
        metrics: [
            { label: "SEO validity", value: "100%" },
            { label: "Schema validity", value: "100%" },
            { label: "Runs", value: "no API key" },
        ],
    },
    {
        slug: "prospectr",
        name: "Prospectr — Autonomous Outbound BD Agent",
        market: "Outbound sales & lead generation",
        marketSize: "$30B+ sales engagement · outbound is mostly manual, spammy, and low-conversion",
        problem:
            "Outbound BD is a grind: verifying emails, scoring whether a lead even fits, and writing a pitch that doesn't read like a template. Done by hand it's slow; done by naive automation it's spam that torches sender reputation.",
        solution:
            "An agent that takes a raw lead to a personalized, queue-ready pitch — it verifies the email, scores fit 0–100 against a fixed ICP, and only for keepers drafts a ≤140-word pitch with no placeholder leaks. A blocklist gate suppresses bad domains before anything is queued.",
        autonomy:
            "A four-tool pipeline: enrich_lead → score_fit → draft_pitch → queue_send. Sending is dry-run by design — it physically cannot transmit — and a safety gate suppresses blocklisted domains. Deterministic and eval-gated on fit accuracy, personalization, and blocklist suppression.",
        techStack: ["TypeScript", "Next.js API route", "ICP scorer", "Safety gate", "Dry-run only"],
        status: "live",
        repoUrl: "https://github.com/rohitguta2432/prospectr",
        demo: "prospectr",
        metrics: [
            { label: "Fit accuracy", value: "100%" },
            { label: "Blocklist suppression", value: "100%" },
            { label: "Placeholder leaks", value: "0" },
        ],
    },
    {
        slug: "founder-agent",
        name: "Founder-Agent — Autonomous Startup Operator",
        market: "Turning a fintech audience into a product",
        marketSize: "India personal finance · target 10M weekly users, ₹1,000 Cr+ ARR",
        problem:
            "Solo founders stall in the gap between insight and execution. Strategy work is endless, easy to procrastinate, and rarely compounds into something the next day can build on.",
        solution:
            "An autonomous operator that, every run, reads the mission, picks the single highest-leverage next move, and ships a concrete artifact — a spec, funnel copy, a validation experiment. The artifacts stack up; each one is something a competent operator could execute tomorrow.",
        autonomy:
            "A DECIDE → EXECUTE → COMMIT loop with forced-JSON decisions, an append-only journal, and persistent state memory. Runs 100% locally on Ollama — no API key, no cloud, no per-token cost — so it can grind indefinitely.",
        techStack: ["Python", "Ollama", "qwen2.5 / hermes3", "Forced-JSON tool use", "Local-first"],
        status: "active",
        metrics: [
            { label: "Runs", value: "100% local" },
            { label: "Artifacts shipped", value: "5+" },
            { label: "Cost / run", value: "$0" },
        ],
    },
    {
        slug: "geo-engine",
        name: "GEO Engine — Generative Engine Optimization",
        market: "Getting brands cited by AI search",
        marketSize: "$1.48B → $17B by 2030 · 45.5% CAGR",
        problem:
            "Classic SEO is collapsing — 93% of AI answers are zero-click and rarely cite the brands behind them. Companies are going invisible inside ChatGPT, Perplexity, and AI Overviews. The funded incumbents only measure that invisibility; they don't fix it.",
        solution:
            "An execution-layer agent that auto-generates and publishes AI-citation-bait content — comparison pages, structured Q&A, schema markup — then measures citation lift. It closes the gap incumbents leave open: actually making a brand answerable, not just dashboarding the damage.",
        autonomy:
            "Built on the same zero-CAC content engine that already ranks my own sites organically — the pipeline researches a topic, drafts citation-optimized content, publishes, and tracks whether AI engines start citing it.",
        techStack: ["Next.js", "TypeScript", "Content pipeline", "Structured data / schema", "Citation tracking"],
        status: "development",
        repoUrl: "https://github.com/rohitguta2432/geo-engine",
        metrics: [
            { label: "Market CAGR", value: "45.5%" },
            { label: "TAM by 2030", value: "$17B" },
            { label: "Crosses $1B", value: "2027" },
        ],
    },
];
