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

type Props = {
    params: Promise<{ locale: string }>;
};

const PAGE_PATH = '/reliability/kafka-testing';
const DATE_PUBLISHED = '2026-01-31';
const DATE_MODIFIED = '2026-04-24';
const SEO_TITLE = 'Embedded Kafka Consumer Testing in Spring Boot (2026 Guide) | Rohit Raj';
const SEO_DESCRIPTION = 'Deterministic testing for Kafka consumers with embedded kafka, partition ordering guarantees, and failure injection in Spring Boot — the exact pattern I ship to production in 2026.';
const SEO_KEYWORDS = [
    'embedded kafka testing spring boot',
    'kafka consumer integration test 2026',
    'deterministic kafka testing',
    'spring kafka EmbeddedKafka annotation',
    'kafka partition ordering test',
    'kafka dead letter queue testing',
    'test kafka consumer without broker',
    'spring boot kafka failure injection',
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

const flowSteps = [
    { n: 1, title: 'Event Producer', detail: 'API Gateway publishes Query Request event', color: 'var(--accent)' },
    { n: 2, title: 'Kafka Topic', detail: 'text2sql.query.requests (6 partitions)', color: '#8b5cf6', mono: true },
    { n: 3, title: 'Consumer', detail: 'Query Processor translates NL → SQL', color: '#22c55e' },
    { n: 4, title: 'Downstream', detail: 'Query Results or Dead Letter Queue', color: '#f97316' },
];

const challenges = [
    { title: 'Non-Deterministic Behavior', body: "Message delivery order isn't guaranteed across partitions. Tests that pass locally may fail in CI due to race conditions." },
    { title: 'Environment Dependency', body: 'Running tests requires a Kafka cluster. This slows CI and introduces flakiness when clusters are shared.' },
    { title: 'Difficult Failure Scenarios', body: 'How do you test what happens when a consumer crashes mid-batch? Or when Kafka is temporarily unavailable?' },
    { title: 'State Management', body: 'Consumers maintain offsets and local state. Replaying events requires careful setup and teardown to avoid pollution.' },
];

const solutions = [
    { title: 'Message Replay', body: 'Record real production events and replay them in tests. Validate consumer logic against actual payloads.', code: '@EmbeddedKafka\n@Test' },
    { title: 'Partition Testing', body: 'Send events to specific partitions to test ordering guarantees. Ensure same-key events are processed sequentially.', code: 'partition = hash(key) % 3' },
    { title: 'Failure Injection', body: 'Simulate broker failures, consumer crashes, and network partitions. Verify graceful degradation and retry logic.', code: 'kafkaServer.shutdown()' },
];

const benefits = [
    { icon: '🎯', title: 'Deterministic Tests', body: 'Control exact message order and timing. Tests that pass once will pass every time.' },
    { icon: '🛡️', title: 'Safe Failure Testing', body: 'Simulate catastrophic failures without risking production data. Test disaster recovery procedures with confidence.' },
    { icon: '⚡', title: 'Fast Feedback', body: 'Embedded Kafka starts in seconds. Run full integration tests in CI without external dependencies.' },
];

const faqs = [
    {
        question: 'How do you test Kafka consumers deterministically in Spring Boot?',
        answer: "Use the @EmbeddedKafka annotation from spring-kafka-test to spin up an in-memory Kafka broker scoped to the test JVM. Combine it with @SpringBootTest and a fixed partition count. Produce messages with explicit partition targets so ordering is controlled, then assert on the consumer's state after a bounded wait. This removes broker shared-state flakiness and makes tests pass-once-pass-always.",
    },
    {
        question: 'What is embedded Kafka and when should I use it?',
        answer: 'Embedded Kafka is an in-process Kafka broker that starts inside the test JVM and shuts down when the test class finishes. Use it for integration tests where you need real serialization, partition assignment, and consumer group rebalancing — things Testcontainers or mocks cannot reproduce accurately. Use mocks only for pure unit tests on deserialization and business logic.',
    },
    {
        question: 'How do you test Kafka partition ordering guarantees?',
        answer: 'Produce messages with the same key and assert they land on the same partition (Kafka routes by hash(key) % partitions). Then consume with a single-threaded listener and assert the arrival order matches production order. For session-scoped ordering, use the session ID as the partition key so all events for one session serialize through one partition.',
    },
    {
        question: 'How do you simulate Kafka broker failures in integration tests?',
        answer: 'Call kafkaServer.shutdown() mid-test, assert the consumer detects the disconnection, then restart with kafkaServer.start() and assert the consumer resumes from the last committed offset. For network partitions, use Toxiproxy or the SimulatingNetworkFailures feature in spring-kafka-test. Verify retry counts, backoff timing, and dead-letter queue routing in the same test.',
    },
    {
        question: 'What is a Kafka Dead Letter Queue and how do I test it?',
        answer: 'A Dead Letter Queue (DLQ) is a separate Kafka topic that receives messages the primary consumer failed to process after N retries. Test it by producing a poison message (wrong schema, business-rule violation), running the consumer, and asserting the message lands on the DLQ topic with the failure reason in the headers. Always test the DLQ consumer too — a DLQ nobody reads is worse than no DLQ.',
    },
    {
        question: 'Do I need Testcontainers if I already use Embedded Kafka?',
        answer: 'Use embedded Kafka for fast JVM-scoped tests (sub-second startup). Switch to Testcontainers when you need to test schema registry, Kafka Connect, or vendor-specific features like Confluent Cloud. In 2026 most Spring Boot projects I ship use both: embedded Kafka for the 80% of tests that validate consumer logic, Testcontainers for the 20% that validate infrastructure integration.',
    },
];

const relatedLinks = [
    { href: '/notes/spring-boot-mcp', label: 'Spring Boot + MCP: Building Tool-Using AI Agents' },
    { href: '/notes/build-enterprise-deal-matching-platform-spring-boot-nextjs', label: 'Enterprise Deal-Matching Platform on Spring Boot' },
    { href: '/notes/build-multi-tenant-saas-spring-boot-java-21', label: 'Multi-Tenant SaaS on Spring Boot + Java 21' },
    { href: '/reliability/load-testing', label: 'Load Testing: k6 Against Kafka-Backed APIs' },
    { href: '/reliability/observability', label: 'Observability: Kafka Consumer Lag SLOs' },
    { href: '/services', label: 'Hire Rohit: Kafka + Spring Boot Specialist' },
];

export default async function KafkaTestingPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: `${SITE_CONFIG.url}/${locale}` },
        { name: 'Reliability', url: `${SITE_CONFIG.url}/${locale}/reliability` },
        { name: 'Kafka Testing', url: `${SITE_CONFIG.url}/${locale}${PAGE_PATH}` },
    ]);

    const techArticleSchema = generateTechArticleSchema({
        headline: 'Embedded Kafka Consumer Testing in Spring Boot (2026 Guide)',
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
                            <span className="rel-breadcrumb-current">Kafka Testing</span>
                        </nav>
                        <span className="rel-eyebrow" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderColor: 'rgba(139, 92, 246, 0.25)' }}>
                            <span aria-hidden="true">📨</span> Event-Driven Testing
                        </span>
                        <h1 className="rel-headline">Embedded Kafka Consumer Testing in Spring Boot</h1>
                        <p className="rel-lead">
                            Deterministic Kafka consumer tests with <strong>@EmbeddedKafka</strong>, partition-ordering guarantees, and failure injection — the exact pattern I ship to production in 2026. No brokers in CI. No flaky tests.
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
                            <h2 className="section-title">What Does a Kafka Event Flow Look Like in Production?</h2>
                            <p className="section-description">Query Request → Kafka → Consumer → Result. Every hop is a test boundary.</p>
                        </div>
                        <ol className="rel-flow">
                            {flowSteps.map((s, i) => (
                                <li key={s.n} className="rel-flow-step">
                                    <div className="rel-flow-card" style={{ borderLeftColor: s.color }}>
                                        <span className="rel-flow-num" style={{ background: s.color }}>{s.n}</span>
                                        <div className="rel-flow-body">
                                            <span className="rel-flow-title">{s.title}</span>
                                            <span className={s.mono ? 'rel-flow-detail mono' : 'rel-flow-detail'}>{s.detail}</span>
                                        </div>
                                    </div>
                                    {i < flowSteps.length - 1 && <span className="rel-flow-arrow" aria-hidden="true">↓</span>}
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Why Is Event-Driven Testing Harder Than REST Testing?</h2>
                            <p className="section-description">Asynchronous events, partitioned ordering, shared clusters. Traditional integration tests break down.</p>
                        </div>
                        <div className="rel-grid-2">
                            {challenges.map(c => (
                                <article key={c.title} className="rel-card rel-card-danger">
                                    <h3 className="rel-card-title">
                                        <span className="rel-card-mark" aria-hidden="true">✕</span>
                                        {c.title}
                                    </h3>
                                    <p>{c.body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rel-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">How Do I Test Kafka Consumers Without a Broker?</h2>
                            <p className="section-description">Embedded Kafka for integration tests. Forked simulation repos for deterministic replay.</p>
                        </div>
                        <div className="rel-grid-3">
                            {solutions.map(s => (
                                <article key={s.title} className="rel-card">
                                    <h3 className="rel-card-title">{s.title}</h3>
                                    <p>{s.body}</p>
                                    <pre className="rel-code"><code>{s.code}</code></pre>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="rel-case">
                            <div className="rel-case-head">
                                <span className="rel-case-icon" aria-hidden="true">📨</span>
                                <div>
                                    <h2>Real Use Case: Text2SQL Query Ordering Bug</h2>
                                    <p>How Kafka testing caught a race condition that would&apos;ve caused incorrect query results</p>
                                </div>
                            </div>
                            <dl className="rel-case-body">
                                <dt>Challenge</dt>
                                <dd>The Text2SQL Query Processor received multiple query requests for the same user session in rapid succession. Correlated queries (like &ldquo;show me more details&rdquo; after an initial query) needed to be processed <strong>in order</strong> to maintain context.</dd>
                                <dt>Bug</dt>
                                <dd>During load testing, follow-up queries for the same session were occasionally processed before the parent query completed, causing context mismatches and incorrect SQL generation.</dd>
                                <dt>Root Cause</dt>
                                <dd>Kafka partitions were assigned by random hash, not session ID. Queries for the same user session could land on different partitions and be consumed out-of-order.</dd>
                            </dl>
                            <div className="rel-code-block">
                                <div className="rel-code-title">Test that caught it</div>
                                <pre><code>{`// Send 3 queries for same session to different partitions
sendQuery(sessionId="user-123", query="Show sales by region",       partition=0);
sendQuery(sessionId="user-123", query="Filter to Q4 only",          partition=1);
sendQuery(sessionId="user-123", query="Add year-over-year compare", partition=2);

// ❌ Assertion failed: queries processed out of order!`}</code></pre>
                            </div>
                            <dl className="rel-case-body">
                                <dt>Fix</dt>
                                <dd>Changed partition key from random hash to <code className="rel-inline-code">hash(sessionId)</code>. Now all queries for the same user session go to the same partition, guaranteeing order.</dd>
                                <dt>Impact</dt>
                                <dd>Prevented incorrect query results in conversational flows. Without Kafka testing, this would&apos;ve manifested as sporadic &ldquo;context not found&rdquo; errors under high load.</dd>
                            </dl>
                        </div>
                    </div>
                </section>

                <section className="rel-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">What Are the Benefits of Deterministic Kafka Testing?</h2>
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

                <section className="rel-section rel-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Frequently Asked Questions</h2>
                            <p className="section-description">The questions engineers actually ask when setting up Kafka tests in Spring Boot.</p>
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

                <section className="rel-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Related Reading</h2>
                            <p className="section-description">Deeper dives into Spring Boot, Kafka, and production reliability on this site.</p>
                        </div>
                        <ul className="rel-related">
                            {relatedLinks.map(r => (
                                <li key={r.href}>
                                    <Link href={`/${locale}${r.href}`}>{r.label} →</Link>
                                </li>
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
