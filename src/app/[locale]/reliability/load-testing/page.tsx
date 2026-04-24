import Header from "@/components/Header";
import Footer from "@/components/Footer";
import K6Results from "@/components/K6Results";
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

const PAGE_PATH = '/reliability/load-testing';
const DATE_PUBLISHED = '2026-01-31';
const DATE_MODIFIED = '2026-04-24';
const SEO_TITLE = 'k6 Load Testing for Spring Boot & Node.js APIs (2026 Guide) | Rohit Raj';
const SEO_DESCRIPTION = 'Validate system capacity under real traffic with k6. Ramping, soak, and spike tests for REST and Kafka-backed APIs — the exact scripts I run before every production deploy in 2026.';
const SEO_KEYWORDS = [
    'k6 load testing spring boot',
    'k6 load testing tutorial 2026',
    'soak test vs spike test',
    'p95 latency load test',
    'ramping vus k6 example',
    'load testing rest api production',
    'capacity planning load test',
    'k6 thresholds ci cd',
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

const testTypes = [
    { title: 'Ramping Tests', body: 'Gradually increase load to find breaking points. Identify at what VU count latency degrades or errors spike.', code: 'stages: [{ duration: "5m", target: 500 }]' },
    { title: 'Soak Tests', body: 'Sustained load for hours. Catches memory leaks, connection pool exhaustion, and slow degradation over time.', code: 'duration: "2h", vus: 100' },
    { title: 'Spike Tests', body: 'Sudden traffic bursts to test auto-scaling. Verifies the system recovers gracefully after load spikes.', code: 'stages: [{ duration: "30s", target: 1000 }]' },
];

const benefits = [
    { icon: '📊', title: 'Capacity Planning', body: "Know your system's limits before you hit them. Make data-driven scaling decisions based on actual performance curves." },
    { icon: '🔍', title: 'Bottleneck Identification', body: 'Pinpoint exactly where performance degrades. Database queries? Thread pools? Network I/O? Load testing reveals the answer.' },
    { icon: '✅', title: 'SLA Validation', body: 'Prove that your system meets latency and throughput SLAs under realistic load. Ship with confidence.' },
];

const faqs = [
    { question: 'What is the difference between load testing, stress testing, and soak testing?', answer: 'Load testing validates performance at expected production traffic (baseline behavior). Stress testing pushes load past the breaking point to find failure modes. Soak testing runs sustained load for hours to catch memory leaks, pool exhaustion, and slow degradation. Ship all three before production — each catches different bugs.' },
    { question: 'How do I choose between k6, JMeter, Gatling, and Locust in 2026?', answer: 'k6 wins for most modern teams: JavaScript test scripts, native CI/CD integration, built-in cloud runner, Prometheus/Grafana output. JMeter is legacy XML — avoid for greenfield. Gatling is strong for JVM shops that want Scala DSL. Locust is Python-native but weaker on high VU counts. I default to k6 unless the team has a hard reason otherwise.' },
    { question: 'What p95 latency threshold is acceptable for a REST API?', answer: 'For user-facing APIs, target p95 < 300ms at expected load. For backend-to-backend APIs, p95 < 800ms is usually fine. p99 should be < 2s. Set these as k6 thresholds so the test fails CI when they regress: `thresholds: { http_req_duration: ["p(95)<300"] }`. Numbers below those are aspirational — prove you hit them before you commit to an SLA.' },
    { question: 'How many virtual users (VUs) should I simulate?', answer: 'Start at 2-3x your observed production peak concurrent connections. For most APIs that is 50-200 VUs for normal load tests and 500-2000 VUs for capacity tests. Run a ramping test first to find your breaking point, then anchor your baseline 30% below that number.' },
    { question: 'How do I run k6 in CI/CD without slowing down pipelines?', answer: 'Split into two passes: a fast smoke test (30s, 5 VUs, blocks deploy) on every PR, and a full capacity test (10-15min) that runs nightly or on release-candidate tags. Use k6 thresholds to fail the build on regression. Export results to Prometheus and overlay against production baseline in Grafana.' },
    { question: 'How do I load test an API backed by Kafka or LLM providers?', answer: 'Two considerations: (1) rate-limit your test against the upstream (LLM APIs have strict RPM caps, and Kafka partition count bounds consumer parallelism), (2) test the queuing and backpressure path explicitly — produce 10x peak load and verify your system queues/retries rather than cascading failures. I cover the LLM case in the Text2SQL use case above.' },
];

const relatedLinks = [
    { href: '/reliability/kafka-testing', label: 'Kafka Consumer Testing with Embedded Kafka' },
    { href: '/reliability/observability', label: 'Observability: Prometheus + Grafana for SLOs' },
    { href: '/reliability/api-testing', label: 'API Contract Testing with Postman + Newman' },
    { href: '/notes/build-multi-tenant-saas-spring-boot-java-21', label: 'Multi-Tenant SaaS on Spring Boot + Java 21' },
    { href: '/services', label: 'Hire Rohit: Performance & Reliability Consulting' },
];

export default async function LoadTestingPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: `${SITE_CONFIG.url}/${locale}` },
        { name: 'Reliability', url: `${SITE_CONFIG.url}/${locale}/reliability` },
        { name: 'Load Testing', url: `${SITE_CONFIG.url}/${locale}${PAGE_PATH}` },
    ]);

    const techArticleSchema = generateTechArticleSchema({
        headline: 'k6 Load Testing for Spring Boot & Node.js APIs (2026 Guide)',
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
                            <span className="rel-breadcrumb-current">Load Testing</span>
                        </nav>
                        <span className="rel-eyebrow" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', borderColor: 'rgba(249, 115, 22, 0.25)' }}>
                            <span aria-hidden="true">⚡</span> Load Testing
                        </span>
                        <h1 className="rel-headline">Performance Validation with k6</h1>
                        <p className="rel-lead">
                            Validate capacity under real traffic. Ramping, soak, and spike tests for REST and Kafka-backed APIs — with thresholds that fail the CI build when performance regresses.
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
                        <K6Results />
                    </div>
                </section>

                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">What Are the Three Core k6 Test Types?</h2>
                            <p className="section-description">Ramping, soak, and spike — each catches different classes of production failure.</p>
                        </div>
                        <div className="rel-grid-3">
                            {testTypes.map(t => (
                                <article key={t.title} className="rel-card">
                                    <h3 className="rel-card-title">{t.title}</h3>
                                    <p>{t.body}</p>
                                    <pre className="rel-code"><code>{t.code}</code></pre>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rel-section">
                    <div className="container">
                        <div className="rel-case">
                            <div className="rel-case-head">
                                <span className="rel-case-icon" aria-hidden="true">⚡</span>
                                <div>
                                    <h2>Real Use Case: 500 Concurrent Queries on a Text2SQL API</h2>
                                    <p>How load testing revealed hidden bottlenecks in the AI query pipeline</p>
                                </div>
                            </div>
                            <dl className="rel-case-body">
                                <dt>Challenge</dt>
                                <dd>The Text2SQL Query Engine needed to handle 500 concurrent natural language queries with p95 latency under 800ms. Business dashboards refresh on a schedule, causing predictable traffic spikes.</dd>
                                <dt>Solution</dt>
                                <dd>Created k6 scripts simulating diverse query patterns across 20 query templates with realistic payload sizes.</dd>
                            </dl>
                            <div className="rel-code-block">
                                <div className="rel-code-title">k6 script</div>
                                <pre><code>{`export const options = {
  stages: [
    { duration: "2m", target: 100 },
    { duration: "5m", target: 500 },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.005"],
  },
};

export default function () {
  http.post(API_URL, JSON.stringify({ query: "Show sales by region last quarter" }));
}`}</code></pre>
                            </div>
                            <dl className="rel-case-body">
                                <dt>Discovery</dt>
                                <dd>At 350 concurrent users, p95 latency jumped from 620ms to <strong>3.2 seconds</strong>. Root cause: LLM provider rate limiting combined with database connection pool saturation.</dd>
                                <dt>Fix</dt>
                                <dd>Request queuing with exponential backoff for LLM calls. DB pool raised from 25 → 100. Re-tested at 600 concurrent — p95 stayed at 750ms.</dd>
                                <dt>Impact</dt>
                                <dd>Prevented timeouts during peak dashboard refresh periods. Load testing caught the cascading failures <strong>before going live</strong>.</dd>
                            </dl>
                        </div>
                    </div>
                </section>

                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">How Does Load Testing Help in 2026?</h2>
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
                            <p className="section-description">k6 questions engineers ask before their first production load test.</p>
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
