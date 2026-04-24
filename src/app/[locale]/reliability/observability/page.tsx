import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrometheusMetrics from "@/components/PrometheusMetrics";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import {
    createPageMetadata,
    generateBreadcrumbSchema,
    generateTechArticleSchema,
    generateFAQSchema,
    SITE_CONFIG,
} from "@/lib/seo-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
    return [{ locale: "en" }, { locale: "hi" }, { locale: "fr" }, { locale: "de" }, { locale: "ar" }];
}

type Props = { params: Promise<{ locale: string }> };

const PAGE_PATH = '/reliability/observability';
const DATE_PUBLISHED = '2026-01-31';
const DATE_MODIFIED = '2026-04-24';
const SEO_TITLE = 'Prometheus + Grafana Observability for Spring Boot (2026 Guide) | Rohit Raj';
const SEO_DESCRIPTION = 'RED and USE metrics, SLO dashboards, and alerting for Spring Boot and Node.js services with Prometheus and Grafana — the production observability stack I ship in 2026.';
const SEO_KEYWORDS = [
    'prometheus grafana spring boot 2026',
    'RED USE metrics observability',
    'SLO SLI error budget monitoring',
    'p95 latency grafana dashboard',
    'micrometer prometheus spring boot',
    'observability vs monitoring',
    'mean time to detection mttd',
    'llm pipeline observability',
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    const meta = createPageMetadata(SEO_TITLE, SEO_DESCRIPTION, PAGE_PATH, locale);
    return {
        ...meta,
        keywords: SEO_KEYWORDS,
        authors: [{ name: 'Rohit Raj', url: SITE_CONFIG.url }],
        openGraph: {
            ...meta.openGraph,
            type: 'article',
            publishedTime: DATE_PUBLISHED,
            modifiedTime: DATE_MODIFIED,
            authors: [SITE_CONFIG.url],
            tags: SEO_KEYWORDS,
        },
    };
}

const metricFamilies = [
    {
        title: 'RED Metrics',
        subtitle: 'Request-level health for any service',
        items: [
            { label: 'Rate', body: 'Requests per second across endpoints and methods.' },
            { label: 'Errors', body: 'Failed request rate — HTTP 5xx plus business errors.' },
            { label: 'Duration', body: 'Request latency at p50, p95, and p99 buckets.' },
        ],
    },
    {
        title: 'USE Metrics',
        subtitle: 'System-level saturation signals',
        items: [
            { label: 'Utilization', body: 'CPU, memory, and thread-pool saturation.' },
            { label: 'Saturation', body: 'Queue depth, backlog, and connection pool waits.' },
            { label: 'Errors', body: 'System-level failures (GC stalls, OOM, disk full).' },
        ],
    },
];

const benefits = [
    { icon: '🎯', title: 'SLO Tracking', body: "Define and track Service Level Objectives. Know when you're burning error budget before SLA violations occur." },
    { icon: '🔍', title: 'Incident Response', body: 'Correlate metrics across services during incidents. Identify root causes faster with historical data and trend analysis.' },
    { icon: '📊', title: 'Capacity Planning', body: 'Use historical trends to predict resource needs. Scale proactively based on data, not guesswork.' },
];

