import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo-config";
import { projects } from "@/data/projects";
import { cardConfigs } from "@/data/reliability";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    const dict = await getDictionary(locale);
    return createPageMetadata(
        dict.meta.about.title,
        dict.meta.about.description,
        '/about',
        locale
    );
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);
    const about = dict.pages.about;

    const shippedCount = projects.length;
    const activeCount = projects.filter(p => p.status === 'active').length;

    const stats = [
        { value: '10+', label: 'Years shipping production', href: null },
        { value: `${shippedCount}+`, label: 'Systems built', href: `/${locale}/projects` },
        { value: `${activeCount}`, label: 'Active projects', href: `/${locale}/projects` },
        { value: 'Worldwide', label: 'India · Clients globally', href: null },
    ];

    const stack = [
        {
            group: 'Backend & Infra',
            items: ['Spring Boot 3.x', 'Java 21', 'Kafka', 'PostgreSQL 16', 'Redis 7', 'Docker', 'Flyway'],
        },
        {
            group: 'Mobile & Frontend',
            items: ['React Native + Expo', 'Kotlin', 'Jetpack Compose', 'Next.js 16', 'TypeScript', 'Tailwind 4'],
        },
        {
            group: 'AI & Data',
            items: ['Spring AI', 'OpenAI', 'AWS Bedrock', 'Gemma 4', 'LiteRT', 'RAG + pgvector', 'LLM orchestration'],
        },
    ];

    const socials = [
        { label: 'GitHub', href: 'https://github.com/rohitguta2432' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/rohitraj2482' },
        { label: 'X', href: 'https://x.com/rohitraj2482' },
        { label: 'Email', href: 'mailto:rohitgupta2432@gmail.com' },
    ];

    return (
        <>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <section className="about-hero">
                    <div className="container about-hero-inner">
                        <div className="about-avatar" aria-hidden="true">RR</div>
                        <div className="about-hero-body">
                            <span className="about-eyebrow">{about.title}</span>
                            <h1 className="about-headline">Rohit Raj</h1>
                            <p className="about-role">Founding Engineer · AI Systems Architect · India</p>
                            <p className="about-lead">{about.bio1}</p>
                            <div className="about-cta-row">
                                <Link href={`/${locale}/contact`} className="btn btn-primary">Start a project</Link>
                                <Link href={`/${locale}/projects`} className="btn btn-secondary">See current work</Link>
                            </div>
                            <ul className="about-socials">
                                {socials.map(s => (
                                    <li key={s.label}>
                                        <a href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{s.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="about-stats-section">
                    <div className="container">
                        <div className="about-stats">
                            {stats.map((s) => {
                                const inner = (
                                    <>
                                        <span className="about-stat-value">{s.value}</span>
                                        <span className="about-stat-label">{s.label}</span>
                                    </>
                                );
                                return s.href ? (
                                    <Link key={s.label} href={s.href} className="about-stat about-stat-link">{inner}</Link>
                                ) : (
                                    <div key={s.label} className="about-stat">{inner}</div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="about-narrative-section">
                    <div className="container about-narrative">
                        <div className="about-narrative-card">
                            <h2>What I build</h2>
                            <p>{about.bio2}</p>
                        </div>
                        {about.bio3 && (
                            <div className="about-narrative-card">
                                <h2>How I got here</h2>
                                <p>{about.bio3}</p>
                            </div>
                        )}
                        {about.bio4 && (
                            <div className="about-narrative-card">
                                <h2>Why this site exists</h2>
                                <p>{about.bio4}</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="about-stack-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Tech stack I ship with</h2>
                            <p className="section-description">Production-grade tools, picked per project. No framework-of-the-week churn.</p>
                        </div>
                        <div className="about-stack-grid">
                            {stack.map(g => (
                                <div key={g.group} className="about-stack-group">
                                    <h3 className="about-stack-title">{g.group}</h3>
                                    <ul className="about-stack-chips">
                                        {g.items.map(item => (
                                            <li key={item} className="about-chip">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="about-reliability-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Every project ships with real infrastructure</h2>
                            <p className="section-description">Not demos. Observability, load tests, contract tests, and Kafka verification by default.</p>
                        </div>
                        <div className="about-reliability-grid">
                            {cardConfigs.map(c => (
                                <Link key={c.key} href={`/${locale}${c.route}`} className="about-reliability-card" style={{ borderTopColor: c.accentColor }}>
                                    <span className="about-reliability-icon" aria-hidden="true">{c.icon}</span>
                                    <span className="about-reliability-label">{c.key.replace(/([A-Z])/g, ' $1').replace(/^./, ch => ch.toUpperCase())}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="about-final-cta">
                    <div className="container">
                        <div className="about-final-cta-card">
                            <h2>Stuck between demo and production?</h2>
                            <p>Most AI products stall there. If you&apos;re trying to cross that gap, I&apos;d like to hear about it.</p>
                            <div className="about-cta-row">
                                <Link href={`/${locale}/contact`} className="btn btn-primary">Book a call</Link>
                                <Link href={`/${locale}/services`} className="btn btn-ghost">See services</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
