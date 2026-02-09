import Header from "@/components/Header";
import Footer from "@/components/Footer";
import K6Results from "@/components/K6Results";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
    return [{ locale: "en" }, { locale: "hi" }, { locale: "fr" }, { locale: "de" }, { locale: "ar" }];
}

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    return createPageMetadata(
        'Performance Validation with k6 Load Testing | Rohit Raj',
        'Validate system performance under high throughput. Test capacity limits, identify bottlenecks, and ensure your infrastructure can handle production load.',
        '/reliability/load-testing',
        locale
    );
}

export default async function LoadTestingPage({ params }: Props) {
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
                        <span className="text-neutral-900 dark:text-white font-medium">Load Testing</span>
                    </div>

                    {/* Hero */}
                    <div className="max-w-4xl mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 mb-6">
                            <span className="text-2xl">⚡</span>
                            <span className="font-semibold">Load Testing</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900 dark:text-white">
                            Performance Validation with k6
                        </h1>
                        <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Validate system performance under high throughput. Test capacity limits, identify bottlenecks, and ensure your infrastructure can handle production load.
                        </p>
                    </div>

                    {/* k6 Results */}
                    <section className="mb-20">
                        <K6Results />
                    </section>

                    {/* Why Load Testing */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Why Load Testing Matters</h2>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                                Load testing simulates real-world traffic patterns to validate that your system can handle expected (and unexpected) demand. Without load testing, you're deploying blind—hoping your infrastructure will scale when it matters most.
                            </p>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                I use <strong>k6</strong>, an open-source load testing tool built for modern, cloud-native systems. It supports:
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 mt-8">
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Ramping Tests</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Gradually increase load to find breaking points. Identify at what VU count latency degrades or errors spike.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Soak Tests</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Run sustained load for extended periods. Catch memory leaks, connection pool exhaustion, and slow degradation over time.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Spike Tests</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Sudden traffic bursts to test auto-scaling. Ensure your system recovers gracefully after load spikes.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Real Use Case */}
                    <section className="mb-20 p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="text-4xl">⚡</div>
                            <div>
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                    Real Use Case: Text2SQL 500 Concurrent Queries/Sec Validation
                                </h2>
                                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                                    How load testing revealed hidden bottlenecks in the AI query pipeline
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                            <p>
                                <strong>Challenge:</strong> The Text2SQL Query Engine needed to handle 500 concurrent natural language queries with p95 latency under 800ms. Business dashboards refresh on a schedule, causing predictable traffic spikes.
                            </p>
                            <p>
                                <strong>Solution:</strong> Created k6 test scripts simulating diverse query patterns:
                            </p>
                            <div className="bg-neutral-900 p-4 rounded-lg my-4 font-mono text-sm text-green-400 overflow-x-auto">
                                <div>export default function() {"{"}</div>
                                <div>  http.post(API_URL, JSON.stringify({`{ query: "Show sales by region last quarter" }`}));</div>
                                <div>{"}"}</div>
                                <div className="text-neutral-500 mt-2">// Threshold: p95 {"<"} 800ms, error rate {"<"} 0.5%</div>
                            </div>
                            <p>
                                <strong>Discovery:</strong> At 350 concurrent users, p95 latency jumped from 620ms to <strong>3.2 seconds</strong>. The culprit? LLM provider rate limiting combined with database connection pool saturation.
                            </p>
                            <p>
                                <strong>Fix:</strong> Implemented request queuing with exponential backoff for LLM calls and increased DB pool size from 25 to 100. Re-tested at 600 concurrent users—p95 stayed at 750ms.
                            </p>
                            <p>
                                <strong>Impact:</strong> Prevented timeouts during peak dashboard refresh periods. Load testing caught the cascading failures <strong>before going live</strong>.
                            </p>
                        </div>
                    </section>

                    {/* How It Helps */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">How It Helps</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">📊</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Capacity Planning</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Know your system's limits before you hit them. Make data-driven scaling decisions based on actual performance curves.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Bottleneck Identification</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Pinpoint exactly where performance degrades. Database queries? Thread pools? Network I/O? Load testing reveals the answer.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">✅</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">SLA Validation</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Prove that your system meets latency and throughput SLAs under realistic load. Ship with confidence.
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
