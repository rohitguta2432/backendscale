import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata = {
    title: "Projects | Rohit Raj",
    description: "Active projects and systems being built — CommCheck Processor, TripSmart AI, and more.",
};

export default function ProjectsPage() {
    const activeProjects = projects.filter((p) => p.status === "active");
    const iteratingProjects = projects.filter((p) => p.status === "iterating");
    const pausedProjects = projects.filter((p) => p.status === "paused");

    return (
        <>
            <Header />
            <main id="main">
                <div className="page-header">
                    <div className="container">
                        <h1 className="page-title">Projects</h1>
                        <p className="page-description">
                            Systems I&apos;m actively building, iterating on, or have paused.
                        </p>
                    </div>
                </div>

                <section>
                    <div className="container">
                        {activeProjects.length > 0 && (
                            <>
                                <div className="section-header">
                                    <h2 className="section-title">Active</h2>
                                    <p className="section-description">Currently in development or production.</p>
                                </div>
                                <div className="project-grid">
                                    {activeProjects.map((project) => (
                                        <ProjectCard key={project.slug} project={project} />
                                    ))}
                                </div>
                            </>
                        )}

                        {iteratingProjects.length > 0 && (
                            <>
                                <div className="divider" />
                                <div className="section-header">
                                    <h2 className="section-title">Iterating</h2>
                                    <p className="section-description">Refining based on feedback or new requirements.</p>
                                </div>
                                <div className="project-grid">
                                    {iteratingProjects.map((project) => (
                                        <ProjectCard key={project.slug} project={project} />
                                    ))}
                                </div>
                            </>
                        )}

                        {pausedProjects.length > 0 && (
                            <>
                                <div className="divider" />
                                <div className="section-header">
                                    <h2 className="section-title">Paused</h2>
                                    <p className="section-description">On hold, may revisit later.</p>
                                </div>
                                <div className="project-grid">
                                    {pausedProjects.map((project) => (
                                        <ProjectCard key={project.slug} project={project} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
