import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import { projects } from "@/data/projects";
import { getDictionary, isValidLocale, locales, type Locale } from "@/lib/i18n";

interface ProjectPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
    const params = [];
    for (const locale of locales) {
        for (const project of projects) {
            params.push({ locale, slug: project.slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: ProjectPageProps) {
    const { locale, slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project || !isValidLocale(locale)) {
        return { title: "Project Not Found | Rohit Raj" };
    }

    return {
        title: `${project.name} | Rohit Raj`,
        description: project.problem,
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { locale, slug } = await params;

    if (!isValidLocale(locale)) notFound();

    const project = projects.find((p) => p.slug === slug);
    if (!project) notFound();

    const dict = await getDictionary(locale as Locale);

    return (
        <>
            <Header locale={locale as Locale} dict={dict.common} />
            <main id="main">
                <section>
                    <div className="container project-detail">
                        <Link href={`/${locale}/projects`} className="back-link">
                            ← {dict.common.nav.projects}
                        </Link>

                        <header className="project-detail-header">
                            <h1 className="project-detail-title">{project.name}</h1>
                            <div className="project-detail-meta">
                                <StatusBadge status={project.status} />
                                <div className="project-tags">
                                    {project.techStack.map((tech) => (
                                        <span key={tech} className="tag">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {project.repoUrl && (
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary btn-sm"
                                >
                                    {dict.common.buttons.viewRepository}
                                </a>
                            )}
                        </header>

                        {project.image && (
                            <div className="project-hero-image">
                                <div className="project-image-wrapper">
                                    <Image
                                        src={project.image}
                                        alt={`${project.name} interface screenshot`}
                                        width={1737}
                                        height={921}
                                        priority
                                        className="project-screenshot"
                                    />
                                    <div className="project-image-caption">
                                        <span className="caption-icon">📸</span>
                                        <span>Live Application Interface</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="project-detail-section">
                            <h2>Problem</h2>
                            <p>{project.problem}</p>
                        </div>

                        <div className="project-detail-section">
                            <h2>Why It Matters</h2>
                            <p>{project.details.whyItMatters}</p>
                        </div>

                        <div className="project-detail-section">
                            <h2>System Approach</h2>
                            <ul>
                                {project.details.approach.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="project-detail-section">
                            <h2>Key Decisions &amp; Trade-offs</h2>
                            <ul>
                                {project.details.decisions.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="project-detail-section">
                            <h2>Current Status</h2>
                            <p>{project.details.currentStatus}</p>
                        </div>

                        <div className="project-detail-section">
                            <h2>Roadmap</h2>
                            <ul>
                                {project.details.roadmap.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="project-detail-section">
                            <h2>What I&apos;d Improve Next</h2>
                            <ul>
                                {project.details.improvements.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </main >
            <Footer dict={dict.common} locale={locale as Locale} />
        </>
    );
}
