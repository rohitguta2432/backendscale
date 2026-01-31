const problems = [
    {
        icon: "🤔",
        title: "AI Confusion",
        description: "Not sure where to start with AI? We cut through the hype and build what actually works.",
    },
    {
        icon: "🔌",
        title: "Integration Headaches",
        description: "Struggling to integrate LLMs into your product? We make it seamless and production-ready.",
    },
    {
        icon: "🐢",
        title: "Slow Development",
        description: "Traditional development taking too long? AI-assisted workflows deliver 10x faster.",
    },
    {
        icon: "🏚️",
        title: "Legacy Systems",
        description: "Outdated tech holding you back? We modernize with AI capabilities built-in.",
    },
    {
        icon: "📈",
        title: "Scaling Challenges",
        description: "Can't handle growth? We build infrastructure that scales from MVP to millions.",
    },
];

export default function Problems() {
    return (
        <section id="problems" style={{ position: "relative" }}>
            <div className="divider" />
            <div className="gradient-orb orb-2" />

            <div className="container" style={{ paddingTop: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <span className="section-label">Challenges</span>
                    <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>Problems We Solve</h2>
                    <p style={{ maxWidth: "550px", margin: "0 auto", fontSize: "1.125rem" }}>
                        Complex challenges require cutting-edge solutions. Here&apos;s what we tackle.
                    </p>
                </div>

                <div className="grid grid-5">
                    {problems.map((problem, index) => (
                        <div key={index} className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
                            <span style={{ fontSize: "2rem", display: "block", marginBottom: "1rem" }}>{problem.icon}</span>
                            <h3 style={{ color: "var(--text-primary)", fontSize: "1rem", marginBottom: "0.5rem" }}>
                                {problem.title}
                            </h3>
                            <p style={{ fontSize: "0.8125rem", margin: 0, lineHeight: 1.5, color: "var(--text-secondary)" }}>
                                {problem.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
