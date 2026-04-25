import type { Service } from '@/types/service';
export type { Service } from '@/types/service';

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
    {
        slug: "6-week-mvp",
        title: "6-Week MVP Sprint",
        metaTitle: "6-Week MVP Sprint | Founding Engineer for Hire | Rohit Raj",
        metaDescription:
            "Ship a production-ready MVP in 6 weeks — fixed scope, fixed price, no equity. Founding engineer services for pre-seed founders. $15K-$30K flat.",
        headline: "Ship a Production MVP in 6 Weeks — Not 6 Months",
        subheadline:
            "Fixed-scope, fixed-price MVP sprint for founders who need to validate an idea fast. You own the code from day one. No equity. No long-term lock-in.",
        problem:
            "You have a validated idea and no technical co-founder. Hiring a founding engineer means $210K+ in year-one cash, 0.5-2% equity, and 4-8 weeks of onboarding before a single feature ships. A fractional CTO at $8K-$20K/month writes zero code. AI builders like Lovable stall out at 500 users or the moment you need custom auth, payments, or compliance. You need someone who can ship a real product in 6 weeks, hand it to you, and disappear until you need the next sprint.",
        whatYouGet: [
            "Full-stack web app (Next.js or Spring Boot + React) — auth, billing, core features, deployed",
            "Production deployment on Vercel or AWS with CI/CD, monitoring, and Sentry error tracking",
            "Database design, migrations, seed data, and backup strategy",
            "Up to 3 integrations: Stripe/Razorpay, SendGrid/Resend, and one domain API of your choice",
            "Clean code you own on day one — GitHub access from the first commit, zero lock-in",
            "Written 1-page scope doc before we start — fixed price, fixed deliverables, no scope creep",
            "Post-launch: 2 weeks of bug-fix support + 1-hour knowledge transfer call included",
            "Option to extend on a month-to-month retainer or hand off clean to your next hire",
        ],
        techStack: [
            "Next.js",
            "React",
            "TypeScript",
            "Spring Boot",
            "PostgreSQL",
            "Supabase",
            "Vercel",
            "Stripe",
            "Razorpay",
        ],
        timeline: "6 weeks",
        costRange: "$15,000-$30,000",
        portfolioSlugs: ["myfinancial", "microitinerary", "sanatanapp"],
        faqs: [
            {
                question: "Why 6 weeks and not 3 months?",
                answer: "Six weeks is long enough to ship a real product with auth, payments, and 3-5 core features — and short enough to stay fixed-scope without burning budget on meetings. Most 3-month MVP builds are 6 weeks of actual work plus 6 weeks of scope creep, committee decisions, and waiting on feedback. A 6-week timeline forces us to pick the core value proposition on day one and ship it. Everything else becomes v2.",
            },
            {
                question: "How is this different from hiring a founding engineer?",
                answer: "A founding engineer costs $140K-$220K base plus 0.5-2% equity and a 12+ month commitment. Year-one cash-out in the US is typically $210K-$350K. A 6-week MVP sprint costs $15K-$30K flat with zero equity. You get the same code quality — I am a senior engineer, not a template installer — but no dilution and no lock-in. When you hit product-market fit and raise a seed round, you can then hire a founding engineer onto a working product with real users, which means less equity and better candidates.",
            },
            {
                question: "How is this different from a fractional CTO?",
                answer: "A fractional CTO costs $8K-$20K per month for 10-20 hours per week of strategy, architecture, and team management — and they write zero code. If you are pre-product, there is nothing for a fractional CTO to manage. You are paying for advice when you need a builder. This sprint is the opposite: I write the code, ship it, and hand it to you. If you later need a fractional CTO to lead a team of engineers post-PMF, I can recommend good ones. Pre-PMF, you need a builder, not an advisor.",
            },
            {
                question: "What if my Lovable or Bolt app already exists and is breaking?",
                answer: "This service also covers rescue contracts for apps built on Lovable, Bolt, v0, Cursor, or similar AI builders. I audit the exported code, fix the critical bugs (auth, payments, RLS, performance), and either stabilize the stack or rebuild the broken parts — depending on your timeline and revenue. Rescue engagements typically run $2,500-$12,000 and take 2-4 weeks. If a full rebuild is the right call, it folds into the standard 6-week sprint.",
            },
            {
                question: "Who owns the code and intellectual property?",
                answer: "You own 100% of the code, design, database schema, and IP from the moment it is written. I sign NDAs before we discuss your idea. You get full GitHub access from the first commit — not at the end of the project. All infrastructure (Vercel, Supabase, AWS) is set up under your accounts, paid on your cards. When the sprint ends, you can continue with me on a retainer, hire another developer, or bring it in-house. The code is clean, documented, and portable by design.",
            },
            {
                question: "What happens if we go over 6 weeks?",
                answer: "The scope doc we agree to on day one is fixed. If the scope is correct, we finish in 6 weeks — I have done this 10+ times. If you want to add features mid-sprint, we either swap them in (drop an equivalent-effort feature) or push them to a v2 sprint at the same day rate. You never get a surprise invoice. The fixed-scope contract is what makes this predictable; without it, every MVP timeline slips.",
            },
            {
                question: "Do you take equity instead of cash?",
                answer: "No. Equity-for-code arrangements create misaligned incentives — you want speed, the equity holder wants optionality. I prefer cash so we both stay focused on shipping. If you are raising capital and want a technical reference for diligence calls, I do those for free as part of the engagement. If you want a long-term technical partner post-MVP, we can discuss a retainer or advisor equity grant after we have worked together and both sides know it is a fit.",
            },
        ],
        cta: "Scope Your 6-Week MVP",
    },
    {
        slug: "hire-founding-engineer-india",
        title: "Hire a Founding Engineer in India (2026)",
        metaTitle: "Hire Founding Engineer India 2026 | Pre-Seed MVP Builder | Rohit Raj",
        metaDescription:
            "Hire a senior founding engineer in India without burning $210K + 0.5-2% equity. Production MVP in 6 weeks, fixed-price $15K-$30K, full GitHub access. No agency overhead.",
        headline: "Hire a Founding Engineer in India — Without the Equity, the 12-Month Lock-In, or the $210K",
        subheadline:
            "Pre-seed founders skip the founding-engineer hire and ship with a senior contractor instead. Same code quality. Zero equity. 6 weeks to production. You own the GitHub from day one.",
        problem:
            "You searched 'hire founding engineer India' because you read every YC essay that says the first technical hire is the most important one. Then you priced it: $140K-$220K base, 0.5-2% equity, 4-8 weeks of recruiting, another 4 weeks of onboarding before they ship a feature. Year-one cash out is $210K-$350K. If they leave at month 9, your equity table is broken and your codebase is half-built. Most pre-seed founders do not need a founding engineer in 2026 — they need a senior contractor who has shipped 10 MVPs and will not ask for stock options.",
        whatYouGet: [
            "Senior India-based engineer (6+ years, 29+ shipped products) — same calibre as a US founding-engineer hire",
            "Production MVP in 6 weeks: auth, billing, core features, deployed, monitored",
            "Fixed-price contract ($15K-$30K) — no hourly billing, no surprise invoices, no equity ask",
            "Full GitHub access from commit one — you own 100% of code, IP, and infrastructure",
            "Direct Slack / WhatsApp communication with the engineer, not a project manager",
            "Written 1-page scope doc before code is written — fixed deliverables, no scope creep",
            "Stack you can hire onto later: Next.js, React, TypeScript, Spring Boot, Postgres — not niche frameworks",
            "Optional month-to-month retainer after launch, or clean handoff to your first full-time hire",
        ],
        techStack: [
            "Next.js",
            "React",
            "TypeScript",
            "Spring Boot",
            "Java",
            "PostgreSQL",
            "Supabase",
            "Vercel",
            "AWS",
            "Stripe",
        ],
        timeline: "6 weeks (sprint) or 3-12 month retainer",
        costRange: "$15,000-$30,000 sprint / $8,000-$12,000 monthly retainer",
        portfolioSlugs: ["myfinancial", "microitinerary", "sanatanapp", "stellarmind", "clinicai"],
        faqs: [
            {
                question: "Why hire a founding engineer in India instead of the US?",
                answer: "Year-one cash out for a US founding engineer is $210K-$350K plus 0.5-2% equity. An India founding engineer is $55K-$110K plus 0.2-1% equity. A senior India contractor on a 6-week sprint is $15K-$30K with zero equity. For a pre-seed startup with 12-18 months of runway, the math is brutal: a US founding engineer costs the same as your entire seed round. India delivers the same code quality at one-quarter the cash, and a contractor delivers it without the equity dilution that hurts your next round.",
            },
            {
                question: "Is a senior contractor really the same as a founding engineer?",
                answer: "Code-quality wise, yes. Commitment wise, no — and that is the trade-off. A founding engineer is on the cap table for 4 years, owns the codebase as theirs, and will fight for it at 11pm on a Sunday. A senior contractor ships your MVP, hands it over, and disappears until you call them back. For pre-PMF, the contractor model is better because you do not yet know what you are building. You do not want to dilute equity on a thesis you have not validated. Once you raise a seed round and have a working product with users, you can then hire a founding engineer onto a real codebase — which means less equity (the company is worth more) and better candidates (the role is less risky).",
            },
            {
                question: "What does 'founding engineer in India' actually look like in 2026?",
                answer: "Most India-based founding-engineer roles in 2026 are remote, async, and pay in USD. They run on Slack, ship via GitHub, and meet weekly on Zoom. The senior contractor model strips this further: no Slack channels you have to manage, no 1:1s, no performance reviews. You hire for a 6-week sprint, you get a working product, you decide if you want a retainer afterwards. This is how 36% of solo-founded startups in 2026 are operating — they do not have employees, they have contracted senior engineers on rotation.",
            },
            {
                question: "How is this different from hiring on Toptal, Arc, or Uplers?",
                answer: "Marketplaces like Toptal, Arc, and Uplers are recruiter-first. You post a brief, they match you with 3-5 candidates, you interview each one, you onboard the chosen one for 2-4 weeks before they ship. Markup is 30-50% on top of the engineer's rate. With me, you talk to the engineer directly on call one. The portfolio is public (29 shipped products on GitHub), the price is fixed, and the start is immediate. No middleman, no markup, no recruiter telling you what the engineer's strengths are.",
            },
            {
                question: "What if I do need a full-time founding engineer eventually?",
                answer: "After the 6-week sprint, you have three options: (1) extend on a monthly retainer with me as your interim engineering lead while you raise a seed round, (2) hire a full-time founding engineer onto the existing codebase (better terms because the product is real), or (3) bring engineering in-house. I have helped founders do all three. The codebase is documented, conventional, and clean enough that any senior engineer can take over in two weeks. That is a deliberate design choice — your team should never depend on me staying.",
            },
            {
                question: "What if my startup is in a regulated industry (fintech, healthcare)?",
                answer: "I have shipped fintech (MyFinancial — tax engine, offline-first portfolio dashboard), healthcare (clinicAI — patient management with HIPAA-aware data handling), and AI products in production. For regulated industries, the 6-week sprint covers a compliant MVP — encryption at rest, audit logs, role-based access, secure secret management. For full compliance certification (HIPAA, SOC 2, RBI), you will need a compliance officer to audit the final implementation, but the technical architecture supports it out of the box.",
            },
            {
                question: "Do you take equity instead of cash?",
                answer: "No. Equity-for-code arrangements create misaligned incentives. You want speed; the equity holder wants optionality. Cash keeps both sides focused on shipping. If you want a long-term technical partner with skin in the game, we discuss an advisor-equity grant after the first sprint, when both sides know the fit is real. Until then, cash is the cleanest contract.",
            },
        ],
        cta: "Hire a Founding Engineer",
    },
    {
        slug: "hire-fractional-cto-india",
        title: "Hire a Fractional CTO in India — Or Skip Straight to a Builder",
        metaTitle: "Hire Fractional CTO India 2026 | When You Actually Need One | Rohit Raj",
        metaDescription:
            "Most founders Googling 'hire fractional CTO India' do not need one. They need a senior engineer who ships code. Honest take + cheaper alternative for pre-seed startups.",
        headline: "Hire a Fractional CTO in India — Only If You Already Have a Team to Lead",
        subheadline:
            "Fractional CTOs cost ₹1.5-4L per month for advice. Pre-PMF, you do not need advice — you need shipped code. Here is when a fractional CTO is the right call, and when a senior contractor wins.",
        problem:
            "Searches for 'hire fractional CTO India' have tripled since 2024 because every agency rebranded their consulting arm with the title. The vast majority of pre-seed founders who hire a fractional CTO end up paying ₹1.5-4L per month (₹18-48L per year) for strategy meetings, architecture reviews, and hiring help — none of which writes a line of code. If you have no product, no team, and no users, a fractional CTO has nothing to lead. You are paying senior-executive rates for advice you cannot act on. The fractional CTO is the right hire post-seed when you have engineers and need direction. Pre-seed, you need a builder.",
        whatYouGet: [
            "Honest 30-minute scoping call: do you actually need a fractional CTO, a builder, or both?",
            "If you need a builder: 6-week MVP sprint, fixed-price ($15K-$30K), full GitHub from day one",
            "If you need a fractional CTO: I refer you to one of three vetted CTOs I trust (no commission)",
            "If you need both: I ship the MVP and a fractional CTO joins post-launch to lead your next hires",
            "Architecture review before you commit to any vendor — saves you from $50K mistakes",
            "Written tech-spend audit if you already have a team — what is overbuilt, what is missing",
            "No equity ask, no annual retainer trap, no hourly billing surprises",
        ],
        techStack: [
            "Next.js",
            "Spring Boot",
            "PostgreSQL",
            "AWS",
            "Vercel",
            "Stripe",
            "Razorpay",
            "Supabase",
        ],
        timeline: "30-min scoping call same week / 6-week sprint if you need a builder",
        costRange: "Free scoping call / $15K-$30K MVP sprint / referral to fractional CTO if needed",
        portfolioSlugs: ["myfinancial", "microitinerary", "sanatanapp", "stellarmind"],
        faqs: [
            {
                question: "When does a startup actually need a fractional CTO in 2026?",
                answer: "Three scenarios: (1) you have raised a seed round, hired 2-5 engineers, and need senior architecture guidance you cannot afford full-time; (2) you are non-technical and your existing engineering team is making decisions you cannot evaluate; (3) you are pre-acquisition or fund-raising and need a senior technical voice for due diligence. In all three cases, you have a team or a product. Pre-product, pre-team, you do not need a fractional CTO — you need a builder.",
            },
            {
                question: "How much does a fractional CTO cost in India in 2026?",
                answer: "Retainer pricing is ₹1.5-4L per month (~$1,800-$4,800) for one to two days per week — typical for seed to Series A startups. Hourly is ₹8K-₹40K (~$100-$500). Equity grants for fractional CTOs run 0.25-0.75%. Compare that to a senior contractor at $15K-$30K flat for a 6-week MVP sprint, and you can see why the fractional CTO model only makes sense after you have something to advise on.",
            },
            {
                question: "Why would you talk founders out of hiring a fractional CTO?",
                answer: "Because most of the founders who book a 'fractional CTO scoping call' walk away realizing they wanted someone to write code, not strategize. I am cheaper, faster, and more useful for that need. If you genuinely need a strategic CTO, I refer you to one — I do not pretend to be one. Honest scoping costs me a few minutes. Mismatched engagements cost both of us months.",
            },
            {
                question: "What is the difference between a fractional CTO and a senior contractor?",
                answer: "Fractional CTO writes zero code, attends 4-6 hours of meetings per week, and reviews architecture decisions. Senior contractor writes 100% of the code on a sprint, attends one weekly check-in, and ships features. A fractional CTO is leverage on top of a team. A senior contractor is the team, until you can afford a permanent one. Pre-PMF you need leverage on yourself — meaning, a builder. Post-PMF, you might need leverage on a team — meaning, a fractional CTO.",
            },
            {
                question: "Can you do both — ship the MVP and act as fractional CTO afterwards?",
                answer: "For 1-2 month transitions, yes. After the 6-week sprint, I can stay on a part-time retainer for 1-2 months while you hire a permanent CTO or founding engineer. This is the most common path my clients take. After that handoff window, I refer you to a dedicated fractional CTO so you get someone whose full job is leadership, not building.",
            },
            {
                question: "Will you sign an NDA before the scoping call?",
                answer: "Yes. NDAs are signed before the first scoping call. I treat every founder conversation as confidential. The scoping call is free, 30 minutes, and ends with a written summary of what you actually need — even if that recommendation is 'hire someone else'.",
            },
        ],
        cta: "Book a Free Scoping Call",
    },
];
