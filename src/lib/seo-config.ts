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
    title: 'Rohit Raj | Founding Engineer & AI Systems Architect',
    description: 'Founding Engineer & AI Systems Architect. I build mobile apps, AI chatbots, WhatsApp bots, and backend systems for startups. Based in India, available worldwide. 6+ years shipping production software.',
    url: 'https://rohitraj.tech',
    locale: 'en_US',
    author: {
        name: 'Rohit Raj',
        email: 'rohitguta2432@gmail.com',
        twitter: '@rohitraj',
        github: 'rohitguta2432',
        linkedin: 'rohitraj2',
    },
    images: {
        og: '/og-image.png',
        twitter: '/twitter-image.png',
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
    name: 'Rohit Raj',
    url: SITE_CONFIG.url,
    image: `${SITE_CONFIG.url}/og-image.png`,
    email: SITE_CONFIG.author.email,
    jobTitle: 'Founding Engineer & AI Systems Architect',
    description: 'Backend engineer with 6+ years experience building production AI systems, distributed architectures, and custom AI solutions for startups.',
    sameAs: [
        `https://github.com/${SITE_CONFIG.author.github}`,
        `https://linkedin.com/in/${SITE_CONFIG.author.linkedin}`,
        'https://x.com/rohitraj',
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
    name: 'Rohit Raj - AI Systems Engineering',
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
        '@type': 'Person',
        name: SITE_CONFIG.author.name,
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
export function createPageMetadata(
    title: string,
    description: string,
    path: string = '',
    locale: string = 'en'
): Metadata {
    // path should be the route without locale prefix, e.g. '/about' or '/projects'
    const canonical = `${SITE_CONFIG.url}/${locale}${path}`;
    const languages: Record<string, string> = {};
    for (const loc of SUPPORTED_LOCALES) {
        languages[loc] = `${SITE_CONFIG.url}/${loc}${path}`;
    }
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: canonical,
        },
        twitter: {
            title,
            description,
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
    slug: string;
    keywords: string[];
    coverImage?: { src: string; alt: string };
}, locale: string = 'en') {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage
            ? `${SITE_CONFIG.url}${post.coverImage.src}`
            : `${SITE_CONFIG.url}/og-image.png`,
        author: {
            '@type': 'Person',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        publisher: {
            '@type': 'Person',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        datePublished: post.date,
        dateModified: post.date,
        mainEntityOfPage: `${SITE_CONFIG.url}/${locale}/notes/${post.slug}`,
        keywords: post.keywords,
        inLanguage: locale,
    };
}
