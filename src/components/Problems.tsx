const problems = [
    {
        icon: "🚀",
        title: "New Product Development",
        description: "Bring your vision to life with end-to-end development from concept to launch.",
    },
    {
        icon: "⚡",
        title: "Performance Issues",
        description: "Slow systems impacting your business? I identify and eliminate bottlenecks.",
    },
    {
        icon: "🔧",
        title: "Legacy Modernization",
        description: "Transform outdated systems into modern, maintainable architectures.",
    },
    {
        icon: "📈",
        title: "Scaling Challenges",
        description: "Prepare your infrastructure to handle growth without breaking.",
    },
    {
        icon: "🤖",
        title: "AI Integration",
        description: "Add intelligent capabilities to your existing products and workflows.",
    },
];

export default function Problems() {
    return (
        <section id="problems" style={{ position: "relative" }}>
            <div className="divider" />
            <div className="gradient-orb orb-2" />

            <div className="container" style={{ paddingTop: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="section-label">How I Help</span>
                    <h2>Problems I Solve</h2>
                    <p style={{ maxWidth: "600px", margin: "0 auto" }}>
                        Whether you&apos;re starting fresh or fixing what&apos;s broken,
                        I bring the expertise to move your project forward.
                    </p>
                </div>

                <div className="grid grid-5">
                    {problems.map((problem, index) => (
                        <div key={index} className="card" style={{ textAlign: "center" }}>
                            <div
                                className="card-icon"
                                style={{
                                    margin: "0 auto 1rem",
                                    fontSize: "1.5rem",
                                    background: "transparent",
                                    border: "none",
                                }}
                            >
                                {problem.icon}
                            </div>
                            <h3 style={{ color: "var(--text-primary)", fontSize: "1rem" }}>
                                {problem.title}
                            </h3>
                            <p style={{ fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
                                {problem.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
