export interface Project {
    slug: string;
    name: string;
    problem: string;
    solves: string;
    techStack: string[];
    status: 'active' | 'iterating' | 'paused';
    repoUrl?: string;
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
        slug: "rohitraj-site",
        name: "rohitraj.tech",
        problem: "Engineering work is often invisible. Portfolios show polished results but not the thinking behind them.",
        solves: "A living project directory that documents problems, trade-offs, and architectural decisions in real-time.",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind", "Vercel"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/backendscale",
        details: {
            whyItMatters: "Hiring decisions are made based on visible artifacts. A traditional portfolio shows what you built, but not how you think. This site exposes the engineering process itself.",
            approach: [
                "Next.js 16 with App Router for optimal performance",
                "Minimal design language inspired by documentation sites",
                "Static generation where possible, dynamic routes for project details",
                "Deployed on Vercel with automatic preview deployments"
            ],
            decisions: [
                "Chose documentation-first aesthetic over flashy portfolio style",
                "Used vanilla CSS over component libraries for full control",
                "Kept dependencies minimal for long-term maintainability",
                "Structured content as data for easy updates"
            ],
            currentStatus: "Live and deployed. Core pages complete.",
            roadmap: [
                "Add technical notes/blog section",
                "Implement RSS feed for notes",
                "Add search functionality"
            ],
            improvements: [
                "Could add dark mode toggle",
                "Consider MDX for richer content authoring"
            ]
        }
    },
    {
        slug: "linkedin-clone",
        name: "LinkedIn Clone",
        problem: "Learning modern frontend frameworks requires building real-world applications, not just toy projects.",
        solves: "A full-featured LinkedIn clone with Feed, Profile, Jobs, Messaging, and Network pages built with React 19.",
        techStack: ["React", "TypeScript", "Vite", "Tailwind", "CSS"],
        status: "active",
        repoUrl: "https://github.com/rohitguta2432/linkedin-clone",
        details: {
            whyItMatters: "Building clones of production apps teaches patterns that tutorials miss — real navigation flows, component composition, and state management at scale.",
            approach: [
                "React 19 with Vite 7 for fast development",
                "Tailwind v4 for utility-first styling",
                "Component-based architecture with reusable UI elements",
                "Mobile-first responsive design"
            ],
            decisions: [
                "Used Stitch for high-fidelity design mockups before coding",
                "Organized components by feature rather than type",
                "Implemented pixel-perfect parity with original LinkedIn UI",
                "Used CSS modules for component-scoped styles where needed"
            ],
            currentStatus: "Core pages complete — Feed, Profile, Jobs, Messaging, Network, Notifications.",
            roadmap: [
                "Add backend API integration",
                "Implement real-time messaging with WebSockets",
                "Add authentication flow"
            ],
            improvements: [
                "Could use React Query for better data fetching patterns",
                "Consider adding E2E tests with Playwright"
            ]
        }
    },
    {
        slug: "amazon-flipkart-clones",
        name: "E-commerce Clones",
        problem: "E-commerce UI patterns are complex — product grids, cart management, search, and responsive layouts.",
        solves: "Amazon and Flipkart clone implementations demonstrating e-commerce frontend patterns.",
        techStack: ["HTML", "CSS", "JavaScript", "React"],
        status: "iterating",
        repoUrl: "https://github.com/rohitguta2432",
        details: {
            whyItMatters: "E-commerce sites have unique UX challenges — handling large product catalogs, complex filtering, cart state, and checkout flows.",
            approach: [
                "Started with vanilla HTML/CSS for Amazon clone",
                "React implementation for Flipkart with component reuse",
                "Responsive grid layouts for product listings",
                "Local storage for cart persistence"
            ],
            decisions: [
                "Built Amazon clone first to understand patterns before React",
                "Used CSS Grid for flexible product layouts",
                "Implemented client-side search filtering",
                "Focused on mobile responsiveness"
            ],
            currentStatus: "Amazon clone complete. Flipkart clone in progress.",
            roadmap: [
                "Add product detail pages",
                "Implement checkout flow mockup",
                "Add category navigation"
            ],
            improvements: [
                "Could add skeleton loading states",
                "Consider implementing with a backend API"
            ]
        }
    }
];

export const repos = [
    {
        name: "backendscale",
        description: "This site — personal engineering directory and project log",
        modules: ["src/app", "src/components", "src/data"],
        url: "https://github.com/rohitguta2432/backendscale"
    },
    {
        name: "linkedin-clone",
        description: "Full-featured LinkedIn UI clone with React 19 and Tailwind",
        modules: ["components", "pages", "styles"],
        url: "https://github.com/rohitguta2432/linkedin-clone"
    },
    {
        name: "amazon-clone",
        description: "Amazon homepage and product listing clone with vanilla HTML/CSS",
        modules: ["index.html", "styles", "scripts"],
        url: "https://github.com/rohitguta2432/amazon-clone"
    }
];

export const notes = [
    {
        slug: "react-19-features",
        title: "React 19 Features Worth Using",
        date: "2026-01-28",
        excerpt: "Exploring the new use() hook, server components patterns, and improved suspense boundaries in React 19."
    },
    {
        slug: "tailwind-v4-migration",
        title: "Migrating to Tailwind v4",
        date: "2026-01-20",
        excerpt: "Breaking changes, new features, and migration strategies for upgrading from Tailwind v3 to v4."
    },
    {
        slug: "vite-vs-nextjs",
        title: "When to Choose Vite vs Next.js",
        date: "2026-01-15",
        excerpt: "Decision framework for choosing between Vite and Next.js based on project requirements and team experience."
    }
];
