import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
        'API Contract Testing with Postman & Newman | Rohit Raj',
        'Repeatable regression and smoke testing for REST APIs. Validate contracts, catch breaking changes, and ensure API stability across deployments.',
        '/reliability/api-testing',
        locale
    );
}

export default async function APITestingPage({ params }: Props) {
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
                        <span className="text-neutral-900 dark:text-white font-medium">API Testing</span>
                    </div>

                    {/* Hero */}
                    <div className="max-w-4xl mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 mb-6">
                            <span className="text-2xl">🔗</span>
                            <span className="font-semibold">API Contract Testing</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900 dark:text-white">
                            Contract Testing with Postman + Newman
                        </h1>
                        <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Repeatable regression and smoke testing for REST APIs. Validate contracts, catch breaking changes, and ensure API stability across deployments.
                        </p>
                    </div>

                    {/* Test Execution Flow */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">Newman CLI Execution Flow</h2>
                        <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                    1
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-bold mb-2">Load Collection & Environment</div>
                                    <div className="bg-neutral-800 p-3 rounded-lg font-mono text-sm text-green-400">
                                        newman run text2sql-api-collection.json -e production.env.json
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                    2
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-bold mb-2">Execute Test Suite</div>
                                    <div className="bg-neutral-800 p-3 rounded-lg font-mono text-sm text-neutral-300">
                                        ✓ POST /api/query [200 OK, 645ms]
                                        <br />
                                        ✓ GET /api/schema/:tableId [200 OK, 87ms]
                                        <br />✓ POST /api/validate-sql [200 OK, 156ms]
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                    3
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-bold mb-2">Generate Reports</div>
                                    <div className="bg-neutral-800 p-3 rounded-lg font-mono text-sm text-green-400">
                                        --reporters cli,html,junit --reporter-html-export report.html
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Contract Testing */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">What is Contract Testing?</h2>
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                                Contract testing validates that APIs honor their interface agreements. Instead of testing implementation details, you verify that the contract (request/response schema, status codes, headers) remains consistent.
                            </p>
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                I use <strong>Postman</strong> for collection authoring and <strong>Newman</strong> for CI/CD execution. This provides:
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Schema Validation</h3>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                                    Ensure response bodies match expected JSON schemas. Catch breaking changes like missing fields or type mismatches.
                                </p>
                                <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded-lg font-mono text-xs">
                                    pm.expect(jsonData).to.have.property(&apos;id&apos;);
                                    <br />
                                    pm.expect(jsonData.status).to.be.a(&apos;string&apos;);
                                </div>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Environment-Driven Tests</h3>
                                <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                                    Run the same collection against dev, staging, and production environments using different variable sets.
                                </p>
                                <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded-lg font-mono text-xs">
                                    {`{{base_url}}`}/api/v1/resource
                                    <br />
                                    Authorization: Bearer {`{{api_token}}`}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Real Use Case */}
                    <section className="mb-20 p-8 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-2xl border border-cyan-200 dark:border-cyan-800">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="text-4xl">🔗</div>
                            <div>
                                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                    Real Use Case: Text2SQL Query API Validation
                                </h2>
                                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                                    How contract testing caught a breaking response format change before production deployment
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                            <p>
                                <strong>Challenge:</strong> The Text2SQL Query API had multiple consumers (BI dashboards, Slack integrations, internal analytics tools). A response format change could break all downstream integrations.
                            </p>
                            <p>
                                <strong>Solution:</strong> Created a comprehensive Postman collection covering all endpoints:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Natural language query to SQL translation</li>
                                <li>Schema discovery and table metadata</li>
                                <li>SQL validation and execution</li>
                                <li>Error handling for ambiguous queries</li>
                            </ul>
                            <p>
                                <strong>Discovery:</strong> During an optimization, a developer changed the <code className="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">generatedSQL</code> field to{" "}
                                <code className="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">sql</code> and renamed <code className="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">queryConfidence</code> to <code className="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">confidence</code>. Newman tests failed in CI:
                            </p>
                            <div className="bg-neutral-900 p-4 rounded-lg my-4 font-mono text-sm text-red-400">
                                AssertionError: expected undefined to exist (generatedSQL)
                                <br />
                                at Object.eval (test-script.js:15)
                            </div>
                            <p>
                                <strong>Impact:</strong> Caught the breaking change <strong>before merging</strong>. The team added backward-compatible aliases and versioned the API response format.
                            </p>
                        </div>
                    </section>

                    {/* How It Helps */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">How It Helps</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">🛡️</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Regression Prevention</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Detect breaking changes before they reach production. Every deployment is validated against the contract.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">📋</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Living Documentation</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Postman collections serve as executable documentation. New developers can see how the API works by running tests.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <div className="text-3xl mb-4">🔄</div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">CI/CD Integration</h3>
                                <p className="text-neutral-700 dark:text-neutral-300">
                                    Newman runs in pipelines, blocking deployments if contracts are violated. Automated enforcement with zero manual intervention.
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
