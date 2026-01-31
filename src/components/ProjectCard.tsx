import Link from "next/link";
import StatusBadge from "./StatusBadge";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <article className="project-card">
            <div className="project-card-header">
                <h3 className="project-name">{project.name}</h3>
                <StatusBadge status={project.status} />
            </div>
            <p className="project-problem">{project.problem}</p>
            <div className="project-tags">
                {project.techStack.map((tech) => (
                    <span key={tech} className="tag">
                        {tech}
                    </span>
                ))}
            </div>
            <div className="project-links">
                <Link href={`/projects/${project.slug}`} className="project-link">
                    Details →
                </Link>
                {project.repoUrl && (
                    <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                    >
                        Repo ↗
                    </a>
                )}
            </div>
        </article>
    );
}
