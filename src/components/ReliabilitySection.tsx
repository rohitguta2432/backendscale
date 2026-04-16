"use client";

import Link from "next/link";
import type { HomeDictionary, Locale } from "@/lib/i18n";
import { cardConfigs } from '@/data/reliability';
import type { CardConfig } from '@/types/reliability';

interface ReliabilitySectionProps {
    dictionary: HomeDictionary;
    locale: Locale;
}

export default function ReliabilitySection({ dictionary, locale }: ReliabilitySectionProps) {
    const reliability = dictionary.reliability;

    // Early return if reliability section is not available
    if (!reliability) {
        return null;
    }

    return (
        <section className="reliability-section" aria-labelledby="reliability-heading">
            <div className="container">
                {/* Section Header */}
                <div className="reliability-header">
                    <span className="reliability-label">{reliability.sectionTitle}</span>
                    <h2 id="reliability-heading" className="reliability-heading">
                        {reliability.sectionHeading}
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="reliability-grid">
                    {cardConfigs.map((config) => {
                        const card = reliability.cards[config.key];
                        return (
                            <article
                                key={config.key}
                                className="reliability-card"
                                style={{ "--accent-color": config.accentColor } as React.CSSProperties}
                            >
                                <div className="reliability-card-header">
                                    <span className="reliability-card-icon">{config.icon}</span>
                                    <div>
                                        <h3 className="reliability-card-title">{card.title}</h3>
                                        <span className="reliability-card-subtitle">{card.subtitle}</span>
                                    </div>
                                </div>

                                <p className="reliability-card-description">{card.description}</p>

                                <ul className="reliability-card-bullets">
                                    {card.bullets.map((bullet, index) => (
                                        <li key={index}>{bullet}</li>
                                    ))}
                                </ul>

                                <Link
                                    href={`/${locale}${config.route}`}
                                    className="reliability-card-link"
                                >
                                    {card.linkText}
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
