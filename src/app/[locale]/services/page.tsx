import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { services } from "@/data/services";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    return createPageMetadata(
        "Services | Rohit Raj",
        "Mobile app development, AI chatbot development, and full-stack engineering services. From MVP to production — hire an experienced developer in India.",
        "/services",
        locale
    );
}

export default async function ServicesPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);

    return (
        <>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <div className="page-header">
                    <div className="container">
                        <h1 className="page-title">Services</h1>
                        <p className="page-description">
                            End-to-end engineering services for startups and businesses. Pick what you need, or let&apos;s scope something custom.
                        </p>
                    </div>
                </div>

                <section>
                    <div className="container">
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                                gap: "1.5rem",
                            }}
                        >
                            {services.map((service) => (
                                <Link
                                    key={service.slug}
                                    href={`/${locale}/services/${service.slug}`}
                                    style={{
                                        background: "var(--card-bg)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "12px",
                                        padding: "1.75rem",
                                        textDecoration: "none",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1rem",
                                        transition: "border-color 0.2s, transform 0.2s",
                                    }}
                                >
                                    <h2 style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                                        {service.title}
                                    </h2>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0, flex: 1 }}>
                                        {service.subheadline}
                                    </p>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                                            {service.costRange} &middot; {service.timeline}
                                        </span>
                                        <span style={{ color: "var(--accent)", fontSize: "0.9rem", fontWeight: 500 }}>
                                            Learn more &rarr;
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
