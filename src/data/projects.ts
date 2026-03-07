export interface Project {
    slug: string;
    name: string;
    problem: string;
    solves: string;
    techStack: string[];
    status: 'active' | 'iterating' | 'paused';
    repoUrl?: string;
    aiApproach?: string;
    image?: string;
    images?: { src: string; caption: string }[];
    details: {
        businessImpact: string;
        approach: string[];
        decisions: string[];
        currentStatus: string;
        roadmap: string[];
        improvements: string[];
    };
}

export const projects: Project[] = [
    {
        slug: "microitinerary",
        name: "MicroItinerary — AI Travel Planner",
        problem: "Travel apps optimize for proximity and ratings. They don't consider human energy levels, group dynamics, or intelligent budget allocation.",
        solves: "AI-powered PWA that generates personalized annual travel itineraries with intelligent destination suggestions, cost estimation in INR, and Splitwise-style expense splitting.",
        techStack: ["Spring Boot 3.2.2", "Java 21", "React 18", "Vite", "PostgreSQL 16", "Redis", "OpenAI GPT-4"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/MicroItinerary",
        aiApproach: "GPT-4 for destination recommendations based on season, budget, and group preferences. AI-generated cost breakdowns for hotels, food, transport, and activities.",
        image: "/images/projects/microitinerary-1.png",
        images: [
            { src: "/images/projects/microitinerary-1.png", caption: "Dashboard - Annual Trip Calendar" },
            { src: "/images/projects/microitinerary-2.png", caption: "AI Trip Planning - Where Next?" },
            { src: "/images/projects/microitinerary-3.png", caption: "Expense Tracking & Splitting" },
            { src: "/images/projects/microitinerary-4.png", caption: "AI Recommended Destinations" },
            { src: "/images/projects/microitinerary-5.png", caption: "Finalize Trip Details" },
            { src: "/images/projects/microitinerary-6.png", caption: "Journey Scheduled Confirmation" },
        ],
        details: {
            businessImpact: "Trip planning is tedious and error-prone. Most apps just list options — they don't understand your constraints. This uses AI to actually solve the planning problem.",
            approach: [
                "Spring Boot 3.2.2 + Java 21 backend with Flyway migrations",
                "React 18 + Vite PWA frontend with offline support via IndexedDB",
                "OpenAI GPT-4 integration for intelligent destination and cost suggestions",
                "Redis caching to reduce API costs and improve response times",
                "Google OAuth 2.0 + JWT for secure authentication"
            ],
            decisions: [
                "PWA over native app — broader reach, single codebase, works offline",
                "OpenAI API adds latency and cost, but rule-based alternatives lack quality",
                "Expense splitting algorithm prioritizes simplicity over Splitwise feature-parity",
                "PostgreSQL 16 for relational data with potential for vector search later"
            ],
            currentStatus: "Backend API functional. Frontend PWA with offline sync working. AI suggestions integrated.",
            roadmap: [
                "Add calendar view for annual planning",
                "Implement real-time expense tracking",
                "Add collaborative trip editing"
            ],
            improvements: [
                "Could add caching layer for repeated AI queries",
                "Consider fine-tuning a smaller model for cost estimation"
            ]
        }
    },
    {
        slug: "stellarmind",
        name: "StellarMIND — Chat-to-SQL with RAG",
        problem: "Business users need to query databases without knowing SQL. Existing tools lack context-aware query generation and safety guarantees.",
        solves: "Spring Boot MCP server that converts natural language questions into read-only SQL using LLM with retrieval-augmented context from pgvector.",
        techStack: ["Spring Boot", "Spring AI", "PostgreSQL", "pgvector", "MCP Protocol", "OpenAI"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/spring-ai-mcp-server",
        aiApproach: "RAG-based SQL generation — schema knowledge stored as embeddings in pgvector, retrieved as context for LLM. Strict read-only enforcement (only SELECT/WITH).",
        image: "/images/projects/stellarmind.png",
        details: {
            businessImpact: "Data democratization requires non-technical users to access insights without engineering bottlenecks. Raw LLM-to-SQL is unreliable. RAG with schema context fixes this.",
            approach: [
                "Spring Boot MCP server with Tool interface for executeDataQuery",
                "pgvector for storing schema knowledge chunks and embeddings",
                "Spring AI for LLM integration (provider-agnostic — works with OpenAI, Anthropic, etc.)",
                "Chain-of-Thought (CoT) web interface for query debugging and transparency",
                "Read-only SQL enforcement via query parsing (only SELECT, WITH allowed)"
            ],
            decisions: [
                "Read-only restriction limits use cases but ensures database safety",
                "pgvector requires PostgreSQL — not database-agnostic, but worth the trade-off",
                "MCP transport (stdio) over HTTP for better AI assistant integration",
                "Separate stellarmind-server and stellarmind-client for modularity"
            ],
            currentStatus: "Core query flow working. CoT UI functional. Newman test suite passing.",
            roadmap: [
                "Add support for streaming responses",
                "Implement query history and favorites",
                "Add schema auto-discovery"
            ],
            improvements: [
                "Could add query result visualization",
                "Consider supporting multiple database connections"
            ]
        }
    },
    {
        slug: "myfinancial",
        name: "MyFinancial — Personal Financial Advisor",
        problem: "Financial planning in India is fragmented across banks, insurance, and tax documents. Most tools require sharing sensitive data with third parties.",
        solves: "Privacy-first PWA that consolidates financial data locally via a 6-step wizard — Profile, Income, Assets, Liabilities, Insurance, Tax — with real-time advisory metrics like Financial Runway and Savings Rate.",
        techStack: ["React 19", "Vite 7", "Tailwind CSS 4", "Zustand", "Dexie (IndexedDB)", "Spring Boot 3.x", "Java 21", "PostgreSQL"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/myFinance",
        aiApproach: "Rule-based advisory engine for Indian financial instruments (PPF, EPF, NPS). Old vs. New Tax regime comparison. Coverage gap analysis for insurance. No cloud dependency — all computation runs locally.",
        image: "/images/projects/myfinancial.png",
        images: [
            { src: "/images/projects/myfinancial-1.png", caption: "Landing Page — Fix Your Finances Early" },
            { src: "/images/projects/myfinancial-2.png", caption: "Step 1 — Personal Profile & Demographics" },
            { src: "/images/projects/myfinancial-3.png", caption: "Profile Filled — Employment & Residency" },
            { src: "/images/projects/myfinancial-4.png", caption: "Risk Profile — Asset Allocation Result" },
        ],
        details: {
            businessImpact: "Indians manage finances across 5-10 different platforms. No single tool consolidates bank accounts, insurance, tax, and investments — while keeping data private. MyFinancial solves this with zero cloud dependency.",
            approach: [
                "React 19 + Vite 7 PWA frontend with Tailwind CSS 4 glassmorphism design",
                "Dexie (IndexedDB) for privacy-first local data storage — no sensitive data leaves the browser",
                "Zustand for lightweight state management across the 6-step wizard",
                "Spring Boot 3.x + Java 21 backend with PostgreSQL for optional cloud sync",
                "Color-coded wizard steps with contextual financial health indicators"
            ],
            decisions: [
                "LocalStorage/IndexedDB over cloud storage — privacy is a core value proposition",
                "Rule-based engine over AI/ML — deterministic financial calculations are more trustworthy",
                "India-specific instruments (PPF, EPF, NPS, Gold) over generic global templates",
                "PWA over native app — broader reach, works offline, single codebase"
            ],
            currentStatus: "6-step wizard functional. Profile, Income, Assets, Liabilities, Insurance, and Tax screens complete. Wealth Dashboard with Net Worth scorecard and Financial Runway implemented.",
            roadmap: [
                "Add goal-based financial planning (retirement, education, home)",
                "Implement mutual fund portfolio analysis",
                "Add PDF report generation for financial health summary"
            ],
            improvements: [
                "Could add optional encrypted cloud backup for cross-device sync",
                "Consider adding AI-powered investment recommendations"
            ]
        }
    },
    {
        slug: "rohitraj-site",
        name: "rohitraj.tech",
        problem: "Engineering work is often invisible. Portfolios show polished results but not the thinking behind them.",
        solves: "A living project directory that documents problems, trade-offs, and architectural decisions in real-time.",
        techStack: ["Next.js 16", "React 19", "TypeScript", "Vercel"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/backendscale",
        details: {
            businessImpact: "Hiring decisions are made based on visible artifacts. A traditional portfolio shows what you built, but not how you think. This site exposes the engineering process itself.",
            approach: [
                "Next.js 16 with App Router for optimal performance",
                "Minimal design language inspired by documentation sites",
                "GitHub-backed content sourced from actual repositories",
                "Static generation with Vercel deployment"
            ],
            decisions: [
                "Documentation-first aesthetic over flashy portfolio style",
                "Vanilla CSS for full control, minimal dependencies",
                "Content structured as data for easy updates",
                "Focus on AI projects only — no tutorials or clones"
            ],
            currentStatus: "Live at rohitraj.tech with AI projects, Notes, and Repos sections.",
            roadmap: [
                "Add technical blog/notes with MDX",
                "Implement RSS feed",
                "Add search functionality"
            ],
            improvements: [
                "Could add dark mode toggle",
                "Consider adding project demos/recordings"
            ]
        }
    }
];

export const repos = [
    {
        name: "MicroItinerary",
        description: "AI Travel Planner — Spring Boot + React PWA with OpenAI integration",
        modules: ["backend", "web", "docker-compose.yml"],
        url: "https://github.com/rohitguta2432/MicroItinerary"
    },
    {
        name: "spring-ai-mcp-server",
        description: "StellarMIND — Chat-to-SQL with pgvector RAG and MCP protocol",
        modules: ["stellarmind-server", "stellarmind-client", "postman"],
        url: "https://github.com/rohitguta2432/spring-ai-mcp-server"
    },
    {
        name: "myFinance",
        description: "MyFinancial — Privacy-first financial planning PWA for India",
        modules: ["src", "backend", "specs"],
        url: "https://github.com/rohitguta2432/myFinance"
    },
    {
        name: "backendscale",
        description: "This site (rohitraj.tech) — personal engineering directory",
        modules: ["src/app", "src/components", "src/data"],
        url: "https://github.com/rohitguta2432/backendscale"
    }
];

export const notes = [
    {
        slug: "rag-for-sql",
        title: "Using RAG for SQL Generation",
        date: "2026-01-28",
        excerpt: "How pgvector embeddings improve LLM-to-SQL accuracy by providing schema context."
    },
    {
        slug: "spring-boot-mcp",
        title: "Building an MCP Server with Spring Boot",
        date: "2026-01-20",
        excerpt: "Implementing the Model Context Protocol for AI assistant tool integration."
    },
    {
        slug: "pwa-offline-sync",
        title: "Offline-First PWA Patterns",
        date: "2026-01-15",
        excerpt: "Service workers, IndexedDB, and background sync for MicroItinerary."
    }
];
