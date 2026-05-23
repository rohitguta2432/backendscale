import type { Metadata } from 'next';

// High-Intent Keywords for Founder/Startup Audience
export const SEO_KEYWORDS = [
    // Primary High-Intent Keywords
    'Founding Engineer for Startups',
    'AI Systems Architect for Startups',
    'Agentic AI Development',
    'Custom Text-to-SQL Builder',

    // Secondary Keywords
    'Founding Engineer for Hire',
    'Startup Backend Engineer',
    'AI MVP Development',
    'Production AI Systems',
    'Distributed Systems Consultant',
    'Backend Architecture Consulting',

    // Mobile & App Development
    'React Native Developer India',
    'Mobile App Developer India',
    'Expo App Development',
    'Android App Developer India',

    // AI Chatbot & Business
    'AI Chatbot Developer India',
    'WhatsApp Bot Developer',
    'Build AI Chatbot Business',

    // Technical Keywords
    'LLM Integration Expert',
    'RAG System Builder',
    'Event-Driven Architecture',
    'Kafka Specialist',
    'Java Spring Boot Expert',
    'Next.js AI Applications',
] as const;

// Base Site Configuration
export const SITE_CONFIG = {
    name: 'Rohit Raj',
    title: 'Get Your AI MVP Live in 6 Weeks — Rohit Raj',
    description: 'A founding engineer from India who ships end-to-end on any stack — AI, backend, mobile, blockchain, iOS, web3 — without the cost of a team. 29 products shipped, every one documented.',
    url: 'https://rohitraj.tech',
    locale: 'en_US',
    personId: 'https://rohitraj.tech/#person',
    organizationId: 'https://rohitraj.tech/#organization',
    author: {
        name: 'Rohit Raj',
        email: 'rohitgupta2432@gmail.com',
        twitter: '@rohitraj2482',
        github: 'rohitguta2432',
        linkedin: 'rohitraj2',
    },
    images: {
        og: '/og-image.png',
        twitter: '/twitter-image.png',
        logo: '/icon.png',
    },
} as const;

// Default Metadata for all pages
export const defaultMetadata: Metadata = {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
        default: SITE_CONFIG.title,
        template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: [...SEO_KEYWORDS],
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.author.name,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: SITE_CONFIG.locale,
        url: SITE_CONFIG.url,
        siteName: SITE_CONFIG.name,
        title: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        images: [
            {
                url: SITE_CONFIG.images.og,
                width: 1200,
                height: 630,
                alt: 'Rohit Raj - Founding Engineer & AI Systems Architect',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        images: [SITE_CONFIG.images.twitter],
        creator: SITE_CONFIG.author.twitter,
    },
    alternates: {
        canonical: SITE_CONFIG.url,
        languages: {
            'en': `${SITE_CONFIG.url}/en`,
            'hi': `${SITE_CONFIG.url}/hi`,
            'fr': `${SITE_CONFIG.url}/fr`,
            'de': `${SITE_CONFIG.url}/de`,
            'ar': `${SITE_CONFIG.url}/ar`,
        },
    },
    verification: {
        google: 'google46f0e975ac6f7a81',
    },
    category: 'technology',
};

// JSON-LD Schema: Person
export const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': SITE_CONFIG.personId,
    name: 'Rohit Raj',
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.author.email,
    image: `${SITE_CONFIG.url}/og-image.png`,
    jobTitle: 'Founding Engineer & AI Systems Architect',
    description: 'Backend engineer with 10+ years experience building production AI systems, distributed architectures, and custom AI solutions for startups.',
    worksFor: {
        '@id': SITE_CONFIG.organizationId,
    },
    sameAs: [
        `https://github.com/${SITE_CONFIG.author.github}`,
        `https://linkedin.com/in/${SITE_CONFIG.author.linkedin}`,
        'https://x.com/rohitraj2482',
    ],
    knowsAbout: [
        'Agentic AI Development',
        'Text-to-SQL Systems',
        'RAG (Retrieval Augmented Generation)',
        'Distributed Systems',
        'Event-Driven Architecture',
        'Java Spring Boot',
        'Next.js',
        'Kafka',
        'PostgreSQL',
        'Machine Learning Integration',
        'React Native Mobile Development',
        'WhatsApp Business API Integration',
        'Mobile App Development',
        'Expo SDK',
    ],
    alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Bharati Vidyapeeth University, Pune',
    },
    hasCredential: [
        {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Professional Experience',
            name: '10+ years shipping production AI systems, distributed backends, and mobile MVPs',
        },
        {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Specialization',
            name: 'Founding Engineer for early-stage startups (pre-seed to Series A)',
        },
    ],
    award: [
        'Shipped 9 production projects: MyFinancial PWA, StellarMIND Text-to-SQL, MicroItinerary AI Travel Planner, ClinicAI, SanatanApp, and others',
        '59 in-depth technical case studies published on rohitraj.tech engineering notes',
    ],
};

