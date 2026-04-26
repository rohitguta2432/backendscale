import Link from "next/link";
import Image from "next/image";
import type { HomeDictionary, Locale } from "@/lib/i18n";

interface HeroProps {
    dict: HomeDictionary;
    locale: Locale;
}

export default function Hero({ dict, locale }: HeroProps) {
    const priceAnchor = dict.hero.priceAnchor ?? "6-week MVP sprint · 50% back if we miss week-3 milestone";
    const bookCallCta = dict.hero.bookCallCta ?? "Book free 30-min call";
    const trustPills = dict.hero.trustPills ?? [
        "Fixed price · No hourly surprises",
        "You own the code",
        "Daily Slack / WhatsApp access",
        "First production commit in 5 days",
    ];

    return (
        <section className="hero">
            <div className="container">
                <div className="flex items-center gap-12 flex-wrap">
                    <div className="flex-1 min-w-[300px]">
                        <p className="hero-subtitle">{dict.hero.subtitle}</p>
                        <h1 className="hero-title">
                            {dict.hero.titleLine1}<br />
                            <span className="text-[var(--text-muted)] text-[0.7em]">{dict.hero.titleLine2}</span>
                        </h1>

                        <div className="hero-price-anchor" aria-label="Pricing summary">
                            <span className="hero-price-dot" aria-hidden="true" />
                            {priceAnchor}
                        </div>

                        <div className="hero-actions">
                            <Link href={`/${locale}/contact`} className="btn btn-primary">
                                {bookCallCta}
                            </Link>
                            <Link href={`/${locale}/projects`} className="btn btn-secondary">
                                {dict.aiProjects.sectionTitle}
                            </Link>
                            <Link href={`/${locale}/notes`} className="btn btn-secondary">
                                Engineering Notes
                            </Link>
                        </div>

                        <ul className="hero-trust-pills" aria-label="Trust signals">
                            {trustPills.map((pill) => (
                                <li key={pill} className="hero-trust-pill">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                                    <span>{pill}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-[0_0_320px] flex justify-center">
                        <Image
                            src="/hero-graphic.png"
                            alt="AI and Backend Systems Architecture"
                            width={320}
                            height={320}
                            priority
                            className="rounded-lg opacity-90"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
