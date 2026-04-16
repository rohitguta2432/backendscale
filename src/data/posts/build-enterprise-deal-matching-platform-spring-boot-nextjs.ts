import type { BlogPost } from '@/types/blog';

export const buildEnterpriseDealMatchingPlatformSpringBootNextjs: BlogPost = {
  slug: 'build-enterprise-deal-matching-platform-spring-boot-nextjs',
  title: 'How I Built an Enterprise Deal Matching Platform with Spring Boot + Next.js + GPT-4o',
  date: '2026-04-16',
  excerpt: 'Architecture deep-dive into SynFlow — a full-stack intelligence platform that matches deals to profiles using rule-based scoring and AI-powered profile extraction from LinkedIn text.',
  readingTime: '10 min read',
  keywords: ['enterprise deal matching platform', 'spring boot nextjs full stack', 'gpt-4o profile extraction', 'deal intelligence software', 'java 21 spring boot 3.4'],
  relatedProject: 'synflow',
  sections: [
    {
      heading: 'The Problem: Deal Networks Run on Spreadsheets',
      content: `I built SynFlow, a full-stack enterprise deal matching platform using Spring Boot 3.4, Next.js 14, and GPT-4o that automatically scores and matches investor profiles to deals using a rule-based algorithm with AI-powered profile extraction from unstructured LinkedIn text — replacing the spreadsheets and manual introductions that dominate private deal networks today.

Private deal networks — venture capital intros, M&A matchmaking, investment banking deal flow — still run on spreadsheets and manual introductions. A partner sees a deal, mentally maps it to someone in their network, and sends an email. If they forget, the match never happens.

This is a $200B+ industry where opportunity cost is measured in missed connections. The core challenge isn't information — it's matching. How do you systematically connect the right profile to the right deal across industry, geography, and expertise?

SynFlow solves exactly this. Not another CRM. Not another LinkedIn. A purpose-built intelligence platform where every profile and every deal gets scored, matched, and surfaced automatically.`
    },
    {
      heading: 'Why Did I Choose Spring Boot + Next.js for the Architecture?',
      content: `**Backend: Spring Boot 3.4 + Java 21**

The backend needed to handle complex matching algorithms, encrypted data at rest, and JWT-secured API endpoints. Spring Boot was the clear choice:

- **Spring Security** for JWT authentication with role-based access (admin, analyst, viewer)
- **Spring Data JPA** with PostgreSQL 16 for relational data — profiles, deals, matches, and audit logs
- **Flyway** for versioned database migrations
- **Redis 7** for session caching and rate limiting

\`\`\`
synflow-api/
├── config/         # Security, CORS, encryption config
├── controller/     # REST endpoints for profiles, deals, matches
├── service/        # Business logic + matching algorithm
├── repository/     # JPA repositories
├── model/          # Entity classes with @Column encryption
└── ai/             # OpenAI GPT-4o integration
\`\`\`

**Frontend: Next.js 14 + TypeScript**

The frontend needed server-rendered pages for SEO (public profile pages), client-side interactivity for the dashboard, and real-time data fetching. Next.js 14 App Router with:

- **React Query** for server state management and caching
- **React Hook Form + Zod** for type-safe form validation
- **Tailwind CSS** for rapid UI development
- **Recharts + D3.js** for dashboard visualizations`
    },
    {
      heading: 'Why Use a Rule-Based Matching Algorithm Instead of ML?',
      content: `This was the biggest architectural decision. ML-based matching sounds impressive, but in deal networks, **explainability matters more than accuracy**.

When you tell a partner "this deal matches this profile at 87%," they need to know WHY. "Because the neural network said so" doesn't cut it. "Because they share the same industry (healthcare), geography (Southeast Asia), and the profile has 12 years of M&A experience in this exact vertical" — that's actionable.

**The scoring algorithm:**

1. **Industry match** (0-30 points) — Exact industry match = 30, adjacent industry = 15, no match = 0
2. **Geography overlap** (0-25 points) — Same region = 25, same continent = 10
3. **Expertise alignment** (0-25 points) — Keyword overlap between deal requirements and profile expertise
4. **Deal size fit** (0-20 points) — Profile's typical deal range vs. current deal size

Total score out of 100. Matches above 60 get surfaced. Above 80 get flagged as "high confidence."

This is more valuable than an ML model because:
- Partners can **debate** the score ("I'd weight geography higher for this deal")
- The scoring weights are **tunable** per client without retraining
- It works from **day one** with zero training data`
    },
    {
      heading: 'AI Profile Extraction with GPT-4o',
      content: `The most tedious part of any deal network is data entry. Partners receive LinkedIn profiles, website bios, and email signatures — and someone has to manually extract name, industry, expertise, geography, and deal preferences.

GPT-4o solves this. Paste any unstructured text — a LinkedIn "About" section, a partner bio, an email signature — and the AI extracts a structured profile.

**The prompt engineering:**

I use a structured output prompt that returns JSON matching the exact Profile entity schema:

\`\`\`json
{
  "name": "extracted name",
  "industry": "primary industry",
  "subIndustry": "specific vertical",
  "geography": ["regions"],
  "expertise": ["skills/domains"],
  "dealSizeRange": { "min": 0, "max": 0 },
  "profileType": "REAL or SHADOW"
}
\`\`\`

**SHADOW profiles** are a key feature — you can create anonymous profiles for sensitive introductions where the identity is revealed only after both parties express interest. The AI extracts the same structured data without including identifying information.

**AES-256 encryption** for all sensitive fields at rest. The encryption key is injected via environment variable — never committed to code, never logged.`
    },
    {
      heading: 'How Does the Dashboard Visualize Deal Intelligence?',
      content: `The dashboard needed to answer three questions instantly:

1. **What's new?** — Recent deals added, profiles created, matches generated
2. **What's hot?** — Deals with the most high-confidence matches
3. **What's stuck?** — Profiles with no matches, deals aging without activity

**D3.js for the network graph** — Profiles and deals as nodes, matches as edges, scored by weight. This visualization alone has driven more "aha" moments than any table view. Partners see clusters of activity and dead zones at a glance.

**Recharts for metrics** — Deal pipeline by status, match distribution by score, activity trends over time. These are admin-facing — the goal is operational awareness, not pretty charts.

**Docker Compose for local development:**

\`\`\`yaml
services:
  db:      # PostgreSQL 16
  redis:   # Redis 7
  api:     # Spring Boot (port 8089)
  web:     # Next.js 14 (port 3010)
\`\`\`

One command to spin up the entire stack. No external dependencies except an OpenAI API key for profile extraction.`
    },
    {
      heading: 'What This Architecture Demonstrates',
      content: `| Layer | Technology | Why |
|-------|-----------|-----|
| Backend | Spring Boot 3.4 + Java 21 | Enterprise-grade security, JPA, complex business logic |
| Frontend | Next.js 14 + TypeScript | SSR for public pages, SPA for dashboard |
| Database | PostgreSQL 16 + Flyway | Relational data with migration versioning |
| Cache | Redis 7 | Session management, rate limiting |
| AI | OpenAI GPT-4o | Structured profile extraction from unstructured text |
| Security | AES-256 + JWT | Field-level encryption, role-based access |
| Visualization | D3.js + Recharts | Network graphs, pipeline analytics |
| DevOps | Docker Compose | Full-stack local development in one command |

**Key takeaways for builders:**
- Rule-based algorithms beat ML when explainability is a requirement
- AI is most valuable for eliminating data entry, not making decisions
- AES-256 field-level encryption is worth the complexity for sensitive data
- Next.js 14 App Router works beautifully as a full-stack companion to Spring Boot APIs

**Performance considerations:** The matching algorithm runs in O(n*m) time where n is the number of profiles and m is the number of active deals. For networks with up to 10,000 profiles and 500 active deals, this completes in under 2 seconds on a single Spring Boot instance. Beyond that scale, the matching can be parallelized using Java 21 virtual threads — each deal's match computation is independent, making it trivially parallelizable without the overhead of platform threads.

**Why not GraphQL?** REST was chosen over GraphQL for the API layer because the data access patterns are well-defined — profiles, deals, matches, and analytics each have predictable query shapes. GraphQL adds complexity in schema management and N+1 query prevention that isn't justified when the API surface is stable and owned by a single frontend.`
    },
    {
      heading: 'Frequently Asked Questions',
      content: `**Q: Can SynFlow handle deals across multiple industries simultaneously?**\n\nYes. Each deal and profile can have multiple industry tags. The matching algorithm scores industry overlap using a weighted hierarchy — exact industry match scores 30 points, adjacent industries (e.g., healthcare and biotech) score 15 points. A single profile can match against deals in different industries simultaneously, with each match scored independently based on the full criteria set.\n\n**Q: How does GPT-4o profile extraction handle inaccurate or incomplete LinkedIn data?**\n\nThe extraction prompt includes explicit handling for missing fields — GPT-4o returns null for any field it cannot confidently extract rather than hallucinating data. The system flags incomplete profiles for manual review. Additionally, SHADOW profiles allow creating anonymous profiles where sensitive identifying information is intentionally omitted while retaining industry and expertise data.\n\n**Q: What happens when the matching algorithm produces too many low-quality matches?**\n\nThe scoring threshold is configurable per client. The default threshold surfaces matches above 60/100 and flags high-confidence matches above 80/100. Clients can adjust individual scoring weights — for example, increasing geography weight from 25 to 40 points for deals where regional presence is critical. This tunability is a key advantage of the rule-based approach over ML.\n\n**Q: How does the platform handle data privacy for sensitive deal information?**\n\nAll sensitive fields use AES-256 encryption at rest with keys injected via environment variables. The SHADOW profile feature enables anonymous matchmaking where identities are revealed only after mutual interest. JWT tokens enforce role-based access control with three tiers: admin, analyst, and viewer. Audit logs track every data access event for compliance.\n\n**Q: Is it possible to migrate from SynFlow to a microservices architecture later?**\n\nAbsolutely. The Spring Boot application is structured with clean service interfaces between the matching engine, profile management, and analytics modules. Each module communicates through well-defined service interfaces, not direct database queries. When a module needs independent scaling, extraction into a separate service requires minimal refactoring because the API contracts are already established.`
    }
  ],
  cta: {
    text: 'Building a full-stack enterprise platform? I architect and ship end-to-end.',
    href: '/contact'
  }
};