// JSON-LD Schema: Service (Engineering Services)
export const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Software Engineering & AI Development',
    provider: {
        '@type': 'Person',
        name: 'Rohit Raj',
        url: SITE_CONFIG.url,
    },
    name: 'AI Systems Architecture & Development',
    description: 'End-to-end AI system development for startups: from MVP to production. Specializing in Agentic AI, Custom Text-to-SQL builders, RAG systems, and distributed backend architecture.',
    areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
    },
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'AI Engineering Services',
        itemListElement: [
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'AI Agent Development',
                    description: 'Build autonomous AI agents that can reason, plan, and execute complex tasks.',
                },
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Text-to-SQL Systems',
                    description: 'Natural language to SQL query systems with high accuracy and schema-awareness.',
                },
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Enterprise Java Architecture',
                    description: 'Scalable, distributed backend systems using Spring Boot and Java for high-performance enterprise applications.',
                },
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Founding Engineer Partnership',
                    description: 'Full-stack technical co-founder services for early-stage startups building AI products.',
                },
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Production AI Systems',
                    description: 'End-to-end AI infrastructure: RAG, embeddings, vector databases, and LLM orchestration.',
                },
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Mobile App Development',
                    description: 'Cross-platform mobile apps with React Native and Expo, including Play Store deployment and CI/CD pipelines.',
                },
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'WhatsApp Bot Development',
                    description: 'Intelligent WhatsApp bots using Twilio API with Hinglish NLP support for business automation.',
                },
            },
        ],
    },
};

// JSON-LD Schema: Professional Service
export const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': SITE_CONFIG.organizationId,
    name: 'Rohit Raj',
    alternateName: 'Rohit Raj — AI Systems Engineering',
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.images.logo}`,
    url: SITE_CONFIG.url,
    description: 'Founding Engineer specializing in AI systems for startups. Available for engineering partnerships.',
    priceRange: '$$$$',
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 28.6139,
        longitude: 77.209,
    },
    openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
    },
    sameAs: [
        `https://github.com/${SITE_CONFIG.author.github}`,
        `https://linkedin.com/in/${SITE_CONFIG.author.linkedin}`,
        'https://x.com/rohitraj2482',
    ],
};

// Combined JSON-LD for injection
export function generateAllSchemas() {
    return [personSchema, serviceSchema, professionalServiceSchema];
}

// JSON-LD Schema: WebSite (homepage only — enables sitelinks search box)
export const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rohit Raj',
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    author: {
        '@id': SITE_CONFIG.personId,
    },
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_CONFIG.url}/en/notes?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
    },
};

