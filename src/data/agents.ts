// Autonomous AI agents — each aimed at a billion-dollar market. Standalone data
// (English, in code) like @/data/ai-projects, kept separate so the landing-page
// teaser and the /agents host page render the same source of truth.
//
// `demo` mounts an interactive, on-site agent (currently only "dispatchr", which
// runs deterministically via /api/agents/dispatchr — no API key, no cloud).

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
    demo?: "dispatchr";
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
