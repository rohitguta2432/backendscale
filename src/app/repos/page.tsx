import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { repos } from "@/data/projects";

export const metadata = {
    title: "Repositories | Rohit Raj",
    description: "Curated list of repositories with context for why each exists.",
};

export default function ReposPage() {
    return (
        <>
            <Header />
            <main id="main">
                <div className="page-header">
                    <div className="container">
                        <h1 className="page-title">Repositories</h1>
                        <p className="page-description">
                            Curated list of repositories — not a dump, but context for why each exists.
                        </p>
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
            <Footer />
        </>
    );
}