// BreadcrumbList JSON-LD schema generator
export function generateBreadcrumbSchema(
    items: { name: string; url: string }[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

// ContactPoint JSON-LD schema
export const contactPointSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rohit Raj',
    url: SITE_CONFIG.url,
    contactPoint: [
        {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: SITE_CONFIG.author.email,
            availableLanguage: ['English', 'Hindi'],
        },
    ],
    sameAs: [
        `https://github.com/${SITE_CONFIG.author.github}`,
        `https://linkedin.com/in/${SITE_CONFIG.author.linkedin}`,
        'https://x.com/rohitraj2482',
    ],
};

// SoftwareApplication JSON-LD schema generator for project detail pages
export function generateSoftwareApplicationSchema(project: {
    name: string;
    problem: string;
    solves: string;
    techStack: string[];
    slug: string;
    repoUrl?: string;
    status: string;
    image?: string;
}, locale: string = 'en') {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: project.name,
        description: project.solves,
        ...(project.image && { image: `${SITE_CONFIG.url}${project.image}` }),
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web',
        url: `${SITE_CONFIG.url}/${locale}/projects/${project.slug}`,
        ...(project.repoUrl && {
            codeRepository: project.repoUrl,
            isAccessibleForFree: true,
        }),
        author: {
            '@type': 'Person',
            name: SITE_CONFIG.author.name,
            url: SITE_CONFIG.url,
        },
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        keywords: project.techStack.join(', '),
    };
}

// FAQPage JSON-LD schema generator
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

// Supported locales for alternates generation
export const SUPPORTED_LOCALES = ['en', 'hi', 'fr', 'de', 'ar'] as const;

// Helper to create page-specific metadata with canonical URLs and locale alternates
/**
 * Truncate a description to Google's SERP-display limit while preserving sentence boundaries.
 * Google truncates meta descriptions at ~155-160 chars on mobile, ~160-170 on desktop.
 * Returns the original string if already short enough; otherwise cuts at the last word
 * boundary inside the limit and appends an ellipsis only if there's room.
 */
export function truncateDescription(text: string, max: number = 158): string {
    if (!text) return text;
    if (text.length <= max) return text;
    const slice = text.slice(0, max);
    const lastSpace = slice.lastIndexOf(' ');
    const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
    return cut.replace(/[.,;:\s]+$/, '') + '…';
}

/**
 * Resolve a possibly-relative image path to an absolute URL.
 * If the input is already absolute (starts with http), returns as-is.
 */
