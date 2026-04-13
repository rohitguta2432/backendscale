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
        <article className="border border-[var(--border)] p-6 bg-[var(--card-bg)] mb-6">
            {/* Project Screenshot */}
            {image && (
                <div className="mb-6 rounded-lg overflow-hidden border border-[var(--border)] shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                    <img
                        src={image}
                        alt={`${title} screenshot`}
                        className="w-full h-auto block"
                    />
                </div>
            )}
            <div className="flex justify-between items-start mb-4">
                <h3 className="m-0 text-xl font-semibold">{title}</h3>
                <span
                    className="text-white py-0.5 px-2 rounded-sm text-[0.7rem] font-mono uppercase"
                    style={{ backgroundColor: statusColors[status] }}
                >
                    {status}
                </span>
            </div>

            <div className="mb-4">
                <h4 className="text-[0.8rem] text-[var(--accent)] uppercase tracking-[0.05em] mb-1">
                    {labels.problem}
                </h4>
                <p className="m-0 text-[var(--text-secondary)] leading-relaxed">
                    {problem}
                </p>
            </div>

            <div className="mb-4">
                <h4 className="text-[0.8rem] text-[var(--status-active)] uppercase tracking-[0.05em] mb-1">
                    {labels.solution}
                </h4>
                <p className="m-0 text-[var(--text-secondary)] leading-relaxed">
                    {solution}
                </p>
            </div>

            <div className="mb-4">
                <h4 className="text-[0.8rem] text-[var(--text-muted)] uppercase tracking-[0.05em] mb-1">
                    {labels.aiApproach}
                </h4>
                <p className="m-0 text-[var(--text-secondary)] leading-relaxed italic">
                    {aiApproach}
                </p>
            </div>

            <div className="mb-4">
                <h4 className="text-[0.8rem] text-[var(--text-muted)] uppercase tracking-[0.05em] mb-2">
                    {labels.techStack}
                </h4>
                <div className="flex gap-2 flex-wrap">
                    {techStack.map((tech) => (
                        <code key={tech} className="text-[0.8rem] bg-[var(--bg-color)] py-1 px-2 border border-[var(--border)]">
                            {tech}
                        </code>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
                <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--accent)]"
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
        <section id="ai-projects" className="py-16">
            <div className="container">
                <div className="section-header mb-8">
                    <h2 className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-2">
                        {dict.aiProjects.sectionTitle}
                    </h2>
                    <p className="text-2xl font-semibold text-[var(--text-primary)] m-0">
                        {dict.aiProjects.sectionHeading}
                    </p>
                    <p className="text-[var(--text-secondary)] mt-2">
                        {dict.aiProjects.sectionDescription}
                    </p>
                </div>

                <div>
                    {aiProjects.map((project) => (
                        <AIProjectCard key={project.title} {...project} labels={dict.aiProjects.labels} />
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link href="/notes" className="text-[var(--accent)] text-[0.9rem]">
                        {dict.aiProjects.readNotes}
                    </Link>
                </div>
            </div>
        </section>
    );
}
