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
        slug: "synflow",
        name: "SynFlow — Enterprise Intelligence Platform",
        problem: "Private deal networks rely on manual introductions and spreadsheets. Matching the right profile to the right deal is slow, subjective, and misses opportunities.",
        solves: "Full-stack intelligence platform that matches deals to profiles using rule-based scoring across industry, expertise, and geography — with AI-powered profile extraction from LinkedIn and website text.",
        techStack: ["Spring Boot 3.4", "Java 21", "Next.js 14", "TypeScript", "PostgreSQL 16", "Redis 7", "OpenAI GPT-4o", "Tailwind CSS", "D3.js"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/synflow",
        aiApproach: "GPT-4o extracts structured profiles from unstructured LinkedIn/website text. Rule-based scoring algorithm matches deals to profiles by industry, expertise, and geography. AES-256 encryption for sensitive fields.",
        image: "/images/projects/synflow.png",
        details: {
            businessImpact: "Deal networks lose millions in missed connections because matching is manual. SynFlow automates profile-to-deal matching with scoring algorithms, reducing time-to-introduction from days to seconds.",
            approach: [
                "Spring Boot 3.4 + Java 21 REST API with JWT authentication and Spring Security",
                "Next.js 14 App Router frontend with TypeScript, React Query, and React Hook Form",
                "PostgreSQL 16 for relational data with Flyway migrations",
                "Redis 7 for session caching and rate limiting",
                "OpenAI GPT-4o integration for AI-powered profile generation from raw text",
                "D3.js and Recharts for dashboard visualizations and analytics",
                "AES-256 encryption for sensitive profile and deal data"
            ],
            decisions: [
                "Rule-based scoring over pure ML — explainable matches matter more than black-box predictions in deal networks",
                "REAL and SHADOW profile types — supports both verified and anonymous introductions",
                "Next.js 14 over SPA — better SEO for public-facing profile pages, server components for performance",
                "AES-256 field-level encryption — sensitive deal data encrypted at rest, not just in transit"
            ],
            currentStatus: "Full-stack application functional. Profile management, deal tracking, intelligence matching, AI profile generator, dashboard, and admin panel all working.",
            roadmap: [
                "Add real-time notifications for new deal matches",
                "Implement graph-based relationship mapping between profiles",
                "Add deal pipeline analytics with conversion tracking"
            ],
            improvements: [
                "Could add vector search for semantic profile matching",
                "Consider adding email digest for weekly match summaries"
            ]
        }
    },
    {
        slug: "finbaby",
        name: "FinBaby (Jama) — Personal Finance Tracker",
        problem: "Indian middle-class families track expenses across UPI apps, bank statements, and paper notebooks. No single tool auto-imports bank SMS, categorizes spending, and provides actionable savings advice — without cloud dependency.",
        solves: "Android app that reads bank SMS messages, auto-categorizes transactions, provides 50/30/20 budgeting, smart saving tips, and beautiful reports — all stored locally on the device.",
        techStack: ["Kotlin", "Jetpack Compose", "Material 3", "Room", "Hilt", "WorkManager", "Vico Charts", "DataStore"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/finbaby",
        aiApproach: "Rule-based SMS parser with bank sender mapping for 50+ Indian banks. Keyword-based category auto-suggestion (e.g., 'Swiggy' → Food). Smart tips engine analyzes spending patterns to generate personalized saving suggestions.",
        image: "/images/projects/finbaby.png",
        details: {
            businessImpact: "Indians transact heavily via UPI but track expenses manually if at all. FinBaby auto-imports bank SMS, removing the biggest friction — data entry. 50/30/20 budgeting makes financial planning accessible to first-time earners.",
            approach: [
                "Kotlin + Jetpack Compose with Material 3 for modern Android UI",
                "Room database for local SQLite storage of all transactions",
                "Hilt for dependency injection across the entire app",
                "SMS reader with bank sender mapping for 50+ Indian banks (SBI, HDFC, ICICI, etc.)",
                "WorkManager for background tasks — daily reminders, recurring transactions, budget alerts",
                "Vico charts library for donut charts, daily bar charts, and monthly trend visualizations",
                "DataStore Preferences for settings and user preferences"
            ],
            decisions: [
                "Fully offline — no cloud, no sign-up, no bank linking. Privacy is non-negotiable",
                "SMS auto-import over manual entry — solves the biggest adoption killer (data entry fatigue)",
                "50/30/20 budgeting over complex categories — simplicity drives adoption for first-time budgeters",
                "JSON backup/restore over cloud sync — users own their data completely",
                "Biometric lock — finance data is sensitive, security without friction"
            ],
            currentStatus: "Core app functional — SMS auto-import, manual entry, budgeting, reports, smart tips, search, CSV export, backup/restore, biometric lock, and daily reminders all implemented.",
            roadmap: [
                "Add recurring transaction templates for rent, EMIs, subscriptions",
                "Implement investment tracking (mutual funds, FDs, PPF)",
                "Add family mode with shared budgets between partners"
            ],
            improvements: [
                "Could add ML-based category prediction as SMS patterns grow",
                "Consider adding UPI transaction parsing from notification access"
            ]
        }
    },
    {
        slug: "retailos",
        name: "RetailOS — Multi-Tenant Retail SaaS",
        problem: "Indian kirana stores and small retailers use paper registers or basic billing software with no inventory tracking, no GST compliance, and no offline support. Enterprise POS systems are too expensive and complex.",
        solves: "India-first multi-tenant retail SaaS platform with billing, inventory, GST invoicing, khata (credit ledger), offline sync, and analytics — all in one platform with complete tenant isolation.",
        techStack: ["Spring Boot 3.4.3", "Java 21", "PostgreSQL 16", "Redis 7", "MinIO", "Flyway", "Docker"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/retailos",
        aiApproach: "No AI — pure domain-driven architecture. 12-module Maven monorepo with tenant isolation at every layer. Offline sync with conflict resolution for unreliable internet scenarios common in Tier 2/3 India.",
        image: "/images/projects/retailos.png",
        details: {
            businessImpact: "India's retail sector is 90% unorganized. Small retailers need affordable, GST-compliant software that works offline. RetailOS delivers enterprise features at SME pricing with multi-tenant architecture enabling infinite scale.",
            approach: [
                "Spring Boot 3.4.3 + Java 21 with Maven multi-module architecture (12 modules)",
                "PostgreSQL 16 with row-level tenant isolation and Flyway migrations",
                "Redis 7 for session management, caching, and rate limiting",
                "MinIO (S3-compatible) for file storage — product images, invoices, KYC documents",
                "Dedicated modules: auth, tenant, KYC, inventory, billing, invoicing, khata, file, sync, analytics, admin, audit",
                "Offline sync module with queue-based conflict resolution",
                "DPDP consent management in KYC module for regulatory compliance"
            ],
            decisions: [
                "Multi-module monorepo over microservices — faster development, simpler deployment for early stage",
                "Row-level tenant isolation over schema-per-tenant — scales to thousands of tenants without DB overhead",
                "MinIO over AWS S3 — self-hosted for cost control, S3-compatible for future migration",
                "Khata module as first-class citizen — credit ledger is how 70% of Indian retail actually works",
                "Offline sync with conflict resolution — internet is unreliable in target markets"
            ],
            currentStatus: "Full platform scaffold with 12 modules. Auth with JWT + OTP, tenant management, inventory CRUD, billing/POS, GST invoice generation, khata ledger, file uploads, and audit trail all functional.",
            roadmap: [
                "Add barcode scanning for inventory management",
                "Implement multi-warehouse stock transfers",
                "Add WhatsApp invoice sharing for customers",
                "Build React Native mobile POS app"
            ],
            improvements: [
                "Could add AI-powered demand forecasting for inventory optimization",
                "Consider adding payment gateway integration for digital payments"
            ]
        }
    },
    {
        slug: "triphive",
        name: "TripHive — Offline-First Collaborative Trip Planner",
        problem: "Group trip planning is fragmented across WhatsApp, Google Docs, Maps, Splitwise, and email. Nothing talks to each other, and every app breaks the moment you lose WiFi — exactly when you need it most.",
        solves: "One offline-first app that combines collaborative itineraries, interactive offline maps, expense splitting, group polls, and packing lists — anyone can join with just a link, no login required.",
        techStack: ["React Native", "Expo", "TypeScript", "WatermelonDB", "PowerSync", "MapLibre GL", "Supabase", "Firebase"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/triphive",
        aiApproach: "No AI — architecture-first approach. WatermelonDB for offline-first local storage with PowerSync for transparent background syncing. MapLibre GL + Protomaps for downloadable offline map tiles.",
        image: "/images/projects/triphive.png",
        details: {
            businessImpact: "Group travelers currently juggle 5+ tools. TripHive replaces all of them with one offline-capable app. The 'join with a link, no login' model removes the biggest adoption barrier for group apps.",
            approach: [
                "React Native + Expo + TypeScript for cross-platform mobile development",
                "WatermelonDB for offline-first local database with lazy loading",
                "PowerSync for delta-based background sync when connectivity returns",
                "MapLibre GL + Protomaps for interactive maps with downloadable offline tiles",
                "Supabase for backend (Auth, Postgres, Realtime, Storage) — zero custom backend code",
                "Firebase Cloud Messaging for push notifications",
                "RevenueCat for freemium subscription management"
            ],
            decisions: [
                "Offline-first over online-first — trips happen in airports, foreign countries, and rural areas with no WiFi",
                "WatermelonDB over Realm — better React Native integration, true lazy loading, SQLite under the hood",
                "Supabase over custom backend — ship faster, Realtime subscriptions built-in, generous free tier",
                "No login to join — share a link, friends see the plan instantly. Removes the #1 group adoption killer",
                "MapLibre over Google Maps — offline tile downloads, no per-request API costs"
            ],
            currentStatus: "Complete product spec with 10 specification documents, 25 UI screen designs, technical architecture, monetization strategy, and week-by-week development roadmap finalized.",
            roadmap: [
                "Implement core React Native scaffold with Expo",
                "Build offline-first itinerary CRUD with WatermelonDB",
                "Add MapLibre integration with offline tile downloads",
                "Implement expense splitting with real-time sync",
                "Launch beta on Google Play Store"
            ],
            improvements: [
                "Could add AI-powered itinerary suggestions based on destination and group preferences",
                "Consider adding flight/hotel price tracking integration"
            ]
        }
    },
    {
        slug: "scamrakshak",
        name: "ScamRakshak — On-Device AI Scam Detector",
        problem: "Indians lose thousands of crores annually to digital scams via WhatsApp, SMS, and social media. Existing solutions require internet, collect user data, or lack Indian language support.",
        solves: "Fully offline Android app that analyzes suspicious messages, screenshots, URLs, and UPI IDs using a 3-tier on-device AI engine — with bilingual explanations in Hindi and English. Zero data collection, zero internet required.",
        techStack: ["Kotlin", "Jetpack Compose", "Material 3", "Hilt", "Room", "ML Kit GenAI (Gemma 4)", "LiteRT", "CameraX"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/scamrakshak",
        aiApproach: "3-tier inference engine: Tier 1 — ML Kit GenAI with Gemma 4 on-device LLM for deep analysis. Tier 2 — LiteRT (TFLite successor) for lightweight scam classification. Tier 3 — Rule-based regex engine as universal fallback. All inference runs on-device with zero network calls.",
        image: "/images/projects/scamrakshak.png",
        details: {
            businessImpact: "Digital scams cost Indians ₹1,750+ crore annually. Victims are often non-technical users who can't evaluate suspicious messages. ScamRakshak gives instant risk scores with Hindi explanations — no internet, no data sharing, no technical knowledge required.",
            approach: [
                "Kotlin + Jetpack Compose with Material 3 for modern Android UI",
                "3-tier AI inference: ML Kit Gemma 4 → LiteRT → Rule-based regex (graceful degradation)",
                "Room database for scam pattern storage and scan history",
                "CameraX for screenshot capture and OCR-based text extraction",
                "Hilt for dependency injection across the entire app",
                "Bilingual output (Hindi + English) for every scam analysis",
                "Zero network permissions — the app physically cannot send data anywhere"
            ],
            decisions: [
                "3-tier fallback over single model — ensures every device gets protection regardless of hardware",
                "On-device only over cloud AI — privacy is the core promise, not a feature",
                "Hindi-first over English-only — target users communicate primarily in Hindi and Hinglish",
                "UPI ID analysis included — UPI scams are the fastest-growing fraud vector in India",
                "Zero permissions model — builds trust with privacy-conscious users"
            ],
            currentStatus: "Architecture finalized with 3-tier AI inference engine. Kotlin scaffold with Jetpack Compose, Room, Hilt, and CameraX integration. Rule-based regex engine (Tier 3) operational as universal fallback.",
            roadmap: [
                "Integrate ML Kit GenAI with Gemma 4 for on-device LLM analysis",
                "Add screenshot OCR pipeline with CameraX",
                "Implement URL safety checker with pattern matching",
                "Add UPI ID verification against known scam databases",
                "Launch on Google Play Store"
            ],
            improvements: [
                "Could add community-sourced scam pattern updates via signed JSON bundles",
                "Consider adding regional language support beyond Hindi (Tamil, Telugu, Marathi)"
            ]
        }
    },
    {
        slug: "paisaguard",
        name: "PaisaGuard — Family Budget Survival App",
        problem: "Middle-class families worldwide track expenses inconsistently — UPI apps show transactions but don't enforce budgets. No tool combines expense tracking, grocery budgeting, bill calendars, debt management, and family splitting in one offline app.",
        solves: "Privacy-first, fully offline Android app with 8 financial modules: expense tracking, grocery budget mode, bill calendar, emergency fund tracker, debt snowball, affordability calculator, family expense splitting, and auto-generated monthly reports.",
        techStack: ["Kotlin", "Jetpack Compose", "Material 3", "Room", "Hilt", "WorkManager", "DataStore"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/paisaguard",
        aiApproach: "No AI — rule-based financial engines. Debt snowball algorithm for optimal payoff ordering. Smart category auto-suggestion from keywords. Budget health indicators with color-coded alerts (green/orange/red).",
        image: "/images/projects/paisaguard.png",
        details: {
            businessImpact: "Middle-class families need financial discipline tools, not investment advice. PaisaGuard focuses on the fundamentals — tracking, budgeting, and debt elimination — with a grocery shopping mode that no competitor offers.",
            approach: [
                "Kotlin + Jetpack Compose with Material 3 for modern Android UI",
                "Room database for all financial data — expenses, bills, debts, emergency fund",
                "8 core modules: expense tracking, grocery budget, bill calendar, emergency fund, debt snowball, affordability calculator, family splitting, monthly reports",
                "WorkManager for bill reminders, budget alerts, and monthly report generation",
                "Hilt for dependency injection across all modules",
                "Numpad-style amount input for sub-5-second expense logging",
                "DataStore Preferences for settings and family member profiles"
            ],
            decisions: [
                "Fully offline — no backend, no sign-up, no bank linking. Privacy is non-negotiable",
                "8 modules in one app over separate tools — families need one financial command center",
                "Grocery shopping mode as differentiator — real-time budget tracker with checklist during shopping",
                "Debt snowball over avalanche — psychologically more motivating for target users",
                "Family splitting built-in — 'who spent' toggle on every expense, not a separate Splitwise-like flow"
            ],
            currentStatus: "Complete product specification with 8 user stories, acceptance scenarios, data models, UI design system, and development plan finalized. Core scaffold with Room, Hilt, and Navigation Compose in place.",
            roadmap: [
                "Implement dashboard with monthly balance and quick stats grid",
                "Build expense logging with sub-5-second target",
                "Add grocery shopping mode with live budget bar",
                "Implement bill calendar with reminder notifications",
                "Add debt snowball tracker with payoff timeline",
                "Launch on Google Play Store"
            ],
            improvements: [
                "Could add receipt scanning with on-device OCR for automatic expense entry",
                "Consider adding export to Excel for users who want spreadsheet analysis"
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
    },
    {
        name: "synflow",
        description: "SynFlow — Enterprise intelligence and deal matching with Spring Boot + Next.js + GPT-4o",
        modules: ["synflow-api", "synflow-web", "docker-compose.yml"],
        url: "https://github.com/rohitguta2432/synflow"
    },
    {
        name: "finbaby",
        description: "FinBaby (Jama) — Android finance tracker with SMS auto-import, Kotlin + Jetpack Compose",
        modules: ["app/src/main/java/com/finbaby/app"],
        url: "https://github.com/rohitguta2432/finbaby"
    },
    {
        name: "retailos",
        description: "RetailOS — Multi-tenant retail SaaS with 12-module Spring Boot monorepo",
        modules: ["retailos-auth", "retailos-tenant", "retailos-inventory", "retailos-billing", "retailos-invoice", "retailos-khata"],
        url: "https://github.com/rohitguta2432/retailos"
    },
    {
        name: "triphive",
        description: "TripHive — Offline-first collaborative trip planner with React Native + WatermelonDB",
        modules: ["specs", "designs"],
        url: "https://github.com/rohitguta2432/triphive"
    },
    {
        name: "scamrakshak",
        description: "ScamRakshak — On-device AI scam detector with 3-tier inference engine, Kotlin + Gemma 4",
        modules: ["app"],
        url: "https://github.com/rohitguta2432/scamrakshak"
    },
    {
        name: "paisaguard",
        description: "PaisaGuard — Family budget survival app with 8 financial modules, Kotlin + Jetpack Compose",
        modules: ["app", "specs"],
        url: "https://github.com/rohitguta2432/paisaguard"
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
