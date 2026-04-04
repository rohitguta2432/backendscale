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
    {
        slug: "fintech-app-development",
        title: "Fintech & Financial App Development",
        metaTitle: "Fintech App Developer India | Financial Software Development",
        metaDescription:
            "Build secure fintech apps — payment integrations, tax calculators, investment dashboards, banking apps. Freelance developer based in India with live fintech projects.",
        headline: "Fintech Apps That Handle Real Money",
        subheadline:
            "Secure, accurate, and compliant financial software — from tax calculators to investment dashboards. Built by a developer with live fintech projects in production.",
        problem:
            "Financial apps need bulletproof security, accurate calculations, and regulatory compliance. Most agencies treat fintech like any other CRUD app — and that's how bugs that lose money happen.",
        whatYouGet: [
            "Tax regime comparison calculators with real-time rule updates",
            "Payment gateway integration (Razorpay, Stripe, UPI)",
            "Investment portfolio dashboards with live market data",
            "Offline-first architecture for financial data access anywhere",
            "Bank-grade security: encryption at rest, secure API design, audit logs",
            "Automated financial report generation (PDF/Excel)",
            "Multi-currency support and GST-compliant invoicing",
        ],
        techStack: [
            "React Native",
            "Spring Boot",
            "PostgreSQL",
            "Razorpay",
            "Stripe",
            "Dexie/IndexedDB",
            "Redis",
        ],
        timeline: "6-16 weeks",
        costRange: "$8,000-$35,000",
        portfolioSlugs: ["myfinancial"],
        faqs: [
            {
                question: "Do you handle RBI compliance and payment regulations?",
                answer: "I build apps that follow RBI guidelines for digital payments and data storage. This includes proper KYC flow integration, transaction audit trails, and secure data handling. For specific regulatory requirements (like payment aggregator licenses), I'll work with your compliance team to ensure the technical implementation matches legal requirements.",
            },
            {
                question: "What are the costs for payment gateway integration?",
                answer: "Payment gateway setup is included in the development cost. Ongoing transaction fees depend on the provider: Razorpay charges ~2% per transaction, Stripe charges 2.9% + 30 cents internationally. UPI payments through Razorpay are free up to certain volumes. I optimize the integration to minimize failed transactions and retry costs.",
            },
            {
                question: "How do you handle financial data privacy and security?",
                answer: "All financial data is encrypted at rest and in transit. I implement role-based access control, API rate limiting, and comprehensive audit logging. Sensitive data like bank account numbers are tokenized. The architecture follows OWASP security guidelines and I conduct security reviews before deployment.",
            },
            {
                question: "Can you build an app that works offline for financial calculations?",
                answer: "Yes — my fintech apps use offline-first architecture with IndexedDB/Dexie for local storage. Users can access their financial data, run tax calculations, and view portfolio summaries without internet. Data syncs automatically when connectivity returns, with conflict resolution for any concurrent changes.",
            },
        ],
        cta: "Build Your Fintech App",
    },
    {
        slug: "healthcare-clinic-app",
        title: "Healthcare & Clinic App Development",
        metaTitle: "Healthcare App Developer India | Clinic Management Software",
        metaDescription:
            "Build clinic management systems, patient booking bots, and healthcare apps. WhatsApp-first solutions for Indian clinics. HIPAA-aware development.",
        headline: "Digital Solutions for Clinics & Healthcare",
        subheadline:
            "WhatsApp booking bots, patient management systems, and clinic dashboards — built for how Indian healthcare actually works.",
        problem:
            "12 lakh+ Indian clinics run on phone calls and paper diaries. Patients call multiple times, double bookings happen daily, and revenue leaks through manual processes.",
        whatYouGet: [
            "WhatsApp booking bot — patients book appointments via chat, no app download needed",
            "Patient management system with medical history and visit tracking",
            "Automated appointment reminders via WhatsApp and SMS",
            "Clinic dashboard with daily schedule, revenue tracking, and patient analytics",
            "Multi-doctor and multi-location support",
            "Digital prescription generation and sharing",
            "Queue management system for walk-in patients",
        ],
        techStack: [
            "Spring Boot",
            "Twilio WhatsApp API",
            "PostgreSQL",
            "Redis",
            "Docker",
            "React",
            "AWS",
        ],
        timeline: "4-12 weeks",
        costRange: "$5,000-$25,000",
        portfolioSlugs: ["clinicai"],
        faqs: [
            {
                question: "Is the system HIPAA compliant?",
                answer: "I build with HIPAA-awareness in mind: encrypted patient data, access controls, audit trails, and secure API design. For full HIPAA compliance certification, you'll need a compliance officer to review the final implementation. The technical architecture supports all HIPAA technical safeguard requirements out of the box.",
            },
            {
                question: "How is patient data stored and protected?",
                answer: "Patient data is stored in encrypted PostgreSQL databases with row-level security. All API endpoints require authentication. Medical records are access-controlled — only authorized staff can view patient history. The system maintains complete audit logs of who accessed what data and when.",
            },
            {
                question: "Does the WhatsApp bot comply with Meta's business policies?",
                answer: "Yes. The bot uses the official WhatsApp Business API through Twilio, which ensures compliance with Meta's policies. Message templates are pre-approved for appointment confirmations and reminders. The bot follows opt-in requirements — patients must initiate the first conversation. No spam, no unsolicited messages.",
            },
            {
                question: "Can this integrate with existing hospital management systems?",
                answer: "Yes. I build REST APIs that can integrate with existing HMS/EHR systems. If your current system has an API, I'll connect to it. If not, I can build data import tools to migrate existing patient records. The system is designed to work standalone or as part of a larger healthcare IT ecosystem.",
            },
        ],
        cta: "Digitize Your Clinic",
    },
    {
        slug: "startup-mvp-development",
        title: "Startup MVP Development",
        metaTitle: "MVP Developer India | Build Your Startup MVP Fast",
        metaDescription:
            "Ship your startup MVP in 4-8 weeks for under $10,000. Full-stack development with AI integration. From idea to production — one developer, no overhead.",
        headline: "Ship Your MVP. Validate Your Idea. Move Fast.",
        subheadline:
            "From idea to production in 4-8 weeks. One senior developer, no agency overhead, no $50K quotes. Just a working product your users can try.",
        problem:
            "You have a startup idea. Agencies quote $50K and 6 months. You don't need an agency — you need one senior developer who can architect, build, and deploy.",
        whatYouGet: [
            "Product architecture and technical planning before writing code",
            "Full-stack development — frontend, backend, database, and APIs",
            "Database design with proper migrations and data modeling",
            "Cloud deployment on Vercel, AWS, or Supabase — production-ready from day one",
            "Basic analytics and user tracking to validate your hypothesis",
            "Authentication and user management out of the box",
            "Post-launch iteration: 2 rounds of feature changes based on user feedback",
        ],
        techStack: [
            "Next.js",
            "React",
            "Spring Boot",
            "PostgreSQL",
            "Vercel",
            "AWS",
            "Supabase",
            "TypeScript",
        ],
        timeline: "4-8 weeks",
        costRange: "$3,000-$10,000",
        portfolioSlugs: ["microitinerary", "myfinancial", "sanatanapp"],
        faqs: [
            {
                question: "How do we scope the MVP to stay under budget?",
                answer: "We start with a free 30-minute call where I help you identify the core value proposition — the one thing your product must do well. Everything else gets pushed to v2. I'll send a written scope document listing exactly what's included, what's not, and why. This keeps the build focused and the budget predictable.",
            },
            {
                question: "What's included in the MVP and what's not?",
                answer: "Included: core feature set (3-5 main features), user auth, basic UI/UX, database, API, deployment, and 2 iteration rounds. Not included: mobile apps (that's a separate project), complex admin panels, third-party integrations beyond 2, and custom design (I use clean component libraries). We can always add these in v2.",
            },
            {
                question: "What happens after the MVP is launched?",
                answer: "After launch, you get 2 weeks of bug-fix support included. Then we look at user feedback together and plan v2. I can continue as your technical partner on a monthly retainer, or I hand off the codebase with documentation so another developer can take over. The code is clean, well-structured, and yours from day one.",
            },
            {
                question: "Do you sign NDAs? Who owns the code?",
                answer: "Yes, I sign NDAs before we discuss your idea. You own 100% of the code, design, and intellectual property from the moment it's written. I'll give you full access to the GitHub repository from day one. After the project ends, you have complete ownership and can do whatever you want with the codebase.",
            },
        ],
        cta: "Build Your MVP",
    },
];
