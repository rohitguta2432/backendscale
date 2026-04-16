import Link from "next/link";
import Image from "next/image";
import type { HomeDictionary } from "@/lib/i18n";
import { aiProjectSummaries } from '@/data/ai-projects';

interface AIProjectsProps {
    dict: HomeDictionary;
}

function AIProjectCard({
    title,
    problem,
    solution,
    techStack,
    aiApproach,
    repoUrl,
    status,
    labels,
    image,
    index
}: {
    title: string;
    problem: string;
    solution: string;
    techStack: string[];
    aiApproach: string;
    repoUrl: string;
    status: 'active' | 'development' | 'production';
    labels: HomeDictionary['aiProjects']['labels'];
    image?: string;
    index: number;
}) {
    const isEven = index % 2 === 0;

    return (
        <article className="ai-project-card group">
            {/* Numbered accent line */}
            <div className="ai-project-number">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div className="ai-project-number-line" />
            </div>

            {/* Content area */}
            <div className="ai-project-body">
                {/* Header row */}
                <div className="ai-project-header">
                    <div>
                        <h3 className="ai-project-title">{title}</h3>
                        <div className="ai-project-meta">
                            <span className={`ai-project-status ai-project-status--${status}`}>
                                {status}
                            </span>
                            <a
                                href={repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ai-project-repo"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                Source
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main content — image + text side by side when image exists */}
                <div className={`ai-project-content ${image ? (isEven ? 'ai-project-content--img-right' : 'ai-project-content--img-left') : ''}`}>
                    {image && (
                        <div className="ai-project-image">
                            <Image
                                src={image}
                                alt={title}
                                width={480}
                                height={300}
                                className="ai-project-img"
                            />
                        </div>
                    )}
                    <div className="ai-project-text">
                        <div className="ai-project-section">
                            <h4 className="ai-project-label ai-project-label--problem">{labels.problem}</h4>
                            <p>{problem}</p>
                        </div>
                        <div className="ai-project-section">
                            <h4 className="ai-project-label ai-project-label--solution">{labels.solution}</h4>
                            <p>{solution}</p>
                        </div>
                    </div>
                </div>

                {/* AI Approach — compact callout */}
                <div className="ai-project-approach">
                    <h4 className="ai-project-label ai-project-label--ai">{labels.aiApproach}</h4>
                    <p>{aiApproach}</p>
                </div>

                {/* Tech stack */}
                <div className="ai-project-tech">
                    {techStack.map((tech) => (
                        <span key={tech} className="ai-project-chip">{tech}</span>
                    ))}
                </div>
            </div>
        </article>
    );
}

export default function AIProjects({ dict }: AIProjectsProps) {
    return (
        <section id="ai-projects" className="ai-projects-section">
            <div className="container">
                <div className="ai-projects-header">
                    <span className="ai-projects-eyebrow">{dict.aiProjects.sectionTitle}</span>
                    <h2 className="ai-projects-heading">{dict.aiProjects.sectionHeading}</h2>
                    <p className="ai-projects-subheading">{dict.aiProjects.sectionDescription}</p>
                </div>

                <div className="ai-projects-list">
                    {aiProjectSummaries.map((project, i) => (
                        <AIProjectCard
                            key={project.title}
                            {...project}
                            labels={dict.aiProjects.labels}
                            index={i}
                        />
                    ))}
                </div>

                <div className="ai-projects-footer">
                    <Link href="/notes" className="btn btn-secondary">
                        {dict.aiProjects.readNotes} →
                    </Link>
                </div>
            </div>
        </section>
    );
}
