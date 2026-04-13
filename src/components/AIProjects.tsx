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
    image
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
}) {
    const statusColors = {
        active: 'var(--status-active)',
        development: 'var(--status-iterating)',
        production: 'var(--status-active)'
    };

    return (
        <article style={{
            border: '1px solid var(--border)',
            padding: '1.5rem',
            backgroundColor: 'var(--card-bg)',
            marginBottom: '1.5rem'
        }}>
            {/* Project Screenshot */}
            {image && (
                <div style={{
                    marginBottom: '1.5rem',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                    <img
                        src={image}
                        alt={`${title} screenshot`}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                        }}
                    />
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
                <span style={{
                    backgroundColor: statusColors[status],
                    color: 'white',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '2px',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase'
                }}>
                    {status}
                </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{
                    fontSize: '0.8rem',
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem'
                }}>
                    {labels.problem}
                </h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {problem}
                </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{
                    fontSize: '0.8rem',
                    color: 'var(--status-active)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem'
                }}>
                    {labels.solution}
                </h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {solution}
                </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem'
                }}>
                    {labels.aiApproach}
                </h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                    {aiApproach}
                </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                }}>
                    {labels.techStack}
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {techStack.map((tech) => (
                        <code key={tech} style={{
                            fontSize: '0.8rem',
                            backgroundColor: 'var(--bg-color)',
                            padding: '0.25rem 0.5rem',
                            border: '1px solid var(--border)'
                        }}>
                            {tech}
                        </code>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.85rem', color: 'var(--accent)' }}
                >
                    GitHub →
                </a>
            </div>
        </article>
    );
}

export default function AIProjects({ dict }: AIProjectsProps) {
    const aiProjects = aiProjectSummaries;

    return (
        <section id="ai-projects" style={{ padding: '4rem 0' }}>
            <div className="container">
                <div className="section-header" style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--text-muted)',
                        marginBottom: '0.5rem'
                    }}>
                        {dict.aiProjects.sectionTitle}
                    </h2>
                    <p style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: 0
                    }}>
                        {dict.aiProjects.sectionHeading}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {dict.aiProjects.sectionDescription}
                    </p>
                </div>

                <div>
                    {aiProjects.map((project) => (
                        <AIProjectCard key={project.title} {...project} labels={dict.aiProjects.labels} />
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link href="/notes" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                        {dict.aiProjects.readNotes}
                    </Link>
                </div>
            </div>
        </section>
    );
}
