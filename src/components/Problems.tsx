const problems = [
    {
        icon: "🤖",
        title: "AI Integration Confusion",
        description: "Not sure how to integrate AI into your product? I make it seamless and practical.",
    },
    {
        icon: "🧠",
        title: "LLM Implementation",
        description: "Need ChatGPT, Claude, or custom AI models? I build intelligent, reliable solutions.",
    },
    {
        icon: "⚡",
        title: "Slow Development",
        description: "AI-assisted development speeds up delivery by 10x without sacrificing quality.",
    },
    {
        icon: "🔧",
        title: "Legacy Modernization",
        description: "Upgrade old systems with AI capabilities and modern cloud-native architecture.",
    },
    {
        icon: "📈",
        title: "Scaling Challenges",
        description: "Build infrastructure that scales from MVP to millions of users effortlessly.",
    },
];

export default function Problems() {
    return (
        <section id="problems" style={{ position: "relative" }}>
            <div className="divider" />
            <div className="gradient-orb orb-2" />

            <div className="container" style={{ paddingTop: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="section-label">Challenges We Solve</span>
                    <h2>Problems I Solve</h2>
                    <p style={{ maxWidth: "600px", margin: "0 auto" }}>
                        Leveraging AI and cutting-edge technology to solve complex business challenges
                        that traditional approaches can&apos;t handle.
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
