import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import ReliabilitySection from "@/components/ReliabilitySection";
import ReliabilityDashboard from "@/components/ReliabilityDashboard";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Force static generation for supported locales
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
        'Reliability & Production Readiness | Rohit Raj',
        'Comprehensive production readiness practices including load testing, Kafka testing, API contract testing, and observability with Prometheus & Grafana.',
        '/reliability',
        locale
    );
}

export default async function ReliabilityPage({ params }: Props) {
    const { locale } = await params;

    if (!isValidLocale(locale)) {
        notFound();
    }

    const dict = await getDictionary(locale as Locale);

    return (
        <>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main" className="pt-24 sm:pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                    {/* Header */}
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-neutral-900 dark:text-white">
                            {dict.pages.reliability.title}
                        </h1>
                        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {dict.pages.reliability.description}
                        </p>
                    </div>

                    {/* Dashboard */}
                    <ReliabilityDashboard dict={dict.pages.reliability.dashboard} />

                    {/* Detailed Cards (Reused) */}
                    <div className="mt-20">
                        <ReliabilitySection dictionary={dict.home} locale={locale as Locale} />
                    </div>
                    {/* Internal Links */}
                    <div className="mt-16 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">See Also</h2>
                        <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                            <li>
                                <Link href={`/${locale}/projects/stellarmind`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                    StellarMIND — Chat-to-SQL
                                </Link>{" "}
                                — The project where these reliability practices were battle-tested.
                            </li>
                            <li>
                                <Link href={`/${locale}/projects`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                    All Projects
                                </Link>{" "}
                                — Browse the full engineering portfolio.
                            </li>
                            <li>
                                <Link href={`/${locale}/about`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                    About Rohit Raj
                                </Link>{" "}
                                — 6+ years building production AI systems.
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
