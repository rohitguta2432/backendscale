import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function CurrentWork() {
    return (
        <section id="current-work">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Current Work</h2>
                    <p className="section-description">
                        Active projects and systems I&apos;m building or maintaining.
                    </p>
                </div>
                <div className="project-grid">
                    {projects.map((project) => (
                        <ProjectCard key={project.slug} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
