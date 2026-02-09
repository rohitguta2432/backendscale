import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrometheusMetrics from "@/components/PrometheusMetrics";
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
        'Production-Grade Observability with Prometheus & Grafana | Rohit Raj',
        'Real-time metrics, dashboards, and SLO visibility for distributed systems. Monitor what matters, respond faster, and maintain reliability at scale.',
        '/reliability/observability',
        locale
    );
}

export default async function ObservabilityPage({ params }: Props) {
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
                        <span className="text-neutral-900 dark:text-white font-medium">Observability</span>
                    </div>

                    {/* Hero */}
                    <div className="max-w-4xl mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 mb-6">
                            <span className="text-2xl">📊</span>
                            <span className="font-semibold">Observability</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900 dark:text-white">
                            Production-Grade Observability with Prometheus + Grafana
                        </h1>
                        <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Real-time metrics, dashboards, and SLO visibility for distributed systems. Monitor what matters, respond faster, and maintain reliability at scale.
                        </p>
                    </div>

                    {/* Real-time Metrics */}
                    <section className="mb-20">
                        <PrometheusMetrics />
                    </section>

                    {/* What is Observability */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">What is Observability?</h2>
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                                Observability is the ability to understand the internal state of a system by examining its outputs. Unlike traditional monitoring, which asks predefined questions, observability enables you to ask <strong>any question</strong> about your system's behavior.
                            </p>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                Using Prometheus for metrics collection and Grafana for visualization, I implement comprehensive observability across all production systems. This includes:
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">RED Metrics</h3>
                                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                                    <li>• <strong>Rate</strong>: Requests per second</li>
                                    <li>• <strong>Errors</strong>: Failed request rate</li>
                                    <li>• <strong>Duration</strong>: Request latency (p50, p95, p99)</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">USE Metrics</h3>
                                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                                    <li>• <strong>Utilization</strong>: Resource usage (CPU, memory)</li>
                                    <li>• <strong>Saturation</strong>: Queue depth, backlog</li>
                                    <li>• <strong>Errors</strong>: System-level failures</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Real Use Case */}
                    <section className="mb-20 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="text-4xl">🚀</div>
                            <div>
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                    Real Use Case: Text2SQL Query Engine
                                </h2>
                                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                                    How observability helped maintain 99.5% query accuracy for an AI-powered natural language to SQL system
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                            <p>
                                <strong>Challenge:</strong> The Text2SQL Query Engine needed to maintain sub-500ms p95 latency while translating natural language queries to SQL with high accuracy. Without visibility into the LLM pipeline, debugging query failures would require parsing logs across the API, schema resolver, and LLM layers.
                            </p>
                            <p>
                                <strong>Solution:</strong> Implemented Prometheus metrics for:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 my-4">
                                <div className="p-4 bg-white/80 dark:bg-neutral-900/80 rounded-lg">
                                    <div className="font-bold mb-2">🤖 LLM Pipeline Metrics</div>
                                    <ul className="text-sm space-y-1">
                                        <li>• Token usage per request</li>
                                        <li>• LLM response latency (p50, p95, p99)</li>
                                        <li>• Schema context cache hit rate</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-white/80 dark:bg-neutral-900/80 rounded-lg">
                                    <div className="font-bold mb-2">📊 Query Accuracy Metrics</div>
                                    <ul className="text-sm space-y-1">
                                        <li>• SQL syntax validation rate</li>
                                        <li>• Query execution success rate</li>
                                        <li>• Fallback/retry frequency</li>
                                    </ul>
                                </div>
                            </div>
                            <p>
                                <strong>Impact:</strong> Reduced mean time to detection (MTTD) from hours to <strong>minutes</strong>. When LLM latency spiked due to context overflow, alerts fired before users reported timeouts, allowing proactive token optimization.
                            </p>
                        </div>
                    </section>

                    {/* How It Helps */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">How It Helps</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">🎯</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">SLO Tracking</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Define and track Service Level Objectives. Know when you're burning error budget before SLA violations occur.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Incident Response</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Correlate metrics across services during incidents. Identify root causes faster with historical data and trend analysis.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">📊</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Capacity Planning</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Use historical trends to predict resource needs. Scale proactively based on data, not guesswork.
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