function resolveImageUrl(src?: string): string {
    if (!src) return `${SITE_CONFIG.url}${SITE_CONFIG.images.og}`;
    if (/^https?:\/\//.test(src)) return src;
    return `${SITE_CONFIG.url}${src.startsWith('/') ? src : `/${src}`}`;
}

export function createPageMetadata(
    title: string,
    description: string,
    path: string = '',
    locale: string = 'en',
    options: {
        /** Page-specific image (e.g. blog cover). Falls back to site default. */
        image?: { src: string; alt: string };
        /** Override the meta description (e.g. trimmed-to-160 version of post excerpt). */
        metaDescription?: string;
    } = {}
): Metadata {
    // path should be the route without locale prefix, e.g. '/about' or '/projects'
    const canonical = `${SITE_CONFIG.url}/${locale}${path}`;
    const languages: Record<string, string> = {};
    for (const loc of SUPPORTED_LOCALES) {
        languages[loc] = `${SITE_CONFIG.url}/${loc}${path}`;
    }
    languages['x-default'] = `${SITE_CONFIG.url}/en${path}`;

    // Truncate description for meta tags (Google SERP truncates at ~158 chars).
    // The full description still ships in body text; only the head meta is shortened.
    const metaDesc = truncateDescription(options.metaDescription ?? description);

    // Resolve page image. Fall back to site OG image so social cards never render naked.
    const ogImageUrl = resolveImageUrl(options.image?.src);
    const ogImageAlt = options.image?.alt ?? 'Rohit Raj — Founding Engineer & AI Systems Architect';

    return {
        title,
        description: metaDesc,
        openGraph: {
            title,
            description: metaDesc,
            url: canonical,
            type: path.startsWith('/notes/') ? 'article' : 'website',
            siteName: SITE_CONFIG.name,
            locale: SITE_CONFIG.locale,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: ogImageAlt,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: metaDesc,
            images: [ogImageUrl],
            creator: SITE_CONFIG.author.twitter,
        },
        alternates: {
            canonical,
            languages,
        },
    };
}

// BlogPosting JSON-LD schema for individual blog posts
export function generateBlogPostingSchema(post: {
    title: string;
    excerpt: string;
    date: string;
    updated?: string;
    slug: string;
    keywords: string[];
    coverImage?: { src: string; alt: string };
    wordCount?: number;
    articleSection?: string;
    sections?: { heading: string; content: string }[];
}, locale: string = 'en') {
    // Auto-derive wordCount from sections if not passed
    const computedWordCount = post.wordCount ?? (post.sections
        ? post.sections.reduce((sum, s) => sum + s.content.split(/\s+/).filter(Boolean).length, 0)
        : undefined);
    // Auto-derive articleSection from first keyword if not passed
    const computedSection = post.articleSection ?? post.keywords[0];
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage
            ? `${SITE_CONFIG.url}${post.coverImage.src}`
            : `${SITE_CONFIG.url}/og-image.png`,
        author: {
            '@id': SITE_CONFIG.personId,
        },
        publisher: {
            '@type': 'Organization',
            '@id': SITE_CONFIG.organizationId,
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_CONFIG.url}${SITE_CONFIG.images.logo}`,
            },
        },
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        mainEntityOfPage: `${SITE_CONFIG.url}/${locale}/notes/${post.slug}`,
        keywords: post.keywords.join(', '),
        ...(computedWordCount && { wordCount: computedWordCount }),
        ...(computedSection && { articleSection: computedSection }),
        inLanguage: locale,
    };
}

// TechArticle JSON-LD schema for reliability / deep-dive technical pages.
// Signals Google that this is an authored, dated technical article — required
// for E-E-A-T lift and AI Overview citation on long-tail engineering queries.
export function generateTechArticleSchema(article: {
    headline: string;
    description: string;
    path: string;
    datePublished: string;
    dateModified?: string;
    keywords: string[];
    proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Expert';
    image?: { src: string; alt: string };
}, locale: string = 'en') {
    return {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: article.headline,
        description: article.description,
        image: article.image
            ? `${SITE_CONFIG.url}${article.image.src}`
            : `${SITE_CONFIG.url}/og-image.png`,
        author: { '@id': SITE_CONFIG.personId },
        publisher: {
            '@type': 'Organization',
            '@id': SITE_CONFIG.organizationId,
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_CONFIG.url}${SITE_CONFIG.images.logo}`,
            },
        },
        datePublished: article.datePublished,
        dateModified: article.dateModified ?? article.datePublished,
        mainEntityOfPage: `${SITE_CONFIG.url}/${locale}${article.path}`,
        keywords: article.keywords.join(', '),
        proficiencyLevel: article.proficiencyLevel ?? 'Expert',
        inLanguage: locale,
    };
}

// Extract FAQ question/answer pairs from blog post markdown sections.
// Parses sections with heading containing "FAQ" or "Frequently Asked".
export function extractFAQsFromSections(
    sections: { heading: string; content: string }[]
): { question: string; answer: string }[] {
    const faqSection = sections.find((s) =>
        /frequently asked|^faq$|^faqs$/i.test(s.heading.trim())
    );
    if (!faqSection) return [];

    const qaPairs: { question: string; answer: string }[] = [];
    const pattern = /\*\*Q:\s*([^*]+?)\*\*\s*([\s\S]*?)(?=\*\*Q:|$)/g;
    let match;
    while ((match = pattern.exec(faqSection.content)) !== null) {
        const question = match[1].trim();
        const answer = match[2]
            .replace(/\*\*/g, '')
            .replace(/\n+/g, ' ')
            .trim();
        if (question && answer) qaPairs.push({ question, answer });
    }
    return qaPairs;
}

// CollectionPage JSON-LD for index/listing pages
export function generateCollectionPageSchema(opts: {
    name: string;
    description: string;
    url: string;
    items?: { name: string; url: string }[];
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': opts.url,
        name: opts.name,
        description: opts.description,
        url: opts.url,
        author: { '@id': SITE_CONFIG.personId },
        ...(opts.items && opts.items.length > 0 && {
            mainEntity: {
                '@type': 'ItemList',
                itemListElement: opts.items.map((item, i) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    name: item.name,
                    url: item.url,
                })),
            },
        }),
    };
}
