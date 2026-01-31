// Real repository data sourced from GitHub API and README files
// Last updated: 2026-01-31

export interface Repository {
    name: string;
    fullName: string;
    description: string | null;
    language: string | null;
    url: string;
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'maintenance' | 'archived';
    isFork: boolean;
    modules?: string[];
    problemSolved?: string;
    contributionScope?: string;
}

export interface Contribution {
    title: string;
    type: 'open-source' | 'experiment' | 'ai-systems';
    repo: string;
    repoUrl: string;
    summary: string;
    impact?: string;
    modules?: string[];
    date: string;
}

export interface ProjectNote {
    slug: string;
    projectName: string;
    whyExists: string;
    coreTechnicalChallenge: string;
    architectureSnapshot: string[];
    tradeoffs: string[];
    currentState: string;
    repoUrl: string;
    category: 'ai-systems' | 'backend-infrastructure' | 'frontend' | 'experiments';
}

// Repositories sourced from https://api.github.com/users/rohitguta2432/repos
export const repositories: Repository[] = [
    {
        name: "backendscale",
        fullName: "rohitguta2432/backendscale",
        description: "Personal engineering site and project directory (rohitraj.tech)",
        language: "TypeScript",
        url: "https://github.com/rohitguta2432/backendscale",
        createdAt: "2026-01-31",
        updatedAt: "2026-01-31",
        status: "active",
        isFork: false,
        modules: ["src/app", "src/components", "src/data"],
        problemSolved: "Engineering work visibility — portfolios show results but not thinking",
        contributionScope: "Full implementation: Next.js 16, React 19, documentation-first design system"
    },
    {
        name: "MicroItinerary",
        fullName: "rohitguta2432/MicroItinerary",
        description: "AI-powered PWA for planning annual travel itineraries with intelligent destination suggestions and expense splitting",
        language: "Java",
        url: "https://github.com/rohitguta2432/MicroItinerary",
        createdAt: "2026-01-15",
        updatedAt: "2026-01-27",
        status: "active",
        isFork: false,
        modules: ["backend", "web", "test"],
        problemSolved: "Travel apps lack intelligent suggestions and group expense management",
        contributionScope: "Full-stack: Spring Boot 3.2.2 + Java 21 backend, React 18 + Vite PWA, OpenAI integration"
    },
    {
        name: "spring-ai-mcp-server",
        fullName: "rohitguta2432/spring-ai-mcp-server",
        description: "StellarMIND — Chat-to-SQL with pgvector. MCP server for natural language to read-only SQL queries",
        language: "Java",
        url: "https://github.com/rohitguta2432/spring-ai-mcp-server",
        createdAt: "2026-01-12",
        updatedAt: "2026-01-25",
        status: "active",
        isFork: false,
        modules: ["stellarmind-server", "stellarmind-client", "postman"],
        problemSolved: "Natural language database queries with retrieval-augmented context via pgvector",
        contributionScope: "Full MCP server implementation, pgvector integration, Chain-of-Thought UI"
    },
    {
        name: "my-expense",
        fullName: "rohitguta2432/my-expense",
        description: "Personal expense tracking application",
        language: "Java",
        url: "https://github.com/rohitguta2432/my-expense",
        createdAt: "2021-08-08",
        updatedAt: "2025-06-04",
        status: "maintenance",
        isFork: false,
        modules: ["api", "persistence", "reports"],
        problemSolved: "Simple expense tracking without bloated features",
        contributionScope: "Full-stack Java application with REST API"
    },
    {
        name: "sqs",
        fullName: "rohitguta2432/sqs",
        description: "AWS SQS integration patterns with Spring Boot",
        language: "Java",
        url: "https://github.com/rohitguta2432/sqs",
        createdAt: "2021-12-27",
        updatedAt: "2021-12-27",
        status: "archived",
        isFork: false,
        modules: ["producer", "consumer", "config"],
        problemSolved: "Reference implementation for AWS SQS with Spring Boot",
        contributionScope: "Producer/consumer patterns, retry logic, DLQ handling"
    },
    {
        name: "wealwa-api",
        fullName: "rohitguta2432/wealwa-api",
        description: "Wealth management API",
        language: "Java",
        url: "https://github.com/rohitguta2432/wealwa-api",
        createdAt: "2022-05-12",
        updatedAt: "2022-05-26",
        status: "archived",
        isFork: false,
        modules: ["api", "portfolio", "analytics"],
        problemSolved: "Personal wealth tracking and portfolio management",
        contributionScope: "REST API design, portfolio analytics"
    }
];

