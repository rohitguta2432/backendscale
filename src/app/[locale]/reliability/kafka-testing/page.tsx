import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
    return [{ locale: "en" }, { locale: "hi" }, { locale: "fr" }, { locale: "de" }, { locale: "ar" }];
}

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function KafkaTestingPage({ params }: Props) {
    const { locale } = await params;

    if (!isValidLocale(locale)) {
        notFound();
    }

    const dict = await getDictionary(locale as Locale);

    return (
        <>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main" className="pt-24 sm:pt-32 pb-16 min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                    {/* Breadcrumb */}
                    <div className="mb-8 text-sm text-neutral-600 dark:text-neutral-400">
                        <Link href={`/${locale}`} className="hover:text-neutral-900 dark:hover:text-white">
                            Home
                        </Link>
                        <span className="mx-2">→</span>
                        <Link href={`/${locale}/reliability`} className="hover:text-neutral-900 dark:hover:text-white">
                            Reliability
                        </Link>
                        <span className="mx-2">→</span>
                        <span className="text-neutral-900 dark:text-white font-medium">Kafka Testing</span>
                    </div>

                    {/* Hero */}
                    <div className="max-w-4xl mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 mb-6">
                            <span className="text-2xl">📨</span>
                            <span className="font-semibold">Event-Driven Testing</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900 dark:text-white">
                            Deterministic Testing for Kafka Consumers
                        </h1>
                        <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Test event-driven systems with confidence. Simulate message replay, validate partition ordering, and handle failure scenarios without touching production Kafka clusters.
                        </p>
                    </div>

                    {/* Event Flow Visualization */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">Event Processing Flow</h2>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-8 rounded-2xl border border-purple-200 dark:border-purple-800">
                            <div className="flex flex-col gap-4">
                                {/* Producer */}
                                <div className="flex items-center gap-4">
                                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border-2 border-purple-500 flex-1">
                                        <div className="font-bold text-neutral-900 dark:text-white mb-1">1. Event Producer</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">API Gateway publishes Query Request event</div>
                                    </div>
                                    <div className="text-2xl">→</div>
                                </div>

                                {/* Kafka */}
                                <div className="flex items-center gap-4">
                                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border-2 border-blue-500 flex-1">
                                        <div className="font-bold text-neutral-900 dark:text-white mb-1">2. Kafka Topic</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">text2sql.query.requests (6 partitions)</div>
                                    </div>
                                    <div className="text-2xl">→</div>
                                </div>

                                {/* Consumer */}
                                <div className="flex items-center gap-4">
                                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border-2 border-green-500 flex-1">
                                        <div className="font-bold text-neutral-900 dark:text-white mb-1">3. Consumer</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Query Processor translates NL → SQL</div>
                                    </div>
                                    <div className="text-2xl">→</div>
                                </div>

                                {/* Result */}
                                <div className="flex items-center gap-4">
                                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border-2 border-orange-500 flex-1">
                                        <div className="font-bold text-neutral-900 dark:text-white mb-1">4. Downstream</div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Query Results or Dead Letter Queue</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Why Kafka Testing is Hard */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Why Event-Driven Testing is Challenging</h2>
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                                Testing Kafka consumers is fundamentally different from testing REST APIs. Events are asynchronous, ordering matters, and failures can cause message loss or duplication.
                            </p>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                Traditional integration tests struggle with:
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white flex items-center gap-2">
                                    <span className="text-red-500">❌</span>
                                    Non-Deterministic Behavior
                                </h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Message delivery order isn't guaranteed across partitions. Tests that pass locally may fail in CI due to race conditions.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white flex items-center gap-2">
                                    <span className="text-red-500">❌</span>
                                    Environment Dependency
                                </h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Running tests requires a Kafka cluster. This slows CI and introduces flakiness when clusters are shared.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white flex items-center gap-2">
                                    <span className="text-red-500">❌</span>
                                    Difficult Failure Scenarios
                                </h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    How do you test what happens when a consumer crashes mid-batch? Or when Kafka is temporarily unavailable?
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white flex items-center gap-2">
                                    <span className="text-red-500">❌</span>
                                    State Management
                                </h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Consumers maintain offsets and local state. Replaying events requires careful setup and teardown to avoid pollution.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* The Solution */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">The Solution: Event Replay Simulation</h2>
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                I use <strong>embedded Kafka</strong> for integration tests and <strong>forked simulation repos</strong> for deterministic message replay. This allows:
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Message Replay</h3>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-3">
                                    Record real production events and replay them in tests. Validate consumer logic against actual payloads.
                                </p>
                                <div className="bg-neutral-100 dark:bg-neutral-900 p-2 rounded font-mono text-xs">
                                    @EmbeddedKafka
                                    <br />
                                    @Test
                                </div>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Partition Testing</h3>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-3">
                                    Send events to specific partitions to test ordering guarantees. Ensure same-key events are processed sequentially.
                                </p>
                                <div className="bg-neutral-100 dark:bg-neutral-900 p-2 rounded font-mono text-xs">
                                    partition=hash(key)%3
                                </div>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Failure Injection</h3>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-3">
                                    Simulate broker failures, consumer crashes, and network partitions. Verify graceful degradation and retry logic.
                                </p>
                                <div className="bg-neutral-100 dark:bg-neutral-900 p-2 rounded font-mono text-xs">
                                    kafkaServer.shutdown()
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Real Use Case */}
                    <section className="mb-20 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="text-4xl">📨</div>
                            <div>
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                    Real Use Case: Text2SQL Query Ordering Bug
                                </h2>
                                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                                    How Kafka testing caught a race condition that would've caused incorrect query results
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                            <p>
                                <strong>Challenge:</strong> The Text2SQL Query Processor received multiple query requests for the same user session in rapid succession. Correlated queries (like "show me more details" after an initial query) needed to be processed <strong>in order</strong> to
                                maintain context.
                            </p>
                            <p>
                                <strong>Bug:</strong> During load testing, we discovered that follow-up queries for the same session were occasionally processed before the parent query completed, causing context mismatches and incorrect SQL generation.
                            </p>
                            <p>
                                <strong>Root Cause:</strong> Kafka partitions were assigned by random hash, not session ID. Queries for the same user session could land on different partitions and be consumed
                                out-of-order.
                            </p>
                            <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg my-4">
                                <div className="font-bold mb-2 text-neutral-900 dark:text-white">Test Code That Caught It:</div>
                                <div className="bg-neutral-900 dark:bg-black p-3 rounded font-mono text-sm text-green-400 overflow-x-auto">
                                    <div>// Send 3 queries for same session to different partitions</div>
                                    <div>sendQuery(sessionId="user-123", query="Show sales by region", partition=0);</div>
                                    <div>sendQuery(sessionId="user-123", query="Filter to Q4 only", partition=1);</div>
                                    <div>sendQuery(sessionId="user-123", query="Add year-over-year comparison", partition=2);</div>
                                    <br />
                                    <div className="text-red-400">// ❌ Assertion failed: queries processed out of order!</div>
                                </div>
                            </div>
                            <p>
                                <strong>Fix:</strong> Changed partition key from random hash to <code className="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">hash(sessionId)</code>. Now all
                                queries for the same user session go to the same partition, guaranteeing order.
                            </p>
                            <p>
                                <strong>Impact:</strong> Prevented incorrect query results in conversational flows. Without Kafka testing, this would've manifested as sporadic "context not found" errors under high load.
                            </p>
                        </div>
                    </section>

                    {/* How It Helps */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">How It Helps</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">🎯</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Deterministic Tests</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Control exact message order and timing. Tests that pass once will pass every time.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">🛡️</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Safe Failure Testing</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Simulate catastrophic failures without risking production data. Test disaster recovery procedures with confidence.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">⚡</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Fast Feedback</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Embedded Kafka starts in seconds. Run full integration tests in CI without external dependencies.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Back Navigation */}
                    <div className="flex justify-center">
                        <Link
                            href={`/${locale}/reliability`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                        >
                            ← Back to Reliability Overview
                        </Link>
                    </div>
                </div>
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
