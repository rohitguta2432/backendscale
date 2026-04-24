import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const PAGE_PATH = '/reliability/api-testing';
const DATE_PUBLISHED = '2026-01-31';
const DATE_MODIFIED = '2026-04-24';
const SEO_TITLE = 'API Contract Testing with Postman + Newman in CI/CD (2026) | Rohit Raj';
const SEO_DESCRIPTION = 'Repeatable regression and contract testing for REST APIs with Postman collections and Newman CLI. Catch breaking changes before they reach production — the CI/CD pattern I ship in 2026.';
const SEO_KEYWORDS = [
    'postman newman ci cd',
    'api contract testing 2026',
    'rest api regression testing',
    'newman cli github actions',
    'postman json schema validation',
    'api versioning breaking change detection',
    'consumer driven contract testing',
    'postman collection ci integration',
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

const newmanSteps = [
    { n: 1, title: 'Load Collection & Environment', detail: 'newman run text2sql-api-collection.json -e production.env.json', color: 'var(--accent)', mono: true },
    { n: 2, title: 'Execute Test Suite', detail: 'Runs every request, asserts status, schema, and custom JS checks', color: '#8b5cf6' },
    { n: 3, title: 'Generate Reports', detail: '--reporters cli,html,junit --reporter-html-export report.html', color: '#22c55e', mono: true },
];

const features = [
    { title: 'Schema Validation', body: 'Ensure response bodies match expected JSON schemas. Catch breaking changes like missing fields or type mismatches.', code: 'pm.expect(jsonData).to.have.property("id");\npm.expect(jsonData.status).to.be.a("string");' },
    { title: 'Environment-Driven Tests', body: 'Run the same collection against dev, staging, and production using different variable sets. One collection, three environments.', code: '{{base_url}}/api/v1/resource\nAuthorization: Bearer {{api_token}}' },
];

const benefits = [
    { icon: '🛡️', title: 'Regression Prevention', body: 'Detect breaking changes before they reach production. Every deployment is validated against the contract.' },
    { icon: '📋', title: 'Living Documentation', body: 'Postman collections are executable docs. New developers see how the API works by running the suite.' },
    { icon: '🔄', title: 'CI/CD Integration', body: 'Newman runs in pipelines, blocking deployments if contracts are violated. Automated enforcement, zero manual intervention.' },
];

const faqs = [
    { question: 'What is API contract testing and why does it matter?', answer: 'Contract testing validates that an API honors its interface agreement: request/response schema, status codes, headers, error payloads. Unlike end-to-end tests which check business logic, contract tests catch breaking changes at the interface layer — where most production bugs are introduced. In 2026 every REST API I ship has a Postman collection running in CI as the contract-of-record.' },
    { question: 'What is the difference between Postman and Newman?', answer: 'Postman is the GUI tool where you author and run collections interactively. Newman is the headless CLI that runs the same collections in CI/CD pipelines, on servers, or in scheduled jobs. Same collection JSON, same assertions, different runner. Authors use Postman. Pipelines use Newman.' },
    { question: 'How do I run Newman in GitHub Actions or GitLab CI?', answer: 'Install newman and newman-reporter-htmlextra via npm, run newman run <collection>.json -e <env>.json --reporters cli,htmlextra in a pipeline step, and upload the HTML report as a build artifact. Fail the job on non-zero exit. For private collections, pull via the Postman API using a service-account key stored in CI secrets.' },
    { question: 'How do I version REST API collections so old contracts still pass?', answer: 'Store the collection JSON in the API repo under tests/contracts/ with a filename like v1.postman_collection.json. When you add v2, create a separate collection. Your CI runs both until the v1 deprecation window closes. This makes the deprecation decision explicit — deleting the v1 collection is the signal that v1 is unsupported.' },
    { question: 'Can Newman replace unit tests and integration tests?', answer: 'No — contract tests occupy a different layer. Unit tests validate pure functions. Integration tests validate internal wiring. Contract tests validate the external API surface. Ship all three. Contract tests are especially valuable for APIs with external consumers (mobile apps, third-party integrations, partner systems) where a breaking change has wider blast radius.' },
    { question: 'What is consumer-driven contract testing and how does it differ from Postman?', answer: 'Consumer-driven contract testing (CDC) tools like Pact let each consumer publish their contract expectations to a broker, and the provider verifies against all consumers before shipping. Postman collections are provider-authored — simpler to adopt but less precise. Use Postman if you control all consumers; use Pact if external teams consume your API and you need tight co-ordination on breaking changes.' },
];

const relatedLinks = [
    { href: '/reliability/load-testing', label: 'Load Testing REST APIs with k6' },
    { href: '/reliability/kafka-testing', label: 'Kafka Consumer Testing with Embedded Kafka' },
    { href: '/reliability/observability', label: 'Observability with Prometheus + Grafana' },
    { href: '/notes/spring-boot-mcp', label: 'Spring Boot + MCP: Tool-Using AI Agents' },
    { href: '/services', label: 'Hire Rohit: Backend Architecture Consulting' },
];

export default async function APITestingPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: `${SITE_CONFIG.url}/${locale}` },
        { name: 'Reliability', url: `${SITE_CONFIG.url}/${locale}/reliability` },
        { name: 'API Testing', url: `${SITE_CONFIG.url}/${locale}${PAGE_PATH}` },
    ]);

    const techArticleSchema = generateTechArticleSchema({
        headline: 'API Contract Testing with Postman + Newman in CI/CD (2026)',
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
                            <span className="rel-breadcrumb-current">API Testing</span>
                        </nav>
                        <span className="rel-eyebrow" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', borderColor: 'rgba(59, 130, 246, 0.25)' }}>
                            <span aria-hidden="true">🔗</span> API Contract Testing
                        </span>
                        <h1 className="rel-headline">Contract Testing with Postman + Newman</h1>
                        <p className="rel-lead">
                            Repeatable regression and contract testing for REST APIs. Collections author in Postman, Newman runs in CI — catching breaking response changes before deploy.
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
                        <div className="section-header">
                            <h2 className="section-title">What Does the Newman CLI Flow Look Like?</h2>
                            <p className="section-description">Three commands. Load → execute → report. Everything else is variants of these.</p>
                        </div>
                        <ol className="rel-flow">
                            {newmanSteps.map((s, i) => (
                                <li key={s.n} className="rel-flow-step">
                                    <div className="rel-flow-card" style={{ borderLeftColor: s.color }}>
                                        <span className="rel-flow-num" style={{ background: s.color }}>{s.n}</span>
                                        <div className="rel-flow-body">
                                            <span className="rel-flow-title">{s.title}</span>
                                            <span className={s.mono ? 'rel-flow-detail mono' : 'rel-flow-detail'}>{s.detail}</span>
                                        </div>
                                    </div>
                                    {i < newmanSteps.length - 1 && <span className="rel-flow-arrow" aria-hidden="true">↓</span>}
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">What Is Contract Testing?</h2>
                            <p className="section-description">Validate the interface, not the implementation. Catch schema and status-code drift at the API boundary.</p>
                        </div>
                        <div className="rel-grid-2">
                            {features.map(f => (
                                <article key={f.title} className="rel-card">
                                    <h3 className="rel-card-title">{f.title}</h3>
                                    <p>{f.body}</p>
                                    <pre className="rel-code"><code>{f.code}</code></pre>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rel-section">
                    <div className="container">
                        <div className="rel-case">
                            <div className="rel-case-head">
                                <span className="rel-case-icon" aria-hidden="true">🔗</span>
                                <div>
                                    <h2>Real Use Case: Text2SQL Query API Validation</h2>
                                    <p>How contract testing caught a breaking response-format change before production deploy</p>
                                </div>
                            </div>
                            <dl className="rel-case-body">
                                <dt>Challenge</dt>
                                <dd>The Text2SQL Query API had multiple consumers — BI dashboards, Slack integrations, internal analytics. A response format change would break all downstream integrations at once.</dd>
                                <dt>Solution</dt>
                                <dd>A Postman collection covering: natural language → SQL translation, schema discovery and table metadata, SQL validation + execution, and error handling for ambiguous queries.</dd>
                                <dt>Discovery</dt>
                                <dd>During an &ldquo;optimization&rdquo;, a developer renamed <code className="rel-inline-code">generatedSQL</code> → <code className="rel-inline-code">sql</code> and <code className="rel-inline-code">queryConfidence</code> → <code className="rel-inline-code">confidence</code>. Newman tests failed in CI:</dd>
                            </dl>
                            <div className="rel-code-block">
                                <div className="rel-code-title">Newman CI output</div>
                                <pre><code>{`AssertionError: expected undefined to exist (generatedSQL)
  at Object.eval (test-script.js:15)
✘ POST /api/query [200 OK, 645ms] — 1 assertion failed`}</code></pre>
                            </div>
                            <dl className="rel-case-body">
                                <dt>Impact</dt>
                                <dd>Caught the breaking change <strong>before merging</strong>. Team added backward-compatible aliases and versioned the response format.</dd>
                            </dl>
                        </div>
                    </div>
                </section>

                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">What Does API Contract Testing Actually Buy You?</h2>
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
                            <p className="section-description">Common questions about running Postman and Newman in production pipelines.</p>
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