// Contribution feed derived from repository activity
export const contributions: Contribution[] = [
    {
        title: "rohitraj.tech Redesign",
        type: "open-source",
        repo: "backendscale",
        repoUrl: "https://github.com/rohitguta2432/backendscale",
        summary: "Complete redesign from consultancy landing page to engineer-centric project directory with documentation-first aesthetic.",
        impact: "Live at rohitraj.tech",
        modules: ["src/app", "src/components", "src/data"],
        date: "2026-01-31"
    },
    {
        title: "MicroItinerary — AI Travel Planner",
        type: "ai-systems",
        repo: "MicroItinerary",
        repoUrl: "https://github.com/rohitguta2432/MicroItinerary",
        summary: "AI-powered PWA for planning annual travel itineraries. Features intelligent destination suggestions via OpenAI GPT-4, cost estimation in INR, and Splitwise-style expense splitting for group trips.",
        impact: "Full-stack PWA with offline support, Google OAuth, Redis caching",
        modules: ["backend", "web", "docker-compose.yml"],
        date: "2026-01-27"
    },
    {
        title: "StellarMIND — Chat-to-SQL with pgvector",
        type: "ai-systems",
        repo: "spring-ai-mcp-server",
        repoUrl: "https://github.com/rohitguta2432/spring-ai-mcp-server",
        summary: "Spring Boot MCP server that converts natural language questions into read-only SQL using LLM. Retrieves schema context via pgvector for RAG-based query generation.",
        impact: "Natural language → SQL with safe read-only execution",
        modules: ["stellarmind-server", "stellarmind-client"],
        date: "2026-01-25"
    },
    {
        title: "AWS SQS Integration Patterns",
        type: "open-source",
        repo: "sqs",
        repoUrl: "https://github.com/rohitguta2432/sqs",
        summary: "Reference implementation for AWS SQS integration with Spring Boot including producer/consumer patterns, retry logic, and dead-letter queue handling.",
        modules: ["producer", "consumer"],
        date: "2021-12-27"
    }
];

// Project notes derived from actual repository README and architecture docs
export const projectNotes: ProjectNote[] = [
    {
        slug: "backendscale-architecture",
        projectName: "backendscale (rohitraj.tech)",
        whyExists: "Engineering work is often invisible. Traditional portfolios show polished results but not the thinking process.",
        coreTechnicalChallenge: "Creating a documentation-first design system that feels like internal engineering docs while remaining visually professional.",
        architectureSnapshot: [
            "Next.js 16 with App Router for static generation where possible",
            "React 19 with server components for optimal performance",
            "Tailwind v4 for utility-first styling",
            "Data-driven content structure in src/data/ for easy updates"
        ],
        tradeoffs: [
            "Chose vanilla CSS over component libraries for full control, at cost of development speed",
            "Static generation means content updates require redeployment",
            "Minimal dependencies reduce maintenance burden but limit feature velocity"
        ],
        currentState: "Production — deployed on Vercel",
        repoUrl: "https://github.com/rohitguta2432/backendscale",
        category: "frontend"
    },
    {
        slug: "microitinerary-architecture",
        projectName: "MicroItinerary",
        whyExists: "Travel apps lack intelligent suggestions based on season/budget and don't handle group expense splitting well.",
        coreTechnicalChallenge: "Integrating OpenAI GPT-4 for destination suggestions and cost estimation while maintaining offline-first PWA capabilities.",
        architectureSnapshot: [
            "React 18 + Vite PWA frontend with IndexedDB for offline support",
            "Spring Boot 3.2.2 + Java 21 backend with Flyway migrations",
            "PostgreSQL 16 + Redis caching layer",
            "Google OAuth 2.0 + JWT authentication",
            "OpenAI GPT-4 API for AI features"
        ],
        tradeoffs: [
            "PWA over native app — broader reach but limited device APIs",
            "OpenAI API adds latency and cost vs simpler rule-based suggestions",
            "Expense splitting algorithm prioritizes simplicity over Splitwise feature-parity"
        ],
        currentState: "Development — backend and frontend functional, needs polish",
        repoUrl: "https://github.com/rohitguta2432/MicroItinerary",
        category: "ai-systems"
    },
    {
        slug: "stellarmind-architecture",
        projectName: "StellarMIND (spring-ai-mcp-server)",
        whyExists: "Business users need to query databases without knowing SQL. Existing tools lack context-aware query generation.",
        coreTechnicalChallenge: "Retrieval-augmented SQL generation using pgvector for schema context, with strict read-only query enforcement for safety.",
        architectureSnapshot: [
            "Spring Boot MCP server with Tool interface for query execution",
            "pgvector for storing schema knowledge chunks and embeddings",
            "Spring AI for LLM integration (provider-agnostic)",
            "Chain-of-Thought (CoT) web interface for query debugging",
            "Read-only SQL enforcement (only SELECT, WITH allowed)"
        ],
        tradeoffs: [
            "Read-only restriction limits use cases but ensures safety",
            "pgvector requires PostgreSQL — not database-agnostic",
            "MCP transport (stdio) limits deployment patterns vs HTTP"
        ],
        currentState: "Development — core query flow working, needs UI polish",
        repoUrl: "https://github.com/rohitguta2432/spring-ai-mcp-server",
        category: "ai-systems"
    }
];

// Filter categories for the Notes page
export const filterCategories = [
    { id: 'all', label: 'All' },
    { id: 'open-source', label: 'Open Source' },
    { id: 'ai-systems', label: 'AI Systems' },
    { id: 'backend-infrastructure', label: 'Backend Infrastructure' },
    { id: 'experiments', label: 'Experiments' }
];
