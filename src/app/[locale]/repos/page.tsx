import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { repos } from "@/data/projects";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isValidLocale(locale)) return {};
    const dict = await getDictionary(locale);
    return {
        title: dict.meta.repos.title,
        description: dict.meta.repos.description,
    };
}

export default async function ReposPage({ params }: Props) {
    const { locale } = await params;
    if (!isValidLocale(locale)) notFound();
    const dict = await getDictionary(locale as Locale);

    return (
        <>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <div className="page-header">
                    <div className="container">
                        <h1 className="page-title">{dict.pages.repos.title}</h1>
                        <p className="page-description">{dict.pages.repos.description}</p>
                    </div>
                </div>

                <section>
                    <div className="container">
                        <div className="repo-list">
                            {repos.map((repo) => (
                                <article key={repo.name} className="repo-item">
                                    <div>
                                        <h3 className="repo-name">{repo.name}</h3>
                                        <p className="repo-description">{repo.description}</p>
                                        <div className="project-tags" style={{ marginTop: "0.75rem" }}>
                                            {repo.modules.map((mod) => (
                                                <span key={mod} className="tag">
                                                    {mod}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <a
                                        href={repo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary btn-sm"
                                    >
                                        View ↗
                                    </a>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer dict={dict.common} />
        </>
    );
}
