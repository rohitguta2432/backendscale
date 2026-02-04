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
        whyItMatters: string;
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
            whyItMatters: "Trip planning is tedious and error-prone. Most apps just list options — they don't understand your constraints. This uses AI to actually solve the planning problem.",
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
            whyItMatters: "Data democratization requires non-technical users to access insights without engineering bottlenecks. Raw LLM-to-SQL is unreliable. RAG with schema context fixes this.",
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
        slug: "rohitraj-site",
        name: "rohitraj.tech",
        problem: "Engineering work is often invisible. Portfolios show polished results but not the thinking behind them.",
        solves: "A living project directory that documents problems, trade-offs, and architectural decisions in real-time.",
        techStack: ["Next.js 16", "React 19", "TypeScript", "Vercel"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/backendscale",
        details: {
            whyItMatters: "Hiring decisions are made based on visible artifacts. A traditional portfolio shows what you built, but not how you think. This site exposes the engineering process itself.",
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
