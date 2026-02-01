import type { Metadata } from 'next';

// High-Intent Keywords for Founder/Startup Audience
export const SEO_KEYWORDS = [
    // Primary High-Intent Keywords
    'Freelance Founding Engineer',
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
    title: 'Rohit Raj | Freelance Founding Engineer & AI Systems Architect',
    description: 'Freelance Founding Engineer specializing in Agentic AI Development, Custom Text-to-SQL Builders, and production-ready AI systems for startups. 6+ years building distributed systems that scale.',
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
                alt: 'Rohit Raj - Freelance Founding Engineer & AI Systems Architect',
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
    email: `mailto:${SITE_CONFIG.author.email}`,
    jobTitle: 'Freelance Founding Engineer & AI Systems Architect',
    description: 'Backend engineer with 6+ years experience building production AI systems, distributed architectures, and custom AI solutions for startups.',
    sameAs: [
        `https://github.com/${SITE_CONFIG.author.github}`,
        `https://linkedin.com/in/${SITE_CONFIG.author.linkedin}`,
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
    ],
    alumniOf: {
        '@type': 'Organization',
        name: 'Backend Engineering',
    },
};

// JSON-LD Schema: Service (Freelance Services)
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
                    name: 'Agentic AI Development',
                    description: 'Build autonomous AI agents that can reason, plan, and execute complex tasks.',
                },
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Custom Text-to-SQL Builder',
                    description: 'Natural language to SQL query systems with high accuracy and schema-awareness.',
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
        ],
    },
};

// JSON-LD Schema: Professional Service
export const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Rohit Raj - AI Systems Engineering',
    url: SITE_CONFIG.url,
    description: 'Freelance Founding Engineer specializing in AI systems for startups',
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

// Helper to create page-specific metadata
export function createPageMetadata(
    title: string,
    description: string,
    path: string = ''
): Metadata {
    const url = `${SITE_CONFIG.url}${path}`;
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
        },
        twitter: {
            title,
            description,
        },
        alternates: {
            canonical: url,
        },
    };
}