const faqs = [
    { question: 'What is observability and how is it different from monitoring?', answer: 'Monitoring answers predefined questions ("is CPU above 80%?"). Observability lets you ask any question about system state by combining metrics, logs, and traces with high-cardinality labels. In practice: monitoring gives you a fixed dashboard, observability gives you a query language (PromQL, LogQL, or equivalent) to explore behavior you did not predict.' },
    { question: 'What are RED and USE metrics?', answer: 'RED — Rate, Errors, Duration — describes request-level health for any service (best fit for REST APIs, Kafka consumers, gRPC). USE — Utilization, Saturation, Errors — describes resource-level health (CPU, memory, disk, connection pools). Ship both. RED catches user-visible degradation; USE catches the root cause underneath.' },
    { question: 'How do I add Prometheus metrics to a Spring Boot application?', answer: 'Add micrometer-registry-prometheus to your dependencies. Spring Boot Actuator exposes /actuator/prometheus out of the box. Use @Timed and @Counted annotations for method-level timing, or inject MeterRegistry to emit custom metrics. Scrape the endpoint with Prometheus, visualize in Grafana. Total setup: about 15 minutes for a greenfield service.' },
    { question: 'What is an SLO and how do I define one?', answer: 'A Service Level Objective is a target for a Service Level Indicator (SLI) measured over a rolling window. Example SLI: "99.5% of /api/query requests complete in under 500ms." Example SLO: "maintain 99.5% over any 28-day window." The gap between SLO and 100% is the error budget. When you burn through it, you freeze feature work and fix reliability.' },
    { question: 'How do I monitor LLM pipelines with Prometheus?', answer: 'Instrument four signals: token usage per request (input + output), LLM response latency (p95 per provider), cache hit rate for prompts and retrieval, and fallback/retry frequency. I documented the Text2SQL case in the use case above — the same pattern works for any RAG or LLM-orchestration stack. Label metrics by model and provider so you can A/B route and compare cost/quality.' },
    { question: 'What is mean time to detection (MTTD) and how does observability reduce it?', answer: 'MTTD is the time between when a problem starts and when a human notices. Without observability, MTTD is often hours (someone reports it). With RED alerts on error rate and latency, MTTD drops to minutes. The Text2SQL case above took MTTD from hours to minutes by alerting on LLM latency breaking a p95 threshold before users noticed timeouts.' },
];

const relatedLinks = [
    { href: '/reliability/kafka-testing', label: 'Kafka Consumer Testing with Embedded Kafka' },
    { href: '/reliability/load-testing', label: 'Load Testing REST APIs with k6' },
    { href: '/reliability/api-testing', label: 'API Contract Testing with Postman + Newman' },
    { href: '/notes/spring-boot-mcp', label: 'Spring Boot + MCP: Tool-Using AI Agents' },
    { href: '/notes/build-multi-tenant-saas-spring-boot-java-21', label: 'Multi-Tenant SaaS on Spring Boot + Java 21' },
    { href: '/services', label: 'Hire Rohit: SRE & Observability Consulting' },
];

