import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { getDictionary, isValidLocale, locales, type Locale } from "@/lib/i18n";
import { createPageMetadata, SITE_CONFIG } from "@/lib/seo-config";

interface ServicePageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
    const params = [];
    for (const locale of locales) {
        for (const service of services) {
            params.push({ locale, slug: service.slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: ServicePageProps) {
    const { locale, slug } = await params;
    const service = services.find((s) => s.slug === slug);

    if (!service || !isValidLocale(locale)) {
        return { title: "Service Not Found | Rohit Raj" };
    }

    return createPageMetadata(
        service.metaTitle,
        service.metaDescription,
        `/services/${slug}`,
        locale
    );
}

function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

function generateServiceSchema(service: (typeof services)[0]) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.metaDescription,
        provider: {
            "@type": "Person",
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        areaServed: {
            "@type": "Place",
            name: "Worldwide",
        },
        url: `${SITE_CONFIG.url}/en/services/${service.slug}`,
    };
}

export default async function ServicePage({ params }: ServicePageProps) {
    const { locale, slug } = await params;

    if (!isValidLocale(locale)) notFound();

    const service = services.find((s) => s.slug === slug);
    if (!service) notFound();

    const dict = await getDictionary(locale as Locale);

    const portfolioProjects = projects.filter((p) =>
        service.portfolioSlugs.includes(p.slug)
    );

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateFAQSchema(service.faqs)),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateServiceSchema(service)),
                }}
            />
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <section>
                    <div className="container" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
                        <Link
                            href={`/${locale}/services`}
                            style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9rem" }}
                        >
                            &larr; All Services
                        </Link>

                        {/* Hero */}
                        <div style={{ marginTop: "2rem" }}>
                            <h1 style={{ color: "var(--text-primary)", fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2, marginBottom: "0.75rem" }}>
                                {service.headline}
                            </h1>
                            <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", lineHeight: 1.6 }}>
                                {service.subheadline}
                            </p>
                        </div>

                        {/* Problem */}
                        <div style={{ marginTop: "3rem" }}>
                            <h2 style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
                                The Problem
                            </h2>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                                {service.problem}
                            </p>
                        </div>

                        {/* What You Get */}
                        <div style={{ marginTop: "3rem" }}>
                            <h2 style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
                                What You Get
                            </h2>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {service.whatYouGet.map((item, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            color: "var(--text-secondary)",
                                            lineHeight: 1.7,
                                            padding: "0.5rem 0",
                                            borderBottom: "1px solid var(--border)",
                                            display: "flex",
                                            gap: "0.75rem",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>
                                            &#10003;
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tech Stack */}
                        <div style={{ marginTop: "3rem" }}>
                            <h2 style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
                                Tech Stack
                            </h2>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {service.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="tag"
                                        style={{
                                            background: "var(--card-bg)",
                                            color: "var(--text-secondary)",
                                            border: "1px solid var(--border)",
                                            padding: "0.35rem 0.75rem",
                                            borderRadius: "6px",
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Timeline & Cost */}
                        <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                            <div
                                style={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "12px",
                                    padding: "1.5rem",
                                }}
                            >
                                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                                    Timeline
                                </div>
                                <div style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: 600 }}>
                                    {service.timeline}
                                </div>
                            </div>
                            <div
                                style={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "12px",
                                    padding: "1.5rem",
                                }}
                            >
                                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                                    Investment
                                </div>
                                <div style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: 600 }}>
                                    {service.costRange}
                                </div>
                            </div>
                        </div>

                        {/* Portfolio */}
                        {portfolioProjects.length > 0 && (
                            <div style={{ marginTop: "3rem" }}>
                                <h2 style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
                                    Related Work
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {portfolioProjects.map((project) => (
                                        <Link
                                            key={project.slug}
                                            href={`/${locale}/projects/${project.slug}`}
                                            style={{
                                                background: "var(--card-bg)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "12px",
                                                padding: "1.25rem",
                                                textDecoration: "none",
                                                display: "block",
                                                transition: "border-color 0.2s",
                                            }}
                                        >
                                            <div style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: "0.25rem" }}>
                                                {project.name}
                                            </div>
                                            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                                                {project.problem.split(".")[0]}.
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQ */}
                        <div style={{ marginTop: "3rem" }}>
                            <h2 style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
                                Frequently Asked Questions
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {service.faqs.map((faq, i) => (
                                    <div key={i}>
                                        <h3 style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                                            {faq.question}
                                        </h3>
                                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonials */}
                        <div style={{ marginTop: "3rem" }}>
                            <Testimonials limit={2} />
                        </div>

                        {/* CTA */}
                        <div style={{ marginTop: "3rem", marginBottom: "3rem", textAlign: "center" }}>
                            <Link
                                href={`/${locale}/contact`}
                                className="btn btn-primary"
                                style={{
                                    display: "inline-block",
                                    padding: "0.875rem 2rem",
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                }}
                            >
                                {service.cta}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
