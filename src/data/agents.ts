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
    demo?: "dispatchr" | "mcpguard" | "clauseguard" | "finscope";
    metrics?: { label: string; value: string }[];
}

export const agents: AgentShowcase[] = [
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
        demo: "mcpguard",
        metrics: [
            { label: "Threat classes", value: "6" },
            { label: "Eval recall", value: "100%" },
            { label: "Runs", value: "no API key" },
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
        repoUrl: "https://github.com/rohitguta2432/founder-agent",
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
