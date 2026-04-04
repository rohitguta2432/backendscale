export interface Service {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    headline: string;
    subheadline: string;
    problem: string;
    whatYouGet: string[];
    techStack: string[];
    timeline: string;
    costRange: string;
    portfolioSlugs: string[];
    faqs: { question: string; answer: string }[];
    cta: string;
}

export const services: Service[] = [
    {
        slug: "mobile-app-development",
        title: "Mobile App Development",
        metaTitle: "Mobile App Development | Hire React Native Developer India | Rohit Raj",
        metaDescription:
            "Hire an experienced mobile app developer in India. React Native + Expo apps with Play Store deployment, offline-first architecture, and ~15MB bundle size. $3,000-$30,000.",
        headline: "Ship Your Mobile App to the Play Store — Fast",
        subheadline:
            "React Native + Expo apps that run on Android and iOS from a single codebase. Offline-first, lightweight (~15MB), and production-ready.",
        problem:
            "You have a mobile app idea but building native apps for both platforms doubles your cost and timeline. You need a developer who can ship a real, production-quality app — not a prototype that breaks on real devices. Most freelancers deliver bloated 80MB+ apps that users uninstall within a day.",
        whatYouGet: [
            "Cross-platform app (Android + iOS) from a single React Native codebase",
            "Offline-first architecture — works without internet, syncs when back online",
            "Lightweight builds (~15MB) optimized for Indian network conditions",
            "Play Store and App Store submission with listing optimization",
            "Push notifications, deep linking, and analytics integration",
            "CI/CD pipeline for automated builds and OTA updates via Expo",
            "Post-launch support: bug fixes and 2 feature iterations included",
        ],
        techStack: [
            "React Native",
            "Expo",
            "TypeScript",
            "SQLite",
            "Firebase",
            "Play Store",
            "App Store",
        ],
        timeline: "3-16 weeks",
        costRange: "$3,000-$30,000",
        portfolioSlugs: ["sanatanapp", "myfinancial"],
        faqs: [
            {
                question: "How much does it cost to build a mobile app in India?",
                answer: "A production-ready mobile app typically costs between $3,000 and $30,000 depending on complexity. A simple utility app with 5-8 screens starts around $3,000-$5,000. A medium-complexity app with user auth, API integrations, and offline support runs $8,000-$15,000. Complex apps with real-time features, payment integration, and admin panels can go up to $30,000.",
            },
            {
                question: "Why React Native instead of Flutter?",
                answer: "React Native has a larger ecosystem, better third-party library support, and shares code with React web apps if you ever need a web version. Flutter produces slightly larger binaries and has a smaller hiring pool in India. For most business apps, React Native with Expo delivers faster with smaller app sizes.",
            },
            {
                question: "How long does it take to build and launch a mobile app?",
                answer: "A simple app takes 3-5 weeks. Medium complexity (auth, APIs, offline) takes 6-10 weeks. Complex apps with multiple integrations take 12-16 weeks. This includes design implementation, development, testing on real devices, and Play Store submission.",
            },
            {
                question: "What does the Play Store submission process look like?",
                answer: "I handle the entire process: creating your developer account, preparing store listings (screenshots, descriptions, keywords), configuring app signing, submitting for review, and resolving any policy issues. First review typically takes 1-3 days. I also set up CI/CD so future updates can be pushed with a single command.",
            },
        ],
        cta: "Let's Build Your App",
    },
    {
        slug: "ai-chatbot-development",
        title: "AI Chatbot & WhatsApp Bot Development",
        metaTitle: "AI Chatbot & WhatsApp Bot Developer India | Rohit Raj",
        metaDescription:
            "Build AI chatbots and WhatsApp bots for your business. From rule-based flows to full LLM-powered assistants with Hinglish support. $2,000-$50,000.",
        headline: "AI Chatbots That Actually Work for Indian Businesses",
        subheadline:
            "WhatsApp bots, customer support agents, and LLM-powered assistants — built to handle Hinglish, scale to thousands, and integrate with your existing systems.",
        problem:
            "Your customers are on WhatsApp, not your website. You're losing leads because nobody answers after business hours. Generic chatbot platforms don't understand Hinglish, can't integrate with your CRM, and charge per-message fees that kill your margins. You need a custom solution that feels like talking to a real person.",
        whatYouGet: [
            "WhatsApp Business API integration with automated conversation flows",
            "Choice of rule-based, hybrid, or full LLM-powered responses",
            "Hinglish and multilingual support for Indian customer base",
            "CRM and database integration for real-time data access",
            "Appointment booking, order tracking, and FAQ automation",
            "Analytics dashboard for conversation insights and drop-off points",
            "Handoff to human agents when the bot can't handle a query",
        ],
        techStack: [
            "Spring Boot",
            "Java",
            "WhatsApp Business API",
            "OpenAI / Claude API",
            "PostgreSQL",
            "Redis",
            "Docker",
        ],
        timeline: "2-12 weeks",
        costRange: "$2,000-$50,000",
        portfolioSlugs: ["clinicai", "stellarmind"],
        faqs: [
            {
                question: "How much does WhatsApp Business API cost?",
                answer: "WhatsApp Business API itself is free to set up through providers like Twilio or Meta directly. You pay per conversation: business-initiated messages cost ~$0.05-$0.10 per conversation (24-hour window), while user-initiated conversations are cheaper. For most small businesses handling 500-2000 conversations/month, expect $50-$200/month in messaging costs on top of the development cost.",
            },
            {
                question: "Should I use an LLM or rule-based chatbot?",
                answer: "Start rule-based if your use case has clear, predictable flows (appointment booking, order status, FAQs). Go LLM-powered if you need the bot to handle open-ended questions, understand context across messages, or deal with unpredictable inputs. A hybrid approach works best for most businesses: rule-based for structured flows, LLM for everything else.",
            },
            {
                question: "What are the ongoing costs after the chatbot is built?",
                answer: "Ongoing costs include: WhatsApp API messaging fees ($50-$200/month for small businesses), server hosting ($20-$50/month on AWS), and LLM API costs if applicable ($30-$300/month depending on volume). I design systems to minimize LLM calls using caching and rule-based pre-filtering, keeping costs predictable.",
            },
        ],
        cta: "Build Your Chatbot",
    },
    {
        slug: "full-stack-development",
        title: "Full-Stack Development & AI Integration",
        metaTitle: "Hire Full Stack Developer India | Spring Boot + React | Rohit Raj",
        metaDescription:
            "Full-stack development with Spring Boot, React, and Next.js. AI integration, MVP to production, startup CTO-level guidance. $5,000-$30,000.",
        headline: "From MVP to Production — Full-Stack Engineering for Startups",
        subheadline:
            "Spring Boot + React/Next.js applications with AI integration baked in. Think of it as hiring a CTO who also writes the code.",
        problem:
            "You're a startup founder who needs a technical co-founder but can't afford one. Agencies charge $100K+ and deliver cookie-cutter solutions. Junior freelancers build things that break at 100 users. You need someone who can make architecture decisions, write production code, and ship — all without a 6-month timeline.",
        whatYouGet: [
            "Full-stack web application with Spring Boot backend and React/Next.js frontend",
            "AI feature integration: chatbots, content generation, search, recommendations",
            "Database design with PostgreSQL, migrations, and data modeling",
            "Authentication, authorization, and role-based access control",
            "REST or GraphQL API design with documentation",
            "CI/CD pipeline, Docker containerization, and cloud deployment (AWS)",
            "Architecture documentation and knowledge transfer for your future team",
        ],
        techStack: [
            "Spring Boot",
            "Java",
            "React",
            "Next.js",
            "TypeScript",
            "PostgreSQL",
            "Kafka",
            "Docker",
            "AWS",
        ],
        timeline: "4-16 weeks",
        costRange: "$5,000-$30,000",
        portfolioSlugs: [
            "clinicai",
            "microitinerary",
            "stellarmind",
            "myfinancial",
            "sanatanapp",
            "rohitraj-site",
        ],
        faqs: [
            {
                question: "How do you choose between different tech stacks?",
                answer: "I pick the stack based on your business needs, not trends. Spring Boot + Java for backend-heavy apps that need reliability and performance. Next.js for SEO-critical marketing sites and content platforms. React Native for mobile. PostgreSQL for most databases. I'll explain every choice and trade-off before writing a line of code.",
            },
            {
                question: "Why hire a freelancer instead of an agency?",
                answer: "Agencies assign junior developers to your project and charge senior rates. With me, you get the same senior engineer from day one to deployment. No project manager telephone game, no surprise billing, no handoff between teams. I've built and shipped 6+ production systems — you're hiring the person who does the actual work.",
            },
            {
                question: "How do we get started?",
                answer: "Send me a message describing what you want to build. I'll reply within 24 hours with initial thoughts. We then do a free 30-minute call to discuss scope, timeline, and budget. If we're aligned, I send a detailed proposal with milestones and fixed pricing. No hourly billing surprises.",
            },
        ],
        cta: "Start Your Project",
    },
];
