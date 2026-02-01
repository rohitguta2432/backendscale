import Link from "next/link";
import Image from "next/image";
import type { HomeDictionary, Locale } from "@/lib/i18n";

interface HeroProps {
    dict: HomeDictionary;
    locale: Locale;
}

export default function Hero({ dict, locale }: HeroProps) {
    return (
        <section className="hero">
            <div className="container">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <p className="hero-subtitle">{dict.hero.subtitle}</p>
                        <h1 className="hero-title">
                            {dict.hero.titleLine1}<br />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.7em' }}>{dict.hero.titleLine2}</span>
                        </h1>

                        <div className="hero-approach" style={{
                            margin: '2rem 0',
                            padding: '1.5rem',
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            textAlign: 'left'
                        }}>
                            <h3 style={{
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'var(--text-muted)',
                                marginBottom: '1rem'
                            }}>
                                {dict.hero.approach.title}
                            </h3>
                            <ul style={{
                                margin: 0,
                                paddingLeft: '1.25rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.8
                            }}>
                                <li><strong>{dict.hero.approach.items.problemFirst.title}</strong> — {dict.hero.approach.items.problemFirst.description}</li>
                                <li><strong>{dict.hero.approach.items.aiTool.title}</strong> — {dict.hero.approach.items.aiTool.description}</li>
                                <li><strong>{dict.hero.approach.items.productionReady.title}</strong> — {dict.hero.approach.items.productionReady.description}</li>
                                <li><strong>{dict.hero.approach.items.openEngineering.title}</strong> — {dict.hero.approach.items.openEngineering.description}</li>
                            </ul>
                        </div>

                        <div className="hero-actions">
                            <Link href={`/${locale}/projects`} className="btn btn-primary">
                                {dict.aiProjects.sectionTitle}
                            </Link>
                            <Link href={`/${locale}/notes`} className="btn btn-secondary">
                                Engineering Notes
                            </Link>
                            <a
                                href="https://github.com/rohitguta2432"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>

                    <div style={{
                        flex: '0 0 320px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Image
                            src="/hero-graphic.png"
                            alt="AI and Backend Systems Architecture"
                            width={320}
                            height={320}
                            priority
                            style={{
                                borderRadius: '8px',
                                opacity: 0.9
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
