// Landing page AI project summaries.
// Standalone data — intentionally different shape from Project type in @/types/project.
// Uses 'title' (not 'name'), 'solution' (not 'solves'). Status 'live' means
// shipped/runnable; 'development' means work-in-progress. Not part of Project status enum.

export interface AIProjectSummary {
    title: string;
    problem: string;
    solution: string;
    techStack: string[];
    aiApproach: string;
    repoUrl: string;
    liveUrl?: string;
    status: 'live' | 'development' | 'production' | 'active';
    image?: string;
    metrics?: { label: string; value: string }[];
}

export const aiProjectSummaries: AIProjectSummary[] = [
    {
        title: "MyFinancial — Personal Financial Advisor",
        problem: "Financial planning in India is fragmented across banks, insurance, and tax documents. Most tools require sharing sensitive data with third parties.",
        solution: "Privacy-first PWA that consolidates financial data locally via a 6-step wizard — Profile, Income, Assets, Liabilities, Insurance, Tax — with real-time advisory metrics like Financial Runway and Savings Rate.",
        techStack: ["React 19", "Vite 7", "Tailwind CSS 4", "Zustand", "Dexie (IndexedDB)", "Spring Boot 3.x", "Java 21", "PostgreSQL"],
        aiApproach: "Rule-based advisory engine for Indian financial instruments (PPF, EPF, NPS). Old vs. New Tax regime comparison. Coverage gap analysis for insurance. No cloud dependency — all computation runs locally.",
        repoUrl: "https://github.com/rohitguta2432/myFinance",
        liveUrl: "https://myfinancial.in/",
        status: "live",
        image: "/images/projects/myfinancial.png",
        metrics: [
            { label: "Data privacy", value: "100% on-device" },
            { label: "Wizard completion", value: "6 steps · ~4 min" },
            { label: "Tax regimes covered", value: "Old + New" },
        ],
    },
    {
        title: "PropCheck — AI Property Trust Score for India",
        problem: "Indian property buyers lose lakhs to fraudulent listings on Magicbricks, 99acres, Housing.com, and NoBroker. Fake RERA numbers, recycled stock photos, and inflated pricing slip past buyers because no neutral tool exists to verify a listing in seconds.",
        solution: "Paste any listing URL — the AI engine scrapes the page (with an LLM parsing fallback when sites are SPA or rate-limited), cross-checks 8 trust signals against Karnataka RERA, a locality price index, and a perceptual-image database, and returns a 0–100 Trust Score with explainable red flags in 30 seconds.",
        techStack: ["Next.js 14", "Tailwind CSS", "FastAPI 0.115", "Python 3.12", "PostgreSQL 16", "SQLAlchemy 2", "httpx", "BeautifulSoup4", "imagehash", "OpenRouter (Gemma 4 31B)", "Chrome MV3"],
        aiApproach: "8-signal trust engine — listing age, price-vs-locality delta, duplicate count, RERA registration check, image reverse-search via perceptual hashing, builder complaints, owner-name match, suspicious patterns. Gemma 4 31B via OpenRouter free tier kicks in as LLM parsing fallback when scrapers fail.",
        repoUrl: "https://github.com/rohitguta2432/propTech",
        liveUrl: "https://propcheck.rohitraj.tech/",
        status: "live",
        image: "/images/projects/propcheck.png",
        metrics: [
            { label: "Trust score", value: "0–100 in 30s" },
            { label: "Signals checked", value: "8 per listing" },
            { label: "API endpoint", value: "api.rohitraj.tech" },
        ],
    },
    {
        title: "StellarMIND — Chat-to-SQL with pgvector",
        problem: "Business users need to query databases without knowing SQL. Existing tools lack context-aware query generation and safety guarantees.",
        solution: "Spring Boot MCP server that converts natural language questions into read-only SQL using LLM with retrieval-augmented context from pgvector.",
        techStack: ["Spring Boot", "Spring AI", "PostgreSQL", "pgvector", "MCP Protocol", "OpenAI"],
        aiApproach: "RAG-based SQL generation: schema knowledge stored as embeddings in pgvector, retrieved as context for LLM. Strict read-only enforcement (only SELECT/WITH).",
        repoUrl: "https://github.com/rohitguta2432/spring-ai-mcp-server",
        status: "live",
        image: "/images/projects/stellarmind.png",
        metrics: [
            { label: "Query latency p95", value: "<1.2s" },
            { label: "SQL safety", value: "100% read-only" },
            { label: "Schema embeddings", value: "pgvector" },
        ],
    },
    {
        title: "MicroItinerary — AI Travel Planner",
        problem: "Travel apps optimize for proximity and ratings. They don't consider human energy levels, group dynamics, or budget constraints intelligently.",
        solution: "AI-powered PWA that generates personalized annual travel itineraries with intelligent destination suggestions, cost estimation in INR, and Splitwise-style expense splitting.",
        techStack: ["React 18", "Vite", "Spring Boot 3.2.2", "Java 21", "PostgreSQL 16", "Redis", "OpenAI GPT-4"],
        aiApproach: "GPT-4 for destination recommendations based on season, budget, and preferences. AI-generated cost breakdowns for hotels, food, transport, and activities.",
        repoUrl: "https://github.com/rohitguta2432/MicroItinerary",
        status: "live",
        metrics: [
            { label: "Build time", value: "6 weeks" },
            { label: "GPT-4 cost / itinerary", value: "<$0.08" },
            { label: "PWA Lighthouse", value: "94/100" },
        ],
    },
];
