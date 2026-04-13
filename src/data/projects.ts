import type { Project } from '@/types/project';
export type { Project } from '@/types/project';

export const projects: Project[] = [
    {
        slug: "clinicai",
        name: "ClinicAI — WhatsApp AI Clinic Assistant",
        problem: "India has 12 lakh+ small clinics running on phone calls and paper diaries. Patients call multiple times to confirm, double bookings happen daily, and revenue leaks through manual invoicing.",
        solves: "WhatsApp-first AI assistant that handles appointment booking, reminders, and patient management for small clinics — in Hindi and English. No app downloads needed.",
        techStack: ["Spring Boot 3.5", "Java 21", "PostgreSQL 16", "Redis 7", "Twilio WhatsApp API", "Flyway", "Docker"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/clinicai",
        aiApproach: "Rule-based Hinglish intent classifier (Sprint 0) with planned LLM upgrade. Understands appointment booking, cancellation, and status queries in mixed Hindi-English.",
        image: "/images/projects/clinicai.png",
        images: [
            { src: "/images/projects/clinicai-1.png", caption: "WhatsApp Booking Flow — Hinglish Conversation" },
        ],
        details: {
            businessImpact: "500M+ Indians use WhatsApp daily. A clinic bot eliminates phone-tag, prevents double bookings, and automates follow-ups — directly on the platform patients already use. Zero training required.",
            approach: [
                "Spring Boot 3.5 + Java 21 backend with Flyway migrations (9 migration scripts)",
                "Twilio WhatsApp API for bi-directional messaging with Hindi templates",
                "Rule-based intent classifier parsing Hinglish queries (booking, cancellation, status)",
                "PostgreSQL 16 with JSONB for flexible clinic services and working hours",
                "Redis 7 for session management and conversation state caching",
                "Docker Compose for local development (PostgreSQL + Redis)"
            ],
            decisions: [
                "WhatsApp over custom app — zero friction adoption for Tier 2/3 clinics",
                "Twilio over Gupshup — better developer experience, official WhatsApp Business API",
                "Rule-based NLP first, LLM later — ship fast, iterate with real user data",
                "Hinglish support from day one — reflects actual patient communication patterns",
                "JSONB for services/hours — clinics have wildly different schedules and offerings"
            ],
            currentStatus: "Sprint 0 complete — backend scaffold, database schema, WhatsApp webhook, appointment slot engine, demo clinic seeded. All APIs verified.",
            roadmap: [
                "LLM-powered intent classification replacing rule-based system",
                "Patient registration and medical history tracking",
                "GST-compliant invoice generation",
                "Automated appointment reminders via WhatsApp",
                "Multi-clinic support with clinic onboarding flow"
            ],
            improvements: [
                "Add voice message transcription for patients who prefer speaking",
                "Consider regional language support beyond Hindi (Marathi, Tamil, Telugu)"
            ]
        }
    },
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
        slug: "sanatanapp",
        name: "SanatanApp — Hindu Devotional App",
        problem: "Devotional users in India juggle 5+ separate apps for Chalisa, Gita, Aarti, Ramayan, and Mahabharat. Most are ad-heavy, poorly designed, and lack multi-language support.",
        solves: "All-in-one Android app to read and listen to Ramayan, Mahabharat, Hanuman Chalisa, Bhagavad Gita, and Aartis — in Hindi, English, Sanskrit, Tamil, and Telugu. No login, no backend, no ads during prayers.",
        techStack: ["React Native", "Expo SDK 52+", "expo-av", "expo-sqlite", "react-i18next", "React Navigation", "AdMob"],
        status: "active",
        repoUrl: "https://play.google.com/store/apps/details?id=com.sanatandevotional.app",
        aiApproach: "No AI — pure content-first architecture. Bundled JSON texts for offline access, streamed audio from public domain sources (Archive.org). SQLite for bookmarks, favorites, and streak tracking.",
        image: "/images/projects/sanatanapp.png",
        details: {
            businessImpact: "500M+ Hindus use smartphones daily for devotion. Existing apps are fragmented and ad-heavy. SanatanApp consolidates all devotional content into one premium, private, offline-capable experience.",
            approach: [
                "React Native + Expo SDK 52+ for cross-platform Android build",
                "Bundled JSON content for Hanuman Chalisa (40 verses), Bhagavad Gita (18 chapters, 700 verses), and 5+ Aartis",
                "expo-av for streaming audio from public domain sources (Ramcharitmanas katha, Mahabharat parvas)",
                "expo-sqlite for local bookmarks, favorites, reading progress, and daily sadhana streak tracking",
                "react-i18next for 5-language support (Hindi, English, Sanskrit, Tamil, Telugu)",
                "Bottom-tab navigation with Home, Library, Player, and Settings screens"
            ],
            decisions: [
                "No backend — all data on-device for privacy and offline capability",
                "JSON-bundled texts over API fetching — keeps APK small (~15MB) and works without internet",
                "Audio streaming over bundling — keeps APK size down, leverages free public domain recordings",
                "AdMob banners only on Home/Library — never during audio playback or verse reading",
                "Devanagari-first typography with Noto Sans Devanagari in saffron color for authentic feel"
            ],
            currentStatus: "Design spec and implementation plan complete. Core screens designed: Home, Library/Collection, Verse Reader, Audio Player, Settings. Content architecture finalized.",
            roadmap: [
                "Complete React Native scaffold with Expo SDK 52+",
                "Bundle Hanuman Chalisa and Bhagavad Gita Chapter 1 JSON content",
                "Implement Verse Reader screen with Hindi/English toggle",
                "Add audio streaming with expo-av for Ramcharitmanas",
                "Daily sadhana tracker with streak counter",
                "Play Store release"
            ],
            improvements: [
                "Add offline audio downloads for devotees without reliable internet",
                "Consider iOS build once Android is validated",
                "Add push notification reminders for morning verse and evening aarti"
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
    },
    {
        name: "clinicai",
        description: "ClinicAI — WhatsApp AI clinic assistant with Spring Boot + Twilio",
        modules: ["backend", "docker-compose.yml"],
        url: "https://github.com/rohitguta2432/clinicai"
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