export default async function ObservabilityPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: `${SITE_CONFIG.url}/${locale}` },
        { name: 'Reliability', url: `${SITE_CONFIG.url}/${locale}/reliability` },
        { name: 'Observability', url: `${SITE_CONFIG.url}/${locale}${PAGE_PATH}` },
    ]);

    const techArticleSchema = generateTechArticleSchema({
        headline: 'Prometheus + Grafana Observability for Spring Boot (2026 Guide)',
        description: SEO_DESCRIPTION,
        path: PAGE_PATH,
        datePublished: DATE_PUBLISHED,
        dateModified: DATE_MODIFIED,
        keywords: SEO_KEYWORDS,
        proficiencyLevel: 'Expert',
    }, locale);

    const faqSchema = generateFAQSchema(faqs);

    return (
        <>
            <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(techArticleSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <section className="rel-hero">
                    <div className="container">
                        <nav className="rel-breadcrumb" aria-label="Breadcrumb">
                            <Link href={`/${locale}`}>Home</Link>
                            <span aria-hidden="true">→</span>
                            <Link href={`/${locale}/reliability`}>Reliability</Link>
                            <span aria-hidden="true">→</span>
                            <span className="rel-breadcrumb-current">Observability</span>
                        </nav>
                        <span className="rel-eyebrow" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.25)' }}>
                            <span aria-hidden="true">📊</span> Observability
                        </span>
                        <h1 className="rel-headline">Production Observability with Prometheus + Grafana</h1>
                        <p className="rel-lead">
                            Real-time metrics, SLO dashboards, and alerting for Spring Boot and Node.js. RED and USE signals wired end-to-end — from HTTP handler to LLM pipeline.
                        </p>
                        <div className="rel-byline">
                            <span>By <Link href={`/${locale}/about`}>Rohit Raj</Link> · Founding Engineer</span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={DATE_PUBLISHED}>Published Jan 31, 2026</time>
                            <span aria-hidden="true">·</span>
                            <time dateTime={DATE_MODIFIED}>Updated Apr 24, 2026</time>
                        </div>
                    </div>
                </section>

                <section className="rel-section">
                    <div className="container">
                        <PrometheusMetrics />
                    </div>
                </section>

                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">What Metrics Should Every Production Service Emit?</h2>
                            <p className="section-description">Two families. RED for request health, USE for resource health. Ship both.</p>
                        </div>
                        <div className="rel-grid-2">
                            {metricFamilies.map(f => (
                                <article key={f.title} className="rel-card">
                                    <h3 className="rel-card-title">{f.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{f.subtitle}</p>
                                    <ul className="rel-metric-list">
                                        {f.items.map(item => (
                                            <li key={item.label}>
                                                <strong>{item.label}</strong> · {item.body}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rel-section">
                    <div className="container">
                        <div className="rel-case">
                            <div className="rel-case-head">
                                <span className="rel-case-icon" aria-hidden="true">🚀</span>
                                <div>
                                    <h2>Real Use Case: Text2SQL Query Engine SLOs</h2>
                                    <p>How observability held 99.5% query accuracy for an AI-powered NL-to-SQL system</p>
                                </div>
                            </div>
                            <dl className="rel-case-body">
                                <dt>Challenge</dt>
                                <dd>Maintain sub-500ms p95 latency while translating natural language → SQL with high accuracy. Without visibility into the LLM pipeline, debugging query failures would require parsing logs across API, schema resolver, and LLM layers.</dd>
                                <dt>Solution</dt>
                                <dd>Prometheus metrics across the full pipeline, split into two dashboards.</dd>
                            </dl>
                            <div className="rel-grid-2" style={{ marginTop: '1rem' }}>
                                <article className="rel-card">
                                    <h3 className="rel-card-title">🤖 LLM Pipeline Metrics</h3>
                                    <ul className="rel-metric-list">
                                        <li>Token usage per request</li>
                                        <li>LLM response latency (p50, p95, p99)</li>
                                        <li>Schema context cache hit rate</li>
                                    </ul>
                                </article>
                                <article className="rel-card">
                                    <h3 className="rel-card-title">📊 Query Accuracy Metrics</h3>
                                    <ul className="rel-metric-list">
                                        <li>SQL syntax validation rate</li>
                                        <li>Query execution success rate</li>
                                        <li>Fallback/retry frequency</li>
                                    </ul>
                                </article>
                            </div>
                            <dl className="rel-case-body" style={{ marginTop: '1.25rem' }}>
                                <dt>Impact</dt>
                                <dd>Mean time to detection (MTTD) fell from hours to <strong>minutes</strong>. When LLM latency spiked on context overflow, alerts fired before users reported timeouts — enabling proactive token optimization.</dd>
                            </dl>
                        </div>
                    </div>
                </section>

                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">How Does Production Observability Pay for Itself?</h2>
                        </div>
                        <div className="rel-grid-3">
                            {benefits.map(b => (
                                <article key={b.title} className="rel-card rel-card-benefit">
                                    <span className="rel-benefit-icon" aria-hidden="true">{b.icon}</span>
                                    <h3 className="rel-card-title">{b.title}</h3>
                                    <p>{b.body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rel-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Frequently Asked Questions</h2>
                            <p className="section-description">Questions engineers ask before wiring their first production metrics stack.</p>
                        </div>
                        <div className="rel-faq">
                            {faqs.map(f => (
                                <details key={f.question} className="rel-faq-item">
                                    <summary>{f.question}</summary>
                                    <p>{f.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Related Reading</h2>
                        </div>
                        <ul className="rel-related">
                            {relatedLinks.map(r => (
                                <li key={r.href}><Link href={`/${locale}${r.href}`}>{r.label} →</Link></li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="rel-back-nav">
                    <div className="container">
                        <Link href={`/${locale}/reliability`} className="btn btn-secondary">← Back to Reliability Overview</Link>
                    </div>
                </section>
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
