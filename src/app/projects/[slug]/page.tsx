import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import { projects } from "@/data/projects";

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        return { title: "Project Not Found | Rohit Raj" };
    }

    return {
        title: `${project.name} | Rohit Raj`,
        description: project.problem,
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    return (
        <>
            <Header />
            <main id="main">
                <section>
                    <div className="container project-detail">
                        <Link href="/projects" className="back-link">
                            ← Back to Projects
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
                                    View Repository ↗
                                </a>
                            )}
                        </header>

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
                            <h2>Key Decisions & Trade-offs</h2>
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
            </main>
            <Footer />
        </>
    );
}
