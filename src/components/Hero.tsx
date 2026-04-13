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
                <div className="flex items-center gap-12 flex-wrap">
                    <div className="flex-1 min-w-[300px]">
                        <p className="hero-subtitle">{dict.hero.subtitle}</p>
                        <h1 className="hero-title">
                            {dict.hero.titleLine1}<br />
                            <span className="text-[var(--text-muted)] text-[0.7em]">{dict.hero.titleLine2}</span>
                        </h1>

                        <div className="hero-approach my-8 p-6 bg-[var(--card-bg)] border border-[var(--border)] text-left">
                            <h3 className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-4">
                                {dict.hero.approach.title}
                            </h3>
                            <ul className="m-0 pl-5 text-[var(--text-secondary)] leading-[1.8]">
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
